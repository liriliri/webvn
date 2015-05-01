webvn.use(['ui', 'select', 'media'],
    function (ui, select, media) {
        "use strict";
        var exports = ui.create('music'),
            $el = exports.$el;
        var tpl = ui.getTemplate('music');
        exports.body(tpl);
        $el.addClass('fill');

        var $progress = $el.find('.progress'),
            $progressFill = $progress.find('span');

        var music = media.createAudio('music');
        music.loop(true);
        music.event({
            'timeupdate': function () {
                var percentage = music.currentTime() / music.duration;
                $progressFill.css('width', $progress.width() * percentage);
            }
        });

        $progress.on('click', function (e) {
            if (!music.isPlaying()) {
                return;
            }
            // OffsetX has to divided by scale
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
                    src = $this.attr('data-src');
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