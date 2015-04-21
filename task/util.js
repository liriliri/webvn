// Iterate an object
exports.each = function (object, func) {
    "use strict";
    var key;
    for (key in object) {
        if (object.hasOwnProperty(key)) {
            func(object[key], key);
        }
    }
};