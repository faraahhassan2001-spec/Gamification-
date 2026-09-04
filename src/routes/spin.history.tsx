import { createFileRoute } from "@tanstack/react-router";
import { Sparkles } from "lucide-react";
import { Card, EmptyState, Screen } from "@/components/gamification/Screen";
import { spinHistory } from "@/lib/gamification";

export const Route = createFileRoute("/spin/history")({
  head: () => ({
    meta: [
      { title: "Spin History — Dealer Gamification" },
      { name: "description", content: "Every spin you used, the date, the outcome and what you received." },
      { property: "og:title", content: "Spin History — Dealer Gamification" },
      { property: "og:description", content: "Past spin outcomes and rewards." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: SpinHistoryScreen,
});

function SpinHistoryScreen() {
  return (
    <Screen title="Spin History" backTo="/spin">
      {spinHistory.length === 0 ? (
        <EmptyState message="No spins used yet." icon={<Sparkles className="size-6 text-muted-foreground" />} />
      ) : (
        <Card>
          <ul className="divide-y divide-border">
            {spinHistory.map((s) => (
              <li key={s.id} className="flex items-center gap-3 py-3">
                <span className="flex size-9 items-center justify-center rounded-full bg-primary/10">
                  <Sparkles className="size-4 text-primary" />
                </span>
                <div className="flex-1">
                  <p className="text-[13px] font-semibold text-foreground">{s.outcome}</p>
                  <p className="text-[11px] text-muted-foreground">{s.date}</p>
                </div>
                <span className="text-[12px] text-muted-foreground">{s.reward}</span>
              </li>
            ))}
          </ul>
        </Card>
      )}
    </Screen>
  );
}
