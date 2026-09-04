import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowRight, Info } from "lucide-react";
import { toast } from "sonner";
import { GamScreen, PrimaryButton, WalletBanner } from "@/components/gamification/ui";
import { convertWallets, dealer } from "@/lib/gamification";

export const Route = createFileRoute("/points/convert")({
  head: () => ({
    meta: [
      { title: "Convert Points — Dealer Gamification" },
      {
        name: "description",
        content: "Convert your dealer points into wallet money and choose the wallet to top up.",
      },
      { property: "og:title", content: "Convert Points — Dealer Gamification" },
      { property: "og:description", content: "Turn points into wallet money instantly." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ConvertScreen,
});

const POINTS_PER_JOD = 100;

function ConvertScreen() {
  const [wallet, setWallet] = useState(convertWallets[0]!.id);
  const [amount, setAmount] = useState("");
  const balance = dealer.points;
  const spend = Number(amount) || 0;
  const total = +(spend / POINTS_PER_JOD).toFixed(2);

  return (
    <GamScreen
      title="Convert"
      backTo="/points"
      footer={
        <>
          <div className="rounded-2xl bg-card p-4 shadow-[0_2px_10px_rgba(15,42,80,0.06)]">
            <div className="flex items-center justify-between border-b border-border pb-3 text-[14px]">
              <span className="text-muted-foreground">You Spend</span>
              <span className="font-semibold text-foreground">{spend} pts</span>
            </div>
            <div className="flex items-center justify-between pt-3 text-[14px]">
              <span className="text-primary">Total</span>
              <span className="font-semibold text-primary">{total} JOD</span>
            </div>
          </div>
          <PrimaryButton
            onClick={() => {
              if (spend < POINTS_PER_JOD) {
                toast.error(`Minimum ${POINTS_PER_JOD} points to convert`);
                return;
              }
              if (spend > balance) {
                toast.error("Not enough points");
                return;
              }
              toast.success(`Converted ${spend} pts into ${total} JOD`);
              setAmount("");
            }}
          >
            Convert
          </PrimaryButton>
        </>
      }
    >
      <WalletBanner points={balance} />

      <div className="flex gap-2.5 rounded-2xl bg-card p-3.5 shadow-sm">
        <Info className="mt-0.5 size-4 shrink-0 text-primary" />
        <div className="text-[13px] leading-relaxed">
          <p className="font-semibold text-primary">Message here</p>
          <p className="text-foreground/70">Convert your points into wallet easily.</p>
          <p className="text-foreground/70">
            For every <span className="text-primary">( {POINTS_PER_JOD} points )</span>, you get{" "}
            <span className="text-primary">( 1 JOD )</span>
          </p>
        </div>
      </div>

      <div>
        <p className="mb-2 text-[14px] text-foreground">Select wallet</p>
        <div className="space-y-3">
          {convertWallets.map((w) => (
            <button
              key={w.id}
              onClick={() => setWallet(w.id)}
              className={`flex w-full items-center gap-3 rounded-xl bg-gradient-to-r ${w.tone} px-4 py-4 text-white shadow-sm`}
            >
              <span className="flex-1 text-left text-[15px] font-semibold">{w.name}</span>
              <span className="text-[15px] font-semibold">{w.balance.toFixed(3)}</span>
              <span className="text-[12px] opacity-80">JOD</span>
              <span
                className={`flex size-4 items-center justify-center rounded-full border-2 border-white ${
                  wallet === w.id ? "bg-white" : ""
                }`}
              >
                {wallet === w.id && <span className="size-1.5 rounded-full bg-slate-700" />}
              </span>
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-around rounded-2xl border border-emerald-100 bg-emerald-50/60 px-4 py-3">
        <div className="text-center">
          <p className="text-[12px] text-muted-foreground">You have</p>
          <p className="text-[16px] font-semibold text-teal-600">{balance} pts</p>
        </div>
        <ArrowRight className="size-4 text-teal-500" />
        <div className="text-center">
          <p className="text-[12px] text-muted-foreground">You can Convert</p>
          <p className="text-[16px] font-semibold text-teal-600">{balance / POINTS_PER_JOD} JOD</p>
        </div>
      </div>

      <div>
        <p className="mb-2 text-[14px] text-foreground">Enter the points you want to Convert</p>
        <input
          inputMode="numeric"
          value={amount}
          onChange={(e) => setAmount(e.target.value.replace(/\D/g, ""))}
          placeholder="Enter the Points"
          aria-label="Points to convert"
          className="w-full rounded-xl bg-card px-4 py-3.5 text-[14px] text-foreground shadow-sm outline-none placeholder:text-muted-foreground"
        />
      </div>
    </GamScreen>
  );
}
