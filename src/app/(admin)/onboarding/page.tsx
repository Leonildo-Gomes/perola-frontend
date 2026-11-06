import type { Metadata } from "next";
import Link from "next/link";
import { BusinessOnboardingForm } from "@/components/admin/onboarding/business-onboarding-form";
import { Logo } from "@/components/common/logo";

export const metadata: Metadata = {
  title: "Cadastro do Salão • Pérola SaaS",
  description: "Registe o seu salão, barbearia ou spa no ecossistema Pérola em Cabo Verde.",
};

export default function OnboardingPage() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 antialiased">
      {/* Onboarding Clean Stepper Header */}
      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white shadow-sm">
        <div className="mx-auto flex h-16 md:h-20 w-full max-w-7xl items-center justify-between px-4 sm:px-6 md:px-8">
          {/* Brand Logo */}
          <div className="flex items-center gap-3">
            <Logo tagline="SaaS" />
          </div>

          {/* Stepper Navigation (Desktop) */}
          <nav aria-label="Passos de Onboarding" className="hidden md:flex items-center gap-6">
            <div className="flex items-center gap-2 border-b-2 border-perola-deep pb-1 text-sm font-bold text-perola-deep">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-perola-deep text-[11px] font-bold text-white">
                1
              </span>
              <span>1. Dados do Salão</span>
            </div>

            <div className="flex items-center gap-2 text-sm font-semibold text-slate-400 opacity-70">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-slate-200 text-[11px] font-bold text-slate-600">
                2
              </span>
              <span>2. Catálogo de Serviços</span>
            </div>

            <div className="flex items-center gap-2 text-sm font-semibold text-slate-400 opacity-70">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-slate-200 text-[11px] font-bold text-slate-600">
                3
              </span>
              <span>3. Horários</span>
            </div>
          </nav>

          {/* Trailing Support */}
          <div className="flex items-center gap-4">
            <a
              href="tel:+2382600000"
              className="inline-flex items-center gap-1.5 rounded-full bg-perola-mint/60 px-3.5 py-1.5 text-xs font-bold text-perola-deep hover:bg-perola-mint transition-colors"
            >
              <span>Apoio:</span>
              <span>+238 260 00 00</span>
            </a>
          </div>
        </div>
      </header>

      {/* Main Canvas */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-8 md:py-10">
        {/* Page Intro */}
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 rounded-full bg-perola-mint px-3 py-1 text-xs font-bold text-perola-deep mb-3">
            <span className="h-1.5 w-1.5 rounded-full bg-perola-deep animate-pulse" />
            Passo 1 de 3 • Onboarding Pérola SaaS
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Registe o Seu Estabelecimento
          </h1>
          <p className="text-sm text-slate-500 max-w-2xl mt-1 leading-relaxed">
            Junte-se à maior rede de salões e profissionais de beleza e bem-estar em Cabo Verde. Configure o perfil do seu salão em minutos.
          </p>
        </div>

        {/* 2-Column Form & Live Preview */}
        <BusinessOnboardingForm />
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-6 mt-12">
        <div className="mx-auto flex flex-col sm:flex-row max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 md:px-8 text-xs text-slate-500">
          <p>© 2026 Pérola SaaS. Todos os direitos reservados. Cabo Verde.</p>
          <div className="flex items-center gap-4">
            <Link href="#" className="hover:text-perola-deep transition-colors">
              Termos de Serviço
            </Link>
            <Link href="#" className="hover:text-perola-deep transition-colors">
              Privacidade
            </Link>
            <span className="flex items-center gap-1 text-perola-deep font-semibold">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              Suporte Local Praia
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}

