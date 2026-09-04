import { useSyncExternalStore } from "react";
import type { ChallengeGroup, RewardStage } from "./gamification";
import {
  challenges as baseChallenges,
  competitions as baseCompetitions,
  myRewards as baseRewards,
  rewardRows as baseRewardRows,
  spin as baseSpin,
} from "./gamification";

/** Display date used when a reward is claimed in this demo session. */
const claimDate = "01 Sep 2026";


/**
 * Local demo state layer.
 *
 * Only dealer *actions* are stored here (join / leave / claim / redeem / spin).
 * Engine-owned values (progress, points, tiers) are never recomputed locally.
 */
type State = {
  joined: Record<string, boolean>;
  left: Record<string, boolean>;
  rewardStages: Record<string, RewardStage>;
  redeemed: string[];
  mysteryOpened: Record<string, boolean>;
  spinsUsed: number;
  lastSpinOutcome: string | null;
};

let state: State = {
  joined: {},
  left: {},
  rewardStages: {},
  redeemed: [],
  mysteryOpened: {},
  spinsUsed: 0,
  lastSpinOutcome: null,
};

const listeners = new Set<() => void>();
const emit = () => listeners.forEach((l) => l());
const subscribe = (l: () => void) => {
  listeners.add(l);
  return () => listeners.delete(l);
};

function set(patch: Partial<State>) {
  state = { ...state, ...patch };
  emit();
}

export function useGamificationState() {
  return useSyncExternalStore(
    subscribe,
    () => state,
    () => state,
  );
}

export const actions = {
  join(id: string) {
    set({ joined: { ...state.joined, [id]: true }, left: { ...state.left, [id]: false } });
  },
  leave(id: string) {
    set({ left: { ...state.left, [id]: true }, joined: { ...state.joined, [id]: false } });
  },
  claim(id: string) {
    set({ rewardStages: { ...state.rewardStages, [id]: "Claimed" } });
  },
  redeem(id: string) {
    set({ redeemed: [...state.redeemed, id] });
  },
  openMystery(id: string) {
    set({ mysteryOpened: { ...state.mysteryOpened, [id]: true } });
  },
  spin(outcome: string) {
    set({ spinsUsed: state.spinsUsed + 1, lastSpinOutcome: outcome });
  },
};

/** Challenges with the dealer's join/leave actions applied. */
export function useChallenges() {
  const s = useGamificationState();
  return baseChallenges.map((c) => {
    let group: ChallengeGroup = c.group;
    if (c.optional && s.joined[c.id] && c.group === "available") group = "in_progress";
    if (c.optional && s.left[c.id] && c.group === "in_progress") group = "available";
    return { ...c, group, isJoined: group === "in_progress" && c.optional };
  });
}

export function useMyRewards() {
  const s = useGamificationState();
  return baseRewards.map((r) => {
    const stage = s.rewardStages[r.id] ?? r.stage;
    return { ...r, stage, needsClaim: r.needsClaim && !s.rewardStages[r.id] };
  });
}

/** Rewards list with the dealer's claim actions applied. */
export function useRewardRows() {
  const s = useGamificationState();
  return baseRewardRows.map((r) => {
    if (!s.rewardStages[r.id]) return r;
    return { ...r, status: "Claimed" as const, needsClaim: false, claimedOn: claimDate };
  });
}

/** Rewards granted but not claimed yet. */
export function useRewardsReady() {
  return useRewardRows().filter((r) => r.needsClaim);
}


export function useSpin() {
  const s = useGamificationState();
  return {
    ...baseSpin,
    available: Math.max(0, baseSpin.entitlements - s.spinsUsed),
    lastOutcome: s.lastSpinOutcome,
  };
}

/** Competitions (design UI) with the dealer's join/leave actions applied. */
export function useCompetitions() {
  const s = useGamificationState();
  return baseCompetitions.map((c) => {
    let joined = c.joined;
    if (s.joined[c.id]) joined = true;
    if (s.left[c.id]) joined = false;
    return { ...c, joined };
  });
}

/* ---------- Points balance + device redemption ---------- */

import {
  dealerPointsBalance,
  pointsActivity as basePointsActivity,
  type PointsActivityType,
} from "./gamification";

type PointsEntry = {
  id: string;
  date: string;
  label: string;
  amount: number;
  type: PointsActivityType;
  detail?: string;
};

let pointsSpent = 0;
let extraActivity: PointsEntry[] = [];

/** Dealer points balance with this session's redemptions applied. */
export function usePointsBalance() {
  useGamificationState();
  return dealerPointsBalance - pointsSpent;
}

/** Points activity, newest first, including this session's redemptions. */
export function usePointsActivity(): PointsEntry[] {
  useGamificationState();
  return [...extraActivity, ...basePointsActivity];
}

/** Redeem a catalog item: deducts points and records a history entry. */
export function redeemItem(name: string, points: number) {
  pointsSpent += points;
  extraActivity = [
    {
      id: `pa-item-${Date.now()}`,
      date: claimDate,
      label: `${name} Redeemed`,
      amount: -points,
      type: "Redeemed",
    },
    ...extraActivity,
  ];
  emit();
}
