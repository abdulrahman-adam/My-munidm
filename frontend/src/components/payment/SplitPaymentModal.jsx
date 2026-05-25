import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function SplitPaymentModal({
  total,
  onClose,
  onPay,
}) {
  const [cash, setCash] = useState(0);
  const [card, setCard] = useState(0);

  /* =========================
     AUTO BALANCE CALC
  ========================= */
  useEffect(() => {
    setCard(Math.max(total - cash, 0));
  }, [cash, total]);

  const handlePay = () => {
    const sum = Number(cash) + Number(card);

    if (sum !== total) {
      toast.error("Payment must equal total");
      return;
    }

    onPay({
      cash: Number(cash),
      card: Number(card),
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">

      <div className="bg-white w-full max-w-md p-6 rounded-xl shadow-xl">

        <h2 className="text-xl font-bold mb-4">
          💳 Split Payment
        </h2>

        {/* TOTAL */}
        <div className="mb-4 text-gray-600">
          Total: <b>{total.toFixed(2)} €</b>
        </div>

        {/* CASH */}
        <label className="text-sm font-medium">Cash (€)</label>
        <input
          type="number"
          value={cash}
          onChange={(e) => setCash(Number(e.target.value))}
          className="w-full border p-2 rounded mb-3"
        />

        {/* CARD */}
        <label className="text-sm font-medium">Card (Stripe €)</label>
        <input
          type="number"
          value={card}
          readOnly
          className="w-full border p-2 rounded mb-4 bg-gray-100"
        />

        {/* BUTTONS */}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 bg-gray-200 py-2 rounded"
          >
            Cancel
          </button>

          <button
            onClick={handlePay}
            className="flex-1 bg-green-600 text-white py-2 rounded"
          >
            Pay
          </button>
        </div>

      </div>
    </div>
  );
}