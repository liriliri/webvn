var config = require('./grunt.json'),
    util = require('./util'),
    webvn = require('../../webvn.json');

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
            destination: 'dev/doc/jsdoc',
            template: "../WebVN-jsdoc3",
            configure: "dev/grunt/jsdoc.json"
        },
        src: [
            'engine/**/*.js',
            'config/*.js',
            'README.md'
        ]
    }
};

exports.yuidoc = {
    dist: {
        options: {
            paths: 'engine/',
            outdir: 'doc/yuidoc'
        }
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

exports.generateLang = {
    ui: {
        files: {
            'engine/ui/lang.js': ['engine/ui/lang/*.json']
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

var tempDir = 'dev/grunt/temp';

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
            },
            {
                expand: true,
                cwd: 'dist/config',
                src: ["*.js"],
                dest: '../WebVN-demo/config'
            },
            {
                '../WebVN-demo/scenario/init.wvn': 'dist/scenario/init.wvn'
            }
        ]
    },
    jsdoc: {
        files: [
            {
                expand: true,
                cwd: 'dev/doc/jsdoc',
                src: ['*.*', '**/*.*'],
                dest: '../WebVN-sae/1/public/jsdoc'
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
                'dev/grunt/temp/core.js': coreFiles,
                'dev/grunt/temp/basic.js': basicFiles,
                'dev/grunt/temp/ui.js': uiFiles,
                'dev/grunt/temp/cmd.js': cmdFiles,
                'dev/grunt/temp/init.js': initFiles
            },
            {
                'dev/grunt/temp/webvn.css': uiCssFiles
            }]
    }
};

module.exports = exports;