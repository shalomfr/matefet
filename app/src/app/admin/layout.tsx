import AdminSidebar from "@/components/AdminSidebar";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="admin-ecoursie min-h-screen relative z-[1]">
      <AdminSidebar />
      <main className="admin-main mr-60 p-8 min-h-screen overflow-y-auto">{children}</main>
    </div>
  );
}
