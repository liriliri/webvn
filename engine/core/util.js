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
var CLONE_MARKER = 'webvn_cloned',
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

// Simple method of object merging, just like the one in underscore.
util.extend = function (obj) {

    // Not going to do anything if it is not an object
    if (!util.isObj(obj)) {
        return obj;
    }

    var source, prop;
    for (var i = 1, len = arguments.length; i < len; i++) {
        source = arguments[i];
        for (prop in source) {
            obj[prop] = source[prop];
        }
    }

    return obj;
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

util.isFunc = function (input) {

    return typeof input === 'function' || false;

};

util.isObj = function (input) {

    var type = typeof input;

    return type === 'function' || type === 'object' && !!input;

};

util.isPlainObj = function (input) {

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

/* Copy properties of b into a
 * Notice that if they both have the same property,
 * the one inside a is going to be overwriten.
 */
util.mix = function (a, b) {

    var keys = util.keys(b), p;

    for (var i = 0, len = keys.length; i < len; i++) {
        p = keys[i];
        mix(a, b, p);
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

// isType methods
util.each(['Array', 'Number', 'String'], function(name) {

    util['is' + name] = function(input) {

        return toString.call(input) === '[object ' + name + ']';
        
    };

});

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
        isPlainObject = util.isPlainObj(o),
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

function mix(a, b, p) {
    
    var target = a[p],
        src = b[p];

    /* If it's an array or object,
     * we have to call the function recursively.
     */
    if (util.isArray(src) || util.isObj(src)) {
        var clone = target && (util.isArray(target) || util.isObj(target)) ?
            target:(util.isArray(src) ? [] : {});
        a[p] = clone;
        util.mix(clone, src);
    } else {
        a[p] = src;
    }

}

return util;

});