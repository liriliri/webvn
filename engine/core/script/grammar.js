/* This file is used to generate parser.
 * Usage: node grammar
 */
var Parser = require('jison').Parser,
    fs     = require('fs');

var grammar = {
    Root: [
        ['', 'return $$ = ""'],
        ['Body', 'return $$ = $1']
    ],
    Body: [
        ['Line', '$$ = $1'],
        ['Body Line', '$$ = $1 + $2']
    ],
    Line: [
        ['Statement', '$$ = yy.statement($1)']
    ],
    Statement: [
        ['If', '$$ = yy.ifWrapper($1)'],
        ['Code', '$$ = yy.code($1)'],
        ['Command', '$$ = yy.command($1)'],
        ['Return', '$$ = yy.ret($1)'],
        ['Label', '$$ = yy.label($1)'],
        ['Function', '$$ = $1']
    ],
    Label: [
        ['LABEL', '$$ = $1']
    ],
    Return: [
        ['RETURN', '$$ = $1']
    ],
    Command: [
        ['COMMAND', 'yy.lineNum(yylineno); $$ = $1']
    ],
    Code: [
        ['CODE', 'yy.lineNum(yylineno); $$ = $1']
    ],
    If: [
        ['IF CODE Block', 'yy.lineNum(yylineno); $$ = yy["if"]($2, $3)'],
        ['IF CODE Block ELSE Block', '$$ = yy.ifElse($2, $3, $5)']
    ],
    Block: [
        ['{ }', '$$ = yy.block("")'],
        ['{ Body }', '$$ = yy.block($2)'],
        ['Statement', '$$ = yy.block(yy.statement($1))']
    ],
    Function: [
        ['FUNCTION FUNCTION_NAME ParamList Block', '$$ = yy["function"]($2, $3, $4)'],
        ['FUNCTION FUNCTION_NAME Block', '$$ = yy["function"]($2, $3)']
    ],
    ParamList: [
        ['PARAM', '$$ = $1'],
        ['ParamList PARAM', '$$ = yy.paramList($1, $2)']
    ]
};

var tokens = 'CODE COMMAND FUNCTION FUNCTION_NAME PARAM IF RETURN';

var operators = [
    ['nonassoc', '{', '}'],
    ['right', 'IF', 'ELSE']
];

var parser = new Parser({
    tokens     : tokens,
    bnf        : grammar,
    operators  : operators.reverse(),
    startSymbol: 'Root'
});

var code = parser.generate();

code = ['WebVN.extend("script", function (exports) {',
            'var require = function(){},',
                'exp = exports;',
                'exports = {};',
            code,
            'exp.parser = exports.parser',
        '});'].join('\n');

fs.writeFile('parser.js', code);
