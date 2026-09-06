/**
 * Gamification demo data.
 *
 * All values here stand in for engine-owned (backend) values. The mobile app is
 * read-only for these: no target, point, tier or progress value is ever
 * recalculated on the client.
 */

export type Capability = "gamification" | "loyalty" | "wallet" | "convert" | "spin";

/** Backend-driven per-dealer configuration. Widgets that are OFF are not rendered at all. */
export const capabilities: Record<Capability, boolean> = {
  gamification: true,
  loyalty: true,
  wallet: true,
  convert: true,
  spin: true,
};

/** Backend-driven home widget order. */
export const homeWidgetOrder: Array<"gamification"> = ["gamification"];

export type ChallengeGroup = "in_progress" | "available" | "completed" | "ended";
export type ChallengeStatus = "on_track" | "at_risk" | "succeeded" | "failed";
export type ChallengeKind = "goal" | "streak" | "frequency";

export type Reward = {
  type: "points" | "badge" | "gift" | "spin" | "other";
  label: string;
};

export type StreakDay = {
  label: string;
  state: "passed" | "missed" | "today" | "upcoming";
};

export type WindowDay = {
  label: string;
  count: number;
  contributed: boolean;
};

export type Challenge = {
  id: string;
  title: string;
  description: string;
  counts: string;
  timeframe: string;
  reward: Reward;
  kind: ChallengeKind;
  group: ChallengeGroup;
  status: ChallengeStatus;
  optional: boolean;
  /** goal */
  current?: number;
  target?: number;
  unit?: string;
  daysRemaining?: number;
  /** streak */
  days?: StreakDay[];
  currentStreak?: number;
  bestStreak?: number;
  graceDays?: number;
  /** frequency window */
  windowDays?: WindowDay[];
  windowTarget?: number;
  windowCurrent?: number;
  windowLabel?: string;
};

export const challenges: Challenge[] = [
  {
    id: "ch-visits-may",
    title: "10 Visits in May",
    description: "Complete 10 customer site visits before the end of the month.",
    counts: "Visits",
    timeframe: "01 May 2026 – 31 May 2026",
    reward: { type: "points", label: "500 Points" },
    kind: "goal",
    group: "in_progress",
    status: "on_track",
    optional: false,
    current: 7,
    target: 10,
    unit: "Visits",
    daysRemaining: 5,
  },
  {
    id: "ch-activation-streak",
    title: "Activation Streak",
    description: "Record at least 5 activations every day for 7 days in a row.",
    counts: "Activations",
    timeframe: "Daily · Rolling 7 Days",
    reward: { type: "spin", label: "1 Spin Entitlement" },
    kind: "streak",
    group: "in_progress",
    status: "at_risk",
    optional: false,
    currentStreak: 4,
    bestStreak: 6,
    graceDays: 1,
    days: [
      { label: "Mon", state: "passed" },
      { label: "Tue", state: "passed" },
      { label: "Wed", state: "missed" },
      { label: "Thu", state: "passed" },
      { label: "Fri", state: "passed" },
      { label: "Sat", state: "today" },
      { label: "Sun", state: "upcoming" },
    ],
  },
  {
    id: "ch-bill-window",
    title: "Bill Payment Sprint",
    description: "Process 5 bill payments within any 7 consecutive days.",
    counts: "Bill Payments",
    timeframe: "Rolling 7 Days",
    reward: { type: "points", label: "300 Points" },
    kind: "frequency",
    group: "in_progress",
    status: "on_track",
    optional: true,
    windowTarget: 5,
    windowCurrent: 3,
    windowLabel: "Current window: 26 Aug – 01 Sep 2026",
    windowDays: [
      { label: "26 Aug", count: 1, contributed: true },
      { label: "27 Aug", count: 0, contributed: false },
      { label: "28 Aug", count: 1, contributed: true },
      { label: "29 Aug", count: 0, contributed: false },
      { label: "30 Aug", count: 1, contributed: true },
      { label: "31 Aug", count: 0, contributed: false },
      { label: "01 Sep", count: 0, contributed: false },
    ],
  },
  {
    id: "ch-hbb-goal",
    title: "20 HBB Sales",
    description: "Sell 20 home broadband subscriptions this quarter.",
    counts: "HBB Activations",
    timeframe: "01 Jul 2026 – 30 Sep 2026",
    reward: { type: "gift", label: "Wireless Headphones" },
    kind: "goal",
    group: "available",
    status: "on_track",
    optional: true,
    current: 0,
    target: 20,
    unit: "Sales",
    daysRemaining: 30,
  },
  {
    id: "ch-prepaid-window",
    title: "Prepaid Booster",
    description: "Complete 8 prepaid activations within any 7 consecutive days.",
    counts: "Prepaid Activations",
    timeframe: "Rolling 7 Days",
    reward: { type: "badge", label: "Prepaid Pro Badge" },
    kind: "frequency",
    group: "available",
    status: "on_track",
    optional: true,
    windowTarget: 8,
    windowCurrent: 0,
    windowLabel: "Window starts when you join",
    windowDays: [],
  },
  {
    id: "ch-august-activation",
    title: "August Activation Challenge",
    description: "Reach 50 activations during August.",
    counts: "Activations",
    timeframe: "01 Aug 2026 – 31 Aug 2026",
    reward: { type: "points", label: "500 Points" },
    kind: "goal",
    group: "completed",
    status: "succeeded",
    optional: false,
    current: 52,
    target: 50,
    unit: "Activations",
    daysRemaining: 0,
  },
  {
    id: "ch-july-visits",
    title: "July Visit Target",
    description: "Complete 12 customer site visits during July.",
    counts: "Visits",
    timeframe: "01 Jul 2026 – 31 Jul 2026",
    reward: { type: "points", label: "400 Points" },
    kind: "goal",
    group: "ended",
    status: "failed",
    optional: false,
    current: 8,
    target: 12,
    unit: "Visits",
    daysRemaining: 0,
  },
];

