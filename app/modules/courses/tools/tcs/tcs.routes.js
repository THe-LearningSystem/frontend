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
        //automata
        $stateProvider
            .state('tcs', {
                url: '/courses/:courseUrl/tools/',
                parent: 'frontend',
                abstract:true,
                templateUrl: '/modules/courses/tools/tools-template.view.html',
                controller: 'CoursesToolsCtrl'
            })
            .state('tcs.dfa', {
                url: 'dfa',
                controller: 'DFACtrl',
                controllerAs: 'vm',
                templateUrl: '/modules/courses/tools/tcs/automata/dfa/views/dfa.html'
            })
            .state('tcs.nfa', {
                url: 'nfa',
                controller: 'NFACtrl',
                controllerAs: 'vm',
                templateUrl: '/modules/courses/tools/tcs/automata/nfa/views/nfa.html'
            })
            .state('tcs.pda', {
                url: 'pda',
                controller: 'PDACtrl',
                controllerAs: 'vm',
                templateUrl: '/modules/courses/tools/tcs/automata/pda/views/pda.html'
            })
            .state('tcs.npda', {
                url: 'npda',
                controller: 'NPDACtrl',
                controllerAs: 'vm',
                templateUrl: '/modules/courses/tools/tcs/automata/npda/views/npda.html'
            })
            .state('tcs.tm', {
                url: 'tm',
                controller: 'TMCtrl',
                controllerAs: 'vm',
                templateUrl: '/modules/courses/tools/tcs/automata/tm/views/tm.html'
            })
            //cellular automata
            .state('tcs.cellular', {
                url: 'cellular',
                controller: 'CellularCtrl',
                controllerAs: 'vm',
                templateUrl: '/modules/courses/tools/tcs/automata/cellular/views/cellular.view.html'
            })
            //boolean Algebra
            .state('tcs.boolean-algebra', {
                url: 'boolean-algebra',
                controller: 'BACtrl',
                controllerAs: 'vm',
                templateUrl: '/modules/courses/tools/tcs/boolean-algebra/views/boolalg.html'
            })
            //boolean Algebra
            .state('tcs.languages-type-lll', {
                url: 'languages/type-lll',
                controller: 'LANGController',
                controllerAs: 'vm',
                templateUrl: '/modules/courses/tools/tcs/languages/type-lll/views/type-lll.view.html'
            })
        ;

    }
}());
