/*jslint browser:true, devel:true, nomen:true*/
/*globals define*/

/**
 * ApplicationController.
 *
 * @author André Cruz <andremiguelcruz@msn.com>
 * @author Marco Oliveira <marcooliveira@ua.pt>
 */
define([
    'classify/Class',
    'BaseController',
    'jquery',
    'amd-utils/object/mixIn',
    './ApplicationView'
], function (Class, BaseController, $, mixIn, ApplicationView) {

    'use strict';

    var ApplicationController = {
        $name: 'ApplicationController',
        $extends: BaseController,

        _config: {
            environment: 'dev',
            debug:        true
        },

        _view: null,


        /**
         * Constructor.
         *
         * @param {object} config An object
         */
        initialize: function (config) {
            mixIn(this._config, config);

            this._container.setParameter('debug', this._config.debug);
            this._container.setParameter('environment', this._config.environment);

            this._view = new ApplicationView($(document.body));

            this._readHash();

            console.log('Application Controller initialized');
        },

        /**
         * {@inheritDoc}
         */
        destroy: function () {
            this._view.destroy();

            this._container.clear();

            this.$super();
        },

        /**
         *
         */
        _readHash: function () {
            // TODO: read hash and initialize the modules according to the routing
        }
    };

    return new Class(ApplicationController);
});