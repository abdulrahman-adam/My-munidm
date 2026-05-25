import { useState } from "react";
import { useAppContext } from "../../context/AppContext";
import { Plus, Trash2, Edit, X } from "lucide-react";
import toast from "react-hot-toast";

export default function CategoryManagement() {
  const {
    categories,
    createCategory,
    updateCategory,
    deleteCategory,
  } = useAppContext();

  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);

  const [form, setForm] = useState({
    name: "",
    description: "",
    images: [],
  });

  /* =========================
     HANDLE INPUT
  ========================= */
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  /* =========================
     HANDLE IMAGES
  ========================= */
  const handleImages = (e) => {
    const files = Array.from(e.target.files);

    if (files.length > 4) {
      toast.error("Maximum 4 images allowed");
      return;
    }

    setForm({ ...form, images: files });
  };

  /* =========================
     OPEN CREATE
  ========================= */
  const openCreate = () => {
    setEditingCategory(null);
    setForm({ name: "", description: "", images: [] });
    setShowModal(true);
  };

  /* =========================
     OPEN EDIT
  ========================= */
  const openEdit = (cat) => {
    setEditingCategory(cat);
    setForm({
      name: cat.name,
      description: cat.description || "",
      images: [],
    });
    setShowModal(true);
  };

  /* =========================
     SUBMIT
  ========================= */
 const handleSubmit = async (e) => {
  e.preventDefault();

  if (!form.name) return toast.error("Name required");

  const formData = new FormData();

  formData.append("name", form.name);
  formData.append("description", form.description);

  form.images.forEach((file) => {
    formData.append("images", file);
  });

  if (editingCategory) {
    await updateCategory(editingCategory.id, formData);
  } else {
    await createCategory(formData);
  }

  setShowModal(false);
};

  console.log("CATEGORIES:", categories);

  return (
    <div className="space-y-6">

      {/* HEADER */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">
          Category Management
        </h2>

        <button
          onClick={openCreate}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          <Plus className="h-4 w-4" />
          Add Category
        </button>
      </div>

      {/* GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">

        {categories?.map((cat) => (
          <div
            key={cat.id}
            className="bg-white border rounded-xl shadow-sm overflow-hidden"
          >

          {/* IMAGE */}
<div className="h-40 bg-gray-100 flex overflow-x-auto">
  {Array.isArray(cat.images) && cat.images.length > 0 ? (
    cat.images.map((img, i) => (
      <img
        key={i}
        src={img?.url || img}
        className="h-40 w-full object-cover"
        alt="category"
      />
    ))
  ) : (
    <div className="flex items-center justify-center w-full text-gray-400">
      No Images
    </div>
  )}
</div>

            {/* CONTENT */}
            <div className="p-4 space-y-2">
              <h3 className="font-bold text-lg">{cat.name}</h3>
              <p className="text-sm text-gray-500">
                {cat.description || "No description"}
              </p>

              <div className="flex justify-between pt-2">

                <button
                  onClick={() => openEdit(cat)}
                  className="flex items-center gap-1 text-blue-600 hover:text-blue-800"
                >
                  <Edit className="h-4 w-4" />
                  Edit
                </button>

                <button
                  onClick={() => deleteCategory(cat.id)}
                  className="flex items-center gap-1 text-red-600 hover:text-red-800"
                >
                  <Trash2 className="h-4 w-4" />
                  Delete
                </button>

              </div>
            </div>

          </div>
        ))}

      </div>

      {/* =========================
          MODAL
      ========================= */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">

          <div className="bg-white w-full max-w-md p-6 rounded-xl relative">

            {/* CLOSE */}
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-black"
            >
              <X />
            </button>

            <h2 className="text-xl font-bold mb-4">
              {editingCategory ? "Edit Category" : "Create Category"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">

              {/* NAME */}
              <input
                type="text"
                name="name"
                placeholder="Category name"
                value={form.name}
                onChange={handleChange}
                className="w-full border p-2 rounded"
              />

              {/* DESCRIPTION */}
              <textarea
                name="description"
                placeholder="Description"
                value={form.description}
                onChange={handleChange}
                className="w-full border p-2 rounded"
              />

              {/* IMAGES */}
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImages}
              />

              {/* PREVIEW */}
              <div className="flex gap-2 flex-wrap">
                {form.images.map((img, i) => (
                  <img
                    key={i}
                    src={URL.createObjectURL(img)}
                    className="w-16 h-16 object-cover rounded"
                  />
                ))}
              </div>

              {/* BUTTON */}
              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
              >
                {editingCategory ? "Update" : "Create"}
              </button>

            </form>

          </div>

        </div>
      )}

    </div>
  );
}