

export const blogKeys = {
  all: ["blog"] as const,
  posts: () => [...blogKeys.all, "posts"] as const,
  post: (id: string) => [...blogKeys.all, "post", id] as const,
  draftPosts: () => [...blogKeys.all, 'drafts'] as const,
  postBySlug: (slug: string) =>
    [...blogKeys.all, "post", "slug", slug] as const,
};

