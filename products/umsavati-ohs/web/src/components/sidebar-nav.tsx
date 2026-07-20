'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Activity,
  Bot,
  Building2,
  FileOutput,
  Files,
  Gauge,
  GraduationCap,
  HardHat,
  Settings,
  ShieldAlert,
  UserCheck,
} from 'lucide-react';
import { cn } from '@/lib/utils';

// The 11 documented Umsavati OS pages (CLAUDE.md §2.1).
const NAV = [
  { href: '/', label: 'Dashboard', icon: Gauge },
  { href: '/organisations', label: 'Organisations', icon: Building2 },
  { href: '/appointments', label: 'Appointments', icon: UserCheck },
  { href: '/documents', label: 'SafeFile Documents', icon: Files },
  { href: '/incidents', label: 'Incidents', icon: ShieldAlert },
  { href: '/contractors', label: 'Contractors', icon: HardHat },
  { href: '/training', label: 'Training', icon: GraduationCap },
  { href: '/physical-agents', label: 'Physical Agents', icon: Activity },
  { href: '/safefile', label: 'SafeFile Generator', icon: FileOutput },
  { href: '/archon', label: 'ARCHON Command Centre', icon: Bot },
  { href: '/settings', label: 'Settings', icon: Settings },
] as const;

export function SidebarNav() {
  const pathname = usePathname();
  return (
    <nav className="flex flex-col gap-0.5">
      {NAV.map(({ href, label, icon: Icon }) => {
        const active = pathname === href;
        return (
          <Link
            key={href}
            href={href}
            className={cn(
              'flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors',
              active
                ? 'bg-gold/15 font-medium text-gold'
                : 'text-bone/70 hover:bg-bone/5 hover:text-bone',
            )}
          >
            <Icon className="h-4 w-4 shrink-0" aria-hidden />
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