export const challengeGroupLabels: Record<ChallengeGroup, string> = {
  in_progress: "In Progress",
  available: "Available to Join",
  completed: "Completed",
  ended: "Missed / Ended",
};

export const challengeEmptyStates: Record<ChallengeGroup, string> = {
  in_progress: "No active challenges right now.",
  available: "No challenges available to join.",
  completed: "No completed challenges yet.",
  ended: "No missed or ended challenges.",
};

export const statusLabels: Record<ChallengeStatus, string> = {
  on_track: "On Track",
  at_risk: "At Risk",
  succeeded: "Succeeded",
  failed: "Failed",
};

export const statusClasses: Record<ChallengeStatus, string> = {
  on_track: "bg-status-resolved-bg text-status-resolved",
  at_risk: "bg-status-progress-bg text-status-progress",
  succeeded: "bg-status-resolved-bg text-status-resolved",
  failed: "bg-status-closed-bg text-status-closed",
};

export function goalPercent(c: Challenge) {
  if (!c.target) return 0;
  return Math.min(100, Math.round(((c.current ?? 0) / c.target) * 100));
}

/* ------------------------------------------------------------------ Loyalty */

export type Tier = {
  name: string;
  rank: number;
  color: string;
  benefits: string[];
};

export const tiers: Tier[] = [
  { name: "Bronze", rank: 1, color: "text-amber-700", benefits: ["Base earn rate"] },
  { name: "Silver", rank: 2, color: "text-slate-500", benefits: ["1.1x earn rate", "Silver marketplace items"] },
  {
    name: "Gold",
    rank: 3,
    color: "text-amber-500",
    benefits: [
      "1.25x points earn rate",
      "Access to Gold marketplace items",
      "Priority gift fulfilment",
      "Monthly bonus spin",
    ],
  },
  { name: "Platinum", rank: 4, color: "text-indigo-500", benefits: ["1.5x earn rate", "All marketplace items"] },
];

export const loyalty = {
  currentTier: "Gold",
  rank: 3,
  totalTiers: 4,
  points: 450,
  nextTier: "Platinum",
  pointsToNext: 550,
  nextTierThreshold: 1000,
  validUntil: "31 Dec 2026",
  atRisk: true,
  atRiskPoints: 150,
  atRiskHint: "You need 150 more points by 31 Dec 2026 to keep Gold.",
  isTopTier: false,
};

export type TierEvent = { from?: string; to: string; type: "Upgraded" | "Downgraded" | "Renewed"; date: string };

export const tierHistory: TierEvent[] = [
  { from: "Gold", to: "Silver", type: "Downgraded", date: "15 Aug 2026" },
  { to: "Gold", type: "Renewed", date: "01 May 2026" },
  { from: "Silver", to: "Gold", type: "Upgraded", date: "15 Jan 2026" },
];

/* ------------------------------------------------------------- Points */

export const points = {
  balance: 450,
  lifetimeEarned: 12500,
  lifetimeSpent: 4200,
};

export const wallet = {
  balance: 45.75,
  currency: "KD",
  history: [
    { id: "w1", label: "Points conversion", amount: 30, date: "12 Aug 2026" },
    { id: "w2", label: "Wallet payout", amount: -12.25, date: "02 Aug 2026" },
    { id: "w3", label: "Points conversion", amount: 20, date: "18 Jul 2026" },
  ],
};

