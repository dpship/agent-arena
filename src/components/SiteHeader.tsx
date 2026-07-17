import { Link } from "@tanstack/react-router";
import { ThemeToggle } from "./ThemeToggle";

type NavItem = { label: string; to?: string; href?: string };

const nav: NavItem[] = [
  { label: "agents", to: "/agents" },
  { label: "markets", href: "/#markets" },
  { label: "registry", href: "/#registry" },
  { label: "docs", href: "/#docs" },
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-[1400px] items-center justify-between px-6">
        <div className="flex items-center gap-8">
          <Link to="/" className="flex items-center gap-2">
            <div className="grid h-6 w-6 place-items-center rounded-sm bg-primary text-primary-foreground font-mono text-[11px] font-bold">◇</div>
            <span className="font-mono text-sm tracking-tight">
              oracle<span className="text-muted-foreground">.protocol</span>
            </span>
          </Link>
          <nav className="hidden md:flex items-center gap-6 font-mono text-xs text-muted-foreground">
            {nav.map((n) =>
              n.to ? (
                <Link
                  key={n.label}
                  to={n.to}
                  className="hover:text-foreground transition"
                  activeProps={{ className: "text-foreground" }}
                >
                  {n.label}
                </Link>
              ) : (
                <a key={n.label} href={n.href} className="hover:text-foreground transition">
                  {n.label}
                </a>
              ),
            )}
          </nav>
        </div>
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 font-mono text-[11px] text-muted-foreground">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-primary animate-pulse-dot" />
            mainnet-beta · slot 298,412,004
          </div>
          <ThemeToggle />
          <button className="rounded-md bg-primary px-3.5 py-1.5 font-mono text-xs font-semibold text-primary-foreground hover:brightness-110 transition">
            connect wallet
          </button>
        </div>
      </div>
    </header>
  );
}
