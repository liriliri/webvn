/* Event module
 * Inspired by zepto.js
 */

webvn.add('event', ['util', 'select'], function (s, util, select) {

var eventModule = {};

var hover = {
        mouseenter: 'mouseover',
        mouseleave: 'mouseout'
    },
    focusinSupported = 'onfocusin' in window,
    focus = {
        focus: 'focusin',
        blur: 'focusout'
    },
    eventMethods = {
        preventDefault: 'isDefaultPrevented',
        stopImmediatePropagation: 'isImmediatePropagationStopped',
        stopPropagation: 'isPropagationStopped'
    };

var _uid = 1,
    handlers = {};

// Add event
eventModule.add = function (element, events, fn, data, selector, delegator, capture) {

    var id = uid(element), set = (handlers[id] || (handlers[id] = []));

    events.split(/\s/).forEach(function (event) {

        var handler = parse(event);
        handler.fn = fn;
        handler.sel = selector;

        if (handler.e in hover) {
            var related = e.relatedTarget;
            if (!related || (related !== this) && !select.contains(this, related));
        }

        handler.del = delegator;
        var callback = delegator || fn;
        handler.proxy = function (e) {

            e = compatible(e);
            if (e.isImmediatePropagationStopped()) {
                return;
            }
            e.data = data;
            var result = callback.apply(element, e._args == undefined ? [e] : [e].concat(e._args));
            if (result === false) {
                e.preventDefault();
                e.stopPropagation();
            }
            return result;
        }
        handler.i = set.length;
        set.push(handler);
        if ('addEventListener' in element) {
            element.addEventListener(realEvent(handler.e), handler.proxy, eventCapture(handler, capture));
        }

    });

};

function compatible(event, source) {

    if (source || !event.isDefaultPrevented) {
        source || (source = event);
        util.each(eventMethods, function (predicate, name) {

            var sourceMethod = source[name];
            event[name] = function () {
                this[predicate] = returnTrue;
                return sourceMethod && sourceMethod.apply(source, arguments);
            };
            event[predicate] = returnFalse;

        });

        if (source.isDefaultPrevented !== undefined ? source.defaultPrevented :
            'returnValue' in source ? source.returnValue === false :
            source.getPreventDefault && source.getPreventDefault()) {
            event.isDefaultPrevented = returnTrue;
        }
    }

    return event;

}

function eventCapture(handler, captureSetting) {

    return handler.del &&
        (!focusinSupported && (handler.e in focus)) ||
        !!captureSetting;

}

function parse(event) {

    var parts = ('' + event).split('.');

    return {
        e: parts[0],
        ns: parts.slice(1).sort().join('')
    };

}

function realEvent(type) {

    return hover[type] || (focusinSupported && focus[type]) || type;

}

function returnFalse() {

    return false;

}

function returnTrue() {

    return true;

}

function uid(element) {

    return element.uid || (element.uid = _uid++);

}

// Extend select module
select.fn.on = function (event, selector, data, callback, one) {

    var autoRemove, delegator, $this = this;
    if (event && !util.isString(event)) {
        util.each(event, function (fn, type) {
            $this.on(type, selector, data, fn, one);
        });
        return $this;
    }

    if (!util.isString(selector) && !util.isFunction(callback) && callback !== false) {
        callback = data, data = selector, selector = undefined;
    }

    if (callback === undefined || data === false) {
        callback = data, data = undefined;
    }

    if (callback === false) {
        callback = returnFalse;
    }

    return $this.each(function (_, element) {

        if (one) {
            autoRemove = function (e) {

                remove(element, e.type, callback);
                return callback.apply(this, arguments);

            };
        } 

        if (selector) {
            delegator = function (e) {
                var evt,
                    match = select(e.target).closest(selector, element).get(0);
                if (match && match !== element) {
                    evt = select.extend(createProxy(e), {currentTarget: match, liveFired: element})
                    return (autoRemove || callback).apply(match, [evt].concat(slice.call(arguments, 1)))
                }
            };
        }

        eventModule.add(element, event, callback, data, selector, delegator || autoRemove);
    });

};

return eventModule;

});