import { useEffect, useMemo, useState } from "react";
import { Check, CheckCircle2, Clock, Gift, X } from "lucide-react";
import { toast } from "sonner";
import { Link } from "@tanstack/react-router";
import { Drawer, DrawerContent, DrawerTitle } from "@/components/ui/drawer";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { competitionRewardIcon } from "@/lib/gamification";
import { actions, useCompetitions, useRewardsReady } from "@/lib/gamification-state";
import { GreenProgress, PrimaryButton, StatusChip } from "./ui";

export function RewardsReadySheet({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
}) {
  const ready = useRewardsReady();
  const [selected, setSelected] = useState<string[]>([]);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [successOpen, setSuccessOpen] = useState(false);
  const [claimedCount, setClaimedCount] = useState(0);
  const single = ready.length === 1;

  // Nothing pre-selected when the sheet opens.
  useEffect(() => {
    if (open) setSelected([]);
  }, [open]);

  const eligible = useMemo(() => ready.filter((r) => r.status === "Granted"), [ready]);
  const selectedRewards = ready.filter((r) => selected.includes(r.id));
  const allSelected = eligible.length > 0 && selected.length === eligible.length;

  const toggle = (id: string) =>
    setSelected((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));

  const ctaLabel =
    selectedRewards.length > 1 ? `Claim ${selectedRewards.length} Rewards` : "Claim Reward";

  return (
    <>
      <Drawer open={open} onOpenChange={onOpenChange}>
        <DrawerContent className="mx-auto max-w-md rounded-t-3xl px-4 pb-6">
          <div className="flex items-center justify-between pt-2">
            <span className="size-8" />
            <DrawerTitle className="text-[19px] font-semibold">
              {ready.length} {single ? "Reward" : "Rewards"} Ready
            </DrawerTitle>
            <button
              aria-label="Close"
              onClick={() => onOpenChange(false)}
              className="flex size-8 items-center justify-center rounded-full border border-border"
            >
              <X className="size-4 text-muted-foreground" />
            </button>
          </div>

          {eligible.length > 1 && (
            <div className="mt-3 flex justify-end">
              <button
                onClick={() => setSelected(allSelected ? [] : eligible.map((r) => r.id))}
                className="text-[12px] font-medium text-muted-foreground underline underline-offset-2"
              >
                {allSelected ? "Deselect All" : "Select All"}
              </button>
            </div>
          )}

          <div className="mt-3 space-y-2.5">
            {ready.map((r) => {
              const claimable = r.status === "Granted";
              const isSelected = selected.includes(r.id);
              return (
                <button
                  key={r.id}
                  type="button"
                  disabled={!claimable}
                  onClick={() => toggle(r.id)}
                  className={`flex w-full items-center gap-3 rounded-2xl px-3 py-3 text-left transition-colors ${
                    isSelected ? "bg-primary/5 ring-1 ring-primary/30" : "bg-slate-50"
                  } ${claimable ? "" : "opacity-60"}`}
                >
                  <span
                    className={`flex size-5 shrink-0 items-center justify-center rounded-md border ${
                      isSelected ? "border-primary bg-primary" : "border-border bg-white"
                    }`}
                  >
                    {isSelected && <Check className="size-3.5 text-primary-foreground" />}
                  </span>
                  <span className="flex size-9 items-center justify-center rounded-full bg-white text-[16px] shadow-sm">
                    {r.type === "Physical Gift" ? "🎁" : r.type === "Spin Entitlement" ? "🎡" : "💰"}
                  </span>
                  <div className="flex-1">
                    <p className="text-[13px] font-semibold text-foreground">{r.title}</p>
                    <p className="text-[12px] text-muted-foreground">{r.subtitle}</p>
                  </div>
                  <StatusChip>{r.status}</StatusChip>
                </button>
              );
            })}
            {ready.length === 0 && (
              <p className="rounded-2xl bg-slate-50 p-4 text-center text-[13px] text-muted-foreground">
                No rewards waiting to be claimed.
              </p>
            )}
          </div>

          {ready.length > 0 && (
            <div className="mt-5">
              <PrimaryButton
                disabled={selectedRewards.length === 0}
                onClick={() => setConfirmOpen(true)}
              >
                {ctaLabel}
              </PrimaryButton>
            </div>
          )}
        </DrawerContent>
      </Drawer>

      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent className="max-w-[20rem] rounded-3xl">
          <div className="flex flex-col items-center text-center">
            <span className="mb-3 flex size-12 items-center justify-center rounded-full bg-primary/10">
              <Gift className="size-6 text-primary" />
            </span>
            <DialogTitle className="text-[16px]">
              {selectedRewards.length > 1
                ? `Claim ${selectedRewards.length} Rewards?`
                : "Claim Reward?"}
            </DialogTitle>
            <p className="mt-2 text-[13px] text-muted-foreground">You’re about to claim:</p>
            <div className="mt-3 w-full space-y-1.5 rounded-2xl bg-slate-50 p-3 text-left">
              {selectedRewards.map((r) => (
                <p key={r.id} className="text-[13px] font-semibold text-foreground">
                  {selectedRewards.length > 1 ? `• ${r.title}` : r.title}
                </p>
              ))}
            </div>
            <div className="mt-5 flex w-full gap-2">
              <button
                onClick={() => setConfirmOpen(false)}
                className="flex-1 rounded-2xl border border-border py-2.5 text-[13px] font-semibold text-foreground"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  const count = selectedRewards.length;
                  selectedRewards.forEach((r) => actions.claim(r.id));
                  setClaimedCount(count);
                  setSelected([]);
                  setConfirmOpen(false);
                  onOpenChange(false);
                  setSuccessOpen(true);
                }}
                className="flex-1 rounded-2xl bg-primary py-2.5 text-[13px] font-semibold text-primary-foreground"
              >
                {selectedRewards.length > 1 ? "Claim Rewards" : "Claim Reward"}
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog
        open={successOpen}
        onOpenChange={(v) => {
          setSuccessOpen(v);
          if (!v) toast.success(claimedCount > 1 ? "Rewards claimed" : "Reward claimed");
        }}
      >
        <DialogContent className="max-w-[20rem] rounded-3xl">
          <div className="flex flex-col items-center text-center">
            <span className="mb-3 flex size-12 items-center justify-center rounded-full bg-emerald-50">
              <CheckCircle2 className="size-6 text-emerald-600" />
            </span>
            <DialogTitle className="text-[16px]">
              {claimedCount > 1 ? "Rewards Claimed" : "Reward Claimed"}
            </DialogTitle>
            <p className="mt-2 text-[13px] text-muted-foreground">
              {claimedCount > 1
                ? `${claimedCount} rewards were claimed successfully.`
                : "1 reward was claimed successfully."}
            </p>
            <button
              onClick={() => setSuccessOpen(false)}
              className="mt-5 w-full rounded-2xl bg-primary py-2.5 text-[13px] font-semibold text-primary-foreground"
            >
              Done
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}


