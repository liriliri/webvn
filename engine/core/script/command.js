/**
 * @namespace script.command
 * @memberof script
 */
WebVN.extend('script', function (exports, Class, log, util)
{
    /**
     * @class Command
     * @memberof script.command
     * @extends Class.Base
     * @property shorts
     * @property defaults
     */
    var Command = Class.create(
        /** @lends script.command.Command.prototype */
        {
            constructor: function Command(name)
            {
                if (commands[name]) log.warn('Command ' + name + ' is overwritten');
                commands[name] = this;

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
             * @param {string} vals
             * @param text
             */
            execute: function (vals, text)
            {
                vals = this.parseOpts(vals);

                if (this.beforeExec(vals, text)) this.execution(vals);
            },

            beforeExec: function () { return true },

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
                    i, len, keys, key, option, short;

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
                            short = '';
                            for (i = 0, len = key.length; i < len; i++)
                            {
                                short += key[i];
                                if (shorts[short])
                                {
                                    ret[shorts[short]] = val;
                                    short = '';
                                }
                            }
                        }
                    }
                });

                keys = util.keys(ret);
                for (i = 0, len = keys.length; i < len; i++)
                {
                    key    = keys[i];
                    option = options[key];
                    if (option) ret[key] = parse.val(option.type, ret[key], option.range);
                }

                return ret;
            },

            options: {},
            orders: [],

            playNext: function (val) { val && exports.play() }
        }
    );

    var parse = {
        val: function (types, vals, ranges)
        {
            switch (vals)
            {
                case 'null'     : return null;
                case 'undefined': return;
            }

            types = types.toLowerCase().split('|');

            var multiple = types.length > 1,
                val, range;

            vals = multiple ? vals.split('|') : [vals];

            if (!ranges) ranges = [];

            util.each(types, function (type, idx)
            {
                val   = vals[idx];
                range = ranges[idx];

                switch (type)
                {
                    case 'string' : val = parse.string(val, range) ; break;
                    case 'boolean': val = parse.boolean(val, range); break;
                    case 'number' : val = parse.number(val, range) ; break;
                    case 'json'   : val = parse.json(val, range)   ; break;
                }
                vals[idx] = val;
            });

            return multiple ? vals : vals[0];
        },
        string: function (val, range)
        {
            val = String(val);

            if (!range) return val;

            if (util.inArray(range, val))
            {
                return val;
            } else
            {
                log.warn(val + ' is not inside [' + range.join(',') + '].');
            }
        },
        number: function (val, range)
        {
            val = Number(val);

            if (!range) return val;

            range = range.replace(/>/g, 'val>').replace(/</, 'val<')
                .replace(/&/g, '&&').replace(/\|/g, '|');

            if (eval(range))
            {
                return val;
            } else
            {
                log.warn(val + ' is out of number range.');
            }
        },
        json: function (val)
        {
            return JSON.parse(val);
        },
        boolean: function (val)
        {
            return !(val === 'false' || val === '0');
        }
    };

    var regSplit = /(?:[^\s"']+|"[^"]*"|'[^']*')+/g;

    function parseCmd(cmdText)
    {
        var ret     = {},
            options = {},
            values  = [],
            parts   = cmdText.match(regSplit),
            option;

        ret.name = parts.shift();

        util.each(parts, function (val, idx)
        {
            parts[idx] = val;
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
        ret.parts   = parts;

        return ret;
    }

    function parseOpt(text)
    {
        var ret      = [],
            equalPos = text.indexOf('=');

        if (equalPos > -1)
        {
            ret.push(text.substr(0, equalPos));
            ret.push(util.trimQuote(text.substr(equalPos + 1)));
        } else
        {
            ret.push(text);
            ret.push(true);
        }

        return ret;
    }

    var commands = {};

    function get(name) { return commands[name] }

    /**
     * Create new Command.
     * @method create
     * @memberof script.command
     * @param {Object} px New command class prototype.
     */
    function create(px) { new (Command.extend(px)) }

    /**
     * Check command exists or not.
     * @method has
     * @memberof script.command
     * @param {string} name Command name.
     * @returns {boolean} Exists or not.
     */
    function has(name) { return commands[name] != undefined }

    exports.command = {
        parse  : parseCmd,
        create : create,
        get    : get,
        has    : has,
        Command: Command
    };
});