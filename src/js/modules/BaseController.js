/*jslint browser:true, devel:true, nomen:true*/
/*globals define*/

/**
 * BaseController class.
 *
 * @author André Cruz <andremiguelcruz@msn.com>
 * @author Marco Oliveira <me@marcooliveira.com>
 */
define([
    'classify/AbstractClass',
    'lib/dependency_injection/Container',
    'lib/event/EventsEmitter',
    'lib/event/Mediator'
], function (AbstractClass, Container, EventsEmitter, Mediator) {

    'use strict';

    var BaseController = {
        $name: 'BaseController',
        $borrows: EventsEmitter,

        _container: Container.getInstance(),

        /**
         * Adds a broadcast event listener.
         *
         * @see EventsEmitter#addListener
         */
        addBroadcastListener: function (name, func, context) {
            Mediator.getInstance().addListener.apply(Mediator.getInstance(), arguments);
        },

        /**
         * Removes a broadcast event listener.
         *
         * @see EventsEmitter#removeListener
         */
        removeBroadcastListener: function (name, func) {
            Mediator.getInstance().removeListener.apply(Mediator.getInstance(), arguments);
        },

        /**
         * Removes several broadcast event listeners.
         *
         * @see EventsEmitter#removeListeners
         */
        removeBroadcastListeners: function (name) {
            Mediator.getInstance().removeListeners.apply(Mediator.getInstance(), arguments);
        },

        /**
         * Broadcasts an event.
         *
         * @see EventsEmitter#_fireEvent
         */
        fireBroadcastEvent: function (name, args) {
            Mediator.getInstance().fireEvent.apply(Mediator.getInstance(), arguments);
        },

        /**
         * Destroys the controller/module.
         */
        destroy: function () {
            this.removeListeners();
        }
    };

    return new AbstractClass(BaseController);
});