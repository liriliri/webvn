module.exports = function (grunt) {

grunt.initConfig({
	exec: {
		jekyll: 'jekyll serve --watch --baseurl='
	}
});

grunt.loadNpmTasks('grunt-exec');

};