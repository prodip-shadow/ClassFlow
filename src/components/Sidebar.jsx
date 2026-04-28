'use client';

import Link from 'next/link';
import { memo, useCallback, useMemo } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import {
  HiOutlineSquares2X2,
  HiOutlineCalendarDays,
  HiOutlineBookmarkSquare,
  HiOutlineArrowRightOnRectangle,
  HiOutlinePlusCircle,
} from 'react-icons/hi2';
import { useAuth } from '@/contexts/AuthContext';

const teacherNav = [
  {
    label: 'Overview',
    href: '/teacher/dashboard',
    Icon: HiOutlineSquares2X2,
  },
  {
    label: 'Add Slot',
    href: '/teacher/dashboard/add',
    Icon: HiOutlinePlusCircle,
  },
  {
    label: 'My Slots',
    href: '/teacher/dashboard/slots',
    Icon: HiOutlineCalendarDays,
  },
];

const studentNav = [
  {
    label: 'Overview',
    href: '/student/dashboard',
    Icon: HiOutlineSquares2X2,
  },
  {
    label: 'Available',
    href: '/student/dashboard/available',
    Icon: HiOutlineCalendarDays,
  },
  {
    label: 'My Bookings',
    href: '/student/dashboard/bookings',
    Icon: HiOutlineBookmarkSquare,
  },
];

const SidebarItem = memo(({ label, href, Icon, active }) => (
  <Link
    href={href}
    className={`flex items-center gap-3 px-3 py-2.5 rounded-md transition-all duration-200 ${
      active
        ? 'bg-primary text-primary-content font-semibold shadow-md'
        : 'hover:bg-base-300 text-base-content/80'
    }`}
  >
    <Icon className="w-5 h-5" />
    <span>{label}</span>
  </Link>
));

SidebarItem.displayName = 'SidebarItem';

export function Sidebar() {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  const items = useMemo(
    () => (user?.role === 'teacher' ? teacherNav : studentNav),
    [user?.role],
  );

  const handleLogout = useCallback(async () => {
    await logout();
    router.push('/');
  }, [logout, router]);

  if (!user) return null;

  return (
    <>
      <aside className="hidden lg:flex w-64 shrink-0 flex-col bg-base-200 border-r border-base-300 sticky top-16 h-[calc(100vh-4rem)] py-6 px-3">
        <div className="px-3 mb-6">
          <p className="text-xs uppercase tracking-widest text-muted font-semibold">
            {user.role === 'teacher' ? 'Teacher' : 'Student'}
          </p>
          <p
            className="font-heading font-semibold truncate mt-1"
            title={user.name}
          >
            {user.name}
          </p>
        </div>
        <nav className="flex flex-col gap-1 flex-1">
          {items.map(({ label, href, Icon }) => {
            const active = pathname === href;
            return (
              <SidebarItem
                key={href}
                label={label}
                href={href}
                Icon={Icon}
                active={active}
              />
            );
          })}
        </nav>
      </aside>

      <div className="lg:hidden fixed bottom-0 inset-x-0 z-40 border-t border-base-300 bg-base-200/95 backdrop-blur-md">
        <nav className="grid grid-cols-3 gap-1 px-2 py-2">
          {items.map(({ label, href, Icon }) => {
            const active = pathname === href;
            return (
              <Link
                key={`mobile-${href}`}
                href={href}
                className={`flex flex-col items-center justify-center gap-1 rounded-md py-2 text-xs transition-colors ${
                  active
                    ? 'bg-primary text-primary-content font-semibold'
                    : 'text-base-content/75 hover:bg-base-300'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="leading-none">{label}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </>
  );
}

export default memo(Sidebar);
