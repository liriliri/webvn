---
layout: post
title: 游戏脚本设计
category: dev
---

### 宏定义

function macroname(params) {
    ...
}

示例：

function speak(name, text, voice) {
    dialog -n={name} -v={voice} -t={text};
    dialog -d;
}

speak RedHood 'Hello, world!' /asset/test/vo1.ogg;

### 变量

var song = ['do', 're', 'mi', 'fa', 'so']
var a = 5

### If命令

if (x == 5) {
    jump -t=start;
} else {
    jump -t=end;
}

script {
    var x = 5;
    var ui = s.ui;
    dialog = ui.get('dialog');
    ...
}

### 注释

// Line Comment
/* This is 
 * a block comment
 */