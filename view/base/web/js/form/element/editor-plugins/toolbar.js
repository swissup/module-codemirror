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

            registry.get(component.parentName + '.' + buttonConfig.target, function (element) {
                button.attr('for', element.uid);
            });

            toolbar.append(button.get(0));
        }

        $.each(component.editorConfig.buttons || [], function () {
            addButton(this);
        });

        return {
            addButton: addButton
        };
    };
});
