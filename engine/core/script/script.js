/**
 * @namespace script
 */
WebVN.extend('script', function (exports, config, util, loader, log, storage, event, Class)
{
    var cfg    = config.create('script'),
        parser = exports.parser,
        lexer  = exports.lexer;

    event.observer.create(exports);

    parser.yy    = exports.parserNode;
    parser.lexer = {
        lex: function ()
        {
            var token = parser.tokens[this.pos++],
                tag   = '';

            if (token)
            {
                tag = token[0];
                this.yytext   = token[1];
                this.yyloc    = token[2];
                this.yylineno = this.yyloc.first_line;
            }

            return tag;
        },
        setInput: function (tokens)
        {
            parser.tokens = tokens;

            return this.pos = 0;
        }
    };

    /**
     * Parse scenario into javaScript.
     * @method   parse
     * @memberof script
     * @param    {String} text Pure scenario text.
     * @return   {String} JavaScript code converted from scenario text.
     */
    var parse = exports.parse = function (text)
    {
        return parser.parse(lexer(text));
    };

    /**
     * Parse the scenario into javaScript and eval it, a wrapper of parse method.
     * @method   eval
     * @memberof script
     * @param    {string} text Pure scenario text.
     */
    var eval = exports.eval = function (text)
    {
        exports.js.eval(parse(text));

        return exports;
    };

    var asset = storage.asset.create(cfg.get('path'), cfg.get('extension'));

    /**
     * Load scenario. If scenario is not specified, the default one will be loaded.
     * @method   load
     * @memberof script
     * @param {String}   [scenario] Scenario file name without 'wvn' extension.
     * @param {Function} [cb]       Callback when scenario file is loaded.
     */
    var load = exports.load = function (scenario, cb)
    {
        if (util.isFunction(scenario))
        {
            cb = scenario;
            scenario = cfg.get('startScenario');
        }

        scenario = scenario || cfg.get('startScenario');

        loader.get(asset.get(scenario), {}, function (data)
        {
            exports.parserNode.file(scenario + '.wvn');
            exports.stack.file = scenario;
            eval(data);
            cb && cb();
        });

        return exports;
    };

    var State = Class.State.create('pause', [
        { name: 'play',  from: 'pause', to: 'play' },
        { name: 'pause', from: 'play',  to: 'pause'}
    ]),
        state = new State;

    /**
     * Start executing the scripts from beginning.
     * @method start
     * @memberof script
     */
    exports.start = function ()
    {
        reset();
        play();

        return exports;
    };

    /**
     * Jump to specified label.
     * @method   jump
     * @memberof script
     * @param    fileName
     * @param    labelName
     */
    exports.jump = function (fileName, labelName)
    {
        load(fileName, function ()
        {
            jump(fileName, labelName);
        });
    };

    function jump(fileName, labelName)
    {
        var label = exports.label,
            lineNum = 0;

        if (!label.has(fileName, labelName))
        {
            log.warn('Label ' + labelName + ' not found');
        } else
        {
            lineNum = label.get(fileName, labelName);
        }

        exports.stack.jump(lineNum);

        resume();
    }

    /**
     * Reset everything to initial state
     * @method reset
     * @memberof script
     */
    var reset = exports.reset = function ()
    {
        exports.stack.reset();
        state.play();
    };

    /**
     * Similar to play, except the isPaused will be changed to true.
     * @method resume
     * @memberof script
     */
    var resume = exports.resume = function ()
    {
        state.play();
        play();
    };

    /**
     * Play the next command, if state is true, then it's not going to work.
     * @method play
     * @memberof script
     */
    var play = exports.play = function ()
    {
        if (state.is('pause')) return;

        var command = exports.stack.getCmd();

        if (command != undefined) exports.execute(command);
    };

    /**
     * Pause script.
     * @method   pause
     * @memberof script
     * @param    {Number}   [duration]
     * @param    {Function} [cb]
     */
    var pause = exports.pause = function (duration, cb)
    {
        state.pause();

        if (duration)
        {
            setTimeout(function ()
            {
                state.play();
                cb && cb();
            }, duration);
        }
    };

    /**
     * Pause script for a time and execute script when finished.
     * @method   wait
     * @memberof script
     * @param    duration
     */
    exports.wait = function (duration)
    {
        pause(duration, function () { play() });
    };

    /**
     * Insert Command to current stack.
     * @method   insert
     * @memberof script
     * @param    {Array.<Array>|Array} commands
     */
    exports.insert = function (commands)
    {
        var stack = exports.stack,
            len, i;

        if (!util.isArray(commands[0])) commands = [commands];

        stack.push('insertion');

        len = commands.length;

        for (i = 0; i < len; i++) stack.$$(commands[i]);
    };
});