const express = require("express");
const router = express.Router();
const { login, signup } = require("../controllers/authController");

router.post("/login", login);
router.post("/signup", signup);

router.get("/", (req, res) => {
  res.send("Auth route working");
});

module.exports = router;
