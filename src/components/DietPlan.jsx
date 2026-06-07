import { useRef } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { FiDatabase, FiRefreshCw } from "react-icons/fi";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function DietPlan({ cowData }) {
  const chartRef = useRef(null);
  const { green_fodder_kg, dry_fodder_kg, concentrate_kg, dmi_kg, feeding_frequency } = cowData;

  const data = {
    labels: ["Green Fodder (kg)", "Dry Fodder (kg)", "Concentrate (kg)"],
    datasets: [
      {
        label: "Feed Weight (kg)",
        data: [green_fodder_kg, dry_fodder_kg, concentrate_kg],
        backgroundColor: [
          "rgba(34, 197, 94, 0.75)",  // emerald-500
          "rgba(217, 119, 6, 0.75)",  // amber-600
          "rgba(99, 102, 241, 0.75)", // indigo-500
        ],
        borderColor: [
          "#22c55e",
          "#d97706",
          "#6366f1",
        ],
        borderWidth: 1.5,
        borderRadius: 8,
        barThickness: 32,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: "#fff",
        titleColor: "#15803d",
        bodyColor: "#1e293b",
        borderColor: "#bbf7d0",
        borderWidth: 1,
        cornerRadius: 12,
        padding: 10,
        callbacks: {
          label: (ctx) => `Amount: ${ctx.parsed.y} kg`,
        },
      },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: {
          color: "#059669",
          font: { size: 10, weight: "600", family: "Inter" },
        },
        border: { display: false },
      },
      y: {
        grid: { color: "#ecfdf5" },
        ticks: {
          color: "#059669",
          font: { size: 9, family: "Inter" },
          padding: 6,
        },
        border: { display: false },
      },
    },
  };

  return (
    <div className="bg-white/75 backdrop-blur-md rounded-3xl p-6 border border-green-100 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-sm font-bold text-green-900 mb-0.5">Diet Plan & Nutrition</h3>
          <p className="text-xs text-emerald-500">Formulated feed allocations</p>
        </div>
        <span className="text-[10px] bg-green-100 text-green-800 font-semibold px-2.5 py-1 rounded-full flex items-center gap-1.5">
          <FiDatabase className="text-[10px]" /> Live Diet Plan
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left side: chart */}
        <div className="lg:col-span-8 h-[220px]">
          <Bar ref={chartRef} data={data} options={options} />
        </div>

        {/* Right side: summary cards */}
        <div className="lg:col-span-4 flex flex-col justify-center gap-4">
          <div className="bg-emerald-50/50 rounded-2xl p-4 border border-emerald-100 flex items-center justify-between">
            <div>
              <p className="text-[10px] text-emerald-500 font-bold uppercase tracking-wider mb-1">DMI (Dry Matter Intake)</p>
              <p className="text-xs text-emerald-600 font-medium">Total weight per day</p>
            </div>
            <div className="text-right">
              <span className="text-xl font-extrabold text-green-900">{dmi_kg}</span>
              <span className="text-xs font-semibold text-green-700 ml-1">kg/d</span>
            </div>
          </div>

          <div className="bg-teal-50/50 rounded-2xl p-4 border border-teal-100 flex items-center justify-between">
            <div>
              <p className="text-[10px] text-teal-600 font-bold uppercase tracking-wider mb-1">Feeding Frequency</p>
              <p className="text-xs text-teal-700 font-medium">Recommended intervals</p>
            </div>
            <div className="text-right">
              <span className="text-xl font-extrabold text-teal-900">{feeding_frequency}</span>
              <span className="text-xs font-semibold text-teal-700 ml-1">times/d</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
