const express = require("express");

const router = express.Router();

router.get("/about", (req, res) => {
  return res.render("about", { title: "Todo app | About us" });
});

router.get("/contact", (req, res) => {
  return res.render("contact", { title: "Todo app | Contact us" });
});

router.get("/login", (req, res) => {
  return res.render("login", { title: "Todo app | Login" });
});

router.get("/", (req, res) => {
  return res.render("index", { title: "Todo app | Home" });
});


module.exports = router;
