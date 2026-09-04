import { useState } from "react";
import { X } from "lucide-react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { mysteryBoxReward } from "@/lib/gamification";
import { PrimaryButton } from "./ui";

/**
 * Mystery Box experience shown as a centered modal popup on top of the current
 * screen. The revealed reward is resolved server-side in production; here it is
 * provided by the shared mystery box service call below.
 */
async function requestMysteryReward(): Promise<{ label: string }> {
  return { label: mysteryBoxReward.label };
}

export function MysteryBox({
  size = 120,
  locked = false,
  shaking = false,
}: {
  size?: number;
  locked?: boolean;
  shaking?: boolean;
}) {
  return (
    <div
      className={`relative flex items-center justify-center rounded-3xl bg-gradient-to-br from-sky-100 to-indigo-100 ${
        locked ? "opacity-70 grayscale" : ""
      } ${shaking ? "animate-bounce" : ""}`}
      style={{ width: size, height: size }}
      aria-hidden
    >
      <span style={{ fontSize: size * 0.5 }}>🎁</span>
      {locked && (
        <span className="absolute bottom-2 right-2 rounded-full bg-white px-2 py-0.5 text-[12px] shadow">
          🔒
        </span>
      )}
    </div>
  );
}

export function MysteryBoxSheet({
  open,
  onOpenChange,
  onOpened,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onOpened?: (() => void) | undefined;
}) {
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  const close = () => {
    onOpenChange(false);
    setResult(null);
    setBusy(false);
  };

  const openBox = async () => {
    if (busy || result) return;
    setBusy(true);
    const { label } = await requestMysteryReward();
    window.setTimeout(() => {
      setBusy(false);
      setResult(label);
      onOpened?.();
    }, 1600);
  };

  return (
    <Dialog open={open} onOpenChange={(v) => (v ? onOpenChange(true) : close())}>
      <DialogContent className="m-4 max-h-[calc(100vh-2rem)] w-[calc(100%-2rem)] max-w-sm overflow-y-auto rounded-3xl border-0 bg-background p-4 shadow-2xl [&>button]:hidden">
        <div className="flex items-center justify-between">
          <span className="size-8" />
          <DialogTitle className="text-[19px] font-semibold">Mystery Box</DialogTitle>
          <button
            aria-label="Close"
            onClick={close}
            className="flex size-8 items-center justify-center rounded-full border border-border"
          >
            <X className="size-4 text-muted-foreground" />
          </button>
        </div>

        <div className="mt-5 flex justify-center">
          <MysteryBox size={180} shaking={busy} />
        </div>

        {result ? (
          <div className="mt-5 text-center">
            <p className="text-[17px] font-semibold text-foreground">Congratulations! 🎉</p>
            <p className="mt-1 text-[13px] text-muted-foreground">You won</p>
            <p className="text-[20px] font-bold text-primary">{result}</p>
          </div>
        ) : (
          <p className="mt-4 text-center text-[13px] text-muted-foreground">
            {busy ? "Opening your mystery box…" : "Tap below to reveal your reward"}
          </p>
        )}

        <div className="mt-5">
          {result ? (
            <PrimaryButton onClick={close}>Done</PrimaryButton>
          ) : (
            <PrimaryButton onClick={openBox} disabled={busy}>
              {busy ? "Opening…" : "Open Mystery Box"}
            </PrimaryButton>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
