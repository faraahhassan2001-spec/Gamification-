import { createFileRoute } from "@tanstack/react-router";
import { CheckCircle2, Info } from "lucide-react";
import { GamCard, GamScreen } from "@/components/gamification/ui";
import { TierCard } from "@/components/gamification/TierCard";
import { loyalty, pageLevels, tiers } from "@/lib/gamification";

export const Route = createFileRoute("/loyalty/")({
  head: () => ({
    meta: [
      { title: "Loyalty Tier — Dealer Gamification" },
      {
        name: "description",
        content:
          "See your loyalty tier, downgrade risk, tier benefits and every level you can reach as a dealer.",
      },
      { property: "og:title", content: "Loyalty Tier — Dealer Gamification" },
      { property: "og:description", content: "Tier status, benefits and level ladder." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: LoyaltyScreen,
});

function LoyaltyScreen() {
  const benefits = tiers.find((t) => t.name === loyalty.currentTier)?.benefits ?? [];

  return (
    <GamScreen title="Loyalty Tier" backTo="/gamification">
      {loyalty.atRisk && (
        <div className="flex gap-2.5 rounded-2xl border border-amber-200 bg-amber-50 p-3.5">
          <Info className="mt-0.5 size-4 shrink-0 text-amber-500" />
          <div>
            <p className="text-[13px] font-semibold text-amber-600">At Risk of Downgrade</p>
            <p className="mt-0.5 text-[13px] leading-relaxed text-foreground/70">
              Earn 800 more points by {loyalty.validUntil} to keep your {loyalty.currentTier} tier
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

      <GamCard>
        <h2 className="mb-5 text-[17px] font-bold text-foreground">Tier Level 🔥</h2>
        <div className="grid grid-cols-3 gap-x-2 gap-y-6">
          {pageLevels.map((l) => (
            <div key={l.level} className="flex items-center gap-2">
              <span
                className={`flex size-11 shrink-0 items-center justify-center rounded-full ${
                  l.active ? "bg-primary/10 ring-2 ring-primary/25" : "bg-slate-100"
                }`}
              >
                <span
                  className={`flex size-7 items-center justify-center bg-gradient-to-br text-[12px] text-white ${l.tone}`}
                  style={{
                    clipPath:
                      "polygon(50% 0%, 93% 25%, 93% 75%, 50% 100%, 7% 75%, 7% 25%)",
                  }}
                >
                  ★
                </span>
              </span>
              <div className="leading-tight">
                <p
                  className={`text-[14px] font-bold ${
                    l.active ? "text-primary" : "text-sky-400/80"
                  }`}
                >
                  {l.pc} PC
                </p>
                <p
                  className={`text-[13px] ${
                    l.active ? "font-semibold text-primary" : "text-sky-400/70"
                  }`}
                >
                  {l.name}
                </p>
              </div>
            </div>
          ))}
        </div>
      </GamCard>

    </GamScreen>
  );
}
