import { createFileRoute, useNavigate, useParams } from "@tanstack/react-router";
import { useState } from "react";
import { Briefcase, Clock } from "lucide-react";
import { toast } from "sonner";
import { FrequencyWindowSection } from "@/components/gamification/FrequencyWindow";
import { StreakDots, StreakLegend } from "@/components/gamification/CompetitionCard";
import {
  GamCard,
  GamScreen,
  GreenProgress,
  PrimaryButton,
  StatusChip,
} from "@/components/gamification/ui";
import { competitionPercent, competitionRewardIcon, competitionStatusTone, competitionStatusLabel } from "@/lib/gamification";
import { actions, useCompetitions, useGamificationState } from "@/lib/gamification-state";
import { MysteryBox, MysteryBoxSheet } from "@/components/gamification/MysteryBoxSheet";


export const Route = createFileRoute("/challenge/$id")({
  head: () => ({
    meta: [
      { title: "My Challenges — Dealer Gamification" },
      {
        name: "description",
        content: "Track a single dealer challenge: target, dates, progress and your reward.",
      },
      { property: "og:title", content: "My Challenges — Dealer Gamification" },
      {
        property: "og:description",
        content: "Challenge target, progress and reward in one view.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ChallengeDetails,
});

function ChallengeDetails() {
  const { id } = useParams({ from: "/challenge/$id" });
  const navigate = useNavigate();
  const [mysteryOpen, setMysteryOpen] = useState(false);
  const mysteryClaimed = useGamificationState().mysteryOpened[id] ?? false;
  const c = useCompetitions().find((x) => x.id === id);

  if (!c) {
    return (
      <GamScreen title="My Challenges" backTo="/challenges">
        <GamCard>
          <p className="text-center text-[13px] text-muted-foreground">
            This challenge is no longer available.
          </p>
        </GamCard>
      </GamScreen>
    );
  }

  const pct = competitionPercent(c);
  const remaining = Math.max(0, c.target - c.current);
  const streakStates = c.streakStates ?? [];
  const passedDays = streakStates.length
    ? streakStates.filter((d) => d === "passed").length
    : (c.streakDone ?? 0);
  const streakRemaining = Math.max(0, (c.streakTotal ?? c.target) - passedDays);
  const rewardUnlocked = c.kind === "streak" ? streakRemaining === 0 : c.current >= c.target;

  return (
    <GamScreen
      title="My Challenges"
      backTo="/challenges"
      footer={
        c.joined && c.status !== "Completed" ? (
          <PrimaryButton
            onClick={() => {
              actions.leave(c.id);
              toast.success("You left the challenge");
              navigate({ to: "/challenges" });
            }}
          >
            Leave Challenge
          </PrimaryButton>
        ) : !c.joined ? (
          <PrimaryButton
            onClick={() => {
              actions.join(c.id);
              toast.success("Challenge joined");
            }}
          >
            Join Challenge
          </PrimaryButton>
        ) : undefined
      }
    >
      <section className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#3d2f63] via-[#453d78] to-[#4d5b93] p-4 text-white shadow-md">
        <div className="flex items-start justify-between gap-2">
          <h2 className="text-[18px] font-semibold">{c.title}</h2>
          <StatusChip tone={competitionStatusTone(c.status)}>{competitionStatusLabel(c.status)}</StatusChip>
        </div>
        <div className="mt-3 space-y-2 text-[13px] text-white/85">
          <p className="flex items-center gap-2">
            <Clock className="size-4" /> {c.dateRange}
          </p>
          <p className="flex items-center gap-2">
            <Briefcase className="size-4" /> {c.activityTarget}
          </p>
        </div>
        <div className="mt-3 flex flex-wrap gap-2 text-[11px]">
          <span className="rounded-full bg-white/15 px-3 py-1.5">
            {competitionRewardIcon[c.rewardKind]} {c.rewardLabel}
          </span>
          <span className="rounded-full bg-white/15 px-3 py-1.5">🏅 {c.scorePoints} Score Points</span>
        </div>
      </section>

      <GamCard>
        {c.kind === "frequency" ? (
          <FrequencyWindowSection c={c} />
        ) : c.kind === "streak" ? (
          <>
            <p className="mb-3 text-[13px] font-medium text-foreground">
              {streakRemaining === 0
                ? "Challenge complete! Your reward is unlocked 🎉"
                : `Keep going! You're ${streakRemaining} ${
                    streakRemaining === 1 ? "day" : "days"
                  } away from your reward 🔥`}
            </p>
            <StreakDots
              total={c.streakTotal ?? 20}
              done={c.streakDone ?? 0}
              states={c.streakStates}
            />
            <div className="mt-3 border-t border-border/70 pt-3">
              <StreakLegend />
            </div>
            <div className="mt-3 grid grid-cols-3 gap-2 text-center">
              {[
                { label: "Current Streak", value: `${c.currentStreakDays ?? 0} Days` },
                { label: "Best Streak", value: `${c.bestStreakDays ?? 0} Days` },
                { label: "Grace Days", value: `${c.graceDaysRemaining ?? 0} Remaining` },
              ].map((s) => (
                <div key={s.label} className="rounded-xl bg-muted/50 px-2 py-2">
                  <p className="text-[11px] text-muted-foreground">{s.label}</p>
                  <p className="mt-0.5 text-[13px] font-semibold text-foreground">{s.value}</p>
                </div>
              ))}
            </div>
          </>
        ) : (
          <>
            <p className="mb-3 text-[14px] font-semibold text-foreground">
              {rewardUnlocked
                ? "Goal Completed — reward unlocked 🎉"
                : `${c.target} activations by ${c.end} to unlock reward 🔥`}
            </p>
            <div className="flex items-center justify-between text-[12px] text-muted-foreground">
              <span>
                {c.current} / {c.target} Activations
              </span>
              <span className={rewardUnlocked ? "font-medium text-emerald-600" : undefined}>
                {rewardUnlocked ? "Goal Completed" : `${remaining} to go`}
              </span>
            </div>
            <div className="mt-1.5">
              <GreenProgress percent={pct} />
            </div>
            <p className="mt-1.5 text-[12px] text-muted-foreground">Complete {pct}%</p>
          </>
        )}
      </GamCard>

      {c.rewardKind === "mystery" ? (
        <GamCard>
          <p className="mb-3 text-[14px] font-semibold text-foreground">
            {mysteryClaimed
              ? "Mystery Box Opened ✅"
              : rewardUnlocked
                ? "Your Mystery Reward Is Ready! 🎉"
                : "Unlock Your Mystery Reward 🎁"}
          </p>
          <div className="flex justify-center">
            <MysteryBox size={140} locked={!rewardUnlocked} />
          </div>
          {mysteryClaimed ? (
            <p className="mt-4 rounded-xl bg-emerald-50 py-3 text-center text-[14px] font-medium text-emerald-600">
              Reward Claimed
            </p>
          ) : (
            <button
              onClick={() => setMysteryOpen(true)}
              disabled={!rewardUnlocked}
              className="mt-4 w-full rounded-xl bg-sky-50 py-3 text-[14px] font-medium text-primary disabled:opacity-50"
            >
              {rewardUnlocked ? "Open Mystery Box" : "Locked — Complete The Challenge"}
            </button>
          )}
        </GamCard>
      ) : c.rewardKind === "spin" ? (
        <GamCard>
          <p className="mb-1 text-[14px] font-semibold text-foreground">Your Reward</p>
          <p className="text-[13px] text-muted-foreground">🎡 {c.rewardLabel}</p>
          <p className="mt-2 text-[12px] text-muted-foreground">
            {rewardUnlocked
              ? "Unlocked — the spin was added to My Spins on Gamification Home."
              : "Complete the challenge to add a spin to My Spins."}
          </p>
        </GamCard>
      ) : (
        <GamCard>
          <p className="mb-1 text-[14px] font-semibold text-foreground">Your Reward</p>
          <p className="text-[13px] text-muted-foreground">
            {competitionRewardIcon[c.rewardKind]} {c.rewardLabel}
          </p>
          <p className="mt-2 text-[12px] text-muted-foreground">
            {rewardUnlocked
              ? "Unlocked — it will be added to your rewards."
              : "Complete the challenge to unlock this reward."}
          </p>
        </GamCard>
      )}

      <MysteryBoxSheet
        open={mysteryOpen}
        onOpenChange={setMysteryOpen}
        onOpened={() => actions.openMystery(c.id)}
      />

    </GamScreen>
  );
}
