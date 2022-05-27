const DB_PATH = require('./path').DB_PATH;
const isValidString = require("./validator").isValidString;
const isValid = require("./validator").isValid;

module.exports = {
    DB_PATH,
    isValid,
    isValidString
}