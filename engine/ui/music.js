webvn.use(['ui', 'select', 'media', 'config', 'storage', 'util'], function (ui, select, media, config, storage, util) {
    "use strict";
    var exports = ui.create('music');

    var conf = config.create('uiMusic');

    var tpl = ui.getTemplate('music');
    exports.body(tpl);

    var $el = exports.$el;
    $el.addClass('fill');

    var $progress = $el.find('.progress'),
        $progressFill = $progress.find('span');

    var music = media.createAudio('music');
    music.asset = storage.createAsset(conf.get('path'), conf.get('extension'));
    music.loop(true);
    music.event({
        'timeupdate': function () {
            var percentage = music.currentTime() / music.duration;
            $progressFill.css('width', $progress.width() * percentage);
        }
    });

    var files = conf.get('files');
    var $container = $el.find('.container'), html = '';
    util.each(files, function (file) {
        html += '<li>' + file + '</li>';
    });
    $container.html(html);

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

    exports.event({
        'click .close': function () {
            music.stop();
            $el.find('li').removeClass('playing');
            var menu = ui.get('menu');
            menu.playBgm();
            hide();
        },
        'click li': function () {
            var $this = select.get(this),
                src = $this.text();
            $el.find('li').removeClass('playing');
            $this.addClass('playing');
            music.load(src);
        }
    });

    exports.show = function () {
        $el.fadeIn(300);
    };

    var hide = exports.hide = function () {
        $el.fadeOut(300);
    };
});