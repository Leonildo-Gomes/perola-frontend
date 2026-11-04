import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 text-center">
      <h2 className="text-display text-slate-900 mb-2">404</h2>
      <p className="text-body-lg text-slate-600 mb-6">
        A página que procuras não foi encontrada.
      </p>
      <Button asChild>
        <Link href="/">Voltar à Página Inicial</Link>
      </Button>
    </div>
  );
}

