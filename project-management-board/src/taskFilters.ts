import type { Priority, Task } from "./types";

export interface TaskFilterState {
  search: string;
  priority: Priority | "all";
  tag: string | "all";
}

export function filterTasks(tasks: Task[], f: TaskFilterState): Task[] {
  const q = f.search.trim().toLowerCase();
  return tasks.filter((t) => {
    if (f.priority !== "all" && t.priority !== f.priority) return false;
    if (f.tag !== "all") {
      const tags = (t.tags ?? []).map((x) => x.toLowerCase());
      if (!tags.includes(f.tag.toLowerCase())) return false;
    }
    if (!q) return true;
    const inTitle = t.title.toLowerCase().includes(q);
    const inDesc = (t.description ?? "").toLowerCase().includes(q);
    const inTags = (t.tags ?? []).some((tag) => tag.toLowerCase().includes(q));
    const inAssignee = t.assignees.some((a) => a.name.toLowerCase().includes(q));
    return inTitle || inDesc || inTags || inAssignee;
  });
}

export function collectTags(tasks: Task[]): string[] {
  const set = new Set<string>();
  for (const t of tasks) {
    for (const tag of t.tags ?? []) {
      if (tag.trim()) set.add(tag.trim());
    }
  }
  return [...set].sort((a, b) => a.localeCompare(b));
}
