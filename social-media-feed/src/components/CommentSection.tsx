import { useState, type FormEvent } from "react";
import { UserAvatar } from "./UserAvatar";
import type { Comment, User } from "../types";

function formatTime(iso: string) {
  const d = new Date(iso);
  const now = Date.now();
  const diff = now - d.getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h`;
  return d.toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

type CommentSectionProps = {
  comments: Comment[];
  currentUser: User;
  onAddComment: (body: string) => void;
};

export function CommentSection({
  comments,
  currentUser,
  onAddComment,
}: CommentSectionProps) {
  const [draft, setDraft] = useState("");

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const body = draft.trim();
    if (!body) return;
    onAddComment(body);
    setDraft("");
  };

  return (
    <div className="border-t border-slate-100 bg-slate-50/50 px-4 py-3 dark:border-slate-700/80 dark:bg-slate-800/30">
      <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
        Comments · {comments.length}
      </p>
      <ul className="mb-3 max-h-56 space-y-3 overflow-y-auto pr-1">
        {comments.length === 0 ? (
          <li className="text-sm text-slate-500 dark:text-slate-500">No comments yet. Start the thread.</li>
        ) : (
          comments.map((c) => (
            <li key={c.id} className="flex gap-2">
              <UserAvatar user={c.author} size="sm" className="mt-0.5" />
              <div className="min-w-0 flex-1 rounded-xl rounded-tl-sm bg-white px-3 py-2 shadow-sm dark:bg-slate-800">
                <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0">
                  <span className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                    {c.author.name}
                  </span>
                  <span className="text-xs text-slate-400">{formatTime(c.createdAt)}</span>
                </div>
                <p className="mt-0.5 whitespace-pre-wrap text-sm text-slate-700 dark:text-slate-300">
                  {c.body}
                </p>
              </div>
            </li>
          ))
        )}
      </ul>
      <form onSubmit={submit} className="flex gap-2">
        <UserAvatar user={currentUser} size="sm" className="mt-1 shrink-0" />
        <div className="flex min-w-0 flex-1 gap-2">
          <input
            type="text"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder="Write a comment…"
            className="min-w-0 flex-1 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-400/25 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100"
          />
          <button
            type="submit"
            disabled={!draft.trim()}
            className="shrink-0 rounded-full bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-40 dark:bg-indigo-600 dark:hover:bg-indigo-500"
          >
            Reply
          </button>
        </div>
      </form>
    </div>
  );
}
