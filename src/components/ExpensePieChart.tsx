import {PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer} from 'recharts'

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
  return (
    <div className="w-full max-w-xl rounded-xl bg-white p-5 shadow-md">
      <h2 className="mb-4 text-xl font-bold text-gray-800">
        Expenses by Category
      </h2>

      <ResponsiveContainer width="100%" height={350}>
        <PieChart>
          <Pie
            data={data}
            dataKey="amount"
            nameKey="category"
            cx="50%"
            cy="50%"
            outerRadius={110}
            innerRadius={60}
            paddingAngle={3}
            label
          >
            {data.map((expense, index) => (
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