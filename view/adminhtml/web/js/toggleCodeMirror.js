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

            // console.log(container);
            // console.log($('.CodeMirror', container).get(0));
            $('.CodeMirror', container).each(function () {
                var editor = this.CodeMirror;

                if (editor) {
                    editor.setOption('readOnly', checkbox.checked ? 'nocursor' : false);
                }
            });

            return result;
        }
    );
});
