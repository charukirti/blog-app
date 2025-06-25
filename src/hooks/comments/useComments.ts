import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { commentKeys } from "./CommentKeys";
import { commentService } from "@/services/commentService";
import type { CreateCommentInput } from "@/types";
import { toast } from "react-toastify";

/* query related hooks */

export function useGetBlogComments(blogId: string) {
  return useQuery({
    queryKey: commentKeys.blog(blogId),
    queryFn: () => commentService.getBlogComments(blogId),
    enabled: !!blogId,
  });
}

export function useGetNestedComments(blogId: string) {
  return useQuery({
    queryKey: commentKeys.blogWithReplies(blogId),
    queryFn: () => commentService.getBlogCommentsWithReplies(blogId),
    enabled: !!blogId,
  });
}

export function useGetReplies(parentId: string) {
  return useQuery({
    queryKey: commentKeys.replies(parentId),
    queryFn: () => commentService.getCommentReplies(parentId),
    enabled: !!parentId,
  });
}

export function useGetCommentsCount(blogId: string) {
  return useQuery({
    queryKey: commentKeys.commentsCount(blogId),
    queryFn: () => commentService.getCommentsCount(blogId),
    enabled: !!blogId,
  });
}

export function useGetRepliesCount(commentId: string) {
  return useQuery({
    queryKey: commentKeys.repliesCount(commentId),
    queryFn: () => commentService.getRepliesCount(commentId),
    enabled: !!commentId,
  });
}

/* mutation related hooks */

export function useAddComment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateCommentInput) => commentService.addComment(data),
    onSuccess: (createdComment) => {

      queryClient.invalidateQueries({
        queryKey: commentKeys.blog(createdComment.blog_id),
      });

      queryClient.invalidateQueries({
        queryKey: commentKeys.blogWithReplies(createdComment.blog_id),
      });

      queryClient.invalidateQueries({
        queryKey: commentKeys.commentsCount(createdComment.blog_id),
      });

      if (createdComment.parent_id) {
        queryClient.invalidateQueries({
          queryKey: commentKeys.replies(createdComment.parent_id),
        });

        queryClient.invalidateQueries({
          queryKey: commentKeys.repliesCount(createdComment.parent_id),
        });
      }

      toast.success("Your comment has been added successfully!");
    },
    onError: (error) => {
      console.log("Add comment error in hook", error);
      toast.error(error.message || "Unable to add comment, try again");
    },
  });
}

export function useUpdateComment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      commentId,
      newContent,
    }: {
      commentId: string;
      newContent: string;
    }) => commentService.updateComment(commentId, newContent),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: commentKeys.all,
      });
      toast.success("Your comment has been updated successfully.");
    },
    onError: (error) => {
      console.log("Update comment error", error);
      toast.error(error.message || "Unable to update your comment, try again");
    },
  });
}

export function useDeleteComment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      commentId,
      blogId,
      userId,
      parentId,
    }: {
      commentId: string;
      blogId: string;
      userId: string;
      parentId?: string;
    }) => commentService.removeComment(commentId),

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: commentKeys.blog(variables.blogId),
      });
      queryClient.invalidateQueries({
        queryKey: commentKeys.blogWithReplies(variables.blogId),
      });
      queryClient.invalidateQueries({
        queryKey: commentKeys.commentsCount(variables.blogId),
      });

      if (variables.parentId) {
        queryClient.invalidateQueries({
          queryKey: commentKeys.replies(variables.parentId),
        });
        queryClient.invalidateQueries({
          queryKey: commentKeys.repliesCount(variables.parentId),
        });
      }

      toast.success("Your comment has been deleted successfully");
    },
    onError: (error) => {
      console.log("Delete comment error", error);
      toast.error(error.message || "Unable to delete comment, try again");
    },
  });
}