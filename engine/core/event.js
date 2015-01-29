// Event module

webvn.add('event', function (s) {

var event = {};
    
var guid = 0; // Id for all handlers

// Add event to elem
event.add = function (elem, type, handler, selector) {

    if (!handler.guid) {
        handler.guid = guid++;
    }

    var events;

    // Init the element's event structure and main handler
    if (!(events = elem.events)) {
        events = elem.events = {};
    }
    // Each type of event has one eventHandle binded to the elem
    if (!(eventHandle = elem.handle)) {
        eventHandle = elem.handle = function (e) {
            return dispatch.apply(elem, arguments);
        };
    }

    var handleObj = {
        type: type,
        handler: handler,
        guid: handler.guid,
        selector: selector
    };

    if (!(handlers = events[type])) {
        handlers = events[type] = [];
        handlers.delegateCount = 0;
        if (elem.addEventListener) {
            elem.addEventListener(type, eventHandle, false);
        }
    }

    // Add to the element's handler list, delegates in front
    if (selector) {
        handlers.splice(handlers.delegateCount++, 0, handleObj);
    } else {
        handlers.push(handleObj);
    }

};

// Remove event on elem
event.remove = function () {

};

// Controls the execution of the right handler
function dispatch(event) {

    var handlers = this.events[event.type];

    var handlerQueue = getHandlerQueue.call(this, event, handlers);

    for (var i = 0, len = handlerQueue.length; i < len; i++) {
        var matched = handlerQueue[i];
        handlers = matched.handlers;
        for (var j = 0, len2 = handlers.length; j < len2; j++) {
            var handleObj = handlers[j];
            handleObj.handler.apply(matched.elem, [event]);
        }
    }

    return event.result;

}

// Return handler queue
function getHandlerQueue(event, handlers) {

    var hanlerQueue = [], handleObj,
        delegateCount = handlers.delegateCount,
        cur = event.target;

    if (delegateCount && cur.nodeType) {
        for (; cur !== this; cur = cur.parentNode || this) {
            var matches = [];
            for (var i = 0; i < delegateCount; i++) {
                handleObj = handlers[i];
                var sel = handleObj.selector;
                if (sel) {
                    matches[sel] = this.querySelectorAll(sel);
                }
                if (matches[sel]) {
                    matches.push(handleObj);
                }
            }
            if (matches.length) {
                hanlerQueue.push({
                    elem: cur,
                    handlers: matches
                });
            }
        }
    }

    // Add the remaining handlers
    if (delegateCount < handlers.length) {
        hanlerQueue.push({
            elem: this,
            handlers: handlers.slice(delegateCount)
        });
    }

    return hanlerQueue;

}

return event;

});