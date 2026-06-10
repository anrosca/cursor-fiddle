# Project management board

Kanban UI built with **React**, **TypeScript**, **Vite**, and **Tailwind CSS** (`darkMode: "class"`).

## Features

- **Multiple board columns** — Backlog, Todo, In progress, Done (driven by `COLUMN_META` in `KanbanBoard.tsx`; add entries to extend the board).
- **Task cards with metadata** — Title, description, priority, due date, assignees (or “Unassigned”), tags, story points, created date.
- **Add new task** — Modal form adds a task to board state (column, priority, dates, optional assignee, tags, story points).
- **Drag-and-drop placeholders** — Native HTML5 DnD plus inline comments and `data-task-id` / `data-column-id` hooks for **@dnd-kit** or similar (`BoardColumn.tsx`, `TaskCard.tsx`).
- **Filter and search** — Search across title, description, tags, and assignee names; filters for priority and tag (`BoardToolbar.tsx`, `taskFilters.ts`).

## Components

`KanbanBoard.tsx`, `BoardColumn.tsx`, `TaskCard.tsx`, `AddTaskModal.tsx`, `BoardToolbar.tsx`.

## Run locally

```bash
npm install
npm run dev
```

Use the **Dark mode** toggle in the corner to exercise light and dark themes.

## Drag and drop

Cards use native HTML5 drag-and-drop with a custom MIME payload. Comments in `BoardColumn.tsx` and `TaskCard.tsx` mark where you can plug in **@dnd-kit** (or another library) for keyboard/touch, collision detection, and animations.
