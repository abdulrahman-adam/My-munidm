import { useEffect } from "react";
import { useAppContext } from "../../context/AppContext";
import { Trash2, Eye } from "lucide-react";

export default function SalesManager() {
  const {
    sales,
    getAllSales,
    deleteSale,
    updateSaleStatus,
  } = useAppContext();

  useEffect(() => {
    getAllSales();
  }, []);

  return (
    <div className="p-4 md:p-8">

      <h1 className="text-2xl font-black mb-6">
        Sales Management
      </h1>

      <div className="grid gap-4">
        {sales.map((sale) => (
          <div
            key={sale.id}
            className="bg-white border rounded-xl p-4 flex flex-col md:flex-row justify-between gap-4"
          >
            <div>
              <p className="font-bold">
                Invoice: {sale.invoice_number}
              </p>

              <p>Total: {sale.total} €</p>
              <p>Status: {sale.status}</p>
            </div>

            <div className="flex gap-2 items-center">
              <button
                onClick={() =>
                  updateSaleStatus(sale.id, "COMPLETED")
                }
                className="bg-green-600 text-white px-3 py-2 rounded-lg"
              >
                Complete
              </button>

              <button
                onClick={() =>
                  deleteSale(sale.id)
                }
                className="bg-red-600 text-white px-3 py-2 rounded-lg"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}