/*jslint browser:true, devel:true, nomen:true, forin:true*/
/*global define*/

/**
 * ApiRequest class.
 *
 * This class hides all the logic behind handling requests to the API.
 * It fires the following events:
 *
 * - 'success' -> If the request ended up successfully
 * - 'error'   -> If the request ended up with error
 * - 'complete -> When the request ends
 *
 * Note that when a request is aborted, none of the events will be fired.
 *
 * @author André Cruz <andremiguelcruz@msn.com>
 */
define([
    'classify/Class',
    'jquery',
    'lib/event/EventsEmitter',
    'amd-utils/lang/bind',
    'amd-utils/lang/isObject',
    'amd-utils/object/mixIn'
], function (Class, $, EventsEmitter, bind, isObject, mixIn) {

    'use strict';

    var ApiRequest = {
        $name: 'ApiRequest',
        $borrows: EventsEmitter,
        $statics: {
            nextId: 1
        },

        $constants: {
            ERR_500: '500',
            ERR_403: '403',
            ERR_400: '400',
            ERR_TIMEOUT: 'timeout',
            ERR_UNAUTHORIZED: 'unauthorized'
            //ERR_SESSION_INVALID: 'session_invalid',
        },

        _id: null,
        _url: null,
        _originalUrl: null,
        _request: null,
        _ignoreComplete: false,

        _options: {
            timeout: 15000,
            csrfTokenName: '_token'
        },

        /**
         * Constructor.
         *
         * @param {String} url        The url of the resource
         * @param {Object} [$options] The options to pass to the jQuery $.ajax call
         */
        initialize: function (url, $options) {
            this._id = this.$self().nextId;
            this.$self().nextId += 1;
            this._url = this._originalUrl = url;
            this._options = mixIn(this._options, $options || {});
        },

        // public methods

        /**
         * Get the request id of the request.
         * The ids are unique.
         *
         * @return {int} The request id
         */
        getId: function () {
            return this._id;
        },

        /**
         * Executes the request.
         *
         * @return {ApiRequest} The instance itself to allow chaining
         */
        execute: function () {
            if (!this._request) {
                this._request = $.ajax(this._url, this._options);
                this._request.done(bind(this._handleSuccess, this));
                this._request.fail(bind(this._handleError, this));
                this._request.always(bind(this._handleComplete, this));
            }

            return this;
        },

        /**
         * Cancels the request if is executing.
         *
         * @return {ApiRequest} The instance itself to allow chaining
         */
        abort: function () {
            if (this._request) {
                this._request.abort();
            }

            return this;
        },

        /**
         * Checks if the request is being executed.
         *
         * @return {Boolean} True if it is, false otherwise
         */
        isExecuting: function () {
            return !!this._request;
        },

        /**
         * Sets the underlying jQuery $.ajax data.
         * Also replaces placeholders present in the url in the form of {param}.
         *
         * @param {mixed} data The data
         *
         * @return {ApiRequest} The instance itself to allow chaining
         */
        setData: function (data) {
            var key,
                regExp,
                csrf;

            if (!data[this._options.csrfTokenName]) {
                csrf = (this._options.data && this._options.data[this._options.csrfTokenName] ? this._options.data[this._options.csrfTokenName] : null);
            }

            this._options.data = data;

            if (!data[this._options.csrfTokenName] && csrf !== null) {
                data[this._options.csrfTokenName] = csrf;
            }

            // TODO: the code bellow could be optimized by analyzing the url, searching for placeholders instead of using the keys of the data object
            // Handle placeholders
            for (key in data) {
                regExp = new RegExp('\\{' + key + '\\}', 'i');
                if (regExp.test(this._originalUrl)) {
                    this._url = this._originalUrl.replace(regExp, data[key]);
                    delete data[key];
                }
            }

            return this;
        },


        /**
         * Enable csrf protection.
         *
         * @param {String} csrf The csrf token value
         *
         * @return {ApiRequest} The instance itself to allow chaining
         */
        enableCsrfProtection: function (csrf) {
            if (!this._options.data) {
                this._options.data = {};
            }
            this._options.data[this._options.csrfTokenName] = csrf;

            return this;
        },

        /**
         * Disable csrf protection.
         *
         * @return {ApiRequest} The instance itself to allow chaining
         */
        disableCsrfProtection: function () {
            if (this._options.data) {
                delete this._options.data[this._options.csrfTokenName];
            }

            return this;
        },

        /**
         * {@inheritDoc}
         */
        fireEvent: function (event, args) {
            return this._fireEvent.apply(this, arguments);
        },

        /**
         * Destroys the instance.
         */
        destroy: function () {
            this.abort();
            this.removeListeners();
        },

        // protected methods

        /**
         * Handles the success of the request.
         *
         * @param {mixed} data The response data
         */
        _handleSuccess: function (data) {
            if (!isObject(data)) {
                this._fireEvent('error', { code: this.$self().ERR_500 });
                return;
            }

            this._request = null;
            if (!data.status) {
                this._fireEvent('error', { code: data.error.code, message: data.error.message, extra: data.error.extra }, this);
            } else {
                this._fireEvent('success', data.content, this);
            }
        },

        /**
         * Handles the failure of the request.
         *
         * @param {Object} jqXHR      The jQuery jqXHR object
         * @param {String} statusText The status as a string
         * @param {String}  exception An exception if it was thrown
         */
        _handleError: function (jqXHR, statusText, exception) {
            var status,
                message;

            switch (statusText) {
            case 'abort':
                this._ignoreComplete = true;
                return;
            case 'timeout':
                status = this.$self().ERR_TIMEOUT;
                message = 'The request timedout after ' + (this._options.timeout / 1000) + ' seconds.';
                break;
            default:
                status = jqXHR.status;
                message =  exception || statusText || 'N/A';
            }

            this._request = null;
            this._fireEvent('error', { code: status, message: message }, this);
        },

        /**
         * Handles the complete of the request.
         */
        _handleComplete: function () {
            if (!this._ignoreComplete) {
                this._fireEvent('complete', this);
            } else {
                this._ignoreComplete = false;
            }
        }
    };

    return new Class(ApiRequest);
});
