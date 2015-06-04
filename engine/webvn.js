/**
 * @namespace WebVN
 */
window.WebVN = window.webvn = (function(exports)
{
    /**
     * The version string of this release.
     * @name version
     * @memberof WebVN
     */
    exports.version = '0.0.1';

    return exports;
})({});

// Basic setup
(function()
{
    var head = document.getElementsByTagName('head')[0];

    /**
     * Load css.
     * @method css
     * @memberof WebVN
     * @param {Array|String} files File names without css extension.
     */
    WebVN.css = function (files)
    {
        if (!isArray(files)) files = [files];

        // Add css path and file extension
        files = files.map(function (file)
        {
            return WebVN.css.path + file + '.css';
        });

        loadCss(files);
    };

    /**
     * Path of css files.
     * @name css.path
     * @memberof WebVN
     */
    WebVN.css.path = '';

    function loadCss(hrefs)
    {
        var link;

        hrefs.forEach(function (href)
        {
            link = document.createElement('link');
            link.setAttribute('rel', 'stylesheet');
            link.setAttribute('href', href);
            head.appendChild(link);
        });
    }

    // Js file list
    var jsQueue     = [],
        isJsLoading = false;

    /**
     * Load js.
     * @method js
     * @memberof WebVN
     * @param {Array|String} files File names without js extension.
     */
    WebVN.js = function (files)
    {
        if (!isArray(files)) files = [files];

        files = files.map(function (js)
        {
            return WebVN.js.path + js + '.js';
        });

        jsQueue = jsQueue.concat(files);

        loadJs();
    };

    /**
     * Path of js Files
     * @property {String} js.path
     */
    WebVN.js.path = '';

    function loadJs()
    {
        if (isJsLoading) return;

        var js = jsQueue.shift();

        // JsList is empty
        if (js === undefined) {
            isJsLoading = false;
            return;
        }

        _loadJs(js);
    }

    function _loadJs(js)
    {
        var script = document.createElement('script');

        isJsLoading = true;

        script.onload = function ()
        {
            isJsLoading = false;

            if (script.readyState               &&
                script.readyState != "complete" &&
                script.readyState != "loaded")
            {
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
     * @method module
     * @memberof WebVN
     * @param {string|function} name
     * @param {function} module
     */
    WebVN.module = function (name, module)
    {
        var exports = {};

        if (isFunction(name)) {
            module = name;
        } else {
            WebVN[name] = exports;
        }

        var requires = getModules(getFnParams(module));
        requires.unshift(exports);

        module.apply(null, requires);

        return exports;
    };

    /**
     * @method extend
     * @memberof WebVN
     * @param name
     * @param module
     */
    WebVN.extend = function (name, module)
    {
        var requires = getFnParams(module);

        requires = getModules(requires);
        requires.unshift(WebVN[name]);

        module.apply(null, requires);
    };

    /**
     * @method use
     * @memberof WebVN
     * @param {function} module
     */
    WebVN.use = function (module)
    {
        var requires = getFnParams(module);

        requires = getModules(requires);
        module.apply(null, requires);
    };

    /**
     * Whether all js files are loaded.
     * @name isReady
     * @memberof WebVN
     */
    var isReady = WebVN.isReady = false;

    var fnList = [];

    /**
     * Functions to be called when all file is loaded.
     * @method call
     * @memberof WebVN
     * @param {function} module
     */
    WebVN.call = function (module)
    {
        var requires;

        if (module === undefined)
        {
            fnList.forEach(function (fn)
            {
                requires = getModules(fn[0]);
                fn[1].apply(null, requires);
            });
            fnList = [];

            return;
        }

        requires = getFnParams(module);

        var fn = [requires, module];

        if (isReady) {
            requires = getModules(fn[0]);
            fn[1].apply(null, requires);
        } else {
            fnList.push(fn);
        }
    };

    function getModules(requires)
    {
        if (!isArray(requires)) requires = [requires];

        return requires.map(function (value)
        {
            return WebVN[value];
        });
    }

    var regStripComments = /((\/\/.*$)|(\/\*[\s\S]*?\*\/))/mg,
        regArgNames      = /[^\s,]+/g;

    function getFnParams(fn)
    {
        var fnStr = fn.toString().replace(regStripComments, ''),
            ret   = fnStr.slice(fnStr.indexOf('(') + 1, fnStr.indexOf(')'))
                         .match(regArgNames);

        if (ret === null) return [];

        if (ret[0] === 'exports') {
            ret.shift();
        } else if (ret[ret.length - 1] === 'exports') {
            ret.pop();
        }

        return ret;
    }

    function isArray(array)
    {
        return Object.prototype.toString.call(array) === '[object Array]';
    }

    function isFunction(func)
    {
        return typeof func === 'function';
    }
})();

// Look for config file and load files
WebVN.use(function ()
{
    // Get build info, dev, test, debug or release
    var scripts  = document.getElementsByTagName('script'),
        basePath = '',
        build, i, len;

    for (i = 0, len = scripts.length; i < len; i++)
    {
        build = scripts[i].getAttribute('data-build');
        if (build) break;
    }

    webvn.module('config', function (exports)
    {
        exports.build = build;
    });

    if (build === 'test') basePath = '../';

    // Load webvn.json
    var xhr = new window.XMLHttpRequest();
    xhr.onload = function ()
    {
        var data = JSON.parse(xhr.responseText);
        loadFiles(data);
    };
    xhr.open('get', basePath + 'webvn.json');
    xhr.send();

    function loadFiles(data)
    {
        var css = data.css,
            js  = data.js;

        each(css, function (value)
        {
            WebVN.css.path = basePath + value.path;
            WebVN.css(value.files);
        });

        each(js, function (value)
        {
            WebVN.js.path = basePath + value.path;
            WebVN.js(value.files);
        });
    }

    function each(object, fn)
    {
        var key;
        for (key in object)
        {
            if (object.hasOwnProperty(key)) fn(object[key], key);
        }
    }
});
