var config      = require('./grunt.json'),
    util        = require('./util'),
    gruntConfig = require('./config'),
    gruntTask   = require('./task');

function initGrunt(grunt)
{
    var fileBase = config['fileBase'];
    grunt.file.setBase(fileBase);
}

function loadNpmTasks(grunt)
{
    var npmTasks = config['npmTasks'];
    npmTasks.forEach(function (element) {
        grunt.loadNpmTasks(element);
    });
}

function initConfig(grunt)
{
    grunt.initConfig(gruntConfig);
}

function initTasks(grunt)
{
    util.each(gruntTask, function (value, key)
    {
        grunt.registerTask(key, value);
    });
    grunt.loadTasks(config['taskDir']);
}

function exportsFunc(grunt)
{
    initGrunt(grunt);
    loadNpmTasks(grunt);
    initConfig(grunt);
    initTasks(grunt);
}

module.exports = exportsFunc;
