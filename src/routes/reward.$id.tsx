import { createFileRoute, useParams } from "@tanstack/react-router";
import { useState } from "react";
import { Check, CheckCircle2, Gift, Info } from "lucide-react";
import { toast } from "sonner";
import { GamCard, GamScreen, StatusChip } from "@/components/gamification/ui";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { rewardStatusTone, rewardTrackingSteps } from "@/lib/gamification";
import { actions, useRewardRows } from "@/lib/gamification-state";

const terminalNotes: Record<string, string> = {
  "Pending Approval": "Your reward is awaiting approval before it can be claimed.",
  Rejected: "This reward request was rejected.",
  Expired: "This reward expired before it was claimed.",
  Cancelled: "This reward was cancelled.",
};

export const Route = createFileRoute("/reward/$id")({
  head: () => ({
    meta: [
      { title: "Reward Details — Dealer Gamification" },
      {
        name: "description",
        content: "Claim your earned reward and track its status from granted to fulfilled.",
      },
      { property: "og:title", content: "Reward Details — Dealer Gamification" },
      { property: "og:description", content: "Reward claim and status tracking." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: RewardDetails,
});

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between py-2.5">
      <span className="text-[13px] text-muted-foreground">{label}</span>
      <span className="text-[13px] font-semibold text-foreground">{value}</span>
    </div>
  );
}

function RewardDetails() {
  const { id } = useParams({ from: "/reward/$id" });
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [successOpen, setSuccessOpen] = useState(false);
  const reward = useRewardRows().find((r) => r.id === id);

  if (!reward) {
    return (
      <GamScreen title="Reward Details" backTo="/rewards">
        <GamCard>
          <p className="py-6 text-center text-[13px] text-muted-foreground">
            This reward is no longer available.
          </p>
        </GamCard>
      </GamScreen>
    );
  }

  const status = reward.status;
  // Granted -> Claimed -> Fulfilled is the happy path; the other statuses are terminal.
  const onHappyPath = rewardTrackingSteps.includes(status);
  const stepIndex = rewardTrackingSteps.indexOf(status);

  return (
    <GamScreen title="Reward Details" backTo="/rewards">
      <GamCard className="text-center">
        <span className="mx-auto mb-3 flex size-16 items-center justify-center rounded-full bg-primary/10">
          <Gift className="size-8 text-primary" />
        </span>
        <p className="text-[18px] font-bold text-foreground">{reward.title}</p>
        <p className="text-[12px] text-muted-foreground">{reward.subtitle}</p>
        <div className="mt-2">
          <StatusChip tone={rewardStatusTone(status)}>{status}</StatusChip>
        </div>
      </GamCard>

      <GamCard>
        <h2 className="mb-1 text-[15px] font-semibold text-foreground">Reward Information</h2>
        <div className="divide-y divide-border">
          <Row label="Reward Type" value={reward.type} />
          <Row label="Source" value={reward.subtitle} />
          <Row label="Granted" value={reward.granted} />
          {reward.claimedOn && <Row label="Claimed" value={reward.claimedOn} />}
          {reward.fulfilledOn && <Row label="Fulfilled" value={reward.fulfilledOn} />}
          <Row label="Status" value={status} />
        </div>
      </GamCard>

      {onHappyPath && (
        <GamCard>
          <h2 className="mb-3 text-[15px] font-semibold text-foreground">Reward Progress</h2>
          <ol className="relative space-y-4 border-l border-border pl-5">
            {rewardTrackingSteps.map((s, i) => {
              const done = i < stepIndex;
              const current = i === stepIndex;
              const date =
                s === "Granted" ? reward.granted : s === "Claimed" ? reward.claimedOn : reward.fulfilledOn;
              return (
                <li key={s} className="relative">
                  <span
                    className={`absolute -left-[1.92rem] flex size-6 items-center justify-center rounded-full ${
                      done
                        ? "bg-emerald-50 text-emerald-600"
                        : current
                          ? "bg-primary/10 text-primary"
                          : "bg-slate-100 text-muted-foreground"
                    }`}
                  >
                    {done ? (
                      <Check className="size-3.5" />
                    ) : (
                      <span className="size-1.5 rounded-full bg-current" />
                    )}
                  </span>
                  <p
                    className={`text-[13px] ${
                      done || current ? "font-semibold text-foreground" : "text-muted-foreground"
                    }`}
                  >
                    {s}
                  </p>
                  {current && <p className="text-[12px] text-primary">Current Status</p>}
                  {!current && date && <p className="text-[12px] text-muted-foreground">{date}</p>}
                </li>
              );
            })}
          </ol>
        </GamCard>
      )}

      {!onHappyPath && (
        <GamCard className="flex items-start gap-2">
          <Info className="mt-0.5 size-4 shrink-0 text-amber-500" />
          <div>
            <p className="text-[13px] font-semibold text-foreground">{status}</p>
            <p className="text-[12px] text-muted-foreground">{terminalNotes[status]}</p>
          </div>
        </GamCard>
      )}

      {reward.note && (
        <GamCard className="flex items-start gap-2">
          <Info className="mt-0.5 size-4 shrink-0 text-primary" />
          <div>
            <p className="text-[13px] font-semibold text-foreground">Note</p>
            <p className="text-[12px] text-muted-foreground">{reward.note}</p>
          </div>
        </GamCard>
      )}

      {reward.needsClaim && status === "Granted" && (
        <button
          onClick={() => setConfirmOpen(true)}
          className="w-full rounded-2xl bg-primary py-3 text-[14px] font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
        >
          Claim Reward
        </button>
      )}

      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent className="max-w-[20rem] rounded-3xl">
          <div className="flex flex-col items-center text-center">
            <span className="mb-3 flex size-12 items-center justify-center rounded-full bg-primary/10">
              <Gift className="size-6 text-primary" />
            </span>
            <DialogTitle className="text-[16px]">Claim Reward?</DialogTitle>
            <p className="mt-2 text-[13px] text-muted-foreground">
              Are you sure you want to claim this reward?
            </p>
            <div className="mt-3 w-full rounded-2xl bg-slate-50 p-3 text-left">
              <p className="text-[12px] text-muted-foreground">Reward</p>
              <p className="text-[13px] font-semibold text-foreground">{reward.title}</p>
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
                  actions.claim(reward.id);
                  setConfirmOpen(false);
                  setSuccessOpen(true);
                }}
                className="flex-1 rounded-2xl bg-primary py-2.5 text-[13px] font-semibold text-primary-foreground"
              >
                Claim Reward
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog
        open={successOpen}
        onOpenChange={(v) => {
          setSuccessOpen(v);
          if (!v) toast.success("Reward claimed");
        }}
      >
        <DialogContent className="max-w-[20rem] rounded-3xl">
          <div className="flex flex-col items-center text-center">
            <span className="mb-3 flex size-12 items-center justify-center rounded-full bg-emerald-50">
              <CheckCircle2 className="size-6 text-emerald-600" />
            </span>
            <DialogTitle className="text-[16px]">Reward Claimed</DialogTitle>
            <p className="mt-2 text-[13px] text-muted-foreground">
              Your reward has been claimed successfully.
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
    </GamScreen>
  );
}
