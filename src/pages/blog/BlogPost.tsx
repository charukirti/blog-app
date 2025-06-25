import PostHeader from "@/components/blogs/post/PostHeader";
import Loader from "@/components/Loader";
import { useGetPostBySlug } from "@/hooks/blog/useBlog";
import { useParams } from "react-router";
import { TipTapRenderer } from "@/components/blogs/post/TipTapRenderer";
import ThumbnailComponent from "@/components/blogs/post/ThumbnailComponent";
import CommentForm from "@/components/comments/CommentForm";
import CommentList from "@/components/comments/CommentList";
export default function BlogPost() {
  const { slug } = useParams<{ slug: string }>();

  const { data: post, isLoading, error } = useGetPostBySlug(slug || "");

  if (!slug) return <div>No post found</div>;

  if (isLoading) return <Loader />;

  if (error) return <div>Error while fetching post</div>;

  return (
    <main className="mx-4 md:mx-20">
      <PostHeader
        title={post?.title}
        publishedDate={post?.$createdAt}
        blogId={post?.$id || ""}
        authorName={post?.author_name}
        content={post?.content}
      />

      <ThumbnailComponent
        featured_image={post?.featured_image}
        altText={post?.title}
      />

      <article className="font-source-serif max-w-none">
        <TipTapRenderer content={post?.content} />
      </article>

      <section className="rounded-xl border p-4">
        <h2 className="mb-2 text-xl">Add your comments 💭</h2>
        <CommentForm blogId={post?.$id} />
        <CommentList blogId={post?.$id} />
      </section>
    </main>
  );
}
