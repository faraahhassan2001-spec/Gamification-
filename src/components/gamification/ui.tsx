import { Link } from "@tanstack/react-router";
import { ArrowLeft, RotateCw, Search, SlidersHorizontal, Wallet } from "lucide-react";
import type { ReactNode } from "react";

/* ------------------------------------------------------------------ shell */

export function GamScreen({
  title,
  backTo,
  onBack,
  right,
  children,
  footer,
}: {
  title: string;
  backTo?: string;
  onBack?: () => void;
  right?: ReactNode;
  children: ReactNode;
  footer?: ReactNode;
}) {
  return (
    <div className="h-[100dvh] overflow-hidden bg-gradient-to-b from-[#eef4fb] via-[#f2f6fb] to-[#e8eff8]">
      <div className="mx-auto flex h-full w-full max-w-md flex-col">
        <header className="flex shrink-0 items-center gap-3 px-4 pb-3 pt-5">
          {backTo ? (
            <Link
              to={backTo}
              aria-label="Go back"
              className="flex size-10 shrink-0 items-center justify-center rounded-full bg-card shadow-sm transition-colors hover:bg-accent"
            >
              <ArrowLeft className="size-5 text-foreground" />
            </Link>
          ) : (
            <button
              onClick={onBack}
              aria-label="Go back"
              className="flex size-10 shrink-0 items-center justify-center rounded-full bg-card shadow-sm transition-colors hover:bg-accent"
            >
              <ArrowLeft className="size-5 text-foreground" />
            </button>
          )}
          <h1 className="flex-1 text-center text-[18px] font-semibold text-foreground">{title}</h1>
          <div className="flex size-10 shrink-0 items-center justify-center">{right}</div>
        </header>
        <main className="flex-1 space-y-4 overflow-y-auto px-4 pb-6 pt-1">{children}</main>
        {footer && (
          <div className="shrink-0 space-y-3 border-t border-black/5 bg-background/80 px-4 pb-6 pt-3 backdrop-blur">
            {footer}
          </div>
        )}

      </div>
    </div>
  );
}

export function RefreshButton({ onClick }: { onClick?: () => void }) {
  return (
    <button
      onClick={onClick}
      aria-label="Refresh"
      className="flex size-10 items-center justify-center rounded-full bg-card shadow-sm transition-colors hover:bg-accent"
    >
      <RotateCw className="size-4 text-foreground" />
    </button>
  );
}

export function GamCard({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <section className={`rounded-2xl bg-card p-4 shadow-[0_2px_10px_rgba(15,42,80,0.06)] ${className}`}>
      {children}
    </section>
  );
}

/* ----------------------------------------------------------------- banner */

export function WalletBanner({
  points,
  right,
}: {
  points: number;
  right?: ReactNode;
}) {
  return (
    <div className="relative flex items-center gap-3 overflow-hidden rounded-2xl bg-gradient-to-r from-[#152a4e] via-[#1f4f80] to-[#3f9fc4] px-4 py-4 text-white shadow-md">
      <span className="pointer-events-none absolute -right-8 -top-10 size-36 rounded-full bg-white/10" />
      <span className="relative flex size-11 shrink-0 items-center justify-center rounded-xl bg-white/15">
        <Wallet className="size-5 text-white" />
        <span className="absolute -bottom-1 -right-1 flex size-4 items-center justify-center rounded-full bg-amber-400 text-[9px] font-bold text-amber-900">
          $
        </span>
      </span>
      <div className="relative flex-1">
        <p className="text-[20px] font-bold leading-tight">{points.toLocaleString()} pts</p>
      </div>
      <div className="relative text-[13px] font-medium text-white/80">
        {right ?? "Current Point"}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------- bits */

export function UnderlineTabs<T extends string>({
  tabs,
  value,
  onChange,
}: {
  tabs: readonly T[];
  value: T;
  onChange: (t: T) => void;
}) {
  return (
    <div className="flex border-b border-border">
      {tabs.map((t) => (
        <button
          key={t}
          onClick={() => onChange(t)}
          className={`flex-1 pb-2.5 text-[14px] font-medium transition-colors ${
            value === t
              ? "border-b-2 border-primary text-primary"
              : "border-b-2 border-transparent text-muted-foreground"
          }`}
        >
          {t}
        </button>
      ))}
    </div>
  );
}

export function PillTabs<T extends string>({
  tabs,
  value,
  onChange,
}: {
  tabs: readonly T[];
  value: T;
  onChange: (t: T) => void;
}) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-1">
      {tabs.map((t) => (
        <button
          key={t}
          onClick={() => onChange(t)}
          className={`shrink-0 rounded-full px-5 py-2 text-[13px] font-medium transition-colors ${
            value === t ? "bg-primary text-primary-foreground" : "bg-card text-foreground shadow-sm"
          }`}
        >
          {t}
        </button>
      ))}
    </div>
  );
}