export const pointsExpiry = [
  { id: "e1", amount: 500, date: "15 Sep 2026" },
  { id: "e2", amount: 1200, date: "30 Nov 2026" },
  { id: "e3", amount: 2000, date: "31 Jan 2027" },
];

export type LedgerType = "Earned" | "Spent" | "Expired" | "Adjusted";

export const pointsHistory: Array<{
  id: string;
  source: string;
  amount: number;
  type: LedgerType;
  date: string;
}> = [
  { id: "p1", source: "August Activation Challenge", amount: 500, type: "Earned", date: "31 Aug 2026" },
  { id: "p2", source: "Marketplace Redemption", amount: -1000, type: "Spent", date: "24 Aug 2026" },
  { id: "p3", source: "Expired Points", amount: -200, type: "Expired", date: "15 Aug 2026" },
  { id: "p4", source: "Manual Adjustment", amount: 150, type: "Adjusted", date: "10 Aug 2026" },
  { id: "p5", source: "Points to Wallet Conversion", amount: -3000, type: "Spent", date: "12 Aug 2026" },
  { id: "p6", source: "Bill Payment Sprint", amount: 300, type: "Earned", date: "02 Aug 2026" },
];

export const ledgerClasses: Record<LedgerType, string> = {
  Earned: "bg-status-resolved-bg text-status-resolved",
  Spent: "bg-status-progress-bg text-status-progress",
  Expired: "bg-status-closed-bg text-status-closed",
  Adjusted: "bg-secondary text-secondary-foreground",
};

/* ------------------------------------------------------------- Conversion */

/** Backend-configured conversion rules. */
export const conversionRules = {
  enabled: true,
  rateLabel: "100 pts = 1 KD",
  pointsPerUnit: 100,
  currency: "KD",
  minTier: "Gold",
  minPoints: 1000,
  monthlyCapPoints: 5000,
  convertedThisMonth: 1000,
};

/* ------------------------------------------------------------- Rewards */

export type RewardStage = "Granted" | "Claimed" | "Being Prepared" | "Shipped / Ready" | "Delivered";

export const rewardStages: RewardStage[] = [
  "Granted",
  "Claimed",
  "Being Prepared",
  "Shipped / Ready",
  "Delivered",
];

export type MyReward = {
  id: string;
  name: string;
  kind: "points" | "badge" | "gift" | "spin";
  source: string;
  date: string;
  /** gifts only */
  stage?: RewardStage;
  needsClaim?: boolean;
  tracking?: string;
  note?: string;
};

export const myRewards: MyReward[] = [
  {
    id: "r1",
    name: "Wireless Headphones",
    kind: "gift",
    source: "Q3 HBB Challenge",
    date: "28 Aug 2026",
    stage: "Granted",
    needsClaim: true,
  },
  {
    id: "r2",
    name: "Bluetooth Speaker",
    kind: "gift",
    source: "August Activation Challenge",
    date: "12 Aug 2026",
    stage: "Shipped / Ready",
    tracking: "TRK-99201884",
    note: "Ready for pickup at the Salmiya branch.",
  },
  {
    id: "r3",
    name: "500 Points",
    kind: "points",
    source: "August Activation Challenge",
    date: "31 Aug 2026",
    note: "Automatically credited to your points balance.",
  },
  {
    id: "r4",
    name: "Prepaid Pro Badge",
    kind: "badge",
    source: "Prepaid Booster",
    date: "20 Jul 2026",
  },
  {
    id: "r5",
    name: "1 Spin Entitlement",
    kind: "spin",
    source: "Activation Streak",
    date: "29 Aug 2026",
    note: "Expires 15 Sep 2026",
  },
];

export type MarketplaceItem = {
  id: string;
  name: string;
  cost: number;
  stock: number;
  requiredTier?: string;
  description: string;
};

export const marketplace: MarketplaceItem[] = [
  {
    id: "m1",
    name: "Wireless Headphones",
    cost: 4500,
    stock: 12,
    description: "Over-ear noise cancelling headphones with 30h battery life.",
  },
  {
    id: "m2",
    name: "Fuel Voucher 10 KD",
    cost: 1000,
    stock: 48,
    description: "Prepaid fuel voucher accepted at all partner stations.",
  },
  {
    id: "m3",
    name: "Smart Watch",
    cost: 9000,
    stock: 3,
    requiredTier: "Platinum",
    description: "Fitness tracking smart watch with AMOLED display.",
  },
  {
    id: "m4",
    name: "Premium Backpack",
    cost: 2500,
    stock: 0,
    description: "Water-resistant laptop backpack with dealer branding.",
  },
];

