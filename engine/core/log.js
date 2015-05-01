/**
 * Wrapper of Console <br>
 * This module is used to display logs.
 * and notice that only under debug mode, the info is displayed
 * @namespace webvn.log
 */
webvn.module('log', ['config', 'util'],
    function (config, util) {

        var exports = {},
            conf = config.log;
        // Colors
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
            if (!config.debug) {
                return;
            }
            console.log('%c' + '!! ' + str + '\n' + errStack,
                'color: ' + colors.error);
        };

        /**
         * Display info in console.
         * @function webvn.log.info
         * @param {string} str info
         * @param {boolean=} displayFile
         */
        exports.info = function (str, displayFile) {
            displayFile = displayFile || false;
            var fileInfo;
            if (displayFile) {
                fileInfo = ' ' + getFileInfo();
            }
            if (!config.debug) {
                return;
            }
            console.log('%c' + '> ' + str + (displayFile ? fileInfo : ''),
                'color: ' + colors.info);
        };

        /**
         * Display warning in console
         * @function webvn.log.warn
         * @param {string} str warning message
         */
        exports.warn = function (str) {
            var fileInfo = getFileInfo();
            if (!config.debug) {
                return;
            }
            console.log('%c' + '! ' + str + ' ' + fileInfo,
                'color: ' + colors.warn);
        };

        // Get info of file that logs the message
        function getFileInfo() {
            "use strict";
            var err = new Error,
                stack = err.stack;
            var stacks = stack.split('\n');
            return util.trim(stacks[3]);
        }

        function getErrorStack(e) {
            "use strict";
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

        return exports;
    });