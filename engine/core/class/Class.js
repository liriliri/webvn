/**
 * @namespace Class
 */
WebVN.module('Class', function (exports, util)
{
    var ObjCreate = Object.create;

    /**
     * Create new class.
     * @method create
     * @memberof Class
     * @param {Object} px
     * @param {Object} attrs
     * @param {Object} sx
     */
    exports.create = function (px, attrs, sx)
    {
        return Base.extend(px, attrs, sx);
    };

    /* Create a new class using px's constructor if exists.
     * Also set static method of the class
     */
    function create(px, sx)
    {
        px = px || {};
        sx = sx || {};

        var _class;

        // Whether a constructor is defined
        if (px.hasOwnProperty('constructor'))
        {
            _class = px.constructor;
        } else {
            _class = function () {};
            px.constructor = _class;
        }

        // Atach __name__ and __owner__ to each prototype method, used for callSuper
        util.each(px, function (val, key)
        {
            if (util.isFunction(val))
            {
                val.__name__  = key;
                val.__owner__ = _class;
            }
        });

        // Set statics
        util.each(sx, function (val, p)
        {
            _class[p] = val;
        });

        _class.extend = function (px, attrs, sx)
        {
            return extend.apply(null, [_class, px, attrs, sx]);
        };
        _class.prototype = px;

        return _class;
    }

    var Empty = function() {};

    /* Create a new object with prototype
     * equals to object.create
     */
    function createObj(proto, constructor)
    {
        var newProto;

        if (ObjCreate)
        {
            newProto = ObjCreate(proto);
        } else {
            Empty.prototype = proto;
            newProto = new Empty();
        }

        newProto.constructor = constructor;

        return newProto;
    }

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
                val.get = function ()
                {
                    return this['_' + key];
                }
            }
            if (!val.set)
            {
                val.set = function (val)
                {
                    this['_' + key] = val;
                }
            }
        });
        Object.defineProperties(newPx, attrs);

        // fn: Short name for prototype
        _class.fn        = newPx;
        _class.prototype = newPx;

        return _class;
    }

    /**
     * @class
     * @memberof Class
     */
    var Base = exports.Base = create(
        /** @lends Class.Base.prototype */
        {
            constructor: function Base () {},

            /**
             * Call super function.
             * @returns {*}
             */
            callSuper: function ()
            {
                var method, obj,
                    self = this,
                    args = arguments;

                method = arguments.callee.caller;
                obj = self;

                var name = method.__name__;
                if (!name) {
                    return undefined;
                }

                var member = method.__owner__.superclass[name];
                if (!member) {
                    return undefined;
                }

                return member.apply(obj, args || []);
            }
        }
    );
});