import { useEffect, useState } from "react";
import { SpinSheet } from "./SpinSheet";

const STORAGE_KEY = "scheduled-spin-gift-seen";

/** Scheduled free spin: the wheel modal opens directly on first app entry. */
export function ScheduledSpinPopup() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.sessionStorage.getItem(STORAGE_KEY)) return;
    const t = window.setTimeout(() => setOpen(true), 400);
    return () => window.clearTimeout(t);
  }, []);

  const handleOpenChange = (v: boolean) => {
    if (!v) window.sessionStorage.setItem(STORAGE_KEY, "1");
    setOpen(v);
  };

  return <SpinSheet open={open} onOpenChange={handleOpenChange} freeSpin />;
}
