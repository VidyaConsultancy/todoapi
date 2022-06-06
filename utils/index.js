const DB_PATH = require('./path').DB_PATH;
const validators = require("./validator");
const constants = require("./constants");

module.exports = {
  DB_PATH,
  ...constants,
  ...validators,

};