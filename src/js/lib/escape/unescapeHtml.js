/*jslint browser:true, devel:true, nomen:true*/
/*global define*/

/**
 * Unescapes HTML.
 *
 * @author André Cruz <andremiguelcruz@msn.com>
 */
define(function () {

    'use strict';

    /**
     * Unescapes any escaped html.
     *
     * @param {String} str The string containing the html
     *
     * @return {String} The unescaped html
     */
    function unescapeHTML(str) {
        return str.replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&amp;/g, "&").replace(/&#39;/g, "'").replace(/&quot;/g, '"');
    }

    return unescapeHTML;
});
