import { useEffect, useState } from "react";
import { useAppContext } from "../../context/AppContext";
import { assets } from "../../assets/assets";
import toast from "react-hot-toast";

const AddCategory = () => {
  const [file, setFile] = useState(null);
  const [text, setText] = useState("");
  const [path, setPath] = useState("");
  const [bgColor, setBgColor] = useState("");
  const [parentId, setParentId] = useState(""); // ✅ ADDED
  const [categories, setCategories] = useState([]); // ✅ ADDED
  const [loading, setLoading] = useState(false);

  const { axios } = useAppContext();

  // ===============================
  // FETCH EXISTING CATEGORIES
  // ===============================
  const fetchCategories = async () => {
    try {
      const { data } = await axios.get("/api/category/list");
      if (data.success) {
        setCategories(data.categories);
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // ===============================
  // SUBMIT HANDLER
  // ===============================
  const onSubmitHandler = async (event) => {
    event.preventDefault();

    if (!file) {
      toast.error("Please select an image");
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("text", text);
      formData.append("path", path);
      formData.append("bgColor", bgColor);
      formData.append("image", file);
      // formData.append("parentId", parentId); // ✅ ADDED
      if (parentId) {
  formData.append("parentId", Number(parentId));
}

      const { data } = await axios.post("/api/category/add", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (data.success) {
        toast.success(data.message);

        // RESET FORM
        setText("");
        setPath("");
        setBgColor("");
        setFile(null);
        setParentId(""); // ✅ ADDED

        // refresh categories
        fetchCategories();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="no-scrollbar flex-1 h-[calc(100vh-73px)] overflow-y-scroll bg-[#F8FAFC]">
      <div className="max-w-4xl mx-auto p-4 md:p-8 lg:p-12">

        {/* HEADER */}
        <div className="mb-8">
          <h4 className="text-2xl md:text-3xl font-extrabold text-gray-800 border-l-4 border-indigo-600 pl-4">
            Add Category Dashboard
          </h4>
          <p className="text-sm text-gray-500 mt-2 pl-5">
            Create hierarchical categories (main / sub / sub-sub)
          </p>
        </div>

        {/* FORM */}
        <form
          className="bg-white shadow-sm border border-gray-200 rounded-2xl p-5 md:p-10 space-y-6"
          onSubmit={onSubmitHandler}
        >

          {/* IMAGE */}
          <div className="space-y-3">
            <p className="text-sm font-bold text-gray-700 uppercase">Category Image</p>

            <label htmlFor="image" className="cursor-pointer">
              <input
                id="image"
                type="file"
                accept="image/*"
                hidden
                onChange={(e) => setFile(e.target.files[0])}
              />

              <div className="w-28 h-28 border-2 border-dashed rounded-xl flex items-center justify-center overflow-hidden bg-gray-50">
                <img
                  src={file ? URL.createObjectURL(file) : assets.upload_area}
                  className={file ? "w-full h-full object-cover" : "w-10 opacity-40"}
                />
              </div>
            </label>
          </div>

          {/* FIELDS */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

            {/* NAME */}
            <input
              type="text"
              placeholder="Category Name"
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="border p-3 rounded-xl"
              required
            />

            {/* PATH */}
            <input
              type="text"
              placeholder="Category Path"
              value={path}
              onChange={(e) => setPath(e.target.value)}
              className="border p-3 rounded-xl"
              required
            />

            {/* COLOR */}
            <input
              type="text"
              placeholder="Background Color"
              value={bgColor}
              onChange={(e) => setBgColor(e.target.value)}
              className="border p-3 rounded-xl"
              required
            />

            {/* PREVIEW COLOR */}
            <div
              className="h-12 rounded-xl border"
              style={{ backgroundColor: bgColor || "#f3f4f6" }}
            ></div>

            {/* ========================= */}
            {/* PARENT CATEGORY DROPDOWN */}
            {/* ========================= */}
            <div className="md:col-span-2">
              <label className="text-sm font-bold text-gray-700 uppercase">
                Parent Category (Optional)
              </label>

              <select
                value={parentId}
                onChange={(e) => setParentId(e.target.value)}
                className="w-full border p-3 rounded-xl mt-2"
              >
                <option value="">-- Main Category --</option>

                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.text}
                  </option>
                ))}
              </select>
            </div>

          </div>

          {/* BUTTON */}
          <button
            disabled={loading}
            className="w-full bg-indigo-600 text-white p-4 rounded-xl font-bold cursor-pointer"
          >
            {loading ? "CREATING..." : "ADD CATEGORY"}
          </button>

        </form>
      </div>
    </div>
  );
};

export default AddCategory;