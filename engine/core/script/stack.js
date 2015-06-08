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
     */
    var Frame = Class.create(
        /** @lends script.stack.Frame.prototype */
        {
            constructor: function Stack ()
            {
                this.commands = [];
                this.len      = 0;
                this.pointer  = -1;
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
            },

            insert: function (command)
            {
                this.commands.splice(this.pointer, 0, command);
            }
        }
    );

    var stacks   = [],
        pushFlag = true,
        curFrame = new Frame,
        mainFrame = curFrame;

    stacks.push(curFrame);

    function toggle()
    {
        pushFlag = !pushFlag;
    }

    function $$()
    {
        var cmd = util.toArray(arguments);

        exports.preExecute(cmd, curFrame.len);

        pushFlag ? curFrame.push(cmd)
                 : curFrame.insert(cmd)
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

    function push()
    {
        curFrame = new Frame;
        stacks.push(curFrame);
    }

    function pop()
    {
        stacks.pop();
        curFrame = stacks[stacks.length - 1];
    }

    exports.stack = {
        $$    : $$,
        getCmd: getCmd,
        push  : push,
        pop   : pop,
        toggle: toggle
    };
});