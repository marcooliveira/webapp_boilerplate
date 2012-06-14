/*jslint browser:true, devel:true, nomen:true*/
/*globals define*/

/**
 * BaseView class.
 *
 * @author André Cruz <andremiguelcruz@msn.com>
 * @author Marco Oliveira <me@marcooliveira.com>
 */
define([
    'classify/AbstractClass',
    'lib/event/EventsEmitter',
    'jquery'
], function (AbstractClass, EventsEmitter, $) {

    'use strict';

    var BaseView = {
        $name: 'BaseView',
        $borrows: EventsEmitter,

        _element: null,

        /**
         * Constructor.
         */
        initialize: function (element) {
            this._element = $(element);

            if (!this._element.length) {
                throw new Error('Invalid element passed to the view constructor.');
            }
        },

        /**
         * Get the underlying view element.
         *
         * @return {Object} The jquery object that maps to the dom element.
         */
        getElement: function () {
            return this._element;
        },

        /**
         * Destroys the view.
         */
        destroy: function () {
            this.removeListeners();
            this._element.children().remove();  // At this point, the element should have no elements! But if it does, then they will be all removed
        }
    };

    return new AbstractClass(BaseView);
});