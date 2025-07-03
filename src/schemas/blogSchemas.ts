import { z } from "zod";

export const createBlogSchema = z.object({
  title: z.string().min(10, "Title is too short"),
  description: z.string().min(10, "Description is too short, make it longer"),
  slug: z.string().min(5, "Slug is too short"),
  tags: z.array(z.string()).optional(),
  category: z.string().min(4, "Category name must be at least 4 characters"),
  featured_image: z.instanceof(File, {
    message: "Please select an image file",
  }).optional().nullable(),
  content: z.string().min(10, "Content should be at least 10 characters"),
});

export type CreateBlogFormData = z.infer<typeof createBlogSchema>;
