const express = require("express");
const ConversationController = require("../controllers/conversation.controller");
const { VerifyToken } = require("../middleware/verifyToken");
const router = express.Router();

router.post("/send/:id", VerifyToken, ConversationController.sendMessage);
router.get("/:id", VerifyToken, ConversationController.getMessages);
module.exports = router;
