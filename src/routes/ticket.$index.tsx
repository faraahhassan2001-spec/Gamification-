import { createFileRoute, Link, useNavigate, useParams } from "@tanstack/react-router";
import { useState } from "react";
import { AlertTriangle, ArrowLeft, ArrowRight, ChevronRight, Eye, FileText, Image as ImageIcon, Plus } from "lucide-react";
import { AddCommentSheet } from "@/components/AddCommentSheet";
import { CommentDetailsSheet } from "@/components/CommentDetailsSheet";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { tickets, statusStyles } from "@/lib/tickets";
import { initials, useComments, type TicketComment } from "@/lib/comments";
import { toast } from "sonner";


export const Route = createFileRoute("/ticket/$index")({
  head: () => ({
    meta: [
      { title: "View Ticket Details — Support Desk" },
      {
        name: "description",
        content:
          "View full support ticket details: status, ticket type, date, priority level, attached documents and description.",
      },
      { property: "og:title", content: "View Ticket Details — Support Desk" },
      {
        property: "og:description",
        content: "Full ticket details with documents, description and quick actions.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: TicketDetails,
});

function TicketDetails() {
  const [active, setActive] = useState<TicketComment | null>(null);
  const [commentOpen, setCommentOpen] = useState(false);
  const [closeConfirmOpen, setCloseConfirmOpen] = useState(false);
  const navigate = useNavigate({ from: "/ticket/$index" });
  const { index } = useParams({ from: "/ticket/$index" });
  const ticket = tickets[Number(index)] ?? tickets[0]!;
  const comments = useComments(index);
  const preview = comments.slice(-3);

  const rows = [
    { label: "Ticket ID", value: ticket.id },
    { label: "Ticket type", value: ticket.title },
    { label: "Sup type", value: "Connectivity" },
    { label: "Date", value: ticket.date },
    { label: "Priority level", value: "High" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto flex min-h-screen w-full max-w-md flex-col px-5 pb-10 pt-5">
        <header className="flex items-center">
          <Link
            to="/"
            aria-label="Go back"
            className="flex size-11 items-center justify-center rounded-full bg-card shadow-sm transition-colors hover:bg-accent"
          >
            <ArrowLeft className="size-5 text-foreground" />
          </Link>
          <h1 className="flex-1 pr-11 text-center text-xl font-semibold text-foreground">
            View Details
          </h1>
        </header>

        <section className="mt-6 rounded-2xl bg-card px-5 shadow-sm">
          <div className="flex items-center justify-between border-b border-border py-4">
            <span className="text-[15px] text-muted-foreground">Status</span>
            <span
              className={`rounded-full px-3 py-1 text-xs font-medium ${statusStyles[ticket.status]}`}
            >
              {ticket.status}
            </span>
          </div>
          {rows.map((r, i) => (
            <div
              key={r.label}
              className={`flex items-center justify-between py-4 ${
                i < rows.length - 1 ? "border-b border-border" : ""
              }`}
            >
              <span className="text-[15px] text-muted-foreground">{r.label}</span>
              <span className="text-[15px] font-semibold text-foreground">{r.value}</span>
            </div>
          ))}
        </section>

        <h2 className="mt-6 text-[17px] font-semibold text-foreground">Documents</h2>
        <div className="mt-3 rounded-2xl border border-dashed border-border bg-card px-4 shadow-sm">
          {[
            { name: "File name", icon: FileText },
            { name: "File name", icon: ImageIcon },
          ].map((f, i) => (
            <div
              key={i}
              className={`flex items-center gap-3 py-4 ${i === 0 ? "border-b border-border" : ""}`}
            >
              <f.icon className="size-5 text-foreground" />
              <span className="flex-1 text-[15px] text-foreground">{f.name}</span>
              <button aria-label={`Preview ${f.name}`} className="text-primary">
                <Eye className="size-5" />
              </button>
            </div>
          ))}
        </div>

        <h2 className="mt-6 text-[17px] font-semibold text-foreground">Description</h2>
        <p className="mt-3 min-h-32 rounded-2xl bg-muted p-4 text-[15px] text-muted-foreground">
          Description
        </p>

        <section className="mt-6 rounded-2xl bg-card p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <h2 className="text-[17px] font-semibold text-foreground">Comments</h2>
            <Link
              to="/conversation/$index"
              params={{ index }}
              className="flex items-center gap-1 text-[13px] font-semibold text-primary"
            >
              View All Comments ({comments.length})
              <ArrowRight className="size-4" />
            </Link>
          </div>

          <div className="mt-3 divide-y divide-border">
            {preview.map((c) => (
              <button
                key={c.id}
                onClick={() => setActive(c)}
                className="flex w-full items-start gap-3 py-3 text-left transition-colors hover:bg-accent/40"
              >
                <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-[11px] font-semibold text-primary">
                  {initials(c.author)}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[13px] font-semibold text-foreground">{c.author}</p>
                  <p className="text-[11px] text-muted-foreground">
                    {c.role ? `${c.role} \u00b7 ` : ""}
                    {c.time}
                  </p>
                  <p className="mt-1 truncate text-[12px] text-muted-foreground">{c.text}</p>
                  {c.attachments.length > 0 && (
                    <div className="mt-1.5 space-y-1">
                      {c.attachments.map((a, i) => (
                        <span
                          key={`${a.name}-${i}`}
                          className="flex items-center gap-1.5 text-[11px] text-primary"
                        >
                          {a.kind === "image" ? (
                            <ImageIcon className="size-3.5" />
                          ) : (
                            <FileText className="size-3.5" />
                          )}
                          <span className="truncate">{a.name}</span>
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                <ChevronRight className="mt-1 size-4 shrink-0 text-muted-foreground" />
              </button>
            ))}
          </div>
        </section>

        <div className="mt-10 space-y-3">
          <button
            onClick={() => setCommentOpen(true)}
            className="flex w-full items-center justify-center gap-2 rounded-full bg-primary py-4 text-[15px] font-semibold text-primary-foreground transition-opacity hover:opacity-90"
          >
            <Plus className="size-5" />
            Add Comment
          </button>
          <button
            onClick={() => setCloseConfirmOpen(true)}
            className="w-full rounded-full border border-border bg-card py-4 text-[15px] font-semibold text-foreground transition-colors hover:bg-accent"
          >
            Close Ticket
          </button>
        </div>

        <CommentDetailsSheet comment={active} onOpenChange={(o) => !o && setActive(null)} />
        <AddCommentSheet ticketKey={index} open={commentOpen} onOpenChange={setCommentOpen} />

        <Dialog open={closeConfirmOpen} onOpenChange={setCloseConfirmOpen}>
          <DialogContent className="mx-4 max-w-sm rounded-2xl border-0 bg-background p-5">
            <div className="flex flex-col items-center text-center">
              <div className="flex size-12 items-center justify-center rounded-full bg-primary/10">
                <AlertTriangle className="size-6 text-primary" />
              </div>
              <DialogTitle className="mt-4 text-lg font-semibold text-foreground">
                Close Ticket
              </DialogTitle>
              <p className="mt-2 text-[14px] text-muted-foreground">
                Are you sure you want to close this ticket? This action cannot be undone.
              </p>
            </div>

            <div className="mt-6 flex gap-3">
              <button
                onClick={() => setCloseConfirmOpen(false)}
                className="flex-1 rounded-full border border-border py-3.5 text-[15px] font-semibold text-foreground"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setCloseConfirmOpen(false);
                  toast.success("Ticket closed successfully");
                  navigate({ to: "/" });
                }}
                className="flex-1 rounded-full bg-primary py-3.5 text-[15px] font-semibold text-primary-foreground transition-opacity hover:opacity-90"
              >
                Confirm
              </button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
