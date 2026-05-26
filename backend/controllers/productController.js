import { v2 as cloudinary } from "cloudinary";
import Category from "../models/Category.js";
import Product from "../models/Product.js";
import { uploadFromBuffer } from "../configs/uploadFromBuffer .js";

/* =========================
   CREATE PRODUCT
========================= */
export const createProduct = async (req, res) => {
  try {
    let {
      category_id,
      name,
      barcode,
      price,
      cost_price,
      stock,
      description,
      expiration_date,
    } = req.body;

    /* =========================================================
       SANITIZE INPUTS (IMPORTANT FOR MOBILE)
    ========================================================= */

    category_id = category_id ? Number(category_id) : null;
    price = price ? Number(price) : null;
    cost_price = cost_price ? Number(cost_price) : 0;
    stock = stock ? Number(stock) : 0;

    name = name?.trim();
    barcode = barcode?.trim();
    description = description?.trim();

    /* =========================================================
       VALIDATION
    ========================================================= */

    if (!category_id || !name || price === null || isNaN(price)) {
      return res.status(400).json({
        success: false,
        message: "Missing or invalid required fields",
      });
    }

    /* =========================================================
       CHECK CATEGORY
    ========================================================= */

    const category = await Category.findByPk(category_id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    /* =========================================================
       CHECK BARCODE (SAFE)
    ========================================================= */

    let existing = null;

    if (barcode && barcode.length > 0) {
      existing = await Product.findOne({
        where: { barcode },
      });
    }

    if (existing) {
      return res.status(400).json({
        success: false,
        message: "Barcode already exists",
      });
    }

    /* =========================================================
       HANDLE IMAGES (CLOUDINARY + MEMORY STORAGE SAFE)
    ========================================================= */

    let images = [];

    if (req.files && Array.isArray(req.files) && req.files.length > 0) {

      if (req.files.length > 4) {
        return res.status(400).json({
          success: false,
          message: "Maximum 4 images allowed",
        });
      }

      for (const file of req.files) {

        // skip invalid file
        if (!file?.buffer) continue;

        // upload buffer to cloudinary
        const result = await uploadFromBuffer(file.buffer);

        images.push({
          url: result.secure_url,
          public_id: result.public_id,
        });
      }
    }

    /* =========================================================
       CREATE PRODUCT
    ========================================================= */

    const product = await Product.create({
      category_id,
      name,
      barcode: barcode || null,
      price,
      cost_price,
      stock,
      description,
      expiration_date: expiration_date || null,
      images,
    });

    /* =========================================================
       RESPONSE
    ========================================================= */

    return res.status(201).json({
      success: true,
      message: "Product created successfully",
      product,
    });

  } catch (error) {

    console.error("CREATE PRODUCT ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Internal server error",
    });
  }
};

/* =========================
  GET PRODUCT BY BARCODE
========================= */


export const getByBarcode = async (req, res) => {
  try {
    const { barcode } = req.params;

    const product = await Product.findOne({
      where: { barcode: barcode.trim() },

      include: [
        {
          model: Category,
          as: "category",
        },
      ],
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    return res.status(200).json({
      success: true,
      product,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* =========================
   GET PRODUCTS
========================= */
export const getProducts = async (req, res) => {
  try {

    const products = await Product.findAll({
      where: {
        is_active: true,
      },

      include: [
        {
          model: Category,
          as: "category",
        },
      ],

      order: [["createdAt", "DESC"]],
    });

    return res.status(200).json({
      success: true,
      count: products.length,
      products,
    });

  } catch (error) {

    console.error("GET_PRODUCTS_ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Internal server error",
    });
  }
};
/* =========================
   UPDATE PRODUCT
========================= */
export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;

    /* =========================================================
       FIND PRODUCT
    ========================================================= */

    const product = await Product.findByPk(id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    /* =========================================================
       SANITIZE INPUTS
    ========================================================= */

    const category_id = req.body.category_id
      ? Number(req.body.category_id)
      : product.category_id;

    const price = req.body.price
      ? Number(req.body.price)
      : product.price;

    const cost_price = req.body.cost_price
      ? Number(req.body.cost_price)
      : product.cost_price;

    const stock = req.body.stock !== undefined
      ? Number(req.body.stock)
      : product.stock;

    const name = req.body.name?.trim() || product.name;

    const barcode = req.body.barcode?.trim() || null;

    const description =
      req.body.description?.trim() ||
      product.description;

    /* =========================================================
       HANDLE IMAGES
    ========================================================= */

    let images = product.images || [];

    if (req.files && Array.isArray(req.files) && req.files.length > 0) {

      if (req.files.length > 4) {
        return res.status(400).json({
          success: false,
          message: "Maximum 4 images allowed",
        });
      }

      images = [];

      for (const file of req.files) {

        const result = await uploadFromBuffer(file.buffer);

        images.push({
          url: result.secure_url,
          public_id: result.public_id,
        });
      }
    }

    /* =========================================================
       UPDATE PRODUCT
    ========================================================= */

    await product.update({
      category_id,
      name,
      barcode,
      price,
      cost_price,
      stock,
      description,

      expiration_date:
        req.body.expiration_date ||
        product.expiration_date,

      expiry_notification_sent:
        req.body.expiry_notification_sent ??
        product.expiry_notification_sent,

      images,
    });

    /* =========================================================
       RESPONSE
    ========================================================= */

    return res.status(200).json({
      success: true,
      message: "Product updated successfully",
      product,
    });

  } catch (error) {
    console.error("UPDATE_PRODUCT_ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Internal server error",
    });
  }
};

/* =========================
   DELETE (SOFT)
========================= */
export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    /* =========================================================
       FIND PRODUCT
    ========================================================= */
    const product = await Product.findByPk(id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    /* =========================================================
       DELETE CLOUDINARY IMAGES
    ========================================================= */
    if (Array.isArray(product.images) && product.images.length > 0) {
      for (const image of product.images) {
        if (image.public_id) {
          try {
            await cloudinary.uploader.destroy(image.public_id);
          } catch (err) {
            console.warn("Cloudinary delete failed:", err.message);
          }
        }
      }
    }

    /* =========================================================
       HARD DELETE FROM DATABASE
    ========================================================= */
    await product.destroy();

    /* =========================================================
       RESPONSE
    ========================================================= */
    return res.status(200).json({
      success: true,
    });

  } catch (error) {
    console.error("DELETE_PRODUCT_ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Internal server error",
    });
  }
};

