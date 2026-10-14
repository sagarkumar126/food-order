import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  items: { type: Array, required: true },
  amount: { type: Number, required: true },
  address: { type: Object, required: true },
  status: { type: String, default: "Pending" },   // ✅ CHANGED
  date: { type: Date, default: Date.now },
  payment: { type: Boolean, default: false },
  paymentMethod: { type: String, default: "Stripe" },
  deliveryType: { type: String, default: "Home Delivery" },
});

const orderModel =
  mongoose.models.Order || mongoose.model("order", orderSchema);
export default orderModel;


