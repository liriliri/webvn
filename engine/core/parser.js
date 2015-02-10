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
parser.parseCmd = function (cmd) {

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

/* Split a bock of text into small and executable units
 * It simply does the following things:
 * 1. Delete comments
 * 2. Line concatenation when one line is ended with +
 * 3. Handle code block which is quoted with "<% %>"
 * 4. Return an array containing units
 */
parser.split = function (text) {

    var ret = [];

    var insideBlockComment = false,
        insideLineComment = false,
        insideCode = false;

    for (var i = 0, len = text.length, line = '';
        i < len; i++) {

        line += text[i];

        if (line[0] === ' ') {
            line = util.trim(line);
        }

        if (insideCode) {
            if (util.endsWith(line, '%>')) {
                insideCode = false;
                line = 'code ' + line.substr(2, line.length - 4);
                ret.push(line);
                line = '';
                continue;
            }
        }

        if (insideBlockComment) {
            if (util.endsWith(line, '*/')) {
                insideBlockComment = false;
                line = '';
            }
            continue;
        }

        if (insideLineComment) {
            if (util.endsWith(line, '\n')) {
                insideLineComment = false;
                line = '';
            }
            continue;
        }

        if (util.startsWith(line, '<%')) {
            insideCode = true;
            continue;
        }

        if (util.startsWith(line, '/*')) {
            insideBlockComment = true;
            continue;
        }

        if (util.startsWith(line, '//')) {
            insideLineComment = true;
            continue;
        }

        if (util.endsWith(line, '\n')) {
            line = line.substr(0, line.length - 1);
            line = util.trim(line);
            // If the line ends with '+', concatenate the next line
            if (util.endsWith(line, '+')) {
                line = line.substr(0, line.length - 1);
                continue;
            }
            if (line !== '') {
                ret.push(line);
                line = '';
                continue;
            }
        }

        // End of all text
        if (i === len - 1) {
            line = util.trim(line);
            if (line !== '') {
                ret.push(line);
            }
        }
    }

    return ret;

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