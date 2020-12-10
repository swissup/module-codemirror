define([
    'jquery'
], function ($) {
    'use strict';

    return function (component) {
        var textarea = component.editor.getInputField(),
            uiField = $(textarea).closest('.field, .admin__field').get(0);

        // this section is for backend config
        (new MutationObserver(function () {
            var td;

            if ($(textarea).closest('.section-config')) {
                td = $(textarea).closest('tr').find('td');

                if (textarea.style.display === 'none') {
                    td.addClass('ignore-validate');
                } else {
                    td.removeClass('ignore-validate');
                }
            }

            if (textarea.style.display !== 'none' && component.editor) {
                component.editor.refresh();
            }
        })).observe(textarea, {
            attributes: true
        });

        // this section is for ui components (backend, frontend)
        if (uiField) {
            (new MutationObserver(function () {
                if (uiField.style.display !== 'none' && component.editor) {
                    component.editor.refresh();
                }
            })).observe(uiField, {
                attributes: true
            });
        }
    };
});