export function SearchBar({
  value,
  onChange,
  placeholder = "Search",
  onFilterClick,
  filterActive = false,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  onFilterClick?: () => void;
  filterActive?: boolean;
}) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex flex-1 items-center gap-2 rounded-full bg-card px-4 py-3 shadow-sm">
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          aria-label={placeholder}
          className="flex-1 bg-transparent text-[14px] text-foreground outline-none placeholder:text-muted-foreground"
        />
        <Search className="size-5 text-muted-foreground" />
      </div>
      <button
        aria-label="Filter"
        onClick={onFilterClick}
        className={`flex size-11 shrink-0 items-center justify-center rounded-full shadow-sm transition-colors ${
          filterActive
            ? "bg-primary/10 ring-2 ring-primary"
            : "bg-card"
        }`}
      >
        <SlidersHorizontal className={`size-5 ${filterActive ? "text-primary" : "text-primary"}`} />
      </button>
    </div>
  );
}

export function StatusChip({
  children,
  tone = "orange",
}: {
  children: ReactNode;
  tone?: "orange" | "green" | "red";
}) {
  return (
    <span
      className={`rounded-full px-2.5 py-1 text-[11px] font-medium ${
        tone === "green"
          ? "bg-emerald-50 text-emerald-600"
          : tone === "red"
            ? "bg-rose-50 text-rose-500"
            : "bg-orange-50 text-orange-500"
      }`}
    >
      {children}
    </span>
  );
}

export function GreenProgress({ percent }: { percent: number }) {
  return (
    <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-200">
      <div
        className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-green-500"
        style={{ width: `${Math.max(0, Math.min(100, percent))}%` }}
      />
    </div>
  );
}

export function PrimaryButton({
  children,
  onClick,
  disabled = false,
  className = "",
}: {
  children: ReactNode;
  onClick?: (() => void) | undefined;
  className?: string | undefined;
  disabled?: boolean | undefined;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`w-full rounded-full bg-primary py-3.5 text-[15px] font-semibold text-primary-foreground shadow-sm transition-colors hover:bg-primary/90 disabled:opacity-60 ${className}`}
    >
      {children}
    </button>
  );
}

/* ------------------------------------------------------------- spin wheel */

export function SpinWheel({ size = 200 }: { size?: number }) {
  const colors = [
    "#94a3b8",
    "#f6c28b",
    "#8fb6e3",
    "#64748b",
    "#f6c28b",
    "#8fb6e3",
    "#f0a3c8",
    "#94a3b8",
  ];
  const step = 360 / colors.length;
  const stops = colors
    .map((c, i) => `${c} ${i * step}deg ${(i + 1) * step}deg`)
    .join(", ");
  return (
    <div className="relative mx-auto" style={{ width: size, height: size }}>
      <span className="absolute left-1/2 top-[-10px] z-20 -translate-x-1/2 text-[22px]">📍</span>
      <div className="size-full rounded-full bg-slate-300 p-2 shadow-inner">
        <div
          className="relative size-full rounded-full shadow-md"
          style={{ background: `conic-gradient(${stops})` }}
        >
          <span className="absolute left-1/2 top-1/2 flex size-[28%] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-[#f6c28b] text-[11px] font-semibold text-slate-700 shadow">
            SPIN
          </span>
        </div>
      </div>
    </div>
  );
}
