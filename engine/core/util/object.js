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
    };

    var objCreate = Object.create;

    /**
     * Create a new object with prototype
     * equals to object.create
     * @method createObj
     * @memberof util
     */
    exports.createObj = function (proto, constructor, protoAlias)
    {
        var newProto;

        if (objCreate)
        {
            newProto = objCreate(proto);
        } else
        {
            Empty.prototype = proto;
            newProto        = new Empty();
        }

        if (constructor) newProto.constructor = constructor;

        if (protoAlias) newProto[protoAlias] = proto;

        return newProto;
    };

    function Empty() {}
});