import type { LucideIcon } from "lucide-react";
import * as React from "react";
import { Input, type InputProps } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface IconInputProps extends InputProps {
  icon: LucideIcon;
}

/** Input with a leading icon (Stitch auth fields). */
export const IconInput = React.forwardRef<HTMLInputElement, IconInputProps>(({ icon: Icon, className, ...props }, ref) => (
  <div className="relative">
    <Icon className="pointer-events-none absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" aria-hidden />
    <Input ref={ref} className={cn("pl-11", className)} {...props} />
  </div>
));
IconInput.displayName = "IconInput";
