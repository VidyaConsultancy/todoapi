const express = require("express");
const http = require("http");
const createError = require("http-errors");

const app = express();
const server = http.createServer(app);
const PORT = 3000;

const apiRouter = require("./routes/apis");
const webRouter = require("./routes/web");

app.use(express.json({ limit: "5mb" }));
app.use(express.urlencoded({ extended: true }));

app.get("/", webRouter);
app.use("/api", apiRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

server.listen(PORT, () => {
  console.log(`Express application is listening at http://localhost:${PORT}`);
});
