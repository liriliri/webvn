/* Simple loader
 * Also defines a simple function to add modules 
 */

(function (s) {

var loader = {};

// Used to append script tag
var head = document.getElementsByTagName('head')[0],
// Prefix of all url
    prefix = '',
// Container of all scripts
    scriptList = [];

// Set prefix of the url
loader.prefix = function (pre) {

    prefix = pre;

    return loader;

}

/* Load scripts
 * Param script can be either a string or an array.
 */
loader.script = function (scripts) {

    // Turn scripts into an array if it is not.
    if (!isArray(scripts)) {
        scripts = [scripts];
    }

    // Push scripts into container and excute them
    for (var i = 0, len = scripts.length; i < len; i++) {
        scriptList.push(prefix + scripts[i] + '.js');
    }

    loadScript();

    return loader;

};

// Private methods

function isArray(arr) {

    return Object.prototype.toString.call(arr) == '[object Array]';

}

// Load scripts one by one until there is nothing left.
function loadScript() {

    if (scriptList.length === 0) {
        return;
    }

    var script = document.createElement('script');
    script.src = scriptList.shift();
    script.onload = function () {

        if (script.readyState && 
            script.readyState != "complete" &&
            script.readyState != "loaded") {
            return;
        }
        loadScript();

    };

    head.appendChild(script);

}

s.loader = loader;

/* name: the name of the module
 * requires: other module reference
 * module: function that acturally creates the module
 */
s.add = function (name, requires, module) {

    if (s[name]) {
        console.error('The module already exists');
        return;
    }

    if (typeof requires === 'function') {
        module = requires;
        requires = [];
    }

    try {
        requires = getModules(requires);
    } catch (e) {
        console.error(e);
    }

    // The first param that parsed is the webvn global namespace
    requires.unshift(s);
    s[name] = module.apply(null, requires);

    if (s[name]) {
        console.info('Module ' + name + ' loaded');
    } else {
        console.error('Failed to create module ' + name);
    }

};

// Making it easier use different parts of the webvn
s.use = function (requires, module) {

    try {
        requires = getModules(requires);
    } catch (e) {
        console.error(e);
    }

    requires.unshift(s);

    module.apply(null, requires);

};

// Change the name of the requires to be actual functions.
function getModules(requires) {

    for (var i = 0, len = requires.length; i < len; i++) {
        if (s[requires[i]]) {
            requires[i] = s[requires[i]];
        } else {
            throw new Error('Module ' + requires[i] + " does'nt exist");
        }
    }

    return requires;

}

})(webvn);