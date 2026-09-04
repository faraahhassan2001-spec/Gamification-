import { Briefcase, CalendarDays, Gift, Users } from "lucide-react";
import type { Competition } from "@/lib/gamification";
import { Drawer, DrawerContent, DrawerTitle } from "@/components/ui/drawer";
import { PrimaryButton } from "./ui";

export function ChallengeDetailsSheet({
  competition,
  open,
  onOpenChange,
  onJoin,
}: {
  competition: Competition | null;
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onJoin: (c: Competition) => void;
}) {
  if (!competition) return null;
  const c = competition;
  const rows = [
    { icon: Briefcase, label: "Activity", value: c.activity },
    { icon: Users, label: "Participants", value: `${c.participants} Joined` },
    { icon: Gift, label: "Rewards Type", value: c.rewardLabel },
    { icon: CalendarDays, label: "Dates", value: `${c.start} - ${c.end}` },
  ];

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="mx-auto max-w-md rounded-t-3xl px-4 pb-6">
        <DrawerTitle className="pt-2 text-center text-[19px] font-semibold">
          Challenge Details
        </DrawerTitle>

        <p className="mt-3 flex items-center gap-2 text-[16px] font-semibold text-foreground">
          <span>🏆</span>
          {c.title}
        </p>

        <div className="mt-3 rounded-2xl bg-sky-50/70 p-3">
          <p className="text-[13px] font-medium text-foreground">Descriptions</p>
          <p className="mt-1 text-[12px] leading-relaxed text-muted-foreground">{c.description}</p>
        </div>

        <div className="mt-3 space-y-2.5">
          {rows.map((r) => (
            <div key={r.label} className="flex items-center gap-3 rounded-2xl bg-slate-50 px-3 py-3">
              <span className="flex size-9 items-center justify-center rounded-full bg-sky-50">
                <r.icon className="size-4 text-primary" />
              </span>
              <span className="flex-1 text-[13px] font-semibold text-foreground">{r.label}</span>
              <span className="text-[13px] text-muted-foreground">{r.value}</span>
            </div>
          ))}
        </div>

        <div className="mt-5">
          <PrimaryButton onClick={() => onJoin(c)}>{c.joined ? "Joined" : "Join"}</PrimaryButton>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
