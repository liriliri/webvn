---
layout: api
extracss: api
title: 标题画面【menu】
---

|功能|标题画面控制|

### 参数

|名称|缩写|类型|默认值|功能|
|--------------------------|
|bgm|bgm|String|null|背景乐路径，不设置时不播放|
|btn|btn|Json|{"start":true,"load":true...}|设置各按钮是否显示及名称|
|btnClickSound|bcs|String|null|按钮点击音效|
|btnHoverSound|bhs|String|null|按钮悬浮音效|
|display|d|Boolean|false|是否显示|
|duration|du|Number|1000|渐入渐隐的时间长短|
|fadeIn|fi|Boolean|true|是否以渐入的方式显示|
|fadeOut|fo|Boolean|true|是否以渐隐的方式隐藏|

### 示例

    menu -d -bgm=/asset/test/bgm1.ogg+
        -bhs=/asset/test/onmouse.wav+
        -bcs=/asset/test/onclick.wav+
        -btn='{"start":"开始旅程","load":false,"setting":false,"cg":false,"music":false}'