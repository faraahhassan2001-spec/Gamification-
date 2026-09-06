import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Check, CheckCircle2, Lock } from "lucide-react";
import { GamScreen, PrimaryButton, WalletBanner } from "@/components/gamification/ui";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { convertWallets, pointsConversionOptions } from "@/lib/gamification";
import { convertPoints, usePointsBalance } from "@/lib/gamification-state";

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

function ConvertScreen() {
  const [optionId, setOptionId] = useState<string | null>(null);
  const [walletId, setWalletId] = useState<string | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [successOpen, setSuccessOpen] = useState(false);
  const [result, setResult] = useState<{ jod: number; walletName: string } | null>(null);

  const balance = usePointsBalance();
  const option = pointsConversionOptions.find((o) => o.id === optionId) ?? null;
  const wallet = convertWallets.find((w) => w.id === walletId) ?? null;
  const canConvert = !!option && !!wallet;

  return (
    <GamScreen
      title="Convert Points"
      backTo="/points"
      footer={
        <PrimaryButton disabled={!canConvert} onClick={() => setConfirmOpen(true)}>
          Convert
        </PrimaryButton>
      }
    >
      <WalletBanner points={balance} />

      <div>
        <p className="mb-2 text-[14px] font-semibold text-foreground">Select conversion</p>
        <div className="space-y-3">
          {pointsConversionOptions.map((opt) => {
            const eligible = balance >= opt.points;
            const missing = opt.points - balance;
            const isSel = optionId === opt.id;
            return (
              <button
                key={opt.id}
                type="button"
                disabled={!eligible}
                aria-pressed={isSel}
                onClick={() => setOptionId(isSel ? null : opt.id)}
                className={`flex w-full items-center gap-3 rounded-2xl border bg-card p-3 text-left shadow-[0_2px_10px_rgba(15,42,80,0.06)] transition-colors ${
                  isSel ? "border-primary ring-1 ring-primary" : "border-transparent"
                } ${eligible ? "" : "opacity-70"}`}
              >
                <span className="flex size-14 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-2xl">
                  💱
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-[14px] font-semibold text-foreground">
                    {opt.points} pts
                  </span>
                  <span className="block text-[13px] font-semibold text-primary">{opt.jod} JOD</span>
                  {!eligible && (
                    <span className="mt-0.5 flex items-center gap-1 text-[11px] font-medium text-rose-500">
                      <Lock className="size-3" />
                      You need {missing} more pts
                    </span>
                  )}
                </span>
                <span
                  className={`shrink-0 rounded-full px-3 py-1.5 text-[12px] font-medium ${
                    !eligible
                      ? "bg-slate-100 text-muted-foreground"
                      : isSel
                        ? "bg-primary text-primary-foreground"
                        : "bg-slate-100 text-foreground"
                  }`}
                >
                  {isSel ? (
                    <span className="flex items-center gap-1">
                      <Check className="size-3" /> Selected
                    </span>
                  ) : eligible ? (
                    "Select"
                  ) : (
                    "Locked"
                  )}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <p className="mb-2 text-[14px] font-semibold text-foreground">Select wallet</p>
        <div className="space-y-3">
          {convertWallets.map((w) => (
            <button
              key={w.id}
              type="button"
              onClick={() => setWalletId(w.id)}
              className={`flex w-full items-center gap-3 rounded-xl bg-gradient-to-r ${w.tone} px-4 py-4 text-white shadow-sm`}
            >
              <span className="flex-1 text-left text-[15px] font-semibold">{w.name}</span>
              <span className="text-[15px] font-semibold">{w.balance.toFixed(3)}</span>
              <span className="text-[12px] opacity-80">JOD</span>
              <span
                className={`flex size-4 items-center justify-center rounded-full border-2 border-white ${
                  walletId === w.id ? "bg-white" : ""
                }`}
              >
                {walletId === w.id && <span className="size-1.5 rounded-full bg-slate-700" />}
              </span>
            </button>
          ))}
        </div>
      </div>

      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent className="max-w-[340px] rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-[16px]">Confirm Conversion?</DialogTitle>
          </DialogHeader>
          {option && wallet && (
            <div className="space-y-3">
              <p className="text-[13px] text-muted-foreground">
                Convert {option.points} pts to {option.jod} JOD and add it to {wallet.name}?
              </p>
              <div className="flex gap-3 pt-1">
                <button
                  type="button"
                  onClick={() => setConfirmOpen(false)}
                  className="flex-1 rounded-xl border border-border py-3 text-[14px] font-medium text-foreground"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    convertPoints(option.points);
                    setResult({ jod: option.jod, walletName: wallet.name });
                    setOptionId(null);
                    setWalletId(null);
                    setConfirmOpen(false);
                    setSuccessOpen(true);
                  }}
                  className="flex-1 rounded-xl bg-primary py-3 text-[14px] font-medium text-primary-foreground"
                >
                  Confirm
                </button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={successOpen} onOpenChange={setSuccessOpen}>
        <DialogContent className="max-w-[340px] rounded-2xl">
          <div className="flex flex-col items-center text-center">
            <span className="mb-3 flex size-14 items-center justify-center rounded-full bg-emerald-100">
              <CheckCircle2 className="size-7 text-emerald-600" />
            </span>
            <DialogTitle className="text-[16px]">Conversion Successful</DialogTitle>
            {result && (
              <p className="mt-2 text-[13px] text-muted-foreground">
                {result.jod} JOD has been added to {result.walletName}.
              </p>
            )}
            <button
              type="button"
              onClick={() => setSuccessOpen(false)}
              className="mt-5 w-full rounded-xl bg-primary py-3 text-[14px] font-medium text-primary-foreground"
            >
              Done
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </GamScreen>
  );
}
