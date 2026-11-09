import { ArrowLeft } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

/** Split layout (desktop: photo + form) / single column with top bar (mobile). */
export function AuthShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-50 lg:grid lg:grid-cols-2">
      {/* Hero (desktop only) */}
      <aside className="relative hidden overflow-hidden lg:block">
        <Image
          src="/images/auth-hero.jpg"
          alt="Cliente a receber um tratamento num spa com vista para o mar"
          fill
          priority
          sizes="50vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-900/35 to-slate-900/30" aria-hidden />
        <div className="absolute inset-x-0 top-0 flex items-center justify-between p-8">
          <Link
            href="/"
            className="inline-flex min-h-[44px] items-center gap-2 rounded-full border border-white/30 bg-white/15 px-5 text-sm font-semibold text-white backdrop-blur hover:bg-white/25"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden />
            Voltar ao Marketplace
          </Link>
          <span className="inline-flex items-center gap-2 rounded-full bg-slate-900/60 px-4 py-2 font-accent text-xs font-semibold text-white backdrop-blur">
            <span aria-hidden className="h-2 w-2 rounded-full bg-teal-300" />
            Praia • Mindelo • Sal
          </span>
        </div>
        <div className="absolute inset-x-0 bottom-0 p-10 text-white">
          <p className="max-w-md text-4xl font-bold leading-tight tracking-tight">
            A forma mais fácil de agendar nos melhores salões e spas de Cabo Verde.
          </p>
          <p className="mt-6 flex items-center gap-2 text-sm text-white/80">
            <span aria-hidden>🇨🇻</span> Desenvolvido com carinho em Cabo Verde
          </p>
        </div>
      </aside>

      <div className="flex min-h-screen flex-col lg:min-h-0">
        {/* Mobile top bar */}
        <header className="sticky top-0 z-20 flex h-14 items-center justify-between border-b border-slate-200 bg-white/90 px-2 backdrop-blur lg:hidden">
          <Link
            href="/"
            aria-label="Voltar"
            className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-full text-perola-deep hover:bg-slate-100"
          >
            <ArrowLeft className="h-5 w-5" aria-hidden />
          </Link>
          <span className="text-lg font-bold tracking-tight text-perola-deep">Pérola</span>
          <span className="mr-2 inline-flex items-center gap-1 rounded-full border border-slate-200 bg-white px-2.5 py-1 font-accent text-[11px] font-bold text-slate-500">
            <span aria-hidden>🇨🇻</span>CV
          </span>
        </header>

        <main className="flex flex-1 items-start justify-center px-5 py-8 lg:items-center lg:px-12">
          <div className="w-full max-w-[440px] lg:max-w-[560px]">{children}</div>
        </main>
      </div>
    </div>
  );
}
