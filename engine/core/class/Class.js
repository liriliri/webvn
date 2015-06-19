/**
 * @namespace Class
 */
WebVN.module('Class', function (exports, util)
{
    var ObjCreate = Object.create;

    /* Create a new class using px's constructor if exists.
     * Also set static method of the class
     */
    var create = exports.create = function (px, sx)
    {
        px = px || {};
        sx = sx || {};

        var _class;

        if (px.hasOwnProperty('constructor'))
        {
            _class = px.constructor;
        } else {
            _class = function () {};
            px.constructor = _class;
        }

        util.each(px, function (val, key)
        {
            if (util.isFunction(val))
            {
                val.__name__  = key;
                val.__owner__ = _class;
            }
        });

        util.each(sx, function (val, p) { _class[p] = val });

        _class.extend = function (px, attrs, sx)
        {
            return extend.apply(null, [_class, px, attrs, sx]);
        };
        _class.prototype = px;

        return _class;
    };

    function Empty() {}

    /**
     * Create a new object with prototype
     * equals to object.create
     * @method createObj
     * @memberof Class
     */
    function createObj(proto, constructor)
    {
        var newProto;

        if (ObjCreate)
        {
            newProto = ObjCreate(proto);
        } else
        {
            Empty.prototype = proto;
            newProto        = new Empty();
        }

        if (constructor) newProto.constructor = constructor;

        return newProto;
    }

    exports.createObj = createObj;

    /* Extend a class that already exist.
     * All it does is just to set the superClass's prototype into px's __proto__.
     */
    function extend(superClass, px, attrs, sx)
    {
        attrs = attrs || {};

        var _class = create(px, sx),
            newPx  = createObj(superClass.prototype, _class),
            keys   = util.keys(px),
            key, i, len;

        for (i = 0, len = keys.length; i < len; i++)
        {
            key        = keys[i];
            newPx[key] = px[key];
        }

        _class.superclass = superClass.prototype;
        _class.extendFn   = function (obj)
        {
            util.mix(newPx, obj);
        };

        // Define getter and setter
        util.each(attrs, function (val, key)
        {
            if (!val.get)
            {
                val.get = function () { return this['_' + key] }
            }
            if (!val.set)
            {
                val.set = function (val) { this['_' + key] = val }
            }
        });
        Object.defineProperties(newPx, attrs);

        // fn: Short name for prototype
        _class.fn        = newPx;
        _class.prototype = newPx;

        return _class;
    }
});