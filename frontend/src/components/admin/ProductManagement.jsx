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
   REGEX VALIDATION
========================= */
const onlyNumbers = /^[0-9]*$/;
const decimalRegex = /^[0-9]*\.?[0-9]*$/;
const nameRegex = /^[a-zA-Z0-9\s\-_.]{2,}$/;

export default function ProductManagement() {
  const {
    getProducts,
    createProduct,
    updateProduct,
    deleteProduct,
    getCategories,
    categories,
  } = useAppContext();

  const videoRef = useRef(null);
  const streamRef = useRef(null);

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [form, setForm] = useState(initialForm);

  /* =========================
     CALCULATOR STATES
  ========================= */
  const [quantity, setQuantity] = useState("");
  const [unitPrice, setUnitPrice] = useState("");
  const [unitCostPrice, setUnitCostPrice] = useState("");

  /* =========================
     CAMERA
  ========================= */
  const [showScanner, setShowScanner] = useState(false);

  /* =========================
     LOAD DATA
  ========================= */
  const loadData = async () => {
    setLoading(true);

    try {
      const data = await getProducts();
      setProducts(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("LOAD_DATA_ERROR:", error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    getCategories?.();
  }, []);

  /* =========================
     CAMERA START
  ========================= */
  const startScanner = async () => {
    try {
      setShowScanner(true);

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: "environment",
        },
      });

      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }

      // Fake barcode simulation
      // Replace later with real barcode scanner library if needed
      setTimeout(() => {
        const fakeBarcode = Date.now().toString();

        setForm((prev) => ({
          ...prev,
          barcode: fakeBarcode,
        }));

        toast.success("Barcode scanned successfully");

        stopScanner();
      }, 3000);
    } catch (error) {
      console.error(error);
      toast.error("Cannot access camera");
      setShowScanner(false);
    }
  };

  const stopScanner = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
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
      price: (qty * singlePrice).toFixed(2),
      cost_price: (qty * singleCost).toFixed(2),
    }));
  }, [quantity, unitPrice, unitCostPrice]);

  /* =========================
     FORM HANDLER
  ========================= */
  const handleChange = (e) => {
    const { name, value } = e.target;

    const numericFields = [
      "barcode",
      "stock",
    ];

    const decimalFields = [
      "price",
      "cost_price",
    ];

    if (numericFields.includes(name)) {
      if (value === "" || onlyNumbers.test(value)) {
        setForm((prev) => ({ ...prev, [name]: value }));
      }

      return;
    }

    if (decimalFields.includes(name)) {
      if (value === "" || decimalRegex.test(value)) {
        setForm((prev) => ({ ...prev, [name]: value }));
      }

      return;
    }

    setForm((prev) => ({ ...prev, [name]: value }));
  };

  /* =========================
     IMAGE HANDLER
  ========================= */
  const handleImages = (e) => {
    const files = Array.from(e.target.files || []);

    if (files.length > 4) {
      return toast.error("Maximum 4 images allowed");
    }

    setForm((prev) => ({
      ...prev,
      images: files,
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

  const closeModal = () => {
    stopScanner();

    setShowModal(false);
    setForm(initialForm);
    setEditingProduct(null);

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
      return toast.error(
        "Category, Product Name and Price are required"
      );
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

      toast.success(
        editingProduct
          ? "Product updated successfully"
          : "Product created successfully"
      );

      closeModal();
      loadData();
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong");
    }
  };

  /* =========================
     DELETE
  ========================= */
  const handleDelete = async (id) => {
    if (!confirm("Delete this product ?")) return;

    await deleteProduct(id);

    toast.success("Product deleted");

    loadData();
  };

  /* =========================
     EXPIRATION
  ========================= */
  const isExpired = (date) =>
    date ? new Date(date) < new Date() : false;

  const isExpiringSoon = (date) => {
    if (!date) return false;

    const diff =
      (new Date(date) - new Date()) /
      (1000 * 60 * 60 * 24);

    return diff <= 7 && diff >= 0;
  };

  /* =========================
     UI
  ========================= */
  return (
    <div className="space-y-6 p-3 sm:p-5 bg-gradient-to-br from-slate-50 to-indigo-50 min-h-screen">

      {/* HEADER */}
      <div className="flex flex-col lg:flex-row justify-between gap-4 lg:items-center">

        <div>
          <h2 className="text-2xl sm:text-3xl font-black flex items-center gap-3 text-slate-800">
            <div className="bg-indigo-600 text-white p-2 rounded-2xl shadow-lg">
              <Package className="h-6 w-6" />
            </div>

            Product Management
          </h2>

          <p className="text-gray-500 mt-1 text-sm">
            Manage your inventory professionally
          </p>
        </div>

        <button
          onClick={openCreate}
          className="flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 active:scale-95 transition-all duration-300 text-white px-5 py-3 rounded-2xl shadow-xl font-semibold"
        >
          <Plus className="h-5 w-5" />
          Add Product
        </button>
      </div>

      {/* PRODUCTS */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">

        {loading ? (
          <div className="col-span-full text-center py-20">
            <div className="animate-spin rounded-full h-14 w-14 border-4 border-indigo-600 border-t-transparent mx-auto"></div>

            <p className="mt-4 text-gray-500 font-medium">
              Loading products...
            </p>
          </div>
        ) : (
          products.map((p) => (
            <div
              key={p.id}
              className="group bg-white rounded-3xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-500 border border-gray-100"
            >

              {/* IMAGE */}
              <div className="h-52 bg-gray-100 overflow-hidden relative">

                {normalizeImages(p.images).length ? (
                  normalizeImages(p.images).map((img, i) => (
                    <img
                      key={i}
                      src={img?.url || img}
                      alt={p.name}
                      className="h-full w-full object-cover group-hover:scale-110 transition duration-700"
                    />
                  ))
                ) : (
                  <div className="flex items-center justify-center w-full h-full text-gray-400">
                    No Images
                  </div>
                )}

                <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold shadow">
                  Stock: {p.stock}
                </div>
              </div>

              {/* INFO */}
              <div className="p-5 space-y-3">

                <div>
                  <h3 className="font-black text-lg text-slate-800">
                    {p.name}
                  </h3>

                  <p className="text-sm text-gray-500 mt-1">
                    Barcode: {p.barcode || "N/A"}
                  </p>
                </div>

                <div className="flex items-center justify-between">
                  <p className="text-indigo-600 font-black text-xl">
                    € {p.price}
                  </p>

                  <p className="text-sm text-gray-500">
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
                <div className="flex justify-between pt-4 border-t">

                  <button
                    onClick={() => openEdit(p)}
                    className="flex items-center gap-2 text-blue-600 hover:bg-blue-50 px-4 py-2 rounded-xl transition"
                  >
                    <Edit className="h-4 w-4" />
                    Edit
                  </button>

                  <button
                    onClick={() => handleDelete(p.id)}
                    className="flex items-center gap-2 text-red-600 hover:bg-red-50 px-4 py-2 rounded-xl transition"
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

      {/* MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-3 z-50">

          <div className="bg-white w-full max-w-5xl rounded-3xl overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 max-h-[95vh] overflow-y-auto">

            {/* HEADER */}
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-5 text-white flex items-center justify-between">

              <div>
                <h2 className="font-black text-2xl">
                  {editingProduct
                    ? "Update Product"
                    : "Create Product"}
                </h2>

                <p className="text-white/80 text-sm">
                  Professional inventory management
                </p>
              </div>

              <button
                onClick={closeModal}
                className="bg-white/20 hover:bg-white/30 transition p-2 rounded-xl"
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
                <label className="font-bold text-sm text-gray-700 block mb-2">
                  Category
                </label>

                <select
                  name="category_id"
                  value={form.category_id}
                  onChange={handleChange}
                  className="border-2 border-gray-200 focus:border-indigo-500 outline-none rounded-2xl p-3 w-full"
                >
                  <option value="">
                    Select Category
                  </option>

                  {categories?.map((c) => (
                    <option
                      key={c.id}
                      value={c.id}
                    >
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* PRODUCT NAME */}
              <div>
                <label className="font-bold text-sm text-gray-700 block mb-2">
                  Product Name
                </label>

                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Enter product name"
                  className="border-2 border-gray-200 focus:border-indigo-500 outline-none rounded-2xl p-3 w-full transition"
                />
              </div>

              {/* BARCODE */}
              <div>
                <label className="font-bold text-sm text-gray-700 block mb-2">
                  Barcode
                </label>

                <div className="flex gap-2">

                  <input
                    name="barcode"
                    value={form.barcode}
                    onChange={handleChange}
                    placeholder="Scan or enter barcode"
                    className="border-2 border-gray-200 focus:border-indigo-500 outline-none rounded-2xl p-3 w-full transition"
                  />

                  <button
                    type="button"
                    onClick={startScanner}
                    className="bg-indigo-600 hover:bg-indigo-700 transition text-white px-4 rounded-2xl shadow-lg"
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
                      onChange={(e) =>
                        setQuantity(e.target.value)
                      }
                      placeholder="Ex: 9"
                      className="border-2 border-gray-200 rounded-2xl p-3 w-full outline-none focus:border-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-bold block mb-2">
                      Single Product Price
                    </label>

                    <input
                      value={unitPrice}
                      onChange={(e) =>
                        setUnitPrice(e.target.value)
                      }
                      placeholder="Ex: 5"
                      className="border-2 border-gray-200 rounded-2xl p-3 w-full outline-none focus:border-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-bold block mb-2">
                      Single Cost Price
                    </label>

                    <input
                      value={unitCostPrice}
                      onChange={(e) =>
                        setUnitCostPrice(e.target.value)
                      }
                      placeholder="Ex: 2"
                      className="border-2 border-gray-200 rounded-2xl p-3 w-full outline-none focus:border-indigo-500"
                    />
                  </div>

                </div>

                <div className="mt-5 grid grid-cols-1 sm:grid-cols-3 gap-4">

                  <div className="bg-white rounded-2xl p-4 shadow-sm">
                    <p className="text-xs text-gray-500">
                      Total Stock
                    </p>

                    <h4 className="font-black text-2xl text-indigo-600">
                      {form.stock || 0}
                    </h4>
                  </div>

                  <div className="bg-white rounded-2xl p-4 shadow-sm">
                    <p className="text-xs text-gray-500">
                      Total Price
                    </p>

                    <h4 className="font-black text-2xl text-green-600">
                      € {form.price || 0}
                    </h4>
                  </div>

                  <div className="bg-white rounded-2xl p-4 shadow-sm">
                    <p className="text-xs text-gray-500">
                      Total Cost
                    </p>

                    <h4 className="font-black text-2xl text-orange-600">
                      € {form.cost_price || 0}
                    </h4>
                  </div>

                </div>

              </div>

              {/* PRICE */}
              <div>
                <label className="font-bold text-sm text-gray-700 block mb-2">
                  Total Price
                </label>

                <input
                  name="price"
                  value={form.price}
                  onChange={handleChange}
                  placeholder="Price"
                  className="border-2 border-gray-200 focus:border-indigo-500 outline-none rounded-2xl p-3 w-full"
                />
              </div>

              {/* COST PRICE */}
              <div>
                <label className="font-bold text-sm text-gray-700 block mb-2">
                  Total Cost Price
                </label>

                <input
                  name="cost_price"
                  value={form.cost_price}
                  onChange={handleChange}
                  placeholder="Cost Price"
                  className="border-2 border-gray-200 focus:border-indigo-500 outline-none rounded-2xl p-3 w-full"
                />
              </div>

              {/* STOCK */}
              <div>
                <label className="font-bold text-sm text-gray-700 block mb-2">
                  Stock
                </label>

                <input
                  name="stock"
                  value={form.stock}
                  onChange={handleChange}
                  placeholder="Stock"
                  className="border-2 border-gray-200 focus:border-indigo-500 outline-none rounded-2xl p-3 w-full"
                />
              </div>

              {/* EXPIRATION */}
              <div>
                <label className="font-bold text-sm text-gray-700 block mb-2">
                  Expiration Date
                </label>

                <input
                  type="date"
                  name="expiration_date"
                  value={form.expiration_date}
                  onChange={handleChange}
                  className="border-2 border-gray-200 focus:border-indigo-500 outline-none rounded-2xl p-3 w-full"
                />
              </div>

              {/* DESCRIPTION */}
              <div className="lg:col-span-2">
                <label className="font-bold text-sm text-gray-700 block mb-2">
                  Description
                </label>

                <textarea
                  rows={4}
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  placeholder="Product description"
                  className="border-2 border-gray-200 focus:border-indigo-500 outline-none rounded-2xl p-3 w-full resize-none"
                />
              </div>

              {/* IMAGES */}
              <div className="lg:col-span-2">
                <label className="font-bold text-sm text-gray-700 block mb-2">
                  Product Images
                </label>

                <input
                  type="file"
                  multiple
                  onChange={handleImages}
                  className="border-2 border-dashed border-gray-300 rounded-2xl p-4 w-full"
                />
              </div>

              {/* SUBMIT */}
              <div className="lg:col-span-2">
                <button className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:opacity-90 transition-all active:scale-[0.98] text-white w-full py-4 rounded-2xl font-black text-lg shadow-2xl">
                  {editingProduct
                    ? "Update Product"
                    : "Create Product"}
                </button>
              </div>

            </form>

          </div>

          {/* CAMERA MODAL */}
          {showScanner && (
            <div className="fixed inset-0 bg-black/90 z-[60] flex items-center justify-center p-4">

              <div className="bg-white rounded-3xl overflow-hidden w-full max-w-md shadow-2xl">

                <div className="flex justify-between items-center p-4 border-b">

                  <h3 className="font-black text-lg">
                    Barcode Scanner
                  </h3>

                  <button
                    onClick={stopScanner}
                    className="bg-red-100 text-red-600 p-2 rounded-xl"
                  >
                    <X />
                  </button>

                </div>

                <div className="p-4">

                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    className="w-full rounded-2xl bg-black"
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