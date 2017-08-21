(function () {
    'use strict';

    angular
        .module('users.directives')
        .directive('hasPermission', hasPermission);

    hasPermission.$inject = ['Authentication'];

    function hasPermission(Authentication) {
        function isFunctionA(object) {
            return object && getClass.call(object) == '[object Function]';
        }

        return {
            link: function (scope, element, attrs) {
                var hasPermission =Authentication.hasRight(attrs.hasPermission);
                //TODO: or better even remove that element from the DOM?
                if(hasPermission){
                    element[0].style.display = 'block';
                }
                else {
                    element[0].style.display = 'none';
                }

            }
        };
    }
}());