import { uploadFromBuffer } from "../configs/uploadFromBuffer .js";
import Category from "../models/Category.js";
import { v2 as cloudinary } from "cloudinary";


/* =========================================================
   CREATE CATEGORY
========================================================= */
// export const createCategory = async (req, res) => {
//   try {
//     const { name, description } = req.body;

//     // check duplicate
//     const existing = await Category.findOne({ where: { name } });
//     if (existing) {
//       return res.status(400).json({
//         success: false,
//         message: "Category already exists",
//       });
//     }

//     // upload images to cloudinary (if any)
//    let images = [];

// if (req.files && req.files.length > 0) {
//   for (const file of req.files) {
//     const result = await uploadFromBuffer(file.buffer);

//     images.push({
//       url: result.secure_url,
//       public_id: result.public_id,
//     });
//   }
// }

//     const category = await Category.create({
//       name,
//       description,
//       images,
//     });

//     console.log("FILES:", req.files);

//     return res.status(201).json({
//       success: true,
//       message: "Category created successfully",
//       category,
//     });
//   } catch (error) {
//     return res.status(500).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };


export const createCategory = async (req, res) => {
  try {
    console.log("FILES:", req.files);
    console.log("BODY:", req.body);

    const { name, description } = req.body;

    const existing = await Category.findOne({ where: { name } });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: "Category already exists",
      });
    }

    let images = [];

    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const result = await uploadFromBuffer(file.buffer);

        images.push({
          url: result.secure_url,
          public_id: result.public_id,
        });
      }
    }

    const category = await Category.create({
      name,
      description,
      images,
    });

    return res.status(201).json({
      success: true,
      message: "Category created successfully",
      category,
    });
  } catch (error) {
    console.log("CREATE CATEGORY ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* =========================================================
   GET ALL CATEGORIES
========================================================= */
export const getCategories = async (req, res) => {
  try {
    const categories = await Category.findAll({
      where: { is_active: true },
      order: [["createdAt", "DESC"]],
    });

    const formatted = categories.map((cat) => {
      const rawImages = cat.images;

      let images = [];

      try {
        if (Array.isArray(rawImages)) {
          images = rawImages;
        } else if (typeof rawImages === "string") {
          images = JSON.parse(rawImages);
        }
      } catch (e) {
        images = [];
      }

      return {
        ...cat.toJSON(),
        images,
      };
    });

    return res.json({
      success: true,
      count: formatted.length,
      categories: formatted,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* =========================================================
   UPDATE CATEGORY
========================================================= */
export const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, is_active } = req.body;

    const category = await Category.findByPk(id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    // optional new images
   let images = category.images || [];

if (req.files && req.files.length > 0) {
  const uploaded = await Promise.all(
    req.files.map((file) => uploadFromBuffer(file.buffer))
  );

  images = uploaded.map((r) => ({
    url: r.secure_url,
    public_id: r.public_id,
  }));
}

    await category.update({
      name: name ?? category.name,
      description: description ?? category.description,
      is_active: is_active ?? category.is_active,
      images,
    });

    return res.json({
      success: true,
      message: "Category updated successfully",
      category,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* =========================================================
   DELETE CATEGORY (SOFT DELETE STYLE)
========================================================= */
export const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;

    const category = await Category.findByPk(id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    await category.destroy();

    return res.status(200).json({
      success: true,
      message: "Category permanently deleted",
    });

  } catch (error) {
    console.error("DELETE_CATEGORY_ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Internal server error",
    });
  }
};