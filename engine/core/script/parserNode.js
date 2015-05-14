/* Provide function used by parser,
 * Helper function related to wvnScript/javaScript translation
 */

webvn.module('parserNode', ['class', 'util'],
    function (kclass, util) {

        var exports = {};

        var lineNum = 0;

        exports.lineNum = function (value) {
            "use strict";
            lineNum = value;
        };

        exports.expression = function (content) {

            content = removeLastLineBreak(content);

            return '$$(' + content + ', ' + lineNum + ');\n';

        };

        exports.label = function (label) {
            return '"label", "' + util.trim(label) + '"';
        };

        exports.command = function (command) {

            command = formatParam(escapeQuote(command));

            return '"command", "' + util.trim(command) + '"';

        };

        exports.code = function (code) {

            // Trim every line to make it look decent
            var lines = code.split('\n');
            for (var i = 0, len = lines.length; i < len; i++) {
                lines[i] = util.trim(lines[i]);
            }
            code = lines.join('\n');
            code = escapeQuote(code);

            return '"code", "' + code + '"';

        };

        exports.block = function (block) {

            block = indent(block);

            return ' {\n' + block + '}\n';

        };

        exports.paramList = function (paramList, param) {

            return paramList + ', ' + param;

        };

        exports.ifWrapper = function (body) {

            body = indent(body);

            return '"if", function () {\n' + body + '}\n';

        };

        exports['if'] = function (condition, block) {

            return 'if (' + condition + ')' + block;

        };

        exports.ifElse = function (former, latter) {

            former = removeLastLineBreak(former);

            return former + ' else ' + util.trim(latter) + '\n';

        };

        exports['function'] = function (name, param, block) {

            if (block === undefined) {
                block = param;
                param = '';
            }

            return '"function", "' + name + '", function (' + param + ')' + block;

        };

        function removeLastLineBreak(text) {

            var len = text.length;

            if (text[len - 1] === '\n') {
                text = text.substr(0, len - 1);
            }

            return text;

        }

        function indent(text) {

            var ret = '\t' + text;

            ret = ret.replace(/\n/g, '\n\t');

            var len = ret.length;
            if (ret[len - 1] === '\t') {
                ret = ret.substr(0, len - 1);
            }

            return ret;

        }

        // Change {{param}} to " + param + "
        function formatParam(text) {
            return text.replace(/\{\{/g, '" + ').replace(/}}/g, ' + "');
        }

        // https://github.com/joliss/js-string-escape/blob/master/index.js
        var escapeQuote = exports.escapeQuote = function (text) {

            return ('' + text).replace(/["'\\\n\r\u2028\u2029]/g, function (character) {
                switch (character) {
                    case '"':
                    case "'":
                    case '\\':
                        return '\\' + character;
                    case '\n':
                        return '\\n';
                    case '\r':
                        return '\\r';
                    case '\u2028':
                        return '\\u2028';
                    case '\u2029':
                        return '\\u2029';
                }
            });

        };

        return exports;

    });