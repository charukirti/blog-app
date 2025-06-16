export const likeKeys = {
  all: ["likes"] as const,
  hasLiked: (blogId: string, userId: string) =>
    [...likeKeys.all, "hasLiked", blogId, userId] as const,
  likeCount: (blogId: string) => [...likeKeys.all, "count", blogId] as const,
  blogLikes: (blogId: string) =>
    [...likeKeys.all, "blogLikes", blogId] as const,
  userLikes: (userId: string) =>
    [...likeKeys.all, "userLikes", userId] as const,
};
