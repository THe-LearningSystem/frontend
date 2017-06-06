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
            .state('frontend.users', {
                abstract: true,
                url: '/users',
                template: '<ui-view/>'
            })
            .state('frontend.users.signin', {
                url: '/signin',
                templateUrl: '/modules/users/views/signin.view.html',
                controller: 'AuthenticationCtrl',
                controllerAs: 'vm',
                params: {
                    fromOutside: null
                }
            })
            .state('frontend.users.signup', {
                url: '/signup',
                templateUrl: '/modules/users/views/signup.view.html',
                controller: 'AuthenticationCtrl',
                controllerAs: 'vm'
            })
            .state('frontend.users.signout', {
                url: '/signout'
            })
            .state('frontend.users.profile', {
                url: '/profile',
                templateUrl: '/modules/users/views/profile.view.html',
                controller: 'ProfileCtrl',
                controllerAs: 'vm'
            });
    }
}());
