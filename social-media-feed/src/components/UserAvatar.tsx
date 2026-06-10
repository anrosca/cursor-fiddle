import type { User } from "../types";

const sizeClasses = {
  sm: "h-9 w-9 text-xs",
  md: "h-11 w-11 text-sm",
  lg: "h-14 w-14 text-base",
} as const;

function initials(name: string) {
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }
  return name.slice(0, 2).toUpperCase() || "?";
}

type UserAvatarProps = {
  user: User;
  size?: keyof typeof sizeClasses;
  className?: string;
};

export function UserAvatar({ user, size = "md", className = "" }: UserAvatarProps) {
  const ring =
    "ring-2 ring-white/80 dark:ring-slate-800/80 shadow-sm shadow-slate-900/5";

  if (user.avatarUrl) {
    return (
      <img
        src={user.avatarUrl}
        alt=""
        className={`${sizeClasses[size]} shrink-0 rounded-full object-cover ${ring} ${className}`}
      />
    );
  }

  const hue = user.id.charCodeAt(0) % 360;
  return (
    <div
      className={`${sizeClasses[size]} flex shrink-0 items-center justify-center rounded-full font-semibold text-white ${ring} ${className}`}
      style={{
        background: `linear-gradient(135deg, hsl(${hue}, 70%, 45%), hsl(${(hue + 40) % 360}, 65%, 38%))`,
      }}
      aria-hidden
    >
      {initials(user.name)}
    </div>
  );
}
