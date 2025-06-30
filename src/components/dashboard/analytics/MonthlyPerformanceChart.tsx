import Loader from "@/components/Loader";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { CustomTooltip } from "./CustomTooltip";

interface MonthlyDataItem {
  month: string;
  views: number;
  likes: number;
  comments: number;
  posts: number;
}
interface MonthlyPerformanceChart {
  data: MonthlyDataItem[];
  isLoading?: boolean;
}

export default function MonthlyPerformanceChart({
  data,
  isLoading,
}: MonthlyPerformanceChart) {
  if (isLoading) {
    return (
      <div className="rounded-xl border border-gray-100 bg-white p-2 shadow-sm md:p-6 dark:bg-gray-900">
        <h3 className="mb-4 text-lg font-semibold text-gray-900">
          Monthly Performance
        </h3>
        <div className="flex h-[300px] items-center justify-center">
          <Loader />
        </div>
      </div>
    );
  }
  return (
    <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm dark:bg-gray-900">
      <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
        Monthly Performance
      </h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart
          data={data}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="#6b7280" />
          <YAxis tick={{ fontSize: 12 }} stroke="#6b7280" />
          <Tooltip content={<CustomTooltip />} />
          <Line
            type="monotone"
            dataKey="views"
            stroke="#3B82F6"
            strokeWidth={2}
            dot={{ fill: "#3B82F6", strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6, stroke: "#3B82F6", strokeWidth: 2 }}
          />
          <Line
            type="monotone"
            dataKey="likes"
            stroke="#10B981"
            strokeWidth={2}
            dot={{ fill: "#10B981", strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6, stroke: "#10B981", strokeWidth: 2 }}
          />
          <Line
            type="monotone"
            dataKey="comments"
            stroke="#F59E0B"
            strokeWidth={2}
            dot={{ fill: "#F59E0B", strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6, stroke: "#F59E0B", strokeWidth: 2 }}
          />
          <Line
            type="monotone"
            dataKey="posts"
            stroke="#EF4444"
            strokeWidth={2}
            dot={{ fill: "#EF4444", strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6, stroke: "#EF4444", strokeWidth: 2 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
