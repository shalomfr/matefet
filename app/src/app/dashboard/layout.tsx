import Sidebar from "@/components/Sidebar";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen relative z-[1]">
      <Sidebar />
      <main className="mr-60 p-8 min-h-screen overflow-y-auto">{children}</main>
    </div>
  );
}
