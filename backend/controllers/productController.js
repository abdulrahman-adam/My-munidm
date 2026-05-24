import { v2 as cloudinary } from "cloudinary";
import Category from "../models/Category.js";
import Product from "../models/Product.js";

/* =========================
   CREATE PRODUCT
========================= */
export const createProduct = async (req, res) => {
  try {
    const {
      category_id,
      name,
      barcode,
      price,
      cost_price,
      stock,
      description,
      expiration_date, // NEW
    } = req.body;

    /* =========================================================
       VALIDATION
    ========================================================= */

    if (!category_id || !name || !price) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields",
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
       CHECK BARCODE
    ========================================================= */

    const existing = barcode
      ? await Product.findOne({
          where: { barcode },
        })
      : null;

    if (existing) {
      return res.status(400).json({
        success: false,
        message: "Barcode already exists",
      });
    }

    /* =========================================================
       HANDLE IMAGES
    ========================================================= */

    let images = [];

    if (req.files?.length) {
      if (req.files.length > 4) {
        return res.status(400).json({
          success: false,
          message: "Maximum 4 images allowed",
        });
      }

      for (const file of req.files) {
        const result = await cloudinary.uploader.upload(
          file.path,
          {
            folder: "products",
          }
        );

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
      barcode,
      price,
      cost_price,
      stock,
      description,
      expiration_date, // NEW
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
      count: products.length, // NEW
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
       HANDLE IMAGES
    ========================================================= */

    let images = product.images;

    if (req.files?.length) {
      if (req.files.length > 4) {
        return res.status(400).json({
          success: false,
          message: "Maximum 4 images allowed",
        });
      }

      images = [];

      for (const file of req.files) {
        const result = await cloudinary.uploader.upload(
          file.path,
          {
            folder: "products",
          }
        );

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
      category_id: req.body.category_id
        ? Number(req.body.category_id)
        : product.category_id,

      name: req.body.name ?? product.name,

      barcode: req.body.barcode || null,

      price: req.body.price
        ? Number(req.body.price)
        : product.price,

      cost_price: req.body.cost_price
        ? Number(req.body.cost_price)
        : product.cost_price,

      stock: req.body.stock !== undefined
        ? Number(req.body.stock)
        : product.stock,

      description:
        req.body.description ?? product.description,

      expiration_date: // NEW
        req.body.expiration_date ??
        product.expiration_date,

      expiry_notification_sent: // NEW
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
    console.log(error);

    return res.status(500).json({
      success: false,
      message: error.message,
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
      message: "Product permanently deleted",
    });

  } catch (error) {
    console.error("DELETE_PRODUCT_ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Internal server error",
    });
  }
};