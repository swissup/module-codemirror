define([
    'jquery',
    'uiRegistry'
], function ($, registry) {
    'use strict';

    return function (component) {
        var menu = $('<div class="CodeMirror-menu"></div>'),
            cm = component.editor;

        $(document.body).append(menu);

        /**
         * @param {Object} itemConfig
         */
        function addItem(itemConfig) {
            var item = $('<label>' + itemConfig.label + '</label>');

            if (itemConfig.icon) {
                item.prepend('<span class="cm-icon">' + itemConfig.icon + '</span>');
            }

            if (itemConfig.class) {
                item.addClass(itemConfig.class);
            }

            if (itemConfig.title) {
                item.attr('title', itemConfig.title);
            }

            if (itemConfig.target) {
                registry.get(component.parentName + '.' + itemConfig.target, function (element) {
                    item.attr('for', element.uid);
                });
            } else if (itemConfig.handler) {
                item.click(itemConfig.handler);
            }

            menu.append(item.get(0));

            return item;
        }

        $.each(component.editorConfig.contextmenu || [], function () {
            addItem(this);
        });

        cm.on('contextmenu', function (instance, event) {
            event.preventDefault();

            menu.addClass('shown')
                .css({
                    left: event.pageX + 2,
                    top: event.pageY - 16
                });
        });

        $(document.body).click(function () {
            menu.removeClass('shown');
        });

        return {
            addItem: addItem,

            /**
             * [destroy description]
             */
            destroy: function () {
                menu.remove();
            }
        };
    };
});
