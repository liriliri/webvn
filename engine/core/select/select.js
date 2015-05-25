webvn.extend('select', function (exports, Class, util) {
    "use strict";

    var selectUtil = exports.util;

    /**
     * Create New Select Object
     * @function webvn.select.create
     * @param {string} name node name, div, canvas...
     * @returns {Select}
     */
    exports.create = function (name) {
        var element = document.createElement(name);
        return new Select(element);
    };

    /**
     * Get Select Object by Selector
     * @function webvn.select.get
     * @param {string} selector
     * @returns {Select}
     */
    exports.get = function (selector) {
        return new Select(selector);
    };

    var emptyArr = [],
        slice = emptyArr.slice;
    /**
     * Select class
     * @class webvn.select.Select
     * @param {string|object} selector
     */
    var Select = exports.Select = Class.create({
        /**
         * @memberof webvn.select.Select
         */
        length: 0,
        constructor: function Select(selector) {
            /* Nothing is passed in
             * Return empty Select instance
             */
            if (!selector) {
                return this;
            }
            // No context specified
            if (util.isString(selector)) {
                return rootSelect.find(selector);
            } else if (selector.nodeType) {
                // Handle: dom
                this[0] = selector;
                this.length = 1;
            }
        },
        /**
         * Get the descendants of each element in the current set
         * of matched elements, filtered by a selector.
         * @method webvn.select.Select#find
         * @param {string} selector
         */
        find: function (selector) {
            var result = [];
            util.each(this, function (value) {
                Select.merge(result, value.querySelectorAll(selector));
            });
            var select = new Select();
            return Select.merge(select, result);
        },
        /**
         * Iterate elements
         * @method webvn.select.Select#each
         * @param {function} fn
         * @returns {Select}
         */
        each: function (fn) {
            util.each(this, function (element, index) {
                fn.call(element, index, element);
            });
            return this;
        },
        /**
         * Return first element.
         * @method webvn.select.Select#first
         * @returns {Select}
         */
        first: function () {
            return new Select(this[0]);
        },
        /**
         * Return last element.
         * @method webvn.select.Select#last
         * @returns {Select}
         */
        last: function () {
            return new Select(this[this.length - 1]);
        },
        /**
         * Determine whether any of the matched elements are assigned the given class.
         * @method webvn.select.Select#hasClass
         * @param {string} name
         * @returns {boolean}
         */
        hasClass: function (name) {
            return emptyArr.some.call(this, function (element) {
                return this.test(element.className);
            }, new RegExp('(^|\\s)' + name + '(\\s|$)'));
        },
        /**
         * Adds the specified class(es) to each element in the set of matched elements.
         * @method webvn.select.Select#addClass
         * @param {string} name
         * @returns {Select}
         */
        addClass: function (name) {
            return this.each(function (index) {
                var classList = [];
                // Only add classes that do not exist
                name.split(/\s+/g).forEach(function (value) {
                    var select = new Select(this);
                    if (!select.hasClass(value)) {
                        classList.push(value);
                    }
                }, this);
                // Add new classes
                if (classList.length) {
                    var cn = this.className;
                    this.className += (cn ? ' ' : '') + classList.join(' ');
                }
            });
        },
        /**
         * Removes class(es)
         * @method webvn.select.Select#removeClass
         * @param {string} name
         * @returns {Select}
         */
        removeClass: function (name) {
            return this.each(function () {
                var classList = this.className;
                name.split(/\s+/g).forEach(function (Class) {
                    classList = classList.replace(new RegExp('(^|\\s)' + Class + '(\\s|$)'), " ");
                });
                this.className = classList;
            });
        },
        /**
         * Set Text
         * @method webvn.select.Select#text
         * @param {string} text
         * @returns {Select}
         */
        /**
         * Get Text
         * @method webvn.select.Select#text
         * @returns {string}
         */
        text: function (text) {
            // Get text
            if (text === undefined) {
                return this[0].textContent;
            }
            // Set text
            return this.each(function (index) {
                this.textContent = text;
            });
        },

        visible: function (visiblity) {
            if (visiblity === undefined) {
                return this.css('display') !== 'none';
            }
            if (visiblity) {
                return this.show();
            } else {
                return this.hide();
            }
        },

        /**
         * Display Element
         * @method webvn.select.Select#show
         * @returns {Select}
         */
        show: function () {
            return this.each(function () {
                if (getComputedStyle(this, '').getPropertyValue('display') === 'none') {
                    this.style.display = selectUtil.defaultDisplay(this.nodeName);
                }
            });
        },
        /**
         * Get Style Value
         * @method webvn.select.Select#css
         * @param {string|Array} property
         * @returns {string|object}
         */
        /**
         * Set Style Value
         * @method webvn.select.Select#css
         * @param {object|string} property
         * @param {string=} value
         * @returns {Select}
         */
        css: function (property, value) {
            // Get style value
            if (value === undefined) {
                var computedStyle, element = this[0];
                computedStyle = getComputedStyle(element, '');
                // Handle: String
                if (util.isString(property)) {
                    return element.style[selectUtil.camelize(property)] || computedStyle.getPropertyValue(property);
                } else if (util.isArray(property)) {
                    // Handle: Array
                    var props = {};
                    util.each(property, function (prop) {
                        props[prop] = element.style[camelize(prop)] || computedStyle.getPropertyValue(property);
                    });
                    return props;
                }
            }
            var css = '';
            // Set style value
            if (util.isString(property)) {
                css = selectUtil.dasherize(property) + ':' + selectUtil.addPx(property, value);
            } else {
                // Handle: Object
                util.each(property, function (value, key) {
                    css += selectUtil.dasherize(key) + ':' + selectUtil.addPx(key, value) + ';';
                });
            }
            return this.each(function () {
                this.style.cssText += ';' + css;
            });
        },
        cssComputed: function (property) {
            var computedStyle, element = this[0], ret;
            computedStyle = getComputedStyle(element, '');
            if (util.isString(property)) {
                ret = computedStyle.getPropertyValue(property);
                return selectUtil.removePx(property, ret);
            } else if (util.isArray(property)) {
                // Handle: Array
                var props = {};
                util.each(property, function (prop) {
                    props[prop] = computedStyle.getPropertyValue(property);
                    props[prop] = removePx(prop, props[prop]);
                });
                return props;
            }
        },
        width: function () {
            return this.cssComputed('width');
        },
        /**
         * Set Element Attribute
         * @method webvn.select.Select#attr
         * @param {string|object} name
         * @param {string=} value
         * @returns {Select}
         */
        /**
         * Get Element Attribute
         * @method webvn.select.Select#attr
         * @param {string} name
         */
        attr: function (name, value) {
            // Get attributes
            if (value === undefined && util.isString(name)) {
                return this[0].getAttribute(name);
            }
            // Set attributes
            var self = this;
            return this.each(function () {
                if (util.isObject(name)) {
                    util.each(name, function (value, key) {
                        selectUtil.setAttribute(self, key, value);
                    });
                } else {
                    selectUtil.setAttribute(this, name, value);
                }
            });
        },

        data: function (name, value) {
            if (util.isString(name)) {
                name = 'data-' + name;
            } else if (util.isObject(name)) {
                util.each(name, function (value, key) {
                    name[key] = 'data-' + value;
                });
            }

            return this.attr(name, value);
        },

        val: function (val) {
            if (val === undefined) {
                return this[0] && this[0].value;
            }

            return this.each(function () {
                this.value = val;
            });
        },

        removeAttr: function (name) {
            return this.each(function () {
                if (this.nodeType === 1) {
                    name.split(' ').forEach(function (name) {
                        selectUtil.setAttribute(this, name);
                    }, this);
                }
            });
        },

        /**
         * Set HTML
         * @method webvn.select.Select#html
         * @param {string} html
         * @returns {Select}
         */
        /**
         * Get HTML
         * @method webvn.select.Select#html
         * @returns {string}
         */
        html: function (html) {
            // Get html
            if (html === undefined) {
                return this[0].innerHTML;
            }
            // Set html
            return this.each(function () {
                this.innerHTML = html;
            });
        },
        /**
         * Get Element Number
         * @method webvn.select.Select#size
         * @returns {number}
         */
        size: function () {
            return this.length;
        },
        /**
         * Get Raw Element <br>
         * If index is undefined, then returns all elements.
         * @method webvn.select.Select#get
         * @param {number=} index
         */
        get: function (index) {
            if (index === undefined) {
                return slice.call(this);
            }
            return this[index];
        },
        /**
         * Hide Element
         * @method webvn.select.Select#hide
         */
        hide: function () {
            return this.css('display', 'none');
        },
        /**
         * Change Select Into Array
         * @method webvn.select.Select#toArray
         * @returns {Array}
         */
        toArray: function () {
            return this.get();
        }
    }, {}, {

        /**
         * Merge Second Array Into First Array
         * @function webvn.select.Select.merge
         * @param {Array} first
         * @param {Array} second
         * @returns {Array}
         */
        merge: function (first, second) {
            var len = +second.length,
                i = first.length;
            for (var j = 0; j < len; j++) {
                first[i++] = second[j];
            }
            first.length = i;
            return first;
        },

        /**
         * Convert html string to actual dom element
         * @function webvn.select.Select.parseHTML
         * @param data
         * @returns {Array}
         */
        parseHTML: function (data) {
            // Div for creating nodes
            var div = document.createElement('div');
            if ( !data || !util.isString(data)) {
                return null;
            }
            div.innerHTML = data;
            var elements = div.childNodes;
            return Select.merge([], elements);
        },

        /**
         * Whether a Node contains another node
         * @function webvn.select.Select.contains
         * @param parent
         * @param node
         * @returns {boolean}
         */
        contains: function (parent, node) {
            return parent !== node && parent.contains(node);
        }

    });

    var rootSelect = new Select(document);

    /**
     * Whether is a Select element
     * @function webvn.select.isSelect
     * @param o
     * @returns {boolean}
     */
    var isSelect = exports.isSelect = function (o) {
        return o instanceof Select;
    };

    /* Generate 'after', 'prepend', 'before', 'append'
     * 'insertAfter', 'insertBefore', 'appendTo' and 'prependTo' methods
     */
    var fn = Select.prototype;
    [ 'after', 'prepend', 'before', 'append' ].forEach(function (operator, idx) {
        var inside = idx % 2; // prepend, append
        fn[operator] = function () {
            // Arguments can be nodes, arrays of nodes and Html strings
            var nodeArray = util.map(arguments, function (arg) {
                return util.isString(arg) ? Select.parseHTML(arg) : arg;
            });
            var nodes = [];
            for (var i = 0, len = nodeArray.length; i < len; i++) {
                if (util.isArray(nodeArray[i])) {
                    // Node array
                    nodes = nodes.concat(nodeArray[i]);
                } else if (isSelect(nodeArray[i])) {
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
                        break;
                    default:
                        target = null;
                        break;
                }
                var parentInDocument = Select.contains(document.documentElement, parent);
                nodes.forEach(function(node){
                    if (copyByClone) {
                        node = node.cloneNode(true);
                    } else if (!parent) {
                        return select(node).remove();
                    }
                    parent.insertBefore(node, target);
                    if (parentInDocument) selectUtil.traverseNode(node, function(el){
                        if (el.nodeName != null && el.nodeName.toUpperCase() === 'SCRIPT' &&
                            (!el.type || el.type === 'text/javascript') && !el.src) {
                            window['eval'].call(window, el.innerHTML);
                        }
                    });
                });
            });
        };
        fn[inside ? operator + 'To' : 'insert' + (idx ? 'Before' : 'After')] = function (html) {
            select(html)[operator](this);
            return this;
        }
    });

});