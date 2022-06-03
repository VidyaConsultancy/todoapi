const DB_PATH = require('./path').DB_PATH;
const validators = require("./validator");
const {SALT} = require("./constants");

module.exports = {
  DB_PATH,
  SALT,
  ...validators,
};