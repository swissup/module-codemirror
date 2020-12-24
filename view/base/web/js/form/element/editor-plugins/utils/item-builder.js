define([
    'jquery',
    'uiRegistry'
], function ($, registry) {
    'use strict';

    return {
        /**
         * @param {Object} config
         * @return {jQuery}
         */
        build: function (config, cmp) {
            var item = $('<label>' + config.label + '</label>');

            if (config.icon) {
                item.prepend('<span class="cm-icon">' + config.icon + '</span>');
            }

            if (config.class) {
                item.addClass(config.class);
            }

            if (config.title) {
                item.attr('title', config.title);
            }

            item.data('component', cmp);

            if (config.target) {
                registry.get(cmp.parentName + '.' + config.target, function (element) {
                    item.attr('for', element.uid);
                });
            } else if (config.handler) {
                item.click(config.handler);
            }

            return item;
        }
    };
});
