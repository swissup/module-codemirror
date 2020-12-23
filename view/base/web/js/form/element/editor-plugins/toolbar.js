define([
    'jquery',
    'uiRegistry'
], function ($, registry) {
    'use strict';

    return function (component) {
        var toolbar = $('<div class="CodeMirror-toolbar"></div>');

        $(component.editor.getWrapperElement()).before(toolbar);

        /**
         * @param {Object} buttonConfig
         */
        function addButton(buttonConfig) {
            var button = $('<label>' + buttonConfig.label + '</label>');

            if (buttonConfig.class) {
                button.addClass(buttonConfig.class);
            }

            if (buttonConfig.title) {
                button.attr('title', buttonConfig.title);
            }

            if (buttonConfig.target) {
                registry.get(component.parentName + '.' + buttonConfig.target, function (element) {
                    button.attr('for', element.uid);
                });
            } else if (buttonConfig.handler) {
                button.click(buttonConfig.handler);
            }

            toolbar.append(button.get(0));

            return button;
        }

        $.each(component.editorConfig.buttons || [], function () {
            if (this.config) {
                require([this.config], function (buttonConfig) {
                    addButton(buttonConfig);
                });
            } else {
                addButton(this);
            }
        });

        return {
            addButton: addButton,

            /**
             * [destroy description]
             */
            destroy: function () {
                toolbar.remove();
            }
        };
    };
});
