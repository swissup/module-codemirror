define([
    'jquery',
    'Magento_Ui/js/form/element/textarea',
    'Swissup_Codemirror/js/form/element/codemirror-strategy'
], function ($, Textarea, strategy) {
    'use strict';

    return Textarea.extend($.extend(true, {}, strategy, {
        defaults: {
            elementTmpl: 'Swissup_Codemirror/form/element/editor',
        },
    }));
});
