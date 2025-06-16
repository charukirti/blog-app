import { COLLECTIONS, DATABASE_ID, databases } from "@/lib/appwrite";
import { ID, Query } from "appwrite";

interface LikeDocument {
  $id: string;
  $createdAt: string;
  blog_id: string;
  user_id: string;
  $updatedAt?: string;
}

export const LikeService = {
  async hasUserLiked(blogId: string, userId: string): Promise<boolean> {
    try {
      const response = await databases.listDocuments(
        DATABASE_ID,
        COLLECTIONS.LIKES,
        [
          Query.equal("blog_id", blogId),
          Query.equal("user_id", userId),
          Query.limit(1),
        ],
      );

      return response.documents.length > 0;
    } catch (error) {
      console.log("Error while checking user liked or not", error);
      return false;
    }
  },

  async getLikeCount(blogId: string): Promise<number> {
    try {
      const response = await databases.listDocuments(
        DATABASE_ID,
        COLLECTIONS.LIKES,
        [Query.equal("blog_id", blogId), Query.limit(1000)],
      );

      return response.total;
    } catch (error) {
      console.log("Error while getting likes count", error);
      return 0;
    }
  },

  async likeBlog(blogId: string, userId: string): Promise<LikeDocument> {
    try {
      const isLiked = await this.hasUserLiked(blogId, userId);

      if (isLiked) {
        throw new Error("Post already liked!");
      }

      const createLike = await databases.createDocument(
        DATABASE_ID,
        COLLECTIONS.LIKES,
        ID.unique(),
        {
          blog_id: blogId,
          user_id: userId,
        },
      );

      return createLike as unknown as LikeDocument;
    } catch (error) {
      console.log("Error while liking blog", error);
      throw error;
    }
  },

  async unlikeBlog(blogId: string, userId: string): Promise<void> {
    try {
      const response = await databases.listDocuments(
        DATABASE_ID,
        COLLECTIONS.LIKES,
        [
          Query.equal("blog_id", blogId),
          Query.equal("user_id", userId),
          Query.limit(1),
        ],
      );

      if (response.documents.length === 0) {
        throw new Error("Like not found");
      }

      await databases.deleteDocument(
        DATABASE_ID,
        COLLECTIONS.LIKES,
        response.documents[0].$id,
      );
    } catch (error) {
      console.log("Error while unliking blog", error);
      throw error;
    }
  },

  // async updateLikeCount(blogId: string): Promise<void> {
  //   try {
  //     const likeCount = await this.getLikeCount(blogId);
  //     await databases.updateDocument(DATABASE_ID, COLLECTIONS.BLOGS, blogId, {
  //       likes: likeCount,
  //     });
  //   } catch (error) {
  //     console.log("Error while updating like count", error);
  //     throw error;
  //   }
  // },
  async getBlogLikes(blogId: string): Promise<LikeDocument[]> {
    try {
      const response = await databases.listDocuments(
        DATABASE_ID,
        COLLECTIONS.LIKES,
        [Query.equal("blog_id", blogId), Query.orderDesc("$createdAt")],
      );

      return response.documents as unknown as LikeDocument[];
    } catch (error) {
      console.log("Error while getting blog likes", error);
      return [];
    }
  },

  async getUserLikedPosts(userId: string): Promise<LikeDocument[]> {
    try {
      const response = await databases.listDocuments(
        DATABASE_ID,
        COLLECTIONS.LIKES,
        [Query.equal("user_id", userId), Query.orderDesc("$createdAt")],
      );

      return response.documents as unknown as LikeDocument[];
    } catch (error) {
      console.log("Error while getting users liked posts", error);
      return [];
    }
  },
};
