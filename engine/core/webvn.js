/**
 * Namespace of the game engine <br>
 * All different parts of the engine should be defined within it.
 * @namespace webvn
 */
window.webvn = (function(){
    "use strict";
    var exports = {};
    /**
     * Version of WebVN
     * @name webvn.version
     */
    exports.version = '0.0.1';
    return exports;
})();

/**
 * Simple Loader <br>
 * Also defines a simple function to add modules.
 * @namespace webvn.loader
 */
(function(s){
    "use strict";
    var exports = {};

    var head = document.getElementsByTagName('head')[0];

    /**
     * Path of Css Files
     * @name webvn.loader.cssPath
     * @type {string}
     */
    exports.cssPath = '';
    /**
     * Load CSS <br>
     * Css files are designed to load as fast as possible.
     * @function webvn.loader.css
     * @param {string|Array} css css files to be loaded
     * @returns {object}
     */
    exports.css = function (css) {
        if (!isArray(css)) {
            css = [css];
        }
        // Add css path and file extension
        css = css.map(function (css) {
            return exports.cssPath + css + '.css';
        });
        loadCss(css);
    };
    function loadCss(hrefs) {
        var link;
        hrefs.forEach(function (href) {
            link = document.createElement('link');
            link.setAttribute('rel', 'stylesheet');
            link.setAttribute('href', href);
            head.appendChild(link);
        });
    }

    // Js file list, also contains some functions
    var jsList = [];
    var isJsLoading = false;
    /**
     * Path of Js Files
     * @name webvn.loader.jsPath
     * @type {string}
     */
    exports.jsPath = '';
    /**
     * Load Js
     * @function webvn.loader.js
     * @param {string|Array} js js files to be loaded
     */
    exports.js = function (js) {
        if (!isArray(js)) {
            js = [js];
        }
        js = js.map(function (js) {
            return exports.jsPath + js + '.js';
        });
        jsList = jsList.concat(js);
        loadJs();
    };
    function loadJs() {
        // If jsList is not empty, then the script is still loading.
        if (isJsLoading) {
            return;
        }
        var js = jsList.shift();
        // Js may not be string but function
        while (isFunction(js)) {
            js(s);
            js = jsList.shift();
        }
        // JsList is empty
        if (js === undefined) {
            isJsLoading = false;
            return;
        }
        _loadJs(js);
    }
    function _loadJs(js) {
        isJsLoading = true;
        var script = document.createElement('script');
        script.onload = function () {
            isJsLoading = false;
            if (script.readyState &&
                script.readyState != "complete" &&
                script.readyState != "loaded") {
                isJsLoading = false;
                return;
            }
            // Load next js file
            loadJs();
        };
        script.src = js;
        head.appendChild(script);
    }

    /**
     * Add function in jsList
     * @function webvn.loader.call
     * @param {function} fn function to call
     */
    exports.call = function (fn) {
        jsList.push(fn);
    };

    s.loader = exports;

    /**
     * Add WebVN Module
     * @function webvn.module
     * @param {string} name name of the module
     * @param {Array=} requires
     * @param {function} module module, should have return value
     */
    s.module = function (name, requires, module) {
        if (isFunction(requires)) {
            module = requires;
            requires = [];
        }
        requires = getModules(requires);
        requires.unshift(s);
        s[name] = module.apply(null, requires);
    };

    /**
     * A simple way to use modules
     * @function webvn.use
     * @param {Array=} requires
     * @param {function} module
     */
    s.use = function (requires, module) {
        if (isFunction(requires)) {
            module = requires;
            requires = [];
        }
        requires = getModules(requires);
        requires.unshift(s);
        module.apply(null, requires);
    };

    function getModules(requires) {
        if (!isArray(requires)) {
            requires = [requires];
        }
        return requires.map(function (value) {
            return s[value];
        });
    }

    function isArray(array) {
        return Object.prototype.toString.call(array) === '[object Array]';
    }

    function isFunction(func) {
        return typeof func === 'function';
    }
})(webvn);

// Look for config file and load files
webvn.use(['loader'], function (s, loader) {
    "use strict";
    // Load webvn.json
    var xhr = new window.XMLHttpRequest();
    xhr.onload = function () {
        var data = JSON.parse(xhr.responseText);
        loadFiles(data);
    };
    xhr.open('get', '/webvn.json');
    xhr.send();

    function loadFiles(data) {
        var css = data.css,
            js = data.js;
        each(css, function (value) {
            loader.cssPath = value.path;
            loader.css(value.files);
        });
        each(js, function (value) {
            loader.jsPath = value.path;
            loader.js(value.files);
        });
    }

    function each(object, fn) {
        "use strict";
        var key;
        for (key in object) {
            if (object.hasOwnProperty(key)) {
                fn(object[key], key);
            }
        }
    }
});
