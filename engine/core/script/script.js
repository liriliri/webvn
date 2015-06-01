webvn.module('script', function (config, parser, parserNode, util, loader, lexer, log, storage, Class, exports) {
    "use strict";
    var conf = config.create('script');

    lexer = lexer.lexer;

    // Parser
    parser = parser.parser;

    parser.lexer = {
        lex: function () {

            var tag, token;
            token = parser.tokens[this.pos++];

            if (token) {
                tag = token[0];
                this.yytext = token[1];
                this.yyloc = token[2];
                this.yylineno = this.yyloc.first_line;
            } else {
                tag = '';
            }

            return tag;

        },
        setInput: function (tokens) {

            parser.tokens = tokens;

            return this.pos = 0;

        }
    };

    parser.yy = parserNode;

    var parse = exports.parse = function (scenario) {
        var tokens = lexer(scenario);
        return parser.parse(tokens);
    };

    // Parse the source code and eval it
    var wvnEval = exports.eval = function (code) {
        exports.jsEval(parse(code));
    };

    // Script controller

    /* Contains the result of source file eval:
     * [ ['command', 'dialog -d'], ['if', function () { if... }]... ]
     */
    var sources = [];

    // Middle scripts, temporary usage
    var middles = [];

    /* Final command waiting for executing
     */
    var executions = [];

    var isSource = true;

    //noinspection JSUnusedLocalSymbols
    exports.$$ = function () {
        var source = util.toArray(arguments);

        preExec(source, sources.length);

        /* When executing,
         * command defined inside a if statement
         * should be loaded into middles.
         */
        if (isSource) {
            sources.push(source);
        } else {
            middles.push(source);
        }
    };

    // Execute command when first load, handle things like label
    function preExec(source, line) {
        switch (source[0]) {
            case 'label':
                label.create(source[1], line);
                break;
            case 'function':
                // Since functions can't be stored, we have to create them at start
                functions.create(source[1], source[2]);
                break;
        }
    }

    var label = Class.module(function () {
        var exports = {};

        var labels = {};

        exports.create = function (name, lineNum) {
            labels[name] = lineNum;
        };

        exports.has = function (name) {
            return labels[name] !== undefined;
        };

        exports.get = function (name) {
            return labels[name];
        };

        return exports;
    });

    var asset = storage.createAsset(conf.get('path'), conf.get('extension'));

    // Load scenarios and begin executing them
    exports.load = function (scenarios) {

        scenarios = scenarios || conf.get('scenarios');

        if (!util.isArray(scenarios)) {
            scenarios = [scenarios];
        }

        scenarios = scenarios.map(function (value) {
            return asset.get(value);
        });

        loader.scenario(scenarios, function (data, isLast) {
            loadText(data, isLast);
        });

    };

    /**
     * @function webvn.script.loadText
     * @param {string} str
     * @param {boolean=} startGame
     */
    var loadText = exports.loadText = function (str, startGame) {
        wvnEval(str);
        if (startGame) {
            start();
        }
    };

    // Execute command or code
    var exec = exports.exec = function (unit) {

        switch (unit[0]) {
            case 'command':
                execCommand(unit);
                break;
            case 'code':
                execCode(unit);
                break;
            case 'label':
                // Just pass it
                play();
                break;
            default:
                log.warn("Unknown command type");
                break;
        }

    };

    var alias = exports.alias = Class.module(function (exports) {
        var aliases = {};

        exports.create = function (name, value) {
            aliases[name] = value;
        };

        var commandRegex = /^[^\s]+/;

        exports.parse = function (str) {
            var command = commandRegex.exec(str)[0];
            if (aliases[command]) return str.replace(commandRegex, aliases[command]);

            return str;
        };
    });

    var define = exports.define = Class.module(function (exports) {
        var defines = {};

        exports.create = function (name, value) {
            defines[name] = value;
        };

        exports.parse = function (str) {
            util.each(defines, function (val, key) {
                str = str.replace(reg(key), val);
            });

            return str;
        };

        var regExp = {};

        function reg(str) {
            if (!regExp[str]) regExp[str] = new RegExp(str, 'g');

            return regExp[str];
        }
    });

    var functions = Class.module(function () {
        var exports = {};

        var container = {};

        exports.create = function (name, fn) {
            container[name] = fn;
        };

        exports.has = function (name) {
            return container[name] !== undefined;
        };

        var spaceRegex = /\s/;

        exports.execute = function (name, params) {
            var fn = container[name];

            // Wrap params with spaces
            params = params.map(function (value) {
                if (spaceRegex.test(value)) {
                    value = "'" + value + "'";
                }
                return value;
            });

            isSource = false;
            fn.apply(null, params);
            isSource = true;

            executions = middles.concat(executions);
            middles = [];
        };

        return exports;
    });

    function execCommand(command) {
        var lineNum = command[2],
            commandText = cmdBeautify(command[1]);

        log.info('Command: ' + commandText + ' ' + lineNum);

        // Do alias replacement.
        commandText = alias.parse(commandText);

        // Do define replacement.
        commandText = define.parse(commandText);

        command = exports.command.parse(commandText);
        var name = command.name,
            options = command.options,
            values = command.values;

        // Execute function
        if (functions.has(name)) {
            functions.execute(name, values);
            play();
            return;
        }

        // Execute command
        var cmd = exports.command.get(name);
        if (!cmd) {
            if (functions.has('default')) {
                functions.execute('default', [commandText]);
                play();
                return;
            }
            log.warn('Command ' + name + ' doesn\'t exist');
            return;
        }
        cmd.execute(options);
    }

    function cmdBeautify(str) {
        return str.split('\n').
            map(function (value) {
                return util.trim(value);
            }).join(' ');
    }

    function execCode(code) {
        var lineNum = code[2];
        log.info('Code: ' + code[1] + ' ' + lineNum);
        exports.jsEval(code[1]);
    }

    /* Indicate which line is being executed now,
     * related to sources array.
     */
    var curNum = 0;

    // Start executing the scripts from beginning.
    var start = exports.start = function () {
        reset();
        play();
    };

    exports.jump = function (labelName) {
        // Clear executions
        if (!label.has(labelName)) {
            log.warn('Label ' + labelName + ' not found');
            return;
        }
        executions = [];
        curNum = label.get(labelName);
        resume();
    };

    exports.insertCmd = function (script) {
        isSource = false;
        wvnEval(script);
        isSource = true;
    };

    // Reset everything to initial state
    var reset = exports.reset = function () {
        isPaused = false;
        curNum = 0;
        middles = [];
        executions = [];
    };

    // Whether
    var isPaused = false;

    // Similar to play, except the isPaused will be changed to true.
    //noinspection JSUnusedLocalSymbols
    var resume = exports.resume = function () {

        isPaused = false;
        play();

    };

    /* Play the next command,
     * if isPaused is true, then it's not going to work.
     */
    var play = exports.play = function () {
        if (isPaused) {
            return;
        }
        var execution = loadExecutions();
        if (execution) {
            exec(execution);
        }
    };

    // Load executions script
    function loadExecutions() {
        var source, isCommand = false;

        while (true) {
            if (!_loadExecutions()) {
                return;
            }

            source = executions.shift();

            switch (source[0]) {
                case 'if':
                    isSource = false;
                    source[1]();
                    isSource = true;
                    executions = middles.concat(executions);
                    middles = [];
                    break;
                case 'function':
                    functions.create(source[1], source[2]);
                    break;
                default:
                    isCommand = true;
            }

            if (isCommand) {
                break;
            }
        }

        return source;
    }

    function _loadExecutions() {

        if (executions.length === 0) {
            if (curNum >= sources.length) {
                log.warn('End of scripts');
                isPaused = true;
                return false;
            }
            executions.push(sources[curNum]);
            curNum++;
        }

        return true;

    }

    //noinspection JSUnusedLocalSymbols
    var pause = exports.pause = function (duration, cb) {

        isPaused = true;

        if (duration) {
            setTimeout(function () {

                isPaused = false;
                cb && cb();

            }, duration);
        }

    };

    exports.wait = function (duration) {
        pause(duration, function () {
            play();
        });
    };
});