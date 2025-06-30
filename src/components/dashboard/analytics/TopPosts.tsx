import { Eye, Heart, MessageCircle } from "lucide-react";
interface TopPost {
  id: string;
  title: string;
  views: number;
  likes: number;
  comments: number;
  slug: string;
  createdAt: string;
  category: string; // optional if you add it later
}
interface TopPostsProps {
  posts: TopPost[];
}

export default function TopPosts({ posts }: TopPostsProps) {
  return (
    <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm dark:bg-gray-900">
      <h3 className="mb-6 text-lg font-semibold text-gray-900 dark:text-gray-200">
        Top Performing Posts
      </h3>
      <div className="space-y-4">
        {posts.map((post, index) => (
          <div
            key={post.id}
            className="flex items-center justify-between rounded-lg bg-gray-50 p-4 dark:bg-gray-800"
          >
            <div className="flex items-center gap-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-sm font-medium text-blue-600">
                #{index + 1}
              </div>
              <div>
                <h4 className="font-medium text-gray-900 dark:text-gray-200">
                  {post.title}
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {post.category || "Uncategorized"}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-6 text-sm text-gray-600 dark:text-gray-400">
              <div className="flex items-center gap-1">
                <Eye className="h-4 w-4" />
                {post.views.toLocaleString()}
              </div>
              <div className="flex items-center gap-1">
                <Heart className="h-4 w-4" />
                {post.likes}
              </div>
              <div className="flex items-center gap-1">
                <MessageCircle className="h-4 w-4" />
                {post.comments}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
