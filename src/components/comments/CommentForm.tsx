import {
  commentSchema,
  type AddCommentFormData,
} from "@/schemas/commentSchemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "../ui/button";
import { useAppSelector } from "@/store/typedHooks";
import { useAddComment, useUpdateComment } from "@/hooks/comments/useComments";
import { Loader2 } from "lucide-react";
import { Textarea } from "../ui/textarea";

interface CommentFormProps {
  blogId: string | undefined;
  defaultValue?: string;
  commentId?: string;
  parentId?:string;
  onFinish?: () => void;
}

export default function CommentForm({
  blogId,
  defaultValue,
  commentId,
  parentId,
  onFinish,
}: CommentFormProps) {
  const {
    formState: { isSubmitting, errors },
    register,
    reset,
    handleSubmit,
  } = useForm<AddCommentFormData>({
    resolver: zodResolver(commentSchema),
    defaultValues: {
      content: defaultValue || "",
    },
  });

  const { user } = useAppSelector((state) => state.auth);
  const {
    mutate: addComment,
    isPending: isAdding,
    isError: addError,
  } = useAddComment();
  const {
    mutate: editComment,
    isPending: isEditing,
    isError: editError,
  } = useUpdateComment();

  const isEditMode = Boolean(commentId);

  const onSubmit = (data: AddCommentFormData) => {
    if (!data || !user || !user.$id || !user.name || !blogId) return;

    if (isEditMode && commentId) {
      editComment(
        {
          commentId,
          newContent: data.content,
        },
        { onSuccess: onFinish },
      );
    } else {
      addComment(
        {
          blog_id: blogId,
          user_id: user.$id,
          username: user.name,
          content: data.content,
          parent_id: parentId
        },
        { onSuccess: onFinish },
      );
    }

    reset();
  };
  const isProcessing = isAdding || isEditing || isSubmitting;
  const isError = addError || editError;
  return (
    <section>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-2 md:col-span-2">
          <Textarea
            placeholder="Add your comment"
            {...register("content")}
            rows={4}
          />
          {errors.content && (
            <span className="color-red-400 mt-1 block text-base">
              {errors.content.message}
            </span>
          )}
        </div>
        <div className="text-right">
          {isEditMode && (
            <Button
              variant={"outline"}
              className="mr-2 cursor-pointer"
              type="button"
              disabled={isEditing}
              onClick={onFinish}
            >
              Close
            </Button>
          )}
          <Button
            variant={"outline"}
            className="cursor-pointer"
            type="submit"
            disabled={isProcessing}
          >
            
            {isProcessing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {isEditMode ? "Editing Comment..." : "Adding Comment..."}
              </>
            ) : isEditMode ? (
              "Edit Comment"
            ) : (
              "Add Comment"
            )}
          </Button>
        </div>
      </form>

      {isError && (
        <p className="text-2xl text-red-500">
          There was an error while {addError ? "adding" : "Editing"} your
          comment
        </p>
      )}
    </section>
  );
}
