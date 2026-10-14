import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const placeOrder = async (req, res) => {
  try {
    const { paymentMethod } = req.body;

    const newOrder = new orderModel({
      userId: req.body.userId,
      items: req.body.items,
      amount: req.body.amount,
      address: req.body.address,
      deliveryType: req.body.deliveryType || "Home Delivery",
      paymentMethod: paymentMethod || "Stripe",
      payment: false,
    });
    await newOrder.save();

    // ✅ COD
    if (paymentMethod === "COD") {
      await userModel.findByIdAndUpdate(req.body.userId, { cartData: {} });
      await orderModel.findByIdAndUpdate(newOrder._id, {
        payment: true,
        status: "Food Processing",
        date: new Date(),
      });
      return res.json({
        success: true,
        isCOD: true,
        orderId: newOrder._id,
        message: "Order placed with Cash on Delivery",
      });
    }

    // Stripe
    const line_items = req.body.items.map((i) => ({
      price_data: {
        currency: "inr",
        product_data: { name: i.name },
        unit_amount: i.price * 100,
      },
      quantity: i.quantity,
    }));

    if (req.body.deliveryType !== "Takeaway") {
      line_items.push({
        price_data: {
          currency: "inr",
          product_data: { name: "Delivery Charges" },
          unit_amount: 2 * 100,
        },
        quantity: 1,
      });
    }

    const session = await stripe.checkout.sessions.create({
      line_items,
      mode: "payment",
      success_url: `http://localhost:5174/confirm?success=true&orderId=${newOrder._id}`,
      cancel_url: `http://localhost:5174/verify?success=false&orderId=${newOrder._id}`,
    });

    res.json({ success: true, session_url: session.url });
  } catch (e) {
    console.log("Place order error:", e);
    res.json({ success: false, message: "Error placing order" });
  }
};

export const verifyOrder = async (req, res) => {
  try {
    if (req.body.success === "true") {
      const order = await orderModel.findByIdAndUpdate(
        req.body.orderId,
        {
          payment: true,
          status: "Food Processing",
          date: new Date(),
        },
        { new: true }
      );

      if (order && order.userId) {
        await userModel.findByIdAndUpdate(order.userId, { cartData: {} });
      }

      res.json({ success: true, message: "Payment verified" });
    } else {
      await orderModel.findByIdAndDelete(req.body.orderId);
      res.json({ success: false, message: "Payment failed" });
    }
  } catch (e) {
    console.log("Verify order error:", e);
    res.json({ success: false, message: "Verification error" });
  }
};

export const userOrders = async (req, res) => {
  try {
    const orders = await orderModel
      .find({ userId: req.body.userId })
      .sort({ _id: -1 });
    res.json({ success: true, data: orders });
  } catch (e) {
    console.log(e);
    res.json({ success: false, message: "Error fetching user orders" });
  }
};

// ✅ listOrders — SIRF PAID orders admin mein
export const listOrders = async (req, res) => {
  try {
    const orders = await orderModel
      .find({ payment: true })
      .sort({ _id: -1 });
    res.json({ success: true, data: orders });
  } catch (e) {
    console.log(e);
    res.json({ success: false, message: "Error fetching orders" });
  }
};

export const updateStatus = async (req, res) => {
  try {
    await orderModel.findByIdAndUpdate(req.body.orderId, {
      status: req.body.status,
    });
    res.json({ success: true, message: "Status Updated" });
  } catch (e) {
    console.log(e);
    res.json({ success: false, message: "Error updating status" });
  }
};



