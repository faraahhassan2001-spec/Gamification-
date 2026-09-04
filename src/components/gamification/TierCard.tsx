import { Link } from "@tanstack/react-router";
import { ChevronRight } from "lucide-react";
import { formatPoints, loyalty } from "@/lib/gamification";
import { GamCard, GreenProgress } from "./ui";

export function TierCard({ seeAllTo, clickable }: { seeAllTo?: string; clickable?: boolean }) {
  const percent = Math.min(
    100,
    Math.round((loyalty.points / loyalty.nextTierThreshold) * 100),
  );

  const body = (
    <GamCard>
      <div className="mb-2 flex items-center justify-between">
        <h2 className="text-[15px] font-semibold text-foreground">Keep Earning Points 🔥</h2>
        {seeAllTo && clickable && (
          <span className="flex items-center gap-1 text-[13px] font-medium text-primary">
            See all
            <ChevronRight className="size-4" />
          </span>
        )}
        {seeAllTo && !clickable && (
          <Link to={seeAllTo} className="flex items-center gap-1 text-[13px] font-medium text-primary">
            See all
            <ChevronRight className="size-4" />
          </Link>
        )}
      </div>
      <div className="flex flex-col items-center py-2">
        <span className="text-[46px] leading-none">🏅</span>
        <p className="mt-2 text-[17px] font-semibold text-foreground">
          {formatPoints(loyalty.points)} Points
        </p>
        <p className="text-[12px] text-muted-foreground">Gold Tier</p>
      </div>
      {loyalty.isTopTier ? (
        <p className="mt-1 text-center text-[12px] font-medium text-emerald-600">
          Top Tier Reached
        </p>
      ) : (
        <>
          <div className="mt-1 flex items-center justify-between text-[12px] text-muted-foreground">
            <span>Progress to {loyalty.nextTier}</span>
            <span>{percent}%</span>
          </div>
          <div className="mt-1.5">
            <GreenProgress percent={percent} />
          </div>
          <p className="mt-1.5 text-[12px] text-muted-foreground">
            {formatPoints(loyalty.pointsToNext)} Points to {loyalty.nextTier}
          </p>
        </>
      )}
    </GamCard>
  );

  if (clickable) {
    return (
      <Link to="/loyalty" className="block">
        {body}
      </Link>
    );
  }
  return body;
}
