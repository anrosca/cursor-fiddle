import { useState, type FormEvent } from "react";
import { UserAvatar } from "./UserAvatar";
import type { User } from "../types";

type CreatePostProps = {
  currentUser: User;
  onCreate: (content: string, imageUrls: string[]) => void;
};

export function CreatePost({ currentUser, onCreate }: CreatePostProps) {
  const [content, setContent] = useState("");
  const [imageUrlsRaw, setImageUrlsRaw] = useState("");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const trimmed = content.trim();
    if (!trimmed) return;

    const urls = imageUrlsRaw
      .split(/[\n,]+/)
      .map((s) => s.trim())
      .filter(Boolean);

    onCreate(trimmed, urls);
    setContent("");
    setImageUrlsRaw("");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="mb-6 overflow-hidden rounded-2xl border border-slate-200/80 bg-white/90 p-4 shadow-lg shadow-indigo-500/5 backdrop-blur-sm dark:border-slate-700/80 dark:bg-slate-900/80"
    >
      <div className="flex gap-3">
        <UserAvatar user={currentUser} />
        <div className="min-w-0 flex-1 space-y-3">
          <div>
            <label htmlFor="post-content" className="sr-only">
              What is on your mind?
            </label>
            <textarea
              id="post-content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={3}
              placeholder="Share something with your network…"
              className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50/80 px-3 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-400/30 dark:border-slate-600 dark:bg-slate-800/50 dark:text-slate-100 dark:placeholder:text-slate-500"
            />
          </div>
          <div>
            <label htmlFor="post-images" className="mb-1 block text-xs font-medium text-slate-500 dark:text-slate-400">
              Image URLs (optional, comma or newline separated)
            </label>
            <textarea
              id="post-images"
              value={imageUrlsRaw}
              onChange={(e) => setImageUrlsRaw(e.target.value)}
              rows={2}
              placeholder="https://…"
              className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50/80 px-3 py-2 text-xs text-slate-800 placeholder:text-slate-400 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-400/30 dark:border-slate-600 dark:bg-slate-800/50 dark:text-slate-200"
            />
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={!content.trim()}
              className="rounded-full bg-indigo-600 px-5 py-2 text-sm font-semibold text-white shadow-md shadow-indigo-600/25 transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-40 dark:bg-indigo-500 dark:hover:bg-indigo-400"
            >
              Post
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}
