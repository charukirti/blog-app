import { useQuery } from "@tanstack/react-query";
import { dashboardKeys } from "./queryKeys";
import { dashboardService } from "@/services/dashboardService";

export function useGetUserPosts(userId: string | undefined) {
  return useQuery({
    queryKey: dashboardKeys.posts(userId!),
    queryFn: () => dashboardService.getUserPosts(userId!),
    enabled: !!userId,
    staleTime: 10 * 60 * 1000,
  });
}
export function useCombinedStats(userId: string | undefined) {
  return useQuery({
    queryKey: dashboardKeys.stats(userId!),
    queryFn: () => dashboardService.getCombinedStats(userId!),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    enabled: !!userId,
  });
}

export function useGetMonthlyPerformanceData(userId: string | "") {
  return useQuery({
    queryKey: dashboardKeys.monthlyPerformance(userId!),
    queryFn: () => dashboardService.getMonthlyPerformanceData(userId!),
    enabled: !!userId,
    staleTime: 5 * 60 * 1000,
    gcTime: 15 * 60 * 1000,
  });
}

export function useCategoriesData(userId: string | "") {
  return useQuery({
    queryKey: dashboardKeys.categories(userId!),
    queryFn: () => dashboardService.getCategoriesData(userId!),
    enabled: !!userId,
    staleTime: 10 * 60 * 1000,
    gcTime: 20 * 60 * 1000,
  });
}

export function useViewsOverTime(userId: string | "") {
  return useQuery({
    queryKey: dashboardKeys.viewsOverTime(userId!),
    queryFn: () => dashboardService.getViewsOverTime(userId!),
    enabled: !!userId,
    staleTime: 5 * 60 * 1000,
    gcTime: 15 * 60 * 1000,
  });
}

export function useEngagementData(userId: string | "") {
  return useQuery({
    queryKey: dashboardKeys.engagement(userId!),
    queryFn: () => dashboardService.getEngagementData(userId!),
    enabled: !!userId,
    staleTime: 3 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
}

export function useGetTopPerformingPosts(
  userId: string | "",
  limit: number = 5,
) {
  return useQuery({
    queryKey: dashboardKeys.topPosts(userId, limit),
    queryFn: () => dashboardService.getTopPerformingPosts(userId, limit),
    enabled: !!userId,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
}

export function useGetRecentActivity(userId: string | "", limit: number = 10) {
  return useQuery({
    queryKey: dashboardKeys.recentActivity(userId, limit),
    queryFn: () => dashboardService.getRecentActivity(userId, limit),
    enabled: !!userId,
    staleTime: 2 * 60 * 1000,
    gcTime: 5 * 60 * 1000,
  });
}

export function useGetEngagementRate(userId: string | "") {
  return useQuery({
    queryKey: dashboardKeys.engagementRate(userId),
    queryFn: () => dashboardService.getEngagementRate(userId),
    enabled: !!userId,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
}

// combined all query hooks together

export function useGetAnalyticsOverview(userId: string | "") {
  const stats = useCombinedStats(userId);
  const monthlyPerformance = useGetMonthlyPerformanceData(userId);
  const categories = useCategoriesData(userId);
  const topPosts = useGetTopPerformingPosts(userId, 5);
  const recentActivity = useGetRecentActivity(userId, 10);
  const engagementRate = useGetEngagementRate(userId);

  return {
    stats,
    monthlyPerformance,
    categories,
    topPosts,
    recentActivity,
    engagementRate,
    isLoading:
      stats.isLoading ||
      monthlyPerformance.isLoading ||
      categories.isLoading ||
      topPosts.isLoading ||
      recentActivity.isLoading ||
      engagementRate.isLoading,
    isError:
      stats.isError ||
      monthlyPerformance.isError ||
      categories.isError ||
      topPosts.isError ||
      recentActivity.isError ||
      engagementRate.isError,
  };
}
