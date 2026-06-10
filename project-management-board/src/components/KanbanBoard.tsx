import { useCallback, useMemo, useState } from "react";
import type { ColumnId, Task } from "../types";
import { AddTaskModal } from "./AddTaskModal";
import { BoardColumn } from "./BoardColumn";
import { BoardToolbar } from "./BoardToolbar";
import { collectTags, filterTasks, type TaskFilterState } from "../taskFilters";

const COLUMN_META: { id: ColumnId; title: string; hint: string }[] = [
  { id: "backlog", title: "Backlog", hint: "Ideas & queue" },
  { id: "todo", title: "Todo", hint: "Ready to start" },
  { id: "in-progress", title: "In progress", hint: "Active" },
  { id: "done", title: "Done", hint: "Shipped" },
];

const INITIAL_TASKS: Task[] = [
  {
    id: "t0",
    title: "Research competitor boards",
    description: "Capture patterns for columns and filters.",
    columnId: "backlog",
    assignees: [{ id: "a3", name: "Sam Rivera", initials: "SR" }],
    dueDate: "2026-06-25",
    priority: "low",
    tags: ["research"],
    storyPoints: 2,
    createdAt: "2026-06-01T10:00:00.000Z",
  },
  {
    id: "t1",
    title: "Design system tokens",
    description: "Define spacing, radius, and semantic colors.",
    columnId: "todo",
    assignees: [
      { id: "a1", name: "Maya Chen", initials: "MC" },
      { id: "a2", name: "Jordan Lee", initials: "JL" },
    ],
    dueDate: "2026-06-14",
    priority: "high",
    tags: ["design", "platform"],
    storyPoints: 5,
    createdAt: "2026-06-02T14:30:00.000Z",
  },
  {
    id: "t2",
    title: "API contract for boards",
    columnId: "todo",
    assignees: [{ id: "a3", name: "Sam Rivera", initials: "SR" }],
    dueDate: "2026-06-20",
    priority: "medium",
    tags: ["api"],
    storyPoints: 3,
    createdAt: "2026-06-03T09:15:00.000Z",
  },
  {
    id: "t3",
    title: "Kanban column persistence",
    columnId: "in-progress",
    assignees: [{ id: "a1", name: "Maya Chen", initials: "MC" }],
    dueDate: "2026-06-12",
    priority: "urgent",
    tags: ["platform", "api"],
    storyPoints: 8,
    createdAt: "2026-06-04T16:00:00.000Z",
  },
  {
    id: "t4",
    title: "Release checklist",
    columnId: "done",
    assignees: [
      { id: "a4", name: "Alex Kim", initials: "AK" },
      { id: "a3", name: "Sam Rivera", initials: "SR" },
    ],
    dueDate: "2026-06-08",
    priority: "low",
    tags: ["release"],
    storyPoints: 1,
    createdAt: "2026-05-28T11:00:00.000Z",
  },
];

/** MIME type for native drag payloads — swap for @dnd-kit if you adopt a library. */
const TASK_DRAG_MIME = "application/x-kanban-task-id";

const defaultFilter: TaskFilterState = {
  search: "",
  priority: "all",
  tag: "all",
};

export function KanbanBoard() {
  const [tasks, setTasks] = useState<Task[]>(INITIAL_TASKS);
  const [addTaskOpen, setAddTaskOpen] = useState(false);
  const [filter, setFilter] = useState<TaskFilterState>(defaultFilter);

  const filteredTasks = useMemo(
    () => filterTasks(tasks, filter),
    [tasks, filter],
  );

  const tagOptions = useMemo(() => collectTags(tasks), [tasks]);

  const filtersActive =
    filter.search.trim().length > 0 ||
    filter.priority !== "all" ||
    filter.tag !== "all";

  const moveTaskToColumn = useCallback((taskId: string, columnId: ColumnId) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, columnId } : t)),
    );
  }, []);

  const handleAddTask = useCallback((payload: Omit<Task, "id">) => {
    const id =
      typeof crypto !== "undefined" && "randomUUID" in crypto
        ? crypto.randomUUID()
        : `task-${Date.now()}`;
    setTasks((prev) => [...prev, { ...payload, id }]);
  }, []);

  const columnOptions = useMemo(
    () => COLUMN_META.map(({ id, title }) => ({ id, title })),
    [],
  );

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <header className="mb-6">
        <p className="text-sm font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
          Project board
        </p>
        <h1 className="mt-1 text-2xl font-semibold tracking-tight text-slate-900 dark:text-white">
          Sprint board
        </h1>
        <p className="mt-2 max-w-3xl text-sm text-slate-600 dark:text-slate-400">
          Multiple columns, rich task metadata, search and filters, and adding
          tasks from the modal. Cards use native HTML5 drag-and-drop with
          comments marking where to plug in{" "}
          <span className="font-medium text-slate-800 dark:text-slate-200">
            @dnd-kit
          </span>{" "}
          or similar.
        </p>
      </header>

      <div className="mb-6">
        <BoardToolbar
          filter={filter}
          onFilterChange={setFilter}
          tagOptions={tagOptions}
          resultCount={filteredTasks.length}
          totalCount={tasks.length}
          onOpenAddTask={() => setAddTaskOpen(true)}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {COLUMN_META.map((col) => {
          const columnTasks = filteredTasks.filter((t) => t.columnId === col.id);
          const emptyMessage =
            filtersActive && columnTasks.length === 0
              ? "No tasks match filters."
              : "Drop tasks here";
          return (
            <BoardColumn
              key={col.id}
              columnId={col.id}
              title={col.title}
              hint={col.hint}
              tasks={columnTasks}
              dragMimeType={TASK_DRAG_MIME}
              onTaskDropped={(taskId) => moveTaskToColumn(taskId, col.id)}
              emptyMessage={emptyMessage}
            />
          );
        })}
      </div>

      <AddTaskModal
        open={addTaskOpen}
        onClose={() => setAddTaskOpen(false)}
        columns={columnOptions}
        onAddTask={handleAddTask}
      />
    </div>
  );
}
