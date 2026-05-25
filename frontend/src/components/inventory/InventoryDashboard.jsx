import { useEffect, useState } from "react";
import {
  Package,
  Plus,
  Minus,
  RefreshCw,
  FileText,
  Search,
} from "lucide-react";
import { useAppContext } from "../../context/AppContext";
import toast from "react-hot-toast";

export default function InventoryDashboard() {
  const {
    addStock,
    removeStock,
    adjustStock,
    getInventoryLogs,
    getProductHistory,
  } = useAppContext();

  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);

  const [selectedProduct, setSelectedProduct] = useState(null);
  const [history, setHistory] = useState([]);

  const [form, setForm] = useState({
    product_id: "",
    quantity: "",
    reason: "",
  });

  /* =========================
     LOAD LOGS
  ========================= */
  const loadLogs = async () => {
    setLoading(true);
    const data = await getInventoryLogs();
    setLogs(data || []);
    setLoading(false);
  };

  useEffect(() => {
    loadLogs();
  }, []);

  /* =========================
     PRODUCT HISTORY
  ========================= */
  const loadHistory = async (id) => {
    const data = await getProductHistory(id);
    setHistory(data || []);
    setSelectedProduct(id);
  };

  /* =========================
     ACTION HANDLER
  ========================= */
  const handleAction = async (type) => {
    if (!form.product_id || !form.quantity) {
      return toast.error("Fill all fields");
    }

    const payload = {
      product_id: form.product_id,
      quantity: Number(form.quantity),
      reason: form.reason,
      user_id: 1,
    };

    if (type === "IN") await addStock(payload);
    if (type === "OUT") await removeStock(payload);

    setForm({ product_id: "", quantity: "", reason: "" });
    loadLogs();
  };

  return (
    <div className="p-4 md:p-6 space-y-6">

      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Package className="text-indigo-600" />
          Inventory Control Center
        </h2>

        <button
          onClick={loadLogs}
          className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200"
        >
          <RefreshCw size={16} />
          Refresh
        </button>
      </div>

      {/* ACTION PANEL */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-white p-4 rounded-xl border">

        <input
          placeholder="Product ID"
          value={form.product_id}
          onChange={(e) =>
            setForm({ ...form, product_id: e.target.value })
          }
          className="border p-2 rounded-lg"
        />

        <input
          placeholder="Quantity"
          type="number"
          value={form.quantity}
          onChange={(e) =>
            setForm({ ...form, quantity: e.target.value })
          }
          className="border p-2 rounded-lg"
        />

        <input
          placeholder="Reason"
          value={form.reason}
          onChange={(e) =>
            setForm({ ...form, reason: e.target.value })
          }
          className="border p-2 rounded-lg"
        />
      </div>

      {/* ACTION BUTTONS */}
      <div className="flex flex-wrap gap-3">
        <button
          onClick={() => handleAction("IN")}
          className="bg-green-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"
        >
          <Plus size={16} /> Add Stock
        </button>

        <button
          onClick={() => handleAction("OUT")}
          className="bg-red-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"
        >
          <Minus size={16} /> Remove Stock
        </button>
      </div>

      {/* LOGS TABLE */}
      <div className="bg-white rounded-xl border overflow-hidden">
        <div className="p-4 border-b font-bold">Inventory Logs</div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="p-3 text-left">Product</th>
                <th className="p-3 text-left">Type</th>
                <th className="p-3 text-left">Qty</th>
                <th className="p-3 text-left">Reason</th>
                <th className="p-3 text-left">Action</th>
              </tr>
            </thead>

            <tbody>
              {logs.map((log, i) => (
                <tr key={i} className="border-t">
                  <td className="p-3">{log.product?.name}</td>
                  <td className="p-3">{log.type}</td>
                  <td className="p-3">{log.quantity}</td>
                  <td className="p-3">{log.reason}</td>
                  <td className="p-3">
                    <button
                      onClick={() => loadHistory(log.product_id)}
                      className="text-blue-600 flex items-center gap-1"
                    >
                      <Search size={14} /> History
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* PRODUCT HISTORY */}
      {selectedProduct && (
        <div className="bg-white p-4 border rounded-xl">
          <h3 className="font-bold mb-2 flex items-center gap-2">
            <FileText /> Product History
          </h3>

          <div className="space-y-2">
            {history.map((h, i) => (
              <div
                key={i}
                className="flex justify-between text-sm border-b py-1"
              >
                <span>{h.type}</span>
                <span>{h.quantity}</span>
                <span>{h.reason}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}