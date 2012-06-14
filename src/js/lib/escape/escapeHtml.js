/*jslint browser:true, devel:true, nomen:true*/
/*global define*/

/**
 * Escapes HTML.
 *
 * @author André Cruz <andremiguelcruz@msn.com>
 */
define(function () {

    'use strict';

    /**
     * Escapes any html.
     *
     * @param {String} str The string containing the html
     *
     * @return {String} The escaped html
     */
    function escapeHTML(str) {
        return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/'/g, "&#39;").replace(/"/g, "&quot;");
    }

    return escapeHTML;
});
