WebVN.extend('script', function (exports, log, util)
{
    function command(cmd)
    {
        var lineNum = cmd[2],
            text    = cmd[1];

        text = text.split('\n').map(function (value) { return util.trim(value) }).join(' ');

        log.info('Cmd: ' + text + ' ' + lineNum);

        var alias  = exports.alias,
            define = exports.define,
            func   = exports.func;

        text = alias.parse(text);
        text = define.parse(text);

        cmd = exports.command.parse(text);

        var name = cmd.name,
            options = cmd.options;

        if (func.has(name))
        {
            func.call(name, cmd.parts);
            return;
        }

        cmd = exports.command.get(name);

        if (cmd)
        {
            cmd.execute(options);
        } else if (func.has('default'))
        {
            func.call('default', [text]);
        } else
        {
            log.warn('Command ' + name + ' does not exist.');
        }
    }

    function ret()
    {
        exports.stack.pop();
        exports.play();
    }

    function ifBlock(cmd)
    {
        exports.stack.push('if');
        cmd[1].call();
    }

    function func(cmd)
    {
        exports.func.create(cmd[1], cmd[2]);
    }

    function label(cmd, lineNum)
    {
        exports.label.create(cmd[1], lineNum);
    }

    exports.execute = function (cmd)
    {
        var type = cmd[0];

        switch (type)
        {
            case 'command' : command(cmd); break;
            case 'if'      : ifBlock(cmd); break;
            case 'return'  : ret(); break;
            case 'label'   :
            case 'function': exports.play(); break;
        }
    };

    exports.preExecute = function (cmd, lineNum)
    {
        var type = cmd[0];

        switch (type)
        {
            case 'function': func(cmd); break;
            case 'label'   : label(cmd, lineNum); break;
        }
    }
});