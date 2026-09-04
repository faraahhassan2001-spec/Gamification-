import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowLeft,
  ArrowLeftRight,
  ArrowRight,
  ArrowRightLeft,
  Ban,
  BarChart3,
  Bell,
  ClipboardList,
  Clock,
  Cpu,
  Gift,
  History,
  LayoutDashboard,
  MapPin,
  MoreHorizontal,
  Package,
  PackageCheck,
  Phone,
  Printer,
  QrCode,
  Receipt,
  RefreshCw,
  RotateCcw,
  ScanLine,
  ShoppingCart,
  SlidersHorizontal,
  Smartphone,
  Ticket,
  UserCog,
  UserPlus,
  UserX,
  Users,
  Wallet,
  Wifi,
} from "lucide-react";
import { useState } from "react";
import { WalletBanner, UnderlineTabs } from "@/components/gamification/ui";
import { TierCard } from "@/components/gamification/TierCard";
import { CompetitionCard } from "@/components/gamification/CompetitionCard";
import { useCompetitions } from "@/lib/gamification-state";
import {
  capabilities,
  dealer,
  formatPoints,
  homeWidgetOrder,
} from "@/lib/gamification";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Home — Dashboard" },
      {
        name: "description",
        content:
          "Your personal dashboard for e-reload, e-wallets, stock management, and customer activities.",
      },
      { property: "og:title", content: "Home — Dashboard" },
      {
        property: "og:description",
        content:
          "Your personal dashboard for e-reload, e-wallets, stock management, and customer activities.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: HomeDashboard,
});

function HomeDashboard() {
  return (
    <div className="min-h-screen bg-background">
      <div className="relative mx-auto flex min-h-screen w-full max-w-md flex-col">
        <header className="px-5 pb-4 pt-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[13px] text-muted-foreground">Hello, Hamza</p>
              <p className="text-[15px] font-semibold text-foreground">123456789</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                aria-label="Scan"
                className="flex size-10 items-center justify-center rounded-full bg-card shadow-sm transition-colors hover:bg-accent"
              >
                <ScanLine className="size-5 text-primary" />
              </button>
              <button
                aria-label="QR Code"
                className="flex size-10 items-center justify-center rounded-full bg-card shadow-sm transition-colors hover:bg-accent"
              >
                <QrCode className="size-5 text-primary" />
              </button>
              <Link
                to="/"
                aria-label="Go home"
                className="flex size-10 items-center justify-center rounded-full bg-card shadow-sm transition-colors hover:bg-accent"
              >
                <ArrowLeft className="size-5 text-foreground" />
              </Link>
              <Link
                to="/notifications"
                aria-label="Notifications"
                className="relative flex size-10 items-center justify-center rounded-full bg-card shadow-sm transition-colors hover:bg-accent"
              >
                <Bell className="size-5 text-foreground" />
                <span className="absolute right-2.5 top-2.5 size-2 rounded-full bg-destructive" />
              </Link>
            </div>
          </div>
        </header>

        <main className="flex-1 space-y-5 px-5 pb-8 pt-2">
          <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-sky-500 to-blue-600 px-5 py-6 text-white shadow-md">
            <div className="relative z-10 max-w-[60%]">
              <p className="text-lg font-semibold leading-snug">Unlock Your Potential</p>
              <p className="mt-1 text-[13px] leading-relaxed opacity-90">
                Drive Sales, Expand Reach, Achieve Success
              </p>
              <div className="mt-3 flex gap-1">
                <span className="h-1 w-4 rounded-full bg-white" />
                <span className="h-1 w-4 rounded-full bg-white/40" />
                <span className="h-1 w-4 rounded-full bg-white/40" />
              </div>
            </div>
          </section>

          <GamificationWidgets />

          {capabilities.loyalty && (
            <section>
              <TierCard seeAllTo="/loyalty" clickable />
            </section>
          )}



          <Section title="E-Reload">
            <IconItem icon={Ticket} label="E-Voucher" />
            <IconItem icon={History} label="History" />
            <IconItem icon={Package} label="Bundle subs." />
            <IconItem icon={ArrowLeftRight} label="Credit transfer" />
            <IconItem icon={Receipt} label="Bill Payment" />
            <IconItem icon={Ban} label="Void Voucher" />
            <IconItem icon={Printer} label="Re-print Voucher" />
            <IconItem icon={Gift} label="CVM offer" />
          </Section>

          <Section title="E-Wallets" seeAll>
            <div className="col-span-full space-y-3">
              <WalletCard />
              <WalletCard />
              <PointsWalletCard />
            </div>
            <IconItem icon={UserPlus} label="Customer recharge" />
            <IconItem icon={Wallet} label="Wallet Topup" />
            <IconItem icon={Clock} label="Transaction History" />
            <IconItem icon={BarChart3} label="Analytics" />
          </Section>

          <Section title="Stock Management" seeAll>
            <IconItem icon={LayoutDashboard} label="Inventory Dashboard" />
            <IconItem icon={ShoppingCart} label="Sales Order" />
            <IconItem icon={ClipboardList} label="Purchase Order" />
            <IconItem icon={RotateCcw} label="Stock Return" />
            <IconItem icon={Users} label="My Hierarchy" />
            <IconItem icon={MapPin} label="Check In" />
          </Section>

          <Section title="Customer Activities" seeAll>
            <IconItem icon={Smartphone} label="Prepaid" />
            <IconItem icon={Phone} label="Postpaid" />
            <IconItem icon={Cpu} label="SIM Replacement" />
            <IconItem icon={PackageCheck} label="Fulfillment" />
            <IconItem icon={Wifi} label="HBB" />
            <IconItem icon={ArrowRight} label="Port IN" />
            <IconItem icon={RefreshCw} label="Resubmit" />
            <IconItem icon={ArrowRightLeft} label="Pre2Post" />
            <IconItem icon={History} label="Order History" />
            <IconItem icon={UserX} label="Customer Termination" />
            <IconItem icon={Smartphone} label="SIM Termination" />
            <IconItem icon={UserCog} label="Change Ownership" />
            <IconItem icon={SlidersHorizontal} label="Credit Limit Adjustment" />
          </Section>
        </main>
      </div>
    </div>
  );
}

