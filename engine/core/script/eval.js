/**
 * @namespace js
 * @memberof script
 */
WebVN.extend('script', function (exports, util, storage, log)
{
    var globalStore = storage.createLocalStore('global'),
        s           = {},
        js          = {};

    var playNext = exports.play;

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

        var scope = {};

        var functionName = util.uid('eval');

        code = 'scope["' + functionName + '"]=function(){' +
               (returnOrNot ? 'return (' : '') +
               code +
               (returnOrNot ? ');' : '') +'}';

        try
        {
            var g  = globalStore.get(),
                $$ = exports.$$;
            eval(code);
        } catch (e)
        {
            log.error(e.message);
            return emptyStr;
        }

        /* Save it after a while,
         * in case that the eval process is not finished.
         */
        setTimeout(function () { globalStore.save() }, 1000);

        return scope[functionName]();
    }

    var save = storage.create('s');
    save.save(function () { return s })
        .load(function (val) { s = val });

    exports.js = js;
});