WebVN.extend('util', function (exports)
{
    "use strict";

    /**
     * @method endsWith
     * @param str
     * @param suffix
     * @return {Boolean}
     */
    exports.endsWith = function (str, suffix)
    {
        var index = str.length - suffix.length;

        return index >= 0 && str.indexOf(suffix, index) === index;
    };

    /**
     * @method startsWith
     * @param str
     * @param prefix
     * @return {Boolean}
     */
    exports.startsWith = function (str, prefix)
    {
        return str.indexOf(prefix) === 0;
    };

    var regTrim = /^\s+|\s+$/g;

    /**
     * @method trim
     * @param str
     * @return {String}
     */
    exports.trim = function (str)
    {
        return str.replace(regTrim, '');
    };

});