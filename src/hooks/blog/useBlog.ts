import { blogService } from "@/services/blogService";
import type { CreateBlog } from "@/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { blogKeys } from "./blogKeys";
import { toast } from "react-toastify";

export function useGetPosts() {
  return useQuery({
    queryKey: blogKeys.posts(),
    queryFn: blogService.getPosts,
    staleTime: 5 * 60 * 1000,
  });
}

export function useGetPostBySlug(slug: string) {
  return useQuery({
    queryKey: blogKeys.postBySlug(slug),
    queryFn: () => blogService.getPostBySlug(slug),
    enabled: !!slug,
  });
}

export function useAddBlog() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateBlog) => blogService.addBlog(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: blogKeys.posts() });
      toast.success("Blog created succesfully!");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to create blog");
    },
  });
}

export function useUpdateBlog() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CreateBlog> }) =>
      blogService.updateBlog(id, data),
    onSuccess: (updatedBlog) => {
      queryClient.invalidateQueries({
        queryKey: blogKeys.post(updatedBlog.$id),
      });

      queryClient.invalidateQueries({
        queryKey: blogKeys.posts(),
      });

      toast.success("Blog updated successfully!");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to update blog");
    },
  });
}

export function useDeleteBlog() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => blogService.deleteBlog(id),
    onSuccess: (_, deletedID) => {
      queryClient.removeQueries({
        queryKey: blogKeys.post(deletedID),
      });
      queryClient.invalidateQueries({
        queryKey: blogKeys.posts(),
      });
    },
    onError: (error) => {
      toast.error(error.message || "Failed to delete blog");
    },
  });
}
