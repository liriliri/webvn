module.exports = function (grunt) {
    "use strict";
    grunt.initConfig({
        connect: {
            server: {
                options: {
                    keepalive: true,
                    hostname: 'localhost',
                    port: 4000
                }
            }
        }
    });
    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.registerTask('build', []);
};