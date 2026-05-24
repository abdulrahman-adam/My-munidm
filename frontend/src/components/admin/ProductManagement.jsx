import { useEffect, useState } from "react";
import { useAppContext } from "../../context/AppContext";
import { Plus, Trash2, Edit, Package } from "lucide-react";
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

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [form, setForm] = useState(initialForm);

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
     FORM HANDLER (VALIDATED)
  ========================= */
  const handleChange = (e) => {
    const { name, value } = e.target;

    // numeric fields only
    const numericFields = ["price", "cost_price", "stock", "barcode"];

    if (numericFields.includes(name)) {
      if (value === "" || onlyNumbers.test(value)) {
        setForm((prev) => ({ ...prev, [name]: value }));
      }
      return;
    }

    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleImages = (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 4) {
      return toast.error("Maximum 4 images allowed");
    }
    setForm((prev) => ({ ...prev, images: files }));
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
    setShowModal(false);
    setForm(initialForm);
    setEditingProduct(null);
  };

  /* =========================
     SUBMIT
  ========================= */
  const handleSubmit = async (e) => {
    e.preventDefault();

    // VALIDATION
    if (!form.category_id || !form.name || !form.price) {
      return toast.error("Category, Name and Price are required");
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

      toast.success(editingProduct ? "Product updated" : "Product created");

      closeModal();
      loadData();
    } catch (err) {
      toast.error("Something went wrong");
    }
  };

  /* =========================
     DELETE
  ========================= */
  const handleDelete = async (id) => {
    if (!confirm("Delete this product?")) return;
    await deleteProduct(id);
    loadData();
  };

  /* =========================
     EXPIRATION
  ========================= */
  const isExpired = (date) =>
    date ? new Date(date) < new Date() : false;

  const isExpiringSoon = (date) => {
    if (!date) return false;
    const diff = (new Date(date) - new Date()) / (1000 * 60 * 60 * 24);
    return diff <= 7 && diff >= 0;
  };

  /* =========================
     UI
  ========================= */
  return (
    <div className="space-y-6 p-2 sm:p-4">

      {/* HEADER */}
      <div className="flex flex-col sm:flex-row justify-between gap-3 sm:items-center">
        <h2 className="text-xl sm:text-2xl font-bold flex items-center gap-2">
          <Package className="text-indigo-600" />
          Products
        </h2>

        <button
          onClick={openCreate}
          className="flex items-center justify-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition"
        >
          <Plus className="h-4 w-4" />
          Add Product
        </button>
      </div>

      {/* GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {loading ? (
          <p>Loading...</p>
        ) : (
          products.map((p) => (
            <div key={p.id} className="border rounded-xl bg-white shadow-sm">

              {/* IMAGE */}
              <div className="h-40 bg-gray-100 flex overflow-x-auto">
                {normalizeImages(p.images).length ? (
                  normalizeImages(p.images).map((img, i) => (
                    <img
                      key={i}
                      src={img?.url || img}
                      className="h-40 w-full object-cover"
                    />
                  ))
                ) : (
                  <div className="flex items-center justify-center w-full text-gray-400">
                    No Images
                  </div>
                )}
              </div>

              {/* INFO */}
              <div className="p-4 space-y-1">
                <h3 className="font-bold">{p.name}</h3>
                <p className="text-sm text-gray-500">
                  {p.price} € | Stock: {p.stock}
                </p>

                {p.expiration_date && (
                  <p className="text-xs">
                    {isExpired(p.expiration_date) ? (
                      <span className="text-red-600 font-bold">EXPIRED</span>
                    ) : isExpiringSoon(p.expiration_date) ? (
                      <span className="text-yellow-600">Expires soon</span>
                    ) : (
                      <span className="text-gray-500">
                        Expires: {new Date(p.expiration_date).toLocaleDateString()}
                      </span>
                    )}
                  </p>
                )}

                {/* ACTIONS */}
                <div className="flex justify-between pt-2">
                  <button onClick={() => openEdit(p)} className="text-blue-600">
                    <Edit className="h-4 w-4" />
                  </button>

                  <button onClick={() => handleDelete(p.id)} className="text-red-600">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-3 z-50">
          <div className="bg-white w-full max-w-2xl rounded-xl p-5 max-h-[90vh] overflow-y-auto">

            <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-3">

              {/* CATEGORY */}
              <select
                name="category_id"
                value={form.category_id}
                onChange={handleChange}
                className="border p-2 w-full col-span-1 sm:col-span-2"
              >
                <option value="">Select Category</option>
                {categories?.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>

              {/* TEXT INPUTS */}
              <input name="name" value={form.name} onChange={handleChange} placeholder="Product Name" className="border p-2 w-full" />

              <input name="barcode" value={form.barcode} onChange={handleChange} placeholder="Barcode (numbers only)" className="border p-2 w-full" />

              {/* NUMERIC (TEXT STYLE) */}
              <input name="price" value={form.price} onChange={handleChange} placeholder="Price" inputMode="numeric" className="border p-2 w-full" />

              <input name="cost_price" value={form.cost_price} onChange={handleChange} placeholder="Cost Price" inputMode="numeric" className="border p-2 w-full" />

              <input name="stock" value={form.stock} onChange={handleChange} placeholder="Stock" inputMode="numeric" className="border p-2 w-full" />

              <input
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="Description"
                className="border p-2 w-full col-span-1 sm:col-span-2"
              />

              <input type="date" name="expiration_date" value={form.expiration_date} onChange={handleChange} className="border p-2 w-full" />

              <input type="file" multiple onChange={handleImages} className="col-span-1 sm:col-span-2" />

              {/* SUBMIT */}
              <button className="bg-blue-600 text-white w-full py-2 rounded-lg col-span-1 sm:col-span-2 hover:bg-blue-700 transition">
                {editingProduct ? "Update Product" : "Create Product"}
              </button>

            </form>

          </div>
        </div>
      )}
    </div>
  );
}