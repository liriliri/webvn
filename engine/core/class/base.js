WebVN.extend('Class', function (exports)
{
    /**
     * @class
     * @memberof Class
     */
    var Base = exports.Base = exports.create(
        /** @lends Class.Base.prototype */
        {
            constructor: function Base () {},

            /**
             * Call super function.
             * @return {*}
             */
            callSuper: function ()
            {
                var method, obj,
                    self = this,
                    args = arguments;

                method = arguments.callee.caller;
                obj = self;

                var name = method.__name__;
                if (!name) return undefined;

                var member = method.__owner__.superclass[name];
                if (!member) return undefined;

                return member.apply(obj, args || []);
            }
        }
    );

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
});