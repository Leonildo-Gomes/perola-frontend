const FOOTER_LINKS = ["Sobre Nós", "Salões Parceiros", "Termos & Privacidade", "Apoio ao Cliente"];

/** Desktop footer (static Server Component). Links are placeholders until the pages exist. */
export function SiteFooter() {
  return (
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
  );
}
