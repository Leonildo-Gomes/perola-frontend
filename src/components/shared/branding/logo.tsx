import { Flower2 } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils/utils";

interface LogoProps {
  className?: string;
  href?: string;
  /** Secondary line under the wordmark (e.g. "CABO VERDE"). */
  tagline?: string;
  /** Icon-only mark in a solid deep-teal square (admin bar). */
  variant?: "mint" | "solid";
}

export function Logo({ className, href = "/", tagline, variant = "mint" }: LogoProps) {
  return (
    <Link
      href={href}
      aria-label="Pérola — página inicial"
      className={cn("inline-flex min-h-[44px] items-center gap-2.5", className)}
    >
      <span
        aria-hidden
        className={cn(
          "flex h-10 w-10 shrink-0 items-center justify-center",
          variant === "mint" ? "rounded-full bg-perola-mint text-perola-deep" : "rounded-xl bg-perola-deep text-white",
        )}
      >
        <Flower2 className="h-5 w-5" />
      </span>
      <span className="flex flex-col leading-none">
        <span className="font-display text-xl font-extrabold tracking-tight text-perola-deep">Pérola</span>
        {tagline && (
          <span className="mt-1 font-accent text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-500">
            {tagline}
          </span>
        )}
      </span>
    </Link>
  );
}
