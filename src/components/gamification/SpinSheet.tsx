import { useState } from "react";
import { X } from "lucide-react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { spin as spinConfig } from "@/lib/gamification";
import { actions, useSpin } from "@/lib/gamification-state";
import { PrimaryButton, SpinWheel } from "./ui";

/**
 * Spin experience shown as a centered modal popup on top of the current screen.
 * The winning outcome is resolved server-side in production; here it is
 * provided by the shared spin service call below.
 */
async function requestSpinResult(): Promise<{ index: number; label: string }> {
  // Placeholder for the backend spin call — result is not decided by the UI.
  const index = Math.floor(Math.random() * spinConfig.outcomes.length);
  return { index, label: spinConfig.outcomes[index]! };
}

export function SpinSheet({
  open,
  onOpenChange,
  freeSpin = false,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  /** Labels the entitlement as a scheduled free spin. */
  freeSpin?: boolean;
}) {

  const s = useSpin();
  const [angle, setAngle] = useState(0);
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  const close = () => {
    onOpenChange(false);
    setResult(null);
  };

  const doSpin = async () => {
    if (busy || s.available < 1) return;
    setBusy(true);
    setResult(null);
    const { index, label } = await requestSpinResult();
    const seg = 360 / spinConfig.outcomes.length;
    setAngle((a) => a + 360 * 5 + (360 - (index * seg + seg / 2)));
    window.setTimeout(() => {
      actions.spin(label);
      setBusy(false);
      setResult(label);
    }, 3200);
  };

  const won = result && !/better luck/i.test(result);

  return (
    <Dialog open={open} onOpenChange={(v) => (v ? onOpenChange(true) : close())}>
      <DialogContent className="m-4 max-h-[calc(100vh-2rem)] w-[calc(100%-2rem)] max-w-sm overflow-y-auto rounded-3xl border-0 bg-background p-4 shadow-2xl [&>button]:hidden">
        <div className="flex items-center justify-between">
          <span className="size-8" />
          <DialogTitle className="text-[19px] font-semibold">Spin The Wheel</DialogTitle>
          <button
            aria-label="Close"
            onClick={close}
            className="flex size-8 items-center justify-center rounded-full border border-border"
          >
            <X className="size-4 text-muted-foreground" />
          </button>
        </div>

        <div className="mt-4 text-center">
          <p className="text-[15px] font-semibold text-foreground">
            {freeSpin && !result
              ? `${s.available} Free ${s.available === 1 ? "Spin" : "Spins"}`
              : `${s.available} ${s.available === 1 ? "Spin" : "Spins"} ${
                  result ? "Remaining" : "Available"
                }`}
          </p>

          {spinConfig.expiry && (
            <p className="text-[12px] text-muted-foreground">Expires {spinConfig.expiry}</p>
          )}
        </div>

        <div className="mt-4 flex justify-center">
          <div
            className="transition-transform duration-[3000ms] ease-out"
            style={{ transform: `rotate(${angle}deg)` }}
          >
            <SpinWheel size={200} />
          </div>
        </div>

        {result && !busy && (
          <div className="mt-5 text-center">
            <p className="text-[17px] font-semibold text-foreground">
              {won ? "Congratulations! 🎉" : "Better Luck Next Time"}
            </p>
            {won && (
              <>
                <p className="mt-1 text-[13px] text-muted-foreground">You won</p>
                <p className="text-[20px] font-bold text-primary">{result}</p>
              </>
            )}
          </div>
        )}

        <div className="mt-5">
          {result && !busy ? (
            s.available > 0 ? (
              <PrimaryButton onClick={doSpin}>Spin Again</PrimaryButton>
            ) : (
              <PrimaryButton onClick={close}>{won ? "Done" : "Close"}</PrimaryButton>
            )
          ) : (
            <PrimaryButton onClick={doSpin} disabled={busy || s.available < 1}>
              {busy ? "Spinning…" : s.available < 1 ? "No Spins Available" : "Spin"}
            </PrimaryButton>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
