// Do some initialization work here
WebVN.use(function (script, config)
{
    // Trigger functions when files are all loaded.
    WebVN.isReady = true;

    WebVN.call();

    // Load script and begin executing it
    if (config.build !== 'test') script.load();
});