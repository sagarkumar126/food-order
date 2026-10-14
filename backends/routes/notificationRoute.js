import express from "express";
import {
  getNotifications,
  getUnreadCount,
} from "../controllers/notificationController.js";

const notificationRouter = express.Router();

notificationRouter.get("/list", getNotifications);
notificationRouter.get("/count", getUnreadCount);

export default notificationRouter;




