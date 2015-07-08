WebVN.config({
    "script": {
        "startScenario": "system",
        "path": "scenario/",
        "extension": "wvn"
    },
    "system": {
        "title": "WebVN"
    },
    "ui": {
        "container": "#webvn",
        "defaultTpl": "<div class=\"center\"><div id=\"webvn\"></div></div>",
        "width": 1280,
        "height": 720,
        "autoResize": true,
        "lang": "zh"
    },
    "log": {
        "colors": {
            "info" : "#07a",
            "error": "#eb6864",
            "warn" : "#f9c621"
        }
    },
    "media": {
        "bgm": {
            "path": "asset/bgm/",
            "extension": "ogg",
            "volume": 0.5
        },
        "se": {
            "path": "asset/sound/",
            "extension": "ogg",
            "volume": 0.5
        },
        "vo": {
            "path": "asset/voice/",
            "extension": "ogg",
            "volume": 0.5
        }
    },
    "canvas": {
        "lumaPath": "engine/img/luma/",
        "lumaExtension": "png"
    }
});