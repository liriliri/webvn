module.exports = function (grunt) {

grunt.initConfig({
	exec: {
		jekyll: 'jekyll serve --watch --baseurl='
	},
    sass: {
        options: {
            sourcemap: 'none'
        },
        style: {
            files: [{
                expand: true,
                cwd: 'css',
                src: '*.scss',
                dest: 'css',
                ext: '.css'
            }]
        }
    },
    watch: {
        sass: {
            options: {
                spawn: false
            },
            files: [
                'css/*.scss'
            ],
            tasks: ['sass:style']
        }
    }
});

grunt.loadNpmTasks('grunt-exec');
grunt.loadNpmTasks('grunt-contrib-sass');
grunt.loadNpmTasks('grunt-contrib-watch');

};