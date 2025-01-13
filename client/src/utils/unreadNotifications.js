export const unread = (notifications) => {
    return notifications.filter((n) => n.isRead == false);
}