function Section({
  title,
  seeAll,
  children,
}: {
  title: string;
  seeAll?: boolean;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-3xl bg-card p-4 shadow-sm">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-[15px] font-semibold text-foreground">{title}</h2>
        {seeAll && (
          <button className="flex items-center gap-1 text-[13px] font-medium text-primary">
            See all
            <ArrowRight className="size-4" />
          </button>
        )}
        {!seeAll && (
          <button aria-label="More options" className="text-muted-foreground">
            <MoreHorizontal className="size-5" />
          </button>
        )}
      </div>
      <div className="grid grid-cols-4 gap-y-4">{children}</div>
    </section>
  );
}

function IconItem({ icon: Icon, label }: { icon: React.ElementType; label: string }) {
  return (
    <button className="flex flex-col items-center gap-2 text-center">
      <span className="flex size-12 items-center justify-center rounded-full bg-primary/10">
        <Icon className="size-6 text-primary" />
      </span>
      <span className="max-w-[4.5rem] text-[11px] leading-tight text-foreground">{label}</span>
    </button>
  );
}

function WalletCard() {
  return (
    <div className="flex items-center justify-between rounded-2xl bg-gradient-to-r from-teal-600 to-emerald-700 px-4 py-4 text-white shadow-sm">
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <span className="text-[13px] font-semibold">E-Voucher</span>
          <span className="rounded-full bg-white/20 px-2 py-0.5 text-[10px] font-medium">Shared</span>
        </div>
        <p className="text-[12px] opacity-80">Operator</p>
        <p className="text-[12px] opacity-80">Manager name</p>
      </div>
      <div className="text-right">
        <p className="text-lg font-semibold">456.789</p>
        <p className="text-[11px] opacity-80">USD</p>
      </div>
    </div>
  );
}

function PointsWalletCard() {
  return (
    <div className="flex items-center justify-between rounded-2xl bg-gradient-to-r from-[#152a4e] via-[#1f4f80] to-[#3f9fc4] px-4 py-4 text-white shadow-sm">
      <div className="space-y-1">
        <span className="text-[13px] font-semibold">Points Wallet</span>
        <p className="text-[12px] opacity-80">Dealer rewards</p>
      </div>
      <div className="text-right">
        <p className="text-lg font-semibold">{formatPoints(dealer.points)} pts</p>
      </div>
    </div>
  );
}

function GamificationWidgets() {
  const [tab, setTab] = useState<"My Challenges" | "Available">("My Challenges");
  const competitions = useCompetitions();
  const list = competitions
    .filter((c) => (tab === "My Challenges" ? c.joined : !c.joined))
    .slice(0, 2);

  return (
    <>
      {homeWidgetOrder.map((w) =>
        w === "gamification" && capabilities.gamification ? (
          <section key={w} className="rounded-3xl bg-card p-4 shadow-sm">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="flex items-center gap-2 text-[16px] font-semibold text-foreground">
                Gamification
              </h2>
              <div className="flex items-center gap-3">
                <button aria-label="More options" className="text-muted-foreground">
                  <MoreHorizontal className="size-5" />
                </button>
                <span className="h-4 w-px bg-border" />
                <Link
                  to="/gamification"
                  className="flex items-center gap-1 text-[13px] font-medium text-primary"
                >
                  See all
                  <ArrowRight className="size-4" />
                </Link>
              </div>
            </div>

            <WalletBanner points={dealer.points} />

            <div className="mt-4">
              <UnderlineTabs
                tabs={["My Challenges", "Available"] as const}
                value={tab}
                onChange={setTab}
              />
            </div>

            <div className="mt-3 flex items-center justify-between">
              <p className="text-[13px] text-muted-foreground">Current Challenges</p>
              <Link to="/challenges" className="text-[13px] font-medium text-primary">
                See All
              </Link>
            </div>

            <div className="mt-2 space-y-3">
              {list.map((c) => (
                <CompetitionCard
                  key={c.id}
                  c={c}
                  variant={tab === "My Challenges" ? "progress" : "available"}
                />
              ))}
              {list.length === 0 && (
                <p className="rounded-2xl bg-secondary p-3 text-[12px] text-muted-foreground">
                  Nothing here yet.
                </p>
              )}
            </div>
          </section>
        ) : null,
      )}
    </>
  );
}
