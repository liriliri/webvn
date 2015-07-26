WebVN.extend('Class', function (exports, util, event)
{
    /**
     * @class
     * @memberof Class
     * @property {String} current Current state.
     */
    var State = exports.State = exports.create(
        /** @lends Class.State.prototype */
        {
            constructor: function State(initial)
            {
                this.current = initial;
            },

            /**
             * Check the current is xxx or not.
             * @param {String} state
             * @return {Boolean}
             */
            is: function (state)
            {
                return this.current === state;
            }
        }
    );

    State.extendFn(event.observer.Event);

    State.create = function (initial, events)
    {
        var proto = {
            constructor: function ()
            {
                this.callSuper(initial);
            }
        };

        util.each(events, function (val)
        {
            var name = val.name,
                from = val.from,
                to   = val.to;

            if (!util.isArray(from)) from = [from];

            proto[name] = function ()
            {
                var exits = from.some(function (val)
                {
                    return this.current === val;
                }, this);

                if (exits)
                {
                    this.current = to;
                    this.trigger(name);
                }
            }
        });

        return State.extend(proto);
    };
});