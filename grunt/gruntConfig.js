var config = require('./grunt.json'),
    util = require('./util'),
    webvn = require('../webvn.json');

var exports = {};

exports.connect = {
    server: {
        options: {
            keepalive: true,
            hostname: 'localhost',
            port: config['serverPort']
        }
    }
};

exports.exec = {
    startServer: 'xampp_start',
    stopServer: 'xampp_stop'
};

exports.jsdoc = {
    dist: {
        options: {
            destination: 'doc/jsdoc',
            template: "../WebVN-jsdoc3",
            configure: "grunt/jsdoc.json"
        },
        src: [
            'engine/core/*.js',
            'engine/ui/*.js',
            'engine/cmd/*.js',
            'config/*.js',
            'README.md'
        ]
    }
};

exports.sass = {
    options: {
        sourcemap: 'none'
    },
    ui: {
        files: {
            'engine/ui/css/animate.css': 'engine/ui/scss/animate.scss',
            'engine/ui/css/reset.css': 'engine/ui/scss/reset.scss',
            'engine/ui/css/component.css': 'engine/ui/scss/component.scss',
            'engine/ui/css/ui.css': 'engine/ui/scss/ui.scss'
        }
    }
};

exports.generateTpl = {
    ui: {
        files: {
            'engine/ui/template.js': ['engine/ui/tpl/*.html']
        }
    }
};

exports.generateShader = {
    fragment: {
        options: {
            type: 'fragShader'
        },
        files: {
            'engine/core/webgl/fragShader.js': ['engine/core/webgl/fragment/*.frag']
        }
    },
    vertex: {
        options: {
            type: 'vertexShader'
        },
        files: {
            'engine/core/webgl/vertexShader.js': ['engine/core/webgl/vertex/*.vert']
        }
    }
};

var tempDir = 'grunt/temp';

exports.copy = {
    dist: {
        files: [
            {
                expand: true,
                cwd: 'grunt/dist',
                src: ["*.*", "**/*.*"],
                dest: 'dist'
            },
            {
                expand: true,
                cwd: 'config',
                src: ["*.js"],
                dest: 'dist/config'
            },
            {
                'dist/engine/basic.js': tempDir + '/basic.js',
                'dist/engine/core.js': tempDir + '/core.js',
                'dist/engine/webvn.js': 'engine/core/webvn.js',
                'dist/engine/ui.js': tempDir + '/ui.js',
                'dist/engine/cmd.js': tempDir + '/cmd.js',
                'dist/engine/init.js': tempDir + '/init.js'
            },
            {
                'dist/engine/webvn.css': tempDir + '/webvn.css'
            },
            {
                'dist/scenario/init.wvn': 'scenario/init.wvn'
            },
            {
                expand: true,
                cwd: 'engine/img',
                src: ["*.*", "**/*.*"],
                dest: 'dist/engine/img'
            }]
    },
    demo: {
        files: [
            {
                expand: true,
                cwd: 'dist/engine',
                src: ["*.*", "**/*.*"],
                dest: '../WebVN-demo/engine'
            }
        ]
    }
};

var coreFiles = util.webvnFiles(webvn['js'].core, 'js'),
    basicFiles = util.webvnFiles(webvn['js'].basic, 'js'),
    uiFiles = util.webvnFiles(webvn['js'].ui, 'js'),
    cmdFiles = util.webvnFiles(webvn['js'].cmd, 'js'),
    initFiles = util.webvnFiles(webvn['js'].init, 'js'),
    uiCssFiles = util.webvnFiles(webvn['css'].ui, 'css');
exports.concat = {
    dist: {
        files: [
            {
                'grunt/temp/core.js': coreFiles,
                'grunt/temp/basic.js': basicFiles,
                'grunt/temp/ui.js': uiFiles,
                'grunt/temp/cmd.js': cmdFiles,
                'grunt/temp/init.js': initFiles
            },
            {
                'grunt/temp/webvn.css': uiCssFiles
            }]
    }
};

module.exports = exports;