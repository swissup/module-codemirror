/* global MediabrowserUtility, widgetTools, MagentovariablePlugin */
define([
    'jquery',
    'Swissup_Codemirror/js/form/element/editor',
    'Swissup_Codemirror/js/codemirror/lib/codemirror',
    'mage/utils/wrapper',
    'mage/adminhtml/browser',
    'mage/adminhtml/wysiwyg/widget'
], function ($, Editor, CodeMirror, wrapper) {
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

    return Editor.extend({
        defaults: {
            elementTmpl: 'Swissup_Codemirror/pagebuilder/editor'
        },

        /**
         * Click event for Insert Widget Button
         */
        clickInsertWidget: function () {
            return widgetTools.openDialog(
                this.widgetUrl.replace('HTML_ID_PLACEHOLDER', this.uid)
            );
        },

        /**
         * Click event for Insert Image Button
         */
        clickInsertImage: function () {
            return MediabrowserUtility.openDialog(
                this.imageUrl.replace('HTML_ID_PLACEHOLDER', this.uid)
            );
        },

        /**
         * Click event for Insert Variable Button
         */
        clickInsertVariable: function () {
            return MagentovariablePlugin.loadChooser(
                this.variableUrl,
                this.uid
            );
        }
    });
});
