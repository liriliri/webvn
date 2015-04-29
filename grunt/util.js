// Iterate an object
exports.each = function (object, func) {
    "use strict";
    var key;
    if (object.length === +object.length) {
        for (var i = 0, len = object.length; i < len; i++) {
            func(object[i], i);
        }
    } else {
        for (key in object) {
            if (object.hasOwnProperty(key)) {
                func(object[key], key);
            }
        }
    }
};