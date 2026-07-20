export default function PrintLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  // Chrome-free: no dashboard sidebar. White background for print fidelity.
  return <div className="min-h-screen bg-white text-navy">{children}</div>;
}
