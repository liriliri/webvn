/**
 * @namespace stack
 * @memberof script
 */
WebVN.extend('script', function (exports, Class, util, log)
{
    /**
     * @class Frame
     * @memberof script.stack
     * @property {Array} commands
     * @property {Number} len
     * @property {Number} pointer
     * @property {String} type
     */
    var Frame = Class.create(
        /** @lends script.stack.Frame.prototype */
        {
            constructor: function Frame(type)
            {
                this.commands = [];
                this.len      = 0;
                this.pointer  = -1;
                this.type     = type || 'function';
            },

            get: function (num)
            {
                if (num !== undefined)
                {
                    this.pointer = num;
                    if (num < 0 || num >= this.len) return;
                }

                return this.commands[this.pointer];
            },

            next: function () { return this.get(this.pointer + 1) },

            push: function (command)
            {
                this.len++;
                this.commands.push(command);
            }
        }
    );

    var MainFrame = Frame.extend(
        {
            constructor: function MainFrame()
            {
                this.callSuper();
                this.files = {};
            }
        },
        {
            file: {
                set: function (val)
                {
                    var files = this.files;

                    files[val] ? this.commands = files[val] :
                                 this.commands = files[val] = [];

                    this.len     = 0;
                    this.pointer = -1;
                    this._file   = val;

                    reset();
                },
                get: function ()
                {
                    return this._file;
                }
            }
        }
    );

    var stacks    = [],
        current   = new MainFrame,
        mainFrame = current;

    stacks.push(current);

    function $$()
    {
        var cmd = util.toArray(arguments);

        if (cmd[1] === 'dialog -sa') debugger;

        exports.preExecute(cmd, current.len);

        current.push(cmd);
    }

    function getCmd()
    {
        var command = current.next();

        while (command === undefined)
        {
            if (current === mainFrame)
            {
                log.warn('End of script.');
                exports.pause();
                return;
            } else
            {
                if (current.type === 'function')
                {
                    pop();
                    command = current.next();
                } else
                {
                    stacks.pop();
                    current = stacks[stacks.length - 1];
                    command = current.next();
                }
            }
        }

        return command;
    }

    function push(type)
    {
        current = new Frame(type);
        stacks.push(current);
    }

    function pop(target)
    {
        if (stacks.length === 0) return;

        target = target || 'function';

        while (current.type !== target)
        {
            stacks.pop();
            current = util.last(stacks);
        }

        exports.scope.pop();
        stacks.pop();
        current = util.last(stacks);
    }

    function jump(lineNum)
    {
        reset();
        current.pointer = lineNum;
    }

    function reset()
    {
        stacks = [mainFrame];
        current = mainFrame;
    }

    var stack = {
        $$     : $$,
        getCmd : getCmd,
        push   : push,
        pop    : pop,
        jump   : jump,
        reset  : reset
    };

    Object.defineProperty(stack, 'file', {
        set: function (val)
        {
            mainFrame.file = val;
        },
        get: function ()
        {
            return mainFrame.file;
        }
    });

    exports.stack = stack;
});