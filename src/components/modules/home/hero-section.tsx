import Link from 'next/link';
import { ArrowRight, CheckCircle2, Search, ShieldCheck, Sparkles } from 'lucide-react';

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-background">
      <div className="absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-0 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute bottom-0 left-0 h-[300px] w-[300px] rounded-full bg-blue-500/10 blur-3xl" />
        <div className="absolute right-0 top-1/3 h-[280px] w-[280px] rounded-full bg-emerald-500/10 blur-3xl" />
      </div>

      <div className="container mx-auto px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div className="max-w-2xl">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-border bg-background/80 px-4 py-2 text-sm text-muted-foreground shadow-sm backdrop-blur">
              <Sparkles className="h-4 w-4 text-primary" />
              Smart Lost &amp; Found for universities, offices, and institutions
            </div>

            <h1 className="text-4xl font-bold leading-tight tracking-tight text-foreground sm:text-5xl lg:text-6xl">
              Reconnect people with their
              <span className="block bg-gradient-to-r from-primary via-blue-500 to-emerald-500 bg-clip-text text-transparent">
                lost belongings
              </span>
            </h1>

            <p className="mt-6 max-w-xl text-base leading-7 text-muted-foreground sm:text-lg">
              TrackNest helps users report lost and found items, search listings,
              and speed up recovery with a clean workflow, secure claims, and
              smart matching support.
            </p>

            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <Link
                href="/login"
                className="inline-flex items-center justify-center rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-md transition hover:opacity-90"
              >
                Get Started
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>

              <Link
                href="/lost-items"
                className="inline-flex items-center justify-center rounded-xl border border-border bg-background px-6 py-3 text-sm font-semibold text-foreground transition hover:bg-muted"
              >
                Browse Items
              </Link>
            </div>

            <div className="mt-8 grid gap-3 sm:grid-cols-3">
              <div className="flex items-center gap-2 rounded-xl border border-border bg-background/70 px-4 py-3 shadow-sm backdrop-blur">
                <ShieldCheck className="h-5 w-5 text-primary" />
                <span className="text-sm font-medium text-foreground">Secure claims</span>
              </div>

              <div className="flex items-center gap-2 rounded-xl border border-border bg-background/70 px-4 py-3 shadow-sm backdrop-blur">
                <Search className="h-5 w-5 text-primary" />
                <span className="text-sm font-medium text-foreground">Smart search</span>
              </div>

              <div className="flex items-center gap-2 rounded-xl border border-border bg-background/70 px-4 py-3 shadow-sm backdrop-blur">
                <CheckCircle2 className="h-5 w-5 text-primary" />
                <span className="text-sm font-medium text-foreground">Easy reporting</span>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="relative rounded-3xl border border-border bg-background/90 p-6 shadow-2xl backdrop-blur">
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">TrackNest Dashboard</p>
                  <h3 className="text-xl font-semibold text-foreground">Lost &amp; Found Overview</h3>
                </div>
                <div className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                  Live System
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-2xl border border-border bg-muted/40 p-4">
                  <p className="text-sm text-muted-foreground">Reported Lost Items</p>
                  <h4 className="mt-2 text-3xl font-bold text-foreground">124</h4>
                  <p className="mt-1 text-xs text-emerald-600">+12 this week</p>
                </div>

                <div className="rounded-2xl border border-border bg-muted/40 p-4">
                  <p className="text-sm text-muted-foreground">Matched Cases</p>
                  <h4 className="mt-2 text-3xl font-bold text-foreground">87</h4>
                  <p className="mt-1 text-xs text-emerald-600">Fast recovery flow</p>
                </div>

                <div className="rounded-2xl border border-border bg-muted/40 p-4 sm:col-span-2">
                  <p className="text-sm text-muted-foreground">Recent Activity</p>

                  <div className="mt-4 space-y-3">
                    <div className="flex items-center justify-between rounded-xl bg-background px-4 py-3 shadow-sm">
                      <div>
                        <p className="text-sm font-medium text-foreground">Black Backpack</p>
                        <p className="text-xs text-muted-foreground">Found near Library Building</p>
                      </div>
                      <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-medium text-amber-700">
                        Pending Claim
                      </span>
                    </div>

                    <div className="flex items-center justify-between rounded-xl bg-background px-4 py-3 shadow-sm">
                      <div>
                        <p className="text-sm font-medium text-foreground">Student ID Card</p>
                        <p className="text-xs text-muted-foreground">Matched with lost report</p>
                      </div>
                      <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-medium text-emerald-700">
                        Matched
                      </span>
                    </div>

                    <div className="flex items-center justify-between rounded-xl bg-background px-4 py-3 shadow-sm">
                      <div>
                        <p className="text-sm font-medium text-foreground">Water Bottle</p>
                        <p className="text-xs text-muted-foreground">Reported by campus security</p>
                      </div>
                      <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700">
                        New Report
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="absolute -bottom-6 -left-6 hidden rounded-2xl border border-border bg-background p-4 shadow-xl md:block">
              <p className="text-xs text-muted-foreground">Recovery rate</p>
              <p className="text-2xl font-bold text-foreground">78%</p>
            </div>

            <div className="absolute -right-4 -top-6 hidden rounded-2xl border border-border bg-background p-4 shadow-xl md:block">
              <p className="text-xs text-muted-foreground">Verification workflow</p>
              <p className="text-sm font-semibold text-foreground">Safer item handover</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}