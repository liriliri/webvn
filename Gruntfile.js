module.exports = function (grunt) {

grunt.initConfig({
    connect: {
        server: {
            options: {
                keepalive: true,
                hostname: 'localhost',
                port: 80
            }
        }
    }
});

grunt.loadNpmTasks('grunt-contrib-connect');

};