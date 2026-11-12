import { useId } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils/utils";

export interface PerolaMarkProps {
  className?: string;
  /** Visual style: 'mint' for light surfaces, 'solid' for high-contrast/admin surfaces. */
  variant?: "mint" | "solid";
  /** Preset dimensions for the emblem. */
  size?: "sm" | "md" | "lg";
}

const SIZE_CLASSES: Record<NonNullable<PerolaMarkProps["size"]>, string> = {
  sm: "h-8 w-8",
  md: "h-10 w-10",
  lg: "h-14 w-14",
};

/**
 * Custom geometric brand mark for Pérola ("A Pérola do Oceano").
 * Combines an Atlantic scallop/lotus cradle, a luminous pearl centerpiece,
 * and a golden-amber star sparkle using the brand's Ocean Teal & Golden Pearl tokens.
 */
export function PerolaMark({
  className,
  variant = "mint",
  size = "md",
}: PerolaMarkProps) {
  const uid = useId().replace(/:/g, "");
  const bgId = `perola-bg-${uid}`;
  const shellId = `perola-shell-${uid}`;
  const pearlId = `perola-pearl-${uid}`;
  const goldId = `perola-gold-${uid}`;
  const isSolid = variant === "solid";

  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className={cn("shrink-0 select-none", SIZE_CLASSES[size], className)}
    >
      <defs>
        <linearGradient id={bgId} x1="4" y1="4" x2="44" y2="44" gradientUnits="userSpaceOnUse">
          {isSolid ? (
            <>
              <stop offset="0%" stopColor="#00685F" />
              <stop offset="55%" stopColor="#0D9488" />
              <stop offset="100%" stopColor="#0F766E" />
            </>
          ) : (
            <>
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="55%" stopColor="#F0FDFA" />
              <stop offset="100%" stopColor="#CCFBF1" />
            </>
          )}
        </linearGradient>

        <linearGradient id={shellId} x1="10" y1="22" x2="38" y2="39" gradientUnits="userSpaceOnUse">
          {isSolid ? (
            <>
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="100%" stopColor="#CCFBF1" />
            </>
          ) : (
            <>
              <stop offset="0%" stopColor="#00685F" />
              <stop offset="55%" stopColor="#0D9488" />
              <stop offset="100%" stopColor="#14B8A6" />
            </>
          )}
        </linearGradient>

        <radialGradient id={pearlId} cx="36%" cy="32%" r="68%">
          {isSolid ? (
            <>
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="55%" stopColor="#F0FDFA" />
              <stop offset="85%" stopColor="#CCFBF1" />
              <stop offset="100%" stopColor="#FDE68A" />
            </>
          ) : (
            <>
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="55%" stopColor="#F8FAFC" />
              <stop offset="85%" stopColor="#E2E8F0" />
              <stop offset="100%" stopColor="#99F6E4" />
            </>
          )}
        </radialGradient>

        <linearGradient id={goldId} x1="29" y1="7" x2="38" y2="16" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FBBF24" />
          <stop offset="100%" stopColor="#D97706" />
        </linearGradient>
      </defs>

      {/* Container squircle */}
      <rect
        x="2"
        y="2"
        width="44"
        height="44"
        rx="13"
        fill={`url(#${bgId})`}
        stroke={isSolid ? "rgba(255,255,255,0.18)" : "#99F6E4"}
        strokeWidth="1.2"
      />

      {/* Scallop / Lotus Cradle — Left Petal */}
      <path
        d="M9.5 22C9.5 31.5 16 37.5 24 38.5C18.5 35.5 15.5 30 15.5 23.5C13.5 22.5 11.5 22 9.5 22Z"
        fill={`url(#${shellId})`}
        opacity={isSolid ? 0.92 : 0.95}
      />

      {/* Scallop / Lotus Cradle — Right Petal */}
      <path
        d="M38.5 22C38.5 31.5 32 37.5 24 38.5C29.5 35.5 32.5 30 32.5 23.5C34.5 22.5 36.5 22 38.5 22Z"
        fill={`url(#${shellId})`}
        opacity={isSolid ? 0.92 : 0.95}
      />

      {/* Center Ocean Chalice */}
      <path
        d="M14 29.5C16.5 35 20 38.2 24 39.2C28 38.2 31.5 35 34 29.5C30.5 32.8 27.3 34.2 24 34.2C20.7 34.2 17.5 32.8 14 29.5Z"
        fill={`url(#${shellId})`}
        opacity={isSolid ? 1 : 0.85}
      />

      {/* Luminous Pearl Centerpiece */}
      <circle
        cx="24"
        cy="21"
        r="7.8"
        fill={`url(#${pearlId})`}
        stroke={isSolid ? "rgba(255,255,255,0.45)" : "rgba(13,148,136,0.25)"}
        strokeWidth="0.9"
      />

      {/* Specular Pearl Highlight */}
      <ellipse
        cx="21.4"
        cy="18.2"
        rx="2.3"
        ry="1.35"
        transform="rotate(-30 21.4 18.2)"
        fill="#FFFFFF"
        opacity="0.95"
      />

      {/* Golden Pearl 4-Point Sparkle */}
      <path
        d="M34 7.5Q34.55 11 38 11.5Q34.55 12 34 15.5Q33.45 12 30 11.5Q33.45 11 34 7.5Z"
        fill={`url(#${goldId})`}
      />

      {/* Subtle Secondary Dewdrop Accent */}
      <circle
        cx="14.5"
        cy="13"
        r="1.35"
        fill={isSolid ? "#5EEAD4" : "#F59E0B"}
        opacity="0.85"
      />
    </svg>
  );
}

interface LogoProps {
  className?: string;
  href?: string;
  /** Secondary line under the wordmark (e.g. "Cabo Verde"). */
  tagline?: string;
  /** Mark style: 'mint' for light headers, 'solid' for admin/high-contrast bars. */
  variant?: "mint" | "solid";
}

export function Logo({ className, href = "/", tagline, variant = "mint" }: LogoProps) {
  return (
    <Link
      href={href}
      aria-label="Pérola — página inicial"
      className={cn("group inline-flex min-h-[44px] items-center gap-2.5", className)}
    >
      <span
        aria-hidden
        className="flex shrink-0 items-center justify-center transition-transform duration-200 group-hover:scale-105"
      >
        <PerolaMark variant={variant} size="md" />
      </span>
      <span className="flex flex-col leading-none">
        <span className="inline-flex items-baseline gap-0.5 font-display text-xl font-extrabold tracking-tight text-perola-deep">
          <span>Pérola</span>
          <span
            aria-hidden
            className="inline-block h-1.5 w-1.5 rounded-full bg-perola-gold"
          />
        </span>
        {tagline && (
          <span className="mt-1 font-accent text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-500">
            {tagline}
          </span>
        )}
      </span>
    </Link>
  );
}
