import { useEffect, useRef, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";
import { useAppContext } from "../../context/AppContext";
import {
  Plus,
  Minus,
  Trash2,
  ShoppingCart,
  CreditCard,
  Receipt,
  Download,
  Printer,
} from "lucide-react";
import toast from "react-hot-toast";

/* =========================
   PDF IMPORT
========================= */
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import SplitPaymentModal from "../../components/payment/SplitPaymentModal";

export default function Cashier() {
  const { getProductByBarcode, createSale } = useAppContext();

  const [cart, setCart] = useState([]);
  const [total, setTotal] = useState(0);
  const [scanning, setScanning] = useState(false);

  
  /* =========================
  🆕 PAYMENT PAGE STATE
  ========================= */
  const [paymentData, setPaymentData] = useState(null);
  const [showPayment, setShowPayment] = useState(false);

  const scanLock = useRef(false);
  const scannerRef = useRef(null);

  /* =========================
     🧠 INVOICE NUMBER SYSTEM
  ========================= */
  const [invoiceNumber, setInvoiceNumber] = useState("POS-0001");

  useEffect(() => {
    const last = localStorage.getItem("invoice_number");

    if (!last) {
      localStorage.setItem("invoice_number", "1");
      setInvoiceNumber("POS-0001");
    } else {
      const next = parseInt(last) + 1;
      setInvoiceNumber(`POS-${String(next).padStart(4, "0")}`);
    }
  }, []);

  const generateNextInvoice = () => {
    const last = parseInt(
      localStorage.getItem("invoice_number") || "1"
    );

    const next = last + 1;

    localStorage.setItem(
      "invoice_number",
      next.toString()
    );

    return `POS-${String(next).padStart(4, "0")}`;
  };

  /* =========================
     🆕 DATE + TIME
  ========================= */
  const currentDate = new Date().toLocaleDateString();

  const currentTime = new Date().toLocaleTimeString();

  /* =========================
     SOUND + VOICE
  ========================= */
  const speak = (text) => {
    const msg = new SpeechSynthesisUtterance(text);
    msg.lang = "en-US";
    window.speechSynthesis.speak(msg);
  };

  const playBeep = () => {
    const audio = new Audio(
      "https://www.soundjay.com/buttons/sounds/button-16.mp3"
    );

    audio.play();
  };

  /* =========================
     CALCULATE TOTAL
  ========================= */
  useEffect(() => {
    const sum = cart.reduce(
      (acc, item) =>
        acc + item.price * item.quantity,
      0
    );

    setTotal(sum);
  }, [cart]);

  /* =========================
     ADD TO CART
  ========================= */
  const addToCart = (product) => {
    setCart((prev) => {
      const exists = prev.find(
        (p) => p.id === product.id
      );

      if (exists) {
        return prev.map((p) =>
          p.id === product.id
            ? {
                ...p,
                quantity: p.quantity + 1,
              }
            : p
        );
      }

      return [
        ...prev,
        {
          ...product,
          quantity: 1,
        },
      ];
    });

    playBeep();
    speak(`${product.name} added`);
    toast.success(`${product.name} added`);
  };

  /* =========================
     🆕 INCREASE QUANTITY
  ========================= */
  const increaseQty = (id) => {
    setCart((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              quantity: item.quantity + 1,
            }
          : item
      )
    );
  };

  /* =========================
     🆕 DECREASE QUANTITY
  ========================= */
  const decreaseQty = (id) => {
    setCart((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              quantity: Math.max(
                1,
                item.quantity - 1
              ),
            }
          : item
      )
    );
  };

  /* =========================
     🆕 DELETE PRODUCT
  ========================= */
  const deleteItem = (id) => {
    setCart((prev) =>
      prev.filter((item) => item.id !== id)
    );

    toast.success("Product removed");
  };

  /* =========================
     SCANNER
  ========================= */
  const startScanner = async () => {
    try {
      if (scannerRef.current) {
        await stopScanner();
      }

      setScanning(true);

      setTimeout(async () => {
        const element =
          document.getElementById("reader");

        if (!element) {
          toast.error("Scanner not ready");
          setScanning(false);
          return;
        }

        const html5QrCode = new Html5Qrcode(
          "reader"
        );

        scannerRef.current = html5QrCode;

        await html5QrCode.start(
          { facingMode: "environment" },

          {
            fps: 10,
            qrbox: {
              width: 280,
              height: 180,
            },
          },

          async (decodedText) => {
            const code = decodedText.trim();

            if (scanLock.current) return;

            scanLock.current = true;

            try {
              playBeep();

              const product =
                await getProductByBarcode(code);

              if (
                !product ||
                product.stock <= 0
              )
                return;

              addToCart(product);
            } finally {
              setTimeout(() => {
                scanLock.current = false;
              }, 1200);
            }
          },

          () => {}
        );
      }, 400);
    } catch (error) {
      toast.error("Camera access denied");
      setScanning(false);
    }
  };

  /* =========================
     STOP SCANNER
  ========================= */
  const stopScanner = async () => {
    if (scannerRef.current) {
      await scannerRef.current.stop();

      await scannerRef.current.clear();

      scannerRef.current = null;
    }

    setScanning(false);
  };

  /* =========================
     🆕 CHECKOUT REDIRECT
  ========================= */
  const checkout = () => {
    if (cart.length === 0) {
      toast.error("Cart is empty");
      return;
    }

    setShowPayment(true);
  };

  /* =========================
     🆕 CASH PAYMENT
  ========================= */
  const payCash = async () => {
    const items = cart.map((p) => ({
      product_id: p.id,
      name: p.name,
      price: p.price,
      quantity: p.quantity,
    }));

    const invoice = generateNextInvoice();

    /* =========================
       SAVE SALE DATABASE
    ========================= */
    await createSale({
      user_id: 1,
      payment_method: "CASH",
      invoice_number: invoice,
      total,
      items,
    });

    /* =========================
       🆕 AUTO REDUCE STOCK
    ========================= */
    // backend should reduce stock automatically

    // speak("Cash payment successful");

    playBeep();

    toast.success("Payment completed");

    await downloadPDF(invoice);

    printThermal(invoice);

    setCart([]);

    setShowPayment(false);
  };



  const handlePayment = async ({ cash, card }) => {
  try {
    const items = cart.map((p) => ({
      product_id: p.id,
      quantity: p.quantity,
    }));

    await createSale({
      user_id: 1,
      payment_method: card > 0 ? "CARD+CASH" : "CASH",
      payment_split: {
        cash,
        card,
      },
      items,
    });

    speak("Payment completed successfully");
    toast.success("Payment successful");

    setCart([]);
    setShowPayment(false);
  } catch (error) {
    toast.error("Payment failed");
  }
};


  /* =========================
     🧾 PDF DOWNLOAD
  ========================= */
  const downloadPDF = async (
    invoice = invoiceNumber
  ) => {
    const pdf = new jsPDF("p", "mm", "a4");

    pdf.setFontSize(20);

    pdf.text("MUNIDM GROCERY STORE", 20, 20);

    pdf.setFontSize(12);

    pdf.text(
      `Invoice Number: ${invoice}`,
      20,
      35
    );

    pdf.text(`Date: ${currentDate}`, 20, 45);

    pdf.text(`Time: ${currentTime}`, 20, 55);

    pdf.text(`Payment: CASH`, 20, 65);

    let y = 80;

    cart.forEach((item) => {
      pdf.text(
        `${item.name} x${item.quantity}`,
        20,
        y
      );

      pdf.text(
        `${(
          item.price * item.quantity
        ).toFixed(2)} €`,
        150,
        y
      );

      y += 10;
    });

    pdf.setFontSize(16);

    pdf.text(
      `TOTAL: ${total.toFixed(2)} €`,
      20,
      y + 20
    );

    pdf.save(`${invoice}.pdf`);
  };

  /* =========================
     🖨️ THERMAL RECEIPT
  ========================= */
  const printThermal = (
    invoice = invoiceNumber
  ) => {
    const win = window.open(
      "",
      "PRINT",
      "width=400,height=700"
    );

    win.document.write(`
      <html>
      <head>
        <title>Receipt</title>

        <style>
          body{
            width:80mm;
            font-family:Arial;
            padding:10px;
          }

          .center{
            text-align:center;
          }

          .row{
            display:flex;
            justify-content:space-between;
            margin-bottom:8px;
            font-size:14px;
          }

          hr{
            border-top:1px dashed #000;
          }

          h2,h3,p{
            margin:4px 0;
          }
        </style>
      </head>

      <body>

        <div class="center">
          <h2>MUNIDM GROCERY</h2>

          <p>${invoice}</p>

          <p>${currentDate}</p>

          <p>${currentTime}</p>

          <p>Payment: CASH</p>
        </div>

        <hr />

        ${cart
          .map(
            (item) => `
          <div class="row">
            <span>
              ${item.name} x${item.quantity}
            </span>

            <span>
              ${(
                item.price * item.quantity
              ).toFixed(2)} €
            </span>
          </div>
        `
          )
          .join("")}

        <hr />

        <div class="row">
          <strong>TOTAL</strong>

          <strong>
            ${total.toFixed(2)} €
          </strong>
        </div>

        <hr />

        <div class="center">
          <p>Thank you for shopping</p>
        </div>

      </body>
      </html>
    `);

    win.document.close();

    win.print();
  };

  /* =========================
     UI
  ========================= */
  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-3 bg-gray-50">

      {/* =========================
          LEFT SIDE
      ========================= */}
      <div className="lg:col-span-2 p-4 space-y-4">

        <div className="flex flex-wrap gap-3">

          <button
            onClick={startScanner}
            className="bg-indigo-600 hover:bg-indigo-700 transition text-white px-4 py-3 rounded-xl font-bold w-full sm:w-auto"
          >
            Start Scanner
          </button>

          <button
            onClick={() =>
              downloadPDF(invoiceNumber)
            }
            className="bg-black text-white px-4 py-3 rounded-xl font-bold flex items-center justify-center gap-2 w-full sm:w-auto"
          >
            <Download size={18} />
            Download PDF
          </button>

          <button
            onClick={() =>
              printThermal(invoiceNumber)
            }
            className="bg-gray-800 text-white px-4 py-3 rounded-xl font-bold flex items-center justify-center gap-2 w-full sm:w-auto"
          >
            <Printer size={18} />
            Print Receipt
          </button>

        </div>

        {scanning && (
          <div
            id="reader"
            className="w-full rounded-2xl overflow-hidden bg-white shadow-lg p-2"
          />
        )}
      </div>

      {/* =========================
          RIGHT SIDE
      ========================= */}
      <div className="bg-white p-4 shadow-lg flex flex-col">

        <h2 className="text-2xl font-black flex items-center gap-2">
          <ShoppingCart />
          Cart
        </h2>

        {/* =========================
            PRODUCTS
        ========================= */}
        <div className="flex-1 overflow-y-auto mt-4 space-y-3">

          {cart.map((item) => (
            <div
              key={item.id}
              className="border p-4 rounded-2xl flex flex-col sm:flex-row justify-between gap-4 bg-gray-50"
            >

              {/* PRODUCT INFO */}
              <div>
                <p className="font-black text-lg">
                  {item.name}
                </p>

                <p className="text-gray-500">
                  {item.price} €
                </p>

                <p className="font-bold text-green-600">
                  Total:{" "}
                  {(
                    item.price * item.quantity
                  ).toFixed(2)}{" "}
                  €
                </p>
              </div>

              {/* =========================
                  BUTTONS ADDED
              ========================= */}
              <div className="flex items-center gap-2 flex-wrap">

                {/* INCREASE */}
                <button
                  onClick={() =>
                    increaseQty(item.id)
                  }
                  className="bg-green-600 hover:bg-green-700 transition text-white p-2 rounded-xl"
                >
                  <Plus size={18} />
                </button>

                {/* QUANTITY */}
                <span className="font-black text-lg min-w-[30px] text-center">
                  {item.quantity}
                </span>

                {/* DECREASE */}
                <button
                  onClick={() =>
                    decreaseQty(item.id)
                  }
                  className="bg-yellow-500 hover:bg-yellow-600 transition text-white p-2 rounded-xl"
                >
                  <Minus size={18} />
                </button>

                {/* DELETE */}
                <button
                  onClick={() =>
                    deleteItem(item.id)
                  }
                  className="bg-red-600 hover:bg-red-700 transition text-white p-2 rounded-xl"
                >
                  <Trash2 size={18} />
                </button>

              </div>
            </div>
          ))}
        </div>

        {/* =========================
            TOTAL
        ========================= */}
        <div className="border-t pt-4 mt-4">

          <h3 className="text-3xl font-black">
            Total: {total.toFixed(2)} €
          </h3>

          {/* =========================
              CHECKOUT
          ========================= */}
          {!showPayment ? (
            <button
              onClick={checkout}
              className="w-full mt-4 bg-green-600 hover:bg-green-700 transition text-white py-4 rounded-2xl font-black text-lg"
            >
              Checkout
            </button>
          ) : (
            <div className="space-y-3 mt-4">

              <div className="bg-gray-100 rounded-2xl p-4 text-center">

                <h3 className="font-black text-xl flex items-center justify-center gap-2">
                  <CreditCard />
                  Payment Method
                </h3>

                <p className="text-gray-500 mt-2">
                  Invoice: {invoiceNumber}
                </p>

                <p className="font-bold">
                  Amount: {total.toFixed(2)} €
                </p>

              </div>

              {/* CASH PAYMENT */}
              <button
                onClick={payCash}
                className="w-full bg-black hover:bg-gray-900 transition text-white py-4 rounded-2xl font-black text-lg flex items-center justify-center gap-2"
              >
                <Receipt />
               {showPayment && (
  <SplitPaymentModal
    total={total}
    onClose={() => setShowPayment(false)}
    onPay={handlePayment}
  />
)}
              </button>

            </div>
          )}
        </div>
      </div>
    </div>
  );
}