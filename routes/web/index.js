const express = require("express");

const router = express.Router();

router.get("/about", (req, res) => {
  return res.render("about", {
    title: "Todo app | About us",
    activeLink: "about",
  });
});

router.get("/contact", (req, res) => {
  return res.render("contact", {
    title: "Todo app | Contact us",
    activeLink: "contact",
  });
});

router.get("/login", (req, res) => {
  return res.render("login", {
    title: "Todo app | Login",
    activeLink: "login",
  });
});

router.get("/", (req, res) => {
  return res.render("index", {
    title: "Todo app | Home",
    activeLink: "home",
    todos: [
      { id: 1, todo: "Learn nodejs", isCompleted: false, userId: 1 },
      { id: 2, todo: "Learn expressjs", isCompleted: false, userId: 2 },
      { id: 3, todo: "Learn reactjs", isCompleted: false, userId: 1 },
      { id: 4, todo: "Learn mongodb", isCompleted: false, userId: 2 },
      { id: 5, todo: "Learn html", isCompleted: false, userId: 1 },
      { id: 6, todo: "Learn css", isCompleted: false, userId: 2 },
      { id: 7, todo: "Learn js", isCompleted: false, userId: 2 },
    ],
  });
});

module.exports = router;
