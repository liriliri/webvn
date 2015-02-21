// Do some initialization work here

webvn.use(['script', 'conf'], function (s, script, conf) {

    // Load script and begin executing it
    if (!conf.test) {
        script.load();
    }

});