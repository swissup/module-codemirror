define([
    'jquery',
    'mage/utils/wrapper'
], function ($, wrapper) {
    'use strict';

    // wrap toggle function to enable/disable editor
    window.toggleValueElements = wrapper.wrap(
        window.toggleValueElements,
        function (
            callOriginal, checkbox, container, excludedElements, checked
        ) {
            var result = callOriginal(
                checkbox,
                container,
                excludedElements,
                checked
            );

            $('.CodeMirror', container).each(function () {
                var editor = this.CodeMirror;

                if (editor) {
                    editor.setOption('readOnly', checkbox.checked ? 'nocursor' : false);
                }
            });

            return result;
        }
    );

    window.Fieldset.applyCollapse = wrapper.wrap(
        window.Fieldset.applyCollapse,
        function (callOriginal, elementId) {
            var result = callOriginal(elementId),
                $fieldset = $('#' + elementId);

            if ($fieldset.is(':visible')) {
                $fieldset.find('.CodeMirror').each(function () {
                    var editor = this.CodeMirror;

                    if (editor) {
                        editor.refresh();
                    }
                });
            }

            return result;
        }
    );
});
