define([
    'jquery',
    'underscore',
    'ko',
    'mage/utils/wrapper',
    'mage/translate'
], function ($, _, ko, wrapper, $t) {
    'use strict';

    var iconDisabled = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M9.504 1.132a1 1 0 01.992 0l1.75 1a1 1 0 11-.992 1.736L10 3.152l-1.254.716a1 1 0 11-.992-1.736l1.75-1zM5.618 4.504a1 1 0 01-.372 1.364L5.016 6l.23.132a1 1 0 11-.992 1.736L4 7.723V8a1 1 0 01-2 0V6a.996.996 0 01.52-.878l1.734-.99a1 1 0 011.364.372zm8.764 0a1 1 0 011.364-.372l1.733.99A1.002 1.002 0 0118 6v2a1 1 0 11-2 0v-.277l-.254.145a1 1 0 11-.992-1.736l.23-.132-.23-.132a1 1 0 01-.372-1.364zm-7 4a1 1 0 011.364-.372L10 8.848l1.254-.716a1 1 0 11.992 1.736L11 10.58V12a1 1 0 11-2 0v-1.42l-1.246-.712a1 1 0 01-.372-1.364zM3 11a1 1 0 011 1v1.42l1.246.712a1 1 0 11-.992 1.736l-1.75-1A1 1 0 012 14v-2a1 1 0 011-1zm14 0a1 1 0 011 1v2a1 1 0 01-.504.868l-1.75 1a1 1 0 11-.992-1.736L16 13.42V12a1 1 0 011-1zm-9.618 5.504a1 1 0 011.364-.372l.254.145V16a1 1 0 112 0v.277l.254-.145a1 1 0 11.992 1.736l-1.735.992a.995.995 0 01-1.022 0l-1.735-.992a1 1 0 01-.372-1.364z" clip-rule="evenodd" /></svg>',
        iconEnabled = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path d="M11 17a1 1 0 001.447.894l4-2A1 1 0 0017 15V9.236a1 1 0 00-1.447-.894l-4 2a1 1 0 00-.553.894V17zM15.211 6.276a1 1 0 000-1.788l-4.764-2.382a1 1 0 00-.894 0L4.789 4.488a1 1 0 000 1.788l4.764 2.382a1 1 0 00.894 0l4.764-2.382zM4.447 8.342A1 1 0 003 9.236V15a1 1 0 00.553.894l4 2A1 1 0 009 17v-5.764a1 1 0 00-.553-.894l-4-2z" /></svg>',
        builtInDirectives = {};

    builtInDirectives.widget = {
        re: '{{(widget type|block class)=["\'](?<label>.*?)["\'].*?}}',

        /**
         * @param {Object} match
         * @return {String}
         */
        placeholder: function (match) {
            var label = match.groups.label;

            label = label.replace('\\Block\\', '\\');
            label = label.replace('\\Widgets\\', '\\');
            label = label.replace('\\Widget\\', '\\');
            label = label.replace('\\Adminhtml\\', '\\');
            label = label.substr(label.indexOf('\\') + 1);

            return '<span>' + label + '</span>';
        }
    };

    builtInDirectives.config = {
        re: '{{config path=["\'](?<label>.*?)["\'].*?}}',

        /**
         * @param {Object} match
         * @return {String}
         */
        placeholder: function (match) {
            return '<span>config: ' + match.groups.label + '</span>';
        }
    };

    return function (component) {
        var status = ko.observable(),
            cm = component.editor;

        /**
         * @param {Object} event
         * @return {null|Object}
         */
        function findTextMark(event) {
            var marks = cm.doc.findMarksAt(cm.coordsChar({
                    left: event.pageX,
                    top: event.pageY
                }));

            return _.find(marks, function (item) {
                return item.widgetNode;
            });
        }

        cm.setOption('configureMouse', function (instance, repeat, event) {
            var mark = findTextMark(event);

            if (!mark) {
                return {};
            }

            return {
                /**
                 * @return {Object}
                 */
                unit: function () {
                    return mark.find();
                }
            };
        });

        component.plugin('contextmenu').then(function (contextmenu) {
            contextmenu.addItem({
                label: 'Parse directives',

                /**
                 * Toggle directives parsing
                 */
                handler: function () {
                    status(!status());
                }
            });
        });

        component.plugin('toolbar').then(function (toolbar) {
            var //buttonToggle,
                useWidget = _.find(component.editorConfig.directives, function (directive) {
                    return directive.type === 'widget';
                });

            if (useWidget) {
                toolbar.addButton({
                    label: $t('Insert Widget'),

                    /**
                     * Show insert widget popup
                     */
                    handler: function () {
                        console.log('asd');
                    }
                });
            }

            // buttonToggle = toolbar.addButton({
            //     class: 'icon',

            //     /**
            //      * Toggle directives parsing
            //      */
            //     handler: function () {
            //         status(!status());
            //     }
            // });

            // status.subscribe(function (flag) {
            //     if (flag) {
            //         buttonToggle.attr('title', $t('Mode: Parsed HTML')).html(iconEnabled);
            //     } else {
            //         buttonToggle.attr('title', $t('Mode: Raw HTML')).html(iconDisabled);
            //     }
            // });
        });

        /**
         * @return {Array}
         */
        function getDirectives() {
            var directives = [];

            _.each(component.editorConfig.directives, function (directive) {
                if (!directive.type) {
                    directives.push(directive);
                } else if (builtInDirectives[directive.type]) {
                    directives.push(builtInDirectives[directive.type]);
                }
            });

            return directives;
        }

        /**
         * Refresh document
         */
        function refresh() {
            var value = cm.getValue(),
                cursor = cm.getCursor(),
                match, from, to, placeholder, el;

            if (!status()) {
                return;
            }

            _.each(getDirectives(), function (directive) {
                var re = new RegExp(directive.re, 'g');

                while ((match = re.exec(value)) !== null) {
                    from = cm.doc.posFromIndex(match.index);
                    to = cm.doc.posFromIndex(match.index + match[0].length);

                    if (cursor.line > from.line && cursor.line < to.line) {
                        continue; // cursor is inside multiline directive
                    }

                    if (cursor.line === from.line && cursor.ch > from.ch &&
                        cursor.line === to.line && cursor.ch < to.ch
                    ) {
                        continue; // cursor is inside selection
                    }

                    placeholder = directive.placeholder;

                    if (typeof placeholder === 'function') {
                        placeholder = placeholder(match);
                    }

                    if (typeof placeholder === 'string') {
                        el = $(placeholder).attr('title', match[0]).get(0);
                    }

                    cm.doc.markText(from, to, {
                        replacedWith: el,
                        handleMouseEvents: true
                    });
                }
            });
        }

        status.subscribe(function (flag) {
            if (flag) {
                refresh();
            } else {
                _.each(cm.doc.getAllMarks(), function (textMark) {
                    textMark.clear();
                });
            }
        });

        cm.on('changes', _.bind(cm.operation, cm, refresh));
        cm.on('dblclick', function (instance, event) {
            var mark = findTextMark(event);

            if (!mark) {
                return;
            }

            mark.clear();
        });
        // cm.on('mousedown', function (instance, event) {
        //     var mark = findTextMark(event),
        //         range;

        //     if (!mark || cm.hasFocus()) {
        //         return;
        //     }

        //     event.preventDefault(); // fix not working dblclick event when matchtags+html modes are used.

        //     cm.focus();
        //     range = mark.find();
        //     cm.doc.setSelection(range.from, range.to);
        // });

        status(true);

        return {
            /**
             * Enable directive parsing
             */
            enable: function () {
                status(true);
            },

            /**
             * Disable directive parsing
             */
            disable: function () {
                status(false);
            }
        };
    };
});
