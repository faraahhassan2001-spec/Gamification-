import { useState } from "react";
import { Paperclip, Plus, X } from "lucide-react";
import {
  Drawer,
  DrawerContent,
  DrawerTitle,
} from "@/components/ui/drawer";
import { addComment, type CommentAttachment } from "@/lib/comments";
import { toast } from "sonner";

export function AddCommentSheet({
  ticketKey,
  open,
  onOpenChange,
  onPosted,
}: {
  ticketKey: string;
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onPosted?: () => void;
}) {
  const [text, setText] = useState("");
  const [files, setFiles] = useState<CommentAttachment[]>([]);

  const reset = () => {
    setText("");
    setFiles([]);
  };

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="mx-auto max-w-md rounded-t-3xl border-0 bg-background px-5 pb-8">
        <div className="relative pt-2">
          <DrawerTitle className="text-left text-xl font-semibold text-foreground">
            Add Comment
          </DrawerTitle>
          <button
            aria-label="Close"
            onClick={() => onOpenChange(false)}
            className="absolute right-0 top-0 flex size-10 items-center justify-center rounded-full bg-muted text-muted-foreground transition-colors hover:bg-accent"
          >
            <X className="size-5" />
          </button>
        </div>

        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Write your comment..."
          className="mt-5 min-h-32 w-full resize-y rounded-2xl bg-muted p-4 text-[15px] text-foreground outline-none placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring"
        />

        <div className="mt-4 space-y-2">
          {files.map((f, i) => (
            <div
              key={f.name + i}
              className="flex items-center gap-3 rounded-xl border border-dashed border-border px-4 py-3"
            >
              <Paperclip className="size-4 text-muted-foreground" />
              <span className="flex-1 text-[14px] text-foreground">{f.name}</span>
              <button
                aria-label={`Remove ${f.name}`}
                onClick={() => setFiles(files.filter((_, j) => j !== i))}
                className="text-muted-foreground"
              >
                <X className="size-4" />
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() =>
              setFiles((prev) => [
                ...prev,
                { name: `attachment-${prev.length + 1}.png`, kind: "image" },
              ])
            }
            className="flex items-center gap-2 text-[15px] font-semibold text-primary"
          >
            <Plus className="size-5" />
            Add Attachment
          </button>
        </div>

        <div className="mt-8 flex gap-3">
          <button
            onClick={() => {
              reset();
              onOpenChange(false);
            }}
            className="flex-1 rounded-full border border-border py-4 text-[15px] font-semibold text-foreground"
          >
            Cancel
          </button>
          <button
            disabled={!text.trim()}
            onClick={() => {
              addComment(ticketKey, text.trim(), files);
              reset();
              onOpenChange(false);
              toast.success("Comment posted");
              onPosted?.();
            }}
            className="flex-1 rounded-full bg-primary py-4 text-[15px] font-semibold text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-50"
          >
            Post Comment
          </button>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
