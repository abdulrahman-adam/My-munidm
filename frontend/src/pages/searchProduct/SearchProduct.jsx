import React, { useContext, useEffect, useRef, useState } from "react";
import {
  Search,
  ScanLine,
  Package,
  DollarSign,
  Boxes,
  Calendar,
  BadgeCheck,
  CircleOff,
  Volume2,
  Camera,
  X,
} from "lucide-react";

import { Html5Qrcode } from "html5-qrcode";
import { useAppContext } from "../../context/AppContext";

const SearchProduct = () => {
  const { getProductByBarcode, currency } = useAppContext();

  const [barcode, setBarcode] = useState("");
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(false);
  const [scannerOpen, setScannerOpen] = useState(false);
  const [error, setError] = useState("");

  const scannerRef = useRef(null);

  /* =========================
      VOICE
  ========================= */
  const speak = (text) => {
    const speech = new SpeechSynthesisUtterance(text);
    speech.lang = "en-US";
    speech.rate = 1;
    window.speechSynthesis.speak(speech);
  };

  /* =========================
      SEARCH PRODUCT
  ========================= */
  const handleSearch = async (customBarcode) => {
    try {
      setLoading(true);
      setError("");

      const code = customBarcode || barcode;

      if (!code) {
        setError("Please enter barcode");
        speak("Please enter barcode");
        return;
      }

    const response = await getProductByBarcode(code);

if (response) {
  setProduct(response);
  speak(`Product found. ${response.name}. Price ${response.price}`);
} else {
  setProduct(null);
  setError("Product not found");
  speak("Product not found");
}
    } catch (error) {
      console.log(error);
      setProduct(null);
      setError("Something went wrong");
      speak("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  /* =========================
      CAMERA SCANNER
  ========================= */
  const startScanner = async () => {
    setScannerOpen(true);

    setTimeout(async () => {
      try {
        scannerRef.current = new Html5Qrcode("reader");

        await scannerRef.current.start(
          { facingMode: "environment" },
          {
            fps: 10,
            qrbox: {
              width: 260,
              height: 120,
            },
          },
          async (decodedText) => {
            setBarcode(decodedText);

            await stopScanner();

            handleSearch(decodedText);
          },
          () => {},
        );
      } catch (error) {
        console.log(error);
        setError("Camera failed");
      }
    }, 300);
  };

  const stopScanner = async () => {
    try {
      if (scannerRef.current) {
        await scannerRef.current.stop();
        await scannerRef.current.clear();
      }

      setScannerOpen(false);
    } catch (error) {
      console.log(error);
    }
  };

  /* =========================
      ENTER SEARCH
  ========================= */
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  /* =========================
      CLEANUP
  ========================= */
  useEffect(() => {
    return () => {
      stopScanner();
    };
  }, []);

  return (
    <div className="w-full mx-0 min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-2 md:p-4">
      {/* HEADER */}
      <div className="max-w-7xl mx-auto">
        <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-6 md:p-10 shadow-2xl">
          {/* Glow */}
          <div className="absolute -top-20 -left-20 h-52 w-52 rounded-full bg-cyan-500/20 blur-3xl"></div>

          <div className="absolute bottom-0 right-0 h-60 w-60 rounded-full bg-blue-500/20 blur-3xl"></div>

          {/* TITLE */}
          <div className="relative z-10">
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 rounded-2xl bg-cyan-500/20 flex items-center justify-center border border-cyan-400/30 shadow-lg shadow-cyan-500/20">
                <ScanLine className="text-cyan-400" size={34} />
              </div>

              <div>
                <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight">
                  Barcode Scanner
                </h1>

                <p className="text-slate-300 mt-2 text-sm md:text-base">
                  Smart product search with camera scanner & voice assistant
                </p>
              </div>
            </div>

            {/* SEARCH BAR */}
            <div className="mt-10 grid grid-cols-1 lg:grid-cols-[1fr_auto_auto] gap-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Scan or enter barcode..."
                  value={barcode}
                  onChange={(e) => setBarcode(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="w-full h-16 rounded-2xl bg-slate-900/80 border border-slate-700 px-5 pr-16 text-white text-lg outline-none focus:border-cyan-400 focus:ring-4 focus:ring-cyan-500/20 transition-all duration-300"
                />

                <Search
                  className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400"
                  size={24}
                />
              </div>

              {/* SEARCH BTN */}
              <button
                onClick={() => handleSearch()}
                className="group h-16 px-8 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold text-lg shadow-xl hover:scale-[1.03] active:scale-95 transition-all duration-300 flex items-center justify-center gap-3"
              >
                <Search size={22} />

                {loading ? "Searching..." : "Search"}
              </button>

              {/* CAMERA BTN */}
              <button
                onClick={startScanner}
                className="group h-16 px-8 rounded-2xl border border-cyan-400/30 bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 font-bold text-lg transition-all duration-300 flex items-center justify-center gap-3"
              >
                <Camera
                  size={24}
                  className="group-hover:rotate-12 transition-all duration-300"
                />
                Camera
              </button>
            </div>

            {/* ERROR */}
            {error && (
              <div className="mt-5 rounded-2xl border border-red-500/30 bg-red-500/10 p-4 text-red-300 font-medium animate-pulse">
                {error}
              </div>
            )}
          </div>
        </div>

        {/* CAMERA MODAL */}
        {scannerOpen && (
          <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
            <div className="w-full max-w-2xl rounded-3xl bg-slate-900 border border-slate-700 p-5 shadow-2xl">
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-white text-2xl font-bold">Scan Barcode</h2>

                <button
                  onClick={stopScanner}
                  className="h-12 w-12 rounded-xl bg-red-500/20 text-red-300 flex items-center justify-center hover:scale-110 transition-all duration-300"
                >
                  <X />
                </button>
              </div>

              <div id="reader" className="overflow-hidden rounded-2xl"></div>
            </div>
          </div>
        )}

        {/* PRODUCT CARD */}
        {product && (
          <div className="mt-8 animate-[fadeIn_0.6s_ease]">
            <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-2xl">
              {/* TOP BAR */}
              <div className="bg-gradient-to-r from-cyan-500/20 to-blue-600/20 border-b border-white/10 p-6">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">
                  <div className="flex items-center gap-4">
                    <div className="h-16 w-16 rounded-2xl bg-cyan-500/20 flex items-center justify-center">
                      <Package className="text-cyan-400" size={32} />
                    </div>

                    <div>
                      <h2 className="text-3xl font-black text-white">
                        {product.name}
                      </h2>

                      <p className="text-slate-300 mt-1">
                        Barcode : {product.barcode}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      onClick={() =>
                        speak(
                          `${product.name} price ${product.price} stock ${product.stock}`,
                        )
                      }
                      className="h-14 px-6 rounded-2xl bg-cyan-500/20 text-cyan-300 border border-cyan-400/30 hover:scale-105 transition-all duration-300 flex items-center gap-3"
                    >
                      <Volume2 size={22} />
                      Voice
                    </button>
                  </div>
                </div>
              </div>

              {/* BODY */}
              <div className="p-5 md:p-8">
                <div className="grid grid-cols-1 xl:grid-cols-[350px_1fr] gap-8">
                  {/* IMAGE */}
                  <div>
                    <div className="relative overflow-hidden rounded-3xl border border-slate-700 bg-slate-900/70 h-[320px] md:h-[420px]">
                      <img
                        src={
                          product.images?.[0]?.url ||
                          "https://placehold.co/600x600/png"
                        }
                        alt={product.name}
                        className="w-full h-full object-cover hover:scale-110 transition-all duration-700"
                      />

                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                    </div>
                  </div>

                  {/* DETAILS */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {/* PRICE */}
                    <div className="rounded-3xl border border-green-500/20 bg-green-500/10 p-5 hover:-translate-y-1 transition-all duration-300">
                      <div className="flex items-center gap-3 mb-4">
                        <DollarSign className="text-green-400" size={28} />

                        <h3 className="text-white text-xl font-bold">Price</h3>
                      </div>

                      <p className="text-4xl font-black text-green-300">
                        {currency || "$"} {product.price}
                      </p>
                    </div>

                    {/* COST PRICE */}
                    <div className="rounded-3xl border border-yellow-500/20 bg-yellow-500/10 p-5 hover:-translate-y-1 transition-all duration-300">
                      <div className="flex items-center gap-3 mb-4">
                        <DollarSign className="text-yellow-400" size={28} />

                        <h3 className="text-white text-xl font-bold">
                          Cost Price
                        </h3>
                      </div>

                      <p className="text-4xl font-black text-yellow-300">
                        {currency || "$"} {product.cost_price || 0}
                      </p>
                    </div>

                    {/* STOCK */}
                    <div className="rounded-3xl border border-blue-500/20 bg-blue-500/10 p-5 hover:-translate-y-1 transition-all duration-300">
                      <div className="flex items-center gap-3 mb-4">
                        <Boxes className="text-blue-400" size={28} />

                        <h3 className="text-white text-xl font-bold">Stock</h3>
                      </div>

                      <p className="text-4xl font-black text-blue-300">
                        {product.stock}
                      </p>
                    </div>

                    {/* STATUS */}
                    <div className="rounded-3xl border border-purple-500/20 bg-purple-500/10 p-5 hover:-translate-y-1 transition-all duration-300">
                      <div className="flex items-center gap-3 mb-4">
                        {product.is_active ? (
                          <BadgeCheck className="text-purple-400" size={28} />
                        ) : (
                          <CircleOff className="text-red-400" size={28} />
                        )}

                        <h3 className="text-white text-xl font-bold">Status</h3>
                      </div>

                      <p className="text-2xl font-black text-purple-300">
                        {product.is_active ? "Active" : "Inactive"}
                      </p>
                    </div>

                    {/* CATEGORY */}
                    <div className="rounded-3xl border border-cyan-500/20 bg-cyan-500/10 p-5 md:col-span-2 hover:-translate-y-1 transition-all duration-300">
                      <div className="flex items-center gap-3 mb-4">
                        <Package className="text-cyan-400" size={28} />

                        <h3 className="text-white text-xl font-bold">
                          Category
                        </h3>
                      </div>

                      <p className="text-2xl font-bold text-cyan-300">
                        {product.category?.name || "No Category"}
                      </p>
                    </div>

                    {/* EXPIRATION */}
                    <div className="rounded-3xl border border-red-500/20 bg-red-500/10 p-5 md:col-span-2 hover:-translate-y-1 transition-all duration-300">
                      <div className="flex items-center gap-3 mb-4">
                        <Calendar className="text-red-400" size={28} />

                        <h3 className="text-white text-xl font-bold">
                          Expiration Date
                        </h3>
                      </div>

                      <p className="text-2xl font-bold text-red-300">
                        {product.expiration_date
                          ? new Date(
                              product.expiration_date,
                            ).toLocaleDateString()
                          : "No Expiration"}
                      </p>
                    </div>

                    {/* DESCRIPTION */}
                    <div className="rounded-3xl border border-slate-700 bg-slate-900/60 p-6 md:col-span-2">
                      <h3 className="text-2xl font-black text-white mb-4">
                        Description
                      </h3>

                      <p className="text-slate-300 leading-relaxed text-lg">
                        {product.description || "No description available"}
                      </p>
                    </div>

                    {/* CREATED */}
                    <div className="rounded-3xl border border-slate-700 bg-slate-900/60 p-5">
                      <h3 className="text-lg font-bold text-white mb-3">
                        Created At
                      </h3>

                      <p className="text-slate-300">
                        {new Date(product.createdAt).toLocaleString()}
                      </p>
                    </div>

                    {/* UPDATED */}
                    <div className="rounded-3xl border border-slate-700 bg-slate-900/60 p-5">
                      <h3 className="text-lg font-bold text-white mb-3">
                        Updated At
                      </h3>

                      <p className="text-slate-300">
                        {new Date(product.updatedAt).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* STYLE */}
      <style>
        {`
          @keyframes fadeIn {
            from {
              opacity: 0;
              transform: translateY(30px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
        `}
      </style>
    </div>
  );
};

export default SearchProduct;
