/**
 * @namespace func
 * @memberof script
 */
WebVN.extend('script', function (exports, script, util)
{
    var functions = {},
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

        fn.params = util.getFnParams(fn);

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
        var scope = {};

        exports.stack.push();

        fn = functions[name];

        util.each(params, function (val, idx)
        {
            scope[fn.params[idx]] = params[idx] = parseParam(val);
        });

        exports.scope.push(scope);
        fn.apply(null, params);
    }

    function parseParam(val)
    {
        var ret;

        ret = Number(val);
        if (ret === ret) return ret;

        if (val === 'false') return false;

        if (val === 'true') return true;

        try {
            ret = JSON.parse(val);
            return ret;
        } catch (e) {}

        return util.trimQuote(val);
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

/**
 * @namespace scope
 * @memberof script
 */
WebVN.extend('script', function (exports, Class, util)
{
    var scopes = [],
        current = {};

    scopes.push(current);

    function push(scope)
    {
        current = scope;

        scopes.push(current);
    }

    function pop()
    {
        scopes.pop();
        current = util.last(scopes);
    }

    function get(name)
    {
        if (name) return current[name];

        return current;
    }

    exports.scope = {
        push: push,
        pop : pop,
        get : get
    };
});