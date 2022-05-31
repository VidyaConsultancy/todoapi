const DB_PATH = require('./path').DB_PATH;
const validators = require("./validator");

module.exports = {
  DB_PATH,
  ...validators,
};