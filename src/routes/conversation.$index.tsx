import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { ArrowLeft, Paperclip } from "lucide-react";
import { CommentDetailsSheet } from "@/components/CommentDetailsSheet";
import { tickets } from "@/lib/tickets";
import { initials, useComments, type TicketComment } from "@/lib/comments";


export const Route = createFileRoute("/conversation/$index")({
  head: () => ({
    meta: [
      { title: "Ticket Conversation — Support Desk" },
      {
        name: "description",
        content:
          "Full conversation history for your support ticket, including comments from the support team and attachments.",
      },
      { property: "og:title", content: "Ticket Conversation — Support Desk" },
      {
        property: "og:description",
        content: "Read the complete comment history of your support ticket and post a reply.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ConversationPage,
});

function ConversationPage() {
  const { index } = useParams({ from: "/conversation/$index" });
  const ticket = tickets[Number(index)] ?? tickets[0]!;
  const comments = useComments(index);
  const [active, setActive] = useState<TicketComment | null>(null);

  const endRef = useRef<HTMLDivElement>(null);
  const count = comments.length;

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [count]);

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto flex min-h-screen w-full max-w-md flex-col px-5 pb-5 pt-5">
        <header className="flex items-center gap-3">
          <Link
            to="/ticket/$index"
            params={{ index }}
            aria-label="Back to ticket details"
            className="flex size-11 shrink-0 items-center justify-center rounded-full bg-card shadow-sm transition-colors hover:bg-accent"
          >
            <ArrowLeft className="size-5 text-foreground" />
          </Link>
          <div className="flex-1 pr-11 text-center">
            <h1 className="text-xl font-semibold text-foreground">Ticket Conversation</h1>
            <p className="text-[13px] text-muted-foreground">Ticket #{ticket.id}</p>
          </div>
        </header>

        <p className="mt-6 text-[13px] font-medium text-muted-foreground">
          {count} comments
        </p>

        <div className="mt-3 space-y-3">
          {comments.map((c) => (
            <article
              key={c.id}
              onClick={() => setActive(c)}
              className={`cursor-pointer rounded-2xl p-4 shadow-sm transition-colors hover:bg-accent ${
                c.isCurrentUser ? "bg-muted" : "bg-card"
              }`}
            >
              <div className="flex items-start gap-3">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-[13px] font-semibold text-primary">
                  {initials(c.author)}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[15px] font-semibold text-foreground">{c.author}</p>
                  <p className="text-[12px] text-muted-foreground">
                    {c.role ? `${c.role} · ` : ""}
                    {c.time}
                  </p>
                  <p className="mt-2 text-[14px] leading-relaxed text-foreground">{c.text}</p>

                  {c.attachments.length > 0 && (
                    <div className="mt-3 space-y-2">
                      <div className="flex items-center gap-2 rounded-xl border border-dashed border-border px-3 py-2">
                        <Paperclip className="size-4 text-muted-foreground" />
                        <span className="flex-1 truncate text-[13px] text-foreground">
                          {c.attachments.length} file
                          {c.attachments.length === 1 ? "" : "s"} attached
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </article>
          ))}
          <div ref={endRef} />
        </div>

        <CommentDetailsSheet comment={active} onOpenChange={(o) => !o && setActive(null)} />
      </div>
    </div>
  );
}
