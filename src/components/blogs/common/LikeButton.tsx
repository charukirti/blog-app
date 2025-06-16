import { useLikeStatus } from "@/hooks/Likes/useLikes";
import { cn } from "@/lib/utils";
import { Heart } from "lucide-react";

interface LikeButtonProps {
  blogId: string;
  userId?: string;
  className?: string;
  showCount?: boolean;
  size?: "sm" | "md" | "lg";
  variant?: "default" | "minimal";
}

export default function LikeButton({
  blogId,
  userId,
  className,
  showCount = true,
  size = "md",
  variant = "default",
}: LikeButtonProps) {
  const { hasLiked, likeCount, isToggling, toggleLike } = useLikeStatus(
    blogId,
    userId || "",
  );

  const sizeClasses = {
    sm: "h-4 w-5",
    md: "h-5 w-5",
    lg: "h-6 w-6",
  };

  const containerSizeClasses = {
    sm: "p-1.5 text-sm",
    md: "p-2 text-base",
    lg: "p-3 text-lg",
  };

  if (variant === "minimal") {
    return (
      <button
        onClick={toggleLike}
        disabled={isToggling || !userId}
        className={cn(
          "text-gray inline-flex cursor-pointer items-center gap-1 transition-colors duration-200 hover:text-red-500 disabled:cursor-not-allowed disabled:opacity-50",
          className,
        )}
        title={
          userId ? (hasLiked ? "Unlike Post" : "Like post") : "Login to like"
        }
      >
        <Heart
          className={cn(
            sizeClasses[size],
            "transition-all duration-200",
            hasLiked
              ? "text-red-500 hover:fill-red-500"
              : "text-gray-400 hover:text-red-500",
            isToggling && "scale-110",
          )}
        />

        {showCount && <span className="text-xl font-medium">{likeCount}</span>}
      </button>
    );
  }

  return (
    <button
      onClick={toggleLike}
      disabled={isToggling || !userId}
      className={cn(
        "inline-flex items-center gap-2 rounded-full border font-medium transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-50",
        containerSizeClasses[size],
        hasLiked
          ? "border-gray-200 bg-red-50 text-red-600 hover:bg-red-100"
          : "border-gray-200 bg-white text-gray-600 hover:border-red-200 hover:bg-red-50 hover:text-red-600",
        "focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:outline-none",
        className,
      )}
      title={
        userId ? (hasLiked ? "Unlike post" : "Like post") : "Log in to like"
      }
    >
      <Heart
        className={cn(
          sizeClasses[size],
          "transition-all duration-200",
          hasLiked ? "fill-red-500 text-red-500" : "text-gray-400",
          isToggling && "scale-110",
        )}
      />

      {showCount && <span>{likeCount}</span>}
      {!showCount && (
        <span className="sr-only">
          {hasLiked ? "Unlike" : "Like"} this post
        </span>
      )}
    </button>
  );
}
