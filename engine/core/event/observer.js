/**
 * @namespace observer
 * @memberof event
 */
WebVN.extend('event', function (exports, util)
{
    /**
     * @name Event
     * @memberof event.observer
     */
    var Event = {};

    Event.on = function (name, cb, context)
    {
        context = context || this;

        var events = this._events;

        if (!events[name]) events[name] = [];

        events[name].push([cb, context]);

        this._events = events;
    };

    Event.listenTo = function (target, name, cb)
    {
        target.on(name, cb, this);
    };

    Event.trigger = function (name)
    {
        var events = this._events[name],
            args   = util.toArray(arguments);

        if (!events) return;

        args.shift();

        util.each(events, function (val)
        {
            val[0].apply(val[1], args)
        });
    };

    Event._events = {};

    /**
     * @method create
     * @memberof event.observer
     * @param {Object} object
     * @return {Object}
     */
    function create(object) { return util.mixIn(object, Event) }

    exports.observer = {
        create: create,
        Event: Event
    };
});