import Link from "next/link";
import { ShieldCheck, Search, Handshake, Mail } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-border/60 bg-muted/30">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-4">
          <div className="md:col-span-1">
            <Link href="/" className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-background shadow-sm">
                <span className="text-base font-bold">T</span>
              </div>
              <span className="text-xl font-semibold tracking-tight">
                TrackNest
              </span>
            </Link>

            <p className="mt-4 max-w-sm text-sm leading-6 text-muted-foreground">
              A smart lost and found management system designed for universities,
              offices, and institutions to report, track, claim, and safely return
              lost belongings.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-foreground">
              Quick Links
            </h3>
            <div className="mt-4 flex flex-col gap-3 text-sm text-muted-foreground">
              <Link href="/" className="transition hover:text-foreground">
                Home
              </Link>
              <Link href="/about" className="transition hover:text-foreground">
                About
              </Link>
              <Link href="/dashboard" className="transition hover:text-foreground">
                Dashboard
              </Link>
              <Link href="/items" className="transition hover:text-foreground">
                Browse Items
              </Link>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-foreground">
              System Features
            </h3>
            <div className="mt-4 flex flex-col gap-3 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Search className="h-4 w-4" />
                <span>Lost and found item search</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4" />
                <span>Secure claim review</span>
              </div>
              <div className="flex items-center gap-2">
                <Handshake className="h-4 w-4" />
                <span>Verified handover workflow</span>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-foreground">
              Academic Project
            </h3>
            <p className="mt-4 text-sm leading-6 text-muted-foreground">
              TrackNest is developed as a university capstone web application
              focused on authentication, role-based access, item reporting,
              claims, handovers, and smart matching support.
            </p>

            <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
              <Mail className="h-4 w-4" />
              <span>Support: tracknest@example.com</span>
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-4 border-t border-border/60 pt-6 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} TrackNest. All rights reserved.
          </p>

          <p>
            Built for secure, simple, and efficient lost item recovery.
          </p>
        </div>
      </div>
    </footer>
  );
}