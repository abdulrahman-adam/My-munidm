// import { useEffect, useRef, useState } from "react";
// import { Html5Qrcode } from "html5-qrcode";
// import { useAppContext } from "../../context/AppContext";
// import {
//   Plus,
//   Minus,
//   Trash2,
//   ShoppingCart,
//   CreditCard,
//   Receipt,
//   Download,
//   Printer,
// } from "lucide-react";
// import toast from "react-hot-toast";

// /* =========================
//    PDF IMPORT
// ========================= */
// import jsPDF from "jspdf";
// import html2canvas from "html2canvas";
// import SplitPaymentModal from "../../components/payment/SplitPaymentModal";

// export default function Cashier() {
//   const { getProductByBarcode, createSale } = useAppContext();

//   const [cart, setCart] = useState([]);
//   const [total, setTotal] = useState(0);
//   const [scanning, setScanning] = useState(false);

  
//   /* =========================
//   🆕 PAYMENT PAGE STATE
//   ========================= */
//   const [paymentData, setPaymentData] = useState(null);
//   const [showPayment, setShowPayment] = useState(false);

//   const scanLock = useRef(false);
//   const scannerRef = useRef(null);

//   /* =========================
//      🧠 INVOICE NUMBER SYSTEM
//   ========================= */
//   const [invoiceNumber, setInvoiceNumber] = useState("POS-0001");

//   useEffect(() => {
//     const last = localStorage.getItem("invoice_number");

//     if (!last) {
//       localStorage.setItem("invoice_number", "1");
//       setInvoiceNumber("POS-0001");
//     } else {
//       const next = parseInt(last) + 1;
//       setInvoiceNumber(`POS-${String(next).padStart(4, "0")}`);
//     }
//   }, []);

//   const generateNextInvoice = () => {
//     const last = parseInt(
//       localStorage.getItem("invoice_number") || "1"
//     );

//     const next = last + 1;

//     localStorage.setItem(
//       "invoice_number",
//       next.toString()
//     );

//     return `POS-${String(next).padStart(4, "0")}`;
//   };

//   /* =========================
//      🆕 DATE + TIME
//   ========================= */
//   const currentDate = new Date().toLocaleDateString();

//   const currentTime = new Date().toLocaleTimeString();

//   /* =========================
//      SOUND + VOICE
//   ========================= */
//   const speak = (text) => {
//     const msg = new SpeechSynthesisUtterance(text);
//     msg.lang = "en-US";
//     window.speechSynthesis.speak(msg);
//   };

//   const playBeep = () => {
//     const audio = new Audio(
//       "https://www.soundjay.com/buttons/sounds/button-16.mp3"
//     );

//     audio.play();
//   };

//   /* =========================
//      CALCULATE TOTAL
//   ========================= */
//   useEffect(() => {
//     const sum = cart.reduce(
//       (acc, item) =>
//         acc + item.price * item.quantity,
//       0
//     );

//     setTotal(sum);
//   }, [cart]);

//   /* =========================
//      ADD TO CART
//   ========================= */
//   const addToCart = (product) => {
//     setCart((prev) => {
//       const exists = prev.find(
//         (p) => p.id === product.id
//       );

//       if (exists) {
//         return prev.map((p) =>
//           p.id === product.id
//             ? {
//                 ...p,
//                 quantity: p.quantity + 1,
//               }
//             : p
//         );
//       }

//       return [
//         ...prev,
//         {
//           ...product,
//           quantity: 1,
//         },
//       ];
//     });

//     playBeep();
//     speak(`${product.name} added`);
//     toast.success(`${product.name} added`);
//   };

//   /* =========================
//      🆕 INCREASE QUANTITY
//   ========================= */
//   const increaseQty = (id) => {
//     setCart((prev) =>
//       prev.map((item) =>
//         item.id === id
//           ? {
//               ...item,
//               quantity: item.quantity + 1,
//             }
//           : item
//       )
//     );
//   };

