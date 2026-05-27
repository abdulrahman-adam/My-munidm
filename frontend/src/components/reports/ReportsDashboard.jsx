import { useEffect, useState } from "react";
import { TrendingDown, Package, BarChart3 } from "lucide-react";
import { useAppContext } from "../../context/AppContext";

export default function ReportsDashboard() {
  const {
    getSalesAnalytics,
    getLowStockProducts,
    getReorderSuggestions,
    downloadReport,
  } = useAppContext();

  const [analytics, setAnalytics] = useState({ daily: [] });
  const [lowStock, setLowStock] = useState([]);
  const [reorder, setReorder] = useState([]);

  /* =========================
     FORMAT DATE (ADDED)
  ========================= */
  const formatDate = (date) =>
    new Date(date).toLocaleString("fr-FR", {
      timeZone: "Europe/Paris",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });

  useEffect(() => {
    const load = async () => {
      try {
        const a = await getSalesAnalytics();
        const l = await getLowStockProducts();
        const r = await getReorderSuggestions();

        setAnalytics(a || { daily: [] });
        setLowStock(l || []);
        setReorder(r || []);
      } catch (err) {
        console.error("ReportsDashboard error:", err);
      }
    };

    load();
  }, []);

  return (
    <div className="p-4 md:p-6 space-y-6">
      {/* HEADER */}
      <h2 className="text-2xl font-bold flex items-center gap-2">
        <BarChart3 /> Sales Intelligence Dashboard
      </h2>

      {/* LOW STOCK */}
      <div className="bg-white p-4 rounded-xl border">
        <h3 className="font-bold flex items-center gap-2 text-red-600">
          <TrendingDown /> Low Stock Alerts
        </h3>

        <div className="mt-3 grid md:grid-cols-3 gap-3">
          {lowStock.map((p) => (
            <div key={p.id} className="p-3 border rounded-lg bg-red-50">
              <p className="font-bold">{p.name}</p>
              <p>Stock: {p.stock}</p>
            </div>
          ))}
        </div>
      </div>

      {/* REORDER */}
      <div className="bg-white p-4 rounded-xl border">
        <h3 className="font-bold flex items-center gap-2 text-blue-600">
          <Package /> Auto Reorder Suggestions
        </h3>

        <div className="mt-3 grid md:grid-cols-3 gap-3">
          {reorder.map((p) => (
            <div key={p.product_id} className="p-3 border rounded-lg">
              <p className="font-bold">{p.name}</p>
              <p>Stock: {p.stock}</p>
              <p className="text-green-600">
                Suggested: {p.suggested_order}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* ANALYTICS */}
      <div className="bg-white p-4 rounded-xl border">
        <h3 className="font-bold">Daily Sales</h3>

        <div className="space-y-2 mt-3">
          {analytics?.daily?.map((d, i) => (
            <div
              key={i}
              className="flex justify-between border-b py-1"
            >
              <span>
                {d.date ? formatDate(d.date) : "No date"}
              </span>
              <span>{d.total} €</span>
            </div>
          ))}
        </div>

        <div className="space-y-2 mt-3">
          <button
            onClick={downloadReport}
            className="bg-black text-white px-4 py-2 rounded-lg cursor-pointer"
          >
            Download Daily PDF Report
          </button>
        </div>
      </div>
    </div>
  );
}