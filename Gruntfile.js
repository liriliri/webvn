var npmTasks = [
	'grunt-contrib-connect',
	'grunt-contrib-jshint'
];

// Load configuration file
var config = require('./config');

module.exports = function (grunt) {

grunt.initConfig({
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
    }
});

// Load npm tasks
for (var i = 0, len = npmTasks.length; i < len; i++) {
	grunt.loadNpmTasks(npmTasks[i]);
}

grunt.registerTask('build', []);

};