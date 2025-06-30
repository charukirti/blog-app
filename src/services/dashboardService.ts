import { COLLECTIONS, DATABASE_ID, databases } from "@/lib/appwrite";
import { Query } from "appwrite";
import { LikeService } from "./LikeService";
import { commentService } from "./commentService";

interface MonthlyDataItem {
  month: string;
  views: number;
  likes: number;
  comments: number;
  posts: number;
}

interface MonthlyDataCollection {
  [key: string]: MonthlyDataItem;
}

interface CategoryDataItem {
  name: string;
  value: number;
  count: number;
  color: string;
}

interface CategoryDataCollection {
  [key: string]: number;
}

interface ViewsDataItem {
  month: string;
  views: number;
}

interface ViewsDataCollection {
  [key: string]: ViewsDataItem;
}

interface EngagementDataItem {
  month: string;
  likes: number;
  comments: number;
}

interface EngagementDataCollection {
  [key: string]: EngagementDataItem;
}

interface TopPerformingPost {
  id: string;
  title: string;
  views: number;
  likes: number;
  comments: number;
  category:string;
  createdAt: string;
  slug: string;
}

interface RecentActivityItem {
  id: string;
  title: string;
  status: string;
  views: number;
  createdAt: string;
  updatedAt?: string;
  slug: string;
}

