interface CategoryDataItem {
  name: string;
  value: number;
  count: number;
  color: string;
}

interface CategoryTooltipProps {
  active?: boolean;
  payload?: Array<{
    payload: CategoryDataItem;
  }>;
}

export function CategoryTooltip({ active, payload }: CategoryTooltipProps) {
  if (active && payload && payload.length) {
    const data = payload[0].payload as CategoryDataItem;
    return (
      <div className="rounded-lg border border-gray-200 dark:bg-gray-800 bg-white p-3 shadow-lg">
        <p className="font-medium text-gray-900 dark:text-gray-200">{data.name}</p>
        <p className="text-sm text-gray-600 dark:text-gray-200">{`Posts: ${data.count}`}</p>
        <p className="text-sm text-gray-600 dark:text-gray-200">{`Percentage: ${data.value}%`}</p>
      </div>
    );
  }
  return null;
}
