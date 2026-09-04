import { createFileRoute, Link } from "@tanstack/react-router";
import { Bell, Clock, Gift, Medal, Target } from "lucide-react";
import { Card, EmptyState, Screen } from "@/components/gamification/Screen";
import { notifications, type GamNotification } from "@/lib/gamification";

export const Route = createFileRoute("/notifications")({
  head: () => ({
    meta: [
      { title: "Notifications — Dealer Gamification" },
      {
        name: "description",
        content:
          "Alerts for daily targets, completed challenges, expiring points, tier changes and rewards ready to claim.",
      },
      { property: "og:title", content: "Notifications — Dealer Gamification" },
      { property: "og:description", content: "Your gamification alerts, each linking to the right screen." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: NotificationsScreen,
});

const iconFor: Record<GamNotification["destination"], React.ElementType> = {
  challenges: Target,
  challenge: Target,
  "points-expiry": Clock,
  loyalty: Medal,
  rewards: Gift,
};

function NotificationRow({ n }: { n: GamNotification }) {
  const Icon = iconFor[n.destination];
  const body = (
    <Card className={`flex items-center gap-3 ${n.read ? "" : "border border-primary/30"}`}>
      <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/10">
        <Icon className="size-5 text-primary" />
      </span>
      <div className="min-w-0 flex-1">
        <p className="truncate text-[14px] font-semibold text-foreground">{n.title}</p>
        <p className="truncate text-[12px] text-muted-foreground">{n.body}</p>
        <p className="mt-0.5 text-[11px] text-muted-foreground">{n.date}</p>
      </div>
      {!n.read && <span className="size-2 shrink-0 rounded-full bg-primary" />}
    </Card>
  );

  if (n.destination === "challenge" && n.challengeId) {
    return (
      <Link to="/challenge/$id" params={{ id: n.challengeId }}>
        {body}
      </Link>
    );
  }
  if (n.destination === "points-expiry") return <Link to="/points/expiry">{body}</Link>;
  if (n.destination === "loyalty") return <Link to="/loyalty">{body}</Link>;
  if (n.destination === "rewards") return <Link to="/rewards">{body}</Link>;
  return <Link to="/challenges">{body}</Link>;
}

function NotificationsScreen() {
  return (
    <Screen title="Notifications" backTo="/">
      {notifications.length === 0 ? (
        <EmptyState message="No notifications yet." icon={<Bell className="size-6 text-muted-foreground" />} />
      ) : (
        <div className="space-y-3">
          {notifications.map((n) => (
            <NotificationRow key={n.id} n={n} />
          ))}
        </div>
      )}
    </Screen>
  );
}
