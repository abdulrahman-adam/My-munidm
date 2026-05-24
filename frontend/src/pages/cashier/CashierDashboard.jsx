import { useEffect, useRef, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";
import { useAppContext } from "../../context/AppContext";
import { Plus, Minus, Trash2, ShoppingCart } from "lucide-react";
import toast from "react-hot-toast";

/* =========================
   PDF IMPORT (ADDED)
========================= */
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

export default function Cashier() {
  const { getProductByBarcode, createSale } = useAppContext();

  const [cart, setCart] = useState([]);
  const [total, setTotal] = useState(0);
  const [scanning, setScanning] = useState(false);

  const scanLock = useRef(false);
  const scannerRef = useRef(null);

  /* =========================
     🧠 INVOICE NUMBER SYSTEM (ADDED)
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
    const last = parseInt(localStorage.getItem("invoice_number") || "1");
    const next = last + 1;
    localStorage.setItem("invoice_number", next.toString());
    return `POS-${String(next).padStart(4, "0")}`;
  };

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

  useEffect(() => {
    const sum = cart.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0
    );
    setTotal(sum);
  }, [cart]);

  /* =========================
     ADD TO CART
  ========================= */
  const addToCart = (product) => {
    setCart((prev) => {
      const exists = prev.find((p) => p.id === product.id);

      if (exists) {
        return prev.map((p) =>
          p.id === product.id
            ? { ...p, quantity: p.quantity + 1 }
            : p
        );
      }

      return [...prev, { ...product, quantity: 1 }];
    });

    playBeep();
    speak(`${product.name} added`);
    toast.success(`${product.name} added`);
  };

  const updateQty = (id, qty) => {
    setCart((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, quantity: Math.max(1, qty) }
          : item
      )
    );
  };

  const removeItem = (id) => {
    setCart((prev) => prev.filter((p) => p.id !== id));
  };

  /* =========================
     SCANNER (UNCHANGED)
  ========================= */
  const startScanner = async () => {
    try {
      if (scannerRef.current) {
        await stopScanner();
      }

      setScanning(true);

      setTimeout(async () => {
        const element = document.getElementById("reader");

        if (!element) {
          toast.error("Scanner not ready");
          setScanning(false);
          return;
        }

        const html5QrCode = new Html5Qrcode("reader");
        scannerRef.current = html5QrCode;

        await html5QrCode.start(
          { facingMode: "environment" },
          { fps: 10, qrbox: { width: 280, height: 180 } },

          async (decodedText) => {
            const code = decodedText.trim();

            if (scanLock.current) return;
            scanLock.current = true;

            try {
              playBeep();

              const product = await getProductByBarcode(code);
              if (!product || product.stock <= 0) return;

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

  const stopScanner = async () => {
    if (scannerRef.current) {
      await scannerRef.current.stop();
      await scannerRef.current.clear();
      scannerRef.current = null;
    }
    setScanning(false);
  };

  /* =========================
     🧾 CREATE SALE + SAVE INVOICE (ENHANCED)
  ========================= */
  const checkout = async () => {
    if (cart.length === 0) return;

    const items = cart.map((p) => ({
      product_id: p.id,
      name: p.name,
      price: p.price,
      quantity: p.quantity,
    }));

    const invoice = generateNextInvoice();

    await createSale({
      user_id: 1,
      payment_method: "CASH",
      invoice_number: invoice,
      total,
      items,
    });

    speak("Sale completed successfully");
    playBeep();

    setCart([]);
  };

  /* =========================
     📄 REAL PDF DOWNLOAD (ADDED)
  ========================= */
  const downloadPDF = async () => {
    const pdf = new jsPDF("p", "mm", "a4");

    pdf.setFontSize(16);
    pdf.text(`Invoice: ${invoiceNumber}`, 10, 10);

    let y = 20;

    cart.forEach((item) => {
      pdf.text(
        `${item.name} x${item.quantity} = ${item.price * item.quantity} €`,
        10,
        y
      );
      y += 10;
    });

    pdf.text(`Total: ${total} €`, 10, y + 10);

    pdf.save(`${invoiceNumber}.pdf`);
  };

  /* =========================
     🖨️ THERMAL RECEIPT (80MM)
  ========================= */
  const printThermal = () => {
    const win = window.open("", "PRINT", "width=300,height=600");

    win.document.write(`
      <html>
      <head>
        <style>
          body { font-family: monospace; width: 80mm; padding: 10px; }
          .center { text-align:center; }
          .row { display:flex; justify-content:space-between; }
        </style>
      </head>
      <body>
        <div class="center">
          <h3>POS RECEIPT</h3>
          <p>${invoiceNumber}</p>
        </div>

        ${cart
          .map(
            (item) => `
          <div class="row">
            <span>${item.name} x${item.quantity}</span>
            <span>${item.price * item.quantity}€</span>
          </div>
        `
          )
          .join("")}

        <hr />
        <div class="row">
          <strong>Total</strong>
          <strong>${total}€</strong>
        </div>
      </body>
      </html>
    `);

    win.print();
  };

  /* =========================
     UI (ONLY ADD BUTTONS)
  ========================= */
  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-3 bg-gray-50">

      {/* LEFT */}
      <div className="lg:col-span-2 p-4 space-y-4">

        <button onClick={startScanner} className="bg-indigo-600 text-white px-4 py-2 rounded-xl">
          Start Scanner
        </button>

        {/* 🆕 PDF BUTTON */}
        <button onClick={downloadPDF} className="bg-black text-white px-4 py-2 rounded-xl ml-2">
          Download Invoice PDF
        </button>

        {/* 🆕 THERMAL BUTTON */}
        <button onClick={printThermal} className="bg-gray-800 text-white px-4 py-2 rounded-xl ml-2">
          Print Receipt
        </button>

        {scanning && <div id="reader" className="w-full rounded-xl overflow-hidden" />}
      </div>

      {/* RIGHT (UNCHANGED) */}
      <div className="bg-white p-4 shadow-lg flex flex-col">
        <h2 className="text-xl font-black flex items-center gap-2">
          <ShoppingCart /> Cart
        </h2>

        <div className="flex-1 overflow-y-auto mt-4 space-y-3">
          {cart.map((item) => (
            <div key={item.id} className="border p-3 rounded-xl flex justify-between items-center">
              <div>
                <p className="font-bold">{item.name}</p>
                <p className="text-sm text-gray-500">{item.price} €</p>
              </div>
            </div>
          ))}
        </div>

        <div className="border-t pt-4">
          <h3 className="text-xl font-black">Total: {total.toFixed(2)} €</h3>

          <button onClick={checkout} className="w-full mt-3 bg-green-600 text-white py-3 rounded-xl font-bold">
            Checkout
          </button>
        </div>
      </div>
    </div>
  );
}