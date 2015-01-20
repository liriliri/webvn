var npmTasks = [
	'grunt-contrib-connect',
	'grunt-contrib-jshint',
    'grunt-contrib-concat',
    'grunt-contrib-uglify'
];

// Load configuration file
var config = require('./config'),
    loadFiles = config.loadFiles,
    filePrefix = loadFiles.prefix;

var jsFile = {};

['core', 'lib', 'ui', 'cmd'].forEach(function (key) {
    jsFile[key] = loadFiles.js[key].map(function (item) {
        return filePrefix.js[key].substr(1) + item + '.js';
    });
});

module.exports = function (grunt) {

grunt.initConfig({
    concat: {
        engine: {
            files: {
                'build/engine/core.js': jsFile.core,
                'build/engine/lib.js': jsFile.lib,
                'build/engine/ui.js': jsFile.ui,
                'build/engine/cmd.js': jsFile.cmd
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

grunt.registerTask('build', ['concat:engine', 'uglify:engine']);

};