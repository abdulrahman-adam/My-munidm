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
     VOICE ENGINE
  ========================= */
  const speak = (text) => {
    if (!("speechSynthesis" in window)) return;

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-US";
    utterance.rate = 1;
    utterance.pitch = 1;

    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
  };

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
      speak("Maximum 4 images allowed");
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
     SUBMIT (CREATE / UPDATE)
  ========================= */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name) {
      toast.error("Name required");
      speak("Name is required");
      return;
    }



try {
  const isUpdate = !!editingCategory;

  if (isUpdate) {
    await updateCategory(editingCategory.id, form);
    speak("Category updated successfully");
  } else {
    await createCategory(form);
    speak("Category created successfully");
  }

  setShowModal(false);

} catch (error) {
  const isUpdate = !!editingCategory;

  const msg =
    error?.response?.data?.message ||
    (isUpdate
      ? "Failed to update category"
      : "Failed to create category");

  toast.error(msg);
  speak(msg);
}



  };



  return (
    <div className="space-y-6">

      {/* HEADER */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">
          Category Management
        </h2>

        <button
          onClick={openCreate}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 hover:bg-blue-700 transition"
        >
          <Plus className="h-4 w-4" />
          Add Category
        </button>
      </div>

      {/* GRID */}
      <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4 md:gap-5">
        {categories?.map((cat) => (
          <div
            key={cat.id}
            className="bg-white shadow-sm overflow-hidden"
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
              <h3 className="font-bold text-lg">Name: {cat.name}</h3>
              <p className="text-sm text-gray-500">
                Description: {cat.description || "No description"}
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
                  onClick={async () => {
                    try {
                      await deleteCategory(cat.id);
                      // toast.success("Category deleted successfully");
                      speak("Category deleted successfully");
                    } catch (error) {
                      const msg =
                        error?.response?.data?.message ||
                        "Failed to delete category";

                      toast.error(msg);
                      speak(msg);
                    }
                  }}
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