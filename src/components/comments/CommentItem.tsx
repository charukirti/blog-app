import type { Comments } from "@/types";
import Avatar from "../blogs/common/Avatar";
import { formatDate } from "@/utils/formatDate";
import { useAppSelector } from "@/store/typedHooks";
import { Loader2, Pencil, Trash2 } from "lucide-react";
import CommentForm from "./CommentForm";
import { useDeleteComment } from "@/hooks/comments/useComments";
import { useState } from "react";

interface CommentItemProps {
  comment: Comments & {
    replies?: Comments[];
    repliesCount?: number;
  };
}

export default function CommentItem({ comment }: CommentItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isReplying, setIsReplying] = useState(false);
  const { user } = useAppSelector((state) => state.auth);
  const formattedDate = formatDate(comment.$createdAt);
  const isCommentAuthor = comment.user_id === user?.$id;
  const { mutate: deleteComment, isPending: isDeleting } = useDeleteComment();

  return (
    <>
      <div className="mt-4 flex items-center gap-3 rounded-md border p-3">
        <Avatar name={comment.username} />

        <div className="flex-1">
          <div className="flex items-center justify-between">
            <p className="font-semibold text-gray-800 dark:text-gray-300">
              {comment.username}
            </p>
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {formattedDate}
            </span>
          </div>

          {isEditing ? (
            <CommentForm
              blogId={comment.blog_id!}
              commentId={comment.$id!}
              defaultValue={comment.content!}
              onFinish={() => setIsEditing(false)}
            />
          ) : (
            <p className="text-gray-700 dark:text-gray-200">
              {comment.content}
            </p>
          )}

          {isCommentAuthor && (
            <div className="mt-2 flex gap-2">
              <button
                className="cursor-pointer text-gray-500 transition hover:text-blue-500"
                aria-label="Edit"
                onClick={() => setIsEditing((edit) => !edit)}
              >
                <Pencil size={16} />
              </button>
              <button
                className="relative cursor-pointer transition disabled:cursor-not-allowed"
                aria-label="Delete"
                onClick={() =>
                  deleteComment({
                    commentId: comment.$id,
                    blogId: comment.blog_id,
                    userId: user.$id,
                  })
                }
                disabled={isDeleting}
              >
                <Trash2
                  size={16}
                  className={`text-gray-500 hover:text-red-500 ${isDeleting ? "opacity-30" : ""}`}
                />
                {isDeleting && (
                  <Loader2 className="absolute inset-0 m-auto h-4 w-4 animate-spin text-red-600" />
                )}
              </button>
            </div>
          )}
        </div>
      </div>

      {user && (
        <button
          className="mt-1 text-sm text-blue-600 hover:underline cursor-pointer"
          onClick={() => setIsReplying((reply) => !reply)}
        >
          {isReplying ? "Cancel" : "Reply"}
        </button>
      )}

      {isReplying && (
        <CommentForm
          blogId={comment.blog_id}
          parentId={comment.$id}
          onFinish={() => setIsReplying(false)}
        />
      )}
      {comment.replies && comment.replies.length > 0 && (
        <div className="mt-4 space-y-4 border-l border-gray-300 pl-6 dark:border-gray-700">
          {comment.replies.map((reply) => (
            <CommentItem comment={reply} key={reply.$id} />
          ))}
        </div>
      )}
    </>
  );
}