export const dashboardService = {
  async getUserPosts(userId: string) {
    return await databases.listDocuments(DATABASE_ID, COLLECTIONS.BLOGS, [
      Query.equal("author_id", userId),
      Query.orderDesc("$createdAt"),
    ]);
  },

  async getCombinedStats(userId: string) {
    const response = await databases.listDocuments(
      DATABASE_ID,
      COLLECTIONS.BLOGS,
      [Query.equal("author_id", userId), Query.limit(100)],
    );

    const blogs = response.documents;

    let totalViews = 0;
    let totalLikes = 0;
    let totalComments = 0;

    for (const blog of blogs) {
      totalViews += blog.views || 0;

      const [likes, comments] = await Promise.all([
        LikeService.getLikeCount(blog.$id),
        commentService.getCommentsCount(blog.$id),
      ]);

      totalLikes += likes;
      totalComments += comments;
    }

    return { totalViews, totalLikes, totalComments };
  },

  async getMonthlyPerformanceData(userId: string) {
    try {
      const response = await databases.listDocuments(
        DATABASE_ID,
        COLLECTIONS.BLOGS,
        [
          Query.equal("author_id", userId),
          Query.orderDesc("$createdAt"),
          Query.limit(100),
        ],
      );
      const blogs = response.documents;
      const monthlyData: MonthlyDataCollection = {};

      for (const blog of blogs) {
        const creaetedDate = new Date(blog.$createdAt);
        const monthKey = `${creaetedDate.getFullYear()}-${String(creaetedDate.getMonth() + 1).padStart(2, "0")}`;
        const monthName = creaetedDate.toLocaleDateString("en-us", {
          month: "short",
          year: "numeric",
        });

        if (!monthlyData[monthKey]) {
          monthlyData[monthKey] = {
            month: monthName,
            views: 0,
            likes: 0,
            comments: 0,
            posts: 0,
          };
        }

        monthlyData[monthKey].views += blog.views || 0;
        monthlyData[monthKey].posts += 1;

        const [likes, comments] = await Promise.all([
          LikeService.getLikeCount(blog.$id),
          commentService.getCommentsCount(blog.$id),
        ]);

        monthlyData[monthKey].likes += likes;
        monthlyData[monthKey].comments += comments;
      }

      return Object.keys(monthlyData)
        .sort()
        .slice(-12)
        .map((key) => monthlyData[key]);
    } catch (error) {
      console.log(
        "There was an error while getting monthly performance data",
        error,
      );
      throw new Error("Unable to get monthly performance data");
    }
  },

  async getCategoriesData(userId: string) {
    try {
      const response = await databases.listDocuments(
        DATABASE_ID,
        COLLECTIONS.BLOGS,
        [Query.equal("author_id", userId), Query.limit(100), Query.equal('status', 'published')],
      );

      const blogs = response.documents;

      const categoryCount: CategoryDataCollection = {};
      const totalBlogs = blogs.length;

      blogs.forEach((blog) => {
        const category = blog.category || "Uncategorized";
        categoryCount[category] = (categoryCount[category] || 0) + 1;
      });

      const colors = [
        "#3B82F6",
        "#10B981",
        "#F59E0B",
        "#EF4444",
        "#8B5CF6",
        "#EC4899",
        "#06B6D4",
        "#84CC16",
        "#F97316",
        "#6366F1",
      ];

      return Object.entries(categoryCount).map(
        ([name, count], index): CategoryDataItem => ({
          name,
          value: totalBlogs > 0 ? Math.round((count / totalBlogs) * 100) : 0,
          count,
          color: colors[index % colors.length],
        }),
      );
    } catch (error) {
      console.log("Error getting category data", error);
      throw new Error("Unable to get category data");
    }
  },

  async getViewsOverTime(userId: string) {
    try {
      const response = await databases.listDocuments(
        DATABASE_ID,
        COLLECTIONS.BLOGS,
        [
          Query.equal("author_id", userId),
          Query.orderDesc("$createdAt"),
          Query.limit(100),
        ],
      );

      const blogs = response.documents;

      const monthlyViews: ViewsDataCollection = {};

      blogs.forEach((blog) => {
        const createdDate = new Date(blog.$createdAt);
        const monthKey = `${createdDate.getFullYear()} - ${String(createdDate.getMonth() + 1).padStart(2, "0")}`;
        const monthName = createdDate.toLocaleDateString("en-us", {
          month: "short",
          year: "numeric",
        });

        if (!monthlyViews[monthKey]) {
          monthlyViews[monthKey] = {
            month: monthName,
            views: 0,
          };
        }

        monthlyViews[monthKey].views += blog.views || 0;
      });

      return Object.keys(monthlyViews)
        .sort()
        .slice(-12)
        .map((key) => monthlyViews[key]);
    } catch (error) {
      console.log("Error getting views over time data", error);
      throw new Error("Unable to get views over time data");
    }
  },

  async getEngagementData(userId: string) {
    try {
      const response = await databases.listDocuments(
        DATABASE_ID,
        COLLECTIONS.BLOGS,
        [
          Query.equal("author_id", userId),
          Query.orderDesc("$createdAt"),
          Query.limit(100),
        ],
      );

      const blogs = response.documents;

      const monthlyEngagement: EngagementDataCollection = {};

      for (const blog of blogs) {
        const createdDate = new Date(blog.$createdAt);
        const monthKey = `${createdDate.getFullYear()} - ${String(createdDate.getMonth() + 1).padStart(2, "0")}`;
        const monthName = createdDate.toLocaleDateString("en-us", {
          month: "short",
          year: "numeric",
        });

        if (!monthlyEngagement[monthKey]) {
          monthlyEngagement[monthKey] = {
            month: monthName,
            likes: 0,
            comments: 0,
          };
        }

        const [likes, comments] = await Promise.all([
          LikeService.getLikeCount(blog.$id),
          commentService.getCommentsCount(blog.$id),
        ]);

        monthlyEngagement[monthKey].likes += likes;
        monthlyEngagement[monthKey].comments += comments;
      }

      return Object.keys(monthlyEngagement)
        .sort()
        .slice(-12)
        .map((key) => monthlyEngagement[key]);
    } catch (error) {
      console.log("Error getting engagement data", error);
      throw new Error("Unable to get engagement data");
    }
  },

  async getTopPerformingPosts(userId: string, limit: number = 5) {
    try {
      const response = await databases.listDocuments(
        DATABASE_ID,
        COLLECTIONS.BLOGS,
        [
          Query.equal("author_id", userId),
          Query.orderDesc("$createdAt"),
          Query.limit(limit),
        ],
      );

      const blogs = response.documents;

      const topPosts: TopPerformingPost[] = [];

      for (const blog of blogs) {
        const [likes, comments] = await Promise.all([
          LikeService.getLikeCount(blog.$id),
          commentService.getCommentsCount(blog.$id),
        ]);

        topPosts.push({
          id: blog.$id,
          title: blog.title,
          views: blog.views || 0,
          likes,
          comments,
          createdAt: blog.$createdAt,
          slug: blog.slug,
          category:blog.category,
        });
      }

      return topPosts;
    } catch (error) {
      console.log("Error getting top performing posts", error);
      throw new Error("Unable to get top performing posts");
    }
  },

  async getRecentActivity(userId: string, limit: number = 10) {
    try {
      const response = await databases.listDocuments(
        DATABASE_ID,
        COLLECTIONS.BLOGS,
        [
          Query.equal("author_id", userId),
          Query.orderDesc("$createdAt"),
          Query.limit(limit),
        ],
      );

      const blogs = response.documents;

      return blogs.map(
        (blog): RecentActivityItem => ({
          id: blog.$id,
          title: blog.title,
          status: blog.status,
          views: blog.views || 0,
          createdAt: blog.$createdAt,
          updatedAt: blog.$updatedAt,
          slug: blog.slug,
        }),
      );
    } catch (error) {
      console.log("Error getting recent activity", error);
      throw new Error("Unable to get recent activity");
    }
  },

  async getEngagementRate(userId: string) {
    try {
      const response = await databases.listDocuments(
        DATABASE_ID,
        COLLECTIONS.BLOGS,
        [Query.equal("author_id", userId), Query.limit(100)],
      );

      const blogs = response.documents;
      let totalViews = 0;
      let totalEngagements = 0;

      for (const blog of blogs) {
        const views = blog.views || 0;
        totalViews += views;

        const [likes, comments] = await Promise.all([
          LikeService.getLikeCount(blog.$id),
          commentService.getCommentsCount(blog.$id),
        ]);

        totalEngagements += likes + comments;
      }

      const engagementRate =
        totalViews > 0 ? (totalEngagements / totalViews) * 100 : 0;

      return {
        totalViews,
        totalEngagements,
        engagementRate: Math.round(engagementRate * 100) / 100,
      };
    } catch (error) {
      console.log("Error calculating engagement rate", error);
      throw new Error("Unable to calculate engagement rate");
    }
  },
};
