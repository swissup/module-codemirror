define([
    'jquery',
    './utils/item-builder'
], function ($, builder) {
    'use strict';

    return function (component) {
        var menu = $('<div class="CodeMirror-menu"></div>'),
            cm = component.editor;

        $(document.body).append(menu);

        /**
         * @param {Object} itemConfig
         */
        function addItem(itemConfig) {
            var item = builder.build(itemConfig, component);

            menu.append(item.get(0));

            return item;
        }

        $.each(component.editorConfig.contextmenu || [], function () {
            if (this.config) {
                require([this.config], function (itemConfig) {
                    addItem(itemConfig);
                });
            } else {
                addItem(this);
            }
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
