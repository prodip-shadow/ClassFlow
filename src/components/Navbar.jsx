'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import {
  HiOutlineUserCircle,
  HiOutlineArrowRightOnRectangle,
} from 'react-icons/hi2';
import { useAuth } from '@/contexts/AuthContext';

export function Navbar() {
  const { user, firebaseUser, logout } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.push('/');
  };

  return (
    <div className="navbar bg-base-200 border-b border-base-300 px-4 sm:px-8 sticky top-0 z-40 backdrop-blur-md bg-opacity-80">
      <div className="flex-1">
        <Link
          href="/"
          className="flex items-center gap-2 text-xl font-heading font-bold"
        >
          <span className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-primary-content font-bold">
            C
          </span>
          <span>
            Class<span className="text-primary">Flow</span>
          </span>
        </Link>
      </div>
      <div className="flex-none gap-2">
        {user || firebaseUser ? (
          <>
            <Link
              href={
                user?.role === 'teacher'
                  ? '/teacher/dashboard/profile'
                  : '/student/dashboard/profile'
              }
              className="btn btn-ghost btn-sm hidden sm:inline-flex"
            >
              Profile
            </Link>
            <div className="dropdown dropdown-end">
              <div
                tabIndex={0}
                role="button"
                className="btn btn-ghost btn-circle avatar"
              >
                <div className="w-10 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2 overflow-hidden">
                  {user?.photoURL ? (
                    <Image
                      src={user.photoURL}
                      alt={user.name}
                      width={40}
                      height={40}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-base-300 flex items-center justify-center">
                      <HiOutlineUserCircle className="w-7 h-7 text-muted" />
                    </div>
                  )}
                </div>
              </div>
              <ul
                tabIndex={0}
                className="menu menu-sm dropdown-content mt-3 z-[60] p-2 shadow-lg bg-base-200 border border-base-300 rounded-box w-56"
              >
                {user && (
                  <li className="menu-title">
                    <span className="text-base-content">{user.name}</span>
                    <span className="text-muted text-xs capitalize">
                      {user.role}
                    </span>
                  </li>
                )}
                <li>
                  <Link
                    href={
                      user?.role === 'teacher'
                        ? '/teacher/dashboard/profile'
                        : '/student/dashboard/profile'
                    }
                  >
                    <HiOutlineUserCircle className="w-4 h-4" />
                    Profile
                  </Link>
                </li>
                <li>
                  <button onClick={handleLogout} className="text-error">
                    <HiOutlineArrowRightOnRectangle className="w-4 h-4" />
                    Log out
                  </button>
                </li>
              </ul>
            </div>
          </>
        ) : (
          <Link href="/" className="btn btn-primary btn-sm">
            Sign in
          </Link>
        )}
      </div>
    </div>
  );
}