export function EndingSoonSheet({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
}) {
  const list = useCompetitions().filter((c) => c.endingIn);
  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="mx-auto max-w-md rounded-t-3xl px-4 pb-8">
        <DrawerTitle className="pt-2 text-center text-[19px] font-semibold">Ending Soon</DrawerTitle>
        <div className="mt-4 space-y-3">
          {list.map((c) => (
            <Link
              key={c.id}
              to="/challenge/$id"
              params={{ id: c.id }}
              className="block rounded-2xl bg-slate-50/80 p-4 active:scale-[0.99]"
            >
              <div className="flex items-start justify-between">
                <p className="text-[14px] font-semibold text-foreground">{c.title}</p>
                <StatusChip>{c.endingIn}</StatusChip>
              </div>
              <p className="mt-1.5 flex items-center gap-2 text-[13px] text-muted-foreground">
                <span className="text-[15px]">{competitionRewardIcon[c.rewardKind]}</span>
                {c.rewardLabel}
              </p>
              <div className="mt-3 flex items-center justify-between text-[12px] text-muted-foreground">
                <span>
                  {c.current} / {c.target}
                </span>
                <span>{Math.max(0, c.target - c.current)} to go</span>
              </div>
              <div className="mt-1.5">
                <GreenProgress percent={Math.round((c.current / c.target) * 100)} />
              </div>
              <div className="mt-3 flex items-center gap-4 text-[12px] text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <Clock className="size-3.5 text-teal-500" />
                  {c.dateRange}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </DrawerContent>
    </Drawer>
  );
}
