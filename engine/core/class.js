/* This module provide the basic class inheritance.
 */

webvn.add('class', ['util'], function (s, util) {

var kclass = {};

var ObjCreate = Object.create;

var classes = {};

// Add class
kclass.add = function (name, value) {

    classes[name] = value;

};

/* Create a new class
 * px: prototype methods or attributes
 * sx: static methods or attributes
 */
kclass.create = function (px, sx) {

    var _class = create(px, sx);

    // Set prototype
    _class.prototype = px;

    return _class;

};

// Get class
kclass.get = function (name) {

    return classes[name];

};

// Private function

/* Create a new class using px's constructor if exists.
 * Also set static method of the class
 */
function create(px, sx) {

    var _class;

    px = px || {};
    sx = sx || {};

    // Whether a constructor is defined
    if (px.hasOwnProperty('constructor')) {
        _class = px.constructor;
    } else {
        _class = function () {};
        px.constructor = _class;
    }

    // Set statics
    util.each(sx, function (value, p) {

        _class[p] = value;

    });

    // Extend function
    _class.extend = function (px, sx) {

        return extend.apply(null, [_class, px, sx]);

    };

    return _class;

}

/* Create a new object with prototype
 * equals to object.create
 */ 
function createObj(proto, constructor) {

    var newProto;

    if (ObjCreate) {
        newProto = ObjCreate(proto);
    } else {
        Empty.prototype = proto;
        newProto = new Empty();
    }

    newProto.constructor = constructor;

    return newProto;

};

/* Extend a class that already exist.
 * All it does is just to set the superClass's prototype into px's __proto__.
 */
function extend(superClass, px, sx) {

    var _class = create(px, sx);
    newPx = createObj(superClass.prototype, _class);

    util.mix(newPx, px);

    _class.prototype = newPx;

    return _class;

}

return kclass;

});