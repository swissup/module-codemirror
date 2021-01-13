define([
    'jquery',
    'underscore',
    'Magento_Ui/js/form/element/textarea',
    'Swissup_Codemirror/js/loadCss',
    'Swissup_Codemirror/js/codemirror/lib/codemirror'
], function ($, _, Textarea, loadCss, CodeMirror) {
    'use strict';

    /**
     * Get array of required resources for CodeMirror mode.
     *
     * @param  {Object} editorConfig
     * @return {Array}
     */
    function getRequired(editorConfig) {
        var files,
            modeName = editorConfig.mode.name ? editorConfig.mode.name : editorConfig.mode,
            resourceMap = {
            'css|text/x-less|text/x-scss': [
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
            ],
            'yaml|text/x-yaml': [
                'addon/fold/foldgutter',
                'addon/fold/foldcode',
                'addon/fold/indent-fold',
                'mode/yaml/yaml'
            ],
            'yaml-frontmatter': [
                'addon/fold/foldgutter',
                'addon/fold/foldcode',
                'addon/fold/indent-fold',
                'mode/yaml-frontmatter/yaml-frontmatter'
            ],
        };

        files = _.find(resourceMap, function (value, key) {
            return key.indexOf(modeName) >= 0;
        });

        return _.map(files || [], function (path) {
            return 'Swissup_Codemirror/js/codemirror/' + path;
        });
    }

    /**
     * @param {Object} editorConfig
     * @return {Array}
     */
    function getPluginNames(editorConfig) {
        var plugins = [
            'visibility',
            'resizable',
            'fullscreen'
        ];

        _.some(editorConfig.buttons, function (button) {
            if (_.isEmpty(button) || button.enabled === false) {
                return false;
            }

            plugins.push('toolbar');

            return true;
        });

        _.some(editorConfig.directives, function (directive) {
            if (_.isEmpty(directive) || directive.enabled === false) {
                return false;
            }

            plugins.push('directives');

            return true;
        });

        return plugins;
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
            plugins: {},
            elementTmpl: 'Swissup_Codemirror/form/element/editor',
            inputClass: '',
            editorConfig: {
                indentUnit: 4,
                lineNumbers: true,
                autoCloseBrackets: true,
                autoCloseTags: true,
                autoHeight: false,
                buttons: [],
                directives: [],
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

        /**
         * @param {Boolean} flag
         */
        isLoading: function (flag) {
            $(this.editor.getWrapperElement()).toggleClass('loading', flag);
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
            var self = this;

            require(
                getRequired(this.editorConfig), // Array of required resources
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

                    if (self.editorConfig.autoHeight && $(textarea).height() > 100) {
                        self.editor.setSize(null, $(textarea).height());
                    }

                    $(textarea)
                        .attr('tabindex', -1) // prevent focus on invisible field
                        .addClass('cm-textarea-hidden') // fix for hidden config field when using `depends`
                        .toggle(visible)
                        .on('focus', function () {
                            self.editor.focus();
                        });

                    self.editor.on(
                        'changes',
                        self.listenEditorChanges.bind(self)
                    );

                    _.each(getPluginNames(self.editorConfig), function (name) {
                        self.plugin(name);
                    });
                }
            );
        },

        /**
         * Initialize component plugin if needed, and return its instance via promise
         *
         * @return {$.Deferred}
         */
        plugin: function (name) {
            var self = this,
                path = 'Swissup_Codemirror/js/form/element/editor-plugins/';

            if (!self.plugins[name]) {
                self.plugins[name] = {
                    instance: null,
                    deferred: $.Deferred()
                };

                require([path + name], function (Plugin) {
                    self.plugins[name].instance = new Plugin(self);
                    self.plugins[name].deferred.resolve(self.plugins[name].instance);
                });
            } else if (self.plugins[name].instance) {
                self.plugins[name].deferred.resolve(self.plugins[name].instance);
            }

            return self.plugins[name].deferred;
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
        },

        /**
         * Destroys current instance along with all of its' children.
         * @param {Boolean} skipUpdate - skip collection update when element to be destroyed.
         */
        destroy: function (skipUpdate) {
            _.each(this.plugins, function (plugin) {
                if (plugin.instance && plugin.instance.destroy) {
                    plugin.instance.destroy();
                }
            });

            if (this.editor) {
                this.editor.toTextArea();
            }

            return this._super(skipUpdate);
        }
    });
});
