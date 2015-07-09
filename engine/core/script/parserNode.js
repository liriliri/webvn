/**
 * Provide helper function related to wvnScript/javaScript translation.
 * @namespace parserNode
 * @memberof script
 */
WebVN.module('script', function (exports, Class, util)
{
    var parserNode = {},
        fileName   = '',
        lineNum    = 0;

    parserNode.file = function (val) { fileName = val };

    parserNode.lineNum = function (val) { lineNum = val };

    parserNode.statement = function (content)
    {
        return '$$(' + content + ', "' + fileName + '", ' + lineNum + ');\n';
    };

    parserNode.label = function (label)
    {
        return '"label", "' + util.trim(label) + '"';
    };

    parserNode.ret = function ()
    {
        return '"return"';
    };

    parserNode.command = function (command)
    {
        command = escapeQuote(command);

        return '"command", "' + util.trim(command) + '"';
    };

    parserNode.style = function (style)
    {
        style = escapeQuote(style);

        return '"style", "' + util.trim(style) + '"';
    };

    parserNode.code = function (code)
    {
        var lines = code.split('\n'),
            i, len;

        for (i = 0, len = lines.length; i < len; i++)
        {
            lines[i] = util.trim(lines[i]);
        }
        code = lines.join('\n');

        return '"code", "' + escapeQuote(code) + '"';
    };

    parserNode.block = function (block)
    {
        return ' {\n' + block + '}';
    };

    parserNode.paramList = function (paramList, param)
    {
        return paramList + ', ' + param;
    };

    parserNode.ifWrapper = function (body)
    {
        return '"if", "' + escapeQuote(body) + '"';
    };

    parserNode['if'] = function (condition, block)
    {
        return 'if (' + condition + ')' + block;
    };

    parserNode.ifElse = function (condition, block, elseBlock)
    {
        return 'if (' + condition + ')' + block + ' else ' + elseBlock;
    };

    parserNode['function'] = function (name, param, block)
    {
        if (block === undefined)
        {
            block = param;
            param = '';
        }

        return '"function", "' + name + '", function (' + param + ')' + block;
    };

    // https://github.com/joliss/js-string-escape/blob/master/index.js
    var escapeQuote = parserNode.escapeQuote = function (text)
    {
        return ('' + text).replace(/["'\\\n\r\u2028\u2029]/g, function (character)
        {
            switch (character)
            {
                case '"':
                case "'":
                case '\\': return '\\' + character;
                case '\n': return '\\n';
                case '\r': return '\\r';
                case '\u2028': return '\\u2028';
                case '\u2029': return '\\u2029';
            }
        });
    };

    exports.parserNode = parserNode;
});