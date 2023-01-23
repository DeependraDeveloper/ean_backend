/// check if search string is in the string or not empty
let isValid = function (value) {
    if (typeof value === "undefined" || typeof value === null) return false;
    if (typeof value === "string" && value.trim().length === 0) return false;
    return true;
};

/// check if eancode is valid or not
let isValidEanCode = function (value) {
    if (typeof value === "undefined" || typeof value === null) return false;
    if (typeof value === "string" && value.trim().length !== 13) return false;
    return true;
};

/// export all functions
 module.exports = {
    isValid,
    isValidEanCode,
 }