import { useEffect, useRef, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";
import { useAppContext } from "../../context/AppContext";
import { Plus, Minus, Trash2, ShoppingCart } from "lucide-react";
import toast from "react-hot-toast";

export default function Cashier() {
  const { getProductByBarcode, createSale } = useAppContext();

  const scannerRef = useRef(null);

  const [cart, setCart] = useState([]);
  const [total, setTotal] = useState(0);
  const [scanning, setScanning] = useState(false);

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
    speak("Product added");
    toast.success("Product added");
  };

  /* =========================
     UPDATE QUANTITY
  ========================= */
  const updateQty = (id, qty) => {
    setCart((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, quantity: Math.max(1, qty) }
          : item
      )
    );
  };

  /* =========================
     REMOVE ITEM
  ========================= */
  const removeItem = (id) => {
    setCart((prev) => prev.filter((p) => p.id !== id));
  };

  /* =========================
     SCANNER
  ========================= */
  const startScanner = async () => {
    setScanning(true);

    setTimeout(async () => {
      const html5QrCode = new Html5Qrcode("reader");
      scannerRef.current = html5QrCode;

      await html5QrCode.start(
        { facingMode: "environment" },
        { fps: 10, qrbox: 250 },
        async (barcode) => {
          const product = await getProductByBarcode(barcode);

          if (product) addToCart(product);

          stopScanner();
        }
      );
    }, 300);
  };

  const stopScanner = async () => {
    if (scannerRef.current) {
      await scannerRef.current.stop();
      await scannerRef.current.clear();
    }
    setScanning(false);
  };

  /* =========================
     CHECKOUT
  ========================= */
  const checkout = async () => {
    if (cart.length === 0) return;

    const items = cart.map((p) => ({
      product_id: p.id,
      quantity: p.quantity,
    }));

    await createSale({
      user_id: 1,
      payment_method: "CASH",
      items,
    });

    speak("Sale completed successfully");
    playBeep();

    printReceipt();

    setCart([]);
  };

  /* =========================
     RECEIPT
  ========================= */
  const printReceipt = () => {
    const win = window.open("", "PRINT", "width=400,height=600");

    win.document.write(`
      <html>
      <head>
        <title>Receipt</title>
        <style>
          body { font-family: Arial; padding: 20px; }
          h2 { text-align:center; }
          .item { display:flex; justify-content:space-between; }
        </style>
      </head>
      <body>
        <h2>🧾 Receipt</h2>
        ${cart
          .map(
            (item) => `
          <div class="item">
            <span>${item.name} x ${item.quantity}</span>
            <span>${item.price * item.quantity} €</span>
          </div>
        `
          )
          .join("")}

        <hr />
        <h3>Total: ${total} €</h3>
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

      {/* LEFT - SCANNER + PRODUCTS */}
      <div className="lg:col-span-2 p-4 space-y-4">

        <button
          onClick={startScanner}
          className="bg-indigo-600 text-white px-4 py-2 rounded-xl"
        >
          Start Scanner
        </button>

        {scanning && (
          <div id="reader" className="w-full rounded-xl overflow-hidden" />
        )}
      </div>

      {/* RIGHT - CART */}
      <div className="bg-white p-4 shadow-lg flex flex-col">

        <h2 className="text-xl font-black flex items-center gap-2">
          <ShoppingCart /> Cart
        </h2>

        <div className="flex-1 overflow-y-auto mt-4 space-y-3">

          {cart.map((item) => (
            <div
              key={item.id}
              className="border p-3 rounded-xl flex justify-between items-center"
            >
              <div>
                <p className="font-bold">{item.name}</p>
                <p className="text-sm text-gray-500">
                  {item.price} €
                </p>
              </div>

              <div className="flex items-center gap-2">

                <button onClick={() => updateQty(item.id, item.quantity - 1)}>
                  <Minus />
                </button>

                <span>{item.quantity}</span>

                <button onClick={() => updateQty(item.id, item.quantity + 1)}>
                  <Plus />
                </button>

                <button onClick={() => removeItem(item.id)}>
                  <Trash2 />
                </button>

              </div>
            </div>
          ))}

        </div>

        {/* TOTAL */}
        <div className="border-t pt-4">
          <h3 className="text-xl font-black">
            Total: {total.toFixed(2)} €
          </h3>

          <button
            onClick={checkout}
            className="w-full mt-3 bg-green-600 text-white py-3 rounded-xl font-bold"
          >
            Checkout
          </button>
        </div>
      </div>

    </div>
  );
}