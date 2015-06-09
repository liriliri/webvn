/**
 * @namespace script
 */
WebVN.extend('script', function (exports, config, util, loader, log, storage, event)
{
    var conf     = config.create('script'),
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
        exports.js.eval(parse(scenarioText));
    };

    var asset = storage.asset.create(conf.get('path'), conf.get('extension'));

    // Load scenarios and begin executing them
    exports.load = function (scenarios)
    {
        scenarios = scenarios || conf.get('scenarios');

        if (!util.isArray(scenarios)) scenarios = [scenarios];

        scenarios = scenarios.map(function (value) { return asset.get(value) });

        loader.scenario(scenarios, function (data, isLast, fileName)
        {
            loadText(data, isLast, fileName);
        });

    };

    /**
     * @function webvn.script.loadText
     * @param {string} str
     * @param {boolean=} startGame
     */
    var loadText = exports.loadText = function (str, startGame, fileName)
    {
        exports.parserNode.file(fileName);
        wvnEval(str);
        if (startGame) start();
    };

    // Start executing the scripts from beginning.
    var start = exports.start = function ()
    {
        reset();
        play();
    };

    exports.jump = function (labelName)
    {
        var label = exports.label;

        if (!label.has(labelName))
        {
            log.warn('Label ' + labelName + ' not found');
            return;
        }
        exports.stack.jump(label.get(labelName));
        resume();
    };

    exports.insertCmd = function (script)
    {
        exports.isSource = false;
        wvnEval(script);
        exports.isSource = true;
    };

    // Reset everything to initial state
    var reset = exports.reset = function ()
    {
        isPaused = false;
        curNum   = 0;

        exports.middles    = [];
        exports.executions = [];
    };

    // Whether
    var isPaused = false;

    // Similar to play, except the isPaused will be changed to true.
    //noinspection JSUnusedLocalSymbols
    var resume = exports.resume = function ()
    {
        isPaused = false;
        play();
    };

    /* Play the next command,
     * if isPaused is true, then it's not going to work.
     */
    var play = exports.play = function ()
    {
        if (isPaused) return;

        var command = exports.stack.getCmd();

        if (command != undefined) exports.execute(command);
    };

    //noinspection JSUnusedLocalSymbols
    var pause = exports.pause = function (duration, cb)
    {
        isPaused = true;

        if (duration)
        {
            setTimeout(function ()
            {
                isPaused = false;
                cb && cb();
            }, duration);
        }

    };

    exports.wait = function (duration)
    {
        pause(duration, function () { play() });
    };
});