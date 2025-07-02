import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { bookmarkKeys } from "./queryKeys";
import { bookmarkService } from "@/services/bookmarkService";
import type { Blog } from "@/types";
import { toast } from "react-toastify";

export function useCheckBookmark(userId: string, blogId: string) {
  return useQuery({
    queryKey: bookmarkKeys.detail(userId, blogId),
    queryFn: () => bookmarkService.checkBookmark(userId, blogId),
    enabled: !!userId && !!blogId,
    staleTime: 5 * 60 * 1000,
  });
}

export function useGetUsersBookmark(userId: string) {
  return useQuery({
    queryKey: bookmarkKeys.list(userId),
    queryFn: () => bookmarkService.getUserBookmarks(userId),
    enabled: !!userId,
    staleTime: 2 * 60 * 1000,
  });
}

export function useGetBlogBookmarkCount(blogId: string) {
  return useQuery({
    queryKey: bookmarkKeys.count(blogId),
    queryFn: () => bookmarkService.getBlogBookmarkCount(blogId),
    enabled: !!blogId,
    staleTime: 30 * 1000,
  });
}

export function useAddBookmark() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId, blog }: { userId: string; blog: Partial<Blog> }) =>
      bookmarkService.addBookmark(userId, blog),
    onSuccess: (bookmark, { userId, blog }) => {
      queryClient.setQueryData(
        bookmarkKeys.detail(userId, blog.$id!),
        bookmark,
      );

      queryClient.invalidateQueries({
        queryKey: bookmarkKeys.list(userId),
      });

      queryClient.invalidateQueries({
        queryKey: bookmarkKeys.count(blog.$id!),
      });

      toast.success("Blog bookmarked successfully!");
    },
    onError: (error) => {
      console.log("Error adding bookmark", error);
      toast.error("Failed to bookmark blog");
    },
  });
}

export function useRemoveBookmark() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      bookmarkId,
      userId,
      blogId,
    }: {
      bookmarkId: string;
      userId: string;
      blogId: string;
    }) => bookmarkService.removeBookmark(bookmarkId),
    onSuccess: (_, { userId, blogId }) => {
      queryClient.setQueryData(bookmarkKeys.detail(userId, blogId), null);
      queryClient.invalidateQueries({ queryKey: bookmarkKeys.list(userId) });
      queryClient.invalidateQueries({
        queryKey: bookmarkKeys.count(blogId),
      });

      toast.success("Bookmark removed successfully");
    },
    onError: (error) => {
      console.log("Error removing bookmark", error);
      toast.error("Failed to remove bookmark");
    },
  });
}
