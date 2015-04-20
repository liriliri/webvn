/* This file is used to generate parser.
 * Usage: node grammar
 */

var Parser = require('jison').Parser,
    fs = require('fs');

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
        ['Expression', '$$ = yy.expression($1)']
    ],
    Expression: [
        ['If', '$$ = yy.ifWrapper($1)'],
        ['CodeLine', '$$ = yy.code($1)'],
        ['CodeBlock', '$$ = yy.code($1)'],
        ['Command', '$$ = yy.command($1)'],
        ['Function', '$$ = $1']
    ],
    Command: [
        ['COMMAND', '$$ = $1']
    ],
    CodeLine: [
        ['CODE_LINE', '$$ = $1']
    ],
    CodeBlock: [
        ['CODE_BLOCK', '$$ = $1']
    ],
    If: [
        ['IF CONDITION Block', '$$ = yy["if"]($2, $3)'],
        ['If ELSE If', '$$ = yy.ifElse($1, $3)'],
        ['If ELSE Block', '$$ = yy.ifElse($1, $3)']
    ],
    Block: [
        ['{ }', '$$ = yy.block("")'],
        ['{ Body }', '$$ = yy.block($2)']
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

var tokens = 'CODE_BLOCK COMMAND FUNCTION FUNCTION_NAME PARAM IF';

var operators = [
    ['nonassoc', '{', '}'],
    ['right', 'IF', 'ELSE']
];

var parser = new Parser({
    tokens: tokens,
    bnf: grammar,
    operators: operators.reverse(),
    startSymbol: 'Root'
});

var code = parser.generate();

// Wrap inside webvn namespace
code = ['webvn.add("parserNew", function () {',
            'var exports = {}, require = {};',
            code,
            'return exports;',
        '});'].join('\n');

fs.writeFile('parser.js', code);

