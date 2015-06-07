/**
 * @namespace state
 */
WebVN.module('state', function (exports, Class, util, event)
{
    /**
     * @class State
     * @memberof state
     */
    var State = exports.state = Class.create(
        /** @lends state.State.prototype */
        {
            constructor: function State(initial)
            {
                this.current = initial;
            },

            is: function (state)
            {
                return this.current === state;
            }
        }
    );

    State.extendFn(event.observer.Event);

    exports.create = function (initial, events)
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
                var exits = from.some(function (val) { return this.current === val }, this);

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