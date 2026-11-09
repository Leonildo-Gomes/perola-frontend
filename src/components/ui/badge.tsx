import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-lg border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-teal-600 text-white hover:bg-teal-700",
        secondary:
          "border-teal-200 bg-teal-50 text-teal-800",
        destructive:
          "border-rose-200 bg-rose-100 text-rose-800",
        outline:
          "border-slate-200 text-slate-700 bg-white",
        gold:
          "border-amber-200 bg-amber-50 text-amber-800",
        // Appointment Domain Statuses (DOMAIN.md & DESIGN.md)
        pending:
          "border-[#FDE68A] bg-[#FEF3C7] text-[#B45309]",
        confirmed:
          "border-[#A7F3D0] bg-[#D1FAE5] text-[#047857]",
        completed:
          "border-[#CBD5E1] bg-[#E2E8F0] text-[#334155]",
        cancelled:
          "border-[#FECDD3] bg-[#FFE4E6] text-[#B91C1C]",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
  VariantProps<typeof badgeVariants> { }

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };

