import AdminSidebar from "@/components/AdminSidebar";
import "@/styles/portal.css";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div data-theme="portal" className="portal-root min-h-screen relative z-[1]" style={{ background: "#f8f9fc" }}>
      <AdminSidebar />
      <main className="mr-60 min-h-screen overflow-y-auto">{children}</main>
    </div>
  );
}
