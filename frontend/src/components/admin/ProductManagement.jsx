import { useEffect, useState } from "react";
import { useAppContext } from "../../context/AppContext";
import { Plus, Trash2, Edit, X, Package } from "lucide-react";
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
};

export default function ProductManagement() {
  const {
    getProducts,
    createProduct,
    updateProduct,
    deleteProduct,
    categories,
    getCategories,
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
     FORM HANDLERS
  ========================= */
  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };



  const handleImages = (e) => {
    const files = Array.from(e.target.files || []);

    if (files.length > 4) {
      return toast.error("Maximum 4 images allowed");
    }

    setForm((prev) => ({ ...prev, images: files }));
  };

//   Normalize Images
  const normalizeImages = (images) => {
  if (!images) return [];

  if (Array.isArray(images)) return images;

  try {
    return JSON.parse(images);
  } catch (e) {
    return [];
  }
};


  /* =========================
     MODAL ACTIONS
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

    if (!form.category_id || !form.name || !form.price) {
      return toast.error("Category, Name and Price are required");
    }

    const payload = {
      ...form,
      category_id: Number(form.category_id),
      price: Number(form.price),
      stock: Number(form.stock || 0),
    };

    if (editingProduct) {
      await updateProduct(editingProduct.id, payload);
    } else {
      await createProduct(payload);
    }

    closeModal();
    loadData();
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
     UI
  ========================= */
  return (
    <div className="space-y-6">

      {/* HEADER */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Package className="text-indigo-600" />
          Products
        </h2>

        <button
          onClick={openCreate}
          className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg"
        >
          <Plus className="h-4 w-4" />
          Add Product
        </button>
      </div>

      {/* PRODUCTS GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">

        {loading ? (
          <p>Loading...</p>
        ) : (
          (Array.isArray(products) ? products : []).map((p) => (
            <div key={p.id} className="border rounded-xl bg-white shadow-sm">

              {/* IMAGES */}
              <div className="h-40 bg-gray-100 overflow-x-auto flex">
                {p.images?.length ? (
               (normalizeImages(p.images)).map((img, i) => (
  <img
    key={i}
    src={img?.url || ""}
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

                <div className="flex justify-between pt-2">
                  <button
                    onClick={() => openEdit(p)}
                    className="text-blue-600 flex items-center gap-1"
                  >
                    <Edit className="h-4 w-4" />
                    Edit
                  </button>

                  <button
                    onClick={() => handleDelete(p.id)}
                    className="text-red-600 flex items-center gap-1"
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
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-3 z-50">

          <div className="bg-white w-full max-w-xl rounded-xl p-5 relative">

            <button
              onClick={closeModal}
              className="absolute top-3 right-3"
            >
              <X />
            </button>

            <h2 className="text-xl font-bold mb-4">
              {editingProduct ? "Edit Product" : "Create Product"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-3">

              <select
                name="category_id"
                value={form.category_id}
                onChange={handleChange}
                className="w-full border p-2 rounded"
              >
                <option value="">Select Category</option>
                {(categories || []).map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>

              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Product name"
                className="w-full border p-2 rounded"
              />

              <input
                name="barcode"
                value={form.barcode}
                onChange={handleChange}
                placeholder="Barcode"
                className="w-full border p-2 rounded"
              />

              <div className="grid grid-cols-2 gap-2">
                <input
                  name="price"
                  value={form.price}
                  onChange={handleChange}
                  placeholder="Price"
                  className="border p-2 rounded"
                />

                <input
                  name="stock"
                  value={form.stock}
                  onChange={handleChange}
                  placeholder="Stock"
                  className="border p-2 rounded"
                />
              </div>

              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImages}
              />

              <button className="w-full bg-indigo-600 text-white py-2 rounded">
                {editingProduct ? "Update" : "Create"}
              </button>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}