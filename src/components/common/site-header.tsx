import Link from "next/link";
import { LocationSelector, SearchBar } from "@/features/marketplace/components";
import { AuthAction } from "./auth-action";
import { Logo } from "./logo";

export interface SiteHeaderLink {
  href: string;
  label: string;
}

interface SiteHeaderProps {
  /** Desktop navigation links. */
  links?: SiteHeaderLink[];
  /** Show the location + search pill on desktop. */
  showSearch?: boolean;
}

/**
 * Public/customer top bar. Server Component: only the interactive leaves
 * (LocationSelector, SearchBar, AuthAction) are client components.
 */
export function SiteHeader({ links = [], showSearch = true }: SiteHeaderProps) {
  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white">
      {/* Desktop */}
      <div className="mx-auto hidden h-20 max-w-7xl items-center gap-6 px-4 md:flex">
        <Logo tagline="Cabo Verde" />
        {showSearch && (
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
        )}
        <nav aria-label="Navegação" className="ml-auto flex items-center gap-1">
          {links.map((l) => (
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
  );
}
