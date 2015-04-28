/* This file is used to generate template.js
 * Usage: node build
 */
var fs = require('fs'),
    path = require('path');

var fragments = {};

function addFragment(file) {
    "use strict";
    var name = file.split('.')[0];
    fragments[name] = fs.readFileSync(file, {encoding: 'utf-8'});
}

function outputFile() {
    "use strict";
    var data = ['webvn.use(["ui"], function (s, ui) {',
        'ui.createTemplate(',
        JSON.stringify(fragments, null, 4),
        ');\n});'
    ].join('\n');
    fs.writeFile('../template.js', data);
}

fs.readdir('./', function (err, files) {
    "use strict";
    files.forEach(function (file) {
        if (path.extname(file) === '.html') {
            addFragment(file);
        }
    });
    outputFile();
});