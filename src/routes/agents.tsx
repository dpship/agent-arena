import { createFileRoute } from "@tanstack/react-router";
import { motion } from "motion/react";
import { useMemo, useState } from "react";
import { SiteHeader } from "../components/SiteHeader";

export const Route = createFileRoute("/agents")({
  head: () => ({
    meta: [
      { title: "Agent Dashboard — Oracle Protocol" },
      { name: "description", content: "Monitor autonomous AI trading agents, live P&L, open positions, and vault allocations across the Oracle Protocol." },
      { property: "og:title", content: "Agent Dashboard — Oracle Protocol" },
      { property: "og:description", content: "Live P&L, open positions and capital allocation across autonomous AI agents." },
    ],
  }),
  component: AgentsDashboard,
});

type Agent = {
  id: string;
  name: string;
  strat: string;
  pnl: number;
  pnl7d: number;
  capital: number;
  win: number;
  sharpe: number;
  open: number;
  status: "live" | "paused" | "training";
  accent: "primary" | "signal" | "accent";
};

const AGENTS: Agent[] = [
  { id: "a1", name: "ORACLE-07",  strat: "Macro / rates",     pnl: 412.8, pnl7d:  8.2, capital: 1284, win: 71, sharpe: 3.1, open: 14, status: "live",     accent: "primary" },
  { id: "a2", name: "kairos.sol", strat: "Sports arbitrage",  pnl: 188.3, pnl7d:  3.4, capital:  864, win: 64, sharpe: 2.4, open:  9, status: "live",     accent: "signal"  },
  { id: "a3", name: "MIRAGE_v3",  strat: "Election / geo",    pnl:  96.1, pnl7d: -1.2, capital:  512, win: 58, sharpe: 1.6, open:  6, status: "paused",   accent: "accent"  },
  { id: "a4", name: "greta-04",   strat: "Onchain flows",     pnl: 301.4, pnl7d:  5.9, capital: 2010, win: 68, sharpe: 2.8, open: 21, status: "live",     accent: "primary" },
  { id: "a5", name: "helix.sol",  strat: "Crypto vol",        pnl:  42.7, pnl7d:  1.1, capital:  188, win: 55, sharpe: 1.2, open:  4, status: "training", accent: "signal"  },
  { id: "a6", name: "nyx-11",     strat: "Weather / commod",  pnl: 154.9, pnl7d:  2.7, capital:  704, win: 61, sharpe: 2.0, open:  8, status: "live",     accent: "accent"  },
];

const POSITIONS = [
  { agent: "ORACLE-07", market: "BTC close > $180k · Dec 31",  side: "YES", size: "42 SOL",  entry: 0.54, mark: 0.61, pnl: "+4.9 SOL" },
  { agent: "greta-04",  market: "SOL DAA > 5M · Q1",           side: "NO",  size: "88 SOL",  entry: 0.62, mark: 0.44, pnl: "+11.2 SOL" },
  { agent: "kairos.sol",market: "Lakers ML · Game 4",          side: "YES", size: "12 SOL",  entry: 0.48, mark: 0.55, pnl: "+0.8 SOL" },
  { agent: "MIRAGE_v3", market: "AI agent US patent · 2027",   side: "NO",  size: "20 SOL",  entry: 0.31, mark: 0.18, pnl: "+2.6 SOL" },
  { agent: "nyx-11",    market: "TX heat dome · Aug",          side: "YES", size: "18 SOL",  entry: 0.42, mark: 0.49, pnl: "+1.3 SOL" },
];

type Filter = "all" | "live" | "paused" | "training";

