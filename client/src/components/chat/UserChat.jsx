import { Stack } from "react-bootstrap";
import { useFetchRecipientUser } from "../../hooks/useFetchRecipient";
import avatar from "../../assets/avatar.svg";
import { useContext } from "react";
import { ChatContext } from "../../context/ChatContext";
import { unread } from "../../utils/unreadNotifications";
import { useFetchLatestMessage } from "../../hooks/useFetchLatestMessage";
import moment from "moment";

const UserChat = ({ chat, user }) => {
    const { recipientUser } = useFetchRecipientUser(chat, user);
    const { latestMessage } = useFetchLatestMessage(chat);
    const { onlineUsers, notifications, markThisNotificationsAsRead } = useContext(ChatContext);

    const unreadNotifications = unread(notifications);
    const thisUsernotifications = unreadNotifications.filter(n => {
        return n.senderId === recipientUser._id;
    })

    const isOnline = onlineUsers?.some(usr => usr.userId === recipientUser?._id);

    return (<Stack direction="horizontal" gap={3}
        className="user-card align-tems-center p-2 justify-content-between"
        role="button"
        onClick={() => {
            if(thisUsernotifications?.length > 0)
                markThisNotificationsAsRead(thisUsernotifications, notifications);
        }}>
        <div className="d-flex">
            <div className="me-2">
                <img src={avatar} height="35px"></img>
            </div>
            <div className="text-content">
                <div className="name">{recipientUser?.name}</div>
                <div className="text">{latestMessage?.text && (
                    <span>
                        {latestMessage?.text.substring(0, 20)}
                    </span>
                ) }</div>
            </div>
        </div>
        <div className="d-flex flex-column align-items-end">
            <div className="date">
                {moment(latestMessage?.createdAt).calendar()}
            </div>
            <div className={thisUsernotifications?.length > 0 ? "this-user-notifications" : ""}>
                {thisUsernotifications?.length > 0 ? thisUsernotifications.length : ""}
            </div>
            <span className={isOnline ? "user-online" : ""}></span>
        </div>
    </Stack>);
}

export default UserChat;