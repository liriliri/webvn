/* Command console
 * console -t=info 'This is the log message'
 */

webvn.use(['script'], function (s, script) {

script.addCommand('console', {
    't': 'type'
}, function (options, value) {

    var type = options.type || 'normal';

    switch (type) {
        case 'error':
            s.log.error(value);
            break;
        case 'info':
            s.log.info(value);
            break;
        case 'warn':
            s.log.warn(value);
            break;
        default:
            s.log(value);
    }

});

});