WebVN.extend('script', function (exports, log, util, storage)
{
    function command(cmd)
    {
        var lineNum  = cmd[3],
            fileName = cmd[2],
            text     = cmd[1];

        text = text.split('\n').map(function (value) { return util.trim(value) }).join(' ');

        var fileInfo = fileName ? fileName  + ':' + lineNum
                                : 'Unknown' + ':' + '0';

        var alias   = exports.alias,
            define  = exports.define,
            func    = exports.func;

        text = alias.parse(text);
        text = define.parse(text);
        text = evalVal(text);

        cmd = exports.command.parse(text);

        var name = cmd.name,
            options = cmd.options;

        if (func.has(name))
        {
            log.info('Func: ' + text);
            func.call(name, cmd.parts);
            exports.play();
            return;
        }

        cmd = exports.command.get(name);

        if (cmd)
        {
            log.info('Cmd : ' + text + ' ' + fileInfo);
            cmd.execute(options, text);
        } else if (func.has('default'))
        {
            func.call('default', [text]);
            exports.play();
        } else
        {
            log.warn('Command ' + name + ' does not exist.');
        }
    }

    var regEvalVal = /\$\{([^}]*)}/g;

    function evalVal(val)
    {
        var replace = {},
            match = regEvalVal.exec(val);

        while (match)
        {
            replace[match[0]] = exports.js.val(match[1]);
            match = regEvalVal.exec(val);
        }

        util.each(replace, function (innerVal, key) { val = val.replace(key, innerVal) });

        return val;
    }

    function code(cmd)
    {
        log.info('Code: ' + cmd[1]);
        exports.js.eval(cmd[1]);
    }

    function ret()
    {
        exports.stack.pop();
        exports.play();
    }

    function ifBlock(cmd)
    {
        exports.stack.push('if');
        exports.js.eval(cmd[1]);
        exports.play();
    }

    function forBlock(cmd)
    {
        exports.stack.push('for');
        exports.js.eval(cmd[1]);
        exports.play();
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
            case 'code'    : code(cmd); break;
            case 'if'      : ifBlock(cmd); break;
            case 'for'     : forBlock(cmd); break;
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