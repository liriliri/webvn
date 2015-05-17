// Generate template file
var util = require('../util'),
    path = require('path');

var intro = 'webvn.use(function (ui) { ui.template.create(',
    outro = ');});';

function exportsFunc(grunt) {
    "use strict";
    grunt.registerMultiTask('generateTpl', 'generate template file', function () {
        var files = this.files;
        util.each(files, function (value) {
            var src = value.src,
                dest = value.dest,
                content = {};
            util.each(src, function (value) {
                var fileName = path.basename(value).split('.')[0];
                content[fileName] = grunt.file.read(value);
            });
            content = intro + JSON.stringify(content, null, 4) + outro;
            grunt.file.write(dest, content);
        });
    });
}

module.exports = exportsFunc;