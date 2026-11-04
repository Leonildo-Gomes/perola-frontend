import Link from "next/link";
import { AuthAction } from "@/components/common/auth-action";
import { Logo } from "@/components/common/logo";
import { PublicBottomNav } from "@/components/common/public-bottom-nav";
import { LocationSelector } from "@/components/marketplace/location-selector";
import { MarketplaceToolbar } from "@/components/marketplace/marketplace-toolbar";
import { SearchBar } from "@/components/marketplace/search-bar";

const DESKTOP_LINKS = [
  { href: "/register", label: "Para Profissionais" },
  { href: "/my-bookings", label: "Minhas Marcações" },
];

const FOOTER_LINKS = ["Sobre Nós", "Salões Parceiros", "Termos & Privacidade", "Apoio ao Cliente"];

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      <header className="sticky top-0 z-30 border-b border-slate-200 bg-white">
        {/* Desktop */}
        <div className="mx-auto hidden h-20 max-w-7xl items-center gap-6 px-4 md:flex">
          <Logo tagline="Cabo Verde" />
          <SearchBar
            submitButton
            className="h-14 max-w-2xl flex-1 border-slate-200 pl-3 shadow-sm"
            leading={
              <>
                <LocationSelector variant="inline" />
                <span aria-hidden className="h-6 w-px bg-slate-200" />
              </>
            }
          />
          <nav aria-label="Navegação" className="ml-auto flex items-center gap-1">
            {DESKTOP_LINKS.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="inline-flex min-h-[44px] items-center rounded-xl px-3 text-sm font-semibold text-slate-600 hover:text-perola-deep"
              >
                {l.label}
              </Link>
            ))}
            <AuthAction />
          </nav>
        </div>
        {/* Mobile */}
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-2 px-4 md:hidden">
          <LocationSelector variant="stacked" />
          <AuthAction />
        </div>
      </header>

      <MarketplaceToolbar />

      <div className="flex-1 pb-16 md:pb-0">{children}</div>

      <footer className="hidden border-t border-slate-200 bg-white md:block">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-4 py-8">
          <div className="flex items-center gap-4">
            <span className="font-display text-xl font-extrabold text-perola-deep">Pérola</span>
            <p className="max-w-xs text-xs text-slate-500">
              © {new Date().getFullYear()} Pérola Beleza & Bem-Estar Cabo Verde. Todos os direitos reservados.
            </p>
          </div>
          <ul className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-slate-500">
            {FOOTER_LINKS.map((l) => (
              <li key={l}>{l}</li>
            ))}
          </ul>
        </div>
      </footer>
      <PublicBottomNav />
    </div>
  );
}
