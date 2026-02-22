import PortalSidebar from "@/components/PortalSidebar";
import "@/styles/portal.css";
import { TourProvider } from "@/components/tour/TourContext";
import OnboardingTour from "@/components/tour/OnboardingTour";
import { portalTourSteps } from "@/components/tour/tourSteps";

export default function PortalLayout({ children }: { children: React.ReactNode }) {
  return (
    <TourProvider tourId="portal" steps={portalTourSteps}>
      <div data-theme="portal" className="portal-root min-h-screen">
        <PortalSidebar />
        <main className="md:mr-60 min-h-screen overflow-y-auto pt-16 md:pt-6">{children}</main>
        <OnboardingTour />
      </div>
    </TourProvider>
  );
}
