import { storageService } from "@/services/storageService";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";

export function useUploadThumbnail() {
  return useMutation({
    mutationFn: (file: File) => storageService.uploadThumbnail(file),
    onSuccess: (data) => {
      toast.success("Thumbnail uploaded successfully");
      return data;
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to upload thumbnail");
    },
  });
}

export function useDeleteThumbnail() {
  return useMutation({
    mutationFn: (fileId: string) => storageService.deleteThumbnail(fileId),
    onSuccess: () => {
      toast.success("Thumbnail deleted successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to delete thumbnail");
    },
  });
}
