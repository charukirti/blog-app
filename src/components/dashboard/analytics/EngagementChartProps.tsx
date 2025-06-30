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

interface EngagementDataItem {
  month: string;
  likes: number;
  comments: number;
}

interface EngagementChartProps {
  data: EngagementDataItem[];
}

export default function EngagementChartProps({ data }: EngagementChartProps) {
  return (
    <div className="rounded-xl border border-gray-100 bg-white p-2 shadow-sm md:p-6 dark:bg-gray-900">
      <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-gray-200">
        Engagement Metrics
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
            dataKey="likes"
            stroke="#10B981"
            strokeWidth={3}
            dot={{ fill: "#10B981", strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6, stroke: "#10B981", strokeWidth: 2 }}
          />
          <Line
            type="monotone"
            dataKey="comments"
            stroke="#F59E0B"
            strokeWidth={3}
            dot={{ fill: "#F59E0B", strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6, stroke: "#F59E0B", strokeWidth: 2 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
