import { createFileRoute } from "@tanstack/react-router";
import { Award, Flame, Rocket, Trophy, Zap } from "lucide-react";
import { Card, EmptyState, Screen } from "@/components/gamification/Screen";
import { badges } from "@/lib/gamification";

export const Route = createFileRoute("/badges")({
  head: () => ({
    meta: [
      { title: "Badges — Dealer Gamification" },
      { name: "description", content: "The achievement badges you have earned and the date each was awarded." },
      { property: "og:title", content: "Badges — Dealer Gamification" },
      { property: "og:description", content: "Your earned achievement badges." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: BadgesScreen,
});

const icons: Record<string, React.ElementType> = {
  zap: Zap,
  flame: Flame,
  trophy: Trophy,
  rocket: Rocket,
};

function BadgesScreen() {
  return (
    <Screen title="Badges" backTo="/rewards">
      {badges.length === 0 ? (
        <EmptyState message="No badges earned yet." icon={<Award className="size-6 text-muted-foreground" />} />
      ) : (
        <div className="grid grid-cols-3 gap-3">
          {badges.map((b) => {
            const Icon = icons[b.icon] ?? Award;
            return (
              <Card key={b.id} className="text-center">
                <span className="mx-auto mb-2 flex size-12 items-center justify-center rounded-full bg-secondary">
                  <Icon className={`size-6 ${b.color}`} />
                </span>
                <p className="text-[12px] font-semibold leading-tight text-foreground">{b.name}</p>
                <p className="mt-1 text-[10px] text-muted-foreground">{b.date}</p>
              </Card>
            );
          })}
        </div>
      )}
    </Screen>
  );
}
