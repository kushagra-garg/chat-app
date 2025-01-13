const { Server } = require("socket.io");

const io = new Server({ cors: "http://localhost:5173" });

let onlineUser = [];

io.on("connection", (socket) => {
    console.log("new socket conn", socket.id);

    // listen to a connection
    socket.on("addNewUser", (userId) => {
        !onlineUser.some(user => user.userId === userId) &&
            onlineUser.push({
                userId,
                socketId: socket.id
            });
        console.log("onlineUsers", onlineUser);
        io.emit("getOnlineUsers", onlineUser);
    });

    // add message
    socket.on("sendMessage", (message) => {
        const user = onlineUser.find(u => u.userId === message.recipientId);
        if (user) {
            io.to(user.socketId).emit("getMessage", message);
            io.to(user.socketId).emit("getNotification", {
                chatId: message.chatId,
                senderId: message.senderId,
                isRead: false,
                date: new Date()
            });
        }
    })

    socket.on("disconnect", () => {
        onlineUser = onlineUser.filter(u => u.socketId !== socket.id);
        io.emit("getOnlineUsers", onlineUser);
    });

});

io.listen(3000);