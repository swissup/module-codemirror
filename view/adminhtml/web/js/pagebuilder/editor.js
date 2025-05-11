define([
    'jquery',
    'Magento_PageBuilder/js/form/element/html-code',
    'Swissup_Codemirror/js/form/element/codemirror-strategy',
    'Swissup_Codemirror/js/pagebuilder/html-code-fixes'
], function ($, HtmlCode, strategy) {
    'use strict';

    return HtmlCode.extend($.extend(true, {}, strategy, {
        defaults: {
            elementTmpl: 'Swissup_Codemirror/pagebuilder/editor'
        }
    }));
});
