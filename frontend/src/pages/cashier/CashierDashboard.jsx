

import { useEffect, useRef, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";
import { useAppContext } from "../../context/AppContext";
import QRCode from "qrcode";


import {
  Plus,
  Minus,
  Trash2,
  ShoppingCart,
  CreditCard,
  Receipt,
  Download,
  Printer,
  Barcode,
  Search,
  Mic,
  MicOff,
} from "lucide-react";
import toast from "react-hot-toast";

import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import SplitPaymentModal from "../../components/payment/SplitPaymentModal";

export default function Cashier() {
  const { getProductByBarcode, createSale } = useAppContext();

  const [cart, setCart] = useState([]);
  const [total, setTotal] = useState(0);
  const [scanning, setScanning] = useState(false);
  const [showPayment, setShowPayment] = useState(false);

  const [voiceActive, setVoiceActive] = useState(false);
  const recognitionRef = useRef(null);

  const [barcodeInput, setBarcodeInput] = useState("");

  const scanLock = useRef(false);
  const scannerRef = useRef(null);

  const [invoiceNumber, setInvoiceNumber] = useState("POS-0001");

  const [paymentDone, setPaymentDone] = useState(false);

  /* =========================
     🧾 UX: SCROLL TO RECEIPT AREA
  ========================= */
  const receiptRef = useRef(null);

  const scrollToReceipt = () => {
    setTimeout(() => {
      receiptRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }, 300);
  };

  /* =========================
     SPEAK
  ========================= */
  const speak = (text) => {
    const msg = new SpeechSynthesisUtterance(text);
    msg.lang = "en-US";
    window.speechSynthesis.speak(msg);
  };

  /* =========================
     INVOICE SYSTEM
  ========================= */
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
     SAFE TOTAL
  ========================= */
  useEffect(() => {
    const sum = cart.reduce(
      (acc, item) =>
        acc + Number(item.price) * Number(item.quantity),
      0
    );

    setTotal(Number(sum.toFixed(2)));
  }, [cart]);

  /* =========================
     CART LOGIC
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

    speak(`${product.name} added`);
    toast.success(`${product.name} added`);
  };

  const increaseQty = (id) => {
    setCart((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      )
    );
  };

  const decreaseQty = (id) => {
    setCart((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, quantity: Math.max(1, item.quantity - 1) }
          : item
      )
    );
  };

  const deleteItem = (id) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
    toast.success("Product removed");
  };

  /* =========================
     MANUAL BARCODE
  ========================= */
  const handleManualAdd = async () => {
    if (!barcodeInput) return;

    const product = await getProductByBarcode(barcodeInput);

    if (!product || product?.success === false) {
      speak("Product not found");
      // toast.error("Product not found");
      return;
    }

    addToCart(product);
    setBarcodeInput("");
  };

  /* =========================
     📷 FIXED CAMERA (NO ERROR)
  ========================= */
  const startScanner = async () => {
    try {
      // SAFE CAMERA CHECK
      if (!navigator.mediaDevices) {
        toast.error("Camera not supported");
        return;
      }

      if (scannerRef.current) {
        await stopScanner();
      }

      setScanning(true);
      speak("Scanner started");

      const devices = await Html5Qrcode.getCameras();
      if (!devices || devices.length === 0) {
        toast.error("No camera found");
        setScanning(false);
        return;
      }

      setTimeout(async () => {
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
              const product = await getProductByBarcode(code);

              if (!product || product?.success === false) {
                speak("Product not found");
                return;
              }

              addToCart(product);
            } finally {
              setTimeout(() => {
                scanLock.current = false;
              }, 1200);
            }
          }
        );
      }, 400);
    } catch (err) {
      console.error(err);
      toast.error("Camera permission denied or in use");
      setScanning(false);
    }
  };

  const stopScanner = async () => {
    try {
      if (scannerRef.current) {
        await scannerRef.current.stop();
        await scannerRef.current.clear();
        scannerRef.current = null;
      }
    } catch (err) {
      console.warn("Scanner stop error", err);
    }

    setScanning(false);
  };




