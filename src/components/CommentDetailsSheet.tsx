import { Drawer, DrawerContent, DrawerTitle } from "@/components/ui/drawer";
import { FileText, Image as ImageIcon, X } from "lucide-react";
import { initials, type TicketComment } from "@/lib/comments";

export function CommentDetailsSheet({
  comment,
  onOpenChange,
}: {
  comment: TicketComment | null;
  onOpenChange: (open: boolean) => void;
}) {
  return (
    <Drawer open={!!comment} onOpenChange={onOpenChange}>
      <DrawerContent className="max-h-[85vh]">
        {comment && (
          <div className="mx-auto flex w-full max-w-md flex-col overflow-hidden px-5 pb-8">
            <div className="flex items-center justify-between pt-2">
              <DrawerTitle className="text-[17px] font-semibold text-foreground">
                Comment Details
              </DrawerTitle>
              <button
                aria-label="Close"
                onClick={() => onOpenChange(false)}
                className="flex size-9 items-center justify-center rounded-full bg-muted text-foreground"
              >
                <X className="size-4" />
              </button>
            </div>

            <div className="mt-5 overflow-y-auto">
              <div className="flex items-start gap-3">
                <div className="flex size-11 shrink-0 items-center justify-center rounded-full bg-primary/10 text-[13px] font-semibold text-primary">
                  {initials(comment.author)}
                </div>
                <div className="min-w-0">
                  <p className="text-[15px] font-semibold text-foreground">{comment.author}</p>
                  {comment.role && (
                    <p className="text-[12px] text-muted-foreground">{comment.role}</p>
                  )}
                  <p className="text-[12px] text-muted-foreground">{comment.time}</p>
                </div>
              </div>

              <h3 className="mt-5 text-[14px] font-semibold text-foreground">Comment</h3>
              <p className="mt-2 rounded-2xl bg-muted p-4 text-[14px] leading-relaxed text-muted-foreground">
                {comment.text}
              </p>

              {comment.attachments.length > 0 && (
                <>
                  <h3 className="mt-5 text-[14px] font-semibold text-foreground">Documents</h3>
                  <div className="mt-2 space-y-2">
                    {comment.attachments.map((a, i) => (
                      <div
                        key={`${a.name}-${i}`}
                        className="flex items-center gap-3 rounded-xl bg-muted px-3 py-3"
                      >
                        {a.kind === "image" ? (
                          <ImageIcon className="size-5 text-primary" />
                        ) : (
                          <FileText className="size-5 text-primary" />
                        )}
                        <span className="min-w-0 flex-1 truncate text-[13px] text-foreground">
                          {a.name}
                        </span>
                        <button className="text-[13px] font-semibold text-primary">View</button>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </DrawerContent>
    </Drawer>
  );
}