export function tierRank(name?: string) {
  return tiers.find((t) => t.name === name)?.rank ?? 0;
}

export function isItemLocked(item: MarketplaceItem) {
  return !!item.requiredTier && tierRank(item.requiredTier) > tierRank(loyalty.currentTier);
}

/* ------------------------------------------------------------- Badges */

export const badges = [
  { id: "b1", name: "Prepaid Pro", icon: "zap", date: "20 Jul 2026", color: "text-amber-500" },
  { id: "b2", name: "Streak Master", icon: "flame", date: "02 Jun 2026", color: "text-orange-500" },
  { id: "b3", name: "Top Closer", icon: "trophy", date: "15 Mar 2026", color: "text-yellow-500" },
  { id: "b4", name: "Fast Starter", icon: "rocket", date: "08 Jan 2026", color: "text-sky-500" },
];

/* ------------------------------------------------------------- Spin */

export const spin = {
  entitlements: 1,
  expiry: "15 Sep 2026",
  outcomes: [
    "250 pts",
    "500 pts",
    "Fuel Voucher 10 KD",
    "Mystery Badge",
    "Extra Spin",
    "Better Luck Next Time",
  ],
};

export const spinHistory = [
  { id: "s1", date: "18 Aug 2026", outcome: "500 pts", reward: "+500 pts credited" },
  { id: "s2", date: "02 Aug 2026", outcome: "Better Luck Next Time", reward: "No reward" },
  { id: "s3", date: "21 Jul 2026", outcome: "Fuel Voucher 10 KD", reward: "Gift granted" },
];

/* ------------------------------------------------------------- Notifications */

export type GamNotification = {
  id: string;
  title: string;
  body: string;
  date: string;
  read: boolean;
  destination: "challenges" | "points-expiry" | "loyalty" | "rewards" | "challenge";
  challengeId?: string;
};

export const notifications: GamNotification[] = [
  {
    id: "n1",
    title: "Daily Target Reached",
    body: "You reached today’s target.",
    date: "Today · 09:12",
    read: false,
    destination: "challenge",
    challengeId: "ch-activation-streak",
  },
  {
    id: "n2",
    title: "Challenge Completed",
    body: "You reached your challenge goal.",
    date: "Today · 08:40",
    read: false,
    destination: "challenge",
    challengeId: "ch-august-activation",
  },
  {
    id: "n3",
    title: "Points Expiring Soon",
    body: "500 points are about to expire.",
    date: "Yesterday",
    read: true,
    destination: "points-expiry",
  },
  {
    id: "n4",
    title: "Tier Updated",
    body: "Your loyalty tier has changed.",
    date: "28 Aug 2026",
    read: true,
    destination: "loyalty",
  },
  {
    id: "n5",
    title: "Reward Ready",
    body: "You have a reward ready to claim.",
    date: "28 Aug 2026",
    read: true,
    destination: "rewards",
  },
];

export function formatPoints(n: number) {
  return n.toLocaleString("en-US");
}

/* =========================================================================
 * UI layer (visual source of truth: provided design screenshots)
 * ========================================================================= */

export const dealer = {
  name: "Hamza",
  phone: "123456789",
  points: 450,
  walletBalance: 4.5,
  currency: "JOD",
  rank: 12,
};

export type CompetitionRewardKind = "spin" | "mystery" | "cash" | "points" | "device";

export const competitionRewardIcon: Record<CompetitionRewardKind, string> = {
  spin: "🎡",
  mystery: "🎲",
  cash: "💰",
  points: "🪙",
  device: "🎁",
};

/** Reward revealed by the mystery box (backend-driven in production). */
export const mysteryBoxReward = { label: "500 pts" };


export type Competition = {
  id: string;
  title: string;
  description: string;
  rewardKind: CompetitionRewardKind;
  rewardLabel: string;
  activity: string;
  activityTarget: string;
  start: string;
  end: string;
  dateRange: string;
  participants: number;
  joined: boolean;
  status: string;
  kind: "goal" | "streak" | "frequency";
  current: number;
  target: number;
  streakTotal?: number;
  streakDone?: number;
  /** per-day streak states, index 0 = day 1 */
  streakStates?: StreakDayState[];
  currentStreakDays?: number;
  bestStreakDays?: number;
  graceDaysRemaining?: number;
  /** frequency window */
  windowLabel?: string;
  windowRange?: string;
  unitLabel?: string;
  unitLabelSingular?: string;
  dailyContributions?: FrequencyDay[];
  expiryNote?: string;
  spin: boolean;
  scorePoints: number;
  ptc: number;
  endingIn?: string;
};

