import orderModel from "../models/orderModel.js";

// ✅ getNotifications — ALL orders show
export const getNotifications = async (req, res) => {
  try {
    const recentOrders = await orderModel
      .find({})
      .sort({ _id: -1 })
      .limit(10);

    const notifications = recentOrders.map((order) => ({
      _id: order._id,
      type: "order",
      title: "🛒 New Order Received",
      message: `${order.address?.firstName || "Customer"} ${
        order.address?.lastName || ""
      } ordered ₹${order.amount}`,
      amount: order.amount,
      status: order.status,
      date: order.date || order._id.getTimestamp(),
      isRead: false,
    }));

    res.json({
      success: true,
      data: notifications,
      count: notifications.length,
    });
  } catch (error) {
    console.log("Notifications error:", error);
    res.json({ success: false, message: "Error fetching notifications" });
  }
};

// ✅ getUnreadCount — ALL orders count
export const getUnreadCount = async (req, res) => {
  try {
    const count = await orderModel.countDocuments({});
    res.json({ success: true, count });
  } catch (error) {
    console.log("Unread count error:", error);
    res.json({ success: false, count: 0 });
  }
};




