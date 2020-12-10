define([
    'jquery',
    'underscore'
], function ($, _) {
    'use strict';

    return function (component) {
        var editor = component.editor,
            wrapperElement = editor.getWrapperElement();

        $(wrapperElement).resizable({
            handles: 's',
            resize: _.debounce(editor.refresh.bind(editor), 100),
            zIndex: 900
        });

        // Make full height on double click.
        $('.ui-resizable-handle', wrapperElement)
            .dblclick(function () {
                editor.setSize(null, editor.doc.height + 12);
                editor.refresh();
            });
    };
});
