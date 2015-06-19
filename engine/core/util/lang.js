WebVN.extend('util', function (exports)
{
    var regType  = /^\[object (.*)]$/,
        toString = Object.prototype.toString,
        UNDEFINED;

    /**
     * @method type
     */
    var type = exports.type = function (val)
    {
        if (val === null)      return 'null';
        if (val === UNDEFINED) return 'undefined';

        return regType.exec(toString.call(val))[1]
                      .toLowerCase();
    };

    var isArray = exports.isArray;

    /**
     * @method isNumber
     * @return {Boolean}
     */
    var isNumber = exports.isNumber = function (val)
    {
        return type(val) === 'number';
    };

    /**
     * @method isInteger
     * @param val
     */
    exports.isInteger = function (val)
    {
        return isNumber(val) && (val % 1 === 0);
    };

    /**
     * @method isString
     * @param val
     * @return {Boolean}
     */
    exports.isString = function (val)
    {
        return type(val) === 'string';
    };

    /**
     * @method isObject
     * @param val
     * @return {Boolean}
     */
    var isObject = exports.isObject = function (val)
    {
        return type(val) === 'object';
    };

    /**
     * @method isPlainObject
     * @param val
     * @return {Boolean}
     */
    exports.isPlainObject = function (val)
    {
        return isObject(val) && val.constructor === Object;
    };

    /**
     * @method toArray
     * @param val
     * @returns {Array}
     */
    exports.toArray = function (val)
    {
        if (val == null)  return [];
        if (isArray(val)) return val;

        var _type = type(val),
            len   = val.length,
            ret;

        if (len   ==  null     ||
            _type === 'string' ||
            _type === 'function') return [val];

        ret = [];
        while (len--) ret[len] = val[len];

        return ret;
    };
});