//   /* =========================
//      🆕 DECREASE QUANTITY
//   ========================= */
//   const decreaseQty = (id) => {
//     setCart((prev) =>
//       prev.map((item) =>
//         item.id === id
//           ? {
//               ...item,
//               quantity: Math.max(
//                 1,
//                 item.quantity - 1
//               ),
//             }
//           : item
//       )
//     );
//   };

//   /* =========================
//      🆕 DELETE PRODUCT
//   ========================= */
//   const deleteItem = (id) => {
//     setCart((prev) =>
//       prev.filter((item) => item.id !== id)
//     );

//     toast.success("Product removed");
//   };

//   /* =========================
//      SCANNER
//   ========================= */
//   const startScanner = async () => {
//     try {
//       if (scannerRef.current) {
//         await stopScanner();
//       }

//       setScanning(true);

//       setTimeout(async () => {
//         const element =
//           document.getElementById("reader");

//         if (!element) {
//           toast.error("Scanner not ready");
//           setScanning(false);
//           return;
//         }

//         const html5QrCode = new Html5Qrcode(
//           "reader"
//         );

//         scannerRef.current = html5QrCode;

//         await html5QrCode.start(
//           { facingMode: "environment" },

//           {
//             fps: 10,
//             qrbox: {
//               width: 280,
//               height: 180,
//             },
//           },

//           async (decodedText) => {
//             const code = decodedText.trim();

//             if (scanLock.current) return;

//             scanLock.current = true;

//             try {
//               playBeep();

//               const product =
//                 await getProductByBarcode(code);

//               if (
//                 !product ||
//                 product.stock <= 0
//               )
//                 return;

//               addToCart(product);
//             } finally {
//               setTimeout(() => {
//                 scanLock.current = false;
//               }, 1200);
//             }
//           },

//           () => {}
//         );
//       }, 400);
//     } catch (error) {
//       toast.error("Camera access denied");
//       setScanning(false);
//     }
//   };

//   /* =========================
//      STOP SCANNER
//   ========================= */
//   const stopScanner = async () => {
//     if (scannerRef.current) {
//       await scannerRef.current.stop();

//       await scannerRef.current.clear();

//       scannerRef.current = null;
//     }

//     setScanning(false);
//   };

//   /* =========================
//      🆕 CHECKOUT REDIRECT
//   ========================= */
//   const checkout = () => {
//     if (cart.length === 0) {
//       toast.error("Cart is empty");
//       return;
//     }

//     setShowPayment(true);
//   };

//   /* =========================
//      🆕 CASH PAYMENT
//   ========================= */
//   const payCash = async () => {
//     const items = cart.map((p) => ({
//       product_id: p.id,
//       name: p.name,
//       price: p.price,
//       quantity: p.quantity,
//     }));

//     const invoice = generateNextInvoice();

//     /* =========================
//        SAVE SALE DATABASE
//     ========================= */
//     await createSale({
//       user_id: 1,
//       payment_method: "CASH",
//       invoice_number: invoice,
//       total,
//       items,
//     });

//     /* =========================
//        🆕 AUTO REDUCE STOCK
//     ========================= */
//     // backend should reduce stock automatically

//     // speak("Cash payment successful");

//     playBeep();

//     toast.success("Payment completed");

//     await downloadPDF(invoice);

//     printThermal(invoice);

//     setCart([]);

//     setShowPayment(false);
//   };



//   const handlePayment = async ({ cash, card }) => {
//   try {
//     const items = cart.map((p) => ({
//       product_id: p.id,
//       quantity: p.quantity,
//       price: p.price, // ✅ IMPORTANT
//     }));

//     await createSale({
//       user_id: 1,
//       payment_method: card > 0 ? "CARD" : "CASH",
//       payment_split: {
//         cash,
//         card,
//       },
//       items,
//     });

//     speak("Payment completed successfully");
//     toast.success("Payment successful");

//     setCart([]);
//     setShowPayment(false);
//   } catch (error) {
//     toast.error("Payment failed");
//   }
// };


//   /* =========================
//      🧾 PDF DOWNLOAD
//   ========================= */
//   const downloadPDF = async (
//     invoice = invoiceNumber
//   ) => {
//     const pdf = new jsPDF("p", "mm", "a4");

