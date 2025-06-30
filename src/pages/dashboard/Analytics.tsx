import CategoryChart from "@/components/dashboard/analytics/CategoryChart";
import EngagementChartProps from "@/components/dashboard/analytics/EngagementChartProps";
import MonthlyPerformanceChart from "@/components/dashboard/analytics/MonthlyPerformanceChart";
import TopPosts from "@/components/dashboard/analytics/TopPosts";
import ViewsChart from "@/components/dashboard/analytics/ViewsChart";
import { BlogStatsCard } from "@/components/dashboard/StatsCard";
import Loader from "@/components/Loader";
import ErrorComponent from "@/components/ui/Error";

import {
  useCategoriesData,
  useCombinedStats,
  useEngagementData,
  useGetMonthlyPerformanceData,
  useGetTopPerformingPosts,
  useViewsOverTime,
} from "@/hooks/dashboard/useDashboard";
import { useAppSelector } from "@/store/typedHooks";

export default function Analytics() {
  const { user } = useAppSelector((state) => state.auth);
  const {
    data: statsData,
    isLoading: isStatsLoading,
    isError: isStatsError,
  } = useCombinedStats(user?.$id);

  const {
    data: monthlyPerformanceData,
    isLoading: isMonthlyChartLoading,
    isError: isMonthlyChartError,
  } = useGetMonthlyPerformanceData(user?.$id || "");

  const {
    data: categoriesData,
    isLoading: isCategoriesLoading,
    isError: isCategoriesError,
  } = useCategoriesData(user?.$id || "");

  const {
    data: topPerformingPosts,
    isLoading: isTopPostsLoading,
    isError: isTopPostsError,
  } = useGetTopPerformingPosts(user?.$id || "", 5);

  const {
    data: viewsTimelineData,
    isLoading: isViewsTimelineLoading,
    isError: isViewsTimelineError,
  } = useViewsOverTime(user?.$id || "");

  const {
    data: engagementMetrics,
    isLoading: isEngagementMetricsLoading,
    isError: isEngagementMetricsError,
  } = useEngagementData(user?.$id || "");

  const isLoading =
    isStatsLoading ||
    isMonthlyChartLoading ||
    isCategoriesLoading ||
    isTopPostsLoading ||
    isViewsTimelineLoading ||
    isEngagementMetricsLoading;

  const hasError =
    isStatsError ||
    isMonthlyChartError ||
    isCategoriesError ||
    isTopPostsError ||
    isViewsTimelineError ||
    isEngagementMetricsError;

  if (isLoading) return <Loader />;

  if (hasError)
    return (
      <ErrorComponent
        title="Something went wrong"
        message="unable to load data, Please try again."
      />
    );

  return (
    <section className="space-y-6">
      <BlogStatsCard stats={statsData!} />
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <MonthlyPerformanceChart data={monthlyPerformanceData ?? []} />

        <CategoryChart data={categoriesData ?? []} />

        <ViewsChart data={viewsTimelineData ?? []} />

        <EngagementChartProps data={engagementMetrics ?? []} />
      </div>

      <TopPosts posts={topPerformingPosts ?? []} />
    </section>
  );
}
