import React from 'react'
import { useAppContext } from '../../context/AppContext';
import { assets } from '../../assets/assets';

const ListCategory = () => {
    const { categories, deleteCategory } = useAppContext();

    const getParentName = (parentId) => {
      if (!parentId) return "Main Category";
      const parent = categories.find((cat) => cat.id === parentId);
      return parent ? parent.text : "Unknown";
    };

  return (
    <div className="flex-1 py-10 flex flex-col justify-between">
      <div className="w-full p-4 md:p-10">
        <h4 className="text-2xl font-bold text-gray-800 mb-8 border-l-4 border-blue-500 pl-4">
          All Categories Dashboard
        </h4>

        {/* --- ADDED: overflow-x-auto to make table scrollable on mobile --- */}
        <div className="w-full overflow-x-auto rounded-md bg-white border border-gray-300 shadow-sm">
          <table className="min-w-[700px] w-full table-auto"> 
            <thead className="text-gray-900 text-sm text-left bg-gray-50">
              <tr>
                <th className="px-4 py-3 font-semibold">Image</th>
                <th className="px-4 py-3 font-semibold">Name</th>
                <th className="px-4 py-3 font-semibold">Path</th>
                <th className="px-4 py-3 font-semibold">Color</th>
                <th className="px-4 py-3 font-semibold">Parent</th>
                <th className="px-4 py-3 font-semibold text-center">Action</th>
              </tr>
            </thead>

            <tbody className="text-sm text-gray-600">
              {categories.map((category) => (
                <tr key={category.id} className="border-t border-gray-200 hover:bg-gray-50 transition-colors">
                  
                  {/* Image */}
                  <td className="px-4 py-3">
                    <div className="border border-gray-200 rounded overflow-hidden w-12 h-12 md:w-16 md:h-16">
                      <img
                        src={category.image}
                        alt={category.text}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </td>

                  {/* Name */}
                  <td className="px-4 py-3 font-medium text-gray-800">{category.text}</td>

                  {/* Path */}
                  <td className="px-4 py-3 truncate max-w-[150px]">{category.path}</td>

                  {/* Color */}
                  <td className="px-4 py-3">
                    <span className="px-2 py-1 rounded-md text-xs font-mono bg-gray-100 border">
                      {category.bgColor}
                    </span>
                  </td>

                  {/* Parent */}
                  <td className="px-4 py-3 italic text-gray-500">
                    {getParentName(category.parentId)}
                  </td>

                  {/* Actions */}
                  <td className="px-4 py-3 text-center">
                    <button
                      onClick={() => deleteCategory(category.id)}
                      className="p-2 rounded-full hover:bg-red-50 transition-colors group"
                      title="Delete Category"
                    >
                      <img
                        src={assets.remove_icon}
                        alt="Remove"
                        className="w-6 h-6 opacity-70 group-hover:opacity-100"
                      />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {/* --- ADDED: A small tip for mobile users --- */}
        <p className="md:hidden text-xs text-gray-400 mt-2 text-center italic">
          ← Faites défiler horizontalement pour voir tout le tableau →
        </p>
      </div>
    </div>
  )
}

export default ListCategory;