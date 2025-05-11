define([
    'jquery',
    'Magento_PageBuilder/js/form/element/html-code',
    'Swissup_Codemirror/js/form/element/codemirror-strategy',
    'mage/utils/wrapper',
    'mage/adminhtml/browser',
    'mage/adminhtml/wysiwyg/widget'
], function ($, HtmlCode, strategy, wrapper) {
    'use strict';

    var insertContentMixin = function (o, textarea, content) {
        if (!textarea.nextSibling || !textarea.nextSibling.CodeMirror) {
            return o(textarea, content);
        }

        textarea.nextSibling.CodeMirror.doc.replaceSelection(content);
    }

    // Fix for "Insert Variable" and "Insert Widget" buttons
    if (typeof updateElementAtCursor !== undefined) {
        updateElementAtCursor = wrapper.wrap(updateElementAtCursor, insertContentMixin);
    }

    // Fix for "Insert Image" button
    $(document.body).on('mediabrowsercreate', function (event) {
        var browser = $(event.target).data('mediabrowser');

        if (browser) {
            browser.insertAtCursor = wrapper.wrap(browser.insertAtCursor, insertContentMixin);
        }
    });

    return HtmlCode.extend($.extend(true, {}, strategy, {
        defaults: {
            elementTmpl: 'Swissup_Codemirror/pagebuilder/editor'
        }
    }));
});
