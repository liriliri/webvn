var config = require('./grunt.json'),
    util = require('./util');

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

var gruntConfig = {};
gruntConfig.connect = {
    server: {
        options: {
            keepalive: true,
            hostname: 'localhost',
            port: config['serverPort']
        }
    }
};
gruntConfig.exec = {
    startServer: 'xampp_start',
    stopServer: 'xampp_stop'
};
gruntConfig.jsdoc = {
    dist: {
        options: {
            destination: 'doc/jsdoc',
            template: "../WebVN-jsdoc3",
            configure: "task/jsdoc.json"
        },
        src: [
            'engine/core/*.js',
            'engine/ui/*.js',
            'engine/cmd/*.js',
            'config/*.js',
            'README.md'
        ]
    }
};
gruntConfig.sass = {
    options: {
        sourcemap: 'none'
    },
    ui: {
        files: {
            'engine/ui/css/animate.css': 'engine/ui/scss/animate.scss',
            'engine/ui/css/reset.css': 'engine/ui/scss/reset.scss',
            'engine/ui/css/component.css': 'engine/ui/scss/component.scss',
            'engine/ui/css/ui.css': 'engine/ui/scss/ui.scss'
        }
    }
};

function initConfig(grunt) {
    "use strict";
    grunt.initConfig(gruntConfig);
}

var gruntTasks = {};
gruntTasks.server = ['connect:server'];

function initTasks(grunt) {
    "use strict";
    util.each(gruntTasks, function (value, key) {
        grunt.registerTask(key, value);
    });
}

function exportsFunc(grunt) {
    "use strict";
    initGrunt(grunt);
    loadNpmTasks(grunt);
    initConfig(grunt);
    initTasks(grunt);
}

module.exports = exportsFunc;
