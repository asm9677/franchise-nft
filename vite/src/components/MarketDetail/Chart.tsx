import { FC } from "react";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface ChartProps {
  data: { date?: string; value: number }[];
  label: string;
}

const Chart: FC<ChartProps> = ({ data, label }) => {
  return (
    <ResponsiveContainer width="100%" height={145}>
      <LineChart data={data}>
        <defs>
          <linearGradient id="colorGradient" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#2BCBE4" />
            <stop offset="100%" stopColor="#5C34E9" />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="0" vertical={false} />
        <XAxis dataKey="date" />
        <YAxis
          label={{
            value: label,
            angle: -90,
            position: "insideLeft",
            offset: 20,
            dy: 40,
            style: {
              fontWeight: 700,
              fill: "#121212",
              fontSize: "14px",
            },
          }}
        />
        <Tooltip />
        <Line
          type="monotone"
          dataKey="value"
          stroke="url(#colorGradient)"
          strokeWidth={2}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default Chart;
