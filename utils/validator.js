module.exports.isValidString = (value) => typeof value === "string" && value.trim().length > 0;
module.exports.isValid = (value) => value !== null || typeof value !== 'undefined'