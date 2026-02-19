import AdminSidebar from "@/components/AdminSidebar";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen">
      <AdminSidebar />
      <main className="mr-60 min-h-screen overflow-y-auto">{children}</main>
    </div>
  );
}
