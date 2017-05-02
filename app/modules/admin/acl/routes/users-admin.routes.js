(function () {
    'use strict';

    angular
        .module('admin.acl.routes')
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
            .state('backend.users', {
                url: '/users',
                templateUrl: '/modules/admin/acl/views/list-users.view.html',
                controller: 'ListUsersCtrl',
                controllerAs: 'vm',
                requiredRight:'users.view',
                ncyBreadcrumb: {
                    label: 'Users'
                }
            })
            .state('backend.acl', {
                url: '/acl',
                templateUrl: '/modules/admin/acl/views/acl.view.html',
                controller: 'ACLCtrl',
                controllerAs: 'vm',
                ncyBreadcrumb: {
                    label: 'Berechtigungen'
                }
            });
    }
}());
