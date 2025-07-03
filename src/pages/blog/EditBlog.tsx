import CreateBlogForm from "@/components/blogs/form/CreateBlogForm";
import Loader from "@/components/Loader";
import { useGetPostById, useUpdateBlog } from "@/hooks/blog/useBlog";
import type { CreateBlogFormData } from "@/schemas/blogSchemas";
import type { CreateBlog } from "@/types";
import { useNavigate, useParams } from "react-router";

export default function EditBlog() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: blog, isLoading, error: fetchError } = useGetPostById(id!);

  const {
    mutate: updateBlog,
    isPending: isUpdating,
    error: updateError,
  } = useUpdateBlog();

  const handleUpdateBlog = (data: CreateBlog) => {
    if (!id) return;

    updateBlog(
      { id, data },
      {
        onSuccess: () => {
          navigate("/dashboard");
        },
      },
    );
  };

  const getInitialData = (): Partial<CreateBlogFormData> | undefined => {
    if (!blog) return undefined;

    return {
      title: blog.title,
      slug: blog.slug,
      content: blog.content,
      description: blog.description,
      category: blog.category,
      tags: blog.tags || [],
    };
  };

  if (isLoading) return <Loader />;

  if (fetchError || !blog) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="text-center">
          <h2 className="mb-2 text-xl font-semibold text-red-600">
            Blog Post Not Found
          </h2>
          <p className="mb-4 text-gray-600">
            The blog post you're trying to edit doesn't exist or has been
            deleted.
          </p>
          <button
            onClick={() => navigate("/dashboard")}
            className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
          >
            Back to Blogs
          </button>
        </div>
      </div>
    );
  }
  return (
    <div className="container mx-auto px-4 py-6">
      <CreateBlogForm
        onSubmit={handleUpdateBlog}
        isCreating={isUpdating}
        error={!!updateError}
        editingBlogId={id}
        initialData={getInitialData()}
        existingFeaturedImage={blog.featured_image}
      />
    </div>
  );
}