export type StreakDayState = "passed" | "missed" | "today" | "future";

export type FrequencyDay = { date: string; count: number; today?: boolean };

export const competitions: Competition[] = [
  {
    id: "cmp-summer-mystery",
    title: "Summer Activation Race",
    description:
      "You reached 200 activations before 10 Aug. Your mystery box reward is ready to open.",
    rewardKind: "mystery",
    rewardLabel: "Mystery Box Reward",
    activity: "Prepaid Activation",
    activityTarget: "200 Activations",
    start: "1 Aug",
    end: "10 Aug",
    dateRange: "1 Aug → 10 Aug",
    participants: 210,
    joined: true,
    status: "Completed",
    kind: "goal",
    current: 200,
    target: 200,
    unitLabel: "activations",
    spin: false,
    scorePoints: 80,
    ptc: 1000,
  },
  {
    id: "cmp-summer-activation",
    title: "Prepaid Activation Sprint",
    description:
      "Reach 200 prepaid activations before 10 Aug and unlock a spin on the reward wheel plus bonus points.",
    rewardKind: "spin",
    rewardLabel: "Spin & win prizes",
    activity: "Prepaid Activation",
    activityTarget: "200 Prepaid Activation",
    start: "1 Aug",
    end: "10 Aug",
    dateRange: "1 Aug → 10 Aug",
    participants: 150,
    joined: true,
    status: "Status",
    kind: "goal",
    current: 150,
    target: 200,
    unitLabel: "prepaid activation",
    spin: true,
    scorePoints: 50,
    ptc: 750,
    expiryNote: "1 Day to expiry this competition.",
    endingIn: "1 Day",
  },
  {
    id: "cmp-daily-streak",
    title: "Daily Login Streak",
    description:
      "Keep your daily activity streak alive for 20 days in a row to unlock a mystery reward.",
    rewardKind: "mystery",
    rewardLabel: "Mystery rewards inside",
    activity: "Daily Activity",
    activityTarget: "10 Prepaid Activation",
    start: "1 Aug",
    end: "10 Aug",
    dateRange: "1 Aug → 10 Aug",
    participants: 150,
    joined: true,
    status: "Status",
    kind: "streak",
    current: 4,
    target: 20,
    streakTotal: 20,
    streakDone: 4,
    streakStates: [
      "passed",
      "passed",
      "passed",
      "passed",
      "missed",
      "today",
      ...Array.from({ length: 14 }, () => "future" as const),
    ],
    currentStreakDays: 0,
    bestStreakDays: 4,
    graceDaysRemaining: 1,
    spin: true,
    scorePoints: 50,
    ptc: 750,
    endingIn: "30 Min",
  },
  {
    id: "cmp-bill-payment",
    title: "Bill Payment Challenge",
    description: "Complete 5 bill payments within any 7 days to earn 500 pts.",
    rewardKind: "points",
    rewardLabel: "500 pts",
    activity: "Bill Payments",
    activityTarget: "5 Bill Payments",
    start: "26 Aug",
    end: "1 Sep",
    dateRange: "26 Aug → 1 Sep",
    participants: 96,
    joined: true,
    status: "On Track",
    kind: "frequency",
    current: 4,
    target: 5,
    windowLabel: "Any 7 Days",
    windowRange: "26 Aug – 1 Sep",
    unitLabel: "Bill Payments",
    unitLabelSingular: "Payment",
    dailyContributions: [
      { date: "26 Aug", count: 1 },
      { date: "27 Aug", count: 0 },
      { date: "28 Aug", count: 2 },
      { date: "29 Aug", count: 1 },
      { date: "30 Aug", count: 0 },
      { date: "31 Aug", count: 0 },
      { date: "1 Sep", count: 0, today: true },
    ],
    spin: false,
    scorePoints: 30,
    ptc: 500,
  },
  {
    id: "cmp-topup-frequency",
    title: "Top-Up Frequency Challenge",
    description: "Complete 5 top-ups within any 7 days to earn 300 pts.",
    rewardKind: "points",
    rewardLabel: "300 pts",
    activity: "Top-Ups",
    activityTarget: "5 Top-Ups",
    start: "19 Aug",
    end: "25 Aug",
    dateRange: "19 Aug → 25 Aug",
    participants: 132,
    joined: true,
    status: "Succeeded",
    kind: "frequency",
    current: 5,
    target: 5,
    windowLabel: "Any 7 Days",
    windowRange: "19 Aug – 25 Aug",
    unitLabel: "Top-Ups",
    unitLabelSingular: "Top-Up",
    dailyContributions: [
      { date: "19 Aug", count: 2 },
      { date: "20 Aug", count: 0 },
      { date: "21 Aug", count: 1 },
      { date: "22 Aug", count: 0 },
      { date: "23 Aug", count: 1 },
      { date: "24 Aug", count: 1 },
      { date: "25 Aug", count: 0 },
    ],
    spin: false,
    scorePoints: 30,
    ptc: 300,
  },
  {
    id: "cmp-hbb-push",
    title: "HBB Weekend Push",
    description: "Activate home broadband lines over the weekend and win cash rewards.",
    rewardKind: "cash",
    rewardLabel: "100 JOD",
    activity: "HBB Activation",
    activityTarget: "2000 Prepaid Activation",
    start: "1 Aug",
    end: "10 Aug",
    dateRange: "1 Aug → 10 Aug",
    participants: 150,
    joined: true,
    status: "Status",
    kind: "goal",
    current: 120,
    target: 200,
    spin: false,
    scorePoints: 50,
    ptc: 600,
  },
  {
    id: "cmp-device-bundle",
    title: "Device Bundle Sprint",
    description: "Sell device bundles this month and collect points.",
    rewardKind: "points",
    rewardLabel: "600 pts",
    activity: "Device Bundle",
    activityTarget: "2000 Prepaid Activation",
    start: "1 Aug",
    end: "10 Aug",
    dateRange: "1 Aug → 10 Aug",
    participants: 150,
    joined: true,
    status: "Status",
    kind: "goal",
    current: 90,
    target: 200,
    spin: false,
    scorePoints: 50,
    ptc: 600,
  },
  {
    id: "cmp-iphone-raffle",
    title: "iPhone 15 Pro Max Raffle",
    description: "Hit the activation target for a chance to take home an iPhone 15 Pro Max.",
    rewardKind: "device",
    rewardLabel: "iPhone 15 pro max",
    activity: "Prepaid Activation",
    activityTarget: "2000 Prepaid Activation",
    start: "1 Aug",
    end: "10 Aug",
    dateRange: "1 Aug → 10 Aug",
    participants: 150,
    joined: false,
    status: "Status",
    kind: "goal",
    current: 0,
    target: 2000,
    spin: true,
    scorePoints: 50,
    ptc: 750,
  },
  {
    id: "cmp-ptc-boost",
    title: "Points Boost Week",
    description: "Earn extra points on every prepaid activation during the boost week.",
    rewardKind: "points",
    rewardLabel: "270 pts",
    activity: "Prepaid Activation",
    activityTarget: "2000 Prepaid Activation",
    start: "1 Aug",
    end: "10 Aug",
    dateRange: "1 Aug → 10 Aug",
    participants: 150,
    joined: false,
    status: "Status",
    kind: "goal",
    current: 0,
    target: 2000,
    spin: true,
    scorePoints: 50,
    ptc: 270,
  },
  {
    id: "cmp-router-drive",
    title: "Router Drive",
    description: "Push router sales and spin the wheel for prizes.",
    rewardKind: "spin",
    rewardLabel: "Spin & win prizes",
    activity: "Router Sales",
    activityTarget: "2000 Prepaid Activation",
    start: "1 Aug",
    end: "10 Aug",
    dateRange: "1 Aug → 10 Aug",
    participants: 150,
    joined: false,
    status: "Status",
    kind: "goal",
    current: 0,
    target: 2000,
    spin: true,
    scorePoints: 50,
    ptc: 750,
  },
  {
    id: "cmp-topup-marathon",
    title: "Top-up Marathon",
    description: "Complete top-up transactions across the month to unlock prizes.",
    rewardKind: "spin",
    rewardLabel: "Spin & win prizes",
    activity: "Top-up",
    activityTarget: "2000 Prepaid Activation",
    start: "1 Aug",
    end: "10 Aug",
    dateRange: "1 Aug → 10 Aug",
    participants: 150,
    joined: false,
    status: "Status",
    kind: "goal",
    current: 0,
    target: 2000,
    spin: true,
    scorePoints: 50,
    ptc: 750,
  },
];

