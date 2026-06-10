import { useCallback, useEffect, useRef, useState } from "react";
import { CreatePost } from "./CreatePost";
import { PostCard } from "./PostCard";
import type { Comment, Post, User } from "../types";

const currentUser: User = {
  id: "u-me",
  name: "Alex Rivera",
  handle: "alexrivera",
  avatarUrl: "https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=128&h=128&fit=crop",
};

function seedPosts(): Post[] {
  const users: User[] = [
    {
      id: "u1",
      name: "Morgan Lee",
      handle: "morganlee",
      avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=128&h=128&fit=crop",
    },
    {
      id: "u2",
      name: "Jordan Kim",
      handle: "jordank",
      avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=128&h=128&fit=crop",
    },
    {
      id: "u3",
      name: "Sam Patel",
      handle: "sampatel",
    },
  ];

  const now = Date.now();
  return [
    {
      id: "p1",
      author: users[0],
      content:
        "Shipped a new dashboard today. Grateful for the team — small details in motion design made the biggest difference.",
      images: [
        "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80",
        "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80",
      ],
      createdAt: new Date(now - 1000 * 60 * 45).toISOString(),
      likes: 24,
      liked: false,
      comments: [
        {
          id: "c1",
          author: users[1],
          body: "Looks crisp. Which library did you use for the charts?",
          createdAt: new Date(now - 1000 * 60 * 30).toISOString(),
        },
        {
          id: "c2",
          author: users[2],
          body: "The gradient on the hero is *chef kiss*.",
          createdAt: new Date(now - 1000 * 60 * 20).toISOString(),
        },
      ],
    },
    {
      id: "p2",
      author: users[1],
      content: "Weekend hike — fog rolled in right at the ridge. Worth every step.",
      images: ["https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=900&q=80"],
      createdAt: new Date(now - 1000 * 60 * 60 * 5).toISOString(),
      likes: 112,
      liked: true,
      comments: [],
    },
    {
      id: "p3",
      author: users[2],
      content:
        "Hot take: infinite scroll is great until it is not. Pagination still wins for dense feeds you revisit often.",
      images: [],
      createdAt: new Date(now - 1000 * 60 * 60 * 26).toISOString(),
      likes: 58,
      liked: false,
      comments: [
        {
          id: "c3",
          author: users[0],
          body: "Agree — give me a “jump to date” any day.",
          createdAt: new Date(now - 1000 * 60 * 60 * 24).toISOString(),
        },
      ],
    },
  ];
}

function InfiniteScrollPlaceholder({ loading }: { loading: boolean }) {
  if (!loading) {
    return (
      <div className="py-6 text-center text-sm text-slate-500 dark:text-slate-400">
        Scroll for more — this is a demo placeholder (no extra pages).
      </div>
    );
  }
  return (
    <div className="space-y-3 py-4" aria-busy="true" aria-label="Loading more posts">
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className="animate-shimmer h-24 rounded-2xl bg-gradient-to-r from-slate-200/80 via-slate-100 to-slate-200/80 dark:from-slate-800 dark:via-slate-700/80 dark:to-slate-800"
        />
      ))}
      <p className="text-center text-xs text-slate-500 dark:text-slate-500">Loading more…</p>
    </div>
  );
}

export function Feed() {
  const [posts, setPosts] = useState<Post[]>(seedPosts);
  const [shareToast, setShareToast] = useState<string | null>(null);
  const [loadingMore, setLoadingMore] = useState(false);
  const [loadCycles, setLoadCycles] = useState(0);
  const sentinelRef = useRef<HTMLDivElement>(null);
  const waitForScrollAway = useRef(false);

  const showSharePlaceholder = useCallback((post: Post) => {
    setShareToast(`Share: “${post.content.slice(0, 48)}${post.content.length > 48 ? "…" : ""}” — native sheet placeholder.`);
    window.setTimeout(() => setShareToast(null), 3200);
  }, []);

  const handleToggleLike = useCallback((postId: string) => {
    setPosts((prev) =>
      prev.map((p) =>
        p.id === postId
          ? {
              ...p,
              liked: !p.liked,
              likes: p.liked ? Math.max(0, p.likes - 1) : p.likes + 1,
            }
          : p,
      ),
    );
  }, []);

  const handleAddComment = useCallback((postId: string, body: string) => {
    const comment: Comment = {
      id: typeof crypto !== "undefined" && crypto.randomUUID ? crypto.randomUUID() : `c-${Date.now()}`,
      author: currentUser,
      body,
      createdAt: new Date().toISOString(),
    };
    setPosts((prev) =>
      prev.map((p) => (p.id === postId ? { ...p, comments: [...p.comments, comment] } : p)),
    );
  }, []);

  const handleCreatePost = useCallback((content: string, imageUrls: string[]) => {
    const newPost: Post = {
      id: typeof crypto !== "undefined" && crypto.randomUUID ? crypto.randomUUID() : `p-${Date.now()}`,
      author: currentUser,
      content,
      images: imageUrls,
      createdAt: new Date().toISOString(),
      likes: 0,
      liked: false,
      comments: [],
    };
    setPosts((prev) => [newPost, ...prev]);
  }, []);

  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;

    const obs = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (!entry) return;

        if (!entry.isIntersecting) {
          waitForScrollAway.current = false;
          return;
        }
        if (waitForScrollAway.current || loadingMore) return;

        waitForScrollAway.current = true;
        setLoadingMore(true);
        window.setTimeout(() => {
          setLoadingMore(false);
          setLoadCycles((c) => c + 1);
        }, 1400);
      },
      { rootMargin: "120px" },
    );

    obs.observe(el);
    return () => obs.disconnect();
  }, [loadingMore]);

  return (
    <section className="relative">
      {shareToast && (
        <div
          role="status"
          className="fixed bottom-6 left-1/2 z-50 w-[min(90vw,24rem)] -translate-x-1/2 rounded-2xl border border-slate-200 bg-white/95 px-4 py-3 text-sm text-slate-800 shadow-2xl backdrop-blur dark:border-slate-600 dark:bg-slate-900/95 dark:text-slate-100"
        >
          {shareToast}
        </div>
      )}

      <CreatePost currentUser={currentUser} onCreate={handleCreatePost} />

      <ul className="space-y-5">
        {posts.map((post) => (
          <li key={post.id}>
            <PostCard
              post={post}
              currentUser={currentUser}
              onToggleLike={handleToggleLike}
              onAddComment={handleAddComment}
              onShare={showSharePlaceholder}
            />
          </li>
        ))}
      </ul>

      <div ref={sentinelRef} className="h-px w-full" aria-hidden />

      <InfiniteScrollPlaceholder loading={loadingMore} />

      {loadCycles > 0 && !loadingMore && (
        <p className="pb-8 text-center text-xs text-slate-400 dark:text-slate-600">
          Infinite scroll fired {loadCycles} time{loadCycles === 1 ? "" : "s"} — hook up your API here.
        </p>
      )}
    </section>
  );
}
