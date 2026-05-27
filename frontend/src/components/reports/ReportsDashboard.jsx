import { useEffect, useState } from "react";
import {
  TrendingDown,
  Package,
  BarChart3,
  Download,
  CalendarDays,
  Euro,
} from "lucide-react";

import { useAppContext } from "../../context/AppContext";

export default function ReportsDashboard() {
  const {
    getSalesAnalytics,
    getLowStockProducts,
    getReorderSuggestions,
    downloadReport,
  } = useAppContext();

  /* =========================
     STATES
  ========================= */

  const [analytics, setAnalytics] = useState({
    daily: [],
  });

  const [lowStock, setLowStock] = useState([]);
  const [reorder, setReorder] = useState([]);

  const [loading, setLoading] = useState(true);

  /* =========================
     FORMAT DATE & TIME
  ========================= */

  const formatDateTime = (date) => {
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
     LOAD DASHBOARD DATA
  ========================= */

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        setLoading(true);

        const [analyticsData, lowStockData, reorderData] =
          await Promise.all([
            getSalesAnalytics(),
            getLowStockProducts(),
            getReorderSuggestions(),
          ]);

        setAnalytics(
          analyticsData || {
            daily: [],
          }
        );

        setLowStock(lowStockData || []);
        setReorder(reorderData || []);
      } catch (error) {
        console.error(
          "Reports dashboard error:",
          error
        );
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, []);

  /* =========================
     TOTAL REVENUE
  ========================= */

  const totalRevenue =
    analytics?.daily?.reduce(
      (acc, sale) => acc + Number(sale.total || 0),
      0
    ) || 0;

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      {/* =========================
          PAGE HEADER
      ========================= */}

      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-2">
            <BarChart3 className="w-7 h-7" />
            Reports Dashboard
          </h1>

          <p className="text-gray-500 mt-1">
            Daily sales analytics, inventory alerts and
            PDF reporting
          </p>
        </div>

        <button
          onClick={downloadReport}
          className="
            flex items-center justify-center gap-2
            bg-black text-white
            px-5 py-3
            rounded-xl
            hover:opacity-90
            transition
            shadow-sm
            cursor-pointer
          "
        >
          <Download className="w-4 h-4" />
          Download Daily PDF Report
        </button>
      </div>

      {/* =========================
          LOADING
      ========================= */}

      {loading ? (
        <div className="bg-white border rounded-2xl p-10 text-center shadow-sm">
          <p className="text-gray-500">
            Loading dashboard...
          </p>
        </div>
      ) : (
        <>
          {/* =========================
              SUMMARY CARDS
          ========================= */}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {/* TOTAL SALES */}

            <div className="bg-white border rounded-2xl p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm">
                    Total Sales
                  </p>

                  <h2 className="text-3xl font-bold mt-1">
                    {analytics?.daily?.length || 0}
                  </h2>
                </div>

                <CalendarDays className="w-8 h-8 text-gray-400" />
              </div>
            </div>

            {/* TOTAL REVENUE */}

            <div className="bg-white border rounded-2xl p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm">
                    Total Revenue
                  </p>

                  <h2 className="text-3xl font-bold mt-1">
                    {totalRevenue.toFixed(2)} €
                  </h2>
                </div>

                <Euro className="w-8 h-8 text-gray-400" />
              </div>
            </div>

            {/* LOW STOCK */}

            <div className="bg-white border rounded-2xl p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm">
                    Low Stock Products
                  </p>

                  <h2 className="text-3xl font-bold mt-1">
                    {lowStock.length}
                  </h2>
                </div>

                <TrendingDown className="w-8 h-8 text-red-500" />
              </div>
            </div>
          </div>

          {/* =========================
              MAIN GRID
          ========================= */}

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            {/* =========================
                LOW STOCK SECTION
            ========================= */}

            <div className="bg-white border rounded-2xl p-5 shadow-sm">
              <h3 className="font-bold text-lg flex items-center gap-2 text-red-600 mb-4">
                <TrendingDown className="w-5 h-5" />
                Low Stock Alerts
              </h3>

              <div className="space-y-3">
                {lowStock.length === 0 ? (
                  <p className="text-gray-500 text-sm">
                    No low stock products
                  </p>
                ) : (
                  lowStock.map((product) => (
                    <div
                      key={product.id}
                      className="
                        border
                        rounded-xl
                        p-4
                        bg-red-50
                      "
                    >
                      <h4 className="font-semibold">
                        {product.name}
                      </h4>

                      <p className="text-sm text-gray-600 mt-1">
                        Current Stock:{" "}
                        <span className="font-medium">
                          {product.stock}
                        </span>
                      </p>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* =========================
                REORDER SECTION
            ========================= */}

            <div className="bg-white border rounded-2xl p-5 shadow-sm">
              <h3 className="font-bold text-lg flex items-center gap-2 text-blue-600 mb-4">
                <Package className="w-5 h-5" />
                Reorder Suggestions
              </h3>

              <div className="space-y-3">
                {reorder.length === 0 ? (
                  <p className="text-gray-500 text-sm">
                    No reorder suggestions
                  </p>
                ) : (
                  reorder.map((product) => (
                    <div
                      key={product.product_id}
                      className="border rounded-xl p-4"
                    >
                      <h4 className="font-semibold">
                        {product.name}
                      </h4>

                      <p className="text-sm text-gray-600 mt-1">
                        Stock: {product.stock}
                      </p>

                      <p className="text-sm text-green-600 font-medium mt-1">
                        Suggested Order:{" "}
                        {product.suggested_order}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* =========================
                DAILY SALES
            ========================= */}

            <div className="bg-white border rounded-2xl p-5 shadow-sm">
              <h3 className="font-bold text-lg mb-4">
                Daily Sales Activity
              </h3>

              <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
                {analytics?.daily?.length === 0 ? (
                  <p className="text-gray-500 text-sm">
                    No sales found today
                  </p>
                ) : (
                  analytics.daily.map((sale, index) => (
                    <div
                      key={index}
                      className="
                        border
                        rounded-xl
                        p-4
                        hover:bg-gray-50
                        transition
                      "
                    >
                      {/* HEADER */}

                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <h4 className="font-semibold">
                            Invoice #
                            {sale.invoice_number ||
                              index + 1}
                          </h4>

                          <p className="text-sm text-gray-500 mt-1">
                            {formatDateTime(
                              sale.date ||
                                sale.sale_date
                            )}
                          </p>
                        </div>

                        <div className="text-right">
                          <p className="font-bold">
                            {Number(
                              sale.total || 0
                            ).toFixed(2)}{" "}
                            €
                          </p>

                          <p className="text-xs text-gray-500">
                            {sale.payment_method}
                          </p>
                        </div>
                      </div>

                      {/* PRODUCTS */}

                      {sale.items &&
                        sale.items.length > 0 && (
                          <div className="mt-4 space-y-2">
                            {sale.items.map(
                              (item, idx) => (
                                <div
                                  key={idx}
                                  className="
                                    flex
                                    justify-between
                                    text-sm
                                    border-t
                                    pt-2
                                  "
                                >
                                  <div>
                                    <p className="font-medium">
                                      {item.product
                                        ?.name ||
                                        "Unknown Product"}
                                    </p>

                                    <p className="text-gray-500">
                                      Qty:{" "}
                                      {item.quantity}
                                    </p>
                                  </div>

                                  <div className="text-right">
                                    <p>
                                      {Number(
                                        item.subtotal || 0
                                      ).toFixed(2)}{" "}
                                      €
                                    </p>
                                  </div>
                                </div>
                              )
                            )}
                          </div>
                        )}
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}