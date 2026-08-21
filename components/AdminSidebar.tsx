'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut } from 'next-auth/react';
import {
  LayoutDashboard,
  FolderTree,
  Package,
  Warehouse,
  ShoppingBag,
  Ticket,
  Settings,
  Sparkles,
  ShieldCheck,
  LogOut,
} from 'lucide-react';

const menuItems = [
  {
    label: 'Dashboard',
    href: '/admin/dashboard',
    icon: LayoutDashboard,
  },
  {
    label: 'Categories',
    href: '/admin/categories',
    icon: FolderTree,
  },
  {
    label: 'Products',
    href: '/admin/products',
    icon: Package,
  },
  {
    label: 'Inventory',
    href: '/admin/inventory',
    icon: Warehouse,
  },
  {
    label: 'Orders',
    href: '/admin/orders',
    icon: ShoppingBag,
  },
  {
    label: 'Coupons',
    href: '/admin/coupons',
    icon: Ticket,
  },
  {
    label: 'Settings',
    href: '/admin/settings',
    icon: Settings,
  },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="sticky top-0 h-screen w-64 shrink-0 border-r border-[#E9EDF7] bg-white hidden lg:flex flex-col z-20">
      {/* Brand Header */}
      <div className="flex h-20 items-center justify-between border-b border-[#E9EDF7] px-6 shrink-0">
        <Link href="/admin/dashboard" className="flex items-center gap-3 group">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#6366F1] to-[#4F46E5] text-white shadow-md shadow-indigo-500/25 transition-transform group-hover:scale-105">
            <Sparkles className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-lg font-extrabold tracking-tight text-[#0F172A]">
                NexCart
              </span>
              <span className="rounded-md bg-indigo-50 px-1.5 py-0.5 text-[10px] font-bold tracking-wider text-[#6366F1] border border-indigo-200">
                ADMIN
              </span>
            </div>
            <p className="text-[11px] font-medium text-[#707EAE]">
              Management Portal
            </p>
          </div>
        </Link>
      </div>

      {/* Navigation Menu & Fixed Bottom Section */}
      <div className="flex flex-col justify-between p-4 flex-1 overflow-y-auto">
        <nav className="space-y-1.5">
          <p className="px-4 pb-2 text-[11px] font-bold tracking-wider text-[#A3AED0] uppercase">
            Main Menu
          </p>
          {menuItems.map((item) => {
            const Icon = item.icon;
            const active =
              pathname === item.href || pathname.startsWith(`${item.href}/`);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition-all duration-200 ${
                  active
                    ? 'bg-gradient-to-r from-[#6366F1] to-[#4F46E5] text-white shadow-lg shadow-indigo-500/30'
                    : 'text-[#64748B] hover:bg-[#F8FAFC] hover:text-[#6366F1]'
                }`}
              >
                <Icon
                  className={`h-5 w-5 shrink-0 transition-colors ${
                    active ? 'text-white' : 'text-[#64748B]'
                  }`}
                />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Fixed Bottom Section: Security Badge & Logout Button */}
        <div className="space-y-3 pt-4 border-t border-[#E9EDF7] mt-auto shrink-0">
          <div className="rounded-xl border border-indigo-100 bg-gradient-to-b from-indigo-50/50 to-white p-3">
            <div className="flex items-center gap-2.5">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-100 text-[#6366F1]">
                <ShieldCheck className="h-3.5 w-3.5" />
              </div>
              <div>
                <p className="text-xs font-bold text-[#0F172A]">Enterprise SSL</p>
                <p className="text-[10px] text-[#707EAE]">v2.4 Secure Active</p>
              </div>
            </div>
          </div>

          <button
            onClick={() =>
              signOut({
                callbackUrl: '/admin/login',
              })
            }
            className="flex w-full items-center cursor-pointer gap-3 rounded-xl border border-red-200 bg-red-50/60 px-4 py-2.5 text-sm font-semibold text-red-600 transition-all hover:bg-red-600 hover:text-white shadow-sm"
          >
            <LogOut className="h-4 w-4 shrink-0" />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </aside>
  );
}