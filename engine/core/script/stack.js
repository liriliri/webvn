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

    var stacks   = [],
        curFrame = new Frame,
        mainFrame = curFrame;

    stacks.push(curFrame);

    function $$()
    {
        var cmd = util.toArray(arguments);

        if (cmd[1] === 'dialog -sa') debugger;

        exports.preExecute(cmd, curFrame.len);

        curFrame.push(cmd);
    }

    function getCmd()
    {
        var command = curFrame.next();

        while (command === undefined)
        {
            if (curFrame === mainFrame)
            {
                log.warn('End of script.');
                exports.pause();
                return;
            } else
            {
                stacks.pop();
                curFrame = stacks[stacks.length - 1];
                command = curFrame.next();
            }
        }

        return command;
    }

    function push(type)
    {
        curFrame = new Frame(type);
        stacks.push(curFrame);
    }

    function pop()
    {
        while (curFrame.type !== 'function') {
            stacks.pop();
            curFrame = stacks[stacks.length - 1];
        }

        stacks.pop();
        curFrame = stacks[stacks.length - 1];
    }

    function jump(num)
    {
        reset();
        curFrame.pointer = num;
    }

    function reset()
    {
        stacks = [mainFrame];
        curFrame = mainFrame;
        curFrame.pointer = -1;
    }

    exports.stack = {
        $$    : $$,
        getCmd: getCmd,
        push  : push,
        pop   : pop,
        jump  : jump,
        reset : reset
    };
});