/**
 * @namespace js
 * @memberof script
 */
WebVN.extend('script', function (exports, util, storage, log)
{
    var globalStore = storage.createLocalStore('global'),
        funcScope = {},
        s  = {},
        t  = {},
        js = {};

    /**
     * Eval javaScript code without return value.
     * @method eval
     * @memberof script.js
     * @param {string} code Javascript code to eval.
     */
    js.eval = function (code) { _jsEval(code) };

    /**
     * Eval javaScript code with return value. <br>
     * Only simple expressions are allowed to pass in.
     * @method val
     * @memberof script.js
     * @param {string} code JavaScript code to eval.
     * @return {*} Eval result.
     */
    js.val = function (code) { return _jsEval(code, true) };

    var emptyStr = '';

    function _jsEval(code, returnOrNot)
    {

        if (util.trim(code) === '') return emptyStr;

        var functionName = util.uid('eval');

        var scope = exports.scope.get();

        util.mixIn(scope, {
            'g'       : globalStore.get(),
            's'       : s,
            't'       : t,
            '$$'      : exports.stack.$$,
            'playNext': exports.play
        });

        code = 'funcScope["' + functionName + '"]=function(){' +
                   'with(scope) {' +
                       (returnOrNot ? 'return (' : '') + code + (returnOrNot ? ');' : '') +
                   '}' +
               '}';

        try
        {
            eval(code);
        } catch (e)
        {
            log.error(e.message);
            return emptyStr;
        }

        setTimeout(function () { globalStore.save() }, 1000);

        return funcScope[functionName]();
    }

    var save = storage.create('s');
    save.save(function () { return s })
        .load(function (val) { s = val });

    exports.js = js;
});