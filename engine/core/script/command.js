/**
 * @namespace script.command
 * @memberof script
 */
WebVN.extend('script', function (exports, Class, log, util)
{
    /**
     * @class Command
     * @extends Class.Base
     * @memberof script.command
     */
    var Command = Class.create(
        /** @lends script.command.Command.prototype */
        {
            constructor: function Command(name)
            {
                // Add to commands
                if (commands[name]) log.warn('Command ' + name + ' is overwritten');
                commands[name] = this;

                // Init ShortHands and defaults
                var shorts   = {},
                    defaults = {};
                util.each(this.options, function (val, key)
                {
                    val.short   && (shorts[val.short] = key);
                    val.default && (defaults[key] = val.default);
                });

                this.shorts   = shorts;
                this.defaults = defaults;
            },

            /**
             * @param {string} values
             */
            execute: function (values)
            {
                values = this.parseOpts(values);
                values = this.evalValue(values);
                this.execution(values);
            },

            /**
             * @param values
             */
            execution: function (values)
            {
                var orders   = this.orders,
                    defaults = this.defaults,
                    value, order, def, i, len;

                for (i = 0, len = orders.length; i < len; i++)
                {
                    order = orders[i];
                    value = values[order];
                    def   = defaults[order];

                    if (!util.isFunction(this[order])) continue;

                    if (value !== undefined)
                    {
                        this[order](value, values);
                    } else if (def !== undefined)
                    {
                        this[order](def, values);
                    }
                }
            },

            /**
             * @param values
             */
            parseOpts: function (values)
            {
                var ret = {},
                    options = this.options,
                    shorts = this.shorts,
                    i, len, keys, key, option;

                util.each(values, function (val, key)
                {
                    if (util.startsWith(key, '--'))
                    {
                        key = key.substr(2);
                        ret[key] = val;
                    } else
                    {
                        key = key.substr(1);
                        if (shorts[key])
                        {
                            ret[shorts[key]] = val;
                        } else
                        {
                            for (i = 0, len = key.length; i < len; i++)
                            {
                                if (shorts[key[i]]) ret[shorts[key[i]]] = val;
                            }
                        }
                    }
                });

                // Parse values
                keys = util.keys(ret);
                for (i = 0, len = keys.length; i < len; i++)
                {
                    key    = keys[i];
                    option = options[key];
                    if (option) ret[key] = parseVal(option.type, ret[key]);
                }

                return ret;
            },

            evalValue: function (values)
            {
                var ret = {};

                util.each(values, function (value, key)
                {
                    if (util.isString(value) && util.startsWith(value, '`'))
                    {
                        ret[key] = exports.jsEvalVal(value.substr(1));
                    } else ret[key] = value;
                });

                return ret;
            },

            options: {},
            orders: [],

            playNext: function (val) { val && exports.play() }
        }
    );

    function parseVal(type, val)
    {
        // Support null assignment
        switch (val)
        {
            case 'null'     : return null;
            case 'undefined': return;
        }

        // LowerCase the type, so that you can write either 'String' or 'string'
        type = type.toLowerCase();
        switch (type)
        {
            case 'string' : return String(val);
            case 'boolean': return !(val === 'false' || val === '0');
            case 'number' : return Number(val);
            case 'json'   : return JSON.parse(val);
            default       : return val;
        }
    }

    function parseCmd(cmdText)
    {
        var ret     = {},
            options = {},
            values  = [],
            parts   = cmdText.match(regSplit),
            option;

        ret.name = parts.shift();

        util.each(parts, function (val)
        {
            if (val[0] === '-')
            {
                option = parseOpt(val);
                options[option[0]] = option[1];
                return;
            }
            values.push(val);
        });

        ret.options = options;
        ret.values  = values;

        return ret;
    }

    var regSplit = /(?:[^\s"]+|"[^"]*")+/g;

    function parseOpt(text)
    {
        var ret      = [],
            equalPos = text.indexOf('=');

        if (equalPos > -1)
        {
            ret.push(text.substr(0, equalPos));
            ret.push(text.substr(equalPos + 1));
        } else
        {
            ret.push(text);
            ret.push(true);
        }

        return ret;
    }

    var commands = {};

    function get(name) { return commands[name] }

    function create(px) { new (Command.extend(px)) }

    exports.command = {
        parse  : parseCmd,
        create : create,
        get    : get,
        Command: Command
    };
});