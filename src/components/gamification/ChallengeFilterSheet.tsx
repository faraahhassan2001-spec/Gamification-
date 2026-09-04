import { useState } from "react";
import { Calendar, X } from "lucide-react";
import { Drawer, DrawerContent, DrawerTitle } from "@/components/ui/drawer";
import { PrimaryButton } from "./ui";
import type { Competition, CompetitionRewardKind } from "@/lib/gamification";

const statusOptions = ["All", "On Track", "At Risk", "Succeed"] as const;
const rewardOptions = [
  "All",
  "Spin the wheel",
  "Rewards",
  "Mystery Box",
  "Points",
  "Device",
] as const;

type StatusOption = (typeof statusOptions)[number];
type RewardOption = (typeof rewardOptions)[number];

const statusMap: Record<StatusOption, string[]> = {
  All: [],
  "On Track": ["On Track"],
  "At Risk": ["At Risk"],
  Succeed: ["Succeeded", "Completed"],
};

const rewardKindMap: Record<RewardOption, CompetitionRewardKind | "all"> = {
  All: "all",
  "Spin the wheel": "spin",
  Rewards: "cash",
  "Mystery Box": "mystery",
  Points: "points",
  Device: "device",
};

export type ChallengeFilters = {
  status: StatusOption;
  reward: RewardOption;
  date: string;
};

export function ChallengeFilterSheet({
  open,
  onOpenChange,
  onApply,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onApply: (filters: ChallengeFilters) => void;
}) {
  const [status, setStatus] = useState<StatusOption>("All");
  const [reward, setReward] = useState<RewardOption>("All");
  const [date, setDate] = useState("");

  const handleApply = () => {
    onApply({ status, reward, date });
    onOpenChange(false);
  };

  const handleClear = () => {
    setStatus("All");
    setReward("All");
    setDate("");
    onApply({ status: "All", reward: "All", date: "" });
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

        <div className="space-y-5">
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

          <section>
            <p className="mb-2.5 text-[14px] font-semibold text-foreground">Rewards Type</p>
            <div className="flex flex-wrap gap-2">
              {rewardOptions.map((opt) => {
                const selected = reward === opt;
                return (
                  <button
                    key={opt}
                    onClick={() => setReward(opt)}
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

          <section>
            <p className="mb-2.5 text-[14px] font-semibold text-foreground">Date Duration</p>
            <div className="flex items-center gap-2 rounded-2xl bg-card px-3 py-2.5 shadow-sm">
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="flex-1 bg-transparent text-[14px] text-foreground outline-none"
              />
              <Calendar className="size-5 text-muted-foreground" />
            </div>
          </section>
        </div>

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

export function applyChallengeFilters(
  list: Competition[],
  filters: ChallengeFilters
): Competition[] {
  return list.filter((c) => {
    if (filters.status !== "All" && !statusMap[filters.status].includes(c.status)) {
      return false;
    }
    if (filters.reward !== "All" && c.rewardKind !== rewardKindMap[filters.reward]) {
      return false;
    }
    return true;
  });
}