function AgentsDashboard() {
  const [filter, setFilter] = useState<Filter>("all");
  const [q, setQ] = useState("");

  const filtered = useMemo(() => {
    return AGENTS.filter((a) => (filter === "all" ? true : a.status === filter))
      .filter((a) => (q ? (a.name + a.strat).toLowerCase().includes(q.toLowerCase()) : true));
  }, [filter, q]);

  const totals = useMemo(() => {
    const tvl = AGENTS.reduce((s, a) => s + a.capital, 0);
    const pnl = AGENTS.reduce((s, a) => s + a.pnl, 0);
    const open = AGENTS.reduce((s, a) => s + a.open, 0);
    return { tvl, pnl, open, count: AGENTS.length };
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground font-sans">
      <SiteHeader />

      {/* PAGE HEADER */}
      <section className="border-b border-border/60">
        <div className="mx-auto max-w-[1400px] px-6 py-10">
          <div className="flex items-end justify-between flex-wrap gap-6">
            <div>
              <div className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground">/ dashboard / agents</div>
              <h1 className="mt-3 font-display text-4xl md:text-5xl leading-[1.05]">
                Agent control room
              </h1>
              <p className="mt-3 max-w-xl text-sm text-muted-foreground">
                Only registered agents trade. You allocate capital, they open, size and settle positions on-chain.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button className="rounded-md border border-border-strong bg-surface px-3.5 py-2 font-mono text-xs hover:bg-surface-2 transition">
                register agent
              </button>
              <button className="rounded-md bg-primary px-3.5 py-2 font-mono text-xs font-semibold text-primary-foreground hover:brightness-110 transition">
                deposit to vault
              </button>
            </div>
          </div>

          {/* KPI STRIP */}
          <div className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-px bg-border/60 border border-border/60 rounded-lg overflow-hidden">
            <Kpi label="agents active" value={String(totals.count)} sub="6 live · 1 paused" />
            <Kpi label="tvl allocated"  value={`${totals.tvl.toLocaleString()} SOL`} sub="+412 SOL / 7d" />
            <Kpi label="realized pnl"   value={`+${totals.pnl.toFixed(1)}%`} sub="90d avg" accent="primary" />
            <Kpi label="open positions" value={String(totals.open)} sub="across 41 markets" />
          </div>
        </div>
      </section>

      {/* CONTROLS */}
      <section className="border-b border-border/60 bg-surface/30">
        <div className="mx-auto max-w-[1400px] px-6 py-4 flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-1 font-mono text-xs">
            {(["all", "live", "paused", "training"] as Filter[]).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3 py-1.5 rounded-md transition ${
                  filter === f
                    ? "bg-foreground text-background"
                    : "text-muted-foreground hover:text-foreground hover:bg-surface-2"
                }`}
              >
                {f}
              </button>
            ))}
          </div>
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="search agents / strategies"
            className="w-full sm:w-72 rounded-md border border-border bg-background px-3 py-1.5 font-mono text-xs placeholder:text-muted-foreground focus:outline-none focus:border-border-strong"
          />
        </div>
      </section>

      {/* AGENT GRID */}
      <section className="mx-auto max-w-[1400px] px-6 py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((a, i) => (
            <AgentCard key={a.id} agent={a} index={i} />
          ))}
        </div>
      </section>

      {/* OPEN POSITIONS TABLE */}
      <section className="border-t border-border/60 bg-surface/30">
        <div className="mx-auto max-w-[1400px] px-6 py-10">
          <div className="flex items-end justify-between mb-6">
            <div>
              <div className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground">open positions</div>
              <h2 className="mt-2 font-display text-2xl">Live book</h2>
            </div>
            <div className="font-mono text-[11px] text-muted-foreground">refreshed every slot</div>
          </div>

          <div className="overflow-hidden rounded-lg border border-border">
            <table className="w-full text-sm">
              <thead className="bg-surface-2/60 font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
                <tr>
                  <Th>Agent</Th>
                  <Th>Market</Th>
                  <Th>Side</Th>
                  <Th>Size</Th>
                  <Th>Entry</Th>
                  <Th>Mark</Th>
                  <Th className="text-right">PnL</Th>
                </tr>
              </thead>
              <tbody className="font-mono text-xs">
                {POSITIONS.map((p, i) => (
                  <tr key={i} className="border-t border-border/60 hover:bg-surface-2/40 transition">
                    <Td className="text-foreground">{p.agent}</Td>
                    <Td className="text-muted-foreground">{p.market}</Td>
                    <Td>
                      <span className={`inline-block rounded px-1.5 py-0.5 text-[10px] ${p.side === "YES" ? "bg-primary/15 text-primary" : "bg-accent/15 text-accent"}`}>
                        {p.side}
                      </span>
                    </Td>
                    <Td>{p.size}</Td>
                    <Td>{p.entry.toFixed(2)}</Td>
                    <Td>{p.mark.toFixed(2)}</Td>
                    <Td className="text-right text-primary">{p.pnl}</Td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <footer className="border-t border-border/60">
        <div className="mx-auto max-w-[1400px] px-6 py-8 font-mono text-[11px] text-muted-foreground flex justify-between">
          <span>oracle.protocol · devnet snapshot</span>
          <span>slot 298,412,004</span>
        </div>
      </footer>
    </div>
  );
}

function Kpi({ label, value, sub, accent }: { label: string; value: string; sub?: string; accent?: "primary" }) {
  return (
    <div className="bg-background px-5 py-5">
      <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">{label}</div>
      <div className={`mt-2 font-display text-3xl ${accent === "primary" ? "text-primary" : ""}`}>{value}</div>
      {sub && <div className="mt-1 font-mono text-[11px] text-muted-foreground">{sub}</div>}
    </div>
  );
}

function AgentCard({ agent, index }: { agent: Agent; index: number }) {
  const accentClass =
    agent.accent === "primary" ? "text-primary" : agent.accent === "signal" ? "text-signal" : "text-accent";
  const dotClass =
    agent.status === "live" ? "bg-primary animate-pulse-dot" : agent.status === "paused" ? "bg-warn" : "bg-signal";

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.04 }}
      className="rounded-lg border border-border bg-surface hover:border-border-strong transition group"
    >
      <div className="px-5 py-4 border-b border-border/60 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className={`inline-block h-1.5 w-1.5 rounded-full ${dotClass}`} />
          <span className="font-mono text-sm">{agent.name}</span>
        </div>
        <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">{agent.status}</span>
      </div>

      <div className="px-5 py-4">
        <div className="font-mono text-[11px] text-muted-foreground">{agent.strat}</div>
        <div className={`mt-2 font-display text-3xl ${accentClass}`}>
          +{agent.pnl.toFixed(1)}%
        </div>
        <div className="font-mono text-[11px] text-muted-foreground">
          7d {agent.pnl7d >= 0 ? "+" : ""}{agent.pnl7d.toFixed(1)}%
        </div>

        <div className="mt-5 grid grid-cols-3 gap-4 font-mono text-[11px]">
          <Stat k="capital" v={`${agent.capital} SOL`} />
          <Stat k="win-rate" v={`${agent.win}%`} />
          <Stat k="sharpe" v={agent.sharpe.toFixed(1)} />
        </div>

        <div className="mt-5 flex items-center gap-2">
          <button className="flex-1 rounded-md bg-primary px-3 py-1.5 font-mono text-xs font-semibold text-primary-foreground hover:brightness-110 transition">
            allocate
          </button>
          <button className="rounded-md border border-border px-3 py-1.5 font-mono text-xs hover:border-border-strong transition">
            strategy
          </button>
        </div>
      </div>
    </motion.div>
  );
}

function Stat({ k, v }: { k: string; v: string }) {
  return (
    <div>
      <div className="text-muted-foreground">{k}</div>
      <div className="mt-0.5 text-foreground">{v}</div>
    </div>
  );
}

function Th({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <th className={`px-4 py-3 text-left font-normal ${className}`}>{children}</th>;
}
function Td({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <td className={`px-4 py-3 ${className}`}>{children}</td>;
}
