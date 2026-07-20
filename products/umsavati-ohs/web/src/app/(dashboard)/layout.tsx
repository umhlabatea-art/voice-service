import { SidebarNav } from '@/components/sidebar-nav';

export default function DashboardLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="flex min-h-screen">
      <aside className="hidden w-64 shrink-0 flex-col bg-navy p-4 md:flex">
        <div className="mb-8 px-3 pt-2">
          <p className="font-display text-xl font-semibold text-bone">
            Umsavati <span className="text-gold">OS</span>
          </p>
          <p className="mt-0.5 font-mono text-[11px] tracking-wide text-bone/50">
            UMHLABATEA (PTY) LTD
          </p>
        </div>
        <SidebarNav />
        <div className="mt-auto px-3 pb-2">
          <p className="font-mono text-[10px] text-bone/40">
            OHS Act 85/1993 · POPIA-aligned
          </p>
        </div>
      </aside>
      <main className="min-w-0 flex-1 bg-bone p-6 md:p-10">{children}</main>
    </div>
  );
}
