const express = require("express");
const { createChat, findUserChats, findChat }  = require("../Controllers/chatController");

const router = express.Router();

router.post("/", createChat);
router.post("/find/:firstId/:secondId", findChat);
router.get("/:userId", findUserChats);

module.exports = router;