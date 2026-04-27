'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import gsap from 'gsap';
import {
  HiOutlineCalendarDays,
  HiOutlineBookmarkSquare,
  HiOutlineSparkles,
  HiOutlineEnvelope,
  HiOutlineLockClosed,
  HiOutlineUserCircle,
  HiOutlineAcademicCap,
  HiOutlineUserGroup,
} from 'react-icons/hi2';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/Toast';

export function LandingPage() {
  const { user, loading, login, register } = useAuth();
  const { toast } = useToast();
  const router = useRouter();
  const heroRef = useRef(null);
  const formRef = useRef(null);
  const featuresRef = useRef(null);

  const [mode, setMode] = useState('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('student');
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (loading) return;
    if (user) {
      router.replace(
        user.role === 'teacher' ? '/teacher/dashboard' : '/student/dashboard',
      );
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (!heroRef.current) return;
    const ctx = gsap.context(() => {
      gsap.from(heroRef.current.querySelectorAll('[data-hero]'), {
        opacity: 0,
        y: 24,
        duration: 0.8,
        stagger: 0.1,
        ease: 'power3.out',
      });
      if (formRef.current) {
        gsap.from(formRef.current, {
          opacity: 0,
          y: 24,
          duration: 0.8,
          delay: 0.3,
          ease: 'power3.out',
        });
      }
      if (featuresRef.current) {
        gsap.from(featuresRef.current.querySelectorAll('[data-feature]'), {
          opacity: 0,
          y: 30,
          duration: 0.7,
          stagger: 0.12,
          delay: 0.5,
          ease: 'power2.out',
        });
      }
    });

    return () => ctx.revert();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setBusy(true);
    try {
      if (mode === 'login') {
        const u = await login(email.trim(), password);
        toast(`Welcome back, ${u.name}.`, 'success');
      } else {
        if (!name.trim()) {
          toast('Please enter your name.', 'error');
          setBusy(false);
          return;
        }
        const u = await register(name.trim(), email.trim(), password, role);
        toast(`Welcome to ClassFlow, ${u.name}.`, 'success');
      }
    } catch (err) {
      const code = err?.code;
      const map = {
        'auth/invalid-email': 'Please enter a valid email.',
        'auth/user-not-found': 'No account found for that email.',
        'auth/wrong-password': 'Incorrect password.',
        'auth/invalid-credential': 'Incorrect email or password.',
        'auth/email-already-in-use':
          'An account with this email already exists.',
        'auth/weak-password': 'Password must be at least 6 characters.',
      };
      const message = code && map[code] ? map[code] : err?.message;
      toast(message || 'Something went wrong.', 'error');
    } finally {
      setBusy(false);
    }
  };

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-8 pt-12 pb-20">
      <div className="grid lg:grid-cols-2 gap-12 items-center">
        <div ref={heroRef}>
          <div
            data-hero
            className="badge badge-outline border-primary text-primary gap-1 py-3 px-3 mb-5"
          >
            <HiOutlineSparkles className="w-3.5 h-3.5" /> Mini Class Scheduling
          </div>
          <h1
            data-hero
            className="font-heading text-4xl sm:text-5xl lg:text-6xl leading-tight"
          >
            Schedule classes in
            <br />
            15-minute <span className="text-primary">flow</span>.
          </h1>
          <p
            data-hero
            className="mt-5 text-base sm:text-lg text-muted max-w-xl"
          >
            ClassFlow lets teachers publish bite-sized open slots and students
            book them in a single click - clean, dark, and fast.
          </p>
          <div data-hero className="mt-7 flex flex-wrap gap-3">
            <button
              onClick={() => {
                setMode('register');
                setRole('teacher');
                document
                  .getElementById('auth-card')
                  ?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="btn btn-primary"
            >
              <HiOutlineAcademicCap className="w-5 h-5" />
              I&apos;m a teacher
            </button>
            <button
              onClick={() => {
                setMode('register');
                setRole('student');
                document
                  .getElementById('auth-card')
                  ?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="btn btn-outline"
            >
              <HiOutlineUserGroup className="w-5 h-5" />
              I&apos;m a student
            </button>
          </div>

          <div ref={featuresRef} className="grid sm:grid-cols-3 gap-4 mt-10">
            {[
              {
                Icon: HiOutlineCalendarDays,
                title: '15-min slots',
                body: 'Add open slots in seconds with built-in overlap and past-time guards.',
              },
              {
                Icon: HiOutlineBookmarkSquare,
                title: 'One-click book',
                body: 'Students grab available slots instantly - no page reloads.',
              },
              {
                Icon: HiOutlineUserCircle,
                title: 'Live profiles',
                body: 'Upload a photo, change your name, see updates everywhere.',
              },
            ].map(({ Icon, title, body }) => (
              <div
                key={title}
                data-feature
                className="card bg-base-200 border border-base-300"
              >
                <div className="card-body p-5">
                  <Icon className="w-6 h-6 text-primary" />
                  <p className="font-heading font-semibold mt-2">{title}</p>
                  <p className="text-sm text-muted">{body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div ref={formRef} id="auth-card">
          <div className="card bg-base-200 border border-base-300 shadow-2xl shadow-primary/5">
            <div className="card-body p-6 sm:p-8">
              <div className="tabs tabs-boxed bg-base-300 p-1 mb-5 self-center">
                <button
                  type="button"
                  className={`tab ${mode === 'login' ? 'tab-active !bg-primary text-primary-content' : ''}`}
                  onClick={() => setMode('login')}
                  data-testid="tab-login"
                >
                  Log in
                </button>
                <button
                  type="button"
                  className={`tab ${mode === 'register' ? 'tab-active !bg-primary text-primary-content' : ''}`}
                  onClick={() => setMode('register')}
                  data-testid="tab-register"
                >
                  Sign up
                </button>
              </div>
              <h2 className="font-heading text-2xl">
                {mode === 'login' ? 'Welcome back' : 'Create your account'}
              </h2>
              <p className="text-sm text-muted">
                {mode === 'login'
                  ? 'Pick up right where you left off.'
                  : 'It only takes a few seconds.'}
              </p>
              <form onSubmit={handleSubmit} className="mt-4 space-y-3">
                {mode === 'register' && (
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text flex items-center gap-1">
                        <HiOutlineUserCircle className="w-4 h-4" /> Full name
                      </span>
                    </label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Jane Doe"
                      className="input input-bordered bg-base-300 border-base-300 focus:border-primary"
                      data-testid="input-signup-name"
                    />
                  </div>
                )}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text flex items-center gap-1">
                      <HiOutlineEnvelope className="w-4 h-4" /> Email
                    </span>
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@school.edu"
                    className="input input-bordered bg-base-300 border-base-300 focus:border-primary"
                    data-testid="input-email"
                  />
                </div>
                <div className="form-control">
                  <label className="label">
                    <span className="label-text flex items-center gap-1">
                      <HiOutlineLockClosed className="w-4 h-4" /> Password
                    </span>
                  </label>
                  <input
                    type="password"
                    required
                    minLength={6}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="........"
                    className="input input-bordered bg-base-300 border-base-300 focus:border-primary"
                    data-testid="input-password"
                  />
                </div>
                {mode === 'register' && (
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">I am a</span>
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => setRole('student')}
                        className={`btn btn-sm justify-start ${
                          role === 'student'
                            ? 'btn-primary'
                            : 'btn-outline border-base-300 text-base-content'
                        }`}
                        data-testid="role-student"
                      >
                        <HiOutlineUserGroup className="w-4 h-4" /> Student
                      </button>
                      <button
                        type="button"
                        onClick={() => setRole('teacher')}
                        className={`btn btn-sm justify-start ${
                          role === 'teacher'
                            ? 'btn-primary'
                            : 'btn-outline border-base-300 text-base-content'
                        }`}
                        data-testid="role-teacher"
                      >
                        <HiOutlineAcademicCap className="w-4 h-4" /> Teacher
                      </button>
                    </div>
                  </div>
                )}
                <button
                  type="submit"
                  disabled={busy}
                  className="btn btn-primary w-full mt-2"
                  data-testid="submit-auth"
                >
                  {busy ? (
                    <>
                      <span className="loading loading-spinner loading-sm" />
                      {mode === 'login'
                        ? 'Signing in...'
                        : 'Creating account...'}
                    </>
                  ) : mode === 'login' ? (
                    'Log in'
                  ) : (
                    'Create account'
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
