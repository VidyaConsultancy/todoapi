const bcrypt = require("bcrypt");

module.exports.SALT = bcrypt.genSaltSync(10);