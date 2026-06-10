import type { ColumnId, Task } from "../types";
import { TaskCard } from "./TaskCard";

export interface BoardColumnProps {
  columnId: ColumnId;
  title: string;
  hint: string;
  tasks: Task[];
  dragMimeType: string;
  onTaskDropped: (taskId: string) => void;
  /** Shown when the column has no tasks (e.g. filtered out vs truly empty). */
  emptyMessage?: string;
}

export function BoardColumn({
  columnId,
  title,
  hint,
  tasks,
  dragMimeType,
  onTaskDropped,
  emptyMessage = "Drop tasks here",
}: BoardColumnProps) {
  return (
    <section
      data-column-id={columnId}
      className="flex min-h-[420px] flex-col rounded-2xl border border-slate-200/80 bg-white/80 shadow-sm backdrop-blur-sm dark:border-slate-800 dark:bg-slate-900/60"
      aria-label={`${title} column`}
      onDragOver={(e) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = "move";
        /* Placeholder: highlight droppable, auto-scroll, @dnd-kit collision */
      }}
      onDragEnter={() => {
        /* Placeholder: column drag-enter styling / multiple drop targets */
      }}
      onDragLeave={() => {
        /* Placeholder: clear column highlight */
      }}
      onDrop={(e) => {
        e.preventDefault();
        const raw = e.dataTransfer.getData(dragMimeType);
        if (!raw) return;
        /* Placeholder: validate payload, optimistic updates, server sync */
        onTaskDropped(raw);
      }}
    >
      {/* Droppable root — swap for DndContext + useDroppable */}
      <div className="border-b border-slate-200/90 px-4 py-3 dark:border-slate-800">
        <div className="flex items-baseline justify-between gap-2">
          <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
            {title}
          </h2>
          <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-300">
            {tasks.length}
          </span>
        </div>
        <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-500">{hint}</p>
      </div>

      <ul className="flex flex-1 flex-col gap-3 p-3">
        {tasks.map((task) => (
          <li key={task.id}>
            <TaskCard task={task} dragMimeType={dragMimeType} />
          </li>
        ))}
        {tasks.length === 0 && (
          <li className="flex flex-1 items-center justify-center rounded-xl border border-dashed border-slate-200 py-10 text-center text-xs text-slate-500 dark:border-slate-700 dark:text-slate-500">
            {emptyMessage}
          </li>
        )}
      </ul>
    </section>
  );
}
