"use client";

import { ArrowRight, Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { cn } from "@/lib/utils/utils";

interface SearchBarProps {
  className?: string;
  /** Rendered before the input (e.g. the location selector on desktop). */
  leading?: React.ReactNode;
  /** Show the round submit button (desktop). */
  submitButton?: boolean;
}

export function SearchBar({ className, leading, submitButton = false }: SearchBarProps) {
  const router = useRouter();
  const [q, setQ] = useState("");

  return (
    <form
      role="search"
      onSubmit={(e) => {
        e.preventDefault();
        const term = q.trim();
        router.push(term ? `/explore?q=${encodeURIComponent(term)}` : "/explore");
      }}
      className={cn("flex h-12 items-center gap-2 rounded-full border border-slate-200 bg-white pl-2 pr-1.5", className)}
    >
      {leading}
      <Search className="ml-2 h-5 w-5 shrink-0 text-slate-400" aria-hidden />
      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        type="search"
        aria-label="Pesquisar serviços, salões ou tratamentos"
        placeholder="Buscar serviços, salões ou tratamentos"
        className="h-full min-w-0 flex-1 bg-transparent text-sm text-slate-900 placeholder:text-slate-500 focus:outline-none"
      />
      {submitButton && (
        <button
          type="submit"
          aria-label="Pesquisar"
          className="flex h-10 min-h-[44px] w-10 min-w-[44px] shrink-0 items-center justify-center rounded-full bg-perola-deep text-white hover:bg-perola-deep-container"
        >
          <ArrowRight className="h-5 w-5" aria-hidden />
        </button>
      )}
    </form>
  );
}
