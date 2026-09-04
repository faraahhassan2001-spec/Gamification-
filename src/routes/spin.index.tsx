import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { GamCard, GamScreen, PrimaryButton, SpinWheel } from "@/components/gamification/ui";
import { spin } from "@/lib/gamification";

export const Route = createFileRoute("/spin/")({
  head: () => ({
    meta: [
      { title: "Spin The Wheel — Dealer Gamification" },
      {
        name: "description",
        content: "Use your earned spins on the reward wheel and win vouchers, points and devices.",
      },
      { property: "og:title", content: "Spin The Wheel — Dealer Gamification" },
      { property: "og:description", content: "Spin to win dealer rewards." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: SpinScreen,
});

function SpinScreen() {
  const [spinsLeft, setSpinsLeft] = useState(spin.entitlements);
  const [angle, setAngle] = useState(0);
  const [busy, setBusy] = useState(false);

  const doSpin = () => {
    if (busy) return;
    if (spinsLeft < 1) {
      toast.error("No spins left", { description: "Complete challenges to earn more spins." });
      return;
    }
    setBusy(true);
    const idx = Math.floor(Math.random() * spin.outcomes.length);
    const seg = 360 / spin.outcomes.length;
    setAngle((a) => a + 360 * 5 + (360 - (idx * seg + seg / 2)));
    setSpinsLeft((s) => s - 1);
    setTimeout(() => {
      setBusy(false);
      toast.success("You won!", { description: spin.outcomes[idx] });
    }, 3200);
  };

  return (
    <GamScreen
      title="Spin The Wheel"
      backTo="/gamification"
      footer={
        <PrimaryButton onClick={doSpin} disabled={busy}>
          {busy ? "Spinning…" : `Spin Now (${spinsLeft} left)`}
        </PrimaryButton>
      }
    >
      <GamCard className="text-center">
        <p className="text-[13px] text-muted-foreground">You have</p>
        <p className="text-[24px] font-bold text-primary">{spinsLeft} Spins</p>
        <div className="mt-4 flex justify-center">
          <div
            className="transition-transform duration-[3000ms] ease-out"
            style={{ transform: `rotate(${angle}deg)` }}
          >
            <SpinWheel size={250} />
          </div>
        </div>
      </GamCard>

      <GamCard>
        <h2 className="mb-2 text-[15px] font-semibold text-foreground">Possible Prizes</h2>
        <div className="flex flex-wrap gap-2">
          {spin.outcomes.map((s) => (
            <span key={s} className="rounded-full bg-sky-50 px-3 py-1.5 text-[12px] text-primary">
              {s}
            </span>
          ))}
        </div>
      </GamCard>

      <Link
        to="/spin/history"
        className="block rounded-2xl bg-card py-3 text-center text-[14px] font-medium text-primary shadow-sm"
      >
        View Spin History
      </Link>
    </GamScreen>
  );
}
