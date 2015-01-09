// A jQuery like selector module

webvn.add('select', ['util'], function (s, util) {

var cssNumber = {
        'column-count': 1, 
        'columns': 1, 
        'font-weight': 1, 
        'line-height': 1,
        'opacity': 1, 
        'z-index': 1, 
        'zoom': 1 
    };

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

/* Below are functions like css, html, attr, etc
 * At first I'd like to copy some code from jQuery
 * But it's really not that easy to understand every pieces of its code
 * Now I copy code from zepto, which is much much easier to do
 */
select.fn.extend({
    addClass: function (name) {

        if (!name) {
            return this;
        }

        return this.each(function (idx) {

            if (!('className' in this)) {
                return;
            }

            var classList = [],
                cls = this.className,
                newName = funcArg(this, name, idx, cls);

            newName.split(/\s+/g).forEach(function (kclass) {

                if (!select(this).hasClass(kclass)) {
                    classList.push(kclass);
                }

            }, this);

            if (classList.length) {
                this.className = cls + (cls ? ' ' : '') + classList.join('');
            }

        });

    },
    attr: function (name, value) {

        var ret;

        return (util.isString(name) && !(1 in arguments)) ?
            // Get attributes
            (!this.length || this[0].nodeType !== 1 ? undefined :
                (!(ret = this[0].getAttribute(name)) && name in this[0]) ? this[0][name] : ret
            ) :
            // Set attributes
            this.each(function (idx) {

                if (this.nodeType !== 1) {
                    return;
                }

                if (util.isObj(name)) {
                    for (var key in name) {
                        setAttribute(this, key, name[key]);
                    }
                } else {
                    setAttribute(this, name, funcArg(this, value, idx, this.getAttribute(name)));
                }

            });

    },
    // Get or set css value
    css: function (property, value) {

        // Get style value
        if (arguments.length < 2) {
            var computedStyle, element = this[0];
            if (!element) {
                return;
            }
            computedStyle = getComputedStyle(element, '');
            if (util.isString(property)) {
                return element.style[camelize(property)] || computedStyle.getPropertyValue(property);
            } else if (util.isArray(property)) {
                var props = {};
                util.each(property, function (prop) {

                    props[prop] = (element.style[camelize(prop)] || computedStyle.getPropertyValue(prop));

                });
                return props;
            }
        }

        // Set style value
        var css = '';
        if (util.isString(property)) {
            if (!value && value !== 0) {
                this.each(function () {

                    this.style.removeProperty(dasherize(property));

                });
            } else {
                css = dasherize(property) + ":" + maybeAddPx(property, value)
            }
        } else {
            for (var key in property) {
                if (!property[key] && property[key] !== 0) {
                    this.each(function(){ 

                        this.style.removeProperty(dasherize(key));

                    });
                } else {
                    css += dasherize(key) + ':' + maybeAddPx(key, property[key]) + ';';
                }
            }
        }

        return this.each(function(){ this.style.cssText += ';' + css });
        
    },
    // Iterate elements
    each: function (fn) {

        util.each(this, function (el, idx) {

            return fn.call(el, idx, el) !== false;

        });

        return this;

    },
    // Set innerHtml to empty
    empty: function () {

        return this.each(function () {

            this.innerHTML = '';

        });

    },
    first: function () {

        return select(this[0]);

    },
    hasClass: function (name) {

        if (!name) {
            return;
        }

        return [].some.call(this, function (el) {

            return this.test(el.className);

        }, new RegExp('(^|\\s)' + name + '(\\s|$)'));

    },
    // Get or set html
    html: function (html) {

        return 0 in arguments ?
            // Set html
            this.each(function (idx) {

                var originHtml = this.innerHTML;
                this.innerHTML = funcArg(this, html, idx, originHtml);

            }) :
            // Get html
            (0 in this ? this[0].innerHTML : null);

    },
    last: function () {

        return select(this[this.length - 1]);

    },
    // Remove all the dom nodes
    remove: function () {

        return this.each(function () {

            if (this.parentNode != null) {
                this.parentNode.removeChild(this);
            }

        });

    },
    text: function (text) {

        return 0 in arguments ?
            // Set text
            this.each(function (idx) {

                var newText = funcArg(this, text, idx, this.textContent);
                this.textContent = newText == null ? '' : '' + newText;

            }) :
            // Get text
            (0 in this ? this[0].textContent : null);

    }
});

// Private function

function camelize (str) {

    return str.replace(/-+(.)?/g, function(match, chr){

        return chr ? chr.toUpperCase() : '' 

    });

}

function dasherize(str) {

    return str.replace(/::/g, '/')
           .replace(/([A-Z]+)([A-Z][a-z])/g, '$1_$2')
           .replace(/([a-z\d])([A-Z])/g, '$1_$2')
           .replace(/_/g, '-')
           .toLowerCase();

}

// Handle function argument
function funcArg(context, arg, idx, payload) {

    return util.isFunc(arg) ? arg.call(context, idx, payload) : arg;

}

function maybeAddPx(name, value) {

    return (typeof value == "number" && !cssNumber[dasherize(name)]) ? value + "px" : value;

}

function setAttribute(node, name, value) {

    value == null ? node.removeAttribute(name) : node.setAttribute(name, value);

}

return select;

});