export const commentKeys = {
  all: ["comments"] as const,
  blog: (blogId: string) => [...commentKeys.all, "blog", blogId] as const,
  blogWithReplies: (blogId: string) =>
    [...commentKeys.all, "blogWithReplies", blogId] as const,
  replies: (parentId: string) =>
    [...commentKeys.all, "replies", parentId] as const,
  commentsCount: (blogId: string) =>
    [...commentKeys.all, "commentsCount", blogId] as const,
  repliesCount: (commentId: string) =>
    [...commentKeys.all, "repliesCount", commentId] as const,
};
