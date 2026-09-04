import { createFileRoute } from "@tanstack/react-router";
import { ArrowDownRight, ArrowUpRight, RefreshCw } from "lucide-react";
import { Card, EmptyState, Screen } from "@/components/gamification/Screen";
import { tierHistory } from "@/lib/gamification";

export const Route = createFileRoute("/loyalty/history")({
  head: () => ({
    meta: [
      { title: "Tier History — Dealer Gamification" },
      {
        name: "description",
        content: "Timeline of your loyalty tier upgrades, downgrades and renewals with dates.",
      },
      { property: "og:title", content: "Tier History — Dealer Gamification" },
      { property: "og:description", content: "Your loyalty tier upgrade, downgrade and renewal timeline." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: TierHistoryScreen,
});

const icons = {
  Upgraded: ArrowUpRight,
  Downgraded: ArrowDownRight,
  Renewed: RefreshCw,
} as const;

const tones = {
  Upgraded: "bg-status-resolved-bg text-status-resolved",
  Downgraded: "bg-status-closed-bg text-status-closed",
  Renewed: "bg-secondary text-secondary-foreground",
} as const;

function TierHistoryScreen() {
  return (
    <Screen title="Tier History" backTo="/loyalty">
      {tierHistory.length === 0 ? (
        <EmptyState message="No tier changes yet." />
      ) : (
        <Card>
          <ol className="relative space-y-5 border-l border-border pl-5">
            {tierHistory.map((e, i) => {
              const Icon = icons[e.type];
              return (
                <li key={i} className="relative">
                  <span
                    className={`absolute -left-[2.05rem] flex size-7 items-center justify-center rounded-full ${tones[e.type]}`}
                  >
                    <Icon className="size-3.5" />
                  </span>
                  <p className="text-[14px] font-semibold text-foreground">
                    {e.from ? `${e.from} → ${e.to}` : `${e.to} Renewed`}
                  </p>
                  <p className="text-[12px] text-muted-foreground">{e.type}</p>
                  <p className="text-[12px] text-muted-foreground">{e.date}</p>
                </li>
              );
            })}
          </ol>
        </Card>
      )}
    </Screen>
  );
}
