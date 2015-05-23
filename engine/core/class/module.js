webvn.extend('Class', function (exports, util) {
    'use strict';
    exports.module = function (requires, fn) {
        var exports = {};

        if (util.isFunction(requires) && fn === undefined) {
            fn = requires;
            requires = [];
        }

        webvn.use(requires, function() {
            var args = util.toArray(arguments);
            args.splice(args.length - 1, 0, exports);
            var ret = fn.apply(null, args);
            if (ret) exports = ret;
        });

        return exports;
    };
});