export function competitionPercent(c: Competition) {
  if (!c.target) return 0;
  return Math.min(100, Math.round((c.current / c.target) * 100));
}

/* Rewards list (design) */
export type RewardStatus =
  | "Granted"
  | "Claimed"
  | "Fulfilled"
  | "Pending Approval"
  | "Rejected"
  | "Expired"
  | "Cancelled";

/** Statuses configured by the backend for this program. */
export const rewardStatusFilters = [
  "All",
  "Granted",
  "Claimed",
  "Fulfilled",
  "Pending Approval",
  "Rejected",
  "Expired",
  "Cancelled",
] as const;

/** Happy-path lifecycle steps used by the reward progress tracker. */
export const rewardTrackingSteps: RewardStatus[] = ["Granted", "Claimed", "Fulfilled"];

export type RewardRow = {
  id: string;
  /** reward name */
  title: string;
  /** source / competition name */
  subtitle: string;
  icon: "cash" | "voucher" | "device";
  status: RewardStatus;
  type: "Points" | "Voucher" | "Physical Gift" | "Spin Entitlement" | "Badge";
  physical?: boolean;
  granted: string;
  needsClaim?: boolean;
  /** backend-supplied only */
  claimedOn?: string;
  /** backend-supplied: date fulfillment was completed */
  fulfilledOn?: string;
  note?: string;
};

