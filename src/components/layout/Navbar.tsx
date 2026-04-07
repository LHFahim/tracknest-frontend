import Link from "next/link";
import { ModeToggle } from "./modeToggle";
import SignOutButton from "./SignOutButton";

interface NavbarProps {
  isLoggedIn: boolean;
}

export default function Navbar({ isLoggedIn }: NavbarProps) {
  return (
    <header className="sticky top-0 z-50 border-b border-border/40 bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-border bg-card shadow-sm">
            <span className="text-lg font-bold">T</span>
          </div>
          <span className="text-2xl font-semibold tracking-tight">
            TrackNest
          </span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          <Link
            href="/"
            className="text-sm font-medium text-foreground transition hover:text-foreground"
          >
            Home
          </Link>
          <Link
            href="/about"
            className="text-sm font-medium text-muted-foreground transition hover:text-foreground"
          >
            About
          </Link>
          {isLoggedIn && (
            <Link
              href="/dashboard"
              className="text-sm font-medium text-muted-foreground transition hover:text-foreground"
            >
              Dashboard
            </Link>
          )}
        </nav>

        <div className="flex items-center gap-3">
          <ModeToggle />

          {isLoggedIn ? (
            <>
              <Link
                href="/dashboard"
                className="hidden rounded-xl border border-border bg-background px-4 py-2 text-sm font-medium transition hover:bg-muted sm:inline-flex"
              >
                Dashboard
              </Link>
              <SignOutButton />
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="hidden rounded-xl border border-border bg-background px-4 py-2 text-sm font-medium transition hover:bg-muted sm:inline-flex"
              >
                Login
              </Link>
              <Link
                href="/register"
                className="rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition hover:opacity-90"
              >
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
