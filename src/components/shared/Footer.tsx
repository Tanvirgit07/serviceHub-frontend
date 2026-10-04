import React from "react";
import Link from "next/link";
import { Wrench, Mail, MapPin, ArrowUpRight } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-border/60 bg-card text-muted-foreground">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-12 md:gap-8">
          
          {/* Brand Info */}
          <div className="md:col-span-4 lg:col-span-5 space-y-3">
            <Link href="/" className="inline-flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-sm">
                <Wrench className="h-4 w-4" />
              </div>
              <span className="text-lg font-bold tracking-tight text-foreground">
                Service<span className="text-primary font-extrabold">Hub</span>
              </span>
            </Link>
            <p className="max-w-sm text-xs sm:text-sm text-muted-foreground leading-relaxed">
              Connecting you with verified professionals for on-demand home & office
              repairs, maintenance, and cleaning services.
            </p>
            <div className="pt-1 flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
              <span className="inline-flex items-center gap-1.5">
                <MapPin className="h-3.5 w-3.5 text-primary" />
                Dhaka, Bangladesh
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Mail className="h-3.5 w-3.5 text-primary" />
                support@servicehub.com
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 md:col-span-8 lg:col-span-7">
            
            {/* Explore Links */}
            <div className="space-y-3">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-foreground">
                Explore
              </h4>
              <ul className="space-y-2 text-xs sm:text-sm">
                <li>
                  <Link href="/services" className="hover:text-foreground transition-colors">
                    All Services
                  </Link>
                </li>
                <li>
                  <Link href="/#how-it-works" className="hover:text-foreground transition-colors">
                    How It Works
                  </Link>
                </li>
                <li>
                  <Link href="/about" className="hover:text-foreground transition-colors">
                    About Us
                  </Link>
                </li>
              </ul>
            </div>

            {/* Providers */}
            <div className="space-y-3">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-foreground">
                Providers
              </h4>
              <ul className="space-y-2 text-xs sm:text-sm">
                <li>
                  <Link
                    href="/provider/services/create"
                    className="inline-flex items-center gap-1 hover:text-foreground transition-colors"
                  >
                    Become a Partner
                    <ArrowUpRight className="h-3 w-3 opacity-70" />
                  </Link>
                </li>
                <li>
                  <Link href="/provider/dashboard" className="hover:text-foreground transition-colors">
                    Partner Dashboard
                  </Link>
                </li>
                <li>
                  <Link href="/signin" className="hover:text-foreground transition-colors">
                    Provider Login
                  </Link>
                </li>
              </ul>
            </div>

            {/* Support / Legal */}
            <div className="space-y-3 col-span-2 sm:col-span-1">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-foreground">
                Support
              </h4>
              <ul className="space-y-2 text-xs sm:text-sm">
                <li>
                  <Link href="/faq" className="hover:text-foreground transition-colors">
                    Help & FAQs
                  </Link>
                </li>
                <li>
                  <Link href="/privacy" className="hover:text-foreground transition-colors">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="hover:text-foreground transition-colors">
                    Terms of Service
                  </Link>
                </li>
              </ul>
            </div>

          </div>

        </div>

        {/* Bottom Minimal Copyright Bar */}
        <div className="mt-10 border-t border-border/50 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-muted-foreground">
          <p>© {currentYear} ServiceHub. All rights reserved.</p>
          <p className="flex items-center gap-1">
            <span>Built for reliable & effortless service booking</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
