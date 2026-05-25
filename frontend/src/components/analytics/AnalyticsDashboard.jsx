import { useEffect, useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

import { Bar, Line } from "react-chartjs-2";
import axios from "axios";
import toast from "react-hot-toast";

/* =========================
   REGISTER CHART MODULES
========================= */
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export default function AnalyticsDashboard() {
  const [dailySales, setDailySales] = useState([]);
  const [weeklySales, setWeeklySales] = useState([]);
  const [loading, setLoading] = useState(true);

  /* =========================
     FETCH ANALYTICS DATA
  ========================= */
  const fetchAnalytics = async () => {
    try {
      setLoading(true);

      // You will create this endpoint in backend
      const res = await axios.get("/analytics/sales");

      setDailySales(res.data.daily || []);
      setWeeklySales(res.data.weekly || []);
    } catch (error) {
      console.log(error);
      toast.error("Failed to load analytics");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  /* =========================
     DAILY SALES CHART
  ========================= */
  const dailyChart = {
    labels: dailySales.map((d) => d.date),
    datasets: [
      {
        label: "Daily Sales (€)",
        data: dailySales.map((d) => d.total),
        borderColor: "#4F46E5",
        backgroundColor: "rgba(79,70,229,0.2)",
        tension: 0.4,
      },
    ],
  };

  /* =========================
     WEEKLY SALES CHART
  ========================= */
  const weeklyChart = {
    labels: weeklySales.map((d) => d.week),
    datasets: [
      {
        label: "Weekly Revenue (€)",
        data: weeklySales.map((d) => d.total),
        backgroundColor: "#10B981",
      },
    ],
  };

  if (loading) {
    return (
      <div className="p-6 text-gray-500">
        Loading analytics...
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-4">

      {/* ================= DAILY ================= */}
      <div className="bg-white p-4 rounded-xl shadow border">
        <h2 className="text-lg font-bold mb-4">
          📊 Daily Sales
        </h2>

        <Line data={dailyChart} />
      </div>

      {/* ================= WEEKLY ================= */}
      <div className="bg-white p-4 rounded-xl shadow border">
        <h2 className="text-lg font-bold mb-4">
          📈 Weekly Revenue
        </h2>

        <Bar data={weeklyChart} />
      </div>
    </div>
  );
}