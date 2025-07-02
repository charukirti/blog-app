import { COLLECTIONS, DATABASE_ID, databases } from "@/lib/appwrite";
import type { Blog, Bookmark } from "@/types";
import { ID, Query } from "appwrite";

export const bookmarkService = {
  async addBookmark(userId: string, blog: Partial<Blog>) {
    try {
      const bookmark = await databases.createDocument(
        DATABASE_ID,
        COLLECTIONS.BOOKMARKS,
        ID.unique(),
        {
          user_id: userId,
          blog_id: blog.$id,
        },
      );

      return bookmark as Bookmark;
    } catch (error) {
      console.log("There was an error while adding blog to bookmark", error);
      throw new Error("Unable to add post to the bookmark");
    }
  },

  async removeBookmark(bookmarkId: string) {
    try {
      await databases.deleteDocument(
        DATABASE_ID,
        COLLECTIONS.BOOKMARKS,
        bookmarkId,
      );
    } catch (error) {
      console.log("Error removing bookmark", error);
      throw new Error("Unable to remove bookmark, please try again.");
    }
  },

  async checkBookmark(userId: string, blogId: string) {
    try {
      const response = await databases.listDocuments(
        DATABASE_ID,
        COLLECTIONS.BOOKMARKS,
        [
          Query.equal("user_id", userId),
          Query.equal("blog_id", blogId),
          Query.limit(1),
        ],
      );

      return response.documents.length > 0
        ? (response.documents[0] as Bookmark)
        : null;
    } catch (error) {
      console.log("Error checking bookmark:", error);
      throw null;
    }
  },

  async getUserBookmarks(userId: string) {
    try {
      const response = await databases.listDocuments(
        DATABASE_ID,
        COLLECTIONS.BOOKMARKS,
        [
          Query.equal("user_id", userId),
          Query.orderDesc("$createdAt"),
          Query.limit(10),
        ],
      );

      if (response.documents.length === 0) {
        return { bookmarks: [], total: 0 };
      }

      const blogIds = response.documents.map((bookmark) => bookmark.blog_id);
      const blogsResponse = await databases.listDocuments(
        DATABASE_ID,
        COLLECTIONS.BLOGS,
        [Query.equal("$id", blogIds), Query.equal("status", "published")],
      );

      const combined = response.documents.map((bookmark) => ({
        bookmark: bookmark as Bookmark,
        blog:
          (blogsResponse.documents.find(
            (blog) => blog.$id === bookmark.blog_id,
          ) as Blog) || null,
      }));
      return {
        bookmarks: combined,
        total: response.total,
      };
    } catch (error) {
      console.error("Error fetching user bookmarks:", error);
      throw new Error("Unable to fetch your bookmarks");
    }
  },

  async getBlogBookmarkCount(blogId: string) {
    try {
      const response = await databases.listDocuments(
        DATABASE_ID,
        COLLECTIONS.BOOKMARKS,
        [Query.equal("blog_id", blogId), Query.limit(1)],
      );

      return response.total;
    } catch (error) {
      console.error("Error fetching bookmark count:", error);
      return 0;
    }
  },
};
