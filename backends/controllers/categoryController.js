import categoryModel from "../models/categoryModel.js";
import foodModel from "../models/foodModel.js";

// ✅ Add Category
export const addCategory = async (req, res) => {
  try {
    const { name, icon } = req.body;

    if (!name || !name.trim()) {
      return res.json({ success: false, message: "Category name required" });
    }

    // Check duplicate
    const existing = await categoryModel.findOne({
      name: { $regex: new RegExp(`^${name.trim()}$`, "i") },
    });

    if (existing) {
      return res.json({
        success: false,
        message: "Category already exists",
      });
    }

    const newCategory = new categoryModel({
      name: name.trim(),
      icon: icon || "🍽️",
    });

    await newCategory.save();
    res.json({
      success: true,
      message: "Category added successfully",
      data: newCategory,
    });
  } catch (error) {
    console.log("Add category error:", error);
    res.json({ success: false, message: "Error adding category" });
  }
};

// ✅ List Categories
export const listCategories = async (req, res) => {
  try {
    const categories = await categoryModel.find({}).sort({ order: 1, name: 1 });
    res.json({ success: true, data: categories });
  } catch (error) {
    console.log("List categories error:", error);
    res.json({ success: false, message: "Error fetching categories" });
  }
};

// ✅ Remove Category
export const removeCategory = async (req, res) => {
  try {
    const { id } = req.body;

    const category = await categoryModel.findById(id);
    if (!category) {
      return res.json({ success: false, message: "Category not found" });
    }

    // ✅ Check karo — koi food is category mein hai kya?
    const foodCount = await foodModel.countDocuments({
      category: category.name,
    });

    if (foodCount > 0) {
      return res.json({
        success: false,
        message: `Cannot delete. ${foodCount} food item(s) are in this category.`,
      });
    }

    await categoryModel.findByIdAndDelete(id);
    res.json({ success: true, message: "Category removed" });
  } catch (error) {
    console.log("Remove category error:", error);
    res.json({ success: false, message: "Error removing category" });
  }
};

// ✅ Update Category (naam/icon change)
export const updateCategory = async (req, res) => {
  try {
    const { id, name, icon } = req.body;

    const category = await categoryModel.findById(id);
    if (!category) {
      return res.json({ success: false, message: "Category not found" });
    }

    const oldName = category.name;

    // Duplicate check (agar naam change ho raha hai)
    if (name && name.trim() !== oldName) {
      const existing = await categoryModel.findOne({
        name: { $regex: new RegExp(`^${name.trim()}$`, "i") },
        _id: { $ne: id },
      });
      if (existing) {
        return res.json({
          success: false,
          message: "Category name already exists",
        });
      }
    }

    const updated = await categoryModel.findByIdAndUpdate(
      id,
      {
        name: name?.trim() || category.name,
        icon: icon || category.icon,
      },
      { new: true }
    );

    // ✅ Food items ke category naam bhi update karo
    if (name && name.trim() !== oldName) {
      await foodModel.updateMany(
        { category: oldName },
        { category: name.trim() }
      );
    }

    res.json({
      success: true,
      message: "Category updated",
      data: updated,
    });
  } catch (error) {
    console.log("Update category error:", error);
    res.json({ success: false, message: "Error updating category" });
  }
};




