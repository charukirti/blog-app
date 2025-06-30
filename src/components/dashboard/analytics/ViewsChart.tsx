import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { CustomTooltip } from "./CustomTooltip";

interface ViewsDataItem {
  month: string;
  views: number;
}

interface ViewsChartProps {
    data: ViewsDataItem[]
}

export default function ViewsChart ({data}:ViewsChartProps){
    return (
         <div className="bg-white rounded-xl p-6 shadow-sm border dark:bg-gray-900 border-gray-100">
      <h3 className="text-lg font-semibold text-gray-900 mb-4 dark:text-gray-200">Views Over Time</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis 
            dataKey="month" 
            tick={{ fontSize: 12 }}
            stroke="#6b7280"
          />
          <YAxis 
            tick={{ fontSize: 12 }}
            stroke="#6b7280"
          />
          <Tooltip content={<CustomTooltip />} />
          <Bar 
            dataKey="views" 
            fill="#3B82F6" 
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
    )
}

