import { COLLECTIONS, DATABASE_ID, databases } from "@/lib/appwrite";
import type { Comments, CreateCommentInput } from "@/types";
import { ID, Query } from "appwrite";

// Define the return type for list operations
interface CommentsListResponse {
  documents: Comments[];
  total: number;
}

// Define the return type for comments with replies
interface CommentWithReplies extends Comments {
  replies: Comments[];
  repliesCount: number;
}

interface CommentsWithRepliesResponse {
  documents: CommentWithReplies[];
  total: number;
}

export const commentService = {
  async addComment(data: CreateCommentInput): Promise<Comments> {
    try {
      const response = await databases.createDocument(
        DATABASE_ID,
        COLLECTIONS.COMMENTS,
        ID.unique(),
        {
          blog_id: data.blog_id,
          user_id: data.user_id,
          username: data.username,
          content: data.content,
          parent_id: data.parent_id || null,
        },
      );
      return response as Comments;
    } catch (error) {
      console.log("There was an error while adding comment", error);
      throw new Error("Unable to add your comment, please try again.");
    }
  },

  async updateComment(commentId: string, newContent: string): Promise<Comments> {
    try {
      const response = await databases.updateDocument(
        DATABASE_ID,
        COLLECTIONS.COMMENTS,
        commentId,
        {
          content: newContent,
        },
      );
      return response as Comments;
    } catch (error) {
      console.log("There was an error while updating comment", error);
      throw new Error("Unable to update your comment, please try again.");
    }
  },

  async removeComment(commentId: string): Promise<void> {
    try {
      await databases.deleteDocument(
        DATABASE_ID,
        COLLECTIONS.COMMENTS,
        commentId,
      );
    } catch (error) {
      console.log("There was an error while removing comment", error);
      throw new Error("Unable to remove your comment, please try again.");
    }
  },

  async getBlogComments(blogId: string): Promise<CommentsListResponse> {
    try {
      const comments = await databases.listDocuments(
        DATABASE_ID,
        COLLECTIONS.COMMENTS,
        [
          Query.equal("blog_id", blogId),
          Query.isNull("parent_id"),
          Query.orderDesc("$createdAt"),
        ],
      );

      return {
        documents: comments.documents as Comments[],
        total: comments.total,
      };
    } catch (error) {
      console.log("There was an error while getting blog comment", error);
      throw new Error(
        "Unable to get comments for this blog, please try again.",
      );
    }
  },

  async getCommentReplies(parentId: string): Promise<CommentsListResponse> {
    try {
      const replies = await databases.listDocuments(
        DATABASE_ID,
        COLLECTIONS.COMMENTS,
        [Query.equal("parent_id", parentId), Query.orderAsc("$createdAt")],
      );

      return {
        documents: replies.documents as Comments[],
        total: replies.total,
      };
    } catch (error) {
      console.log("There was an error while getting comment replies", error);
      throw new Error(
        "Unable to get replies for this comment, please try again.",
      );
    }
  },

  async getCommentsCount(blogId: string): Promise<number> {
    try {
      const count = await databases.listDocuments(
        DATABASE_ID,
        COLLECTIONS.COMMENTS,
        [Query.equal("blog_id", blogId), Query.limit(1)],
      );
      return count.total || 0;
    } catch (error) {
      console.log("There was an error while getting comment count", error);
      throw new Error("Unable to get comment count.");
    }
  },

  async getRepliesCount(commentId: string): Promise<number> {
    try {
      const count = await databases.listDocuments(
        DATABASE_ID,
        COLLECTIONS.COMMENTS,
        [Query.equal("parent_id", commentId), Query.limit(1)],
      );

      return count.total || 0;
    } catch (error) {
      console.log("There was an error while getting reply count", error);
      throw new Error("Unable to reply count.");
    }
  },

  async getBlogCommentsWithReplies(blogId: string): Promise<CommentsWithRepliesResponse> {
    try {
      const topLevelComments = await this.getBlogComments(blogId);

      const commentWithReply = await Promise.all(
        topLevelComments.documents.map(async (comment): Promise<CommentWithReplies> => {
          const replies = await this.getCommentReplies(comment.$id);
          return {
            ...comment,
            replies: replies.documents,
            repliesCount: replies.total,
          };
        }),
      );

      return {
        documents: commentWithReply,
        total: topLevelComments.total,
      };
    } catch (error) {
      console.log(
        "There was an error while getting comments with replies",
        error,
      );
      throw new Error("Unable to get comments with replies");
    }
  },
};