const downloadPDF = async (invoice) => {
  const doc = new jsPDF();

  // HEADER
  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.text("MY SUPERMARKET", 70, 10);

  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text("123 Main Street - Paris", 65, 16);
  doc.text("Tel: 01 23 45 67 89", 70, 21);

  doc.line(10, 25, 200, 25);

  // INVOICE INFO
  doc.text(`Invoice: ${invoice}`, 10, 32);
  doc.text(`Date: ${new Date().toLocaleString()}`, 10, 38);

  doc.line(10, 42, 200, 42);

  // TABLE HEADER
  doc.setFont("helvetica", "bold");
  doc.text("ITEM", 10, 50);
  doc.text("QTY", 90, 50);
  doc.text("PRICE", 120, 50);
  doc.text("TOTAL", 160, 50);

  doc.setFont("helvetica", "normal");

  let y = 60;
  let subtotal = 0;

  cart.forEach((item) => {
    const totalLine = item.price * item.quantity;
    subtotal += totalLine;

    doc.text(item.name.substring(0, 20), 10, y);
    doc.text(String(item.quantity), 95, y);
    doc.text(`${item.price} €`, 120, y);
    doc.text(`${totalLine.toFixed(2)} €`, 160, y);

    y += 8;
  });

  doc.line(10, y, 200, y);
  y += 10;

  // TOTAL
  doc.setFont("helvetica", "bold");
  doc.text(`TOTAL: ${subtotal.toFixed(2)} €`, 140, y);

  // QR CODE
  const qrData = `${window.location.origin}/invoice/${invoice}`;

  const qr = await QRCode.toDataURL(qrData);

  doc.addImage(qr, "PNG", 10, y + 10, 40, 40);

  doc.save(`${invoice}.pdf`);
};


const printThermal = (invoice) => {
  let content = `
  <div style="font-family: monospace; width: 280px;">
    <h3 style="text-align:center;">MY SUPERMARKET</h3>
    <p style="text-align:center;">Invoice: ${invoice}</p>
    <hr/>
  `;

  let total = 0;

  cart.forEach((item) => {
    const line = item.price * item.quantity;
    total += line;

    content += `
      <div style="display:flex; justify-content:space-between;">
        <span>${item.name} x${item.quantity}</span>
        <span>${line.toFixed(2)}€</span>
      </div>
    `;
  });

  content += `
    <hr/>
    <h4>Total: ${total.toFixed(2)} €</h4>
    <p style="text-align:center;">Thank you!</p>
  </div>
  `;

  const win = window.open("", "", "width=300,height=600");
  win.document.write(content);
  win.document.close();
  win.print();
};


  /* =========================
     🧾 PAYMENT (RECEIPT ALWAYS FIRST)
  ========================= */
const handlePayment = async ({ cash, card }) => {
  try {
    console.log("🚀 PAYMENT START");

    const items = cart.map((p) => ({
      product_id: p.id,
      quantity: p.quantity,
      price: p.price,
    }));

    const invoice = generateNextInvoice();

    const res = await createSale({
      user_id: 1,
      payment_method: card > 0 ? "CARD" : "CASH",
      payment_split: { cash, card },
      invoice_number: invoice,
      total,
      items,
    });

    console.log("✅ SALE CREATED:", res);

    toast.success("Payment successful");
    speak("Payment successful");

    // =========================
    // SAFE RECEIPT SECTION
    // =========================

    try {
      console.log("🧾 PDF START");

      if (typeof downloadPDF === "function") {
        await downloadPDF(invoice);
      } else {
        console.warn("downloadPDF is NOT defined");
      }

      console.log("🧾 PDF DONE");
    } catch (pdfErr) {
      console.error("❌ PDF ERROR:", pdfErr);
    }

    try {
      console.log("🖨️ PRINT START");

      if (typeof printThermal === "function") {
        printThermal(invoice);
      } else {
        console.warn("printThermal is NOT defined");
      }

      console.log("🖨️ PRINT DONE");
    } catch (printErr) {
      console.error("❌ PRINT ERROR:", printErr);
    }

    // =========================
    // CLEAN UI (ONLY AFTER PAYMENT OK)
    // =========================
    setCart([]);
    setShowPayment(false);
    setPaymentDone(true);

    scrollToReceipt();

    console.log("🎉 PAYMENT FLOW COMPLETE");

  } catch (err) {
    console.error("🔥 PAYMENT ERROR (ONLY REAL FAIL):", err);
    toast.error(err?.message || "Payment failed");
  }
};

  // const payCash = async () => {
  //   try {
  //     const items = cart.map((p) => ({
  //       product_id: p.id,
  //       quantity: p.quantity,
  //       price: p.price,
  //     }));

  //     const invoice = generateNextInvoice();

  //     await createSale({
  //       user_id: 1,
  //       payment_method: "CASH",
  //       invoice_number: invoice,
  //       total,
  //       items,
  //     });

  //     speak("payment successful");
  //     toast.success("payment successful");

  //     // ✅ RECEIPT FIRST
  //     await downloadPDF(invoice);
  //     printThermal(invoice);

  //     setCart([]);
  //     setShowPayment(false);
  //     setPaymentDone(true);

  //     scrollToReceipt();
  //   } catch (err) {
  //     toast.error("Payment failed");
  //   }
  // };



  const payCash = async () => {


  try {
   
    const items = cart.map((p, index) => {
    

      return {
        product_id: p.id,
        quantity: p.quantity,
        price: p.price,
      };
    });

   

    const invoice = generateNextInvoice();
  

    const res = await createSale({
      user_id: 1,
      payment_method: "CASH",
      invoice_number: invoice,
      total,
      items,
    });

  
    speak("payment successful");
    toast.success("payment successful");

    // =========================
    // RECEIPT DEBUG SECTION
    // =========================

   

    try {
     
      if (typeof downloadPDF === "function") {
        await downloadPDF(invoice);
        
      } else {
        console.warn("⚠️ downloadPDF is NOT a function or undefined");
      }

    } catch (pdfErr) {
      console.error("❌ PDF ERROR:", pdfErr);
    }

    try {
     

      if (typeof printThermal === "function") {
        printThermal(invoice);
      
      } else {
        console.warn("⚠️ printThermal is NOT a function or undefined");
      }

    } catch (printErr) {
      console.error("❌ PRINT ERROR:", printErr);
    }

   

    setCart([]);

    setShowPayment(false);
    setPaymentDone(true);

   ;
    scrollToReceipt();


  } catch (err) {
   

    toast.error(err?.message || "Payment failed");
  }
};

