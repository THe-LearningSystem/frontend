(function () {
    'use strict';

    angular
        .module('users.routes')
        .config(routeConfig);


    routeConfig.$inject = ['$stateProvider', '$urlRouterProvider'];

    function routeConfig($stateProvider, $urlRouterProvider) {
        $urlRouterProvider.rule(function ($injector, $location) {
            var path = $location.path();
            var hasTrailingSlash = path.length > 1 && path[path.length - 1] === '/';

            if (hasTrailingSlash) {
                // if last character is a slash, return the same url without the slash
                var newPath = path.substr(0, path.length - 1);
                $location.replace().path(newPath);
            }
        });

        $stateProvider
            .state('frontend.courses.tools.tcs.toola', {
                url: '/toola',
                templateUrl: '/lib/Automata-simulation/app/components/dfa/views',
                controller: 'AuthenticationCtrl',
                controllerAs: 'vm'
            })

    }
}());
