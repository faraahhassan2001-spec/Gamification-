import { createFileRoute } from "@tanstack/react-router";
import { Clock } from "lucide-react";
import { Card, EmptyState, Screen } from "@/components/gamification/Screen";
import { formatPoints, pointsExpiry } from "@/lib/gamification";

export const Route = createFileRoute("/points/expiry")({
  head: () => ({
    meta: [
      { title: "Points Expiry — Dealer Gamification" },
      {
        name: "description",
        content: "See which of your points expire first and when, so you know what to use before it is lost.",
      },
      { property: "og:title", content: "Points Expiry — Dealer Gamification" },
      { property: "og:description", content: "Points expiring soonest, ordered by nearest expiry date." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: PointsExpiryScreen,
});

function PointsExpiryScreen() {
  const list = [...pointsExpiry];

  return (
    <Screen title="Points Expiry" backTo="/points">
      {list.length === 0 ? (
        <EmptyState message="No points currently expiring." icon={<Clock className="size-6 text-muted-foreground" />} />
      ) : (
        <Card>
          <p className="mb-3 text-[12px] text-muted-foreground">
            Nearest expiry first. Use these points before they expire.
          </p>
          <ul className="divide-y divide-border">
            {list.map((e) => (
              <li key={e.id} className="flex items-center gap-3 py-3">
                <span className="flex size-9 items-center justify-center rounded-full bg-status-progress-bg">
                  <Clock className="size-4 text-status-progress" />
                </span>
                <div className="flex-1">
                  <p className="text-[14px] font-semibold text-foreground">{formatPoints(e.amount)} pts</p>
                  <p className="text-[12px] text-muted-foreground">Expires {e.date}</p>
                </div>
              </li>
            ))}
          </ul>
        </Card>
      )}
    </Screen>
  );
}
