import Link from "next/link";
import { cn } from "@/lib/utils";

export function Logo({ className, href = "/" }: { className?: string; href?: string }) {
  return (
    <Link
      href={href}
      aria-label="Pérola — página inicial"
      className={cn("inline-flex min-h-[44px] items-center gap-2 font-display text-xl font-extrabold text-slate-900", className)}
    >
      <span aria-hidden className="flex h-8 w-8 items-center justify-center rounded-full bg-teal-600 text-sm text-white">
        P
      </span>
      Pérola
    </Link>
  );
}
