webvn.extend('util', function (exports) {
    "use strict";
    var type = exports.type = function (val) {
        if (val === null) return 'null';
        if (val === UNDEFINED) return 'undefined';

        return regType.exec(toString.call(val))[1]
                .toLowerCase();
    };
    var UNDEFINED,
        regType = /^\[object (.*)]$/,
        toString = Object.prototype.toString;

    var isNumber = exports.isNumber = function (val) {
        return type(val) === 'number';
    };

    exports.isInteger = function (val) {
        return isNumber(val) && (val % 1 === 0);
    };

    exports.isString = function (val) {
        return type(val) === 'string';
    };

    exports.isFunction = function (val) {
        return type(val) === 'function';
    };

    var isObject = exports.isObject = function (val) {
        return type(val) === 'object';
    };

    var isArray = exports.isArray = function (val) {
        return type(val) === 'array';
    };

    exports.isPlainObject = function (val) {
        return isObject(val) && val.constructor === Object;
    };

    exports.toArray = function (val) {
        if (val == null) return [];
        if (isArray(val)) return val;

        var _type = type(val),
            len = val.length, ret;

        if (len == null ||
            _type === 'string' ||
            _type === 'function') {
            return [val];
        }

        ret = [];
        while(len--) ret[len] = val[len];

        return ret;
    };
});