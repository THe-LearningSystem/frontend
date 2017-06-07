(function () {
    'use strict';

    angular
        .module('courses.routes')
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
            .state('tcs', {
                url: '/courses/tcs/tools/',
                parent: 'frontend',
                abstract: true

            })
            .state('tcs.dfa', {
                url: '/courses/tcs/tools/dfa',
                parent: 'frontend',
                controller: 'DFACtrl',
                controllerAs: 'vm',
                templateUrl: '/modules/courses/tools/tcs/automata/dfa/views/dfa.html'
            })
            .state('tcs.nfa', {
                url: '/courses/tcs/tools/nfa',
                parent: 'frontend',
                controller: 'NFACtrl',
                controllerAs: 'vm',
                templateUrl: '/modules/courses/tools/tcs/automata/nfa/views/nfa.html'
            })
            .state('tcs.pda', {
                url: '/courses/tcs/tools/pda',
                parent: 'frontend',
                controller: 'PDACtrl',
                controllerAs: 'vm',
                templateUrl: '/modules/courses/tools/tcs/automata/pda/views/pda.html'
            })
            .state('tcs.npda', {
                url: '/courses/tcs/tools/npda',
                parent: 'frontend',
                controller: 'NPDACtrl',
                controllerAs: 'vm',
                templateUrl: '/modules/courses/tools/tcs/automata/npda/views/npda.html'
            })
            .state('tcs.tm', {
                url: '/courses/tcs/tools/tm',
                parent: 'frontend',
                controller: 'TMCtrl',
                controllerAs: 'vm',
                templateUrl: '/modules/courses/tools/tcs/automata/tm/views/tm.html'
            })
            .state('tcs.cellular', {
                url: '/courses/tcs/tools/cellular',
                parent: 'frontend',
                controller: 'CellularCtrl',
                controllerAs: 'vm',
                templateUrl: '/modules/courses/tools/tcs/automata/cellular/views/cellular.view.html'
            });

    }
}());
