export function AuthDivider({ children = "ou com o seu email" }: { children?: React.ReactNode }) {
  return (
    <div className="my-5 flex items-center gap-3 font-accent text-xs font-semibold uppercase tracking-wider text-slate-500" role="separator">
      <span className="h-px flex-1 bg-slate-200" />
      {children}
      <span className="h-px flex-1 bg-slate-200" />
    </div>
  );
}
