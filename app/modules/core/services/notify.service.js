(function () {
    'use strict';

    angular
        .module('core.services')
        .factory('CustomNotify', CustomNotify);

    CustomNotify.$inject = ['Notification', '$state'];

    function CustomNotify(Notification, $state) {
        return {
            success: success,
            warning:warning,
            error: error
        };

        function success(msg, options) {
            var defaultOptions = {
                positionX: 'right',
                positionY: 'bottom'
            };
            options = _.merge(defaultOptions, options);
            Notification.success({
                message: '<i class="glyphicon glyphicon-ok"></i>' + msg,
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
                message: '<i class="glyphicon glyphicon-remove"></i>' + msg,
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
                message: '<i class="glyphicon glyphicon-remove"></i>' + msg,
                positionX: options.positionX,
                positionY: options.positionY
            });
        }

    }
}());