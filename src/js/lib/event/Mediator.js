/*jslint browser:true, devel:true, nomen:true*/
/*globals define*/

/**
 * EventsEmitter abstract class.
 *
 * This class is declared as abstract because it does not work on its own.
 * Instead it should be mixed in to provide pub/sub mechanism to any class.
 *
 * @author André Cruz <andremiguelcruz@msn.com>
 */
define(['classify/Class', './EventsEmitter'], function (Class, EventsEmitter) {

    'use strict';

    var MediatorClass,
        Mediator = {

            $name: 'Mediator',
            $extends: EventsEmitter,

            /**
             * Class constructor.
             */
            initialize: function () {
                if (!this.$self()._initializing) {
                    throw new Error('This is a singleton, use getInstance() instead.');
                }
            },

            /**
            * Fires an event.
            *
            * @param {String}   name The event name
            * @param {...mixed} args The arguments to pass to each listener
            *
            * @return {mixed} The instance itself to allow chaining
            */
            fireEvent: function (name, args) {
                return this._fireEvent.apply(this, arguments);
            },

            $statics: {
                _instance: null,
                _initializing: false,

                /**
                 * Gets the shared instance.
                 *
                 * @return Mediator The mediator
                 */
                getInstance: function () {
                    if (this._instance === null) {
                        this._initializing = true;
                        try {
                            this._instance = new MediatorClass();
                        } finally {}
                        this._initializing = false;
                    }

                    return this._instance;
                }
            }
        };

    MediatorClass = new Class(Mediator);

    return MediatorClass;
});
