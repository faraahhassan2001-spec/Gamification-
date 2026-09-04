import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { CompetitionCard } from "@/components/gamification/CompetitionCard";
import { ChallengeDetailsSheet } from "@/components/gamification/ChallengeDetailsSheet";
import {
  ChallengeFilterSheet,
  applyChallengeFilters,
  type ChallengeFilters,
} from "@/components/gamification/ChallengeFilterSheet";
import { GamScreen, SearchBar, UnderlineTabs } from "@/components/gamification/ui";
import { actions, useCompetitions } from "@/lib/gamification-state";
import type { Competition } from "@/lib/gamification";

export const Route = createFileRoute("/challenges")({
  head: () => ({
    meta: [
      { title: "Challenges — Dealer Gamification" },
      {
        name: "description",
        content:
          "Browse your joined challenges and available ones, track progress and join new dealer challenges.",
      },
      { property: "og:title", content: "Challenges — Dealer Gamification" },
      {
        property: "og:description",
        content: "Joined and available dealer challenges with live progress.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: CompetitionsScreen,
});

const tabs = ["My Challenges", "Available"] as const;

function CompetitionsScreen() {
  const [tab, setTab] = useState<(typeof tabs)[number]>("My Challenges");
  const [query, setQuery] = useState("");
  const [filterOpen, setFilterOpen] = useState(false);
  const [filters, setFilters] = useState<ChallengeFilters>({
    status: "All",
    reward: "All",
    date: "",
  });
  const [sheet, setSheet] = useState<Competition | null>(null);
  const all = useCompetitions();

  const list = applyChallengeFilters(
    all
      .filter((c) => (tab === "My Challenges" ? c.joined : !c.joined))
      .filter((c) => c.title.toLowerCase().includes(query.toLowerCase())),
    filters
  );

  return (
    <GamScreen title="Challenges" backTo="/gamification">
      <UnderlineTabs tabs={tabs} value={tab} onChange={setTab} />
      <SearchBar
        value={query}
        onChange={setQuery}
        onFilterClick={() => setFilterOpen(true)}
      />

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
          <p className="rounded-2xl bg-card p-6 text-center text-[13px] text-muted-foreground shadow-sm">
            No challenges found.
          </p>
        )}
      </div>

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

      <ChallengeFilterSheet
        open={filterOpen}
        onOpenChange={setFilterOpen}
        onApply={setFilters}
      />
    </GamScreen>
  );
}
