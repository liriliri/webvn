---
layout: api
extracss: api
title: 背景乐【bgm】
---

|功能|背景音乐|

### 参数

|名称|缩写|类型|默认值|功能|
|--------------------------|
|duration|du|Number|2000|渐入渐出的时间长短|
|fadeIn|fi|Boolean|false|是否以渐入的方式播放|
|fadeOut|fo|Boolean|false|是否以渐出的方式停止|
|loop|l|Boolean|true|是否循环|
|play|p|Boolean|false|是否播放|
|src|s|String|null|背景乐路径，设置完会自动播放|
|stop|st|Boolean|true|是否停止（音乐回到起始处）|
|volumn|v|Number|1|音量大小|

### 示例

    bgm -s=/asset/test/bgm2.ogg+
        -fi=true -du=2000
    bgm -p=false -fo=true
