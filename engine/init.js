// Do some initialization work here
webvn.use(['script', 'config'],
    function (s, script, config) {
        // Trigger functions when files are all loaded.
        s.isReady = true;
        s.call();
        // Load script and begin executing it
        if (!config.test) {
            script.load();
        }
    });