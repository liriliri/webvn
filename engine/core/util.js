/* Util Module
 * Used for placing some regular functions
 * Most code is modified from kissy and underscore
 */

webvn.add('util', function (s) {

var util = {};

// Quick references
var ObjProto = Object.prototype,
    ArrProto = Array.prototype,
    toString = ObjProto.toString;

// Const
var CLONE_MARKER = 'webvn_clone',
    MIX_MARKER = 'webvn_mix'
    EMPTY = '';

// Create a duplicate of an object
util.clone = function (o) {

    var memory = {},
        ret = cloneInternal(o, memory);

    util.each(memory, function (v) {
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

// Check if a string startsWith a specific string
util.endsWith = function (str, suffix) {

    var ind = str.length - suffix.length;
    return ind >= 0 && str.indexOf(suffix, ind) === ind;

};

var guid = 0;
// Generate global id
util.guid = function (prefix) {

    return (prefix || EMPTY) + guid++;

};

// Where an element is in the specific array
util.inArray = function (elem, arr) {

    return util.indexOf(elem, arr) > -1;

};

util.indexOf = function (elem, arr) {

    return ArrProto.indexOf.call(arr, elem);

};

util.isPlainObject = function (input) {

    if (util.type(input) !== 'object') {
        return false;
    }

    for (var key in input) {
    }

    return ((key === undefined) || hasOwnProperty(input, key));

};

// Get keys of an object.
util.keys = function (o) {

    var result = [], p;

    for (p in o) {
        if (o.hasOwnProperty(p)) {
            result.push(p);
        }
    }

    return result;

};

// Transform a object into an array
util.makeArray = function (o) {

    if (o == null) {
        return [];
    }
    if (util.isArray(o)) {
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

/* Merge multiple object into a new object
 * The latter one will overwrite the former if they have the same key
 * Usually used to merge options
 */
util.merge = function () {

    var varArgs = util.makeArray(arguments),
        o = {};

    for (var i = 0, len = varArgs.length; i < len; i++) {
        util.mix(o, varArgs[i]);
    }

    return o;

};

/* Copy properties of b into a
 * Notice that if they both have the same property,
 * the one inside a is going to be overwriten.
 */
util.mix = function (a, b) {

    var cache = [],
        c,
        i = 0;

    mixInternal(a, b, cache);
    while ((c = cache[i++])) {
        delete c[MIX_MARKER];
    }

    return a;

};

// Check if a string startsWith a specific string
util.startsWith = function (str, prefix) {

    return str.indexOf(prefix) === 0;
    
};

// Trim strings
util.trim = function(str) {

    return str.replace(/^\s+|\s+$/g, '');

};

// Iterate an object or an array
util.each = function(o, fn) {

    var len = o.length, i;

    /* Check if the object is an array or an obect
     * And do different stuff according to the result
     */
    if (len === +len) {
      for (i = 0; i < len; i++) {
        fn(o[i], i, o);
      }
    } else {
      var keys = util.keys(o);
      for (i = 0, len = keys.length; i < len; i++) {
        fn(o[keys[i]], keys[i], o);
      }
    }

    return o;

};

var class2type = {};

// isType methods
util.each('Boolean Number String Function Date RegExp Object Array'.split(' '), function (name, lc) {

    // populate the class2type map
    class2type['[object ' + name + ']'] = (lc = name.toLowerCase());

    // add isBoolean/isNumber/...
    util['is' + name] = function (o) {
        return util.type(o) === lc;
    };

});

// Determine the internal JavaScript [[Class]] of an object.
util.type = function (o) {

    return o == null ?
        String(o) :
        class2type[toString.call(o)] || 'object';

};

util.map = function (o, fn) {

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
        var keys = util.keys(o);
        for (i = 0, len = keys.length; i < len; i++) {
            value = fn(o[keys[i]], keys[i], o);
            if (value != null) {
                values.push(value);
            }
        }
    }

    return values;

}

// Private function

function cloneInternal(o, memory) {

    var destination = o,
        isArray = util.isArray(o),
        isPlainObject = util.isPlainObject(o),
        k,
        stamp;

    if (!o) {
        return destination;
    }

    if (o[CLONE_MARKER]) {
        return memory[input[CLONE_MARKER]].destination;
    } else if (typeof input === 'object') {
        var Constructor = o.constructor;
        if (util.inArray(Constructor, [Boolean, String, Number, Date, RegExp])) {
            destination = new Constructor(o.valueOf());
        } else if (isArray) {
            destination = o.concat();
        } else if (isPlainObject) {
            destination = {};
        }
        o[CLONE_MARKER] = (stamp = util.guid('c'));
        memory[stamp] = {
            destination: destination,
            input: o
        };
    }

    if (isArray) {
        for (var i = 0, len = destination.length; i < len; i++) {
            destination[i] = cloneInternal(destination[i], memory);
        }
    } else if (isPlainObject) {
        for (k in o) {
            if (k !== CLONE_MARKER) {
                destination[k] = cloneInternal(o[k], memory);
            }
        }
    }

    return destination;

}

function hasOwnProperty(o, p) {

    return ObjProto.hasOwnProperty.call(o, p);

}

function mixInternal(a, b, cache) {
    
    if (!b || !a) {
        return a;
    }
    var i, p, keys, len;

    b[MIX_MARKER] = a;

    cache.push(b);

    // mix all properties
    keys = util.keys(b);
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
    if (src && (util.isArray(src) || util.isPlainObject(src))) {
        if (src[MIX_MARKER]) {
            a[p] = src[MIX_MARKER];
        } else {
            var clone = target && (util.isArray(target) || util.isPlainObject(target)) ?
                target :
                (util.isArray(src) ? [] : {});
            a[p] = clone;
            mixInternal(clone, src, cache);
        }
    } else if (src !== undefined) {
        a[p] = src;
    }
}

return util;

});