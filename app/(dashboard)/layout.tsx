import { BottomNav } from "@/components/mobile/BottomNav";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="mx-auto min-h-screen w-full max-w-3xl bg-slate-50 pb-24">
      <main className="px-4 py-4">{children}</main>
      <BottomNav />
    </div>
  );
}

