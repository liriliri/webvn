var util = require('../util'),
    path = require('path');

function exportsFunc(grunt) {
    "use strict";
    grunt.registerMultiTask('generateShader', 'generate shader files', function () {
        var options = this.options(),
            type = options.type,
            files = this.files;

        var intro = 'webvn.use(function (webgl) { webgl.' + type + '.create(',
            outro = ');});';

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