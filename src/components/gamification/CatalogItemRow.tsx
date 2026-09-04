import { Lock } from "lucide-react";
import {
  catalogInStock,
  catalogStockLabel,
  formatPoints,
  type MarketplaceCatalogItem,
} from "@/lib/gamification";

export function CatalogItemRow({
  item,
  balance,
  selected,
  onSelect,
}: {
  item: MarketplaceCatalogItem;
  balance: number;
  selected: boolean;
  onSelect: () => void;
}) {
  const inStock = catalogInStock(item);
  const missing = item.points - balance;
  const eligible = inStock && missing <= 0;

  return (
    <button
      type="button"
      disabled={!eligible}
      aria-pressed={selected}
      onClick={onSelect}
      className={`flex w-full items-center gap-3 rounded-2xl border bg-card p-3 text-left shadow-[0_2px_10px_rgba(15,42,80,0.06)] transition-colors ${
        selected ? "border-primary ring-1 ring-primary" : "border-transparent"
      } ${eligible ? "" : "opacity-70"}`}
    >
      <span className="flex size-14 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-2xl">
        {item.emoji}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block truncate text-[14px] font-semibold text-foreground">{item.name}</span>
        <span className="block text-[13px] font-semibold text-primary">
          {formatPoints(item.points)} pts
        </span>
        {!inStock ? (
          <span className="mt-0.5 flex items-center gap-1 text-[11px] font-medium text-rose-500">
            <Lock className="size-3" />
            Out of Stock
          </span>
        ) : missing > 0 ? (
          <span className="mt-0.5 flex items-center gap-1 text-[11px] font-medium text-rose-500">
            <Lock className="size-3" />
            You need {formatPoints(missing)} more pts
          </span>
        ) : (
          <span className="mt-0.5 block text-[11px] text-muted-foreground">
            {catalogStockLabel(item)}
          </span>
        )}
      </span>
      {!selected && (
        <span
          className={`shrink-0 rounded-full px-3 py-1.5 text-[12px] font-medium ${
            eligible ? "bg-slate-100 text-foreground" : "bg-slate-100 text-muted-foreground"
          }`}
        >
          {eligible ? "Select" : !inStock ? "Out of Stock" : "Locked"}
        </span>
      )}
    </button>
  );
}
