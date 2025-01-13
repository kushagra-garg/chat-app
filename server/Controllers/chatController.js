const chatModel = require("../Models/chatModel");

const createChat = async (req, res) => {
    try {
        const {firstId, secondId} = req.body;
        const chat = await chatModel.findOne({members: {$all: [firstId, secondId]}});
        if(chat) {
            return res.status(200).json(chat);
        }

        const newChat = new chatModel({members: [firstId, secondId]});
        const response = await newChat.save();
        return res.status(200).json(response);
    }
    catch(error) {
        console.log(error);
        res.status(500).json(error);
    }
}


const findUserChats = async (req, res) => {
    try {
        const userId = req.params.userId;
        const chats = await chatModel.find({members: {$in: [userId]}});
        return res.status(200).json(chats);
    }
    catch(error) {
        console.log(error);
        res.status(500).json(error);
    }
}

const findChat = async (req, res) => {
    try {
        const {firstId, secondId} = req.params;
        const chat = await chatModel.findOne({members: {$all: [firstId, secondId]}});
        return res.status(200).json(chat);
    }
    catch(error) {
        console.log(error);
        res.status(500).json(error);
    }
}

module.exports = {createChat, findUserChats, findChat};