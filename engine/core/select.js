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
    },
    adjacencyOperators = [ 'after', 'prepend', 'before', 'append' ],
    elementDisplay = {};

var slice = [].slice;

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

    util.mix(select, obj);

};

select.fn.extend = function (obj) {

    util.mix(select.fn, obj);

};

// Static methods
select.extend({
    contains: document.documentElement.contains ?
        function(parent, node) {

            return parent !== node && parent.contains(node);

        } :
        function(parent, node) {

            while (node && (node = node.parentNode)) {
                if (node === parent) {
                    return true;
                }
            }

            return false;

        },
    isSelect: function (o) {

        return o instanceof select;

    },
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

                if (util.isObject(name)) {
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
    get: function (idx) {

        return idx === undefined ? slice.call(this) : this[idx];

    },
    hasClass: function (name) {

        if (!name) {
            return;
        }

        return [].some.call(this, function (el) {

            return this.test(el.className);

        }, new RegExp('(^|\\s)' + name + '(\\s|$)'));

    },
    hide: function () {

        this.css('display', 'none');

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
    show: function () {

        return this.each(function(){

            if (getComputedStyle(this, '').getPropertyValue("display") == "none") {
                this.style.display = defaultDisplay(this.nodeName);
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

    },
    toArray: function () {

        return this.get();

    }
});

/* Generate 'after', 'prepend', 'before', 'append'
 * 'insertAfter', 'insertBefore', 'appendTo' and 'prependTo' methods
 */
adjacencyOperators.forEach(function (operator, idx) {

    var inside = idx % 2; // prepend, append

    select.fn[operator] = function () {

        // Arguments can be nodes, arrays of nodes and Html strings
        var nodeArray = util.map(arguments, function (arg) {

            return util.isString(arg) ? select.parseHTML(arg) : arg; 

        });

        var nodes = [];
        for (var i = 0, len = nodeArray.length; i < len; i++) {
            if (util.isArray(nodeArray[i])) {
                // Node array
                nodes = nodes.concat(nodeArray[i]);
            } else if (select.isSelect(nodeArray[i])) {
                // Select
                nodes = nodes.concat(nodeArray[i].toArray());
            } else {
                // Node
                nodes.push(nodeArray[i]);
            }
        }

        var parent, copyByClone = this.length > 1;

        if (nodes.length < 1) {
            return this;
        }

        return this.each(function (_, target) {

            parent = inside ? target : target.parentNode;

            switch (idx) {
                case 0:
                    target = target.nextSibling;
                    break;
                case 1:
                    target = target.firstChild;
                    break;
                case 2:
                    target = target;
                    break;
                default:
                    target = null;
                    break;
            }

            var parentInDocument = select.contains(document.documentElement, parent);

            nodes.forEach(function(node){

                if (copyByClone) {
                    node = node.cloneNode(true);
                } else if (!parent) {
                    return select(node).remove();
                }

                parent.insertBefore(node, target);

                if (parentInDocument) traverseNode(node, function(el){
                    if (el.nodeName != null && el.nodeName.toUpperCase() === 'SCRIPT' &&
                        (!el.type || el.type === 'text/javascript') && !el.src) {
                        window['eval'].call(window, el.innerHTML);
                    }
                });

            });

        });

    }

    select.fn[inside ? operator + 'To' : 'insert' + (idx ? 'Before' : 'After')] = function (html) {

        select(html)[operator](this);
        return this;

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

function defaultDisplay(nodeName) {

    var element, display;

    if (!elementDisplay[nodeName]) {
        element = document.createElement(nodeName);
        document.body.appendChild(element);
        display = getComputedStyle(element, '').getPropertyValue("display");
        element.parentNode.removeChild(element);
        display == "none" && (display = "block");
        elementDisplay[nodeName] = display;
    }

    return elementDisplay[nodeName];

}


// Handle function argument
function funcArg(context, arg, idx, payload) {

    return util.isFunction(arg) ? arg.call(context, idx, payload) : arg;

}

function maybeAddPx(name, value) {

    return (typeof value == "number" && !cssNumber[dasherize(name)]) ? value + "px" : value;

}

function setAttribute(node, name, value) {

    value == null ? node.removeAttribute(name) : node.setAttribute(name, value);

}

function traverseNode(node, fn) {

    fn(node);
    for (var i = 0, len = node.childNodes.length; i < len; i++) {
        traverseNode(node.childNodes[i], fn);
    }

}

return select;

});