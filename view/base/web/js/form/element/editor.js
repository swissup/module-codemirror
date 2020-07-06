define([
    'jquery',
    'underscore',
    'Magento_Ui/js/form/element/textarea',
    '../../codemirror/lib/codemirror'
], function ($, _, Textarea, CodeMirror) {
    'use strict';

    var _isMinificationEnabled;

    /**
     * Get array of required resources for CodeMirror mode.
     *
     * @param  {String} modeName
     * @return {Array}
     */
    function getRequired(modeName) {
        var files,
            resourceMap = {
            'css|text/x-less': [
                'addon/hint/show-hint',
                'addon/hint/css-hint',
                'addon/edit/closebrackets',
                'addon/edit/matchbrackets',
                'mode/css/css'
            ],
            'htmlmixed': [
                'addon/hint/show-hint',
                'addon/hint/css-hint',
                'addon/hint/html-hint',
                'addon/edit/closetag',
                'addon/edit/matchtags',
                'addon/edit/closebrackets',
                'addon/edit/matchbrackets',
                'mode/htmlmixed/htmlmixed'
            ],
            'javascript|application/ld+json': [
                'addon/edit/closebrackets',
                'addon/edit/matchbrackets',
                'mode/javascript/javascript'
            ]
        };

        files = _.find(resourceMap, function (value, key) {
            return key.indexOf(modeName) >= 0;
        });

        return typeof files === 'undefined' ?
            [] :
            _.map(files, function (path) {
                return 'Swissup_Codemirror/js/codemirror/' + path;
            });
    }

    /**
     * Make editor resizable.
     *
     * @param  {CodeMirror} editor
     */
    function makeResizable(editor) {
        var wrapperElement = editor.getWrapperElement();

        $(wrapperElement).resizable({
            handles: 's',
            resize: _.debounce(editor.refresh.bind(editor), 100),
            zIndex: 900
        });
        // Make full height on double click.
        $('.ui-resizable-handle', wrapperElement)
            .dblclick(function () {
                editor.setSize(null, editor.doc.height + 12);
                editor.refresh();
            });
    }

    /**
     * Is CSS minification enabled
     *
     * @param  {String}  minficationPostfix
     * @return {Boolean}
     */
    function isMinificationEnabled(minficationPostfix) {
        var url;

        if (typeof _isMinificationEnabled === 'undefined') {
            url = document.createElement('a');
            url.href = require.toUrl('');
            _isMinificationEnabled = true;
            $('link[type="text/css"][href^="' + url.origin + '"]').each(function () {
                if ($(this).attr('href').indexOf(minficationPostfix) < 0) {
                    _isMinificationEnabled = false;

                    return false;
                }
            });
        }

        return _isMinificationEnabled;
    }

    /**
     * @param {Node} textarea
     */
    function listenTextareaVisibilityChange(textarea) {
        var uiField = $(textarea).closest('.field, .admin__field').get(0),
            uiObserver,
            configObserver = new MutationObserver(function () {
                var td;

                if ($(textarea).closest('.section-config')) {
                    td = $(textarea).closest('tr').find('td');

                    if (textarea.style.display === 'none') {
                        td.addClass('ignore-validate');
                    } else {
                        td.removeClass('ignore-validate');
                    }
                }

                if (textarea.style.display !== 'none') {
                    $(textarea).siblings('.CodeMirror').get(0).CodeMirror.refresh();
                }
            });

        configObserver.observe(textarea, {
            attributes: true
        });

        if (uiField) {
            uiObserver = new MutationObserver(function () {
                if (uiField.style.display !== 'none') {
                    $(textarea).siblings('.CodeMirror').get(0).CodeMirror.refresh();
                }
            });

            uiObserver.observe(uiField, {
                attributes: true
            });
        }
    }

    /**
     * Load Css via related URL
     *
     * @param  {String} url
     */
    function loadCss(url) {
        var link = document.createElement('link');

        if (isMinificationEnabled('.min.css')) {
            url = url.replace('.css', '.min.css');
        }

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
            inputClass: '',
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
            var self = this,
                mode = this.editorConfig.mode,
                modeName;

            // Require resource with repective mode. Init editor when ready.
            modeName = typeof mode === 'object' ? mode.name : mode;
            require(
                getRequired(modeName), // Array of required resources
                function () {
                    var visible = textarea.style.display !== 'none';

                    if ($('textarea').closest('tr').css('display') === 'none' ||
                        $('textarea').closest('.field, .admin__field').css('display') === 'none'
                    ) {
                        visible = false;
                    }

                    self.editor = CodeMirror.fromTextArea(
                        textarea,
                        self.editorConfig
                    );

                    listenTextareaVisibilityChange(textarea);

                    $(textarea)
                        .attr('tabindex', -1) // prevent focus on invisible field
                        .addClass('cm-textarea-hidden') // fix for hidden config field when using `depends`
                        .toggle(visible);

                    self.editor.on(
                        'changes',
                        self.listenEditorChanges.bind(self)
                    );
                    makeResizable(self.editor);
                }
            );
        },

        /**
         * @param  {Object} editor
         */
        listenEditorChanges: function (editor) {
            this.value(editor.getValue());
        },

        /**
         * @param {String} newValue
         */
        setEditorValue: function (newValue) {
            if (typeof this.editor !== 'undefined' &&
                newValue !== this.editor.getValue()
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
