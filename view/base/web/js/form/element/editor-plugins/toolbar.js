define([
    'jquery',
    './utils/item-builder'
], function ($, builder) {
    'use strict';

    return function (component) {
        var toolbar = $('<div class="CodeMirror-toolbar"></div>');

        $(component.editor.getWrapperElement()).before(toolbar);

        /**
         * @param {Object} buttonConfig
         */
        function addButton(buttonConfig) {
            var button = builder.build(buttonConfig, component);

            toolbar.append(button.get(0));

            return button;
        }

        $.each(component.editorConfig.buttons || [], function () {
            if (this.enabled === false) {
                return;
            }

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
