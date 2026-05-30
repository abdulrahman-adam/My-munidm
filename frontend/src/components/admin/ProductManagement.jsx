import { useEffect, useRef, useState } from "react";
import { useAppContext } from "../../context/AppContext";
import {
  Plus,
  Trash2,
  Edit,
  Package,
  Camera,
  X,
  Calculator,
} from "lucide-react";
import toast from "react-hot-toast";
import { Html5Qrcode } from "html5-qrcode";

const initialForm = {
  category_id: "",
  name: "",
  barcode: "",
  price: "",
  cost_price: "",
  stock: "",
  description: "",
  images: [],
  expiration_date: "",
};

/* =========================
   VALIDATION
========================= */
const onlyNumbers = /^[0-9]*$/;
const decimalRegex = /^[0-9]*\.?[0-9]*$/;
const nameRegex = /^[a-zA-Z0-9\s\-_.]{2,}$/;

export default function ProductManagement() {
  console.log("🔄 ProductManagement RENDER");

  const {
    getProducts,
    createProduct,
    updateProduct,
    deleteProduct,
    getCategories,
    categories,
  } = useAppContext();

  const scannerRef = useRef(null);

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  const [showScanner, setShowScanner] = useState(false);

  const [form, setForm] = useState(initialForm);

  /* =========================
     CALCULATOR
  ========================= */
  const [quantity, setQuantity] = useState("");
  const [unitPrice, setUnitPrice] = useState("");
  const [unitCostPrice, setUnitCostPrice] = useState("");
  const [recentTransactions, setRecentTransactions] = useState([]);

  /* =========================
     LOAD DATA
  ========================= */
  const loadData = async () => {
    console.log("📡 loadData CALLED");
    setLoading(true);

    try {
      const data = await getProducts();
      console.log("📦 products received:", data);
      setProducts(Array.isArray(data) ? data : []);
    } catch (error) {
      console.log("❌ loadData ERROR:", error);
      console.error(error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log("🚀 useEffect INIT (loadData + categories)");
    loadData();
    getCategories?.();
  }, []);

  /* =========================
     SPEAK MESSAGE
  ========================= */
  const speakMessage = (message) => {
    if ("speechSynthesis" in window) {
      const speech = new SpeechSynthesisUtterance(message);

      speech.lang = "en-US";
      speech.rate = 1;
      speech.pitch = 1;

      window.speechSynthesis.speak(speech);
    }
  };

  /* =========================
     START SCANNER
  ========================= */
  const startScanner = async () => {
    try {
      setShowScanner(true);

      setTimeout(async () => {
        const html5QrCode = new Html5Qrcode("reader");

        scannerRef.current = html5QrCode;

        await html5QrCode.start(
          {
            facingMode: "environment",
          },
          {
            fps: 10,
            qrbox: {
              width: 280,
              height: 140,
            },
          },
          async (decodedText) => {
            setForm((prev) => ({
              ...prev,
              barcode: decodedText,
            }));

            toast.success("Barcode scanned successfully");

            speakMessage("Barcode scanned successfully");

            await stopScanner();
          },
          () => {},
        );
      }, 300);
    } catch (error) {
      console.error(error);

      toast.error("Unable to access camera");

      speakMessage("Unable to access camera");

      setShowScanner(false);
    }
  };

  /* =========================
     STOP SCANNER
  ========================= */
  const stopScanner = async () => {
    try {
      if (scannerRef.current) {
        await scannerRef.current.stop();
        await scannerRef.current.clear();
      }
    } catch (error) {
      console.log(error);
    }

    setShowScanner(false);
  };

  /* =========================
     AUTO CALCULATE
  ========================= */
  useEffect(() => {
    if (!quantity) return;

    const qty = Number(quantity || 0);
    const singlePrice = Number(unitPrice || 0);
    const singleCost = Number(unitCostPrice || 0);

    setForm((prev) => ({
      ...prev,
      stock: qty.toString(),
      // price: (qty * singlePrice).toFixed(2),
      // cost_price: (qty * singleCost).toFixed(2),
      price: singlePrice.toString(),
      cost_price: singleCost.toString(),
    }));
  }, [quantity, unitPrice, unitCostPrice]);

  /* =========================
     HANDLE CHANGE
  ========================= */
  const handleChange = (e) => {
    const { name, value } = e.target;

    const numericFields = ["barcode", "stock"];
    const decimalFields = ["price", "cost_price"];

    if (numericFields.includes(name)) {
      if (value === "" || onlyNumbers.test(value)) {
        setForm((prev) => ({
          ...prev,
          [name]: value,
        }));
      }

      return;
    }

    if (decimalFields.includes(name)) {
      if (value === "" || decimalRegex.test(value)) {
        setForm((prev) => ({
          ...prev,
          [name]: value,
        }));
      }

      return;
    }

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  /* =========================
     HANDLE IMAGES
  ========================= */
  const handleImages = (e) => {
    const files = e.target.files;

    if (!files || files.length === 0) {
      return toast.error("No images selected");
    }

    const fileArray = Array.from(files);

    if (fileArray.length > 4) {
      return toast.error("Maximum 4 images allowed");
    }

    setForm((prev) => ({
      ...prev,
      images: fileArray,
    }));
  };

  const normalizeImages = (images) => {
    if (!images) return [];

    if (Array.isArray(images)) return images;

    try {
      return JSON.parse(images);
    } catch {
      return [];
    }
  };

  /* =========================
     MODAL
  ========================= */
  const openCreate = () => {
    setEditingProduct(null);

    setForm(initialForm);

    setQuantity("");
    setUnitPrice("");
    setUnitCostPrice("");

    setShowModal(true);
  };

  const openEdit = (product) => {
    setEditingProduct(product);

    setForm({
      category_id: product.category_id || "",
      name: product.name || "",
      barcode: product.barcode || "",
      price: product.price || "",
      cost_price: product.cost_price || "",
      stock: product.stock || "",
      description: product.description || "",
      images: [],
      expiration_date: product.expiration_date || "",
    });

    setShowModal(true);
  };

  const closeModal = async () => {
    await stopScanner();

    setShowModal(false);

    setEditingProduct(null);

    setForm(initialForm);

    setQuantity("");
    setUnitPrice("");
    setUnitCostPrice("");
  };

  /* =========================
     SUBMIT
  ========================= */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.category_id || !form.name || !form.price) {
      return toast.error("Category, Product Name and Price are required");
    }

    if (!nameRegex.test(form.name)) {
      return toast.error("Invalid product name");
    }

    const payload = {
      ...form,
      category_id: Number(form.category_id),
      price: Number(form.price),
      cost_price: Number(form.cost_price || 0),
      stock: Number(form.stock || 0),
      expiration_date: form.expiration_date || null,
    };

    try {
      if (editingProduct) {
        await updateProduct(editingProduct.id, payload);
      } else {
        await createProduct(payload);
      }

      // toast.success(
      //   editingProduct
      //     ? "Product updated successfully"
      //     : "Product created successfully"
      // );

      speakMessage(
        editingProduct
          ? "Product updated successfully"
          : "Product created successfully",
      );

      await closeModal();

      loadData();
    } catch (error) {
      console.error(error);

      toast.error("Something went wrong");

      speakMessage("Something went wrong");
    }
  };

  /* =========================
     DELETE
  ========================= */
  const handleDelete = async (id) => {
    if (!confirm("Delete this product ?")) return;

    try {
      await deleteProduct(id);

      toast.success("Product deleted successfully");

      speakMessage("Product deleted successfully");

      loadData();
    } catch (error) {
      console.error(error);

      toast.error("Delete failed");
    }
  };

  /* =========================
     EXPIRATION
  ========================= */
  const isExpired = (date) => (date ? new Date(date) < new Date() : false);

  const isExpiringSoon = (date) => {
    if (!date) return false;

    const diff = (new Date(date) - new Date()) / (1000 * 60 * 60 * 24);

    return diff <= 7 && diff >= 0;
  };

  /* =========================
     UI
  ========================= */

  const getCategoryName = (category_id) => {
    return categories?.find((c) => c.id === category_id)?.name || "Unknown";
  };

  return (
    <div className="w-full bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 p-0">
      {/* HEADER */}
      <div className="flex flex-col lg:flex-row justify-between gap-4 lg:items-center">
        <div>
          <h2 className="flex items-center gap-3 text-2xl sm:text-3xl font-black text-slate-800">
            <div className="bg-indigo-600 text-white p-2 rounded-2xl shadow-lg">
              <Package className="h-6 w-6" />
            </div>
            Product Management
          </h2>

          <p className="text-gray-500 mt-1 text-sm text-center">
            Manage your products professionally
          </p>
        </div>

        <button
          onClick={openCreate}
          className="flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-3 shadow-xl transition-all active:scale-95"
        >
          <Plus className="h-5 w-5" />
          Add Product
        </button>
      </div>

      {/* PRODUCTS */}
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50 flex justify-center">
        <div className="w-full max-w-7xl space-y-6">
          {/* PRODUCTS */}
          <div className="w-full grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 md:gap-6 justify-items-center p-0">
            {loading ? (
              <div className="col-span-full text-center py-20 w-full">
                <div className="animate-spin h-14 w-14 rounded-full border-4 border-indigo-600 border-t-transparent mx-auto"></div>

                <p className="mt-4 text-gray-500">Loading products...</p>
              </div>
            ) : (
              products.map((p) => (
                <div
                  key={p.id}
                  className="w-full min-w-[170px] bg-white mt-6 overflow-hidden border border-gray-100 shadow-md hover:shadow-xl transition-all duration-300 md:p-4 lg:p-5"
                  
                >
                  {/* IMAGE */}
                  <div className="h-48 bg-gray-100 overflow-hidden relative">
                    {normalizeImages(p.images).length ? (
                      normalizeImages(p.images).map((img, i) => (
                        <img
                          key={i}
                          src={img?.url || img}
                          alt={p.name}
                          className="w-full h-full object-cover hover:scale-110 transition duration-700"
                        />
                      ))
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        No Images
                      </div>
                    )}

                    <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold shadow">
                      Stock: {p.stock}
                    </div>
                  </div>

                  {/* INFO */}
                  <div className="p-1 space-y-2">
                    <div>
                      <h3 className="font-black text-base text-slate-800">
                        {p.name}
                      </h3>

                      <p className="text-xs text-gray-500 mt-1">
                        Catégorie: {getCategoryName(p.category_id)}
                      </p>

                      <p className="text-xs text-gray-500 mt-1">
                        Barcode: {p.barcode || "N/A"}
                      </p>
                    </div>

                    <div className="flex items-center justify-between">
                      <p className="text-indigo-600 font-black text-lg">
                        € {p.price}
                      </p>

                      <p className="text-xs text-gray-500">
                        Cost: € {p.cost_price}
                      </p>
                    </div>

                    {p.expiration_date && (
                      <div>
                        {isExpired(p.expiration_date) ? (
                          <span className="bg-red-100 text-red-600 text-xs font-bold px-3 py-1 rounded-full">
                            EXPIRED
                          </span>
                        ) : isExpiringSoon(p.expiration_date) ? (
                          <span className="bg-yellow-100 text-yellow-700 text-xs font-bold px-3 py-1 rounded-full">
                            Expires Soon
                          </span>
                        ) : (
                          <span className="bg-green-100 text-green-700 text-xs font-bold px-3 py-1 rounded-full">
                            Valid
                          </span>
                        )}
                      </div>
                    )}

                    {/* ACTIONS */}
                    <div className="flex justify-between pt-3 border-t">
                      <button
                        onClick={() => openEdit(p)}
                        className="flex items-center gap-2 text-blue-600 hover:bg-blue-50 px-3 py-2 rounded-xl transition text-sm"
                      >
                        <Edit className="h-4 w-4" />
                        Edit
                      </button>

                      <button
                        onClick={() => handleDelete(p.id)}
                        className="flex items-center gap-2 text-red-600 hover:bg-red-50 px-3 py-2 rounded-xl transition text-sm"
                      >
                        <Trash2 className="h-4 w-4" />
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-3 z-50">
          <div className="bg-white w-full max-w-5xl rounded-3xl overflow-hidden shadow-2xl max-h-[95vh] overflow-y-auto">
            {/* HEADER */}
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-5 text-white flex justify-between items-center">
              <div>
                <h2 className="font-black text-2xl">
                  {editingProduct ? "Update Product" : "Create Product"}
                </h2>

                <p className="text-white/80 text-sm">
                  Professional inventory management
                </p>
              </div>

              <button
                onClick={closeModal}
                className="bg-white/20 hover:bg-white/30 p-2 rounded-xl transition"
              >
                <X />
              </button>
            </div>

            {/* FORM */}
            <form
              onSubmit={handleSubmit}
              className="p-5 grid grid-cols-1 lg:grid-cols-2 gap-5"
            >
              {/* CATEGORY */}
              <div className="lg:col-span-2">
                <label className="font-bold text-sm block mb-2 text-gray-700">
                  Category
                </label>

                <select
                  name="category_id"
                  value={form.category_id}
                  onChange={handleChange}
                  className="w-full border-2 border-gray-200 rounded-2xl p-3 outline-none focus:border-indigo-500"
                >
                  <option value="">Select Category</option>

                  {categories?.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* PRODUCT NAME */}
              <div>
                <label className="font-bold text-sm block mb-2 text-gray-700">
                  Product Name
                </label>

                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Enter product name"
                  className="w-full border-2 border-gray-200 rounded-2xl p-3 outline-none focus:border-indigo-500"
                />
              </div>

              {/* BARCODE */}
              <div>
                <label className="font-bold text-sm block mb-2 text-gray-700">
                  Barcode
                </label>

                <div className="flex gap-2">
                  <input
                    name="barcode"
                    value={form.barcode}
                    onChange={handleChange}
                    placeholder="Scan barcode"
                    className="w-full border-2 border-gray-200 rounded-2xl p-3 outline-none focus:border-indigo-500"
                  />

                  <button
                    type="button"
                    onClick={startScanner}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 rounded-2xl shadow-lg transition"
                  >
                    <Camera className="h-5 w-5" />
                  </button>
                </div>
              </div>

              {/* CALCULATOR */}
              <div className="lg:col-span-2 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-3xl p-5 border border-indigo-100">
                <div className="flex items-center gap-2 mb-4">
                  <Calculator className="text-indigo-600" />

                  <h3 className="font-black text-lg text-slate-800">
                    Automatic Product Calculator
                  </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="text-sm font-bold block mb-2">
                      Quantity
                    </label>

                    <input
                      value={quantity}
                      onChange={(e) => setQuantity(e.target.value)}
                      placeholder="Ex: 9"
                      className="w-full border-2 border-gray-200 rounded-2xl p-3 outline-none focus:border-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-bold block mb-2">
                      Single Product Price
                    </label>

                    <input
                      value={unitPrice}
                      onChange={(e) => setUnitPrice(e.target.value)}
                      placeholder="Ex: 5"
                      className="w-full border-2 border-gray-200 rounded-2xl p-3 outline-none focus:border-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-bold block mb-2">
                      Single Cost Price
                    </label>

                    <input
                      value={unitCostPrice}
                      onChange={(e) => setUnitCostPrice(e.target.value)}
                      placeholder="Ex: 2"
                      className="w-full border-2 border-gray-200 rounded-2xl p-3 outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>

                <div className="mt-5 grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="bg-white rounded-2xl p-4 shadow-sm">
                    <p className="text-xs text-gray-500">Total Stock</p>

                    <h4 className="text-2xl font-black text-indigo-600">
                      {form.stock || 0}
                    </h4>
                  </div>

                  <div className="bg-white rounded-2xl p-4 shadow-sm">
                    <p className="text-xs text-gray-500">Total Price</p>

                    <h4 className="text-2xl font-black text-green-600">
                      € {form.price || 0}
                    </h4>
                  </div>

                  <div className="bg-white rounded-2xl p-4 shadow-sm">
                    <p className="text-xs text-gray-500">Total Cost</p>

                    <h4 className="text-2xl font-black text-orange-600">
                      € {form.cost_price || 0}
                    </h4>
                  </div>
                </div>
              </div>

              {/* PRICE */}
              <div>
                <label className="font-bold text-sm block mb-2 text-gray-700">
                  Total Price
                </label>

                <input
                  name="price"
                  value={form.price}
                  onChange={handleChange}
                  placeholder="Price"
                  className="w-full border-2 border-gray-200 rounded-2xl p-3 outline-none focus:border-indigo-500"
                />
              </div>

              {/* COST PRICE */}
              <div>
                <label className="font-bold text-sm block mb-2 text-gray-700">
                  Total Cost Price
                </label>

                <input
                  name="cost_price"
                  value={form.cost_price}
                  onChange={handleChange}
                  placeholder="Cost Price"
                  className="w-full border-2 border-gray-200 rounded-2xl p-3 outline-none focus:border-indigo-500"
                />
              </div>

              {/* STOCK */}
              <div>
                <label className="font-bold text-sm block mb-2 text-gray-700">
                  Stock
                </label>

                <input
                  name="stock"
                  value={form.stock}
                  onChange={handleChange}
                  placeholder="Stock"
                  className="w-full border-2 border-gray-200 rounded-2xl p-3 outline-none focus:border-indigo-500"
                />
              </div>

              {/* EXPIRATION */}
              <div>
                <label className="font-bold text-sm block mb-2 text-gray-700">
                  Expiration Date
                </label>

                <input
                  type="date"
                  name="expiration_date"
                  value={form.expiration_date}
                  onChange={handleChange}
                  className="w-full border-2 border-gray-200 rounded-2xl p-3 outline-none focus:border-indigo-500"
                />
              </div>

              {/* DESCRIPTION */}
              <div className="lg:col-span-2">
                <label className="font-bold text-sm block mb-2 text-gray-700">
                  Description
                </label>

                <textarea
                  rows={4}
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  placeholder="Product description"
                  className="w-full border-2 border-gray-200 rounded-2xl p-3 outline-none resize-none focus:border-indigo-500"
                />
              </div>

              {/* IMAGES */}
              <div className="lg:col-span-2">
                <label className="font-bold text-sm block mb-2 text-gray-700">
                  Product Images
                </label>

                <input
                  type="file"
                  multiple
                  onChange={handleImages}
                  className="w-full border-2 border-dashed border-gray-300 rounded-2xl p-4"
                />
              </div>

              {/* SUBMIT */}
              <div className="lg:col-span-2">
                <button className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-4 rounded-2xl font-black text-lg shadow-2xl hover:opacity-90 transition">
                  {editingProduct ? "Update Product" : "Create Product"}
                </button>
              </div>
            </form>
          </div>

          {/* SCANNER MODAL */}
          {showScanner && (
            <div className="fixed inset-0 bg-black/90 z-[60] flex items-center justify-center p-4">
              <div className="bg-white rounded-3xl overflow-hidden w-full max-w-md shadow-2xl">
                <div className="flex justify-between items-center p-4 border-b">
                  <h3 className="font-black text-lg">Barcode Scanner</h3>

                  <button
                    onClick={stopScanner}
                    className="bg-red-100 text-red-600 p-2 rounded-xl"
                  >
                    <X />
                  </button>
                </div>

                <div className="p-4">
                  <div
                    id="reader"
                    className="w-full overflow-hidden rounded-2xl"
                  />

                  <p className="text-center text-sm text-gray-500 mt-4">
                    Point the camera at the barcode
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
