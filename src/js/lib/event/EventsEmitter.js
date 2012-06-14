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
define([
    'classify/AbstractClass',
    'amd-utils/lang/toArray',
    'amd-utils/object/forOwn'
], function (AbstractClass, toArray, forOwn) {

    'use strict';

    var EventsEmitter = {
        $name: 'EventsEmitter',

        __events: {},

        // public methods

        /**
         * Adds a new event listener.
         * If the listener is already attached, it won't get duplicated.
         *
         * If the event name string contains a period (.) character, then the event is namespaced.
         * The period character separates the event from its namespace.
         * For example, given click.sidebar will be decoded to click being the event name and sidebar its namespace.
         *
         * Namespacing allows us to unbind or trigger some events of a type without affecting others.
         *
         * @param {String}   name      The event name
         * @param {Function} fn        The function
         * @param {Object}   [context] The context in which the function will be executed
         *
         * @return {mixed} The instance itself to allow chaining
         */
        addListener: function (name, fn, context) {
            var info = this.__getEventInfo(name),
                events = this.__events[info.name] = this.__events[info.name] || [];

            if (!info.name) {
                throw new Error('Please specify the event name.');
            }

            if (this.__getListenerIndex(info.name, fn) === -1) {
                events.push({fn: fn, context: context, namespace: info.namespace });
            }

            return this;
        },

        /**
         * Removes an existent event listener.
         * If the event is not namespaced then only the specified listener of the given event name will be removed.
         * If the event name is namespaced then all the listeners of that namespace related to the name will be
         * removed.
         *
         * @param {String}   name The event name
         * @param {Function} [fn] The function
         *
         * @return {mixed} The instance itself to allow chaining
         */
        removeListener: function (name, fn) {
            var info = this.__getEventInfo(name),
                index;

            if (this.__events[info.name]) {
                if (info.namespace === null) {
                    index = this.__getListenerIndex(info.name, fn);
                    if (index !== -1) {
                        this.__events[info.name].splice(index, 1);
                    }
                } else {
                    this.__removeNamespacedEvents(this.__events[info.name], info.namespace);
                }
            }

            return this;
        },

        /**
         * Removes all listeners of the given name.
         * One can specify the namespace in the event name in order to only remove the listeners marked as
         * the same namespace.
         * Also, *.sidebar results in removing all the listeners within the sidebar namespace, leaving others intact.
         *
         * @param {String} [name] The event name
         *
         * @return {mixed} The instance itself to allow chaining
         */
        removeListeners: function (name) {
            var info = name ? this.__getEventInfo(name) : null;

            if (info) {
                if (info.name) {
                    if (this.__events[info.name]) {
                        if (info.namespace === null) {
                            delete this.__events[info.name];
                        } else {
                            this.__removeNamespacedEvents(this.__events[info.name], info.namespace);
                        }
                    }
                } else if (info.namespace !== null) {
                    forOwn(this.__events, function (value, key) {
                        this.__removeNamespacedEvents(this.__events[key], info.namespace);
                    }, this);
                }
            } else {
                this.__events = {};
            }

            return this;
        },

        // protected methods

        /**
         * Fires an event.
         *
         * @param {String}   name The event name
         * @param {...mixed} args The arguments to pass to each listener
         *
         * @return {mixed} The instance itself to allow chaining
         */
        _fireEvent: function (name, args) {
            var events = this.__events[name],
                params = toArray(arguments),
                x,
                length,
                ret;

            params.shift();

            if (events) {
                length = events.length;

                for (x = 0; x < length; x += 1) {
                    try {
                        ret = events[x].fn.apply(events[x].context || this, params);
                        if (ret === false) {
                            break;
                        }
                    } finally {}
                }
            }

            return this;
        },

        // private methods

        /**
         * Gets a listener index.
         *
         * @param {String}   name The event name
         * @param {Function} fn   The function
         *
         * @return {Number} The index of the listener if found or -1 if not found
         */
        __getListenerIndex: function (name, fn) {
            var events = this.__events[name],
                x;

            if (events) {
                for (x = events.length - 1; x >= 0; x -= 1) {
                    if (events[x].fn === fn) {
                        return x;
                    }
                }
            }

            return -1;
        },

        /**
         * Parses the event name, returning an object with the event name and namespace.
         *
         * @return {Object} An object with the name and namespace of the event.
         */
        __getEventInfo: function (name) {
            var pos = name.indexOf('.');

            if (pos === -1) {
                return {
                    name: name === '*' ? null : name,
                    namespace: null
                };
            }

            return {
                name: name.substr(0, pos),
                namespace: name.substr(pos + 1)
            };
        },

        /**
         * Removes all the listeners with the specified namespace.
         *
         * @param {Array}  events    The array of listeners
         * @param {String} namespace The namespace
         */
        __removeNamespacedEvents: function (events, namespace) {
            var x;

            for (x = events.length - 1; x >= 0; x -= 1) {
                if (events[x].namespace === namespace) {
                    events.splice(x, 1);
                }
            }
        }
    };

    return new AbstractClass(EventsEmitter);
});
