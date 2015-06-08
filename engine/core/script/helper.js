/**
 * @namespace func
 * @memberof script
 */
WebVN.extend('script', function (exports, script)
{
    var functions = {},
        regSpace = /\s/,
        fn;

    /**
     * Create a function.
     * @method create
     * @memberof script.func
     * @param {string} name Function name.
     * @param {function} fn Function to create.
     */
    function create(name, fn)
    {
        script.command.has(name) &&
        log.warn('You are overwriting command ' + name + '.');

        functions[name] = fn;
    }

    /**
     * Check function exists or not.
     * @method has
     * @memberof script.func
     * @param {string} name Function name.
     * @returns {boolean} Exists or not.
     */
    function has(name) { return functions[name] !== undefined }

    function call(name, params)
    {
        fn = functions[name];

        // Wrap params with spaces
        params = params.map(function (val)
        {
            if (regSpace.test(val)) val = "'" + val + "'";

            return val;
        });

        exports.stack.push();
        fn.apply(null, params);
        exports.play();

        exports.executions = exports.middles.concat(exports.executions);
        exports.middles    = [];
    }

    exports.func = {
        create: create,
        has   : has,
        call  : call
    };
});

/**
 * @namespace define
 * @memberof script
 */
WebVN.extend('script', function (exports, util)
{
    var defines = {};

    function create(name, value) { defines[name] = value }

    function parse(str)
    {
        util.each(defines, function (val, key)
        {
            str = str.replace(reg(key), val);
        });

        return str;
    }

    var regExp = {};

    function reg(str)
    {
        if (!regExp[str]) regExp[str] = new RegExp(str, 'g');

        return regExp[str];
    }

    exports.define = {
        create: create,
        parse : parse
    };
});

/**
 * @namespace alias
 * @memberof script
 */
WebVN.extend('script', function (exports)
{
    var aliases = {};

    function create(name, value) { aliases[name] = value };

    var commandRegex = /^[^\s]+/;

    function parse(str)
    {
        var command = commandRegex.exec(str)[0];
        if (aliases[command]) return str.replace(commandRegex, aliases[command]);

        return str;
    }

    exports.alias = {
        create: create,
        parse : parse
    };
});

/**
 * @namespace label
 * @memberof script
 */
WebVN.extend('script', function (exports)
{
    var labels = {};

    function create(name, lineNum) { labels[name] = lineNum }

    function has(name) { return labels[name] !== undefined }

    function get(name) { return labels[name] }

    exports.label = {
        create: create,
        has   : has,
        get   : get
    };
});