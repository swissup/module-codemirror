define([
    'jquery',
    'Swissup_Codemirror/js/loadCss',
    'Swissup_Codemirror/js/codemirror/addon/display/fullscreen'
], function ($, loadCss) {
    'use strict';

    loadCss('js/codemirror/addon/display/fullscreen.css');

    /**
     * @param {Object} editor
     * @param {Boolean} flag
     */
    function toggleFullscreenClassForParents(editor, flag) {
        var parent = $(editor.getWrapperElement()),
            tagName;

        do {
            if (flag) {
                parent = parent.offsetParent();
            } else {
                parent = parent.closest('.cm-fullscreen-parent');
            }

            parent.toggleClass('cm-fullscreen-parent', flag);
            tagName = parent.length ? parent.get(0).tagName.toLowerCase() : 'html';
        } while (['html', 'body'].indexOf(tagName) === -1);
    }

    /**
     * @param {Object} editor
     */
    function toggleFullscreen(editor, flag) {
        if (flag === undefined) {
            flag = !editor.getOption('fullScreen');
        }

        toggleFullscreenClassForParents(editor, flag);

        editor.setOption('fullScreen', flag);

        setTimeout(function () {
            editor.refresh();
        }, 500);
    }

    /**
     * @param {Object} editor
     */
    function exitFullscreen(editor) {
        toggleFullscreen(editor, false);
    }

    return function (component) {
        component.editor.setOption('extraKeys', {
            'F11': toggleFullscreen,
            'Esc': exitFullscreen
        });
    };
});
