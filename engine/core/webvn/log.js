/**
 * Wrapper of Console <br>
 * This module is used to display logs.
 * and notice that only under debug mode, the info is displayed
 * @namespace log
 */
WebVN.module('log', function (exports, config, util)
{
    var conf = config.log;
    var colors = conf.colors;

    /**
     * Display error message in console.
     * @function webvn.log.error
     * @param {string|Error} str error message or Error instance
     */
    exports.error = function (str) {
        var errStack;
        if (str instanceof Error) {
            errStack = getErrorStack(str);
            str = str.message;
        } else {
            errStack = getErrorStack();
        }

        if (config.build === 'release') {
            return;
        }

        console.log('%c' + '!! ' + str + '\n' + errStack,
            'color: ' + colors.error);
    };

    /**
     * Display info in console.
     * @function webvn.log.info
     * @param {string} str info
     * @param {boolean} [displayFile]
     * @param {String} [color]
     */
    exports.info = function (str, displayFile, color)
    {
        displayFile = displayFile || false;

        if (config.build === 'release') return;

        console.log('%c' + '> ' + str + (displayFile ? getFileInfo() : ''),
            'color: ' + (color ? color : colors.info));
    };

    /**
     * Display warning in console
     * @function webvn.log.warn
     * @param {string} str warning message
     */
    exports.warn = function (str) {
        var fileInfo = getFileInfo();

        if (config.build === 'release') {
            return;
        }

        console.log('%c' + '! ' + str + ' ' + fileInfo,
            'color: ' + colors.warn);
    };

    exports.clear = function () { console.clear() };

    function getFileInfo() {
        var err = new Error,
            stack = err.stack;
        var stacks = stack.split('\n');

        return util.trim(stacks[3]);
    }

    function getErrorStack(e) {
        var spliceNum = 3;
        if (e === undefined) {
            e = new Error;
        } else {
            spliceNum = 1;
        }
        var stack = e.stack,
            stacks = stack.split('\n');
        stacks.splice(0, spliceNum);

        return stacks.join('\n');
    }
});