//     pdf.setFontSize(20);

//     pdf.text("MUNIDM GROCERY STORE", 20, 20);

//     pdf.setFontSize(12);

//     pdf.text(
//       `Invoice Number: ${invoice}`,
//       20,
//       35
//     );

//     pdf.text(`Date: ${currentDate}`, 20, 45);

//     pdf.text(`Time: ${currentTime}`, 20, 55);

//     pdf.text(`Payment: CASH`, 20, 65);

//     let y = 80;

//     cart.forEach((item) => {
//       pdf.text(
//         `${item.name} x${item.quantity}`,
//         20,
//         y
//       );

//       pdf.text(
//         `${(
//           item.price * item.quantity
//         ).toFixed(2)} €`,
//         150,
//         y
//       );

//       y += 10;
//     });

//     pdf.setFontSize(16);

//     pdf.text(
//       `TOTAL: ${total.toFixed(2)} €`,
//       20,
//       y + 20
//     );

//     pdf.save(`${invoice}.pdf`);
//   };

//   /* =========================
//      🖨️ THERMAL RECEIPT
//   ========================= */
//   const printThermal = (
//     invoice = invoiceNumber
//   ) => {
//     const win = window.open(
//       "",
//       "PRINT",
//       "width=400,height=700"
//     );

//     win.document.write(`
//       <html>
//       <head>
//         <title>Receipt</title>

//         <style>
//           body{
//             width:80mm;
//             font-family:Arial;
//             padding:10px;
//           }

//           .center{
//             text-align:center;
//           }

//           .row{
//             display:flex;
//             justify-content:space-between;
//             margin-bottom:8px;
//             font-size:14px;
//           }

//           hr{
//             border-top:1px dashed #000;
//           }

//           h2,h3,p{
//             margin:4px 0;
//           }
//         </style>
//       </head>

//       <body>

//         <div class="center">
//           <h2>MUNIDM GROCERY</h2>

//           <p>${invoice}</p>

//           <p>${currentDate}</p>

//           <p>${currentTime}</p>

//           <p>Payment: CASH</p>
//         </div>

//         <hr />

//         ${cart
//           .map(
//             (item) => `
//           <div class="row">
//             <span>
//               ${item.name} x${item.quantity}
//             </span>

//             <span>
//               ${(
//                 item.price * item.quantity
//               ).toFixed(2)} €
//             </span>
//           </div>
//         `
//           )
//           .join("")}

//         <hr />

//         <div class="row">
//           <strong>TOTAL</strong>

//           <strong>
//             ${total.toFixed(2)} €
//           </strong>
//         </div>

//         <hr />

//         <div class="center">
//           <p>Thank you for shopping</p>
//         </div>

//       </body>
//       </html>
//     `);

//     win.document.close();

//     win.print();
//   };

//   /* =========================
//      UI
//   ========================= */
//   return (
//     <div className="min-h-screen grid grid-cols-1 lg:grid-cols-3 bg-gray-50">

//       {/* =========================
//           LEFT SIDE
//       ========================= */}
//       <div className="lg:col-span-2 p-4 space-y-4">

//         <div className="flex flex-wrap gap-3">

//           <button
//             onClick={startScanner}
//             className="bg-indigo-600 hover:bg-indigo-700 transition text-white px-4 py-3 rounded-xl font-bold w-full sm:w-auto"
//           >
//             Start Scanner
//           </button>

//           <button
//             onClick={() =>
//               downloadPDF(invoiceNumber)
//             }
//             className="bg-black text-white px-4 py-3 rounded-xl font-bold flex items-center justify-center gap-2 w-full sm:w-auto"
//           >
//             <Download size={18} />
//             Download PDF
//           </button>

//           <button
//             onClick={() =>
//               printThermal(invoiceNumber)
//             }
//             className="bg-gray-800 text-white px-4 py-3 rounded-xl font-bold flex items-center justify-center gap-2 w-full sm:w-auto"
//           >
//             <Printer size={18} />
//             Print Receipt
//           </button>

