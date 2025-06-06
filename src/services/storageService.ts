import { bucketID, storage } from "@/lib/appwrite";
import { ID } from "appwrite";

export const storageService = {
  async uploadThumbnail(file: File): Promise<{ fileId: string; url: string }> {
    try {
      const allowedTypes = [
        "image/jpeg",
        "image/jpg",
        "image/png",
        "image/webp",
        "image/gif",
      ];

      if (!allowedTypes.includes(file.type)) {
        throw new Error(
          "Invalid file type, please upload JPG, PNG, Webp, or GIF images",
        );
      }

      const maxSize = 5 * 1024 * 1024;

      if (file.size > maxSize) {
        throw new Error(
          "File size is too large, Please upload an image smaller than 5MB",
        );
      }

      const response = await storage.createFile(bucketID, ID.unique(), file);

      const url = this.getThumbnailUrl(response.$id);

      return {
        fileId: response.$id,
        url,
      };
    } catch (error) {
      console.log("Upload failed", error);
      throw error;
    }
  },

  async deleteThumbnail(fileId: string): Promise<void> {
    try {
      await storage.deleteFile(bucketID, fileId);
    } catch (error) {
      console.log("Delete failed", error);
      throw error;
    }
  },

  getThumbnailUrl(fileId: string): string {
    try {
      return storage.getFileView(bucketID, fileId);
    } catch (error) {
      console.log("Error while generating preview url", error);
      throw error;
    }
  },
  getDownloadUrl(fileId: string): string {
    try {
      return storage.getFileDownload(bucketID, fileId);
    } catch (error) {
      console.log("Error while generating download url", error);
      throw error;
    }
  },

  async getFileInfo(fileId: string) {
    try {
      return await storage.getFile(bucketID, fileId);
    } catch (error) {
      console.log("Failed to get file info", error);
      throw error;
    }
  },
};