export const rewardRows: RewardRow[] = [
  {
    id: "rw1",
    title: "100 JOD Voucher",
    subtitle: "Summer Activation Race",
    icon: "cash",
    status: "Claimed",
    type: "Voucher",
    granted: "10 Aug 2026",
    claimedOn: "11 Aug 2026",
  },
  {
    id: "rw2",
    title: "iPhone 15 Pro Max",
    subtitle: "Summer Activation Race",
    icon: "device",
    status: "Claimed",
    type: "Physical Gift",
    physical: true,
    granted: "10 Aug 2026",
    claimedOn: "11 Aug 2026",
    note: "Your reward is being prepared for fulfillment.",
  },
  {
    id: "rw3",
    title: "Wireless Headphones",
    subtitle: "Q3 HBB Challenge",
    icon: "device",
    status: "Claimed",
    type: "Physical Gift",
    physical: true,
    granted: "05 Aug 2026",
    claimedOn: "06 Aug 2026",
  },
  {
    id: "rw4",
    title: "Gift Card",
    subtitle: "HBB Weekend Push",
    icon: "voucher",
    status: "Fulfilled",
    type: "Voucher",
    granted: "20 Jul 2026",
    claimedOn: "21 Jul 2026",
    fulfilledOn: "22 Jul 2026",
  },
  {
    id: "rw5",
    title: "Bluetooth Speaker",
    subtitle: "Device Bundle Sprint",
    icon: "device",
    status: "Claimed",
    type: "Physical Gift",
    physical: true,
    granted: "12 Aug 2026",
    claimedOn: "13 Aug 2026",
    note: "Please collect your reward from the main branch.",
  },
  {
    id: "rw6",
    title: "500 pts",
    subtitle: "August Sales Challenge",
    icon: "cash",
    status: "Fulfilled",
    type: "Points",
    granted: "10 Aug 2026",
    claimedOn: "10 Aug 2026",
    fulfilledOn: "10 Aug 2026",
    note: "Automatically credited to your points balance.",
  },
  {
    id: "rw7",
    title: "1 Spin Entitlement",
    subtitle: "Activation Streak",
    icon: "voucher",
    status: "Granted",
    type: "Spin Entitlement",
    granted: "29 Aug 2026",
    needsClaim: true,
    note: "Expires 15 Sep 2026",
  },
  {
    id: "rw8",
    title: "iPhone 15 Pro Max",
    subtitle: "iPhone Raffle",
    icon: "device",
    status: "Granted",
    type: "Physical Gift",
    physical: true,
    granted: "28 Aug 2026",
    needsClaim: true,
  },
  {
    id: "rw9",
    title: "100 JOD Voucher",
    subtitle: "Top-up Marathon",
    icon: "voucher",
    status: "Granted",
    type: "Voucher",
    granted: "30 Aug 2026",
    needsClaim: true,
  },
  {
    id: "rw10",
    title: "Smart Watch",
    subtitle: "HBB Weekend Push",
    icon: "device",
    status: "Pending Approval",
    type: "Physical Gift",
    physical: true,
    granted: "31 Aug 2026",
  },
  {
    id: "rw11",
    title: "50 JOD Voucher",
    subtitle: "Top-up Frequency Challenge",
    icon: "cash",
    status: "Rejected",
    type: "Voucher",
    granted: "18 Aug 2026",
  },
  {
    id: "rw12",
    title: "Fuel Voucher 10 KD",
    subtitle: "Prepaid Booster",
    icon: "cash",
    status: "Expired",
    type: "Voucher",
    granted: "20 Jul 2026",
  },
  {
    id: "rw13",
    title: "Router",
    subtitle: "Router Drive",
    icon: "device",
    status: "Cancelled",
    type: "Physical Gift",
    physical: true,
    granted: "15 Jul 2026",
  },
];

