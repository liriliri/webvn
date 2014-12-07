/* Util Module
 * Used for placing some regular functions
 */

webvn.add('util', function (s) {

var util = {};

// Quick references
var ObjProto = Object.prototype;
var toString = ObjProto.toString;

// Iterate an object or an array
util.each = function(obj, iteratee) {

    var len = obj.length;

    /* Check if the object is an array or an obect
     * And do different stuff according to the result
     */
    if (len === +len) {
      for (var i = 0; i < len; i++) {
        iteratee(obj[i], i, obj);
      }
    } else {
      var keys = util.keys(obj);
      for (var i = 0, len = keys.length; i < len; i++) {
        iteratee(obj[keys[i]], keys[i], obj);
      }
    }

    return obj;

};

// Simple method of object merging, just like the one in backbone.
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

/* Copy properties of b into a
 * Notice that if they both have the same property,
 * the one inside a is going to be overwriten.
 */
util.mix = function (a, b) {

    var keys = util.keys(b), p;

    for (var i = 0, len = keys.length; i < len; i++) {
        p = keys[i];
        _mix(a, b, p);
    }

    return a;
};

util.isArray = function (obj) {

    return toString.call(obj) === '[object Array]';

};

util.isFunc = function (obj) {

    return typeof obj == 'function' || false;

}

util.isObj = function (obj) {

    var type = typeof obj;

    return type === 'function' || type === 'object' && !!obj;

};

// isType methods
util.each(['String', 'Number'], function(name) {

    util['is' + name] = function(obj) {

        return toString.call(obj) === '[object ' + name + ']';
        
    };

});

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

// Check if a string startsWith a specific string
util.startsWith = function (str, text) {
    return str.indexOf(text) === 0;
};

// Trim strings
util.trim = function(text) {

    return text.replace(/^\s+|\s+$/g, '');

};

// Private function

function _mix(a, b, p) {
    
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

};

function Empty () {}

return util;

});