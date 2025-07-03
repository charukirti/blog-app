import type { Blog } from "@/types";
import { calculateReadTime } from "@/utils/calculateReadTime";
import {
  Calendar,
  Clock,
  Heart,
  MessageCircle,
  Edit3,
  Trash2,
  FileText,
  Send,
  Eye,
} from "lucide-react";
import { formatDate } from "@/utils/formatDate";
import { Link, useNavigate } from "react-router";
import { useGetLikeCount } from "@/hooks/Likes/useLikes";
import { useGetCommentsCount } from "@/hooks/comments/useComments";
import Avatar from "../blogs/common/Avatar";
import {
  useDeleteBlog,
  usePublishDraft,
  useUnpublishPost,
} from "@/hooks/blog/useBlog";

export default function DashboardBlogCard({ blog }: { blog: Blog }) {
  const readingTime = calculateReadTime(blog.content);
  const { data: likeCount = 0 } = useGetLikeCount(blog.$id);
  const { data: commentCount } = useGetCommentsCount(blog.$id);
  const navigate = useNavigate();
  const { mutate: publishDraft, isPending: isPublishing } = usePublishDraft();
  const { mutate: unpublishPost, isPending: isUnpublishing } =
    useUnpublishPost();
  const { mutate: deleteBlog, isPending: isDeletingBlog } = useDeleteBlog();

  const handlePublishToggle = () => {
    if (blog.status === "published") {
      unpublishPost(blog.$id);
    } else {
      publishDraft(blog.$id);
    }
  };

  const handleDeleteBlog = () => {
    deleteBlog(blog.$id);
  };
  const isLoading = isPublishing || isUnpublishing || isDeletingBlog;

  return (
    <article
      aria-label="dashboard-blog-card"
      className="mb-5 flex flex-col rounded-xl border border-gray-200 bg-white shadow-sm transition-all duration-300 hover:shadow-lg md:flex-row dark:border-gray-700 dark:bg-gray-800 dark:shadow-gray-700/25 dark:hover:shadow-gray-700/40"
    >
      <section className="relative w-full shrink-0 p-3 md:w-80">
        <img
          src={blog.featured_image}
          className="h-48 w-full rounded-xl object-cover transition-transform duration-300 hover:scale-105"
          alt={blog.title}
        />
        <span
          className={`absolute top-3 left-3 rounded-full px-2 py-1 text-xs font-medium ${
            blog.status === "published"
              ? "bg-green-300 text-green-700 dark:bg-green-600 dark:text-white"
              : "bg-yellow-100 text-yellow-700 dark:bg-yellow-600 dark:text-white"
          }`}
        >
          {blog.status}
        </span>
      </section>

      <section className="flex w-full flex-col gap-3 p-6">
        <div className="flex-1">
          <div className="mb-4 flex flex-wrap gap-2">
            {blog.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-blue-50 px-3 py-1 text-sm font-medium text-blue-600 dark:bg-blue-900/30 dark:text-blue-400"
              >
                {tag}
              </span>
            ))}
            {blog.tags.length > 3 && (
              <span className="rounded-full bg-gray-100 px-3 py-1 text-sm font-medium text-gray-500 dark:bg-gray-700 dark:text-gray-400">
                +{blog.tags.length - 3} more
              </span>
            )}
          </div>

          <div className="mb-4 flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
            <Clock className="h-4 w-4" />
            <span>{readingTime} min read</span>
          </div>

          <h3 className="mb-2 line-clamp-2 text-base font-bold text-gray-900 transition-colors hover:text-gray-600 lg:text-2xl dark:text-white dark:hover:text-gray-300">
            <Link to={`/blog/${blog.slug}`}>{blog.title}</Link>
          </h3>

          <p className="mb-2 line-clamp-2 leading-relaxed text-gray-600 dark:text-gray-300">
            {blog.description}
          </p>
        </div>

        <footer className="flex flex-col gap-4 border-t border-gray-100 pt-4 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Avatar name={blog.author_name} />
              <div>
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {blog.author_name}
                </p>
                <p className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                  <Calendar className="h-3 w-3" />
                  {formatDate(blog.$createdAt)}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
              <span className="flex items-center gap-1">
                <Eye className="h-4 w-4" />
                {blog.views ?? 0}
              </span>
              <span className="flex items-center gap-1">
                <Heart className="h-4 w-4" />
                {likeCount}
              </span>
              <span className="flex items-center gap-1">
                <MessageCircle className="h-4 w-4" />
                {commentCount}
              </span>
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <button
              className="flex items-center gap-1 rounded-md border border-gray-300 px-3 py-1 text-sm text-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
              onClick={() => navigate(`/blog/edit/${blog.$id}`)}
            >
              <Edit3 className="h-4 w-4" />
              Edit
            </button>
            <button
              className={`flex items-center gap-1 rounded-md border px-3 py-1 text-sm transition-colors ${
                blog.status === "published"
                  ? "border-orange-300 text-orange-600 hover:bg-orange-50 dark:border-orange-600 dark:text-orange-400 dark:hover:bg-orange-900/30"
                  : "border-green-300 text-green-600 hover:bg-green-50 dark:border-green-600 dark:text-green-400 dark:hover:bg-green-900/30"
              } ${isLoading ? "cursor-not-allowed opacity-50" : ""}`}
              onClick={handlePublishToggle}
              disabled={isLoading}
            >
              {blog.status === "published" ? (
                <>
                  <FileText className="h-4 w-4" />
                  {isUnpublishing ? "Unpublishing..." : "Unpublish"}
                </>
              ) : (
                <>
                  <Send className="h-4 w-4" />
                  {isPublishing ? "Publishing..." : "Publish"}
                </>
              )}
            </button>
            <button
              className="flex items-center gap-1 rounded-md border border-red-300 px-3 py-1 text-sm text-red-600 hover:bg-red-50 dark:border-red-600 dark:text-red-400 dark:hover:bg-red-900/30"
              onClick={handleDeleteBlog}
              disabled={isLoading}
            >
              <Trash2 className="h-4 w-4" />
              {isDeletingBlog ? "Deleting" : "Delete"}
            </button>
          </div>
        </footer>
      </section>
    </article>
  );
}
