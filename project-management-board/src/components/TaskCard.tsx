import type { Priority, Task } from "../types";

const PRIORITY_STYLES: Record<
  Priority,
  string
> = {
  low: "bg-emerald-100 text-emerald-800 ring-emerald-500/20 dark:bg-emerald-950/60 dark:text-emerald-300 dark:ring-emerald-400/20",
  medium:
    "bg-amber-100 text-amber-900 ring-amber-500/25 dark:bg-amber-950/50 dark:text-amber-200 dark:ring-amber-400/20",
  high: "bg-orange-100 text-orange-900 ring-orange-500/25 dark:bg-orange-950/50 dark:text-orange-200 dark:ring-orange-400/20",
  urgent:
    "bg-rose-100 text-rose-900 ring-rose-500/30 dark:bg-rose-950/60 dark:text-rose-200 dark:ring-rose-400/25",
};

function formatDueDate(iso: string): string {
  const d = new Date(iso + "T12:00:00");
  return d.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function formatCreatedAt(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

interface TaskCardProps {
  task: Task;
  /** Custom MIME for drag payload — keeps native DnD scoped to this board. */
  dragMimeType: string;
}

export function TaskCard({ task, dragMimeType }: TaskCardProps) {
  const priorityClass = PRIORITY_STYLES[task.priority];
  const tags = task.tags ?? [];

  return (
    <article
      data-task-id={task.id}
      className="group cursor-grab rounded-xl border border-slate-200 bg-white p-3 shadow-sm ring-1 ring-transparent transition hover:border-slate-300 hover:shadow-md active:cursor-grabbing dark:border-slate-700 dark:bg-slate-900/90 dark:hover:border-slate-600"
      draggable
      onDragStart={(e) => {
        e.dataTransfer.setData(dragMimeType, task.id);
        e.dataTransfer.effectAllowed = "move";
        /* Placeholder: setDragImage for custom ghost; setData for @dnd-kit active id */
      }}
      onDragEnd={() => {
        /* Placeholder: clear drag state, analytics, collision cleanup */
      }}
    >
      {/* Draggable surface — replace with useDraggable from @dnd-kit/core */}
      <div className="flex items-start justify-between gap-2">
        <h3 className="text-sm font-semibold leading-snug text-slate-900 dark:text-slate-50">
          {task.title}
        </h3>
        <span
          className={`shrink-0 rounded-md px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ring-1 ring-inset ${priorityClass}`}
        >
          {task.priority}
        </span>
      </div>

      {task.description && (
        <p className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-slate-600 dark:text-slate-400">
          {task.description}
        </p>
      )}

      {(tags.length > 0 ||
        task.storyPoints != null ||
        task.createdAt != null) && (
        <div className="mt-2 flex flex-wrap items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400">
          {tags.map((tag) => (
            <span
              key={tag}
              className="rounded-md bg-slate-100 px-1.5 py-0.5 font-medium text-slate-700 dark:bg-slate-800 dark:text-slate-300"
            >
              {tag}
            </span>
          ))}
          {task.storyPoints != null && (
            <span className="tabular-nums" title="Story points">
              {task.storyPoints} pts
            </span>
          )}
          {task.createdAt && (
            <span className="tabular-nums" title="Created">
              Created {formatCreatedAt(task.createdAt)}
            </span>
          )}
        </div>
      )}

      <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 pt-3 dark:border-slate-800/80">
        {task.assignees.length > 0 ? (
          <div
            className="flex -space-x-2"
            title={task.assignees.map((a) => a.name).join(", ")}
          >
            {task.assignees.map((a) => (
              <span
                key={a.id}
                className="inline-flex h-7 w-7 items-center justify-center rounded-full border-2 border-white bg-gradient-to-br from-indigo-500 to-violet-600 text-[10px] font-semibold text-white dark:border-slate-900"
              >
                {a.initials}
              </span>
            ))}
          </div>
        ) : (
          <span className="text-xs italic text-slate-400 dark:text-slate-500">
            Unassigned
          </span>
        )}
        <time
          dateTime={task.dueDate}
          className="text-xs font-medium tabular-nums text-slate-500 dark:text-slate-400"
        >
          Due {formatDueDate(task.dueDate)}
        </time>
      </div>
    </article>
  );
}
