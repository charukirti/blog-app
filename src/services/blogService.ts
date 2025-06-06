import { COLLECTIONS, DATABASE_ID, databases } from "@/lib/appwrite";
import type { CreateBlog } from "@/types";
import { ID, Query } from "appwrite";
import { storageService } from "./storageService";

export const blogService = {
  async getPosts() {
    return await databases.listDocuments(DATABASE_ID, COLLECTIONS.BLOGS, [
      Query.orderDesc("$createdAt"),
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
          likes: null,
          comments: null,
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
