import { COLLECTIONS, DATABASE_ID, databases } from "@/lib/appwrite";
import type { CreateBlog } from "@/types";
import { ID, Query } from "appwrite";
import { storageService } from "./storageService";
import { LikeService } from "./LikeService";

export const blogService = {
  async getPosts() {
    return await databases.listDocuments(DATABASE_ID, COLLECTIONS.BLOGS, [
      Query.equal("status", "published"),
      Query.orderDesc("$createdAt"),
    ]);
  },

  async getSearchResults(query: string) {
    if (!query || query.trim().length < 5) {
      return { documents: [], total: 0 };
    }
    return await databases.listDocuments(DATABASE_ID, COLLECTIONS.BLOGS, [
      Query.search("title", query.trim()),
      Query.equal("status", "published"),
      Query.orderDesc("$createdAt"),
      Query.limit(6),
    ]);
  },

  async addBlog(data: CreateBlog) {
    if (!data.title?.trim() || !data.content?.trim()) {
      throw new Error("Title and content are required");
    }

    try {
      return await databases.createDocument(
        DATABASE_ID,
        COLLECTIONS.BLOGS,
        ID.unique(),
        {
          ...data,
          status: data.status || "publish",
        },
      );
    } catch (error) {
      if (data.featured_image) {
        try {
          await storageService.deleteThumbnail(data.featured_image);
        } catch (error) {
          console.log("Failed to clean featured image", error);
        }
      }
      throw error;
    }
  },

  async getPostBySlug(slug: string) {
    const response = await databases.listDocuments(
      DATABASE_ID,
      COLLECTIONS.BLOGS,
      [Query.equal("slug", slug)],
    );

    return response.documents[0];
  },

  async updateBlog(
    id: string,
    data: Partial<CreateBlog>,
    oldFeaturedImageId?: string,
  ) {
    try {
      const result = await databases.updateDocument(
        DATABASE_ID,
        COLLECTIONS.BLOGS,
        id,
        data,
      );

      if (oldFeaturedImageId && data.featured_image !== oldFeaturedImageId) {
        try {
          await storageService.deleteThumbnail(oldFeaturedImageId);
        } catch (error) {
          console.log("Failed to cleanup old featured image", error);
        }
      }

      return result;
    } catch (error) {
      if (data.featured_image && data.featured_image !== oldFeaturedImageId) {
        try {
          await storageService.deleteThumbnail(data.featured_image);
        } catch (cleanupError) {
          console.error("Failed to cleanup new featured image:", cleanupError);
        }
      }

      throw error;
    }
  },

  async incrementBlogView(id: string) {
    const blog = await databases.getDocument(
      DATABASE_ID,
      COLLECTIONS.BLOGS,
      id,
    );
    return await databases.updateDocument(DATABASE_ID, COLLECTIONS.BLOGS, id, {
      views: (blog.views ?? 0) + 1,
    });
  },

  async publishDraftPost(id: string) {
    return await this.updateBlog(id, { status: "published" });
  },

  async unpublishPost(id: string) {
    return await this.updateBlog(id, { status: "draft" });
  },
  async getDraftPosts() {
    return await databases.listDocuments(DATABASE_ID, COLLECTIONS.BLOGS, [
      Query.equal("status", "draft"),
      Query.orderDesc("$createdAt"),
    ]);
  },

  async getPostById(id: string) {
    return await databases.getDocument(DATABASE_ID, COLLECTIONS.BLOGS, id);
  },

  async deleteBlog(id: string) {
    try {
      const blog = await databases.getDocument(
        DATABASE_ID,
        COLLECTIONS.BLOGS,
        id,
      );
      const result = await databases.deleteDocument(
        DATABASE_ID,
        COLLECTIONS.BLOGS,
        id,
      );

      if (blog.featured_image) {
        try {
          await storageService.deleteThumbnail(blog.featured_image);
        } catch (error) {
          console.log("failed to cleanup featured image", error);
        }
      }
      return result;
    } catch (error) {
      console.log("failed to cleanup featured image", error);
    }
  },
};
