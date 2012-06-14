/*/*jslint browser:true, devel:true, nomen:true*/
/*globals define*/

/**
 * Container class.
 *
 * @author your name <youremail@domain.com>
 */
define(['classify/Class'], function (Class) {

    'use strict';

    var ContainerClass,
        Container = {

            _params: {},
            _services: {},

            /**
            *
            */
            initialize: function () {
                if (!this.$self()._initializing) {
                    throw new Error('use getInstance() instead.');
                }
            },

            /**
            *
            */
            get: function(key) {
                return this._services[key] != null ? this._services[key] : null;
            },

            /**
            *
            */
            set: function(key, value) {
                this._services[key] = value;
            },

            /**
            *
            */
            getParameter: function(key) {
                return this._params[key] != null ? this._params[key] : null;
            },

            /**
            *
            */
            setParameter: function(key, value) {
                this._params[key] = value;
            },

            /**
             *
             */
            clear: function () {
                this._params = {};
                this._services = {};
            },

            $statics: {
                _instance: null,
                _initializing: true,

                /**
                 *
                 */
                getInstance: function () {
                    if (this._instance == null) {
                        console.log('Creating container..');
                        this._initializing = true;
                        this._instance = new ContainerClass();
                        this._initializing = false;
                    }

                    return this._instance;
                }
            }
        };

    ContainerClass = new Class(Container);

    return ContainerClass;
});