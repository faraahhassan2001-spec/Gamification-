import { useState } from "react";
import { X } from "lucide-react";
import { Drawer, DrawerContent, DrawerTitle } from "@/components/ui/drawer";
import { PrimaryButton } from "./ui";
import type { RewardStatus } from "@/lib/gamification";

const statusOptions = [
  "All",
  "Granted",
  "Claimed",
  "Fulfilled",
  "Pending Approval",
  "Rejected",
  "Expired",
  "Cancelled",
] as const;

type StatusOption = (typeof statusOptions)[number];

export type RewardFilters = {
  status: StatusOption;
};

export function RewardFilterSheet({
  open,
  onOpenChange,
  onApply,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onApply: (filters: RewardFilters) => void;
}) {
  const [status, setStatus] = useState<StatusOption>("All");

  const handleApply = () => {
    onApply({ status });
    onOpenChange(false);
  };

  const handleClear = () => {
    setStatus("All");
    onApply({ status: "All" });
  };

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="mx-auto max-w-md rounded-t-3xl px-4 pb-8 pt-2">
        <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-slate-200" />
        <div className="mb-5 flex items-start justify-between">
          <div>
            <DrawerTitle className="text-[19px] font-semibold text-foreground">
              Filter
            </DrawerTitle>
            <p className="text-[13px] text-muted-foreground">
              Please choose your filter options
            </p>
          </div>
          <button
            aria-label="Close"
            onClick={() => onOpenChange(false)}
            className="flex size-8 items-center justify-center rounded-full border border-border"
          >
            <X className="size-4 text-muted-foreground" />
          </button>
        </div>

        <section>
          <p className="mb-2.5 text-[14px] font-semibold text-foreground">Status</p>
          <div className="flex flex-wrap gap-2">
            {statusOptions.map((opt) => {
              const selected = status === opt;
              return (
                <button
                  key={opt}
                  onClick={() => setStatus(opt)}
                  className={`rounded-full px-4 py-2 text-[13px] font-medium transition-colors ${
                    selected
                      ? "bg-primary text-primary-foreground"
                      : "bg-slate-100 text-foreground hover:bg-slate-200"
                  }`}
                >
                  {opt}
                </button>
              );
            })}
          </div>
        </section>

        <div className="mt-6 space-y-3">
          <PrimaryButton onClick={handleApply}>Apply</PrimaryButton>
          <button
            onClick={handleClear}
            className="w-full text-center text-[14px] font-medium text-primary"
          >
            Clear Filter
          </button>
        </div>
      </DrawerContent>
    </Drawer>
  );
}

export function applyRewardFilters<T extends { status: RewardStatus }>(
  list: T[],
  filters: RewardFilters
): T[] {
  if (filters.status === "All") return list;
  return list.filter((r) => r.status === filters.status);
}
