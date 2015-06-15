/**
 * Global namespace, all modules should be defined within it.
 * @namespace WebVN
 */
var WebVN = window.WebVN = (function(exports)
{
    /**
     * The version string of this release.
     * @name version
     * @memberof WebVN
     */
    exports.version = '0.0.1';

    return exports;
})({});

(function()
{
    var head = document.getElementsByTagName('head')[0];

    /**
     * @namespace loader
     */
    WebVN.loader = {};

    var loader = WebVN.loader;

    /**
     * Load css.
     * @method css
     * @memberof loader
     * @param {Array|String} files File names without css extension.
     */
    loader.css = function (files)
    {
        if (!isArray(files)) files = [files];

        files = files.map(function (file)
        {
            return loader.css.path + file + '.css';
        });

        loadCss(files);
    };

    /**
     * Path of css files.
     * @name css.path
     * @memberof WebVN
     */
    loader.css.path = '';

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

    var jsQueue     = [],
        isJsLoading = false;

    /**
     * Load js.
     * @method js
     * @memberof loader
     * @param {Array|String} files File names without js extension.
     */
    loader.js = function (files)
    {
        if (!isArray(files)) files = [files];

        files = files.map(function (js)
        {
            return loader.js.path + js + '.js';
        });

        jsQueue = jsQueue.concat(files);

        loadJs();
    };

    /**
     * Path of js Files
     * @property {String} js.path
     */
    loader.js.path = '';

    function loadJs()
    {
        if (isJsLoading) return;

        var js = jsQueue.shift();

        if (js === undefined)
        {
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

            loadJs();
        };
        script.src = js;

        head.appendChild(script);
    }

    /**
     * Create module.
     * @method module
     * @memberof WebVN
     * @param {String|Function} [name] Module name.
     * @param {Function} module Module body.
     * @return {Object} Object returned by function.
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

        var ret = module.apply(null, requires);

        if (ret) WebVN[name] = ret;

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

        return requires.map(function (val)
        {
            return WebVN[val];
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

        var exportsIdx = ret.indexOf('exports');
        if (exportsIdx > -1) ret.splice(exportsIdx, 1);

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

    WebVN.call(function (log, version)
    {
        log.info('WebVN v' + version + ' | https://github.com/surunzi/WebVN');
    });
})();

/**
 * @namespace config
 */
WebVN.module('config', function (exports)
{
    /**
     * @method config
     * @memberof WebVN
     * @param cfg
     */
    exports = function (cfg)
    {
        WebVN.use(function (util)
        {
            util.each(cfg, function (val, key) { exports[key] = val });
        });
    };

    return exports;
});

WebVN.use(function (loader)
{
    var scripts  = document.getElementsByTagName('script'),
        build, i, len;

    for (i = 0, len = scripts.length; i < len; i++)
    {
        build = scripts[i].getAttribute('data-build');
        if (build) break;
    }

    WebVN.extend('config', function (exports) { exports.build = build });

    var xhr = new window.XMLHttpRequest();
    xhr.onload = function ()
    {
        var data = JSON.parse(xhr.responseText);
        loadFiles(data);
    };
    xhr.open('get', 'webvn.json');
    xhr.send();

    function loadFiles(data)
    {
        var css = data.css,
            js  = data.js;

        each(css, function (value)
        {
            loader.css.path = value.path;
            loader.css(value.files);
        });

        each(js, function (value)
        {
            loader.js.path = value.path;
            loader.js(value.files);
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
