(function () {
    'use strict';

    angular
        .module('core.services')
        .factory('CustomNotify', CustomNotify);

    CustomNotify.$inject = ['$rootScope', 'Notification', '$state'];

    function CustomNotify($rootScope, Notification, $state) {
        return {
            success: success,
            warning: warning,
            error: error,
            serversuccess: serversuccess,
            serverwarning: serverwarning,
            servererror: servererror
        };

        function success(msg, options) {
            var defaultOptions = {
                positionX: 'right',
                positionY: 'bottom'
            };
            options = _.merge(defaultOptions, options);
            Notification.success({
                message: msg,
                positionX: options.positionX,
                positionY: options.positionY
            });
        }

        function warning(msg, options) {
            var defaultOptions = {
                positionX: 'right',
                positionY: 'bottom'
            };
            options = _.merge(defaultOptions, options);
            Notification.warning({
                message: msg,
                positionX: options.positionX,
                positionY: options.positionY
            });
        }

        function error(msg, options) {
            var defaultOptions = {
                positionX: 'right',
                positionY: 'bottom'
            };
            options = _.merge(defaultOptions, options);
            Notification.error({
                message: msg,
                positionX: options.positionX,
                positionY: options.positionY
            });
        }

        function serversuccess(msg, options) {
            var defaultOptions = {
                positionX: 'right',
                positionY: 'bottom'
            };
            options = _.merge(defaultOptions, options);
            Notification.success({
                message: msg[$rootScope.preferredLanguage],
                positionX: options.positionX,
                positionY: options.positionY
            });
        }

        function serverwarning(msg, options) {
            var defaultOptions = {
                positionX: 'right',
                positionY: 'bottom'
            };
            options = _.merge(defaultOptions, options);
            Notification.warning({
                message: msg[$rootScope.preferredLanguage],
                positionX: options.positionX,
                positionY: options.positionY
            });
        }

        function servererror(msg, options) {
            var defaultOptions = {
                positionX: 'right',
                positionY: 'bottom'
            };
            options = _.merge(defaultOptions, options);
            Notification.error({
                message: msg[$rootScope.preferredLanguage],
                positionX: options.positionX,
                positionY: options.positionY
            });
        }

    }
}());