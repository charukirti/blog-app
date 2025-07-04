import type { Blog } from "@/types";
import Avatar from "../common/Avatar";
import { calculateReadTime } from "@/utils/calculateReadTime";
import { Calendar, Clock, Heart, MessageCircle } from "lucide-react";
import { formatDate } from "@/utils/formatDate";
import { Link } from "react-router";
import { useGetLikeCount } from "@/hooks/Likes/useLikes";
import { useGetCommentsCount } from "@/hooks/comments/useComments";

interface BlogCardProps {
  blog: Blog;
}

export default function BlogCard({ blog }: BlogCardProps) {
  const readingTime = calculateReadTime(blog.content);
  const { data: likeCount = 0 } = useGetLikeCount(blog.$id);
  const { data: commentCount } = useGetCommentsCount(blog.$id);
  return (
    <Link to={`/blog/${blog.slug}`}>
      <article
        aria-label="blog-card"
        className="mb-5 flex flex-col rounded-xl border border-gray-200 bg-white shadow-sm transition-all duration-300 hover:shadow-lg md:flex-row dark:border-gray-700 dark:bg-gray-800 dark:shadow-gray-700/25 dark:hover:shadow-gray-700/40"
      >
        <section className="w-full shrink-0 p-3 md:w-80">
          <img
            src={blog.featured_image}
            className="h-48 w-full rounded-xl transition-transform duration-300 hover:scale-105"
            alt={blog.title}
            loading="lazy" 
          />
        </section>
        <section className="flex flex-col gap-3 p-6">
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
            <h3 className="mb-2 line-clamp-2 cursor-pointer text-base font-bold text-gray-900 transition-colors hover:text-gray-600 lg:text-2xl dark:text-white dark:hover:text-gray-300">
              {blog.title}
            </h3>
            <p className="mb-2 line-clamp-2 leading-relaxed text-gray-600 dark:text-gray-300">
              {blog.description}
            </p>
          </div>

          <footer className="flex items-center justify-between border-t border-gray-100 pt-4 dark:border-gray-700">
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
                <Heart className="h-4 w-4" />
                {likeCount ?? 0}
              </span>
              <span className="flex items-center gap-1">
                <MessageCircle className="h-4 w-4" />
                {commentCount ?? 0}
              </span>
            </div>
          </footer>
        </section>
      </article>
    </Link>
  );
}
