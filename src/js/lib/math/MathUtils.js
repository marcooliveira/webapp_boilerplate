/*jslint browser:true, devel:true, nomen:true*/
/*global define, google*/

/**
 * Math utils.
 *
 * @author André Cruz <andremiguelcruz@msn.com>
 * @author Marco Oliveira <marcooliveira@ua.pt>
 */
define([
    'classify/Class'
], function (Class) {

    'use strict';

    var MathUtils = {
        $name: 'MathUtils',

        /**
         *
         */
        initialize: function () {
            console.log('MathUtils initialized');
        },

        $statics: {
            rand: function(min, max) {
                return min + (max - min) * Math.random();
            }
        }

    };

    return new Class(MathUtils);
});