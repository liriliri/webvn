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
    warning: '#f9c621',
    sys: {
        back: '#357ae8',
        font: '#fff'
    }
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

// System info
log.sys = function (str) {

    if (!conf.debug) {
        return;
    }
    console.log('%c' + str, 
        'background: ' + colors.sys.back +
        ';color: ' + colors.sys.font + ' !important' +
        ';padding: 0 5px;' +
        ';font-size: 20px;');

};

// Wrapper of console.warn
log.warn = function (str) {

    if (!conf.debug) {
        return;
    }
    console.warn('%c' + str, 'color: ' + colors.warning);

};

// Log out version info
log.sys('WebVN v' + s.VERSION + ' | https://github.com/surunzi/WebVN');

return log;

});