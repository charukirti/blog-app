import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { likeKeys } from "./LikeKey";
import { LikeService } from "@/services/LikeService";
import { toast } from "react-toastify";
import { blogKeys } from "../blog/blogKeys";

export function useHasUserLiked(blogId: string, userId: string) {
  return useQuery({
    queryKey: likeKeys.hasLiked(blogId, userId),
    queryFn: () => LikeService.hasUserLiked(blogId, userId),
    enabled: !!blogId && !!userId,
    staleTime: 30 * 1000,
  });
}

export function useGetLikeCount(blogId: string) {
  return useQuery({
    queryKey: likeKeys.likeCount(blogId),
    queryFn: () => LikeService.getLikeCount(blogId),
    enabled: !!blogId,
    staleTime: 5 * 60 * 1000,
  });
}

export function useBlogLike() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ blogId, userId }: { blogId: string; userId: string }) =>
      LikeService.likeBlog(blogId, userId),
    onMutate: async ({ blogId, userId }) => {
      await queryClient.cancelQueries({
        queryKey: likeKeys.hasLiked(blogId, userId),
      });

      await queryClient.cancelQueries({
        queryKey: likeKeys.likeCount(blogId),
      });

      const previousHasLiked = queryClient.getQueryData(
        likeKeys.hasLiked(blogId, userId),
      );

      const previousLikeCount = queryClient.getQueryData(
        likeKeys.likeCount(blogId),
      );

      queryClient.setQueryData(likeKeys.hasLiked(blogId, userId), true);
      queryClient.setQueryData(
        likeKeys.likeCount(blogId),
        (old: number = 0) => old + 1,
      );

      return { previousHasLiked, previousLikeCount, blogId, userId };
    },

    onError: (error, variables, context) => {
      if (context) {
        queryClient.setQueryData(
          likeKeys.hasLiked(context.blogId, context.userId),
          context.previousHasLiked,
        );
        queryClient.setQueryData(
          likeKeys.likeCount(context.blogId),
          context.previousLikeCount,
        );
      }

      toast.error(error.message || "Failed to like post");
    },

    onSuccess: (data, { blogId, userId }) => {
      queryClient.invalidateQueries({
        queryKey: likeKeys.hasLiked(blogId, userId),
      });
      queryClient.invalidateQueries({
        queryKey: likeKeys.likeCount(blogId),
      });
      queryClient.invalidateQueries({
        queryKey: likeKeys.userLikes(userId),
      });
      queryClient.invalidateQueries({
        queryKey: blogKeys.post(blogId),
      });
    },
  });
}

export function useUnlikeBlog() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ blogId, userId }: { blogId: string; userId: string }) =>
      LikeService.unlikeBlog(blogId, userId),
    onMutate: async ({ blogId, userId }) => {
      await queryClient.cancelQueries({
        queryKey: likeKeys.hasLiked(blogId, userId),
      });
      await queryClient.cancelQueries({
        queryKey: likeKeys.likeCount(blogId),
      });

      const previousHasLiked = queryClient.getQueryData(
        likeKeys.hasLiked(blogId, userId),
      );

      const previousLikeCount = queryClient.getQueryData(
        likeKeys.likeCount(blogId),
      );

      queryClient.setQueryData(likeKeys.hasLiked(blogId, userId), false);
      queryClient.setQueryData(likeKeys.likeCount(blogId), (old: number = 0) =>
        Math.max(0, old, -1),
      );

      return { previousHasLiked, previousLikeCount, blogId, userId };
    },

    onError: (error, variables, context) => {
      if (context) {
        queryClient.setQueryData(
          likeKeys.hasLiked(context.blogId, context.userId),
          context.previousHasLiked,
        );
        queryClient.setQueryData(
          likeKeys.likeCount(context.blogId),
          context.previousLikeCount,
        );
      }

      toast.error(error.message || "Failed to unlike post");
    },

    onSuccess: (data, { blogId, userId }) => {
      queryClient.invalidateQueries({
        queryKey: likeKeys.hasLiked(blogId, userId),
      });
      queryClient.invalidateQueries({
        queryKey: likeKeys.likeCount(blogId),
      });
      queryClient.invalidateQueries({
        queryKey: likeKeys.userLikes(userId),
      });
      queryClient.invalidateQueries({
        queryKey: blogKeys.post(blogId),
      });
    },
  });
}

export function useBlogLikes(blogId: string) {
  return useQuery({
    queryKey: likeKeys.blogLikes(blogId),
    queryFn: () => LikeService.getBlogLikes(blogId),
    enabled: !!blogId,
  });
}

export function useUserLikedPosts(userId: string) {
  return useQuery({
    queryKey: likeKeys.userLikes(userId),
    queryFn: () => LikeService.getUserLikedPosts(userId),
    enabled: !!userId,
  });
}

export function useLikeStatus(blogId: string, userId: string) {
  const hasLikedQuery = useHasUserLiked(blogId, userId);
  const likeCountQuery = useGetLikeCount(blogId);
  const likeMutation = useBlogLike();
  const unlikeMutation = useUnlikeBlog();

  const toggleLike = () => {
    if (!userId) {
      toast.error("Please login to like posts");
      return;
    }

    if (hasLikedQuery.data) {
      unlikeMutation.mutate({ blogId, userId });
    } else {
      likeMutation.mutate({ blogId, userId });
    }
  };

  return {
    hasLiked: hasLikedQuery.data ?? false,
    likeCount: likeCountQuery.data ?? 0,
    isLoading: hasLikedQuery.isLoading || likeCountQuery.isLoading,
    isToggling: likeMutation.isPending || unlikeMutation.isPending,
    toggleLike,
    error: hasLikedQuery.error || likeCountQuery.error,
  };
}
