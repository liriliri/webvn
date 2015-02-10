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
    splitScript = [];

// Container of commands
var cache = {};

/* Add command
 * Just a simple wrapper of 'new Command'
 */
script.addCommand = function (name, options, processor) {

    log.info('Add command: ' + name);

    cache[name] = new script.Command(name, options, processor);

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

    cmd = parser.parse(cmd);
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

        var splitData = parser.split(data);

        getLabel(splitData);

        splitScript = splitScript.concat(splitData);

    });

};

// Load default scenarios
script.load(conf.get('scenario'));

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
        }
    }

}

return script;

});
