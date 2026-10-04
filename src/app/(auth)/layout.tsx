import React from "react";
import Link from "next/link";
import { ArrowLeft, ShieldCheck } from "lucide-react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-center bg-muted/20 px-4 py-8 sm:px-6 lg:px-8">
      {/* Subtle ambient background glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 flex items-center justify-center opacity-50 dark:opacity-20"
      >
        <div className="h-[480px] w-[580px] rounded-full bg-primary/5 blur-3xl" />
      </div>

      {/* Top Bar above the Form Card (Width aligned with the card) */}
      <div className="w-full max-w-[560px] sm:max-w-[580px] mb-3.5 flex items-center justify-between">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Home</span>
        </Link>

        <div className="inline-flex items-center gap-1 text-[11px] font-medium text-muted-foreground">
          <ShieldCheck className="h-3.5 w-3.5 text-primary" />
          <span>Secure Authentication</span>
        </div>
      </div>

      {/* Centered Auth Card Container with defined suitable width */}
      <div className="w-full max-w-[560px] sm:max-w-[580px]">
        {children}
      </div>

      {/* Minimal Footer */}
      <footer className="mt-6 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} ServiceHub. All rights reserved.
      </footer>
    </div>
  );
}