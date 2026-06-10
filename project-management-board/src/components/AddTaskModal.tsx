import { useEffect, useId, useState } from "react";
import type { ColumnId, NewTaskPayload, Priority, Task } from "../types";

export interface BoardColumnOption {
  id: ColumnId;
  title: string;
}

export interface AddTaskModalProps {
  open: boolean;
  onClose: () => void;
  columns: BoardColumnOption[];
  onAddTask: (task: Omit<Task, "id">) => void;
}

const PRIORITIES: Priority[] = ["low", "medium", "high", "urgent"];

function initialsFromName(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  const a = parts[0][0] ?? "";
  const b = parts[parts.length - 1][0] ?? "";
  return (a + b).toUpperCase();
}

function emptyForm(defaultColumn: ColumnId): Omit<Task, "id"> {
  const today = new Date().toISOString().slice(0, 10);
  return {
    title: "",
    description: "",
    columnId: defaultColumn,
    assignees: [],
    dueDate: today,
    priority: "medium",
    tags: [],
    storyPoints: undefined,
  };
}

export function AddTaskModal({
  open,
  onClose,
  columns,
  onAddTask,
}: AddTaskModalProps) {
  const titleId = useId();
  const defaultColumn = columns[0]?.id ?? "todo";
  const [form, setForm] = useState<Omit<Task, "id">>(() =>
    emptyForm(defaultColumn),
  );
  const [assigneeInput, setAssigneeInput] = useState("");
  const [tagsInput, setTagsInput] = useState("");
  const [storyPointsInput, setStoryPointsInput] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    const col = columns[0]?.id ?? "todo";
    setForm(emptyForm(col));
    setAssigneeInput("");
    setTagsInput("");
    setStoryPointsInput("");
    setError(null);
  }, [open, columns]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const title = form.title.trim();
    if (!title) {
      setError("Title is required.");
      return;
    }

    const assignees =
      assigneeInput.trim() === ""
        ? []
        : [
            {
              id: `assignee-${crypto.randomUUID()}`,
              name: assigneeInput.trim(),
              initials: initialsFromName(assigneeInput),
            },
          ];

    const tags = tagsInput
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    let storyPoints: number | undefined;
    if (storyPointsInput.trim() !== "") {
      const n = Number(storyPointsInput);
      if (!Number.isFinite(n) || n < 0) {
        setError("Story points must be a non-negative number.");
        return;
      }
      storyPoints = n;
    }

    const payload: NewTaskPayload = {
      ...form,
      title,
      description: form.description?.trim() || undefined,
      assignees,
      tags: tags.length ? tags : undefined,
      storyPoints,
      createdAt: new Date().toISOString(),
    };

    onAddTask(payload);
    onClose();
  }

  return (
    <div
      className="fixed inset-0 z-40 flex items-center justify-center p-4"
      role="presentation"
    >
      <button
        type="button"
        className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm dark:bg-black/60"
        aria-label="Close modal"
        onClick={onClose}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="relative z-50 max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl border border-slate-200 bg-white p-6 shadow-xl dark:border-slate-700 dark:bg-slate-900"
      >
        <h2
          id={titleId}
          className="text-lg font-semibold text-slate-900 dark:text-white"
        >
          Add task
        </h2>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
          New cards appear on the board immediately. Drag-and-drop can be
          upgraded later (see placeholders on columns and cards).
        </p>

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          <label className="flex flex-col gap-1">
            <span className="text-xs font-medium text-slate-600 dark:text-slate-400">
              Title <span className="text-rose-600">*</span>
            </span>
            <input
              required
              value={form.title}
              onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
              className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100"
              placeholder="Short task title"
            />
          </label>

          <label className="flex flex-col gap-1">
            <span className="text-xs font-medium text-slate-600 dark:text-slate-400">
              Description
            </span>
            <textarea
              value={form.description ?? ""}
              onChange={(e) =>
                setForm((f) => ({ ...f, description: e.target.value }))
              }
              rows={3}
              className="resize-y rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100"
              placeholder="Optional details"
            />
          </label>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="flex flex-col gap-1">
              <span className="text-xs font-medium text-slate-600 dark:text-slate-400">
                Column
              </span>
              <select
                value={form.columnId}
                onChange={(e) =>
                  setForm((f) => ({
                    ...f,
                    columnId: e.target.value as ColumnId,
                  }))
                }
                className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100"
              >
                {columns.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.title}
                  </option>
                ))}
              </select>
            </label>
            <label className="flex flex-col gap-1">
              <span className="text-xs font-medium text-slate-600 dark:text-slate-400">
                Priority
              </span>
              <select
                value={form.priority}
                onChange={(e) =>
                  setForm((f) => ({
                    ...f,
                    priority: e.target.value as Priority,
                  }))
                }
                className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100"
              >
                {PRIORITIES.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
            </label>
            <label className="flex flex-col gap-1">
              <span className="text-xs font-medium text-slate-600 dark:text-slate-400">
                Due date
              </span>
              <input
                type="date"
                value={form.dueDate}
                onChange={(e) =>
                  setForm((f) => ({ ...f, dueDate: e.target.value }))
                }
                className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100"
              />
            </label>
            <label className="flex flex-col gap-1">
              <span className="text-xs font-medium text-slate-600 dark:text-slate-400">
                Story points
              </span>
              <input
                type="text"
                inputMode="decimal"
                value={storyPointsInput}
                onChange={(e) => setStoryPointsInput(e.target.value)}
                className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100"
                placeholder="Optional"
              />
            </label>
          </div>

          <label className="flex flex-col gap-1">
            <span className="text-xs font-medium text-slate-600 dark:text-slate-400">
              Assignee
            </span>
            <input
              value={assigneeInput}
              onChange={(e) => setAssigneeInput(e.target.value)}
              className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100"
              placeholder="Full name (optional)"
            />
          </label>

          <label className="flex flex-col gap-1">
            <span className="text-xs font-medium text-slate-600 dark:text-slate-400">
              Tags
            </span>
            <input
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100"
              placeholder="Comma-separated, e.g. design, api"
            />
          </label>

          {error && (
            <p className="text-sm text-rose-600 dark:text-rose-400" role="alert">
              {error}
            </p>
          )}

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-lg bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-slate-900"
            >
              Add task
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
