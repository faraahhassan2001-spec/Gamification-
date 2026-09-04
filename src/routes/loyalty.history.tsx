import { createFileRoute } from "@tanstack/react-router";
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

const titleTones = {
  Upgraded: "text-emerald-600",
  Downgraded: "text-rose-500",
  Renewed: "text-foreground",
} as const;

function TierHistoryScreen() {
  return (
    <Screen title="Tier History" backTo="/loyalty" centerTitle>
      {tierHistory.length === 0 ? (
        <EmptyState message="No tier changes yet." />
      ) : (
        <div className="space-y-3">
          {tierHistory.map((e, i) => (
            <Card key={i}>
              <p className={`text-[14px] font-semibold ${titleTones[e.type]}`}>
                {e.from ? `${e.from} → ${e.to}` : `${e.to} Renewed`}
              </p>
              <p className="mt-1 text-[12px] text-muted-foreground">{e.type}</p>
              <p className="text-[12px] text-muted-foreground">{e.date}</p>
            </Card>
          ))}
        </div>
      )}
    </Screen>
  );
}
