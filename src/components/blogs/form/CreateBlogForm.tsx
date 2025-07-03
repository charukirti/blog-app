import {
  createBlogSchema,
  type CreateBlogFormData,
} from "@/schemas/blogSchemas";
import type { CreateBlog } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, type FieldError } from "react-hook-form";
import FormField from "./FormField";
import DescriptionBox from "./DescriptionBox";
import UploadFileInput from "./UploadFileInput";
import { Button } from "../../ui/button";
import { generateSlug } from "@/utils/generateSlug";
import SelectCategory from "./SelectCategory";
import AddTagsField from "./AddTagsField";
import { useAppSelector } from "@/store/typedHooks";
import { useUploadThumbnail } from "@/hooks/storage/useStorage";
import { toast } from "react-toastify";
import TipTapEditor from "./TipTapEditor";
import { Loader2 } from "lucide-react";
import { useState } from "react";

interface CreateBlogFormProps {
  onSubmit: (data: CreateBlog) => void;
  onDraftSave?: (data: CreateBlog) => void;
  isSaving?: boolean;
  isCreating: boolean;
  error: boolean;
  editingBlogId?: string;
  initialData?: Partial<CreateBlogFormData>;
  isDraftError?: boolean;
  existingFeaturedImage?: string;
}

export default function CreateBlogForm({
  onSubmit,
  isCreating,
  error,
  editingBlogId,
  initialData,
  onDraftSave,
  isSaving = false,
  isDraftError,
  existingFeaturedImage,
}: CreateBlogFormProps) {
  const {
    register,
    formState: { errors, isSubmitting },
    reset,
    watch,
    setValue,
    control,
    handleSubmit,
  } = useForm<CreateBlogFormData>({
    resolver: zodResolver(createBlogSchema),
    defaultValues: {
      tags: [],
      ...initialData,
    },
  });
  const [thumbnailUrl, setThumbnailUrl] = useState(existingFeaturedImage);
  const [thumbnailFileId, setThumbnailFileId] = useState<string | undefined>();
  const { user } = useAppSelector((state) => state.auth);
  const { mutateAsync: uploadThumbnail, isPending: isUploadingThumbnail } =
    useUploadThumbnail();

  const handleFormSubmit = async (
    data: CreateBlogFormData,
    isDraft = false,
  ) => {
    try {
      let featuredImageUrl: string | undefined = existingFeaturedImage;

      if (data.featured_image && data.featured_image instanceof File) {
        const result = await uploadThumbnail(data.featured_image);
        featuredImageUrl = result.url;

        setThumbnailFileId(result.fileId);
      }
      const blogData: CreateBlog = {
        title: data.title,
        slug: data.slug,
        content: data.content,
        description: data.description,
        category: data.category,
        tags: data.tags,
        $id: editingBlogId,
        author_id: user?.$id,
        author_name: user?.name,
        featured_image: featuredImageUrl,

        status: isDraft ? "draft" : "published",
      };

      if (isDraft && onDraftSave) {
        onDraftSave(blogData);
      } else {
        onSubmit(blogData);
      }

      reset();
    } catch (error) {
      toast.error("There was a problem while uploading blog");
      console.log("Blog upload process failed", error);
    }
  };

  const handleSaveDraft = () => {
    handleSubmit((data) => handleFormSubmit(data, true))();
  };

  const isProcessing = isSubmitting || isUploadingThumbnail || isCreating;

  return (
    <section>
      <div role="header">
        <h1 className="text-3xl font-semibold">
          {editingBlogId ? "Edit Blog post" : "Create new blog post"}
        </h1>
      </div>

      <form
        className="mx-auto mt-6 max-w-6xl space-y-4"
        onSubmit={handleSubmit((data) => handleFormSubmit(data, false))}
      >
        <section className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <h2 className="mb-4 text-xl font-semibold text-gray-900 dark:text-gray-50">
            Basic Information
          </h2>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <FormField
              id="title"
              label="Blog Title"
              register={register("title")}
              placeholder={"Enter your blog title..."}
              error={errors.title}
              className="md:col-span-2"
            />
            <div className="flex items-end gap-2">
              <div className="flex-1">
                <FormField
                  id="slug"
                  label="Blog Slug"
                  register={register("slug")}
                  placeholder={"Enter-your-blog-slug..."}
                  helperText="URL-friendly version of the title (lowercase, hyphens instead of spaces) or just click generate"
                  error={errors.slug}
                />

                <Button
                  type="button"
                  variant={"outline"}
                  onClick={() =>
                    setValue("slug", generateSlug(watch("title") || ""))
                  }
                >
                  Generate slug
                </Button>
              </div>
            </div>
            <SelectCategory
              label="Blog Category"
              id="category"
              register={register("category")}
              error={errors.category}
              placeholder="Select a category..."
            />
            <DescriptionBox
              id="description"
              label="Blog description"
              placeholder="Write a brief description about your blog post..."
              register={register("description")}
              error={errors.description}
              rows={3}
              className="md:col-span-2"
            />
          </div>
        </section>

        <section className="rounded-lg border border-gray-200 bg-gray-50 p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-gray-50">
            Media & Tags
          </h2>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <UploadFileInput
              id="file"
              label="Upload thumbnail"
              accept="image/*"
              helperText="Upload a thumbnail image for your blog post"
              error={errors.featured_image}
              register={register("featured_image")}
              previewUrl={thumbnailUrl}
              onImageRemoved={() => {
                setThumbnailUrl(undefined);
                setValue("featured_image", null);
              }}
              featuredImageId={thumbnailFileId}
            />

            <AddTagsField
              id="tags"
              label="Tags"
              control={control}
              error={errors.tags as FieldError}
              placeholder="Add tags..."
            />
          </div>
        </section>

        <section className="rounded-lg border border-gray-200 bg-gray-50 p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <TipTapEditor
            control={control}
            name={"content"}
            label={"Blog content"}
            id={"content"}
            error={errors.content}
            placeholder="Add your blog content here..."
          />
        </section>

        <div className="mt-8 flex justify-end gap-4">
          <Button
            variant={"outline"}
            className="cursor-pointer"
            onClick={handleSaveDraft}
            disabled={isProcessing}
          >
            {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isSaving ? "Saving draft..." : "Save as draft"}
          </Button>
          <Button
            variant={"outline"}
            type="submit"
            className="cursor-pointer"
            disabled={isProcessing}
          >
            {isProcessing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isProcessing
              ? editingBlogId
                ? "Updating blog..."
                : "Creating blog..."
              : editingBlogId
                ? "Update blog"
                : "Create Blog"}
          </Button>
        </div>
        {error ||
          (isDraftError && (
            <p className="text-2xl text-red-500">
              There was an error while{" "}
              {isDraftError ? "saving draft" : "uploading blog"}
            </p>
          ))}
      </form>
    </section>
  );
}
