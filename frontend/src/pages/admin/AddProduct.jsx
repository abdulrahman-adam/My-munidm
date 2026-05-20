import React, { useState } from "react";
import { useAppContext } from "../../context/AppContext";
import toast from "react-hot-toast";

const AddProduct = () => {
  const { axios, categories } = useAppContext();

  const [files, setFiles] = useState([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [price, setPrice] = useState("");
  const [offerPrice, setOfferPrice] = useState("");
  const [availability, setAvailability] = useState("");

  const [variants, setVariants] = useState([]);
  const [variantInput, setVariantInput] = useState("");

  const [colors, setColors] = useState([]);
  const [colorInput, setColorInput] = useState("");

  const [loading, setLoading] = useState(false);

  // ADD VARIANT
  const addVariant = () => {
    const val = variantInput.trim();
    if (val && !variants.includes(val)) {
      setVariants([...variants, val]);
      setVariantInput("");
    }
  };

  const removeVariant = (val) => {
    setVariants((prev) => prev.filter((v) => v !== val));
  };

  // ADD COLOR
  const addColor = () => {
    const val = colorInput.trim();
    if (val && !colors.includes(val)) {
      setColors([...colors, val]);
      setColorInput("");
    }
  };

  const removeColor = (val) => {
    setColors((prev) => prev.filter((c) => c !== val));
  };

  // SUBMIT
  const onSubmitHandler = async (e) => {
    e.preventDefault();

    if (!files.length) return toast.error("Upload at least one image");

    setLoading(true);

    try {
      const formData = new FormData();

      formData.append("name", name);
      formData.append("description", JSON.stringify(description));
      formData.append("categoryId", categoryId);
      formData.append("price", price);
      formData.append("offerPrice", offerPrice);
      formData.append("availability", availability);
      formData.append("variants", JSON.stringify(variants));
      formData.append("colors", JSON.stringify(colors));

      files.forEach((file) => formData.append("images", file));

      const { data } = await axios.post("/api/product/add", formData);

      if (data.success) {
        toast.success(data.message);

        setName("");
        setDescription("");
        setCategoryId("");
        setPrice("");
        setOfferPrice("");
        setAvailability("");
        setVariants([]);
        setColors([]);
        setFiles([]);
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
    <div className="flex-1 bg-gray-50 min-h-screen p-4 md:p-8">
      <div className="max-w-5xl mx-auto">
        {/* HEADER */}
        <div className="mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 border-l-4 border-indigo-600 pl-4">
            Add Product
          </h2>
          <p className="text-gray-500 mt-2 pl-4">
            Create a professional product listing
          </p>
        </div>

        {/* FORM */}
        <form
          onSubmit={onSubmitHandler}
          className="bg-white rounded-2xl shadow-md p-6 md:p-10 space-y-8"
        >
          {/* IMAGES */}
          <div>
            <p className="font-semibold text-gray-700 mb-3">Images</p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {Array(4)
                .fill("")
                .map((_, index) => (
                  <label key={index} className="cursor-pointer">
                    <input
                      type="file"
                      hidden
                      accept="image/*"
                      onChange={(e) => {
                        const updated = [...files];
                        updated[index] = e.target.files[0];
                        setFiles(updated);
                      }}
                    />

                    <div className="aspect-square border-2 border-dashed rounded-xl flex items-center justify-center overflow-hidden bg-gray-50 hover:border-indigo-400 transition">
                      {files[index] ? (
                        <img
                          src={URL.createObjectURL(files[index])}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="text-gray-400 text-sm">Upload</span>
                      )}
                    </div>
                  </label>
                ))}
            </div>
          </div>

          {/* GRID */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* NAME */}
            <div className="md:col-span-2">
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Product Name"
                className="w-full border p-3 rounded-xl focus:ring-2 focus:ring-indigo-200"
                required
              />
            </div>

            {/* DESCRIPTION */}
            <div className="md:col-span-2">
              <textarea
                rows="4"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Description"
                className="w-full border p-3 rounded-xl"
                required
              />
            </div>

            {/* CATEGORY */}
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="border p-3 rounded-xl"
              required
            >
              <option value="">Select Category</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.text}
                </option>
              ))}
            </select>

            {/* PRICE */}
            <input
              type="number"
              placeholder="Price"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="border p-3 rounded-xl"
              required
            />

            {/* OFFER PRICE */}
            <input
              type="number"
              placeholder="Offer Price"
              value={offerPrice}
              onChange={(e) => setOfferPrice(e.target.value)}
              className="border p-3 rounded-xl"
              required
            />

            {/* STOCK */}
            <input
              type="number"
              placeholder="Stock"
              value={availability}
              onChange={(e) => setAvailability(e.target.value)}
              className="border p-3 rounded-xl"
              required
            />
          </div>

          {/* VARIANTS */}
          {/* VARIANTS */}
          <div>
            <p className="font-semibold mb-2">Variants</p>

            {/* ✅ Responsive input + button */}
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                value={variantInput}
                onChange={(e) => setVariantInput(e.target.value)}
                className="flex-1 border p-3 rounded-xl"
                placeholder="Size, Weight..."
              />
              <button
                type="button"
                onClick={addVariant}
                className="bg-indigo-600 text-white px-5 py-3 rounded-xl w-full sm:w-auto cursor-pointer"
              >
                Add
              </button>
            </div>

            {/* ✅ Responsive tags */}
            <div className="flex flex-wrap gap-2 mt-3">
              {variants.map((v, i) => (
                <span
                  key={i}
                  onClick={() => removeVariant(v)}
                  className="bg-indigo-100 text-indigo-700 px-3 py-1.5 rounded-full cursor-pointer text-sm cursor-pointer"
                >
                  {v} ✕
                </span>
              ))}
            </div>
          </div>

          {/* COLORS */}
          {/* COLORS */}
          <div>
            <p className="font-semibold mb-2">Colors</p>

            {/* ✅ Responsive input + button */}
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                value={colorInput}
                onChange={(e) => setColorInput(e.target.value)}
                className="flex-1 border p-3 rounded-xl"
                placeholder="Red, Blue..."
              />
              <button
                type="button"
                onClick={addColor}
                className="bg-indigo-600 text-white px-5 py-3 rounded-xl w-full sm:w-auto cursor-pointer"
              >
                Add
              </button>
            </div>

            {/* ✅ Responsive tags */}
            <div className="flex flex-wrap gap-2 mt-3 cursor-pointer">
              {colors.map((c, i) => (
                <span
                  key={i}
                  onClick={() => removeColor(c)}
                  className="bg-gray-200 px-3 py-1.5 rounded-full cursor-pointer text-sm"
                >
                  {c} ✕
                </span>
              ))}
            </div>
          </div>

          {/* BUTTON */}
          <button
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-4 rounded-xl font-bold transition cursor-pointer"
          >
            {loading ? "Uploading..." : "Add Product"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddProduct;
