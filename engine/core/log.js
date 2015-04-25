/**
 * Wrapper of Console <br>
 * This module is used to display logs.
 * and notice that only under debug mode, the info is displayed
 * @namespace webvn.log
 */
webvn.module('log', ['config'],
    function (s, config) {

        var exports = {},
            conf = config.log;
        // Colors
        var colors = conf.colors;

        /**
         * Display error message in console.
         * @function webvn.log.error
         * @param {string} str error message
         */
        exports.error = function (str) {
            if (!config.debug) {
                return;
            }
            console.log('%c' + '!! ' + str,
                'color: ' + colors.error);
        };

        /**
         * Display info in console.
         * @function webvn.log.info
         * @param {string} str info
         */
        var info = exports.info = function (str) {
            if (!config.debug) {
                return;
            }
            console.log('%c' + '> ' + str,
                'color: ' + colors.info);
        };

        /**
         * Display warning in console
         * @function webvn.log.warn
         * @param {string} str warning message
         */
        exports.warn = function (str) {
            if (!config.debug) {
                return;
            }
            console.log('%c' + '! ' + str,
                'color: ' + colors.warn);
        };

        return exports;
    });