webvn.module('util', function (exports) {
    "use strict";
    exports.each = function (obj, fn) {
        var keys, i = 0, len = obj.length;

        if (len === +len) {
            for (; i < len; i++) {
                fn(obj[i], i, obj);
            }
        } else {
            keys = exports.keys(obj);
            len = keys.length;

            for (; i < len; i++) {
                fn(obj[keys[i]], keys[i], obj);
            }
        }
    };

    exports.uid = function (prefix) {
        return (prefix || '') + uid++;
    };
    var uid = 0;

    // Undone
    // Quick references
    var ArrProto = Array.prototype;

    // Const
    var CLONE_MARKER = 'webvn_clone',
        MIX_MARKER = 'webvn_mix';

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

    /**
     * Merge multiple object into a new object <br>
     * The latter one will overwrite the former if they have the same key
     * Usually used to merge options
     * @function webvn.util.merge
     * @returns {object}
     */
    exports.merge = function () {
        var varArgs = exports.toArray(arguments),
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
});