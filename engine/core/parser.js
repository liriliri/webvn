/* Script parser
 * Since this is going to be a very big module
 * I think it is better to separate it from script module
 */

// TODO alias, macro support
webvn.add('parser', ['util'], function (s, util) {

var parser = {};

/* Parse a command into a well-formed one
 * There are several types of commands, listed as below:
 * 1. Command
 * {
 *      type: 'command',
 *      name: 'video',
 *      options: {
 *          '--duration': 2000,
 *          '--src': 'opening.avi'
 *      },
 *      value: ['value1', 'value2']
 * }
 * 2. Code
 * {
 *      type: 'code',
 *      code: 'var x = 5;'      
 * } 
 * Notice the return is an array since one command
 * is possible to expand into several commands
 */
parser.parse = function (text) {

    var ret = [];

    // Handle code
    if (util.startsWith(text, 'code')) {
        ret.push(parseCode(text));
        return ret;
    }

    // Handle command
    ret.push(parseCommand(text));
    return ret;

};

/* Split a bock of text into small and executable units
 * It simply does the following things:
 * 1. Delete comments
 * 2. Line concatenation when one line is ended with +
 * 3. Handle code block which is quoted with "<% %>"
 * 4. Return an array containing units
 */
parser.split = function (text) {

    text = removeComment(text);

    var ret = [];

    var insideCode = false;

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

        if (util.startsWith(line, '<%')) {
            insideCode = true;
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

function parseCode(text) {

    return {
        type: 'code',
        code: text.substr(5, text.length - 5)
    };

}

function parseCommand(text) {

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
        ret = {
            type: 'command'
        },
        value = [];
    ret.name = parts.shift();
    for (i = 0, len = parts.length; i < len; i++) {
        var part = parts[i];
        if (util.startsWith(part, '-')) {
            var opt = parseOption(part);
            options[opt.name] = opt.value;
            continue;
        }
        value.push(part);
    }
    ret.options = options;
    ret.value = value;

    return ret;

}

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

// Remove block comment and one line comment
function removeComment (text) {

    var insideBlockComment = false,
        insideLineComment = false,
        mark,
        ret = '';

    for (var i = 0, len = text.length; i < len; i++) {
        mark = text[i] + text[i+1];
        if (insideBlockComment) {
            if (mark === '*/') {
                insideBlockComment = false;
                i++;
            }
            continue;
        }
        if (insideLineComment) {
            if (text[i] === '\n') {
                insideLineComment = false;
            } else {
                continue;
            }
        }
        if (mark === '/*') {
            insideBlockComment = true;
            ret = ret.substr(0, ret.length - 1);
            continue;
        }
        if (mark === '//') {
            insideLineComment = true;
            continue;
        }
        ret += text[i];
    }

    return ret;

}

return parser;

});