import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { ChevronRight, History as HistoryIcon } from "lucide-react";
import { GamCard, GamScreen, PrimaryButton, WalletBanner } from "@/components/gamification/ui";
import { CatalogItemRow } from "@/components/gamification/CatalogItemRow";
import { CatalogRedeemDialogs } from "@/components/gamification/CatalogRedeemDialogs";
import { CashConversionRow } from "@/components/gamification/CashConversionRow";
import { ConvertPointsSheet } from "@/components/gamification/ConvertPointsSheet";
import { formatPoints, marketplaceCatalog, points } from "@/lib/gamification";
import { redeemItem, usePointsBalance } from "@/lib/gamification-state";

export const Route = createFileRoute("/points/")({
  head: () => ({
    meta: [
      { title: "Points & Marketplace — Dealer Gamification" },
      {
        name: "description",
        content:
          "Check your available points, lifetime earned and spent, then redeem catalog items for points.",
      },
      { property: "og:title", content: "Points & Marketplace — Dealer Gamification" },
      { property: "og:description", content: "Points balance and catalog redemption." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: PointsMarketplaceScreen,
});

const PREVIEW_COUNT = 3;

function PointsMarketplaceScreen() {
  const [itemId, setItemId] = useState<string | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [successOpen, setSuccessOpen] = useState(false);
  const [redeemedName, setRedeemedName] = useState("");
  const [redeemedPoints, setRedeemedPoints] = useState(0);
  const [convertOpen, setConvertOpen] = useState(false);

  const balance = usePointsBalance();
  const selected = marketplaceCatalog.find((m) => m.id === itemId) ?? null;
  const canRedeem = !!selected && selected.points <= balance;
  const visibleCatalog = marketplaceCatalog.slice(0, PREVIEW_COUNT);

  return (
    <GamScreen
      title="Points & Marketplace"
      backTo="/gamification"
      right={
        <Link
          to="/points/history"
          aria-label="View History"
          className="flex size-10 items-center justify-center rounded-full bg-card shadow-sm transition-colors hover:bg-accent"
        >
          <HistoryIcon className="size-4 text-foreground" />
        </Link>
      }
      footer={
        <PrimaryButton disabled={!canRedeem} onClick={() => setConfirmOpen(true)}>
          Redeem
        </PrimaryButton>
      }
    >
      <WalletBanner points={balance} />

      <GamCard>
        <div className="grid grid-cols-2 gap-3 text-center">
          <div>
            <p className="text-[12px] text-muted-foreground">Lifetime Earned</p>
            <p className="mt-1 text-[16px] font-semibold text-emerald-600">
              {formatPoints(points.lifetimeEarned)} pts
            </p>
          </div>
          <div>
            <p className="text-[12px] text-muted-foreground">Lifetime Spent</p>
            <p className="mt-1 text-[16px] font-semibold text-rose-500">
              {formatPoints(points.lifetimeSpent)} pts
            </p>
          </div>
        </div>
      </GamCard>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <p className="text-[14px] text-foreground">Redeemable items</p>
          {marketplaceCatalog.length > PREVIEW_COUNT && (
            <Link
              to="/points/marketplace"
              className="flex items-center gap-1 text-[13px] font-medium text-primary"
            >
              See all
              <ChevronRight className="size-4" />
            </Link>
          )}
        </div>
        {visibleCatalog.map((item) => (
          <CatalogItemRow
            key={item.id}
            item={item}
            balance={balance}
            selected={itemId === item.id}
            onSelect={() => setItemId(itemId === item.id ? null : item.id)}
          />
        ))}
        <CashConversionRow onSelect={() => setConvertOpen(true)} />
      </div>

      <ConvertPointsSheet open={convertOpen} onOpenChange={setConvertOpen} />

      <CatalogRedeemDialogs
        selected={selected}
        balance={balance}
        confirmOpen={confirmOpen}
        onConfirmOpenChange={setConfirmOpen}
        onConfirmRedeem={() => {
          if (!selected) return;
          redeemItem(selected.name, selected.points);
          setRedeemedName(selected.name);
          setRedeemedPoints(selected.points);
          setItemId(null);
          setConfirmOpen(false);
          setSuccessOpen(true);
        }}
        successOpen={successOpen}
        onSuccessOpenChange={setSuccessOpen}
        redeemedName={redeemedName}
        redeemedPoints={redeemedPoints}
      />
    </GamScreen>
  );
}
