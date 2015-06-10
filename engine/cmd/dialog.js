WebVN.use(function (script, ui)
{
    var dialog = ui.get('dialog');

    /**
     * Dialog command.
     * @class Dialog
     * @memberof script.command
     * @extends script.command.Command
     */
    script.command.create(
        /** @lends script.command.Dialog.prototype */
        {
            constructor: function Dialog() { this.callSuper('dialog'); },

            /**
             * @type {Object}
             */
            options: {
                display      : { type: 'boolean', short: 'd' },
                style        : { type: 'string',  short: 's' },
                face         : { type: 'String',  short: 'f' },
                duration     : { type: 'Number',  short: 'du' },
                fadeIn       : { type: 'Boolean', short: 'fi' },
                fadeOut      : { type: 'Boolean', short: 'fo' },
                name         : { type: 'String',  short: 'n' },
                text         : { type: 'String',  short: 't' },
                textDuration : { type: 'Number',  short: 'td' },
                textType     : { type: 'String',  short: 'tt' },
                voice        : { type: 'String',  short: 'v' },
                stopAnimation: { type: 'boolean', short: 'sa' },
                playNext     : { type: 'boolean', short: 'pn' },
                clearText    : { type: 'boolean', short: 'ct'}
            },

            orders: [
                'fadeIn',
                'fadeOut',
                'style',
                'duration',
                'textType',
                'textDuration',
                'face',
                'display',
                'name',
                'clearText',
                'text',
                'voice',
                'stopAnimation',
                'playNext'
            ],

            beforeExec: function (vals, text) {
                if (dialog.textAnim.isPlaying())
                {
                    dialog.textAnim.stop();
                    script.insert(['command', text]);
                    return false;
                }

                return true;
            },

            stopAnimation: function (val) { val && dialog.stopAnim() },
            face         : function (val) { dialog.face(val) },
            style        : function (val) { dialog.style(val) },
            fadeIn       : function (val) { dialog.fadeIn       = val },
            fadeOut      : function (val) { dialog.fadeOut      = val },
            duration     : function (val) { dialog.duration     = val },
            textType     : function (val) { dialog.textType     = val },
            textDuration : function (val) { dialog.textDuration = val },
            display      : function (val) { val ? dialog.show() : dialog.hide() },
            name         : function (val) { dialog.name(val) },
            text         : function (val) { dialog.text(val) },
            voice        : function (val) { dialog.voice(val) },
            clearText    : function (val) { val && dialog.text.clear() }
        }
    );
});