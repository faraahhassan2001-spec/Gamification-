import { cashConversionOffer } from "@/lib/gamification";

export function CashConversionRow({ onSelect }: { onSelect: () => void }) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className="flex w-full items-center gap-3 rounded-2xl border border-transparent bg-card p-3 text-left shadow-[0_2px_10px_rgba(15,42,80,0.06)] transition-colors"
    >
      <span className="flex size-14 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-2xl">
        💱
      </span>
      <span className="min-w-0 flex-1">
        <span className="block truncate text-[14px] font-semibold text-foreground">
          Cash Conversion
        </span>
        <span className="block text-[13px] font-semibold text-primary">
          {cashConversionOffer.points} pts = {cashConversionOffer.jod} JOD
        </span>
        <span className="mt-0.5 block text-[11px] text-muted-foreground">Available</span>
      </span>
      <span className="shrink-0 rounded-full bg-slate-100 px-3 py-1.5 text-[12px] font-medium text-foreground">
        Select
      </span>
    </button>
  );
}
