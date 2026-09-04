import { createFileRoute } from "@tanstack/react-router";
import { GamScreen } from "@/components/gamification/ui";
import { usePointsActivity } from "@/lib/gamification-state";

export const Route = createFileRoute("/points/history")({
  head: () => ({
    meta: [
      { title: "History Points — Dealer Gamification" },
      {
        name: "description",
        content:
          "Full statement of every point you earned, redeemed, converted or lost, in one timeline.",
      },
      { property: "og:title", content: "History Points — Dealer Gamification" },
      { property: "og:description", content: "Your dealer points statement." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: PointsHistoryScreen,
});

function PointsHistoryScreen() {
  const list = usePointsActivity();

  return (
    <GamScreen title="History Points" backTo="/points">
      <h2 className="px-1 text-[16px] font-semibold text-foreground">Points Activity</h2>

      {list.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border bg-card/50 px-4 py-10 text-center">
          <p className="text-[13px] text-muted-foreground">No points activity yet.</p>
        </div>
      ) : (
        <ul className="space-y-3">
          {list.map((p) => (
            <li
              key={p.id}
              className="flex items-center gap-3 rounded-2xl bg-card px-4 py-3 shadow-[0_2px_10px_rgba(15,42,80,0.06)]"
            >
              <div className="flex-1">
                <p className="text-[12px] text-muted-foreground">{p.date}</p>
                <p className="text-[14px] font-semibold text-foreground">{p.label}</p>
                <p className="text-[11px] text-muted-foreground">
                  {p.type}
                  {p.detail ? ` · ${p.detail}` : ""}
                </p>
              </div>
              <span
                className={`shrink-0 text-[13px] font-semibold ${
                  p.amount >= 0 ? "text-teal-500" : "text-rose-500"
                }`}
              >
                {p.amount >= 0 ? "+" : "-"}
                {Math.abs(p.amount).toLocaleString()} PTS
              </span>
            </li>
          ))}
        </ul>
      )}
    </GamScreen>
  );
}
