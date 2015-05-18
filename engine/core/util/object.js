webvn.extend('util', function (exports) {
    'use strict';
    var keys = exports.keys = (function (objKeys) {
        if (objKeys) {
            return function (obj) {
                return objKeys(obj);
            };
        }

        return function (obj) {
            var ret = [], prop;

            for (prop in obj) {
                if (obj.hasOwnProperty(prop)) {
                    ret.push(prop);
                }
            }

            return ret;
        }
    })(Object.keys);

    /*
    exports.values = function (obj) {
        var _keys = keys(obj),
            len = _keys.length,
            values = new Array(len);

        for (var i = 0; i < len; i++) {
            values[i] = obj[keys[i]];
        }

        return values;
    };

    exports.merge = function () {

    };

    exports.mixIn = function () {

    };

    exports.clone = function (val) {
        switch (exports.type(val)) {
            case 'object':

        }
    };

    exports.deepClone = function (val) {

    };*/
});