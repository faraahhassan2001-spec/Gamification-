import { useState } from "react";
import { Check, CheckCircle2 } from "lucide-react";
import { Drawer, DrawerContent, DrawerTitle } from "@/components/ui/drawer";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { cashConversionOffer, conversionWalletOptions } from "@/lib/gamification";
import { convertPoints } from "@/lib/gamification-state";
import { PrimaryButton } from "./ui";

export function ConvertPointsSheet({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
}) {
  const [walletId, setWalletId] = useState<string | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [successOpen, setSuccessOpen] = useState(false);

  const offer = cashConversionOffer;

  const close = () => {
    onOpenChange(false);
    setWalletId(null);
  };

  return (
    <>
      <Drawer open={open} onOpenChange={(v) => (v ? onOpenChange(true) : close())}>
        <DrawerContent className="mx-auto max-w-md rounded-t-3xl px-4 pb-8">
          <DrawerTitle className="mt-2 text-center text-[19px] font-semibold">
            Convert Points
          </DrawerTitle>
          <p className="text-center text-[13px] text-muted-foreground">
            Convert {offer.points} pts to {offer.jod} JOD
          </p>

          <div className="mt-4 space-y-2 rounded-xl bg-slate-100 p-3 text-[13px]">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Points to Convert</span>
              <span className="font-semibold text-foreground">{offer.points} pts</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">You Receive</span>
              <span className="font-semibold text-primary">{offer.jod} JOD</span>
            </div>
          </div>

          <p className="mb-2 mt-4 text-[14px] font-semibold text-foreground">Select Wallet</p>
          <div className="space-y-3">
            {conversionWalletOptions.map((w) => (
              <button
                key={w.id}
                type="button"
                onClick={() => setWalletId(w.id)}
                className={`flex w-full items-center gap-3 rounded-xl bg-gradient-to-r ${w.tone} px-4 py-4 text-white shadow-sm`}
              >
                <span className="flex-1 text-left text-[15px] font-semibold">{w.name}</span>
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

          <div className="mt-5">
            <PrimaryButton disabled={!walletId} onClick={() => setConfirmOpen(true)}>
              Convert
            </PrimaryButton>
          </div>
        </DrawerContent>
      </Drawer>

      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent className="max-w-[20rem] rounded-3xl">
          <div className="flex flex-col items-center text-center">
            <span className="mb-3 flex size-12 items-center justify-center rounded-full bg-primary/10">
              <Check className="size-6 text-primary" />
            </span>
            <DialogTitle className="text-[16px]">Confirm Conversion?</DialogTitle>
            <p className="mt-2 text-[13px] text-muted-foreground">
              Convert {offer.points} pts to {offer.jod} JOD and add the amount to the selected
              wallet?
            </p>
            <div className="mt-5 flex w-full gap-2">
              <button
                onClick={() => setConfirmOpen(false)}
                className="flex-1 rounded-2xl border border-border py-2.5 text-[13px] font-semibold text-foreground"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  convertPoints(offer.points);
                  setConfirmOpen(false);
                  close();
                  setSuccessOpen(true);
                }}
                className="flex-1 rounded-2xl bg-primary py-2.5 text-[13px] font-semibold text-primary-foreground"
              >
                Confirm
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={successOpen} onOpenChange={setSuccessOpen}>
        <DialogContent className="max-w-[20rem] rounded-3xl">
          <div className="flex flex-col items-center text-center">
            <span className="mb-3 flex size-12 items-center justify-center rounded-full bg-emerald-50">
              <CheckCircle2 className="size-6 text-emerald-600" />
            </span>
            <DialogTitle className="text-[16px]">Conversion Successful</DialogTitle>
            <p className="mt-2 text-[13px] text-muted-foreground">
              {offer.jod} JOD has been added to your selected wallet.
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
