/* Wrapper of console
 * Used to display logs
 * Notice that only under debug mode, the info is displayed
 */

webvn.add('log', ['conf'], function (s, conf) {

var log = function (str) {

    if (!conf.debug) {
        return;
    }
    console.log(str);

};

// Colors
var colors = {
    info: '#357ae8',
    err: '#d84030',
    warning: '#f9c621'
};

// Wrapper of console.error
log.error = function (str) {

    if (!conf.debug) {
        return;
    }
    console.error('%c' + str, 'color: ' + colors.err);

};

// Wrapper of console.info
log.info = function (str) {

    if (!conf.debug) {
        return;
    }
    console.info('%c' + str, 'color: ' + colors.info);

};

// Wrapper of console.warn
log.warn = function (str) {

    if (!conf.debug) {
        return;
    }
    console.warn('%c' + str, 'color: ' + colors.warning);

};

return log;

});