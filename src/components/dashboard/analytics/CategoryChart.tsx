import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { CategoryTooltip } from "./CategoryTooltip";

interface CategoryDataItem {
  name: string;
  value: number;
  count: number;
  color: string;
}

interface CategoryChartProps {
  data: CategoryDataItem[];
  isLoading?: boolean;
}

export default function CategoryChart({ data }: CategoryChartProps) {
  return (
    <div className="rounded-xl border border-gray-100 bg-white p-2 shadow-sm md:p-6 dark:bg-gray-900">
      <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-gray-200">
        Posts by Category
      </h3>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={100}
            paddingAngle={5}
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip content={<CategoryTooltip />} />
        </PieChart>
      </ResponsiveContainer>
      <div className="mt-4 flex flex-wrap gap-4">
        {data.map((category, index) => (
          <div key={index} className="flex items-center gap-2">
            <div
              className="h-3 w-3 rounded-full"
              style={{ backgroundColor: category.color }}
            />
            <span className="text-sm text-gray-600">
              {category.name} ({category.value}%)
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
