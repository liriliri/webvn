/* The script system
 * All command is loaded and controled here
 */

webvn.add('script', ['class', 'util', 'config', 'loader', 'parser', 'log'], 
    function (s, kclass, util, config, loader, parser, log) {

var defaults = {};

var conf = config.create('core-script');
conf.set(defaults).set(config.global.script, true);

var script = {},
    label = {},
    splitScript = [],
    // The script num currently executing 
    curNum = 0,
    isPause = true,
    /* Script that is actually executing, and is not just plain string
     * If empty, get new ones from splitScript
     */
    execScript = [];

// Container of commands
var commands = {};

/* Add command
 * Just a simple wrapper of 'new Command'
 */
script.addCommand = function (name, options, processor) {

    log.info('Add command: ' + name);

    commands[name] = new script.Command(name, options, processor);

    return commands[name];

};

/* Command Class
 * Every command that is used should be created using this class.
 * Otherwise, the command may not be executed properly by the script interpreter.
 */
script.Command = kclass.create({
    /* name: the name of the command
     * options: the command options relations
     * processor: the function called by script interpreter
     */
    constructor: function Command(name, options, processor) {

        this.name = name;
        this.options = options;
        this.processor = processor;

        // Init shortHands
        var shortHands = {};
        util.each(this.options, function (value, key) {

            if (value.shortHand) {
                shortHands[value.shortHand] = key;
            }

        });
        this.shortHands = shortHands;

    },
    // Get the command name
    getName: function () {

        return this.name;

    },
    // Execute command
    exec: function (options, value) {

        options = this.parseOptions(options);

        this.processor(options, value);

    },
    parseOptions: function (options) {

        var ret = {},
            self = this,
            shortHands = this.shortHands;

        util.each(options, function (value, key) {

            var keys = [];

            if (util.startsWith(key, '--')) {
                key = key.substr(2, key.length - 2);
                ret[key] = value;
                keys.push(key);
            } else {
                key = key.substr(1, key.length - 1);
                if (shortHands[key]) {
                    ret[shortHands[key]] = value;
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

            // Get rid of illegal options and parse is values
            for (i = 0, len = keys.length; i < len; i++) {
                var key = keys[i],
                    opt = self.options[key];
                if (opt) {
                    ret[key] = opt.type(ret[key]);
                } else {
                    delete ret[key];
                }
            }

        });

        return ret;

    },
    // A new command should overwrite this function
    processor: function (options, value) {}
});

// Execute command
script.exec = function (unit) {

    switch (unit.type) {
        case 'command': 
            execCommand(unit);
            break;
        case 'code': 
            execCode(unit);
            break;
        default:
            break;
    }

};

// Load scenarios
script.load = function (scenario) {

    scenario = scenario || conf.get('scenario');

    var prefix = conf.get('prefix'),
        fileType = conf.get('fileType');

    if (!util.isArray(scenario)) {
        scenario = [scenario];
    }

    scenario = scenario.map(function (val) {

        return prefix + val + '.' + fileType;

    });

    loader.scenario(scenario, function (data, isLast) {

        var splitData = parser.split(data);

        getLabel(splitData);

        splitScript = splitScript.concat(splitData);

        // If this is the last scenario, then begin executing
        if (isLast) {
            script.start();
        }

    });

};

script.resume = function () {

    if (execScript.length === 0) {
        var line = splitScript[curNum];
        curNum++;
        execScript = execScript.concat(parser.parse(line));
    }

    script.exec(execScript.shift());

}

// Start executing scripts
script.start = function () {

    curNum = 0;
    script.resume();

};

function execCode(unit) {



}

function execCommand(unit) {

    var name = unit.name,
        options = unit.options,
        value = unit.value;

    log.info("Running command: " + name);

    var cmd = commands[name];

    if (cmd === undefined) {
        log.error('Command not found!');
        return;
    }

    cmd.exec(options, value);

};

/* Extract label and store it into label variable
 * Basically, it turns '* chapter1 | save name' into:
 * 'chapter1': {lineNum: 5, displayName: 'save name';
 */  
function getLabel(data) {

    var startNum = splitScript.length;

    for (var i = 0, len = data.length; i < len; i++) {
        var line = data[i];
        if (util.startsWith(line, '*')) {
            line = line.substr(1, line.length - 1);
            var arr = line.split('|');
            label[util.trim(arr[0])] = {
                lineNum: startNum + i,
                displayName: arr[1]
            };
            // Delete the line since it's not useful anymore
            data.splice(i, 1);
            len -= 1;
        }
    }

}

return script;

});
