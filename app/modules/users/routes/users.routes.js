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
            .state('users', {
                abstract: true,
                url: '/users',
                template: '<ui-view/>'
            })
            .state('users.signin', {
                url: '/signin',
                templateUrl: '/modules/users/views/users.signin.view.html',
                controller: 'AuthenticationController',
                controllerAs: 'vm'
            })
            .state('users.signup', {
                url: '/signup',
                templateUrl: '/modules/users/views/users.signup.view.html',
                controller: 'AuthenticationController',
                controllerAs: 'vm'
            })
            .state('users.signout', {
                url: '/signout'
            })
            .state('users.profile', {
                url: '/profile',
                templateUrl: '/modules/users/views/users.profile.view.html',
                controller: 'userController',
                controllerAs: 'vm'
            });
    }
}());
