const express = require("express");
const http = require("http");

const app = express();
const server = http.createServer(app);
const PORT = 3000;

app.get("/", (req, res, next) => {
    return res.send("Welcome to express server");
})

app.get("/users", (req, res, next) => {
    return res.send("This willl give your users list");
})

app.all("/test", (req, res, next) => {
    console.log("I am in between");
    return res.send('I cut the req res in between');
}, (req, res, next) => {
    return res.send("I am test route")
});

server.listen(PORT, () => {
    console.log(`Express application is listening at http://localhost:${PORT}`)
});