export const dashboardKeys = {
  all: ['dashboard'] as const,
  user: (userId: string) => [...dashboardKeys.all, 'user', userId] as const,
  posts: (userId: string) => [...dashboardKeys.user(userId), 'posts'] as const,
  stats: (userId: string) => [...dashboardKeys.user(userId), 'stats'] as const,
  monthlyPerformance: (userId: string) => [...dashboardKeys.user(userId), 'monthlyPerformance'] as const,
  categories: (userId: string) => [...dashboardKeys.user(userId), 'categories'] as const,
  viewsOverTime: (userId: string) => [...dashboardKeys.user(userId), 'viewsOverTime'] as const,
  engagement: (userId: string) => [...dashboardKeys.user(userId), 'engagement'] as const,
  topPosts: (userId: string, limit?: number) => [...dashboardKeys.user(userId), 'topPosts', limit] as const,
  recentActivity: (userId: string, limit?: number) => [...dashboardKeys.user(userId), 'recentActivity', limit] as const,
  engagementRate: (userId: string) => [...dashboardKeys.user(userId), 'engagementRate'] as const,
};