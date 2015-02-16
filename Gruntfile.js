var key;

// Npm module list
var npmTasks = [
	'grunt-contrib-connect',
	'grunt-contrib-jshint',
    'grunt-contrib-concat',
    'grunt-contrib-uglify',
    'grunt-contrib-cssmin',
    'grunt-contrib-sass',
    'grunt-contrib-copy'
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

var bowerFile = [];
for (key in config.bower) {
    bowerFile.push({
        src: 'bower_components/' + config.bower[key],
        dest: key
    });
}

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
    copy: {
        bower: {
            files: bowerFile
        }
    },
    concat: {
        engineJs: {
            files: {
                'build/engine/core.js': jsFile.core,
                'build/engine/lib.js': jsFile.lib,
                'build/engine/ui.js': jsFile.ui,
                'build/engine/cmd.js': jsFile.cmd
            }
        },
        engineCss: {
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
    sass: {
        options: {
            sourcemap: 'none'
        },
        theme: {
            files: [{
                expand: true,
                cwd: 'engine/theme',
                src: '**/*.scss',
                dest: 'engine/theme',
                ext: '.css'
            }]
        }
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

// Start developing environment
grunt.registerTask('dev', ['connect:server']);
// Build the final product
grunt.registerTask('build', ['concat:engineJs', 'uglify:engine', 'concat:engineCss', 'cssmin:engine']);
// Copy 3rd lib from bower_components folder
grunt.registerTask('bower', ['copy:bower']);

};
