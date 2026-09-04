import { createFileRoute, useNavigate, useParams } from "@tanstack/react-router";
import { useState } from "react";
import { CheckCircle2, Coins, Lock, Package } from "lucide-react";
import { toast } from "sonner";
import { Card, EmptyState, Pill, Screen, SectionTitle } from "@/components/gamification/Screen";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { formatPoints, isItemLocked, marketplace, points } from "@/lib/gamification";
import { actions } from "@/lib/gamification-state";

export const Route = createFileRoute("/marketplace/$id")({
  head: () => ({
    meta: [
      { title: "Marketplace Item — Dealer Gamification" },
      {
        name: "description",
        content: "Item cost in points, stock, tier requirement and redemption confirmation before spending points.",
      },
      { property: "og:title", content: "Marketplace Item — Dealer Gamification" },
      { property: "og:description", content: "Redeem points for this marketplace item." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: MarketplaceItemScreen,
});

function MarketplaceItemScreen() {
  const { id } = useParams({ from: "/marketplace/$id" });
  const navigate = useNavigate();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [done, setDone] = useState(false);
  const item = marketplace.find((m) => m.id === id);

  if (!item) {
    return (
      <Screen title="Marketplace" backTo="/rewards">
        <EmptyState message="This item is no longer available." />
      </Screen>
    );
  }

  const locked = isItemLocked(item);
  const outOfStock = item.stock <= 0;
  const notEnough = points.balance < item.cost;
  const canRedeem = !locked && !outOfStock && !notEnough;
  const remaining = points.balance - item.cost;

  return (
    <Screen title="Marketplace Item" backTo="/rewards">
      <Card className="text-center">
        <span className="mx-auto mb-3 flex size-20 items-center justify-center rounded-3xl bg-secondary">
          {locked ? (
            <Lock className="size-8 text-muted-foreground" />
          ) : (
            <Package className="size-8 text-primary" />
          )}
        </span>
        <p className="text-[18px] font-bold text-foreground">{item.name}</p>
        <p className="mt-1 text-[16px] font-semibold text-primary">{formatPoints(item.cost)} pts</p>
        <p className="mt-1 text-[12px] text-muted-foreground">
          {outOfStock ? "Out of stock" : `${item.stock} available`}
        </p>
        {locked && (
          <Pill className="mt-2 inline-block bg-status-closed-bg text-status-closed">
            Requires {item.requiredTier} Tier
          </Pill>
        )}
      </Card>

      <Card>
        <SectionTitle>Description</SectionTitle>
        <p className="text-[13px] leading-relaxed text-muted-foreground">{item.description}</p>
      </Card>

      <Card>
        <div className="flex items-center gap-2 text-[13px]">
          <Coins className="size-4 text-primary" />
          <span className="text-muted-foreground">Your balance</span>
          <span className="ml-auto font-semibold text-foreground">{formatPoints(points.balance)} pts</span>
        </div>
        {notEnough && !locked && (
          <p className="mt-2 text-[12px] text-status-closed">
            You need {formatPoints(item.cost - points.balance)} more points to redeem this item.
          </p>
        )}
      </Card>

      <button
        disabled={!canRedeem}
        onClick={() => setConfirmOpen(true)}
        className="w-full rounded-2xl bg-primary py-3 text-[14px] font-semibold text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50"
      >
        {locked ? "Locked" : outOfStock ? "Out of Stock" : "Redeem"}
      </button>

      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent className="max-w-[20rem] rounded-3xl">
          <div className="flex flex-col items-center text-center">
            <span className="mb-3 flex size-12 items-center justify-center rounded-full bg-primary/10">
              <Package className="size-6 text-primary" />
            </span>
            <DialogTitle className="text-[16px]">Confirm Redemption</DialogTitle>
            <div className="mt-3 w-full space-y-1.5 rounded-2xl bg-secondary p-3 text-[13px]">
              <Line label="Item" value={item.name} />
              <Line label="Cost" value={`${formatPoints(item.cost)} pts`} />
              <Line label="Remaining Balance" value={`${formatPoints(remaining)} pts`} />
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
                  actions.redeem(item.id);
                  setConfirmOpen(false);
                  setDone(true);
                }}
                className="flex-1 rounded-2xl bg-primary py-2.5 text-[13px] font-semibold text-primary-foreground"
              >
                Confirm
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={done} onOpenChange={setDone}>
        <DialogContent className="max-w-[20rem] rounded-3xl">
          <div className="flex flex-col items-center text-center">
            <span className="mb-3 flex size-12 items-center justify-center rounded-full bg-status-resolved-bg">
              <CheckCircle2 className="size-6 text-status-resolved" />
            </span>
            <DialogTitle className="text-[16px]">Redemption Successful</DialogTitle>
            <p className="mt-2 text-[13px] text-muted-foreground">
              {item.name} has been added to My Rewards. You can track its delivery there.
            </p>
            <button
              onClick={() => {
                setDone(false);
                toast.success("Item redeemed");
                navigate({ to: "/rewards" });
              }}
              className="mt-5 w-full rounded-2xl bg-primary py-2.5 text-[13px] font-semibold text-primary-foreground"
            >
              View My Rewards
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </Screen>
  );
}

function Line({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="text-muted-foreground">{label}</span>
      <span className="text-right font-semibold text-foreground">{value}</span>
    </div>
  );
}
