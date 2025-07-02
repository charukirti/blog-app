import Avatar from "@/components/blogs/common/Avatar";
import Loader from "@/components/Loader";
import ErrorComponent from "@/components/ui/Error";
import {
  useGetUsersBookmark,
  useRemoveBookmark,
} from "@/hooks/Bookmarks/useBookmarks";
import { useAppSelector } from "@/store/typedHooks";
import { formatDate } from "@/utils/formatDate";
import { BookmarkPlus, Calendar, Trash2 } from "lucide-react";
import { Link } from "react-router";

export default function Bookmarks() {
  const userId = useAppSelector((state) => state.auth.user?.$id);
  const {
    data: bookmarks,
    isLoading: loadingBookmarks,
    error,
    refetch,
  } = useGetUsersBookmark(userId!);

  const { mutate: remove, isPending: isRemoving } = useRemoveBookmark();

  if (loadingBookmarks) return <Loader />;

  console.log(bookmarks);

  if (error) {
    return (
      <ErrorComponent
        title="Failed to load bookmarks"
        message="Try again"
        onRetry={refetch}
      />
    );
  }

  if (!bookmarks?.bookmarks.length) {
    return (
      <div className="py-12 text-center">
        <BookmarkPlus size={48} className="mx-auto mb-4 text-gray-400" />
        <h3 className="mb-2 text-xl font-semibold text-gray-600">
          No bookmarks yet
        </h3>
        <p className="text-gray-500">
          Start bookmarking blogs you want to read later
        </p>
      </div>
    );
  }

  return (
    <main className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">My Bookmarks</h1>
        <span className="text-gray-500 dark:text-gray-200">
          {bookmarks.total} bookmark{bookmarks.total !== 1 ? "s" : ""}
        </span>
      </div>

      <section>
        {bookmarks.bookmarks.map(({ bookmark, blog }) => (
          <article
            aria-label="dashboard-blog-card"
            className="mb-5 flex flex-col rounded-xl border border-gray-200 bg-white shadow-sm transition-all duration-300 hover:shadow-lg md:flex-row dark:border-gray-700 dark:bg-gray-800 dark:shadow-gray-700/25 dark:hover:shadow-gray-700/40"
            key={bookmark.id}
          >
            {blog && (
              <section className="w-full shrink-0 p-3 md:w-80">
                <img
                  src={blog.featured_image}
                  className="h-48 w-full rounded-xl object-cover transition-transform duration-300 hover:scale-105"
                  alt={blog.title}
                />
              </section>
            )}

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
                        {formatDate(bookmark.$createdAt)}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-3">
                  <button
                    className="flex items-center gap-1 rounded-md border border-red-300 px-3 py-1 text-sm text-red-600 hover:bg-red-50 dark:border-red-600 dark:text-red-400 dark:hover:bg-red-900/30 cursor-pointer"
                    onClick={() =>
                      remove({
                        blogId: bookmark.blog_id,
                        userId: userId!,
                        bookmarkId: bookmark.$id,
                      })
                    }
                    disabled={isRemoving}
                  >
                    <Trash2 className="h-4 w-4" />
                    {isRemoving ? "Removing bookmark...." : "Remove Bookmark"}
                  </button>
                </div>
              </footer>
            </section>
          </article>
        ))}
      </section>
    </main>
  );
}
