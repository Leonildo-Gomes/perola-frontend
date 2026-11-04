import Link from "next/link";
import { AuthAction } from "@/components/common/auth-action";
import { Logo } from "@/components/common/logo";
import { MobileBottomNav } from "@/components/common/mobile-bottom-nav";
import { LocationSelector } from "@/components/marketplace/location-selector";

const DESKTOP_LINKS = [
  { href: "/explore", label: "Explorar" },
  { href: "/my-bookings", label: "As minhas marcações" },
];

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-6xl items-center gap-2 px-4">
          <Logo />
          <nav aria-label="Navegação" className="ml-6 hidden items-center gap-1 md:flex">
            {DESKTOP_LINKS.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="inline-flex min-h-[44px] items-center rounded-xl px-3 text-sm font-medium text-slate-700 hover:bg-slate-100"
              >
                {l.label}
              </Link>
            ))}
          </nav>
          <div className="ml-auto flex items-center gap-1">
            <LocationSelector />
            <AuthAction />
          </div>
        </div>
      </header>
      <div className="flex-1 pb-16 md:pb-0">{children}</div>
      <MobileBottomNav />
    </div>
  );
}
