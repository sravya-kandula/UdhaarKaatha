import Notification from "../models/Notification.js";

// GET ALL NOTIFICATIONS
export const getNotifications = async (req, res) => {
  try {
    const shopkeeperId = req.user.id;

    const notifications = await Notification.find({
      shopkeeperId,
    })
      .sort({
        createdAt: -1,
      })
      .populate("customerId", "name phone");

    res.status(200).json({
      success: true,
      count: notifications.length,
      notifications,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// MARK AS READ
export const markNotificationRead = async (req, res) => {
  try {
    const { id } = req.params;

    const notification = await Notification.findById(id);

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: "Notification not found",
      });
    }

    notification.isRead = true;

    await notification.save();

    res.status(200).json({
      success: true,
      message: "Notification marked as read",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
