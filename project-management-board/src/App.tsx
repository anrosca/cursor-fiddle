import { useEffect, useState } from "react";
import { KanbanBoard } from "./components/KanbanBoard";

function DarkModeToggle() {
  const [dark, setDark] = useState(() =>
    typeof document !== "undefined"
      ? document.documentElement.classList.contains("dark")
      : false,
  );

  useEffect(() => {
    if (dark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [dark]);

  return (
    <button
      type="button"
      onClick={() => setDark((d) => !d)}
      className="fixed right-4 top-4 z-50 rounded-full border border-slate-200 bg-white/90 px-3 py-1.5 text-xs font-medium text-slate-700 shadow-sm backdrop-blur hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900/90 dark:text-slate-200 dark:hover:bg-slate-800"
      aria-pressed={dark}
    >
      {dark ? "Light mode" : "Dark mode"}
    </button>
  );
}

export default function App() {
  return (
    <>
      <DarkModeToggle />
      <KanbanBoard />
    </>
  );
}
