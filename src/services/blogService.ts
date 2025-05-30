import { COLLECTIONS, DATABASE_ID, databases } from "@/lib/appwrite";
import type { CreateBlog } from "@/types";
import { ID, Query } from "appwrite";

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

    return await databases.createDocument(
      DATABASE_ID,
      COLLECTIONS.BLOGS,
      ID.unique(),
      {
        ...data,
        likes: null,
        comments: null,
      }
    );
  },

  async getPostBySlug(slug: string) {
    return await databases.getDocument(DATABASE_ID, COLLECTIONS.BLOGS, slug);
  },

  async updateBlog(id: string, data: Partial<CreateBlog>) {
    return await databases.updateDocument(
      DATABASE_ID,
      COLLECTIONS.BLOGS,
      id,
      data
    );
  },

  async deleteBlog(id: string) {
    return await databases.deleteDocument(DATABASE_ID, COLLECTIONS.BLOGS, id);
  },
};
