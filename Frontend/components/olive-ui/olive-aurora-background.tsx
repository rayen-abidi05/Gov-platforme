"use client";

import { cn } from "@/lib/utils";


export function OliveAuroraBackground({
  className,
}: {
  className?: string;
}) {
  return (
    <div
      aria-hidden
      className={cn(
        "pointer-events-none absolute inset-0 overflow-hidden bg-olive-950",
        className
      )}
    >
      <div
        className="olive-aurora-layer absolute -left-1/4 top-[-10%] h-[70%] w-[70%] rounded-full opacity-60 blur-3xl"
        style={{
          background:
            "radial-gradient(circle at 30% 30%, rgb(85 116 47 / 0.55), transparent 70%)",
          animation: "olive-drift 22s ease-in-out infinite",
        }}
      />
      <div
        className="olive-aurora-layer absolute right-[-15%] top-[10%] h-[60%] w-[60%] rounded-full opacity-50 blur-3xl"
        style={{
          background:
            "radial-gradient(circle at 60% 40%, rgb(199 154 46 / 0.35), transparent 70%)",
          animation: "olive-drift 28s ease-in-out infinite reverse",
        }}
      />
      <div
        className="olive-aurora-layer absolute bottom-[-20%] left-[10%] h-[65%] w-[65%] rounded-full opacity-40 blur-3xl"
        style={{
          background:
            "radial-gradient(circle at 40% 60%, rgb(46 70 32 / 0.6), transparent 70%)",
          animation: "olive-drift 25s ease-in-out infinite",
        }}
      />
      {/* fine grove-canopy texture, kept very subtle */}
      <div className="absolute inset-0 bg-[radial-gradient(rgb(248_246_238/0.04)_1px,transparent_1px)] [background-size:18px_18px]" />
      {/* darken toward the edges so the form card stays legible */}
      <div className="absolute inset-0 bg-gradient-to-t from-olive-950/70 via-transparent to-olive-950/40" />
    </div>
  );
}