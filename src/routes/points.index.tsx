import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Check, History as HistoryIcon, Info, Lock } from "lucide-react";
import { toast } from "sonner";
import {
  GamScreen,
  PillTabs,
  PrimaryButton,
  WalletBanner,
} from "@/components/gamification/ui";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { dealer, redeemDevices, redeemRates, redeemTabs } from "@/lib/gamification";
import { redeemDevice, usePointsBalance } from "@/lib/gamification-state";

export const Route = createFileRoute("/points/")({
  head: () => ({
    meta: [
      { title: "Wallet Point — Dealer Gamification" },
      {
        name: "description",
        content:
          "Check your points balance and wallet money, then redeem points for vouchers, devices, cash and more.",
      },
      { property: "og:title", content: "Wallet Point — Dealer Gamification" },
      { property: "og:description", content: "Points balance, wallet money and redemption." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: WalletPointScreen,
});

const fmt = (n: number) => n.toLocaleString();

function WalletPointScreen() {
  const [tab, setTab] = useState<string>(redeemTabs[0]);
  const [amount, setAmount] = useState("");
  const [deviceId, setDeviceId] = useState<string | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [successOpen, setSuccessOpen] = useState(false);
  const [redeemedName, setRedeemedName] = useState("");
  const [redeemedPoints, setRedeemedPoints] = useState(0);

  const balance = usePointsBalance();
  const isDevice = tab === "Device";
  const rate = redeemRates[tab] ?? redeemRates["Cash"]!;
  const spend = Number(amount) || 0;
  const total = Math.floor(spend / rate.points);
  const selected = redeemDevices.find((d) => d.id === deviceId) ?? null;
  const canRedeemDevice = !!selected && selected.points <= balance;

  return (
    <GamScreen
      title="Wallet Point"
      backTo="/gamification"
      right={
        <Link
          to="/points/history"
          aria-label="History Points"
          className="flex size-10 items-center justify-center rounded-full bg-card shadow-sm transition-colors hover:bg-accent"
        >
          <HistoryIcon className="size-4 text-foreground" />
        </Link>
      }

      footer={
        <>
          <div className="rounded-2xl bg-card p-4 shadow-[0_2px_10px_rgba(15,42,80,0.06)]">
            <div className="flex items-center justify-between border-b border-border pb-3 text-[14px]">
              <span className="text-muted-foreground">You Spend</span>
              <span className="font-semibold text-foreground">
                {isDevice ? `${fmt(selected?.points ?? 0)} PTS` : `${spend} PTS`}
              </span>
            </div>
            <div className="flex items-center justify-between pt-3 text-[14px]">
              <span className="text-primary">{isDevice ? "Selected Device" : `Total ${rate.unitLabel}`}</span>
              <span className="font-semibold text-primary">
                {isDevice ? (selected?.name ?? "—") : `${total} ${rate.unitLabel}`}
              </span>
            </div>
          </div>
          {isDevice ? (
            <PrimaryButton
              disabled={!canRedeemDevice}
              onClick={() => setConfirmOpen(true)}
            >
              Redeem
            </PrimaryButton>
          ) : (
            <PrimaryButton
              onClick={() => {
                if (total < 1) {
                  toast.error("Not enough points for this redemption");
                  return;
                }
                toast.success(`Redeemed ${total} ${rate.unitLabel}`);
                setAmount("");
              }}
            >
              Redeem
            </PrimaryButton>
          )}
        </>
      }
    >
      <WalletBanner
        points={balance}
        balance={dealer.walletBalance}
        currency={dealer.currency}
        right={
          <Link
            to="/points/convert"
            className="rounded-full bg-white px-4 py-1.5 text-[13px] font-medium text-primary"
          >
            Convert
          </Link>
        }
      />

      <PillTabs tabs={redeemTabs} value={tab as (typeof redeemTabs)[number]} onChange={setTab} />

      {isDevice ? (
        <>
          <div className="flex gap-2.5 rounded-2xl bg-card p-3.5 shadow-sm">
            <Info className="mt-0.5 size-4 shrink-0 text-primary" />
            <div className="text-[13px] leading-relaxed">
              <p className="font-semibold text-primary">Message here</p>
              <p className="text-foreground/70">
                Choose a device to redeem. Each device has its own required points.
              </p>
              <p className="text-foreground/70">
                Your balance: <span className="text-primary">{fmt(balance)} PTS</span>
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <p className="text-[14px] text-foreground">Available devices</p>
            {redeemDevices.map((d) => {
              const missing = d.points - balance;
              const eligible = missing <= 0 && d.stock !== "Out of stock";
              const isSel = deviceId === d.id;
              return (
                <button
                  key={d.id}
                  type="button"
                  disabled={!eligible}
                  aria-pressed={isSel}
                  onClick={() => setDeviceId(isSel ? null : d.id)}
                  className={`flex w-full items-center gap-3 rounded-2xl border bg-card p-3 text-left shadow-[0_2px_10px_rgba(15,42,80,0.06)] transition-colors ${
                    isSel ? "border-primary ring-1 ring-primary" : "border-transparent"
                  } ${eligible ? "" : "opacity-70"}`}
                >
                  <span className="flex size-14 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-2xl">
                    {d.emoji}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-[14px] font-semibold text-foreground">
                      {d.name}
                    </span>
                    <span className="block text-[13px] font-semibold text-primary">
                      {fmt(d.points)} PTS
                    </span>
                    {eligible ? (
                      <span className="mt-0.5 block text-[11px] text-muted-foreground">{d.stock}</span>
                    ) : (
                      <span className="mt-0.5 flex items-center gap-1 text-[11px] font-medium text-rose-500">
                        <Lock className="size-3" />
                        {d.stock === "Out of stock"
                          ? "Out of stock"
                          : `You need ${fmt(missing)} more PTS`}
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
        </>
      ) : (
        <>
          <div className="flex gap-2.5 rounded-2xl bg-card p-3.5 shadow-sm">
            <Info className="mt-0.5 size-4 shrink-0 text-primary" />
            <div className="text-[13px] leading-relaxed">
              <p className="font-semibold text-primary">Message here</p>
              <p className="text-foreground/70">Convert your points into {tab.toLowerCase()}s easily.</p>
              <p className="text-foreground/70">
                For every <span className="text-primary">( {rate.points.toLocaleString()} points )</span>, you get{" "}
                <span className="text-primary">( {rate.unit} )</span>
              </p>
            </div>
          </div>

          <div>
            <p className="mb-2 text-[14px] text-foreground">Enter the points you want to redeem</p>
            <input
              inputMode="numeric"
              value={amount}
              onChange={(e) => setAmount(e.target.value.replace(/\D/g, ""))}
              placeholder="Enter the Points"
              aria-label="Points to redeem"
              className="w-full rounded-xl bg-white px-4 py-3.5 text-[14px] text-foreground outline-none placeholder:text-muted-foreground"
            />
          </div>
        </>
      )}

      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent className="max-w-[340px] rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-[16px]">Redeem Device?</DialogTitle>
          </DialogHeader>
          {selected && (
            <div className="space-y-3">
              <div>
                <p className="text-[14px] font-semibold text-foreground">{selected.name}</p>
                <p className="text-[13px] text-muted-foreground">
                  {fmt(selected.points)} PTS will be deducted from your points balance.
                </p>
              </div>
              <div className="rounded-xl bg-slate-100 p-3 text-[13px]">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Current Balance</span>
                  <span className="font-semibold text-foreground">{fmt(balance)} PTS</span>
                </div>
                <div className="mt-2 flex items-center justify-between">
                  <span className="text-muted-foreground">Remaining Balance</span>
                  <span className="font-semibold text-primary">
                    {fmt(balance - selected.points)} PTS
                  </span>
                </div>
              </div>
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
                    redeemDevice(selected.name, selected.points);
                    setRedeemedName(selected.name);
                    setRedeemedPoints(selected.points);
                    setDeviceId(null);
                    setConfirmOpen(false);
                    setSuccessOpen(true);
                  }}
                  className="flex-1 rounded-xl bg-primary py-3 text-[14px] font-medium text-primary-foreground"
                >
                  Confirm Redemption
                </button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={successOpen} onOpenChange={setSuccessOpen}>
        <DialogContent className="max-w-[340px] rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-[16px]">Device Redeemed</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 text-center">
            <span className="mx-auto flex size-14 items-center justify-center rounded-full bg-emerald-100">
              <Check className="size-7 text-emerald-600" />
            </span>
            <p className="text-[14px] text-foreground">
              Your {redeemedName} has been redeemed successfully.
            </p>
            <p className="text-[13px] text-muted-foreground">
              {fmt(redeemedPoints)} PTS were deducted from your points balance.
            </p>
            <button
              type="button"
              onClick={() => setSuccessOpen(false)}
              className="w-full rounded-xl bg-primary py-3 text-[14px] font-medium text-primary-foreground"
            >
              Done
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </GamScreen>
  );
}
