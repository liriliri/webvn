var config = require('./grunt.json'),
    util = require('./util'),
    gruntConfig = require('./gruntConfig'),
    gruntTask = require('./gruntTask');

function initGrunt(grunt) {
    "use strict";
    var fileBase = config['fileBase'];
    grunt.file.setBase(fileBase);
}

function loadNpmTasks(grunt) {
    "use strict";
    var npmTasks = config['npmTasks'];
    npmTasks.forEach(function (element) {
        grunt.loadNpmTasks(element);
    });
}

function initConfig(grunt) {
    "use strict";
    grunt.initConfig(gruntConfig);
}

function initTasks(grunt) {
    "use strict";
    util.each(gruntTask, function (value, key) {
        grunt.registerTask(key, value);
    });
    grunt.loadTasks(config['taskDir']);
}

function exportsFunc(grunt) {
    "use strict";
    initGrunt(grunt);
    loadNpmTasks(grunt);
    initConfig(grunt);
    initTasks(grunt);
}

module.exports = exportsFunc;
