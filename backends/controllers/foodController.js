import foodModel from "../models/foodModel.js";
import cloudinary from "../config/cloudinary.js";

// ✅ Add Food (multiple images + discount + veg)
export const addFood = async (req, res) => {
  try {
    console.log("🔥 addFood CALLED");
    console.log("🔥 FILES:", req.files ? req.files.length : 0);
    console.log("🔥 BODY:", JSON.stringify(req.body));

    if (!req.files || req.files.length === 0) {
      return res.json({ success: false, message: "At least 1 image required" });
    }

    // ✅ Cloudinary URLs (file.path instead of file.filename)
    const imageUrls = req.files.map((file) => file.path);
    const mainImage = imageUrls[0];

    console.log("🔥 IMAGE URLS:", imageUrls);

    const food = new foodModel({
      name: req.body.name,
      description: req.body.description,
      price: Number(req.body.price),
      category: req.body.category,
      stock: req.body.stock ? Number(req.body.stock) : 50,
      image: mainImage,
      images: imageUrls,
      discount: req.body.discount ? Number(req.body.discount) : 0,
      isVeg: req.body.isVeg === "true" || req.body.isVeg === true,
    });

    await food.save();
    console.log("✅ Food saved successfully");
    res.json({ success: true, message: "Food Added" });
  } catch (error) {
    // ✅ DETAILED ERROR LOGGING
    console.error("❌❌❌ ERROR CAUGHT ❌❌❌");
    console.error("❌ MESSAGE:", error.message);
    console.error("❌ NAME:", error.name);
    console.error("❌ FULL ERROR:", JSON.stringify(error, null, 2));
    console.error("❌ STACK:", error.stack);
    console.error("❌❌❌ END ERROR ❌❌❌");

    res.json({ success: false, message: "Error", error: error.message });
  }
};

// ✅ List Food
export const listFood = async (req, res) => {
  try {
    const foods = await foodModel.find({});
    res.json({ success: true, data: foods });
  } catch (error) {
    res.json({ success: false, message: "Error" });
  }
};

// ✅ Remove Food (Cloudinary se bhi delete)
export const removeFood = async (req, res) => {
  try {
    const food = await foodModel.findById(req.body.id);
    if (food) {
      if (food.image && food.image.includes("cloudinary")) {
        try {
          const parts = food.image.split("/");
          const filename = parts[parts.length - 1];
          const publicId = `foody/${filename.split(".")[0]}`;
          await cloudinary.uploader.destroy(publicId);
        } catch (err) {
          console.log("Cloudinary delete error:", err);
        }
      }
      if (food.images && food.images.length > 0) {
        for (const img of food.images) {
          if (img.includes("cloudinary")) {
            try {
              const parts = img.split("/");
              const filename = parts[parts.length - 1];
              const publicId = `foody/${filename.split(".")[0]}`;
              await cloudinary.uploader.destroy(publicId);
            } catch (err) {
              console.log("Cloudinary delete error:", err);
            }
          }
        }
      }
    }
    await foodModel.findByIdAndDelete(req.body.id);
    res.json({ success: true, msg: "Food removed" });
  } catch (error) {
    console.log("not removed");
    res.json({ success: false, msg: "Food not removed" });
  }
};

// ✅ Update Food — existing images (kept) + new images (added)
export const updateFood = async (req, res) => {
  try {
    const {
      id,
      name,
      description,
      price,
      category,
      stock,
      discount,
      isVeg,
      existingImages,
    } = req.body;

    const existingFood = await foodModel.findById(id);
    if (!existingFood) {
      return res.json({ success: false, message: "Food not found" });
    }

    const updateData = {
      name,
      description,
      price: Number(price),
      category,
      stock: stock !== undefined ? Number(stock) : 50,
      discount: discount !== undefined ? Number(discount) : 0,
      isVeg: isVeg === "true" || isVeg === true,
    };

    // ✅ Frontend se aayi bachi hui purani images parse karo
    let keptOldImages = [];
    if (existingImages) {
      try {
        keptOldImages = JSON.parse(existingImages);
        if (!Array.isArray(keptOldImages)) keptOldImages = [];
      } catch (e) {
        console.log("existingImages parse error:", e);
        keptOldImages = [];
      }
    }

    // ✅ Nayi images (Cloudinary URLs)
    const newImageUrls =
      req.files && req.files.length > 0
        ? req.files.map((file) => file.path)
        : [];

    // ✅ Purani images jo DB me thi
    const oldImagesInDB =
      existingFood.images && existingFood.images.length > 0
        ? existingFood.images
        : existingFood.image
        ? [existingFood.image]
        : [];

    // ✅ Jo images user ne delete ki — Cloudinary se hatao
    const deletedImages = oldImagesInDB.filter(
      (img) => !keptOldImages.includes(img)
    );

    for (const img of deletedImages) {
      if (img.includes("cloudinary")) {
        try {
          const parts = img.split("/");
          const filename = parts[parts.length - 1];
          const publicId = `foody/${filename.split(".")[0]}`;
          await cloudinary.uploader.destroy(publicId);
        } catch (err) {
          console.log("Cloudinary delete error:", err);
        }
      }
    }

    // ✅ Kuch bhi change hua images me toh update karo
    const hasImageChanges =
      newImageUrls.length > 0 ||
      deletedImages.length > 0 ||
      keptOldImages.length !== oldImagesInDB.length;

    if (hasImageChanges) {
      const combinedImages = [...keptOldImages, ...newImageUrls].slice(0, 5);

      if (combinedImages.length > 0) {
        updateData.image = combinedImages[0];
        updateData.images = combinedImages;
      } else {
        return res.json({
          success: false,
          message: "At least 1 image required",
        });
      }
    }

    const updated = await foodModel.findByIdAndUpdate(id, updateData, {
      new: true,
    });

    res.json({
      success: true,
      message: "Food updated successfully",
      data: updated,
    });
  } catch (error) {
    console.log("Update food error:", error);
    res.json({ success: false, message: "Error updating food" });
  }
};