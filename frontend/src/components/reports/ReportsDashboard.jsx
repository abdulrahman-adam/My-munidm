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
  const [loading, setLoading] = useState(false);

  /* =========================
     FORMAT DATE
  ========================= */

  const formatDate = (date) => {
    if (!date) return "No date";

    return new Date(date).toLocaleString("fr-FR", {
      timeZone: "Europe/Paris",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  /* =========================
     LOAD DATA
  ========================= */

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);

        const [a, l, r] = await Promise.all([
          getSalesAnalytics(),
          getLowStockProducts(),
          getReorderSuggestions(),
        ]);

        setAnalytics(a || { daily: [] });
        setLowStock(l || []);
        setReorder(r || []);
      } catch (err) {
        console.error("ReportsDashboard error:", err);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  return (
    <div className="p-4 md:p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <BarChart3 /> Sales Intelligence Dashboard
        </h2>

        <button
          onClick={downloadReport}
          className="bg-black text-white px-4 py-2 rounded-lg hover:opacity-90 transition"
        >
          Download Daily PDF Report
        </button>
      </div>

      {/* LOADING */}
      {loading && (
        <div className="text-center text-gray-500">
          Loading dashboard data...
        </div>
      )}

      {/* GRID CONTAINER */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* =========================
            LOW STOCK
        ========================= */}
        <div className="bg-white p-4 rounded-xl border shadow-sm">
          <h3 className="font-bold flex items-center gap-2 text-red-600 mb-3">
            <TrendingDown /> Low Stock Alerts
          </h3>

          <div className="space-y-3">
            {lowStock.length === 0 ? (
              <p className="text-gray-500 text-sm">No low stock products</p>
            ) : (
              lowStock.map((p) => (
                <div
                  key={p.id}
                  className="p-3 border rounded-lg bg-red-50"
                >
                  <p className="font-semibold">{p.name}</p>
                  <p className="text-sm">Stock: {p.stock}</p>
                </div>
              ))
            )}
          </div>
        </div>

        {/* =========================
            REORDER
        ========================= */}
        <div className="bg-white p-4 rounded-xl border shadow-sm">
          <h3 className="font-bold flex items-center gap-2 text-blue-600 mb-3">
            <Package /> Auto Reorder Suggestions
          </h3>

          <div className="space-y-3">
            {reorder.length === 0 ? (
              <p className="text-gray-500 text-sm">No reorder suggestions</p>
            ) : (
              reorder.map((p) => (
                <div
                  key={p.product_id}
                  className="p-3 border rounded-lg"
                >
                  <p className="font-semibold">{p.name}</p>
                  <p className="text-sm">Stock: {p.stock}</p>
                  <p className="text-green-600 text-sm">
                    Suggested: {p.suggested_order}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>

        {/* =========================
            DAILY SALES
        ========================= */}
        <div className="bg-white p-4 rounded-xl border shadow-sm">
          <h3 className="font-bold mb-3">Daily Sales</h3>

          <div className="space-y-2 max-h-[300px] overflow-auto">
            {analytics?.daily?.length === 0 ? (
              <p className="text-gray-500 text-sm">No sales today</p>
            ) : (
              analytics.daily.map((d, i) => (
                <div
                  key={i}
                  className="flex justify-between border-b py-1 text-sm"
                >
                  <span>{formatDate(d.date)}</span>
                  <span className="font-medium">{d.total} €</span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}