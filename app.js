const express = require("express");
const http = require("http");
const createError = require("http-errors");
const path = require("path");
const logger = require("morgan");
const mongodb = require("mongodb");

const app = express();
const server = http.createServer(app);
const PORT = 3000;
const MONGODB_URL = "mongodb://localhost:27017/todos";

const apiRouter = require("./routes/apis");
const webRouter = require("./routes/web");

app.use(logger("dev"));
app.use(express.json({ limit: "5mb" }));
app.use(express.urlencoded({ extended: true }));

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));

app.use((req, res, next) => {
  const mongoClient = new mongodb.MongoClient(MONGODB_URL);
  let db;
  mongoClient
    .connect()
    .then(async (client) => {
      db = client.db("todos"); // use db_name
      req.db = db;
      res.locals.client = client;
      res.locals.db = db;
      next();
      // client.close().then(_ => console.log('connection closed'));
      // const insertRes = await db.collection("tests").insertOne({ title: "Test II", description: "Test II description" });
      // console.log(insertRes);
      // const findRes = await db.collection("tests").find({});
      // findRes.forEach((test) => {
      //   console.log(test);
      // })
      // client.close();
    })
    .catch((err) => {
      console.error(`Mongodb connection error ${err.message}`);
      return res.status(500).json(err);
    });
});

app.use("/", webRouter);
app.use("/api", apiRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

server.listen(PORT, () => {
  console.log(`Express application is listening at http://localhost:${PORT}`);
});
