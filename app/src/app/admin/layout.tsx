import AdminSidebar from "@/components/AdminSidebar";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen">
      <AdminSidebar />
      <main className="md:mr-60 min-h-screen overflow-y-auto pt-16 md:pt-0">{children}</main>
    </div>
  );
}
