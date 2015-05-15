webvn.use(['ui', 'config', 'canvas', 'storage', 'select', 'system'], function (ui, config, canvas, storage, select, system) {
    "use strict";
    var exports = ui.create('save');

    var conf = config.create('uiSave');

    exports.duration = conf.get('duration');
    exports.fadeIn = conf.get('fadeIn');
    exports.fadeOut = conf.get('fadeOut');

    exports.stopPropagation();
    exports.event({
        'click .close': function () {
            hide();
        },
        'click .save': function () {
            var $this = select.get(this),
                saveName = $this.attr('data-name'),
                saveId = Number($this.attr('data-num'));
            saves[saveId] = system.title();
            $this.find('span').text(saves[saveId]);
            global.set('saves', saves);
            storage.save(saveName);
        },
        'click .load': function () {
            var $this = select.get(this),
                saveName = $this.attr('data-name');
            storage.load(saveName);
        }
    });

    var tpl = ui.getTemplate('save');
    exports.body(tpl);

    var $el = exports.$el;
    $el.addClass('fill');

    var $title = $el.find('.ui-title');

    var renderer = canvas.renderer;

    var saveNum = conf.get('saveNum');

    var global = storage.createLocalStore('global');

    var saves = global.get('saves') || [];

    function initSave() {
        $title.text('Save');
        var html = '', saveName;
        for (var i = 0; i < saveNum; i++) {
            if (saves[i]) {
                saveName = saves[i];
            } else {
                saveName = '这里是存档的标题';
            }
            html += '<li class="save" data-name="save' + i + '" data-num="' + i + '"><span>' +
                saveName + '</span></li>';
        }
        $el.find('.container').html(html);
    }

    function initLoad() {
        $title.text('Load');
        var html = '', saveName;
        for (var i = 0; i < saveNum; i++) {
            if (saves[i]) {
                saveName = saves[i];
            } else {
                saveName = '这里是存档的标题';
            }
            html += '<li class="load" data-name="save + ' + i + '" data-num="' + i + '"><span>' +
                saveName + '</span></li>';
        }
        $el.find('.container').html(html);
    }

    exports.show = function (type) {
        renderer.stop();
        if (type === 'save') {
            initSave();
        } else {
            initLoad();
        }

        if (exports.fadeIn) {
            $el.fadeIn(exports.duration);
        } else {
            $el.show();
        }
    };

    var hide = exports.hide = function () {
        renderer.start();
        if (exports.fadeOut) {
            $el.fadeOut(exports.duration);
        } else {
            $el.hide();
        }
    };
});