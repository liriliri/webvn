webvn.use(['script', 'log'],
    function (s, script, log) {

script.createCommand('log', {
    type: {
        type: 'String',
        shortHand: 't'
    },
    msg: {
        type: 'String',
        shortHand: 'm'
    }
}, function (options, value) {

    var type = options.type,
        msg = options.msg;

    switch (type) {
        case 'error':
            log.error(msg);
            break;
        case 'info':
            log.info(msg);
            break;
        case 'warn':
            log.warn(msg);
            break;
        default:
            log(msg);
    }

});

});