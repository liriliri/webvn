/* Wrapper of console
 * Used to display logs
 */

webvn.add('log', function (s) {

var log = function (str) {

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

    console.error('%c' + str, 'color: ' + colors.err);

};

// Wrapper of console.info
log.info = function (str) {

    console.info('%c' + str, 'color: ' + colors.info);

};

// Wrapper of console.warn
log.warn = function (str) {

    console.warn('%c' + str, 'color: ' + colors.warning);

};

return log;

});