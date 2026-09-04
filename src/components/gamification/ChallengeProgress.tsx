import { Check, Minus, X } from "lucide-react";
import { goalPercent, type Challenge } from "@/lib/gamification";
import { ProgressBar } from "./Screen";

export function GoalProgress({ c, compact = false }: { c: Challenge; compact?: boolean }) {
  const pct = goalPercent(c);
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-[12px]">
        <span className="font-medium text-foreground">
          {c.current} / {c.target} {c.unit}
        </span>
        <span className="text-muted-foreground">{pct}% Complete</span>
      </div>
      <ProgressBar percent={pct} />
      {!compact && (c.daysRemaining ?? 0) > 0 && (
        <p className="text-[12px] text-muted-foreground">{c.daysRemaining} Days Remaining</p>
      )}
    </div>
  );
}

export function StreakProgress({ c, compact = false }: { c: Challenge; compact?: boolean }) {
  return (
    <div className="space-y-3">
      <div className="grid grid-cols-7 gap-1.5">
        {(c.days ?? []).map((d) => (
          <div key={d.label} className="flex flex-col items-center gap-1">
            <span
              className={[
                "flex size-8 items-center justify-center rounded-xl text-[11px] font-semibold",
                d.state === "passed" && "bg-status-resolved-bg text-status-resolved",
                d.state === "missed" && "bg-status-closed-bg text-status-closed",
                d.state === "today" && "border-2 border-primary bg-primary/10 text-primary",
                d.state === "upcoming" && "bg-secondary text-muted-foreground",
              ]
                .filter(Boolean)
                .join(" ")}
            >
              {d.state === "passed" ? (
                <Check className="size-4" />
              ) : d.state === "missed" ? (
                <X className="size-4" />
              ) : d.state === "today" ? (
                "•"
              ) : (
                <Minus className="size-3.5" />
              )}
            </span>
            <span className="text-[10px] text-muted-foreground">{d.label}</span>
          </div>
        ))}
      </div>
      <p className="text-[11px] text-muted-foreground">
        Passed · Missed · Today So Far
      </p>
      {!compact && (
        <div className="grid grid-cols-3 gap-2">
          <Stat label="Current Streak" value={`${c.currentStreak} Days`} />
          <Stat label="Best Streak" value={`${c.bestStreak} Days`} />
          <Stat label="Grace Days" value={`${c.graceDays} Remaining`} />
        </div>
      )}
    </div>
  );
}

export function WindowProgress({ c, compact = false }: { c: Challenge; compact?: boolean }) {
  const pct = c.windowTarget ? Math.round(((c.windowCurrent ?? 0) / c.windowTarget) * 100) : 0;
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-[12px]">
        <span className="font-medium text-foreground">
          {c.windowCurrent} / {c.windowTarget} in window
        </span>
        <span className="text-muted-foreground">{pct}%</span>
      </div>
      <ProgressBar percent={pct} />
      {!compact && (
        <>
          <p className="text-[12px] text-muted-foreground">{c.windowLabel}</p>
          {(c.windowDays?.length ?? 0) > 0 && (
            <div className="mt-1 space-y-1.5">
              <p className="text-[12px] font-medium text-foreground">Contributing days</p>
              <div className="grid grid-cols-7 gap-1.5">
                {c.windowDays!.map((d) => (
                  <div key={d.label} className="flex flex-col items-center gap-1">
                    <span
                      className={`flex size-8 items-center justify-center rounded-xl text-[11px] font-semibold ${
                        d.contributed
                          ? "bg-primary/10 text-primary"
                          : "bg-secondary text-muted-foreground"
                      }`}
                    >
                      {d.count}
                    </span>
                    <span className="text-[9px] text-muted-foreground">{d.label}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export function ChallengeVisual({ c, compact = false }: { c: Challenge; compact?: boolean }) {
  if (c.kind === "streak") return <StreakProgress c={c} compact={compact} />;
  if (c.kind === "frequency") return <WindowProgress c={c} compact={compact} />;
  return <GoalProgress c={c} compact={compact} />;
}

export function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-secondary px-3 py-2 text-center">
      <p className="text-[10px] text-muted-foreground">{label}</p>
      <p className="text-[13px] font-semibold text-foreground">{value}</p>
    </div>
  );
}
