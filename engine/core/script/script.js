/**
 * @namespace script
 */
WebVN.extend('script', function (exports, config, util, loader, log, storage, event, state)
{
    var cfg      = config.create('script'),
        parser   = exports.parser,
        lexer    = exports.lexer;

    event.observer.create(exports);

    parser.yy    = exports.parserNode;
    parser.lexer = {
        lex: function ()
        {
            var token = parser.tokens[this.pos++],
                tag;

            if (token)
            {
                tag = token[0];
                this.yytext   = token[1];
                this.yyloc    = token[2];
                this.yylineno = this.yyloc.first_line;
            } else tag = '';

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
     * @method parse
     * @memberof script
     * @param {string} scenarioText Pure scenario text.
     * @return {string} JavaScript code converted from scenario text.
     */
    var parse = exports.parse = function (scenarioText)
    {
        return parser.parse(lexer(scenarioText));
    };

    /**
     * Parse the scenario into javaScript and eval it, just a wrapper of parse.
     * @method eval
     * @memberof script
     * @param {string} scenarioText Pure scenario text.
     */
    var wvnEval = exports.eval = function (scenarioText)
    {
        // console.log(parse(scenarioText));
        exports.js.eval(parse(scenarioText));
    };

    var asset = storage.asset.create(cfg.get('path'), cfg.get('extension'));

    /**
     * Load first scenario and begin executing it.
     */
    var load = exports.load = function (scenario)
    {
        scenario = scenario || cfg.get('startScenario');

        loader.get(asset.get(scenario), {}, function (data)
        {
            exports.parserNode.file(scenario + '.wvn');
            exports.stack.file = scenario;
            wvnEval(data);
            start();
        });
    };

    var State = state.create('pause', [
        { name: 'play',  from: 'pause', to: 'play' },
        { name: 'pause', from: 'play',  to: 'pause'}
    ]);

    state = new State;

    /**
     * Start executing the scripts from beginning.
     * @method start
     * @memberof script
     */
    var start = exports.start = function ()
    {
        reset();
        play();
    };

    /**
     * Jump to specified label.
     * @method jump
     * @memberof script
     * @param labelName
     */
    exports.jump = function (fileName, labelName)
    {
        if (!labelName)
        {
            labelName = fileName;
            fileName = '';
        } else
        {
            load(fileName);
        }

        var label = exports.label;

        if (!label.has(fileName, labelName))
        {
            log.warn('Label ' + labelName + ' not found');
            return;
        }

        exports.stack.jump(label.get(fileName, labelName));

        resume();
    };

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
     * @method pause
     * @memberof script
     * @param {Number} [duration]
     * @param {Function} [cb]
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
     * @method wait
     * @memberof script
     * @param duration
     */
    exports.wait = function (duration)
    {
        pause(duration, function () { play() });
    };

    /**
     * Insert Command to current stack.
     * @method insert
     * @memberof script
     * @param {Array.<Array>|Array} commands
     */
    exports.insert = function (commands)
    {
        var stack = exports.stack,
            len, i;

        if (!util.isArray(commands[0])) commands = [commands];

        stack.push('insertion');

        for (i = 0, len = commands.length; i < len; i++)
        {
            stack.$$.apply(null, commands[i]);
        }
    };
});