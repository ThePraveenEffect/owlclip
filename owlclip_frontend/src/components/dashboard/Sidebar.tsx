'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Scissors,
  CreditCard,
  Clock,
  Settings,
  LogOut,
  Flame,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import {useRouter} from 'next/navigation';
import {apiClient} from '@/lib/api/client';
import { env } from '@/config/env';

const navItems = [
  { label: 'Overview', href: '/dashboard', icon: LayoutDashboard },
  { label: 'My Clips', href: '/dashboard/clips', icon: Scissors },
  { label: 'Billing', href: '/dashboard/billing', icon: CreditCard },
  // { label: 'Usage', href: '/dashboard/usage', icon: Clock },
  // { label: 'Settings', href: '/dashboard/settings', icon: Settings },
];

export default function Sidebar() {

  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const pathname = usePathname();
  const router = useRouter();

const handleLogout = async () => {
    try {
        await fetch(
            `${env.BASE_URL}/v1/auth/logout`,
            {
                method: "POST",
                credentials: "include",
            }
        );
    } catch (e) {
        console.error(e);
    } finally {
        window.location.href = "/";
    }
};
  return (
    <aside className="w-64 min-h-screen border-r border-border bg-card flex flex-col">
      {/* Brand */}
      <div className="px-6 pt-8 pb-6">
        <Link href="/" className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-orange-500 flex items-center justify-center">
            <Flame className="w-5 h-5 text-white" strokeWidth={2.5} />
          </div>
          <span className="text-xl font-bold text-foreground tracking-tight">OwlClip</span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150',
                isActive
                  ? 'bg-orange-500/10 text-orange-500'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              )}
            >
              <Icon className="w-[18px] h-[18px]" strokeWidth={isActive ? 2.5 : 2} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* User section */}
      <div className="px-3 pb-6">
        <div className="border-t border-border pt-4">
          <div className="flex items-center gap-3 px-3 py-2.5">
            {/* <div className="w-9 h-9 rounded-full bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center text-white text-sm font-bold">
              C
            </div> */}
            <div className="flex-1 min-w-0">
              <p className="text-md mx-7 font-medium text-foreground truncate">CodeVeen</p>
              {/* <p className="text-xs text-muted-foreground truncate">Creator Plan</p> */}
            </div>
            <button
  onClick={() => setShowLogoutModal(true)}
  className="p-1.5 rounded-lg hover:bg-red-500 text-muted-foreground hover:text-foreground transition"
>
  <LogOut className="w-6 h-6" />
</button>

{showLogoutModal && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
    <div className="w-[90%] max-w-sm rounded-xl bg-background border border-border shadow-xl p-6">
      <h2 className="text-xl font-semibold">
        Sign Out
      </h2>

      <p className="mt-2 text-sm text-muted-foreground">
        Are you sure you want to sign out?
      </p>

      <div className="mt-6 flex justify-end gap-3">
        <button
          onClick={() => setShowLogoutModal(false)}
          className="rounded-lg border border-border px-4 py-2 hover:bg-muted transition"
        >
          No
        </button>

        <button
          onClick={async () => {
            setShowLogoutModal(false);
            await handleLogout();
          }}
          className="rounded-lg bg-red-600 px-4 py-2 text-white hover:bg-red-700 transition"
        >
          Yes
        </button>
      </div>
    </div>
  </div>
)}
          </div>
        </div>
      </div>
    </aside>  

    

    
  );
}
