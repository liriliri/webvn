/* Event module
 * Note: jQuery's implementation is too complex for this one
 * Zepto's implementation is way too simple and has some kind of problem
 * Now I have to implement my own version :(
 */
webvn.module('event', function (util, select, Class) {

    var event = {};

    /* Add event
     * All events are attached to the elem's events, it looks as below:
     * ele.events = {
     *      'click': [],
     *      'mouseenter': []
     * }
     */
    event.add = function (ele, type, fn, selector) {

        var handleObj = {
            selector: selector,
            handler: fn
        }, handlers;

        if (!ele.events) {
            ele.events = {};
        }
        if (!(handlers = ele.events[type])) {
            handlers = ele.events[type] = [];
            handlers.delegateCount = 0;
            ele.addEventListener(type, function (e) {

                trigger.apply(ele, arguments);

            }, false);
        }

        if (selector) {
            handlers.splice(handlers.delegateCount++, 0, handleObj);
        } else {
            handlers.push(handleObj);
        }

    };

    event.Event = Class.create({
        constructor: function Event(e) {

            this.originalEvent = e;

        },
        isDefaultPrevented: returnFalse,
        isPropagationStopped: returnFalse,
        isImmediatePropagationStopped: returnFalse,
        preventDefault: function () {

            var e = this.originalEvent;
            this.isDefaultPrevented = returnTrue;
            if (e && e.preventDefault) {
                e.preventDefault();
            }

        },
        stopPropagation: function () {

            var e = this.originalEvent;
            this.isPropagationStopped = returnTrue;
            if (e && e.stopPropagation) {
                e.stopPropagation();
            }

        },
        stopImmediatePropagation: function () {

            var e = this.originalEvent;
            this.isImmediatePropagationStopped = returnTrue;
            if (e && e.stopImmediatePropagation) {
                e.stopImmediatePropagation();
            }
            this.stopPropagation();

        }
    });

    function returnFalse() {

        return false;

    }

    function returnTrue() {

        return true;

    }

    function trigger(e) {

        var handlers = this.events[e.type],
            handlerObj,
            handlerQueue = formatHandlers.call(this, e, handlers);

        e = new event.Event(e);

        var i, j, matched, ret;

        i = 0;
        while ((matched = handlerQueue[i++]) && !e.isPropagationStopped()) {
            e.currentTarget = matched.elem;
            j = 0;
            while ((handleObj = matched.handlers[j++]) && !e.isImmediatePropagationStopped()) {
                ret = handleObj.handler.apply(matched.elem, [e]);
                if (ret === false) {
                    e.preventDefault();
                    e.stopPropagation();
                }
            }
        }

    }

    function formatHandlers(e, handlers) {

        var cur = e.target,
            matches,
            handlerQueue = [],
            delegateCount = handlers.delegateCount;

        if (cur.nodeType) {
            for (; cur !== this; cur = cur.parentNode || this) {
                matches = [];
                for (var i = 0; i < delegateCount; i++) {
                    handleObj = handlers[i];
                    sel = handleObj.selector + ' ';
                    if (matches[sel] === undefined) {
                        matches[sel] = util.contains(this.querySelectorAll(sel), cur);
                    }
                    if (matches[sel]) {
                        matches.push(handleObj);
                    }
                }
                if (matches.length) {
                    handlerQueue.push({elem: cur, handlers: matches});
                }
            }
        }
        if (delegateCount < handlers.length) {
            handlerQueue.push({
                elem: this,
                handlers: handlers.slice(delegateCount)
            });
        }

        return handlerQueue;

    }

    // Extend select method
    select.Select.extendFn({
        /**
         * Event binding
         * @method webvn.select.Select#on
         * @param {string} type
         * @param {string=} selector
         * @param {function} fn
         * @returns {Select}
         */
        on: function (type, selector, fn) {
            if (fn === undefined) {
                fn = selector;
                selector = undefined;
            }
            return this.each(function (_, ele) {
                event.add(ele, type, fn, selector);
            });
        }
    });

    return event;

});