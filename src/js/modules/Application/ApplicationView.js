/*jslint browser:true, devel:true, nomen:true*/
/*global define*/

/**
 * ApplicationView class.
 *
 * @author André Cruz <andremiguelcruz@msn.com>
 * @author Marco Oliveira <marcooliveira@ua.pt>
 */
define([
    'classify/Class',
    'BaseView',
    'jquery',
    'doT',
    'text!templates/Application/layout.html'
], function (Class, BaseView, $, doT, layoutTemplate) {

    'use strict';

    var ApplicationView = {
        $name: 'ApplicationView',
        $extends: BaseView,

        _element: null,

        /**
         * Constructor.
         */
        initialize: function (element) {
            this._element = $(element);
            this._element.append($(doT.compile(layoutTemplate)()));
        },

        /**
         *
         */
        getElement: function () {
            return this._element;
        },


        /**
         * {@inheritDoc}
         */
        destroy: function () {
            //this._element.empty();

            this.$super();
        }
    };

    return new Class(ApplicationView);
});