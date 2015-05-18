// Do some initialization work here
webvn.use(function (script, config) {
    'use strict';
    var s = webvn;

    // Trigger functions when files are all loaded.
    s.isReady = true;
    s.call();

    // Load script and begin executing it
    if (config.build !== 'test') {
        script.load();
    }
});