useEffect(() => {
  console.log("🟡 CART CHANGED:", cart);
}, [cart]);
  /* =========================
     UI
  ========================= */
  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-3 bg-gray-100">

      {/* LEFT */}
      <div className="lg:col-span-2 p-4 space-y-4">

        <div className="flex flex-wrap gap-2 bg-white p-3 rounded-2xl shadow">

          <button
            onClick={startScanner}
            className="bg-indigo-600 text-white px-4 py-2 rounded-xl"
          >
            Start Scan
          </button>

          <input
            value={barcodeInput}
            onChange={(e) => setBarcodeInput(e.target.value)}
            className="border p-2 flex-1 rounded-xl"
            placeholder="Barcode"
          />

          <button
            onClick={handleManualAdd}
            className="bg-green-600 text-white px-4 py-2 rounded-xl"
          >
            Add
          </button>
        </div>

        {scanning && (
          <div className="relative bg-white rounded-2xl shadow overflow-hidden">
            <div id="reader" />
            <div className="absolute top-2 left-2 bg-black text-white px-3 py-1 rounded">
              SCANNING...
            </div>
          </div>
        )}
      </div>

      {/* RIGHT CART */}
      <div ref={receiptRef} className="bg-white p-4 shadow-lg flex flex-col">

        <h2 className="text-2xl font-black flex items-center gap-2">
          <ShoppingCart /> Cart
        </h2>

        <div className="flex-1 overflow-y-auto mt-3 space-y-3">

          {cart.map((item) => (
            <div key={item.id} className="bg-gray-50 border rounded-2xl p-4 shadow-sm">

              <div className="flex justify-between">
                <div>
                  <p className="font-bold text-lg">{item.name}</p>
                  <p className="text-gray-500">{Number(item.price).toFixed(2)} €</p>
                  <p className="text-green-600 font-bold">
                    Total: {(item.price * item.quantity).toFixed(2)} €
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button onClick={() => increaseQty(item.id)} className="bg-green-600 text-white p-2 rounded-lg">+</button>
                  <span className="font-bold">{item.quantity}</span>
                  <button onClick={() => decreaseQty(item.id)} className="bg-yellow-500 text-white p-2 rounded-lg">-</button>
                  <button onClick={() => deleteItem(item.id)} className="bg-red-600 text-white p-2 rounded-lg">x</button>
                </div>
              </div>

            </div>
          ))}
        </div>

        {/* TOTAL + UX FIX */}
        <div className="border-t pt-4 mt-4">
          <h2 className="text-3xl font-black">
            TOTAL: {total.toFixed(2)} €
          </h2>

          <button
            disabled={cart.length === 0}
            onClick={() => setShowPayment(true)}
            className={`w-full py-3 mt-3 rounded-2xl font-bold ${
              cart.length === 0 ? "bg-gray-300" : "bg-green-600 text-white"
            }`}
          >
            Checkout
          </button>

          <button
            disabled={cart.length === 0}
            onClick={payCash}
            className={`w-full py-3 mt-2 rounded-2xl font-bold ${
              cart.length === 0 ? "bg-gray-300" : "bg-black text-white"
            }`}
          >
            Pay Cash
          </button>
        </div>
      </div>

      {/* PAYMENT */}
      {showPayment && (
        <SplitPaymentModal
          total={total}
          onClose={() => setShowPayment(false)}
          onPay={handlePayment}
        />
      )}

    </div>
  );
}

