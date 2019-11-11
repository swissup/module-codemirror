define([
    'jquery',
    'underscore',
    'Magento_Ui/js/form/element/textarea',
    '../../codemirror/lib/codemirror',
    '../../codemirror/mode/css/css',
    '../../codemirror/mode/htmlmixed/htmlmixed',
    '../../codemirror/addon/hint/show-hint',
    '../../codemirror/addon/hint/css-hint',
    '../../codemirror/addon/hint/html-hint',
    '../../codemirror/addon/edit/closebrackets',
    '../../codemirror/addon/edit/closetag',
    '../../codemirror/addon/edit/matchbrackets',
    '../../codemirror/addon/edit/matchtags'
], function ($, _, Textarea, CodeMirror) {
    'use strict';

    function loadCss(url) {
        var link = document.createElement('link');

        link.type = 'text/css';
        link.rel = 'stylesheet';
        link.href = require.toUrl('Swissup_Codemirror/' + url);
        document.getElementsByTagName('head')[0].appendChild(link);
    }

    // load CSS for codemirror editor
    _.each([
            'js/codemirror/lib/codemirror.css',
            'js/codemirror/addon/hint/show-hint.css',
            'js/codemirror/addon/fold/foldgutter.css',
            'css/editor.css'
        ], loadCss);

    return Textarea.extend({
        defaults: {
            elementTmpl: 'Swissup_Codemirror/form/element/editor',
            editorConfig: {
                indentUnit: 4,
                lineNumbers: true,
                autoCloseBrackets: true,
                autoCloseTags: true,
                matchTags: {
                    bothTags: true
                },
                matchBrackets: true,
                extraKeys: {
                    'Ctrl-Space': 'autocomplete',
                    'Ctrl-J': 'toMatchingTag'
                }
            }
        },

        /** @inheritdoc */
        initObservable: function () {
            this._super();
            this.value.subscribe(this.setEditorValue.bind(this));

            return this;
        },

        /**
         * Initialize CodeMirror on textarea.
         *
         * @param  {Element} textarea
         */
        initEditor: function (textarea) {
            this.editor = CodeMirror.fromTextArea(textarea, this.editorConfig);
            this.editor.on('changes', this.listenEditorChanges.bind(this));
        },

        /**
         * @param  {Object} editor
         */
        listenEditorChanges: function (editor) {
            this.value(editor.getValue());
            // Force update in other binded KO veiw models.
            $(this.editor.getTextArea()).trigger('change');
        },

        /**
         * @param {String} newValue
         */
        setEditorValue: function (newValue) {
            if (typeof this.editor !== 'undefined' &&
                this.value() !== this.editor.getValue()
            ) {
                this.editor.setValue(newValue);
            }
        },

        /**
         * {@inheritdoc}
         */
        initConfig: function () {
            this._super();

            // Force uid when input id is set in element config.
            if (this.inputId) {
                _.extend(this, {
                    uid: this.inputId,
                    noticeId: 'notice-' + this.inputId,
                    errorId: 'error-' + this.inputId
                });
            }

            return this;
        }
    });
});
