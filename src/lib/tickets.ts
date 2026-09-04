export type Status = "Progress" | "Closed" | "Resolved";

export const statusStyles: Record<Status, string> = {
  Progress: "bg-status-progress-bg text-status-progress",
  Closed: "bg-status-closed-bg text-status-closed",
  Resolved: "bg-status-resolved-bg text-status-resolved",
};

export const tickets: { id: string; title: string; date: string; status: Status }[] = [
  { id: "111123546", title: "Network issue", date: "29, Apr,  2022", status: "Closed" },
  { id: "111123546", title: "Network issue", date: "29, Apr,  2022", status: "Resolved" },
  { id: "111123546", title: "Network issue", date: "29, Apr,  2022", status: "Resolved" },
  { id: "111123546", title: "Network issue", date: "29, Apr,  2022", status: "Progress" },
];
