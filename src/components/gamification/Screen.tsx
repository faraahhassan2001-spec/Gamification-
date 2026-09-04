import { Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import type { ReactNode } from "react";

export function Screen({
  title,
  backTo,
  action,
  centerTitle = false,
  children,
}: {
  title: string;
  backTo: string;
  action?: ReactNode;
  /** Center the title between the back button and a matching spacer, instead of left-aligning it. */
  centerTitle?: boolean;
  children: ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto flex min-h-screen w-full max-w-md flex-col px-5 pb-12 pt-5">
        <header className="mb-4 flex items-center gap-3">
          <Link
            to={backTo}
            aria-label="Go back"
            className="flex size-10 shrink-0 items-center justify-center rounded-full bg-card shadow-sm transition-colors hover:bg-accent"
          >
            <ArrowLeft className="size-5 text-foreground" />
          </Link>
          <h1
            className={`flex-1 text-[17px] font-semibold text-foreground ${centerTitle ? "text-center" : ""}`}
          >
            {title}
          </h1>
          {action ?? (centerTitle ? <span className="size-10 shrink-0" /> : null)}
        </header>
        <main className="flex-1 space-y-4">{children}</main>
      </div>
    </div>
  );
}

export function Card({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <section className={`rounded-3xl bg-card p-4 shadow-sm ${className}`}>{children}</section>;
}

export function SectionTitle({ children, right }: { children: ReactNode; right?: ReactNode }) {
  return (
    <div className="mb-3 flex items-center justify-between">
      <h2 className="text-[15px] font-semibold text-foreground">{children}</h2>
      {right}
    </div>
  );
}

export function EmptyState({ message, icon }: { message: string; icon?: ReactNode }) {
  return (
    <div className="flex flex-col items-center gap-2 rounded-2xl border border-dashed border-border px-4 py-8 text-center">
      {icon}
      <p className="text-[13px] text-muted-foreground">{message}</p>
    </div>
  );
}

export function Pill({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <span className={`rounded-full px-2.5 py-1 text-[11px] font-medium ${className}`}>{children}</span>
  );
}

export function ProgressBar({ percent, tone = "bg-primary" }: { percent: number; tone?: string }) {
  return (
    <div className="h-2 w-full overflow-hidden rounded-full bg-secondary">
      <div className={`h-full rounded-full ${tone}`} style={{ width: `${percent}%` }} />
    </div>
  );
}
