import { Eye, Heart, MessageCircle } from "lucide-react";

interface Stats {
  totalViews: number;
  totalLikes: number;
  totalComments: number;
}

export function BlogStatsCard({ stats }: { stats: Stats }) {
  const data = [
    { label: "Views", value: stats.totalViews, icon: <Eye className="w-6 h-6 text-gray-500" /> },
    { label: "Likes", value: stats.totalLikes, icon: <Heart className="w-6 h-6 text-gray-500" /> },
    { label: "Comments", value: stats.totalComments, icon: <MessageCircle className="w-6 h-6 text-gray-500" /> },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {data.map((item) => (
        <div
          key={item.label}
          className="flex justify-between items-center p-4 rounded-xl border bg-white shadow-sm dark:bg-gray-900 dark:border-zinc-700"
        >
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">{item.label}</p>
            <p className="text-2xl font-semibold text-gray-800 dark:text-white">{item.value}</p>
          </div>
          {item.icon}
        </div>
      ))}
    </div>
  );
}
