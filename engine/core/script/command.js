webvn.extend('script', ['class', 'util'], function (exports, kclass, util) {
    "use strict";
    var commands = {};

    exports.getCommand = function (name) {
        return commands[name];
    };

    exports.createCommand = function (px) {
        new (Command.extend(px));
    };

    /**
     * Command Class <br>
     * Every command that is used should be created using this class.
     * otherwise, the command may not be executed properly by the script interpreter.
     * @class webvn.script.Command
     * @param {string} name command name
     */
    var Command = exports.Command = kclass.create({
        constructor: function Command(name) {
            // Add to commands first
            if (commands[name]) {
                log.warn('The command ' + name + ' is overwritten');
            }
            commands[name] = this;

            // Init shortHands and defaults
            var shortHands = {},
                defaults = {};
            util.each(this.options, function (value, key) {
                value.shortHand && (shortHands[value.shortHand] = key);
                value.defaultValue && (defaults[key] = value.defaultValue);
            });
            this.shortHands = shortHands;
            this.defaults = defaults;
        },

        shortHands: {},
        options: {},
        orders: [],

        playNext: function (value) {
            value && exports.play();
        },

        /**
         * Execute command with given options.
         * @method webvn.script.Command#exec
         * @param {object} values
         */
        execute: function (values) {
            values = this.parseOptions(values);
            values = this.evalValue(values);
            this.execution(values);
        },

        /**
         * Call functions according to option values.
         * If you like, you can re-implement it.
         * @method webvn.script.Command#execution
         * @param {object} values values parsed from scripts
         */
        execution: function (values) {
            var orders = this.orders,
                defaults = this.defaults,
                value, order, def;

            this.beforeExec(values);

            for (var i = 0, len = orders.length; i < len; i++) {
                order = orders[i];
                value = values[order];
                def = defaults[order];

                if (!util.isFunction(this[order])) {
                     continue;
                }

                if (value !== undefined) {
                    this[order](value, values);
                } else if (def !== undefined) {
                    this[order](def, values);
                }
            }

            this.afterExec(values);
        },

        beforeExec: function (values) {},

        afterExec: function (values) {},

        evalValue: function (values) {
            var ret = {};

            util.each(values, function (value, key) {
                if (util.isString(value) && util.startsWith(value, '`')) {
                    ret[key] = exports.jsEvalVal(value.substr(1));
                } else {
                    ret[key] = value;
                }
            });

            return ret;
        },

        /**
         * Parse options for final usage in execution function.
         * @param values
         * @returns {object}
         */
        parseOptions: function (values) {
            var ret = {},
                self = this,
                shortHands = this.shortHands;
            util.each(values, function (value, key) {
                var keys = [], opt;
                if (util.startsWith(key, '--')) {
                    key = key.substr(2, key.length - 2);
                    ret[key] = value;
                    keys.push(key);
                } else {
                    key = key.substr(1, key.length - 1);
                    if (shortHands[key]) {
                        ret[shortHands[key]] = value;
                        keys.push(shortHands[key]);
                    } else {
                        for (var i = 0, len = key.length; i < len; i++) {
                            var k = shortHands[key[i]];
                            if (k) {
                                ret[k] = value;
                            }
                            keys.push(k);
                        }
                    }
                }
                // Get rid of illegal options and parse values
                for (i = 0, len = keys.length; i < len; i++) {
                    key = keys[i];
                    opt = self.options[key];
                    if (opt) {
                        ret[key] = self.parseValue(opt.type, ret[key]);
                    } else {
                        delete ret[key];
                    }
                }
            });
            return ret;
        },

        /**
         * Parse option value into specific type
         * @method webvn.script.Command#parseValue
         * @param {string} type String, Boolean...
         * @param {string} value value to be parsed
         * @returns {*}
         */
        parseValue: function (type, value) {
            // Support null assignment
            switch (value) {
                case 'null':
                    return null;
            }

            // LowerCase the type, so that you can write either 'String' or 'string'
            type = type.toLowerCase();
            switch (type) {
                case 'string':
                    return String(value);
                case 'boolean':
                    return !(value === 'false' || value === '0');
                case 'number':
                    return Number(value);
                case 'json':
                    return JSON.parse(value);
                default:
                    return value;
            }
        }

    });

    exports.parseCommand = function (text) {

        /* Break the command into different parts by space
         * The space inside quotes is ignored.
         */
        var parts = [],
            sq = "'",
            dq = '"',
            insideSq = false,
            insideDq = false,
            word = '',
            lastC = '';
        for (var i = 0, len = text.length; i < len; i++, lastC = c) {
            var c = text[i];
            if (i === len - 1) {
                if (c !== sq && c !== dq) {
                    word += c;
                }
                parts.push(word);
            }
            switch (c) {
                case ' ':
                    if (lastC !== ' ') {
                        if (insideDq || insideSq) {
                            word += c;
                            continue;
                        } else {
                            parts.push(word);
                            word = '';
                        }
                    }
                    continue;
                case sq:
                    if (insideSq) {
                        insideSq = false;
                    } else {
                        if (!insideDq) {
                            insideSq = true;
                        } else {
                            word += c;
                        }
                    }
                    continue;
                case dq:
                    if (insideDq) {
                        insideDq = false;
                    } else {
                        if (!insideSq) {
                            insideDq = true;
                        } else {
                            word += c;
                        }
                    }
                    continue;
            }
            word += c;
        }

        var options = {},
            ret = {},
            values = [];
        ret.name = parts.shift();
        for (i = 0, len = parts.length; i < len; i++) {
            var part = parts[i];
            if (util.startsWith(part, '-')) {
                var opt = parseOption(part);
                options[opt.name] = opt.value;
                continue;
            }
            values.push(part);
        }
        ret.options = options;
        ret.values = values;

        return ret;

    };

    /* Change --t=none
     * into {name:'--t', value:'none'}
     */
    function parseOption(text) {

        var ret = {},
            equalPos = text.indexOf('=');

        /* If the option has value, set it to the value
         * Otherwise, just set it to true
         */
        if (equalPos > -1) {
            ret.name = text.substr(0, equalPos);
            ret.value = text.substr(equalPos + 1, text.length - equalPos - 1);
        } else {
            ret.name = text;
            ret.value = true;
        }

        return ret;

    }

});