/* Script parser
 * Since this is going to be a very big module
 * I think it is better to separate it from script module
 */

webvn.add('parser', ['util'], function (s, util) {

var parser = {};

/* Parse a command into a well-formed one
 * video -d=2000 opening.avi
 * will become
 * {name:'video', command: {}, option:{'duration':2000}, value:'opening.avi'}
 */
parser.parse = function (cmd) {

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
    if (cache[result.name]) {
        result.command = cache[result.name];
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

};

// Private function

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

return parser;

});