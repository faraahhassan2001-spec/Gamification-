import { useSyncExternalStore } from "react";

export type CommentAttachment = { name: string; kind: "image" | "file" };

export type TicketComment = {
  id: string;
  author: string;
  role?: string | undefined;
  time: string;
  text: string;
  attachments: CommentAttachment[];
  isCurrentUser?: boolean | undefined;
};

export const currentUser = { name: "Hamza", role: undefined as string | undefined };

const seed: TicketComment[] = [
  {
    id: "c1",
    author: "Ahmed Mohammad",
    role: "Support Team",
    time: "Today, 10:32 AM",
    text: "We reviewed the reported issue and updated the configuration on the router side.",
    attachments: [{ name: "screenshot.png", kind: "image" }],
  },
  {
    id: "c2",
    author: "Hamza",
    time: "Today, 11:15 AM",
    text: "The issue is still happening after the update. Connection drops every few minutes.",
    attachments: [{ name: "issue.png", kind: "image" }],
    isCurrentUser: true,
  },
  {
    id: "c3",
    author: "Sara Ahmed",
    role: "Support Team",
    time: "Today, 11:40 AM",
    text: "Please try again now, we have pushed a new configuration to your line.",
    attachments: [],
  },
];

const store: Record<string, TicketComment[]> = {};
const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((l) => l());
}

export function getComments(ticketKey: string): TicketComment[] {
  if (!store[ticketKey]) {
    store[ticketKey] = [
      ...seed,
      ...Array.from({ length: 15 }, (_, i) => ({
        id: `s${i}`,
        author: i % 2 === 0 ? "Ahmed Mohammad" : "Hamza",
        role: i % 2 === 0 ? "Support Team" : undefined,
        time: "Yesterday, 0" + ((i % 8) + 1) + ":10 PM",
        text:
          i % 2 === 0
            ? "Thank you for reaching out, our team is investigating the reported network issue."
            : "Sure, I will keep monitoring and update you with the results.",
        attachments: [],
        isCurrentUser: i % 2 !== 0,
      })).reverse(),
    ];
  }
  return store[ticketKey]!;
}

export function addComment(
  ticketKey: string,
  text: string,
  attachments: CommentAttachment[],
) {
  const list = getComments(ticketKey);
  const now = new Date();
  store[ticketKey] = [
    ...list,
    {
      id: `n${now.getTime()}`,
      author: currentUser.name,
      role: currentUser.role,
      time:
        "Today, " +
        now.toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" }),
      text,
      attachments,
      isCurrentUser: true,
    },
  ];
  emit();
}

function subscribe(cb: () => void) {
  listeners.add(cb);
  return () => listeners.delete(cb);
}

export function useComments(ticketKey: string) {
  return useSyncExternalStore(
    subscribe,
    () => getComments(ticketKey),
    () => getComments(ticketKey),
  );
}

export function initials(name: string) {
  return name
    .split(" ")
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() ?? "")
    .join("");
}
