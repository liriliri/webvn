webvn.use(['ui', 'select', 'media', 'config', 'storage', 'util', 'class'], function (ui, select, media, config, storage, util, kclass) {
    "use strict";
    var exports = ui.create('music');

    var conf = config.create('uiMusic');

    var tpl = ui.getTemplate('music');
    exports.body(tpl);

    var $el = exports.$el;
    $el.addClass('fill');

    var controller = kclass.module(function () {
        var exports = {};

        var music = media.createAudio('music');
        music.asset = storage.createAsset(conf.get('path'), conf.get('extension'));
        music.loop(true);
        music.event({
            'timeupdate': function () {
                var percentage = music.currentTime() / music.duration;
                $progressFill.css('width', $progress.width() * percentage);
            }
        });

        var $progress = $el.find('.progress'),
        $progressFill = $progress.find('span');
        $progress.on('click', function (e) {
            if (!music.isPlaying()) {
                return;
            }
            // OffsetX has to divided by scale
            e = e.originalEvent;
            var x = e.offsetX / ui.scale,
                percentage = x / $progress.width();
            music.currentTime(music.duration * percentage);
        });

        var $container = $el.find('.container'),
            $playBtn = $el.find('.play'),
            $nextBtn = $el.find('.next'),
            $preBtn = $el.find('.previous');

        var files = conf.get('files'), html = '';
        util.each(files, function (file, index) {
            html += '<li class="num' + index + '" data-num="' + index + '">' + file + '</li>';
        });
        $container.html(html);

        var curNum = -1,
            total = files.length;

        var $all = $el.find('.container li');

        var play = exports.play = function (num) {
            if (num === undefined) {
                if (!music.isLoaded()) {
                    return;
                }
                if (music.isPlaying()) {
                    $playBtn.text('Play');
                    music.pause();
                } else {
                    $playBtn.text('Pause');
                    music.play();
                }
            } else {
                $playBtn.removeClass('disabled').text('Pause');
                $nextBtn.removeClass('disabled');
                $preBtn.removeClass('disabled');
                $all.removeClass('playing');
                curNum = num;
                $el.find('.num' + num).addClass('playing');
                music.load(files[num]);
            }
        };

        exports.next = function () {
            if (curNum < 0) return;
            curNum++;
            if (curNum >= total) curNum = curNum - total;
            play(curNum);
        };

        exports.previous = function () {
            if (curNum < 0) return;
            curNum--;
            if (curNum < 0) curNum = total - 1;
            play(curNum);
        };

        exports.pause = function () {
            $playBtn.text('play');
            music.pause();
        };

        return exports;
    });

    exports.stopPropagation();
    exports.event({
        'click .close': function () {
            controller.pause();
            var menu = ui.get('menu');
            menu.playBgm();
            hide();
        },
        'click .container li': function () {
            var $this = select.get(this);
            controller.play($this.attr('data-num'));
        },
        'click .play': function () {
            controller.play();
        },
        'click .next': function () {
            controller.next();
        },
        'click .previous': function () {
            controller.previous();
        }
    });

    exports.show = function () {
        $el.fadeIn(300);
    };

    var hide = exports.hide = function () {
        $el.fadeOut(300);
    };
});