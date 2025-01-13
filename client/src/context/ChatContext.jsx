import { createContext, useCallback, useEffect, useState } from "react";
import { baseUrl, postRequest, getRequest } from "../utils/services";
import { io } from "socket.io-client";

export const ChatContext = createContext();

export const ChatContextProvider = ({ children, user }) => {
    const [userChats, setUserChats] = useState([]);
    const [userChatsError, setUserChatsError] = useState(null);
    const [isUserChatsLoading, setIsUserChatsLoading] = useState(false);
    const [potentialChats, setPotentialChats] = useState([]);
    const [currentChat, setCurrentChat] = useState(null);
    const [messages, setMessages] = useState([]);
    const [messagesError, setMessagesError] = useState(null);
    const [isMessagesLoading, setIsMessagesLoading] = useState(false);
    const [textMessageError, setTextMessageError] = useState(null);
    const [newMessage, setNewMessage] = useState(null);
    const [socket, setSocket] = useState(null);
    const [onlineUsers, setOnlineUsers] = useState([]);
    const [notifications, setNotifications] = useState([]);
    const [allUsers, setAllUsers] = useState([]);

    console.log("notifications", notifications);

    useEffect(() => {
        const newSocket = io("http://localhost:3000");
        setSocket(newSocket);

        return (() => newSocket.disconnect())
    }, [user])

    // receive message and notifcation
    useEffect(() => {
        if (socket == null) return;
        socket.on("getMessage", (res) => {
            if (currentChat?._id !== res.chatId) return;
            setMessages((prev) => [...prev, res]);
        })
        socket.on("getNotification", (res) => {
            const isChatOpen = currentChat?._id === res.chatId;
            if (isChatOpen) {
                setNotifications((prev) => [{ ...res, isRead: true }, ...prev]);
            } else {
                setNotifications((prev) => [res, ...prev]);
            }

        })
        return () => {
            socket.off("getMessage");
            socket.off("getNotification");
        }
    }, [socket, currentChat])

    // add online users
    useEffect(() => {
        if (socket == null) return;
        socket.emit("addNewUser", user?.id);
        socket.on("getOnlineUsers", (res) => {
            setOnlineUsers(res);
        })
        return () => {
            socket.off("getOnlineUsers");
        }
    }, [socket])

    // send message
    useEffect(() => {
        if (socket == null) return;
        const recipientId = currentChat?.members.find((id) => id !== user?.id);
        socket.emit("sendMessage", { ...newMessage, recipientId });

    }, [newMessage])

    const sendTextMessage = useCallback(async (textMessage, sender, currentChatId, setTextMessage) => {
        if (!textMessage) return "type something...";
        const response = await postRequest(`${baseUrl}/messages`, JSON.stringify({
            chatId: currentChatId,
            senderId: sender.id,
            text: textMessage
        }));

        if (response.error) {
            return setTextMessageError(response);
        }
        setNewMessage(response);
        setTextMessage("");
        setMessages((prev) => [...prev, response]);
    })

    const updateCurrentChat = useCallback((chat) => {
        setCurrentChat(chat);
    })

    useEffect(() => {
        const getMessages = async () => {
            setIsMessagesLoading(true);
            setMessagesError(null);
            const response = await getRequest(`${baseUrl}/messages/${currentChat?._id}`);
            setIsMessagesLoading(false);
            if (response.error) {
                return setMessagesError(response);
            }
            setMessages(response);
        }
        getMessages();
    }, [currentChat]);

    useEffect(() => {
        const getUsers = async () => {
            const response = await getRequest(`${baseUrl}/users`);
            if (response.error) {
                return console.log("Error fetching users", response.error);
            }
            const users = response.filter(u => {
                let isChatCreated = false;
                if (user?.id === u._id) return false;
                isChatCreated = userChats?.some((usr) => usr.members[0] == u._id || usr.members[1] == u._id);
                return !isChatCreated;
            });

            setPotentialChats(users);
            setAllUsers(response);
        }
        getUsers();
    }, [userChats]);

    useEffect(() => {
        const getUserChats = async () => {
            if (user && user.id) {
                setIsUserChatsLoading(true);
                setUserChatsError(null);
                const response = await getRequest(`${baseUrl}/chats/${user.id}`);
                setIsUserChatsLoading(false);
                if (response.error) {
                    return setUserChatsError(response);
                }
                setUserChats(response);
            }

        }
        getUserChats();
    }, [user, notifications]);

    const createChat = useCallback(async (firstId, secondId) => {
        const response = await postRequest(`${baseUrl}/chats`, JSON.stringify({ firstId, secondId }));
        if (response.error) {
            return console.log("Error creating chat", response.error);
        }
        setUserChats((prev) => [...prev, response]);
    }, []);

    const markAllNotificationsAsRead = useCallback((notifications) => {
        const mNotifications = notifications.map((n) => {
            return { ...n, isRead: true };
        });
        setNotifications(mNotifications);
    }, []);

    const markNotificationAsRead = useCallback((n, user, notifications, userChats) => {
        const desiredChat = userChats.find(chat => {
            return chat.members.includes(user.id) && chat.members.includes(n.senderId);
        });
        const mNotifications = notifications.map((el) => {
            if (el.senderId === n.senderId)
                return { ...n, isRead: true };
            else
                return el;
        });
        updateCurrentChat(desiredChat);
        setNotifications(mNotifications);
    }, []);


    const markThisNotificationsAsRead = useCallback((currN, notifications) => {
        const mNotifications = notifications.map((n) => {
            let notification;
            currN.forEach(c => {
                if (c.senderId == n.senderId)
                    notification = { ...n, isRead: true };
                else
                    notification = n;
            })
            return notification;
        });
        setNotifications(mNotifications);
    }, []);

    return (<ChatContext.Provider value={{
        userChats, userChatsError, isUserChatsLoading, potentialChats, createChat, updateCurrentChat,
        currentChat, messages, isMessagesLoading, messagesError, sendTextMessage, onlineUsers, notifications, allUsers,
        markAllNotificationsAsRead, markNotificationAsRead, markThisNotificationsAsRead
    }}>
        {children}
    </ChatContext.Provider>
    )
}