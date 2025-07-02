export const bookmarkKeys = {
  all: ["bookmarks"] as const,
  lists: () => [...bookmarkKeys.all, "list"] as const,
  list: (userId: string) => [...bookmarkKeys.lists(), userId] as const,
  details: () => [...bookmarkKeys.all, "detail"] as const,
  detail: (userId: string, blogId: string) =>
    [...bookmarkKeys.details(), userId, blogId] as const,
  counts: () => [...bookmarkKeys.all, "count"] as const,
  count: (blogId: string) => [...bookmarkKeys.counts(), blogId] as const,
};