//         </div>

//         {scanning && (
//           <div
//             id="reader"
//             className="w-full rounded-2xl overflow-hidden bg-white shadow-lg p-2"
//           />
//         )}
//       </div>

//       {/* =========================
//           RIGHT SIDE
//       ========================= */}
//       <div className="bg-white p-4 shadow-lg flex flex-col">

//         <h2 className="text-2xl font-black flex items-center gap-2">
//           <ShoppingCart />
//           Cart
//         </h2>

//         {/* =========================
//             PRODUCTS
//         ========================= */}
//         <div className="flex-1 overflow-y-auto mt-4 space-y-3">

//           {cart.map((item) => (
//             <div
//               key={item.id}
//               className="border p-4 rounded-2xl flex flex-col sm:flex-row justify-between gap-4 bg-gray-50"
//             >

//               {/* PRODUCT INFO */}
//               <div>
//                 <p className="font-black text-lg">
//                   {item.name}
//                 </p>

//                 <p className="text-gray-500">
//                   {item.price} €
//                 </p>

//                 <p className="font-bold text-green-600">
//                   Total:{" "}
//                   {(
//                     item.price * item.quantity
//                   ).toFixed(2)}{" "}
//                   €
//                 </p>
//               </div>

//               {/* =========================
//                   BUTTONS ADDED
//               ========================= */}
//               <div className="flex items-center gap-2 flex-wrap">

//                 {/* INCREASE */}
//                 <button
//                   onClick={() =>
//                     increaseQty(item.id)
//                   }
//                   className="bg-green-600 hover:bg-green-700 transition text-white p-2 rounded-xl"
//                 >
//                   <Plus size={18} />
//                 </button>

//                 {/* QUANTITY */}
//                 <span className="font-black text-lg min-w-[30px] text-center">
//                   {item.quantity}
//                 </span>

//                 {/* DECREASE */}
//                 <button
//                   onClick={() =>
//                     decreaseQty(item.id)
//                   }
//                   className="bg-yellow-500 hover:bg-yellow-600 transition text-white p-2 rounded-xl"
//                 >
//                   <Minus size={18} />
//                 </button>

//                 {/* DELETE */}
//                 <button
//                   onClick={() =>
//                     deleteItem(item.id)
//                   }
//                   className="bg-red-600 hover:bg-red-700 transition text-white p-2 rounded-xl"
//                 >
//                   <Trash2 size={18} />
//                 </button>

//               </div>
//             </div>
//           ))}
//         </div>

//         {/* =========================
//             TOTAL
//         ========================= */}
//         <div className="border-t pt-4 mt-4">

//           <h3 className="text-3xl font-black">
//             Total: {total.toFixed(2)} €
//           </h3>

//           {/* =========================
//               CHECKOUT
//           ========================= */}
//           {!showPayment ? (
//             <button
//               onClick={checkout}
//               className="w-full mt-4 bg-green-600 hover:bg-green-700 transition text-white py-4 rounded-2xl font-black text-lg"
//             >
//               Checkout
//             </button>
//           ) : (
//             <div className="space-y-3 mt-4">

//               <div className="bg-gray-100 rounded-2xl p-4 text-center">

//                 <h3 className="font-black text-xl flex items-center justify-center gap-2">
//                   <CreditCard />
//                   Payment Method
//                 </h3>

//                 <p className="text-gray-500 mt-2">
//                   Invoice: {invoiceNumber}
//                 </p>

//                 <p className="font-bold">
//                   Amount: {total.toFixed(2)} €
//                 </p>

//               </div>

//               {/* CASH PAYMENT */}
//               <button
//                 onClick={payCash}
//                 className="w-full bg-black hover:bg-gray-900 transition text-white py-4 rounded-2xl font-black text-lg flex items-center justify-center gap-2"
//               >
//                 <Receipt />
//                  </button>
//                {showPayment && (
//   <SplitPaymentModal
//     total={total}
//     onClose={() => setShowPayment(false)}
//     onPay={handlePayment}
//   />
// )}
             

//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }



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

