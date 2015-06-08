WebVN.extend('util', function (exports)
{
    /**
     * @method keys
     */
    exports.keys = (function (objKeys)
    {
        if (objKeys)
        {
            return function (obj)
            {
                return objKeys(obj);
            };
        }

        return function (obj)
        {
            var ret = [],
                prop;

            for (prop in obj)
            {
                if (obj.hasOwnProperty(prop)) ret.push(prop);
            }

            return ret;
        }
    })(Object.keys);

    /**
     * Combine properties from all the objects into first one.
     * @method mixIn
     * @memberof util
     * @param {Object} target Target object.
     * @param {...Object} objects Objects to be combined.
     * @return {Object} Target object.
     */
    exports.mixIn = function (target, objects)
    {
        var i   = 0,
            len = arguments.length,
            obj;

        while (++i < len)
        {
            obj = arguments[i];
            if (obj != null) {
                exports.each(obj, function (val, key) { target[key] = val });
            }
        }

        return target;
    }

});