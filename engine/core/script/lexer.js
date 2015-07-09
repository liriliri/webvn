/**
 * @namespace lexer
 * @memberof script
 */
WebVN.extend('script', function (exports, Class, log, util)
{
    /**
     * @class Token
     * @memberof script.lexer
     * @param {string} tag tag name
     * @param {string} val value
     * @param {Object} pos {first_line, first_column, last_line, last_column}
     * @return {Array} result [tag, value, pos]
     */
    var Token = Class.create(
        /** @lends script.lexer.Token.prototype */
        {
            constructor: function (tag, val, pos)
            {
                var token = [];

                token[0] = tag;
                token[1] = val;
                token[2] = pos;

                return token;
            }
        }
    );

    var EOF = 'END_OF_FILE';

    var charFilter = {
        lBracket: function (c)
        {
            return isEmpty(c) || c === '(';
        },
        lBrace: function (c)
        {
            return isEmpty(c) || c === '{';
        },
        space: function (c)
        {
            return isEmpty(c);
        }
    };

    /**
     * @class Lexer
     * @memberof script.lexer
     * @property input
     * @property {Array.<Token>} tokens
     * @property {Number} curLine
     * @property {Number} curColumn
     * @property {String} c
     * @property {Number} i
     */
    var Lexer = Class.create(
        /** @lends script.lexer.Lexer.prototype */
        {
            constructor: function Lexer(code)
            {
                this.input  = code;
                this.length = code.length;

                this.i = 0;
                this.c = (code.length === 0 ? EOF : code[0]);

                this.curLine   = 1;
                this.curColumn = 1;
            },

            tokenize: function ()
            {
                if (this.tokens) return this.tokens;

                this.tokens = [];

                var token;

                while (token = this.nextToken()) this.tokens.push(token);

                return this.tokens;
            },

            createToken: function (tag, val, pos)
            {
                if (!pos)
                {
                    pos = {
                        first_line  : this.curLine,
                        first_column: this.curColumn - tag.length,
                        last_line   : this.curLine,
                        last_column : this.curColumn -1
                    }
                }

                if (!val) val = tag;

                return new Token(tag, val, pos);
            },

            nextToken: function ()
            {
                var c;

                while (this.c !== EOF)
                {
                    c = this.c;
                    if (isEmpty(c))
                    {
                        this.consume();
                        continue;
                    }

                    if (c === '/')
                    {
                        if (this.lookAhead(1, '/'))
                        {
                            this.commentLine();
                        } else if (this.lookAhead(1, '*'))
                        {
                            this.commentBlock();
                        } else {
                            this.forward();
                        }
                        continue;
                    }

                    if (c === '`')
                    {
                        if (this.lookAhead(2, '``'))
                        {
                            return this.codeBlock();
                        } else {
                            return this.codeLine();
                        }
                    }

                    if (c === '(')
                    {
                        this.consume();
                        if (this.lastToken('FUNC_NAME'))
                        {
                            if (this.c !== ')')
                            {
                                return this.identifier('PARAM');
                            }
                        } else if (this.lastToken('IF'))
                        {
                            return this.jsBracket();
                        } else if (this.lastToken('FOR'))
                        {
                            return this.jsBracket();
                        }
                        continue;
                    }

                    if (c === ',')
                    {
                        if (this.lastToken('PARAM'))
                        {
                            this.consume();
                            return this.identifier('PARAM');
                        } else
                        {
                            this.forward();
                        }
                        continue;
                    }

                    if (c === '*')
                    {
                        return this.label();
                    }

                    if (c === ')')
                    {
                        this.forward();
                        continue;
                    }

                    if (c === '{' ||
                        c === '}')
                    {
                        this.forward();
                        return this.createToken(c);
                    }

                    if (this.equal('=>'))
                    {
                        this.forward(2);
                        return this.createToken('=>');
                    }

                    if (this.equal('func', charFilter.space))
                    {
                        this.forward(4);
                        return this.createToken('FUNC');
                    }

                    if (this.equal('if', charFilter.lBracket))
                    {
                        this.forward(2);
                        return this.createToken('IF');
                    }

                    if (this.equal('style', charFilter.lBrace))
                    {
                        return this.style('STYLE');
                    }

                    if (this.equal('else', charFilter.space))
                    {
                        this.forward(4);
                        return this.createToken('ELSE');
                    }

                    if (this.equal('return', charFilter.space))
                    {
                        this.forward(6);
                        return this.createToken('RETURN');
                    }

                    if (this.lastToken('FUNC') && isLetter(c))
                    {
                        return this.identifier('FUNC_NAME');
                    }

                    if (this.lastToken('ARROW_FUNC') && isLetter(c))
                    {
                        this.tokens.pop();
                        return this.identifier('FUNC_NAME')
                    }

                    return this.command();
                }
            },

            lastToken: function (target)
            {
                var token = util.last(this.tokens);

                return token && token[0] === target;
            },

            consume: function (num)
            {
                num = num || 1;

                while (num--)
                {
                    this.forward();
                    this.whiteSpace();
                }
            },

            backward: function (num)
            {
                num = num || 1;

                while (num--)
                {
                    if (this.i == 0) return;

                    this.i--;

                    if (this.c === '\n')
                    {
                        this.curLine--;
                        this.curColumn = 0;
                        var k = this.i - this.curColumn;
                        while (this.input[k] != '\n' && k > 0)
                        {
                            this.curColumn++;
                            k -= this.curColumn;
                        }
                    } else
                    {
                        this.curColumn--;
                    }

                    this.c = this.input[this.i];
                }
            },

            forward: function (num)
            {
                num = num || 1;

                while (num--)
                {
                    this.i++;

                    if (this.i >= this.length)
                    {
                        this.c = EOF;
                    } else
                    {
                        if (this.c === '\n')
                        {
                            this.curLine++;
                            this.curColumn = 1;
                        } else
                        {
                            this.curColumn++;
                        }

                        this.c = this.input[this.i];
                    }
                }
            },

            lookAhead: function (len, target, lastCharFilter)
            {
                var ret = (this.input.substr(this.i + 1, len) === target);

                if (ret && lastCharFilter)
                {
                    return lastCharFilter(this.input[this.i + 1 + len]);
                } else
                {
                    return ret;
                }
            },

            equal: function (str, lastCharFilter)
            {
                return this.c === str[0] && this.lookAhead(str.length - 1, str.substr(1), lastCharFilter);
            },

            whiteSpace: function ()
            {
                while (isEmpty(this.c)) this.forward();
            },

            commentLine: function ()
            {
                this.forward(2);

                while (!this.equal('\n'))
                {
                    this.forward();
                    if (this.c === EOF) break;
                }
            },

            commentBlock: function ()
            {
                this.forward(2);

                while (!(this.equal('*/')))
                {
                    this.forward();
                    if (this.c === EOF) throw new Error('The comment block must end with "*/".');
                }

                this.forward();
            },

            codeBlock: function ()
            {
                this.forward(3);

                var val = '', pos = {};

                pos.first_line   = this.curLine;
                pos.first_column = this.curColumn;

                while (!(this.equal('```')))
                {
                    val += this.c;
                    this.forward();
                    if (this.c === EOF) throw new Error('The code block must end with "```"');
                }

                pos.last_line   = this.curLine;
                pos.last_column = this.currentColumn - 1;

                this.forward(3);

                return this.createToken('CODE', val, pos);
            },

            codeLine: function ()
            {
                this.forward();

                var val = '', pos = {};

                pos.first_line   = this.curLine;
                pos.first_column = this.curColumn;

                while (!(this.equal('\n')))
                {
                    val += this.c;
                    this.forward();
                    if (this.c === EOF) break;
                }

                pos.last_line   = this.curLine;
                pos.last_column = this.curColumn - 1;

                return this.createToken('CODE', val, pos);
            },

            style: function ()
            {
                this.forward(5);
                this.whiteSpace();
                this.forward();

                var val = '', lBrace = 0, pos = {};

                pos.first_line   = this.curLine;
                pos.first_column = this.curColumn;

                while (!(this.equal('}') && lBrace === 0))
                {
                    val += this.c;
                    if (this.c === '{')
                    {
                        lBrace++;
                    } else if (this.c === '}')
                    {
                        lBrace--;
                    }
                    this.forward();
                    if (this.c === EOF) throw new Error('One right brace is missing.');
                }

                pos.last_line   = this.curLine;
                pos.last_column = this.curColumn - 1;

                this.forward();

                return this.createToken('STYLE', val, pos);
            },

            identifier: function (tokenName)
            {
                var val = '', pos = {};

                pos.first_line   = this.curLine;
                pos.first_column = this.curColumn;

                while (isLetter(this.c))
                {
                    val += this.c;
                    this.forward();
                }

                pos.last_line   = this.curLine;
                pos.last_column = this.curColumn - 1;

                return this.createToken((tokenName ? tokenName : 'IDENTIFIER'), val, pos);
            },

            jsBracket: function ()
            {
                var val = '', lBracket = 0, pos = {};

                pos.first_line   = this.curLine;
                pos.first_column = this.curColumn;

                while (!(this.equal(')') && lBracket === 0))
                {
                    val += this.c;
                    if (this.c === '(')
                    {
                        lBracket++;
                    } else if (this.c === ')')
                    {
                        lBracket--;
                    }
                    this.forward();
                    if (this.c === EOF) throw new Error('One right bracket is missing.');
                }

                pos.last_line   = this.curLine;
                pos.last_column = this.curColumn - 1;

                this.forward();

                return this.createToken('CODE', val, pos);
            },

            label: function ()
            {
                this.consume();

                var val = '', pos = {};

                pos.first_line   = this.curLine;
                pos.first_column = this.curColumn;

                while (isLetter(this.c))
                {
                    val += this.c;
                    this.forward();
                    if (this.c === EOF) break;
                }

                pos.last_line   = this.curLine;
                pos.last_column = this.curColumn - 1;

                return this.createToken('LABEL', val, pos);
            },

            command: function ()
            {
                var val = '', pos = {}, lastC = '';

                pos.first_line   = this.curLine;
                pos.first_column = this.curColumn;

                while (!(this.equal('\n') && lastC !== '\\'))
                {
                    if (this.c === '\n' && lastC === '\\')
                    {
                        val = val.substr(0, val.length - 1) + this.c;
                    } else
                    {
                        val += this.c;
                    }

                    lastC = this.c;
                    this.forward();

                    if (this.c === EOF) break;
                }

                pos.last_line   = this.curLine;
                pos.last_column = this.curColumn - 1;

                if (isArrowFunc(val))
                {
                    this.backward(val.length);
                    return this.createToken('ARROW_FUNC');
                }

                return this.createToken('COMMAND', val, pos);
            }
        }
    );

    var regArrowFunc = /=>/;

    function isArrowFunc(str)
    {
        return regArrowFunc.test(str);
    }

    function isEmpty(c)
    {
        return c === ' ' || c === '\t' || c === '\r' || c === '\n';
    }

    function isLetter(c)
    {
        var code = c.charCodeAt(0);

        return ((code >= 65) && (code <= 90))  ||
               ((code >= 97) && (code <= 122)) ||
               // Chinese letter
               ((code >= 19968) && (code <= 40869)) ||
               // Number
               ((code >= 48) && (code <= 58));
    }

    exports.lexer = function (code)
    {
        var lexer = new Lexer(code);

        try
        {
            return lexer.tokenize();
        } catch (e)
        {
            log.error(e.message);
        }
    };
});