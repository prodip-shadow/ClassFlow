'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  updateProfile,
} from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { api } from '@/lib/api';

const AuthContext = createContext(undefined);

async function establishSession(firebaseUser) {
  const idToken = await firebaseUser.getIdToken();
  await api.post('/auth/session', { idToken });
}

async function fetchAppUser() {
  try {
    const { data } = await api.get('/users');
    return data;
  } catch {
    return null;
  }
}

async function upsertAppUser(payload) {
  const { data } = await api.post('/users', payload);
  return data;
}

export function AuthProvider({ children }) {
  const [firebaseUser, setFirebaseUser] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!auth) {
      setLoading(false);
      return undefined;
    }

    const unsub = onAuthStateChanged(auth, async (fu) => {
      setFirebaseUser(fu);
      if (fu?.email) {
        try {
          await establishSession(fu);
          const existing = await fetchAppUser();
          setUser(existing);
        } catch {
          setUser(null);
        }
      } else {
        try {
          await api.post('/auth/logout');
        } catch {
          // no-op
        }
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsub();
  }, []);

  const login = async (email, password) => {
    if (!auth) {
      throw new Error('Firebase is not configured');
    }

    const cred = await signInWithEmailAndPassword(auth, email, password);
    const fu = cred.user;
    await establishSession(fu);
    const existing = await fetchAppUser();
    if (!existing) {
      throw new Error(
        'Account exists in auth but not in our records. Please contact support.',
      );
    }
    setUser(existing);
    return existing;
  };

  const register = async (name, email, password, role) => {
    if (!auth) {
      throw new Error('Firebase is not configured');
    }

    const cred = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(cred.user, { displayName: name });
    await establishSession(cred.user);
    const created = await upsertAppUser({
      name,
      email,
      photoURL: '',
      role,
    });
    setUser(created);
    return created;
  };

  const logout = async () => {
    if (!auth) return;

    try {
      await api.post('/auth/logout');
    } catch {
      // no-op
    }
    await signOut(auth);
    setUser(null);
    setFirebaseUser(null);
  };

  const refreshUser = async () => {
    if (firebaseUser?.email) {
      await establishSession(firebaseUser);
      const fresh = await fetchAppUser();
      setUser(fresh);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        firebaseUser,
        user,
        loading,
        login,
        register,
        logout,
        refreshUser,
        setUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
