const Message = require("../models/Message");

exports.getMessages = async (req, res) => {
  const { consultationId } = req.params;
  const messages = await Message.find({ consultationId }).populate(
    "senderId",
    "name"
  );
  res.json(messages);
};
