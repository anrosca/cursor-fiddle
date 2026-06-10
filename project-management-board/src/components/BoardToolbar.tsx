import type { Priority } from "../types";
import type { TaskFilterState } from "../taskFilters";

const PRIORITIES: Priority[] = ["low", "medium", "high", "urgent"];

export interface BoardToolbarProps {
  filter: TaskFilterState;
  onFilterChange: (next: TaskFilterState) => void;
  tagOptions: string[];
  resultCount: number;
  totalCount: number;
  onOpenAddTask: () => void;
}

export function BoardToolbar({
  filter,
  onFilterChange,
  tagOptions,
  resultCount,
  totalCount,
  onOpenAddTask,
}: BoardToolbarProps) {
  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-slate-200/80 bg-white/70 p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900/50">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
        <div className="grid flex-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <label className="flex flex-col gap-1">
            <span className="text-xs font-medium text-slate-600 dark:text-slate-400">
              Search
            </span>
            <input
              type="search"
              value={filter.search}
              onChange={(e) =>
                onFilterChange({ ...filter, search: e.target.value })
              }
              placeholder="Title, description, tags, assignee…"
              className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100 dark:placeholder:text-slate-500"
              autoComplete="off"
            />
          </label>
          <label className="flex flex-col gap-1">
            <span className="text-xs font-medium text-slate-600 dark:text-slate-400">
              Priority
            </span>
            <select
              value={filter.priority}
              onChange={(e) =>
                onFilterChange({
                  ...filter,
                  priority: e.target.value as TaskFilterState["priority"],
                })
              }
              className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100"
            >
              <option value="all">All priorities</option>
              {PRIORITIES.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </label>
          <label className="flex flex-col gap-1 sm:col-span-2 lg:col-span-1">
            <span className="text-xs font-medium text-slate-600 dark:text-slate-400">
              Tag
            </span>
            <select
              value={filter.tag}
              onChange={(e) =>
                onFilterChange({ ...filter, tag: e.target.value })
              }
              className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100"
            >
              <option value="all">All tags</option>
              {tagOptions.map((tag) => (
                <option key={tag} value={tag}>
                  {tag}
                </option>
              ))}
            </select>
          </label>
        </div>
        <button
          type="button"
          onClick={onOpenAddTask}
          className="shrink-0 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-slate-950"
        >
          Add task
        </button>
      </div>
      <p className="text-xs text-slate-500 dark:text-slate-400">
        Showing{" "}
        <span className="font-medium text-slate-700 dark:text-slate-300">
          {resultCount}
        </span>{" "}
        of {totalCount} tasks
        {(filter.search || filter.priority !== "all" || filter.tag !== "all") &&
          " (filters active)"}
      </p>
    </div>
  );
}
