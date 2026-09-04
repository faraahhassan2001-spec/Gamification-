import { Link } from "@tanstack/react-router";
import { ChevronRight, Clock, Info, Users } from "lucide-react";
import type { Competition, StreakDayState } from "@/lib/gamification";
import {
  competitionPercent,
  competitionRewardIcon,
  competitionStatusTone,
  competitionStatusLabel,
} from "@/lib/gamification";

import { GreenProgress, StatusChip } from "./ui";

export function StreakDots({
  total,
  done,
  states,
}: {
  total: number;
  done: number;
  states?: StreakDayState[] | undefined;
}) {
  const items = Array.from({ length: total }, (_, i) => i + 1);
  const rows = [items.slice(0, 10), items.slice(10)];
  const stateOf = (n: number): StreakDayState =>
    states?.[n - 1] ?? (n <= done ? "passed" : "future");
  const styles: Record<StreakDayState, string> = {
    passed: "border-orange-300 bg-orange-50 text-orange-500",
    missed: "border-rose-300 bg-rose-50 text-rose-500",
    today: "border-2 border-dashed border-primary bg-primary/10 text-primary font-semibold",
    future: "border-slate-200 bg-transparent text-muted-foreground",
  };
  const glyph: Record<StreakDayState, string> = {
    passed: "🔥",
    missed: "✕",
    today: "•",
    future: "",
  };
  return (
    <div className="space-y-2">
      {rows
        .filter((r) => r.length > 0)
        .map((row, ri) => (
          <div key={ri}>
            <div className="grid grid-cols-10 gap-1 text-center">
              {row.map((n) => (
                <span key={n} className="text-[11px] text-muted-foreground">
                  {n}
                </span>
              ))}
            </div>
            <div className="mt-1 grid grid-cols-10 gap-1">
              {row.map((n) => {
                const st = stateOf(n);
                return (
                  <span
                    key={n}
                    title={`Day ${n}: ${st}`}
                    aria-label={`Day ${n}: ${st}`}
                    className={`mx-auto flex size-6 items-center justify-center rounded-full border text-[11px] leading-none ${styles[st]}`}
                  >
                    {glyph[st]}
                  </span>
                );
              })}
            </div>
          </div>
        ))}
    </div>
  );
}

export function StreakLegend() {
  const items: { st: StreakDayState; label: string }[] = [
    { st: "passed", label: "Passed" },
    { st: "missed", label: "Missed" },
    { st: "today", label: "Today" },
    { st: "future", label: "Upcoming" },
  ];
  const dot: Record<StreakDayState, string> = {
    passed: "border-orange-300 bg-orange-50 text-orange-500",
    missed: "border-rose-300 bg-rose-50 text-rose-500",
    today: "border-2 border-dashed border-primary bg-primary/10 text-primary",
    future: "border-slate-200",
  };
  const glyph: Record<StreakDayState, string> = {
    passed: "🔥",
    missed: "✕",
    today: "•",
    future: "",
  };
  return (
    <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 text-[11px] text-muted-foreground">
      {items.map((i) => (
        <span key={i.st} className="flex items-center gap-1.5">
          <span
            className={`flex size-4 items-center justify-center rounded-full border text-[9px] leading-none ${dot[i.st]}`}
          >
            {glyph[i.st]}
          </span>
          {i.label}
        </span>
      ))}
    </div>
  );
}


function MetaRow({ c }: { c: Competition }) {
  return (
    <div className="flex items-center gap-4 text-[12px] text-muted-foreground">
      <span className="flex items-center gap-1.5">
        <Clock className="size-3.5 text-teal-500" />
        {c.dateRange}
      </span>
      <span className="flex items-center gap-1.5">
        <Users className="size-3.5 text-teal-500" />
        {c.participants}
      </span>
    </div>
  );
}

export function CompetitionCard({
  c,
  variant,
  onJoin,
  onOpen,
}: {
  c: Competition;
  variant: "progress" | "available";
  onJoin?: (() => void) | undefined;
  onOpen?: (() => void) | undefined;
}) {
  const pct = competitionPercent(c);
  const completed = c.current >= c.target;
  const cls =
    "block w-full text-left rounded-2xl bg-card p-4 shadow-[0_2px_10px_rgba(15,42,80,0.06)] transition-colors hover:bg-accent/30";
  const Shell = ({ children }: { children: React.ReactNode }) =>
    onOpen ? (
      <div role="button" tabIndex={0} onClick={onOpen} className={cls}>
        {children}
      </div>
    ) : (
      <Link to="/challenge/$id" params={{ id: c.id }} className={cls}>
        {children}
      </Link>
    );
  return (
    <Shell>
      <div className="flex items-start justify-between gap-2">
        <p className="text-[14px] font-semibold text-foreground">{c.title}</p>
        <div className="flex shrink-0 items-center gap-1.5">
          {variant === "progress" && (
            <StatusChip tone={competitionStatusTone(c.status)}>{competitionStatusLabel(c.status)}</StatusChip>
          )}
          <ChevronRight className="size-4 text-muted-foreground" />
        </div>

      </div>

      <p className="mt-1.5 flex items-center gap-2 text-[13px] text-muted-foreground">
        <span className="text-[15px]">{competitionRewardIcon[c.rewardKind]}</span>
        {c.rewardLabel}
      </p>

      {variant === "available" ? (
        <p className="mt-2 text-[13px] text-foreground/80">{c.activityTarget}</p>
      ) : c.kind === "frequency" ? (
        <div className="mt-3 space-y-1.5">
          <p className="text-[13px] text-foreground/80">
            Complete {c.target} {(c.unitLabel ?? "activities").toLowerCase()} within{" "}
            {(c.windowLabel ?? "the window").toLowerCase()}
          </p>
          <div className="flex items-center justify-between text-[12px] text-muted-foreground">
            <span>
              {c.current} {c.unitLabel ?? ""} / {c.target}
            </span>
            <span>{Math.max(0, c.target - c.current)} to go</span>
          </div>
          <GreenProgress percent={pct} />
          <p className="text-[12px] text-muted-foreground">Window: {c.windowLabel}</p>
        </div>
      ) : c.kind === "streak" ? (
        <div className="mt-3">
          <StreakDots total={c.streakTotal ?? 10} done={c.streakDone ?? 0} states={c.streakStates} />
        </div>
      ) : (
        <div className="mt-3 space-y-1.5">
          <div className="flex items-center justify-between text-[12px] text-muted-foreground">
            <span>
              {c.current} / {c.target}
            </span>
            <span className={completed ? "font-medium text-emerald-600" : undefined}>
              {completed ? "Completed" : `${Math.max(0, c.target - c.current)} to go`}
            </span>
          </div>
          <GreenProgress percent={pct} />
        </div>
      )}

      <div className="mt-3 flex items-center justify-between border-t border-border/70 pt-3">
        <MetaRow c={c} />
        {variant === "available" && (
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onJoin?.();
            }}
            className="rounded-full bg-primary/10 px-5 py-1.5 text-[13px] font-medium text-primary transition-colors hover:bg-primary/20"
          >
            Join
          </button>
        )}
      </div>

      {variant === "progress" && !completed && c.expiryNote && (
        <p className="mt-2 flex items-center gap-1.5 text-[12px] text-amber-500">
          <Info className="size-3.5" />
          {c.expiryNote}
        </p>
      )}
    </Shell>
  );
}
