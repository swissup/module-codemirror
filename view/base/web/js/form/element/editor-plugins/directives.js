define([
    'jquery',
    'underscore',
    'ko',
    'mage/utils/wrapper',
    'mage/translate'
], function ($, _, ko, wrapper, $t) {
    'use strict';

    var iconCheck = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" /></svg>',
        builtInDirectives = {};

    builtInDirectives.widget = {
        re: '{{(widget type|block class|block id)=["\'](?<label>.+?)["\'].*?}}',

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
        re: '{{config path=["\'](?<label>.+?)["\'].*?}}',

        /**
         * @param {Object} match
         * @return {String}
         */
        placeholder: function (match) {
            return '<span>config: ' + match.groups.label + '</span>';
        }
    };

    builtInDirectives.url = {
        re: '{{(store url|store direct_url|media url|view url)=["\'](?<label>.+?)["\'].*?}}',

        /**
         * @param {Object} match
         * @return {String}
         */
        placeholder: function (match) {
            return '<span>' + match.groups.label + '</span>';
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
            var item = contextmenu.addItem({
                label: $t('Parse directives'),
                icon: iconCheck,
                class: status() ? 'active' : '',

                /**
                 * Toggle directives parsing
                 */
                handler: function () {
                    status(!status());
                }
            });

            status.subscribe(function (flag) {
                item.toggleClass('active', flag);
            });
        });

        /**
         * @return {Array}
         */
        function getDirectives() {
            var directives = [];

            _.each(component.editorConfig.directives, function (directive) {
                if (directive.enabled === false) {
                    return;
                }

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
