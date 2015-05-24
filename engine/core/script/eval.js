webvn.extend('script', function (exports, util, storage, log) {
    "use strict";
    var globalStore = storage.createLocalStore('global'),
        s = {};

    // Quick reference
    var playNext = exports.play;

    // Eval javaScript code with not return value.
    exports.jsEval = function (code) {
        _jsEval(code);
    };

    /* Eval javaScript code with return value.
     * Only simple expressions are allowed to pass in.
     */
    exports.jsEvalVal = function (code) {
        return _jsEval(code, true);
    };

    var emptyStr = '';

    function _jsEval(code, returnOrNot) {

        if (util.trim(code) === '') {
            return emptyStr;
        }

        var scope = {};

        var functionName = util.uid('eval');

        code = 'scope["' + functionName + '"]=function(){' +
        (returnOrNot ? 'return (' : '') +
        code +
        (returnOrNot ? ');' : '') +'}';

        try {
            var g = globalStore.get(),
                $$ = exports.$$;
            eval(code);
        } catch (e) {
            log.error(e.message);
            return emptyStr;
        }

        /* Save it after a while,
         * in case that the eval process is not finished.
         */
        setTimeout(function () {
            globalStore.save();
        }, 1000);

        return scope[functionName]();
    }

    var save = storage.create('s');
    save.save(function () {
        return s;
    }).load(function (value) {
        s = value;
    });
});