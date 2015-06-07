/**
 * @namespace lexer
 * @memberof script
 */
WebVN.extend('script', function (exports, Class, log, util)
{
    var lexer = {};

    /**
     * @class
     * @memberof script.lexer
     * @param {string} tag tag name
     * @param {string} value value
     * @param {Object} locationData {first_line, first_column, last_line, last_column}
     * @return {Array} result [tag, value, locationData]
     */
    var Token = lexer.Token = Class.create(
        {
            constructor: function (tag, value, locationData)
            {
                var token = [];
                token[0] = tag;
                token[1] = value;
                token[2] = locationData;

                return token;
            }
        }
    );

    var EOF = 'END_OF_FILE';

    var Lexer = lexer.Lexer = Class.create(
        {
            constructor: function Lexer() {},

            reConfigure: function (code)
            {
                this.input         = code;
                this.length        = code.length;
                this.i             = 0;
                this.c             = this.input.charAt(this.i);
                this.currentLine   = 1;
                this.currentColumn = 1;
                this.tokens        = [];
            },

            tokenize: function (code)
            {
                this.reConfigure(code);

                var token = this.nextToken();
                while (token)
                {
                    this.pushToken(token);
                    token = this.nextToken();
                }

                return this.tokens;
            },

            lastTokenIs: function (target)
            {
                var token = this.tokens[this.tokens.length - 1];

                return token && token[0] === target;
            },

            pushToken: function (token) { this.tokens.push(token) },

            createToken: function (tag, value, locationData)
            {
                if (value === undefined)
                {
                    value = tag;
                    if (locationData === undefined)
                    {
                        locationData = {
                            first_line  : this.currentLine,
                            first_column: this.currentColumn - tag.length,
                            last_line   : this.currentLine,
                            last_column : this.currentColumn - 1
                        };
                    }
                }

                return new Token(tag, value, locationData);
            },

            nextToken: function ()
            {
                while (this.c !== EOF)
                {
                    switch (this.c)
                    {
                        case ' ': case '\t': case '\r': this.WS(); continue;
                        case '/': {
                            if (this.lookAhead(1, '/'))
                            {
                                this.commentLine();
                            } else if (this.lookAhead(1, '*'))
                            {
                                this.commentBlock();
                            }
                        } this.consume(); continue; // Comment
                        case '`': {
                            if (this.lookAhead(2, '``'))
                            {
                                this.consume();
                                return this.codeBlock();
                            } else
                            {
                                this.consume();
                                return this.codeLine();
                            }
                        }
                        case '(': {
                            if (this.lastTokenIs('IF'))
                            {
                                this.consume();
                                return this.condition();
                            } else if (this.lastTokenIs('FUNCTION_NAME'))
                            {
                                this.consume();
                                if (this.c !== ')') {
                                    return this.functionParam();
                                } else this.consume();
                            } else this.consume();
                            break;
                        }
                        case ',': {
                            if (this.lastTokenIs('PARAM'))
                            {
                                this.consume();
                                return this.functionParam();
                            } else this.consume();
                            break;
                        }
                        case '{': this.consume(); return this.createToken('{');
                        case '}': this.consume(); return this.createToken('}');
                        default: {
                            if (this.lastTokenIs('FUNCTION') && this.isLetter(this.c))
                            {
                                return this.functionName();
                            } else if (this.c === 'i' && this.lookAhead(1, 'f'))
                            {
                                this.consumes(2);
                                return this.createToken('IF');
                            } else if (this.c === 'e' && this.lookAhead(3, 'lse'))
                            {
                                this.consumes(4);
                                return this.createToken('ELSE');
                            } else if (this.c === 'f' && this.lookAhead(7, 'unction'))
                            {
                                this.consumes(8);
                                return this.createToken('FUNCTION');
                            } else if (this.c === '*')
                            {
                                this.consume(1);
                                return this.label();
                            }else if (this.isLetter(this.c))
                            {
                                /* If nothing above matches and it is a letter currently,
                                 * it is a command(function call, alias command).
                                 */
                                return this.command();
                            } else this.consume();
                        }
                    }
                }
            },

            /* WS: (' ' | '\t' | '\r')*; Ignore any white space.
             * Line break is not part of the white space group
             * since it is used to indicate the end of line comment and other stuff
             */
            WS: function ()
            {
                while (this.empty(this.c)) this.advance();
            },

            empty: function (c)
            {
                return c === ' ' || c === '\t' || c === '\r';
            },

            // Move one character and detect end of file
            advance: function ()
            {
                this.i++;
                if (this.i >= this.length)
                {
                    this.c = EOF;
                } else {
                    if (this.c === '\n')
                    {
                        this.currentLine++;
                        this.currentColumn = 1;
                    } else this.currentColumn++;

                    this.c = this.input.charAt(this.i);
                }

            },

            // Move to next non-whitespace character
            consume: function ()
            {
                this.advance();
                this.WS();
            },

            // Consume several times
            consumes: function (num)
            {
                for (var i = 0; i < num; i++) this.consume();
            },

            // Look ahead n character, and see if it resembles target
            lookAhead: function (len, target)
            {
                var str = '', i;

                for (i = 1; i <= len; i++)
                {
                    str += this.input.charAt(this.i + i);
                }

                return str === target;
            },

            isLetter: function (char)
            {
                if (!util.isString(char) || char.length !== 1) return false;

                var code = char.charCodeAt(0);
                return ((code >= 65) && (code <= 90))   ||
                        ((code >= 97) && (code <= 122)) ||
                        // Chinese is regarded as legal letter too.
                        ((code >= 19968) && (code <= 40869));
            },

            // Line comment, starts with '//' until the line break
            commentLine: function ()
            {
                this.consumes(2);

                while (!(this.c === '\n'))
                {
                    this.consume();
                    if (this.c === EOF) break;
                }
            },

            // Block comment, starts with '/*', ends with '*/'
            commentBlock: function ()
            {
                this.consumes(2);

                while (!(this.c === '*' && this.lookAhead(1, '/')))
                {
                    this.consume();
                    if (this.c === EOF) throw new Error('The comment block must end with "*/"');
                }
                this.consume();
            },

            // Line code, starts with '`' until the line break
            codeLine: function ()
            {
                var value = '',
                    firstLine, firstColumn, lastLine, lastColumn;

                firstLine   = this.currentLine;
                firstColumn = this.currentColumn;

                while (!(this.c === '\n'))
                {
                    value += this.c;
                    // Use advance() instead of consume() because white space should be keep
                    this.advance();
                    if (this.c === EOF) break;
                }

                lastLine   = this.currentLine;
                lastColumn = this.currentColumn - 1;

                return this.createToken('CODE_LINE', value, {
                    first_line  : firstLine,
                    first_column: firstColumn,
                    last_line   : lastLine,
                    last_column : lastColumn
                });
            },

            // Block code, starts with '```', ends with '```'
            codeBlock: function ()
            {
                var value = '',
                    firstLine, firstColumn, lastLine, lastColumn;

                this.consumes(2);

                firstLine   = this.currentLine;
                firstColumn = this.currentColumn;

                while (!(this.c === '`' && this.lookAhead(2, '``')))
                {
                    value += this.c;
                    this.advance();
                    if (this.c === EOF) throw new Error('The code line must end with "```"');
                }

                lastLine   = this.currentLine;
                lastColumn = this.currentColumn - 1;

                this.consumes(3);

                return this.createToken('CODE_BLOCK', value, {
                    first_line  : firstLine,
                    first_column: firstColumn,
                    last_line   : lastLine,
                    last_column : lastColumn
                });
            },

            // Condition
            condition: function ()
            {
                var value = '', leftBracket = 0,
                    firstLine, firstColumn, lastLine, lastColumn;

                firstLine   = this.currentLine;
                firstColumn = this.currentColumn;

                while (!(this.c === ')' && leftBracket === 0))
                {
                    value += this.c;
                    if (this.c === '(')
                    {
                        leftBracket++;
                    } else if (this.c === ')')
                    {
                        leftBracket--;
                    }
                    this.advance();
                    if (this.c === EOF) throw new Error("One right bracket is missing");
                }

                lastLine   = this.currentLine;
                lastColumn = this.currentColumn - 1;

                this.consume();

                return this.createToken('CONDITION', value, {
                    first_line  : firstLine,
                    first_column: firstColumn,
                    last_line   : lastLine,
                    last_column : lastColumn
                });
            },

            functionName: function ()
            {
                var value = '',
                    firstLine, firstColumn, lastLine, lastColumn;

                firstLine   = this.currentLine;
                firstColumn = this.currentColumn;

                while (this.isLetter(this.c))
                {
                    value += this.c;
                    this.advance();
                }

                lastLine   = this.currentLine;
                lastColumn = this.currentColumn - 1;

                return this.createToken('FUNCTION_NAME', value, {
                    first_line  : firstLine,
                    first_column: firstColumn,
                    last_line   : lastLine,
                    last_column : lastColumn
                });
            },

            functionParam: function ()
            {
                var value = '',
                    firstLine, firstColumn, lastLine, lastColumn;

                firstLine   = this.currentLine;
                firstColumn = this.currentColumn;

                while (this.isLetter(this.c))
                {
                    value += this.c;
                    this.advance();
                }

                lastLine   = this.currentLine;
                lastColumn = this.currentColumn - 1;

                return this.createToken('PARAM', value, {
                    first_line  : firstLine,
                    first_column: firstColumn,
                    last_line   : lastLine,
                    last_column : lastColumn
                });
            },

            label: function ()
            {
                var value = '',
                    firstLine, firstColumn, lastLine, lastColumn;

                firstLine   = this.currentLine;
                firstColumn = this.currentColumn;

                while (!(this.c === '\n') && this.isLetter(this.c))
                {
                    value += this.c;
                    if (this.c === EOF) break;
                    this.advance();
                }

                lastLine   = this.currentLine;
                lastColumn = this.currentColumn - 1;

                return this.createToken('LABEL', value, {
                    first_line  : firstLine,
                    first_column: firstColumn,
                    last_line   : lastLine,
                    last_column : lastColumn
                });
            },

            // Command, ends with line break;
            command: function ()
            {
                var value = '',
                    firstLine, firstColumn, lastLine, lastColumn;

                firstLine   = this.currentLine;
                firstColumn = this.currentColumn;

                var lastC = '';

                // If there is a '\' before line break, then it is not the end of command.
                while (!(this.c === '\n' && lastC !== '\\'))
                {
                    if (this.c === '\n' && lastC === '\\')
                    {
                        value = value.substr(0, value.length - 1) + this.c;
                    } else value += this.c;

                    lastC = this.c;
                    (lastC === '\\') ? this.consume()
                                     : this.advance();

                    if (this.c === EOF) break;
                }

                lastLine   = this.currentLine;
                lastColumn = this.currentColumn - 1;

                return this.createToken('COMMAND', value, {
                    first_line  : firstLine,
                    first_column: firstColumn,
                    last_line   : lastLine,
                    last_column : lastColumn
                });
            }
        }
    );

    var _lexer = new Lexer;

    exports.lexer = function (code)
    {
        var tokens;

        try
        {
            tokens = _lexer.tokenize(code);
            return tokens;
        } catch (e) {
            log.error(e.message);
        }
    };
});