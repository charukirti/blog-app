import {
  useAddBookmark,
  useCheckBookmark,
  useRemoveBookmark,
} from "@/hooks/Bookmarks/useBookmarks";
import type { Blog } from "@/types";
import { BookmarkCheck, BookmarkPlus, Loader2 } from "lucide-react";

interface BookmarkButtonProps {
  blogId: string;
  userId: string;
  blogData?: {
    title: string;
    slug: string;
    featured_image: string;
    author_name: string;
  };
}

export default function BookmarkButton({
  blogId,
  userId,
  blogData,
}: BookmarkButtonProps) {
  const { data: bookmark, isLoading } = useCheckBookmark(userId, blogId);
  const { mutate: addBookmark, isPending: isAddingBookmark } = useAddBookmark();
  const { mutate: removeBookmark, isPending: isRemovingBookmark } =
    useRemoveBookmark();

  const isBookmarked = !!bookmark;
  const isPending = isAddingBookmark || isRemovingBookmark;

  const handleToggle = () => {
    if (isPending) return;

    if (isBookmarked && bookmark) {
      removeBookmark({
        bookmarkId: bookmark.$id,
        userId,
        blogId,
      });
    } else {
      if (!blogData) {
        console.log("Blog data is required to add bookmark");
        return;
      }

      const blogForBookmark: Partial<Blog> = {
        $id: blogId,
        title: blogData.title,
        featured_image: blogData.featured_image,
        author_name: blogData.author_name,
      };

      addBookmark({ userId, blog: blogForBookmark });
    }
  };

  if (!userId) return null;
  return (
    <>
      <button
        onClick={handleToggle}
        disabled={isLoading || isPending}
        className="relative cursor-pointer transition disabled:cursor-not-allowed"
        aria-label="toggle-bookmark"
        title={bookmark ? "Bookmarked, click to  remove" : "Bookmark this blog"}
      >
        {bookmark ? (
          <BookmarkCheck
            className={` ${isLoading && "opacity-30"}`}
            aria-label="bookmarked"
          />
        ) : (
          <BookmarkPlus
            className={` ${isLoading && "opacity-30"}`}
            aria-label="bookmark"
          />
        )}
        {isLoading && (
          <Loader2 className="absolute inset-0 m-auto h-4 w-4 animate-spin text-green-600" />
        )}
      </button>
    </>
  );
}
