import React from "react";
import { useAppContext } from "../../context/AppContext";
import { assets } from "../../assets/assets";
import toast from "react-hot-toast";

const ProductList = () => {
  const { products, currency, deleteProduct, axios, fetchProducts } =
    useAppContext();

  const safeProducts = products || [];

  const toggleStock = async (id, inStock) => {
    try {
      const { data } = await axios.post("/api/product/stock", {
        id,
        inStock,
      });

      if (data.success) {
        fetchProducts();
        toast.success(data.message);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleDelete = async (productId) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;

    try {
      await deleteProduct(productId);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="no-scrollbar flex-1 h-[calc(100vh-73px)] overflow-y-scroll bg-[#F8FAFC]">
      <div className="max-w-7xl mx-auto p-3 sm:p-4 md:p-8">

        {/* HEADER (responsive text spacing only) */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 md:mb-8">
          <div>
            <h4 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-gray-800 border-l-4 border-indigo-600 pl-3 sm:pl-4">
              All Products
            </h4>
            <p className="text-xs sm:text-sm text-gray-500 mt-1 pl-3 sm:pl-5">
              Manage inventory, pricing, and stock status.
            </p>
          </div>

          <div className="bg-white px-3 sm:px-4 py-2 rounded-xl border shadow-sm self-start md:self-auto">
            <p className="text-[10px] sm:text-xs font-bold text-gray-400 uppercase">
              Total Products
            </p>
            <p className="text-lg sm:text-xl font-black text-indigo-600">
              {safeProducts.length}
            </p>
          </div>
        </div>

        {/* TABLE WRAPPER (IMPORTANT RESPONSIVE FIX) */}
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm border overflow-x-auto">
          <div className="min-w-[1000px] md:min-w-full">

            <table className="w-full">

              {/* HEAD */}
              <thead className="bg-gray-50 text-left text-[10px] sm:text-xs uppercase font-black text-gray-500">
                <tr>
                  <th className="px-4 sm:px-6 py-3 sm:py-4">Product</th>
                  <th className="px-4 sm:px-6 py-3 sm:py-4">Category</th>
                  <th className="px-4 sm:px-6 py-3 sm:py-4">Variants</th>
                  <th className="px-4 sm:px-6 py-3 sm:py-4">Colors</th>
                  <th className="px-4 sm:px-6 py-3 sm:py-4">Description</th>
                  <th className="px-4 sm:px-6 py-3 sm:py-4">Category ID</th>
                  <th className="px-4 sm:px-6 py-3 sm:py-4">Availability</th>
                  <th className="px-4 sm:px-6 py-3 sm:py-4">Price</th>
                  <th className="px-4 sm:px-6 py-3 sm:py-4">Stock</th>
                  <th className="px-4 sm:px-6 py-3 sm:py-4 text-center">Action</th>
                </tr>
              </thead>

              {/* BODY */}
              <tbody className="divide-y">

                {safeProducts.length > 0 ? (
                  safeProducts.map((product) => (
                    <tr key={product.id} className="hover:bg-indigo-50/30">

                      {/* PRODUCT */}
                      <td className="px-4 sm:px-6 py-3 sm:py-4">
                        <div className="flex items-center gap-2 sm:gap-3">
                          <img
                            src={product.image?.[0] || assets.upload_area}
                            alt={product.name}
                            className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl object-cover"
                          />
                          <span className="font-bold text-gray-800 text-xs sm:text-sm truncate max-w-[120px] sm:max-w-[150px]">
                            {product.name}
                          </span>
                        </div>
                      </td>

                      {/* CATEGORY */}
                      <td className="px-4 sm:px-6 py-3 sm:py-4">
                        <span className="px-2 py-1 text-[10px] sm:text-xs rounded-full bg-gray-100 border text-gray-600 font-bold">
                          {product.categoryData?.text || "No category"}
                        </span>
                      </td>

                      {/* VARIANTS */}
                      <td className="px-4 sm:px-6 py-3 sm:py-4">
                        <div className="flex flex-wrap gap-1">
                          {product.variants?.length ? (
                            product.variants.map((v, i) => (
                              <span
                                key={i}
                                className="text-[9px] sm:text-[10px] px-2 py-1 bg-gray-50 border rounded"
                              >
                                {v}
                              </span>
                            ))
                          ) : (
                            <span className="text-gray-300 text-[10px]">No variants</span>
                          )}
                        </div>
                      </td>

                      {/* COLORS */}
                      <td className="px-4 sm:px-6 py-3 sm:py-4">
                        <div className="flex flex-wrap gap-1">
                          {product.colors?.length ? (
                            product.colors.map((c, i) => (
                              <span
                                key={i}
                                className="text-[9px] sm:text-[10px] px-2 py-1 bg-blue-50 border rounded"
                              >
                                {c}
                              </span>
                            ))
                          ) : (
                            <span className="text-gray-300 text-[10px]">No colors</span>
                          )}
                        </div>
                      </td>

                      {/* DESCRIPTION */}
                      <td className="px-4 sm:px-6 py-3 sm:py-4 text-[10px] sm:text-xs text-gray-600 max-w-[180px]">
                        {product.description
                          ? typeof product.description === "string"
                            ? product.description
                            : product.description?.en || "No description"
                          : "No description"}
                      </td>

                      {/* CATEGORY ID */}
                      <td className="px-4 sm:px-6 py-3 sm:py-4 text-gray-500 font-bold text-xs">
                        {product.categoryId || "N/A"}
                      </td>

                      {/* AVAILABILITY */}
                      <td className="px-4 sm:px-6 py-3 sm:py-4 font-bold text-xs">
                        {product.availability ?? 0}
                      </td>

                      {/* PRICE */}
                      <td className="px-4 sm:px-6 py-3 sm:py-4 font-black text-xs">
                        {currency}
                        {product.offerPrice}
                      </td>

                      {/* STOCK */}
                      <td className="px-4 sm:px-6 py-3 sm:py-4">
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            className="sr-only peer"
                            checked={product.inStock}
                            onChange={() =>
                              toggleStock(product.id, !product.inStock)
                            }
                          />
                          <div className="w-10 sm:w-11 h-5 sm:h-6 bg-gray-200 rounded-full peer peer-checked:bg-indigo-600 peer-checked:after:translate-x-full after:absolute after:top-[2px] after:left-[2px] after:bg-white after:w-4 sm:after:w-5 after:h-4 sm:after:h-5 after:rounded-full after:transition-all"></div>
                        </label>
                      </td>

                      {/* ACTION */}
                      <td className="px-4 sm:px-6 py-3 sm:py-4 text-center">
                        <button
                          onClick={() => handleDelete(product.id)}
                          className="text-red-500 hover:bg-red-100 p-2 rounded-xl"
                        >
                          🗑
                        </button>
                      </td>

                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="10" className="text-center py-16 sm:py-20 text-gray-400">
                      No products found
                    </td>
                  </tr>
                )}

              </tbody>
            </table>

          </div>
        </div>

      </div>
    </div>
  );
};

export default ProductList;