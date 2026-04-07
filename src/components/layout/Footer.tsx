import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="border-t border-border/40 bg-background">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-4 lg:px-8">
        <div className="lg:col-span-2">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-card shadow-sm">
              <span className="text-base font-bold">T</span>
            </div>
            <span className="text-xl font-semibold tracking-tight">
              TrackNest
            </span>
          </div>

          <p className="mt-4 max-w-md text-sm leading-6 text-muted-foreground">
            A smart lost and found management system for universities,
            offices, and institutions. Designed for secure reporting,
            easier tracking, and faster recovery.
          </p>
        </div>

        <div>
          <h3 className="text-sm font-semibold">Navigation</h3>
          <div className="mt-4 flex flex-col gap-3 text-sm text-muted-foreground">
            <Link href="/" className="transition hover:text-foreground">
              Home
            </Link>
            <Link href="/about" className="transition hover:text-foreground">
              About
            </Link>
            <Link href="/login" className="transition hover:text-foreground">
              Login
            </Link>
            <Link href="/register" className="transition hover:text-foreground">
              Register
            </Link>
          </div>
        </div>

        <div>
          <h3 className="text-sm font-semibold">Project</h3>
          <div className="mt-4 flex flex-col gap-3 text-sm text-muted-foreground">
            <p>Lost item reporting</p>
            <p>Found item reporting</p>
            <p>Claim verification workflow</p>
            <p>Smart matching support</p>
          </div>
        </div>
      </div>

      <div className="border-t border-border/40">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-5 text-sm text-muted-foreground sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
          <p>© 2026 TrackNest. All rights reserved.</p>
          <p>Built for a professional capstone project.</p>
        </div>
      </div>
    </footer>
  );
}