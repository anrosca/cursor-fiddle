import { CommentSection } from "./CommentSection";
import { UserAvatar } from "./UserAvatar";
import type { Post, User } from "../types";

function formatPostTime(iso: string) {
  const d = new Date(iso);
  return d.toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

type PostCardProps = {
  post: Post;
  currentUser: User;
  onToggleLike: (postId: string) => void;
  onAddComment: (postId: string, body: string) => void;
  onShare: (post: Post) => void;
};

export function PostCard({
  post,
  currentUser,
  onToggleLike,
  onAddComment,
  onShare,
}: PostCardProps) {
  const likeLabel = post.liked ? "Unlike" : "Like";

  return (
    <article className="overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-xl shadow-slate-900/5 ring-1 ring-slate-900/5 dark:border-slate-700/90 dark:bg-slate-900 dark:shadow-black/40 dark:ring-white/10">
      <div className="p-4 sm:p-5">
        <div className="flex gap-3">
          <UserAvatar user={post.author} />
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-x-2 gap-y-0">
              <h2 className="truncate text-base font-semibold text-slate-900 dark:text-white">
                {post.author.name}
              </h2>
              <span className="text-sm text-slate-500 dark:text-slate-400">
                @{post.author.handle}
              </span>
            </div>
            <time
              dateTime={post.createdAt}
              className="text-xs text-slate-400 dark:text-slate-500"
            >
              {formatPostTime(post.createdAt)}
            </time>
            <p className="mt-3 whitespace-pre-wrap text-[15px] leading-relaxed text-slate-800 dark:text-slate-200">
              {post.content}
            </p>
          </div>
        </div>

        {post.images.length > 0 && (
          <div
            className={`mt-4 grid gap-2 ${
              post.images.length === 1
                ? "grid-cols-1"
                : post.images.length === 2
                  ? "grid-cols-2"
                  : "grid-cols-2 sm:grid-cols-3"
            }`}
          >
            {post.images.map((src, i) => (
              <div
                key={`${post.id}-img-${i}`}
                className="relative aspect-[4/3] overflow-hidden rounded-xl bg-slate-100 dark:bg-slate-800"
              >
                <img
                  src={src}
                  alt=""
                  className="h-full w-full object-cover transition duration-300 hover:scale-[1.02]"
                  loading="lazy"
                />
              </div>
            ))}
          </div>
        )}

        <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-slate-100 pt-3 dark:border-slate-800">
          <button
            type="button"
            aria-pressed={post.liked}
            aria-label={likeLabel}
            onClick={() => onToggleLike(post.id)}
            className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium transition ${
              post.liked
                ? "bg-rose-50 text-rose-600 dark:bg-rose-950/50 dark:text-rose-400"
                : "text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
            }`}
          >
            <span className="text-base" aria-hidden>
              {post.liked ? "♥" : "♡"}
            </span>
            <span>{post.likes}</span>
          </button>
          <span
            className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium text-slate-600 dark:text-slate-400"
            title="Scroll to comments below"
          >
            <span className="text-base" aria-hidden>
              💬
            </span>
            <span>{post.comments.length}</span>
          </span>
          <button
            type="button"
            onClick={() => onShare(post)}
            className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium text-slate-600 transition hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
          >
            <span className="text-base" aria-hidden>
              ↗
            </span>
            Share
          </button>
        </div>
      </div>

      <CommentSection
        comments={post.comments}
        currentUser={currentUser}
        onAddComment={(body) => onAddComment(post.id, body)}
      />
    </article>
  );
}
