webvn.use(function (ui, config, util, canvas, storage, select, system) {
    "use strict";
    var uiName = 'save',
        exports = ui.create(uiName),
        $el = exports.$el,
        lang = ui.lang.get(uiName),
        tpl = ui.template.get(uiName);

    var cfg = config.create('uiSave'),
        cfgSaveNum = cfg.get('saveNum');

    var global = storage.createLocalStore('global'),
        saves = global.get('saves') || [],
        renderer = canvas.renderer;

    $el.addClass('fill');

    exports.stopPropagation().properties({
        duration: cfg.get('duration'),
        fadeIn: cfg.get('fadeIn'),
        fadeOut: cfg.get('fadeOut')
    }).events({

        'click .close': function () {
            hide();
        },

        'click .save': function () {
            var $this = select.get(this),
                num = Number($this.data('num')),
                saveName = 'save' + num;

            saves[num] = {
                title: system.title(),
                date: getDateTime()
            };

            global.set('saves', saves);
            storage.save(saveName);
            renderSave();
        },

        'click .load': function () {
            var $this = select.get(this),
                saveName = 'save' + $this.data('num');

            storage.load(saveName);

            exports.hide();
        }

    });

    function getDateTime() {
        var date = new Date;

        return date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate() +
            ' ' + prependZero(date.getHours()) + ':' +
            prependZero(date.getMinutes()) + ':' +
            prependZero(date.getSeconds());
    }

    function prependZero(num) {
        if (num < 10) {
            return '0' + num;
        }

        return num;
    }

    exports.show = function (type) {
        renderer.stop();

        type === 'save' ? renderSave() : renderLoad();

        exports.fadeIn ? $el.fadeIn(exports.duration) : $el.show();
    };

    function renderSave() {
        var i, records = [];

        for (i = 0; i < cfgSaveNum; i++) {
            saves[i] ? records.push(saves[i]) : records.push({
                title: lang.get('Empty'),
                date: ''
            });
        }

        $el.html(tpl({
            Title: lang.get('Save'),
            Close: lang.get('Close'),
            type: 'save',
            records: records
        }));
    }

    function renderLoad() {
        var i, records = [];

        for (i = 0; i < cfgSaveNum; i++) {
            saves[i] ? records.push(saves[i]) : records.push({
                title: lang.get('Empty'),
                date: ''
            });
        }

        $el.html(tpl({
            Title: lang.get('Load'),
            Close: lang.get('Close'),
            type: 'load',
            records: records
        }));
    }

    var hide = exports.hide = function () {
        renderer.start();

        exports.fadeOut ? $el.fadeOut(exports.duration) : $el.hide();
    };
});