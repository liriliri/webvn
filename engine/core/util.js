/**
 * Used for placing some regular functions.<br>
 * Most code is modified from kissy and underscore.
 * @namespace webvn.util
 */
webvn.module('util', function (exports) {
    // Quick references
    var ObjProto = Object.prototype,
        ArrProto = Array.prototype,
        toString = ObjProto.toString;

    // Const
    var CLONE_MARKER = 'webvn_clone',
        MIX_MARKER = 'webvn_mix',
        EMPTY = '';

    /**
     * Create a duplicate of an object, deep
     * @function webvn.util.clone
     * @param {object} o target object
     * @return {object}
     */
    exports.clone = function (o) {
        var memory = {},
            ret = _clone(o, memory);
        exports.each(memory, function (v) {
            // Clear marker
            v = v.input;
            if (v[CLONE_MARKER]) {
                try {
                    delete v[CLONE_MARKER];
                } catch (e) {
                    v[CLONE_MARKER] = undefined;
                }
            }
        });
        memory = null;
        return ret;
    };
    function _clone(o, memory) {
        var destination = o,
            isArray = exports.isArray(o),
            isPlainObject = exports.isPlainObject(o),
            k,
            stamp;
        if (!o) {
            return destination;
        }
        if (o[CLONE_MARKER]) {
            return memory[input[CLONE_MARKER]].destination;
        } else if (typeof input === 'object') {
            var Constructor = o.constructor;
            if (exports.inArray(Constructor, [Boolean, String, Number, Date, RegExp])) {
                destination = new Constructor(o.valueOf());
            } else if (isArray) {
                destination = o.concat();
            } else if (isPlainObject) {
                destination = {};
            }
            o[CLONE_MARKER] = (stamp = exports.guid('c'));
            memory[stamp] = {
                destination: destination,
                input: o
            };
        }
        if (isArray) {
            for (var i = 0, len = destination.length; i < len; i++) {
                destination[i] = _clone(destination[i], memory);
            }
        } else if (isPlainObject) {
            for (k in o) {
                if (k !== CLONE_MARKER && o.hasOwnProperty(k)) {
                    destination[k] = _clone(o[k], memory);
                }
            }
        }
        return destination;
    }

    /**
     * Check if the value is present in the list.
     * @function webvn.util.contains
     * @param {object} o
     * @param {object} target
     * @returns {boolean}
     */
    exports.contains = function (o, target) {
        if (o == null) {
            return false;
        }
        if (o.length !== +o.length) {
            o = exports.values(o);
        }
        return exports.indexOf(target, o) >= 0;
    };

    /**
     * Check if a string startsWith a specific string.
     * @function webvn.util.endsWith
     * @param {String} str string
     * @param {String} suffix suffix
     * @returns {Boolean} whether string ends with the suffix
     */
    exports.endsWith = function (str, suffix) {
        var index = str.length - suffix.length;
        return index >= 0 && str.indexOf(suffix, index) === index;
    };

    var guid = 0;
    /**
     * Generate global id
     * @function webvn.util.guid
     * @param {string} prefix guid prefix
     * @returns {string}
     */
    exports.guid = function (prefix) {
        return (prefix || EMPTY) + guid++;
    };

    /**
     * Whether an element is in the specific array
     * @function webvn.util.inArray
     * @param elem
     * @param {Array} arr
     * @returns {boolean}
     */
    exports.inArray = function (elem, arr) {
        return exports.indexOf(elem, arr) > -1;
    };

    /**
     * Index of elem in the specific array
     * @param elem
     * @param {Array} arr
     * @returns {number}
     */
    exports.indexOf = function (elem, arr) {
        return ArrProto.indexOf.call(arr, elem);
    };

    exports.isPlainObject = function (input) {
        if (exports.type(input) !== 'object') {
            return false;
        }
        for (var key in input) {
        }
        return ((key === undefined) || hasOwnProperty(input, key));
    };

    /**
     * Get keys of an object.
     * @function webvn.util.keys
     * @param {object} o
     * @returns {Array}
     */
    var objKeys = Object.keys;
    if (objKeys) {
        exports.keys = function (o) {
            return objKeys(o);
        };
    } else {
        exports.keys = function (o) {
            var result = [], p;

            for (p in o) {
                if (o.hasOwnProperty(p)) {
                    result.push(p);
                }
            }

            return result;
        };
    }

    /**
     * Transform a object into an array
     * @function webvn.util.makeArray
     * @param {object} o
     * @returns {Array}
     */
    exports.makeArray = function (o) {
        if (o == null) {
            return [];
        }
        if (exports.isArray(o)) {
            return o;
        }
        var lengthType = typeof o.length,
            oType = typeof o;
        if (lengthType !== 'number' ||
            o.alert ||
            oType === 'string' ||
            (oType === 'function' && !( 'item' in o && lengthType === 'number'))) {
            return [o];
        }
        var ret = [];
        for (var i = 0, l = o.length; i < l; i++) {
            ret[i] = o[i];
        }
        return ret;
    };

    /**
     * Merge multiple object into a new object <br>
     * The latter one will overwrite the former if they have the same key
     * Usually used to merge options
     * @function webvn.util.merge
     * @returns {object}
     */
    exports.merge = function () {
        var varArgs = exports.makeArray(arguments),
            o = {};
        for (var i = 0, len = varArgs.length; i < len; i++) {
            exports.mix(o, varArgs[i]);
        }
        return o;
    };

    /**
     * Copy properties of b into a <br>
     * Notice that if they both have the same property,
     * the one inside a is going to be overwritten.
     * @function webvn.util.mix
     * @param {object} a
     * @param {object} b
     * @returns {object}
     */
    exports.mix = function (a, b) {
        var cache = [],
            c,
            i = 0;
        mixInternal(a, b, cache);
        while ((c = cache[i++])) {
            delete c[MIX_MARKER];
        }
        return a;
    };
    function mixInternal(a, b, cache) {
        if (!b || !a) {
            return a;
        }
        var i, p, keys, len;
        b[MIX_MARKER] = a;
        cache.push(b);
        // mix all properties
        keys = exports.keys(b);
        len = keys.length;
        for (i = 0; i < len; i++) {
            p = keys[i];
            if (p !== MIX_MARKER) {
                _mix(p, a, b, cache);
            }
        }
        return a;
    }
    function _mix(p, a, b, cache) {
        var target = a[p],
            src = b[p];
        // prevent never-end loop
        if (target === src) {
            if (target === undefined) {
                a[p] = target;
            }
            return;
        }
        if (src && (exports.isArray(src) || exports.isPlainObject(src))) {
            if (src[MIX_MARKER]) {
                a[p] = src[MIX_MARKER];
            } else {
                var clone = target && (exports.isArray(target) || exports.isPlainObject(target)) ?
                    target :
                    (exports.isArray(src) ? [] : {});
                a[p] = clone;
                mixInternal(clone, src, cache);
            }
        } else if (src !== undefined) {
            a[p] = src;
        }
    }

    /**
     * Check if a string startsWith a specific string
     * @function webvn.util.startsWith
     * @param {string} str
     * @param {string} prefix
     * @returns {boolean}
     */
    exports.startsWith = function (str, prefix) {
        return str.indexOf(prefix) === 0;
    };

    /**
     * Trim strings
     * @function webvn.util.trim
     * @param {string} str
     * @returns {string}
     */
    exports.trim = function(str) {
        return str.replace(/^\s+|\s+$/g, '');
    };

    /**
     * Iterate an object or an array
     * @function webvn.util.each
     * @param {object} o
     * @param {function} fn
     */
    exports.each = function(o, fn) {
        var len = o.length, i;
        /* Check if the object is an array or an obect
         * And do different stuff according to the result
         */
        if (len === +len) {
            for (i = 0; i < len; i++) {
                fn(o[i], i, o);
            }
        } else {
            var keys = exports.keys(o);
            for (i = 0, len = keys.length; i < len; i++) {
                fn(o[keys[i]], keys[i], o);
            }
        }
        return o;
    };

    var class2type = {};
    // isType methods
    exports.each('Boolean Number String Function Date RegExp Object Array'.split(' '), function (name, lc) {
        // populate the class2type map
        class2type['[object ' + name + ']'] = (lc = name.toLowerCase());
        // add isBoolean/isNumber/...
        exports['is' + name] = function (o) {
            return exports.type(o) === lc;
        };
    });

    /**
     * Determine the internal JavaScript [[Class]] of an object.
     * @function webvn.util.type
     * @param {object} o
     * @returns {string}
     */
    exports.type = function (o) {
        return o == null ?
            String(o) :
            class2type[toString.call(o)] || 'object';
    };

    /**
     * @function webvn.util.map
     * @param {object} o
     * @param {function} fn
     * @returns {Array}
     */
    exports.map = function (o, fn) {
        var len = o.length, i, value, values = [];
        /* Check if the object is an array or an obect
         * And do different stuff according to the result
         */
        if (len === +len) {
            for (i = 0; i < len; i++) {
                value = fn(o[i], i, o);
                if (value !== null) {
                    values.push(value);
                }
            }
        } else {
            var keys = exports.keys(o);
            for (i = 0, len = keys.length; i < len; i++) {
                value = fn(o[keys[i]], keys[i], o);
                if (value != null) {
                    values.push(value);
                }
            }
        }
        return values;
    };

    /**
     * Retrieve the values of an object's properties
     * @function webvn.util.values
     * @param {object} o
     * @returns {Array}
     */
    exports.values = function (o) {
        var keys = exports.keys(o),
            len = keys.length;
        var values = new Array(len);
        for (var i = 0; i < len; i++) {
            values[i] = obj[keys[i]];
        }
        return values;
    };

    function hasOwnProperty(o, p) {
        return ObjProto.hasOwnProperty.call(o, p);
    }
});