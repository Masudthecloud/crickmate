import React from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend);

function RunRateChart({ innings1 = [], innings2 = [] }) {
  const maxOvers = Math.max(innings1.length, innings2.length);
  const labels = Array.from({ length: maxOvers }, (_, i) => `Over ${i + 1}`);

  const data = {
    labels,
    datasets: [
      {
        label: "Innings 1",
        data: innings1,
        fill: false,
        borderColor: "#4f46e5",
        tension: 0.4,
      },
      {
        label: "Innings 2",
        data: innings2,
        fill: false,
        borderColor: "#e11d48",
        tension: 0.4,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { position: "top" },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: { display: true, text: "Runs per Over" },
      },
    },
  };

  return (
    <div className="mt-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-2">📈 Run Rate Comparison</h3>
      <div className="bg-white p-4 rounded shadow">
        <Line data={data} options={options} />
      </div>
    </div>
  );
}

export default RunRateChart;
