import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { GamScreen, PrimaryButton } from "@/components/gamification/ui";
import { CatalogItemRow } from "@/components/gamification/CatalogItemRow";
import { CatalogRedeemDialogs } from "@/components/gamification/CatalogRedeemDialogs";
import { CashConversionRow } from "@/components/gamification/CashConversionRow";
import { ConvertPointsSheet } from "@/components/gamification/ConvertPointsSheet";
import { formatPoints, marketplaceCatalog } from "@/lib/gamification";
import { redeemItem, usePointsBalance } from "@/lib/gamification-state";

export const Route = createFileRoute("/points/marketplace")({
  head: () => ({
    meta: [
      { title: "All Redeemable Items — Dealer Gamification" },
      {
        name: "description",
        content: "Browse every catalog item you can redeem with your points balance.",
      },
      { property: "og:title", content: "All Redeemable Items — Dealer Gamification" },
      { property: "og:description", content: "The full points redemption catalog." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AllRedeemableItemsScreen,
});

function AllRedeemableItemsScreen() {
  const [itemId, setItemId] = useState<string | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [successOpen, setSuccessOpen] = useState(false);
  const [redeemedName, setRedeemedName] = useState("");
  const [redeemedPoints, setRedeemedPoints] = useState(0);
  const [convertOpen, setConvertOpen] = useState(false);

  const balance = usePointsBalance();
  const selected = marketplaceCatalog.find((m) => m.id === itemId) ?? null;
  const canRedeem = !!selected && selected.points <= balance;

  return (
    <GamScreen
      title="All Redeemable Items"
      backTo="/points"
      footer={
        <>
          <div className="rounded-2xl bg-card p-4 shadow-[0_2px_10px_rgba(15,42,80,0.06)]">
            <div className="flex items-center justify-between border-b border-border pb-3 text-[14px]">
              <span className="text-muted-foreground">You Spend</span>
              <span className="font-semibold text-foreground">
                {formatPoints(selected?.points ?? 0)} pts
              </span>
            </div>
            <div className="flex items-center justify-between pt-3 text-[14px]">
              <span className="text-primary">Item</span>
              <span className="font-semibold text-primary">{selected?.name ?? "—"}</span>
            </div>
          </div>
          <PrimaryButton disabled={!canRedeem} onClick={() => setConfirmOpen(true)}>
            Redeem
          </PrimaryButton>
        </>
      }
    >
      <p className="text-[13px] text-muted-foreground">
        Available balance: <span className="font-semibold text-foreground">{formatPoints(balance)} pts</span>
      </p>

      <div className="space-y-3">
        {marketplaceCatalog.map((item) => (
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
