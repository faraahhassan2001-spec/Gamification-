import { useState } from "react";
import { Drawer, DrawerContent, DrawerTitle } from "@/components/ui/drawer";
import type { Competition, FrequencyDay } from "@/lib/gamification";
import { competitionPercent } from "@/lib/gamification";
import { GreenProgress } from "./ui";

export function FrequencyWindowSection({ c }: { c: Competition }) {
  const [day, setDay] = useState<FrequencyDay | null>(null);
  const pct = competitionPercent(c);
  const remaining = Math.max(0, c.target - c.current);
  const unit = c.unitLabel ?? "Activities";
  const unitOne = c.unitLabelSingular ?? unit;
  const days = c.dailyContributions ?? [];
  const done = remaining === 0;

  return (
    <>
      <p className="mb-3 text-[14px] font-semibold text-foreground">
        Complete {c.target} {unit.toLowerCase()} within {(c.windowLabel ?? "").toLowerCase()}
      </p>

      <div className="flex items-center justify-between text-[12px] text-muted-foreground">
        <span>
          {c.current} / {c.target} {unit}
        </span>
        <span>{done ? "Goal Reached 🎉" : `${remaining} to go`}</span>
      </div>
      <div className="mt-1.5">
        <GreenProgress percent={pct} />
      </div>
      <p className="mt-1.5 text-[12px] text-muted-foreground">Complete {pct}%</p>

      <div className="mt-3 rounded-xl bg-muted/50 px-3 py-2">
        <p className="text-[11px] text-muted-foreground">Current Window · {c.windowLabel}</p>
        <p className="mt-0.5 text-[13px] font-semibold text-foreground">{c.windowRange}</p>
      </div>

      {days.length > 0 && (
        <div className="mt-3">
          <p className="mb-2 text-[12px] font-medium text-foreground">Daily Contribution</p>
          <div className="grid grid-cols-7 gap-1 text-center">
            {days.map((d) => (
              <button
                key={d.date}
                onClick={() => setDay(d)}
                className="rounded-lg px-0.5 py-1 transition-colors hover:bg-accent/40"
              >
                <span className="block text-[10px] leading-tight text-muted-foreground">
                  {d.date}
                </span>
                <span
                  className={`mx-auto mt-1 flex size-7 items-center justify-center rounded-full border text-[12px] font-semibold ${
                    d.today
                      ? "border-2 border-dashed border-primary bg-primary/10 text-primary"
                      : d.count > 0
                        ? "border-teal-300 bg-teal-50 text-teal-600"
                        : "border-slate-200 text-muted-foreground"
                  }`}
                >
                  {d.count}
                </span>
                {d.today && (
                  <span className="mt-0.5 block text-[9px] text-primary">Today</span>
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      <Drawer open={!!day} onOpenChange={(v) => !v && setDay(null)}>
        <DrawerContent className="mx-auto max-w-md rounded-t-3xl px-4 pb-8">
          <DrawerTitle className="mt-2 text-[17px] font-semibold">{day?.date}</DrawerTitle>
          <p className="mt-2 text-[14px] text-foreground">
            {day?.count ?? 0} {day && day.count === 1 ? unitOne : unit}
          </p>
          <p className="mt-1 text-[12px] text-muted-foreground">
            {day?.count
              ? "Counted toward the current window."
              : "No qualifying activity on this day."}
          </p>
        </DrawerContent>
      </Drawer>
    </>
  );
}
