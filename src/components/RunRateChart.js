import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

function RunRateChart({ innings1 = [], innings2 = [] }) {
  const maxOvers = Math.max(innings1.length, innings2.length);
  const data = Array.from({ length: maxOvers }).map((_, i) => ({
    over: i + 1,
    "Team A": innings1[i] || 0,
    "Team B": innings2[i] || 0,
  }));

  return (
    <div className="w-full h-72">
      <ResponsiveContainer>
        <LineChart data={data}>
          <CartesianGrid stroke="#ccc" />
          <XAxis
            dataKey="over"
            label={{ value: "Over", position: "insideBottom", offset: -5 }}
          />
          <YAxis
            label={{ value: "Runs", angle: -90, position: "insideLeft" }}
          />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="Team A" stroke="#4f46e5" />
          <Line type="monotone" dataKey="Team B" stroke="#16a34a" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export default RunRateChart;
