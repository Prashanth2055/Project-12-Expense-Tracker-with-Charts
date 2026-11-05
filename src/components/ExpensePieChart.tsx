import {PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer} from 'recharts'
import { useMemo } from 'react';

interface Expense {
  id: number;
  date: string;
  note: string;
  category: string;
  amount: number | null;
}

interface ExpensePieChartProps {
  data: Expense[];
}

const COLORS = [
  "#0088FE",
  "#00C49F",
  "#FFBB28",
  "#FF8042",
  "#A855F7",
  "#EC4899",
];

function ExpensePieChart({data} : ExpensePieChartProps) {

  const categoryData = useMemo(() => {
  return data.reduce<{ category: string; amount: number }[]>(
    (acc, expense) => {
      const existingCategory = acc.find(
        (item) => item.category === expense.category
      );

      if (existingCategory) {
        existingCategory.amount += expense.amount ?? 0;
      } else {
        acc.push({
          category: expense.category,
          amount: expense.amount ?? 0,
        });
      }

      return acc;
    },
    []
  );
}, [data]);

  return (
    <div className="w-full max-w-xl rounded-xl bg-white p-5 shadow-md">
      <h2 className="mb-4 text-xl font-bold text-gray-800">
        Expenses by Category
      </h2>

      <ResponsiveContainer width="100%" height={350}>
        <PieChart>
          <Pie
            data={categoryData}
            dataKey="amount"
            nameKey="category"
            cx="50%"
            cy="50%"
            outerRadius={110}
            innerRadius={60}
            paddingAngle={3}
            label
          >
            {categoryData.map((expense, index) => (
              <Cell
                key={expense.category}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>

          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

export default ExpensePieChart;