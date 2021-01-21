define([
    'jquery'
], function ($) {
    'use strict';

    var _isMinificationEnabled;

    /**
     * Is CSS minification enabled
     *
     * @param  {String}  minficationPostfix
     * @return {Boolean}
     */
    function isMinificationEnabled(minficationPostfix) {
        var url;

        if (typeof _isMinificationEnabled === 'undefined') {
            url = document.createElement('a');
            url.href = require.toUrl('');
            _isMinificationEnabled = true;
            $('link[type="text/css"][href^="' + url.origin + '"]').each(function () {
                var href = $(this).attr('href'),
                    deployed = href.indexOf('/_cache/merged/') > 0 || href.match(/[a-z]{2}_[A-Z]{2}/);

                if (!deployed) {
                    return;
                }

                if (href.indexOf(minficationPostfix) < 0) {
                    _isMinificationEnabled = false;

                    return false;
                }
            });
        }

        return _isMinificationEnabled;
    }

    return function (url) {
        var link = document.createElement('link');

        if (isMinificationEnabled('.min.css')) {
            url = url.replace('.css', '.min.css');
        }

        link.type = 'text/css';
        link.rel = 'stylesheet';
        link.href = require.toUrl('Swissup_Codemirror/' + url);
        document.getElementsByTagName('head')[0].appendChild(link);
    };
});
