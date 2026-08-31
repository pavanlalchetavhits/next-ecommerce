'use client';

import { Bell, Shield } from 'lucide-react';

type AdminHeaderProps = {
  user: {
    id: string;
    name?: string | null;
    email?: string | null;
    role: string;
  };
};

export default function AdminHeader({ user }: AdminHeaderProps) {
  const userInitials =
    user.name
      ?.split(' ')
      .map((n) => n[0])
      .join('')
      .substring(0, 2)
      .toUpperCase() || 'AD';

  return (
    <header className="sticky top-0 z-30 flex h-20 shrink-0 items-center justify-end border-b border-[#E9EDF7] bg-white/90 backdrop-blur-md px-8 shadow-sm">
      {/* Right Side Actions & Profile */}
      <div className="flex items-center gap-4">
        {/* Notification Bell */}
        <button className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-[#E9EDF7] text-[#64748B] transition-all hover:border-[#CBD5E1] hover:bg-[#F8FAFC] hover:text-[#6366F1]">
          <Bell className="h-5 w-5" />
          <span className="absolute right-2.5 top-2.5 h-2 w-2 rounded-full bg-[#EF4444] ring-2 ring-white" />
        </button>

        <div className="h-8 w-px bg-[#E9EDF7]" />

        {/* User Info & Avatar */}
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#6366F1] to-[#4F46E5] text-sm font-bold text-white shadow-md shadow-indigo-500/20">
            {userInitials}
          </div>

          <div className="hidden text-left sm:block">
            <div className="flex items-center gap-1.5">
              <p className="text-sm font-bold text-[#0F172A]">
                {user.name || 'Administrator'}
              </p>
              <span className="flex items-center gap-1 rounded bg-indigo-50 px-1.5 py-0.5 text-[10px] font-bold text-[#6366F1]">
                <Shield className="h-2.5 w-2.5" />
                Admin
              </span>
            </div>
            <p className="text-xs text-[#707EAE]">{user.email}</p>
          </div>
        </div>
      </div>
    </header>
  );
}