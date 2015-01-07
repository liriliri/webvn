// A jQuery like selector module

webvn.add('select', ['util'], function (s, util) {

var select = function (selector, context) {

    return new select.fn.init(selector, context);

};

select.fn = select.prototype = {

    constructor: select,

    selector: '',

    length: 0,

    // Push elements onto the stack
    pushStack: function (elems) {

        // Build a new matched element set
        return select.merge(this.constructor(), elems);

    }
};

// Simple extend method
select.extend = function (obj) {

    util.extend(select, obj);

};

select.fn.extend = function (obj) {

    util.extend(select.fn, obj);

};

// Static methods
select.extend({
    // Merge an array
    merge: function (first, second) {

        var len = +second.length,
            i = first.length;

        for (var j = 0; j < len; j++) {
            first[i++] = second[j];
        }

        first.length = i;

        return first;

    },
    // Convert html string to actural dom element
    parseHTML: function (data) {

        // Div for creating nodes
        var div = document.createElement('div');

        if ( !data || !util.isString(data)) {
            return null;
        }

        div.innerHTML = data;
        var elements = div.childNodes;

        return select.merge([], elements);

    }
});

// Multifunctional method to get and set values of a collection
var access = select.access = function (elems, fn, key, value, chainable, emptyGet, raw) {

    var len = elems.length,
        // Whether key is null
        bulk = key === null;

    if (value !== undefined) {

        chainable = true;

        if (!util.isFunc(value)) {
            raw = true;
        }

        if (bulk) {
            if (raw) {
                fn.call(elems, value);
                fn = null;
            }
        }

        if (fn) {
            for (var i = 0; i < len; i++) {
                fn(elems[i], key, value);
            }
        }

    }

    return chainable ?
        elems :
        bulk ? 
            fn.call(elems) :
            len ? fn (elems[0], key) : emptyGet;

};

// Judge the type of selector and do different initialization
select.fn.init = function (selector, context) {

    if (!selector) {
        return this;
    }

    // Handle html string
    if (selector[0] === "<" &&
        selector[selector.length - 1] === ">" &&
        selector.length >= 3 ) {
        return this.pushStack(select.parseHTML(selector));
    }

    // Handle: #a .b
    if (util.isString(selector)) {
        if (!context) {
            return rootSelect.find(selector);
        }
    // Handle: dom
    } else if (selector.nodeType) {
        this.context = this[0] = selector;
        this.length = 1;
        return this;
    }

};

// Give the init prototype to be select's fn
select.fn.init.prototype = select.fn;

// Wrapper of querySelectorAll
select.fn.find = function (selector, context) {

    var len = this.length,
        self = this,
        result = [];

    for (var i = 0; i < len; i++) {
        /* Well, jQuery uses sizzle to select element
         * I don't think it's necessary for this project
         */
        select.merge(result, self[i].querySelectorAll(selector));
    }

    return this.pushStack(result);

};

// Initialize central reference
rootSelect = select(document);

// Below are functions like css, html, attr, etc
select.fn.extend({

    // Get or set html
    html: function (value) {

        return access(this, function (value) {

            var elem = this[0] || {},
                len = this.length;

            // Get value, only the first element
            if (value === undefined && elem.nodeType === 1) {
                return elem.innerHTML;
            }

            if (util.isString(value)) {
                try {
                    for (var i = 0; i < len; i++) {
                        elem = this[i] || {};
                        if (elem.nodeType === 1) {
                            elem.innerHTML = value;
                        }
                    }
                } catch (e) {}
            }

        }, null, value);

    }

});

return select;

});