import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Banknote, ChevronRight, Smartphone, Ticket } from "lucide-react";
import { GamCard, GamScreen, SearchBar, StatusChip } from "@/components/gamification/ui";
import { rewardStatusTone } from "@/lib/gamification";
import { useRewardRows } from "@/lib/gamification-state";
import {
  RewardFilterSheet,
  applyRewardFilters,
  type RewardFilters,
} from "@/components/gamification/RewardFilterSheet";

export const Route = createFileRoute("/rewards")({
  head: () => ({
    meta: [
      { title: "Rewards — Dealer Gamification" },
      {
        name: "description",
        content:
          "All rewards you earned from challenges, with claim, preparation, shipping and delivery status.",
      },
      { property: "og:title", content: "Rewards — Dealer Gamification" },
      { property: "og:description", content: "Dealer rewards and their delivery lifecycle." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: RewardsScreen,
});

const icons = {
  cash: Banknote,
  voucher: Ticket,
  device: Smartphone,
};

function RewardsScreen() {
  const [filters, setFilters] = useState<RewardFilters>({ status: "All" });
  const [filterOpen, setFilterOpen] = useState(false);
  const [query, setQuery] = useState("");
  const rows = useRewardRows();

  const list = applyRewardFilters(rows, filters).filter((r) =>
    r.title.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <GamScreen title="Rewards" backTo="/gamification">
      <SearchBar
        value={query}
        onChange={setQuery}
        onFilterClick={() => setFilterOpen(true)}
        filterActive={filters.status !== "All"}
      />

      <GamCard className="p-2">
        <ul className="divide-y divide-border">
          {list.map((r) => {
            const Icon = icons[r.icon];
            return (
              <li key={r.id}>
                <Link
                  to="/reward/$id"
                  params={{ id: r.id }}
                  className="flex items-center gap-3 px-2 py-3"
                >
                  <span className="flex size-10 items-center justify-center rounded-full bg-sky-50">
                    <Icon className="size-4 text-primary" />
                  </span>
                  <div className="flex-1">
                    <p className="text-[13px] font-semibold text-foreground">{r.title}</p>
                    <p className="text-[12px] text-muted-foreground">{r.subtitle}</p>
                  </div>
                  <StatusChip tone={rewardStatusTone(r.status)}>{r.status}</StatusChip>
                  <ChevronRight className="size-4 text-muted-foreground" />
                </Link>
              </li>
            );
          })}
        </ul>
        {list.length === 0 && (
          <p className="py-8 text-center text-[13px] text-muted-foreground">No rewards found.</p>
        )}
      </GamCard>

      <RewardFilterSheet
        open={filterOpen}
        onOpenChange={setFilterOpen}
        onApply={setFilters}
      />
    </GamScreen>
  );
}
