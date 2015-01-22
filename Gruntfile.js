var npmTasks = [
	'grunt-contrib-connect',
	'grunt-contrib-jshint',
    'grunt-contrib-concat',
    'grunt-contrib-uglify',
    'grunt-contrib-cssmin'
];

// Load configuration file
var config = require('./config'),
    loadFiles = config.loadFiles,
    filePrefix = loadFiles.prefix;

var jsFile = {},
    cssFile = {};

['core', 'lib', 'ui', 'cmd'].forEach(function (key) {
    jsFile[key] = loadFiles.js[key].map(function (item) {
        return filePrefix.js[key].substr(1) + item + '.js';
    });
});

['ui'].forEach(function (key) {
    cssFile[key] = loadFiles.css[key].map(function (item) {
        return filePrefix.css[key].substr(1) + item + '.css';
    });
});

module.exports = function (grunt) {

grunt.initConfig({
    cssmin: {
        engine: {
            files: [{
                expand: true,
                cwd: 'build/engine',
                src: '**/*.css',
                dest: 'build/engine'
            }]
        }
    },
    concat: {
        engine: {
            files: {
                'build/engine/core.js': jsFile.core,
                'build/engine/lib.js': jsFile.lib,
                'build/engine/ui.js': jsFile.ui,
                'build/engine/cmd.js': jsFile.cmd
            }
        },
        engine: {
            files: {
                'build/engine/ui.css': cssFile.ui
            }
        }
    },
    connect: {
        server: {
            options: {
                keepalive: true,
                hostname: 'localhost',
                port: 8002
            }
        }
    },
    jshint: {
    	all: [
    		'Gruntfile.js',
    		'engine/core/**/*.js'
    	]
    },
    uglify: {
        engine: {
            files: [{
                expand: true,
                cwd: 'build/engine',
                src: '**/*.js',
                dest: 'build/engine'
            }]
        }
    }
});

// Load npm tasks
for (var i = 0, len = npmTasks.length; i < len; i++) {
	grunt.loadNpmTasks(npmTasks[i]);
}

grunt.registerTask('build', ['concat:engine', 'uglify:engine', 'concat:engine', 'cssmin:engine']);

};