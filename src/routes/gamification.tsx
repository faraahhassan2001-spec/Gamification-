import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { ChevronRight, Gift, Hourglass } from "lucide-react";
import { toast } from "sonner";
import {
  GamCard,
  GamScreen,
  StatusChip,
  UnderlineTabs,
  WalletBanner,
} from "@/components/gamification/ui";
import { TierCard } from "@/components/gamification/TierCard";
import { CompetitionCard } from "@/components/gamification/CompetitionCard";
import { ChallengeDetailsSheet } from "@/components/gamification/ChallengeDetailsSheet";
import { EndingSoonSheet, RewardsReadySheet } from "@/components/gamification/HomeSheets";
import { SpinSheet } from "@/components/gamification/SpinSheet";
import { actions, useCompetitions, useRewardsReady, useSpin } from "@/lib/gamification-state";
import { dealer, rewardRows, rewardStatusTone, type Competition } from "@/lib/gamification";

export const Route = createFileRoute("/gamification")({
  head: () => ({
    meta: [
      { title: "Gamification — Dealer Rewards" },
      {
        name: "description",
        content:
          "Your points, rank, loyalty tier, live challenges and rewards in one dealer gamification hub.",
      },
      { property: "og:title", content: "Gamification — Dealer Rewards" },
      {
        property: "og:description",
        content: "Points, rank, tier progress, challenges and rewards for dealers.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: GamificationHub,
});

function GamificationHub() {
  const [tab, setTab] = useState<"My Challenges" | "Available">("Available");
  const [readyOpen, setReadyOpen] = useState(false);
  const [soonOpen, setSoonOpen] = useState(false);
  const [spinOpen, setSpinOpen] = useState(false);
  const [sheet, setSheet] = useState<Competition | null>(null);
  const competitions = useCompetitions();
  const readyCount = useRewardsReady().length;
  const endingSoonCount = competitions.filter((c) => c.endingIn).length;
  const spinState = useSpin();

  const list = competitions.filter((c) => (tab === "My Challenges" ? c.joined : !c.joined)).slice(0, 2);

  return (
    <GamScreen title="Gamification" backTo="/">
      <p className="flex items-center gap-2 text-[15px] font-semibold text-foreground">
        <span>🎖️</span> Hi {dealer.name}, your rewards are waiting
      </p>

      <Link to="/points" className="block">
        <WalletBanner points={dealer.points} />
      </Link>


      <div className="grid grid-cols-2 gap-3">
        <StatTile
          emoji={<Gift className="size-5 text-pink-500" />}
          bg="bg-pink-50"
          count={readyCount}
          title={readyCount === 1 ? "Reward Ready" : "Rewards Ready"}
          sub="Ready to claim"
          onClick={() => setReadyOpen(true)}
        />

        <StatTile
          emoji={<Hourglass className="size-5 text-teal-500" />}
          bg="bg-teal-50"
          count={endingSoonCount}
          title="Challenges Ending Soon"
          sub={`${endingSoonCount} Challenge${endingSoonCount === 1 ? "" : "s"}`}
          showCountInTitle={false}
          onClick={() => setSoonOpen(true)}
        />
      </div>

      <button
        onClick={() => setSpinOpen(true)}
        className="flex w-full items-center gap-3 rounded-2xl bg-card p-4 text-left shadow-[0_2px_10px_rgba(15,42,80,0.06)]"
      >
        <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-sky-50 text-[18px]">
          🎡
        </span>
        <span className="min-w-0 flex-1">
          <span className="block text-[14px] font-semibold text-foreground">My Spins</span>
          <span className="block text-[12px] text-muted-foreground">
            {spinState.available} {spinState.available === 1 ? "Spin" : "Spins"} Available
          </span>
        </span>
        <ChevronRight className="size-4 text-muted-foreground" />
      </button>

      <TierCard seeAllTo="/loyalty" />

      <GamCard>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-[15px] font-semibold text-foreground">Challenges</h2>
          <Link to="/challenges" className="flex items-center gap-1 text-[13px] font-medium text-primary">
            See all
            <ChevronRight className="size-4" />
          </Link>
        </div>
        <div className="mb-3 flex gap-2">
          {(["My Challenges", "Available"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`rounded-lg px-4 py-2 text-[13px] font-medium transition-colors ${
                tab === t
                  ? "bg-primary text-primary-foreground"
                  : "border border-border bg-card text-foreground"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
        <div className="space-y-3">
          {list.map((c) => (
            <CompetitionCard
              key={c.id}
              c={c}
              variant={tab === "My Challenges" ? "progress" : "available"}
              onOpen={tab === "Available" ? () => setSheet(c) : undefined}
              onJoin={() => {
                actions.join(c.id);
                toast.success("Challenge joined");
              }}
            />
          ))}
          {list.length === 0 && (
            <p className="rounded-2xl bg-slate-50 p-4 text-center text-[13px] text-muted-foreground">
              Nothing here yet.
            </p>
          )}
        </div>
      </GamCard>

      <GamCard>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-[15px] font-semibold text-foreground">Rewards</h2>
          <Link to="/rewards" className="flex items-center gap-1 text-[13px] font-medium text-primary">
            See all
            <ChevronRight className="size-4" />
          </Link>
        </div>
        <div className="space-y-2.5">
          {rewardRows.slice(0, 3).map((r) => (
            <Link
              key={r.id}
              to="/reward/$id"
              params={{ id: r.id }}
              className="flex items-center gap-3 rounded-2xl bg-slate-50 px-3 py-3"
            >
              <span className="flex size-9 items-center justify-center rounded-xl bg-white text-[16px] shadow-sm">
                {r.icon === "cash" ? "💵" : r.icon === "voucher" ? "🎟️" : "📱"}
              </span>
              <div className="flex-1">
                <p className="text-[13px] font-semibold text-foreground">{r.title}</p>
                <p className="text-[12px] text-muted-foreground">{r.subtitle}</p>
              </div>
              <StatusChip tone={rewardStatusTone(r.status)}>{r.status}</StatusChip>
            </Link>
          ))}
        </div>

      </GamCard>

      <RewardsReadySheet open={readyOpen} onOpenChange={setReadyOpen} />
      <EndingSoonSheet open={soonOpen} onOpenChange={setSoonOpen} />
      <SpinSheet open={spinOpen} onOpenChange={setSpinOpen} />
      <ChallengeDetailsSheet
        competition={sheet}
        open={!!sheet}
        onOpenChange={(v) => !v && setSheet(null)}
        onJoin={(c) => {
          actions.join(c.id);
          setSheet(null);
          toast.success("Challenge joined");
        }}
      />
    </GamScreen>
  );
}

function StatTile({
  emoji,
  bg,
  count,
  title,
  sub,
  showCountInTitle = true,
  onClick,
}: {
  emoji: React.ReactNode;
  bg: string;
  count: number;
  title: string;
  sub: string;
  showCountInTitle?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="rounded-2xl bg-card p-4 text-left shadow-[0_2px_10px_rgba(15,42,80,0.06)]"
    >
      <div className="flex items-start justify-between">
        <span className={`flex size-9 items-center justify-center rounded-full ${bg}`}>{emoji}</span>
        <ChevronRight className="size-4 text-muted-foreground" />
      </div>
      <p className="mt-2 text-[14px] font-semibold text-foreground">
        {showCountInTitle ? `${count} ${title}` : title}
      </p>
      <p className="text-[12px] text-muted-foreground">{sub}</p>
    </button>
  );
}
