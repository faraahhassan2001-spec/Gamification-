import { createFileRoute, Link } from "@tanstack/react-router";
import { CheckCircle2, History, Info } from "lucide-react";
import { GamCard, GamScreen } from "@/components/gamification/ui";
import { TierCard } from "@/components/gamification/TierCard";
import { loyalty, tiers } from "@/lib/gamification";

export const Route = createFileRoute("/loyalty/")({
  head: () => ({
    meta: [
      { title: "Loyalty Tier — Dealer Gamification" },
      {
        name: "description",
        content: "See your loyalty tier, downgrade risk, tier benefits and your tier history.",
      },
      { property: "og:title", content: "Loyalty Tier — Dealer Gamification" },
      { property: "og:description", content: "Tier status, benefits and tier history." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: LoyaltyScreen,
});

function LoyaltyScreen() {
  const benefits = tiers.find((t) => t.name === loyalty.currentTier)?.benefits ?? [];

  return (
    <GamScreen
      title="Loyalty Tier"
      backTo="/gamification"
      right={
        <Link
          to="/loyalty/history"
          aria-label="Tier History"
          className="flex size-10 items-center justify-center rounded-full bg-card shadow-sm transition-colors hover:bg-accent"
        >
          <History className="size-4 text-foreground" />
        </Link>
      }
    >
      {loyalty.atRisk && (
        <div className="flex gap-2.5 rounded-2xl border border-amber-200 bg-amber-50 p-3.5">
          <Info className="mt-0.5 size-4 shrink-0 text-amber-500" />
          <div>
            <p className="text-[13px] font-semibold text-amber-600">At Risk of Downgrade</p>
            <p className="mt-0.5 text-[13px] leading-relaxed text-foreground/70">
              Earn {loyalty.atRiskPoints} more points by {loyalty.validUntil} to keep your{" "}
              {loyalty.currentTier} tier
            </p>
          </div>
        </div>
      )}

      <TierCard />

      <GamCard>
        <h2 className="mb-3 text-[15px] font-semibold text-foreground">Tier Benefits 🔥</h2>
        <ul className="space-y-2.5">
          {benefits.map((b) => (
            <li key={b} className="flex items-center gap-2.5 text-[13px] text-foreground">
              <CheckCircle2 className="size-4 text-emerald-500" />
              {b}
            </li>
          ))}
        </ul>
      </GamCard>

    </GamScreen>
  );
}
