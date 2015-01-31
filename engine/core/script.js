/* The script system
 * All command is loaded and controled here
 */

webvn.add('script', ['class', 'util', 'config', 'loader'], 
    function (s, kclass, util, config, loader) {

var defaults = {};

var conf = config.create('core-script');
conf.set(defaults).set(config.global.script, true);

var script = {},
    scenarios = ''; // Original scenarios

// Container of commands
var commands = {};

/* Add command
 * Just a simple wrapper of 'new Command'
 */
script.addCommand = function (name, options, processor) {

    s.log.info('Add command: ' + name);

    commands[name] = new script.Command(name, options, processor);

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
        this.vlaue = '';

    },
    // Get the command name
    getName: function () {

        return this.name;

    },
    // Get option full name
    getOptionFullname: function (short) {

        return this.options[short];

    },
    // Set value of the command
    setValue: function (value) {

        this.value = value;

    },
    // Execute command
    execute: function (options, value) {

        this.processor(options, value);

    },
    // A new command should overwrite this function
    processor: function (options, value) {}
});

// Execute command
script.execute = function (cmd) {

    cmd = parse(cmd);
    command = cmd.command;

    command.execute(cmd.option, cmd.value);

};

// Load scenarios
script.load = function (scenario) {

    var prefix = conf.get('prefix'),
        fileType = conf.get('fileType');

    if (!util.isArray(scenario)) {
        scenario = [scenario];
    }

    scenario = scenario.map(function (val) {

        return prefix + val + '.' + fileType;

    });

    loader.scenario(scenario, function (data) {

        scenarios += data + '\n';

    });

};

// Load default scenarios
script.load(conf.get('scenario'));

// Private function

/* Parse a command into a well-formed one
 * video -d=2000 opening.avi
 * will become
 * {name:'video', command: {}, option:{'duration':2000}, value:'opening.avi'}
 */
function parse(cmd) {

    cmd = util.trim(cmd);

    var result = {};

    /* Break the command into different parts by space
     * The space inside quotes is ignored.
     */
    var parts = [],
        sq = "'",
        dq = '"',
        insideSq = false,
        insideDq = false,
        word = '';
        lastC = '';
    for (var i = 0, len = cmd.length; i < len; i++, lastC = c) {
        var c = cmd[i];
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

    /* Parse different types of the seperated command
     * -: option name in short
     * --: option name in long
     * first: command name
     * rest: value
     */
    var option = {},
        value = [];
    result.name = parts.shift();
    if (commands[result.name]) {
        result.command = commands[result.name];
    } else {
        s.log.error('The command ' + result.name + " doesn't exists");
        return;
    }
    for (i = 0, len = parts.length; i < len; i++) {
        var part = parts[i];
        if (util.startsWith(part, '-')) {
            var opt = parseOption(part, result.command);
            option[opt.name] = opt.value;
            continue;
        }
        value.push(part);
    }
    result.option = option;
    result.value = value.join(' ');

    return result;

}

/* Change --t=none
 * into {name:'type', value:'none'}
 */
function parseOption(option, command) {

    var result = {},
        matches = option.match(/-*([^=]*)(=(.*))?/);

    /* If the option has value, set it to the value
     * Otherwise, just set it to true
     */
    result.name = matches[1];
    if (!util.startsWith(option, '--')) {
        result.name = command.getOptionFullname(result.name);
    }
    if (matches[3]) {
        result.value = matches[3];
    } else {
        result.value = true;
    }

    return result;

}

return script;

});
