import Notification from "../models/notification.model.js";

const getNotifications = async (req, res) => {

    try {
        const userId = req.user._id;
        const notifications = await Notification.find({ to: userId })
            .populate({
                path: "from",
                select: " username profileImg"
            });
        await Notification.updateMany({ to: userId }, { read: true });
        
        res.status(200).json(notifications);
    } catch (error) {
        res.status(500).json({ message: "Error fetching notifications" });
    }
};

const deleteNotifications = async (req, res) => {
    try {
        const userId = req.user._id;
        await Notification.deleteMany({ to: userId });
        res.status(200).json({ message: "Notifications deleted" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting notifications" });
    }
};

const deleteNotification = async (req, res) => {
    try {
        const notificationId = req.params.id;
        const userId = req.user._id;

        const notification = await Notification.findById(notificationId);
        if (!notification) {
            return res.status(404).json({ message: "Notification not found" });
        }
        if (notification.to.toString() !== userId.toString()) {
            return  res.status(403).json({ message: "Not authorized to delete this notification" });
        }
        await Notification.findByIdAndDelete(notificationId);

        res.status(200).json({ message: "Notification deleted" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting notification" });
    }
};

export { getNotifications, deleteNotifications, deleteNotification };

