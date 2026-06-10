export type ColumnId = "backlog" | "todo" | "in-progress" | "done";

export type Priority = "low" | "medium" | "high" | "urgent";

export interface Assignee {
  id: string;
  name: string;
  initials: string;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  columnId: ColumnId;
  assignees: Assignee[];
  dueDate: string;
  priority: Priority;
  /** Optional labels for filtering and grouping. */
  tags?: string[];
  /** Story points or rough size hint for the card. */
  storyPoints?: number;
  /** ISO timestamp when the task was created. */
  createdAt?: string;
}

/** Payload from the add-task form before the parent assigns `id` / defaults. */
export type NewTaskPayload = Omit<Task, "id">;
