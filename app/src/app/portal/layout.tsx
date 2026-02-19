import PortalSidebar from "@/components/PortalSidebar";
import "@/styles/portal.css";

export default function PortalLayout({ children }: { children: React.ReactNode }) {
  return (
    <div data-theme="portal" className="portal-root min-h-screen">
      <PortalSidebar />
      <main className="mr-60 min-h-screen overflow-y-auto">{children}</main>
    </div>
  );
}
