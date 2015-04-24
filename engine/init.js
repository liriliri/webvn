// Do some initialization work here
webvn.use(['script', 'config'],
    function (s, script, config) {
        // Load script and begin executing it
        if (!config.test) {
            script.load();
        }
    });