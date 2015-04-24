// Small template engine

webvn.module('template', ['util'], function (s, util) {

var defaults = {
    openTag: '<%',
    closeTag: '%>',
    headerCode: '"use strict";var $utils=this,$helpers=$utils.$helpers,'
};

var proto = {
    $helpers: {}
};

var replaces = ["$out='';", '$out+=', ';', '$out'],
    
    footerCode = 'return new String(' + replaces[3] + ');';

var template = function (source, options) {

    options = util.merge(defaults, options);

    var openTag = options.openTag,
        closeTag = options.closeTag;

    var mainCode = replaces[0];

    // Split code and html
    util.each(source.split(openTag), function (code) {

        code = code.split(closeTag);

        var $0 = code[0],
            $1 = code[1];

        // code: [html]
        if (code.length === 1) {
            mainCode += html($0, options);
        // code: [logic, html]
        } else {
            mainCode += logic($0, options);
            if ($1) {
                mainCode += html($1, options);
            }
        }

    });

    var code = options.headerCode + mainCode + footerCode;

    try {
        var Render = new Function('$data', code);
        Render.prototype = proto;

        return function (data) {

            return new Render(data) + '';

        };
    } catch (e) {
        s.log.error('Template error: ' + e.message);
    }

};

var KEYWORDS = 'break,case,catch,continue,debugger,default,delete,do,else,false' +
    ',finally,for,function,if,in,instanceof,new,null,return,switch,this' +
    ',throw,true,try,typeof,var,void,while,with' +
    ',abstract,boolean,byte,char,class,const,double,enum,export,extends' +
    ',final,float,goto,implements,import,int,interface,long,native' +
    ',package,private,protected,public,short,static,super,synchronized' +
    ',throws,transient,volatile' +
    ',arguments,let,yield' +
    ',undefined';

var REMOVE_RE = /\/\*[\w\W]*?\*\/|\/\/[^\n]*\n|\/\/[^\n]*$|"(?:[^"\\]|\\[\w\W])*"|'(?:[^'\\]|\\[\w\W])*'|\s*\.\s*[$\w\.]+/g,
    SPLIT_RE = /[^\w$]+/g,
    KEYWORDS_RE = new RegExp(["\\b" + KEYWORDS.replace(/,/g, '\\b|\\b') + "\\b"].join('|'), 'g'),
    NUMBER_RE = /^\d[^,]*|,\d[^,]*/g,
    BOUNDARY_RE = /^,+|,+$/g,
    SPLIT2_RE = /^$|,+/;

function getVariable(code) {

    return code.
        replace(REMOVE_RE, '').
        replace(SPLIT_RE, ',').
        replace(KEYWORDS_RE, '').
        replace(NUMBER_RE, '').
        replace(BOUNDARY_RE, '').
        split(SPLIT2_RE);

}

// Handle html string
function html(code, options) {

    code = replaces[1] + stringify(code) + replaces[2] + '\n';
    return code;

}

function logic(code, options) {

    util.each(getVariable(code), function (name) {

        var value;

        value = '$data.' + name;

        options.headerCode += name + '=' + value + ',';

    });

    return code + '\n';

}

// Escape string
function stringify(code) {

    return "'" + code
    .replace(/('|\\)/g, '\\$1')
    .replace(/\r/g, '\\r')
    .replace(/\n/g, '\\n') + "'";

}

return template;

});