/** Tone used by StatusChip for each approved reward status. */
export function rewardStatusTone(status: RewardStatus): "green" | "orange" | "red" {
  if (status === "Claimed" || status === "Fulfilled") return "green";
  if (status === "Rejected" || status === "Expired" || status === "Cancelled") return "red";
  return "orange";
}

/** Tone used by StatusChip for competition/challenge statuses. */
export function competitionStatusTone(status: string): "green" | "orange" {
  return status === "Completed" ? "green" : "orange";
}

/** Label shown on the status badge: every orange (non-completed) status reads "In Progress". */
export function competitionStatusLabel(status: string): string {
  return competitionStatusTone(status) === "orange" ? "In Progress" : status;
}



/* Convert wallets (design) */
export const convertWallets = [
  { id: "e-voucher", name: "E-Voucher", balance: 456.789, tone: "from-emerald-800 to-emerald-900" },
  { id: "e-topup", name: "E-Topup", balance: 456.789, tone: "from-blue-600 to-blue-700" },
  { id: "e-wallet", name: "E-Wallet Type", balance: 456.789, tone: "from-slate-600 to-slate-700" },
];

/* Points conversion options (Convert Points page) */
export const pointsConversionOptions = [
  { id: "conv-100", points: 100, jod: 10 },
  { id: "conv-200", points: 200, jod: 20 },
  { id: "conv-500", points: 500, jod: 50 },
];

/* Points activity (design) */
export type PointsActivityType = "Earned" | "Redeemed" | "Converted" | "Expired" | "Adjusted";

export const pointsActivity: {
  id: string;
  date: string;
  label: string;
  amount: number;
  type: PointsActivityType;
  detail?: string;
}[] = [
  { id: "pa1", date: "Aug 10, 2026", label: "HBB Activation", amount: 50, type: "Earned" },
  { id: "pa2", date: "Aug 9, 2026", label: "Challenge Reward", amount: 100, type: "Earned" },
  { id: "pa3", date: "Aug 8, 2026", label: "Voucher Redeemed", amount: -500, type: "Redeemed" },
  { id: "pa4", date: "Aug 7, 2026", label: "Device Redeemed", amount: -2000, type: "Redeemed" },
  { id: "pa5", date: "Aug 7, 2026", label: "Points Converted to Wallet", amount: -300, type: "Converted", detail: "Received 3 JOD" },
  { id: "pa6", date: "Aug 6, 2026", label: "SIM Activation", amount: 12, type: "Earned" },
  { id: "pa7", date: "Aug 5, 2026", label: "Daily Login Streak", amount: 12, type: "Earned" },
  { id: "pa8", date: "Aug 4, 2026", label: "Points Expired", amount: -50, type: "Expired" },
];


/* Points & Marketplace catalog (design) — a single unified list of redeemable items. */
export type MarketplaceCatalogItem = {
  id: string;
  name: string;
  points: number;
  emoji: string;
  /** number of units in stock, or "unlimited" for items not tracked by count */
  stock: number | "unlimited";
};

/** Dealer points balance used by the Points & Marketplace screen. */
export const dealerPointsBalance = 450;

export function catalogStockLabel(item: MarketplaceCatalogItem): string {
  if (item.stock === "unlimited") return "Available";
  if (item.stock === 0) return "Out of Stock";
  return `${item.stock} in stock`;
}

export function catalogInStock(item: MarketplaceCatalogItem): boolean {
  return item.stock === "unlimited" || item.stock > 0;
}

export const marketplaceCatalog: MarketplaceCatalogItem[] = [
  { id: "cat-data-bundle", name: "Mobile Data Bundle", points: 300, emoji: "📶", stock: "unlimited" },
  { id: "cat-jod-voucher", name: "100 JOD Voucher", points: 1000, emoji: "🎟️", stock: "unlimited" },
  { id: "cat-gift-card", name: "Gift Card", points: 2000, emoji: "🎁", stock: "unlimited" },
  { id: "cat-headphones", name: "Wireless Headphones", points: 5000, emoji: "🎧", stock: 3 },
  { id: "cat-router", name: "Router", points: 8000, emoji: "📡", stock: 5 },
  { id: "cat-iphone-15-pm", name: "iPhone 15 Pro Max", points: 25000, emoji: "📱", stock: 0 },
];
