import { z } from "zod";

export const commentSchema = z.object({
  content: z.string().min(5, "Comment should be at least 5 characters long"),
});


export type AddCommentFormData = z.infer<typeof commentSchema>