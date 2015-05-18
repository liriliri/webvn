webvn.extend('util', function (exports) {
    "use strict";
    exports.endsWith = function (str, suffix) {
        var index = str.length - suffix.length;

        return index >= 0 && str.indexOf(suffix, index) === index;
    };

    exports.startsWith = function (str, prefix) {
        return str.indexOf(prefix) === 0;
    };

    exports.trim = function (str) {
        return str.replace(regTrim, '');
    };
    var regTrim = /^\s+|\s+$/g;
});