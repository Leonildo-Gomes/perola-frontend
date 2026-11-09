import {
  PublicBottomNav,
  SiteFooter,
  SiteHeader,
  type SiteHeaderLink,
} from "@/components/shared/navigation";
import { MarketplaceToolbar } from "@/features/marketplace/components";

const HEADER_LINKS: SiteHeaderLink[] = [
  { href: "/register", label: "Para Profissionais" },
  { href: "/my-bookings", label: "Minhas Marcações" },
];

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      <SiteHeader links={HEADER_LINKS} />
      <MarketplaceToolbar />
      <div className="flex-1 pb-16 md:pb-0">{children}</div>
      <SiteFooter />
      <PublicBottomNav />
    </div>
  );
}
