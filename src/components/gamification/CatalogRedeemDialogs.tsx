import { Check } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { formatPoints, type MarketplaceCatalogItem } from "@/lib/gamification";

export function CatalogRedeemDialogs({
  selected,
  balance,
  confirmOpen,
  onConfirmOpenChange,
  onConfirmRedeem,
  successOpen,
  onSuccessOpenChange,
  redeemedName,
  redeemedPoints,
}: {
  selected: MarketplaceCatalogItem | null;
  balance: number;
  confirmOpen: boolean;
  onConfirmOpenChange: (v: boolean) => void;
  onConfirmRedeem: () => void;
  successOpen: boolean;
  onSuccessOpenChange: (v: boolean) => void;
  redeemedName: string;
  redeemedPoints: number;
}) {
  return (
    <>
      <Dialog open={confirmOpen} onOpenChange={onConfirmOpenChange}>
        <DialogContent className="max-w-[340px] rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-[16px]">Redeem Item?</DialogTitle>
          </DialogHeader>
          {selected && (
            <div className="space-y-3">
              <div>
                <p className="text-[14px] font-semibold text-foreground">{selected.name}</p>
                <p className="text-[13px] text-muted-foreground">
                  {formatPoints(selected.points)} pts will be deducted from your points balance.
                </p>
              </div>
              <div className="rounded-xl bg-slate-100 p-3 text-[13px]">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Current Balance</span>
                  <span className="font-semibold text-foreground">{formatPoints(balance)} pts</span>
                </div>
                <div className="mt-2 flex items-center justify-between">
                  <span className="text-muted-foreground">Remaining Balance</span>
                  <span className="font-semibold text-primary">
                    {formatPoints(balance - selected.points)} pts
                  </span>
                </div>
              </div>
              <div className="flex gap-3 pt-1">
                <button
                  type="button"
                  onClick={() => onConfirmOpenChange(false)}
                  className="flex-1 rounded-xl border border-border py-3 text-[14px] font-medium text-foreground"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={onConfirmRedeem}
                  className="flex-1 rounded-xl bg-primary py-3 text-[14px] font-medium text-primary-foreground"
                >
                  Confirm Redemption
                </button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={successOpen} onOpenChange={onSuccessOpenChange}>
        <DialogContent className="max-w-[340px] rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-[16px]">Item Redeemed</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 text-center">
            <span className="mx-auto flex size-14 items-center justify-center rounded-full bg-emerald-100">
              <Check className="size-7 text-emerald-600" />
            </span>
            <p className="text-[14px] text-foreground">
              Your {redeemedName} has been redeemed successfully.
            </p>
            <p className="text-[13px] text-muted-foreground">
              {formatPoints(redeemedPoints)} pts were deducted from your points balance.
            </p>
            <button
              type="button"
              onClick={() => onSuccessOpenChange(false)}
              className="w-full rounded-xl bg-primary py-3 text-[14px] font-medium text-primary-foreground"
            >
              Done
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
