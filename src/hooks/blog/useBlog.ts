import { blogService } from "@/services/blogService";
import type { CreateBlog } from "@/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { blogKeys } from "./blogKeys";
import { toast } from "react-toastify";
import { useDebounced } from "../useDebounced";

export function useGetPosts() {
  return useQuery({
    queryKey: blogKeys.posts(),
    queryFn: blogService.getPosts,
  });
}

export function useGetPostBySlug(slug: string) {
  return useQuery({
    queryKey: blogKeys.postBySlug(slug),
    queryFn: () => blogService.getPostBySlug(slug),
    enabled: !!slug,
  });
}

export function useGetDraftPosts() {
  return useQuery({
    queryKey: blogKeys.draftPosts(),
    queryFn: () => blogService.getDraftPosts(),
  });
}

export function useGetPostById(id: string) {
  return useQuery({
    queryKey: blogKeys.post(id),
    queryFn: () => blogService.getPostById(id),
    enabled: !!id,
  });
}

export function useSearchPosts(searchTerm: string) {
  const debouncedSearch = useDebounced(searchTerm, 400);

  return useQuery({
    queryKey: blogKeys.search(debouncedSearch),
    queryFn: () => blogService.getSearchResults(debouncedSearch),
    enabled: debouncedSearch.length >= 5,
    staleTime: 5 * 60 * 1000,
    select: (data) => data.documents,
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

export function usePublishDraft() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => blogService.publishDraftPost(id),
    onSuccess: (updatedBlog) => {
      queryClient.invalidateQueries({ queryKey: blogKeys.draftPosts() });
      queryClient.invalidateQueries({ queryKey: blogKeys.posts() });
      queryClient.invalidateQueries({
        queryKey: blogKeys.post(updatedBlog.$id),
      });
      toast.success("Post published successfully");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to publish draft");
    },
  });
}

export function useUnpublishPost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => blogService.unpublishPost(id),
    onSuccess: (updatedBlog) => {
      queryClient.invalidateQueries({ queryKey: blogKeys.draftPosts() });
      queryClient.invalidateQueries({ queryKey: blogKeys.posts() });
      queryClient.invalidateQueries({
        queryKey: blogKeys.post(updatedBlog.$id),
      });
      toast.success("Post moved to drafts successfully!");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to unpublish blog");
    },
  });
}

export function useSaveDraft() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateBlog) =>
      blogService.addBlog({ ...data, status: "draft" }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: blogKeys.draftPosts() });
      toast.success("Draft saved successfully");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to save draft");
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
      queryClient.invalidateQueries({
        queryKey: blogKeys.draftPosts(),
      });
      toast.success("Blog deleted successfully");
    },

    onError: (error) => {
      toast.error(error.message || "Failed to delete blog");
    },
  });
}
