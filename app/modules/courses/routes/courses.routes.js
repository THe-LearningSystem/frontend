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
            .state('courses', {
                abstract: true,
                url: '/courses',
                template: '<ui-view/>'

            })
            .state('courses.list', {
                url: '',
                templateUrl: '/modules/courses/views/courses.list.view.html',
                controller: 'coursesController',
                controllerAs: 'vm',
                requiredRight:'view_courses'
            })
            .state('courses.display', {
                abstract: true,
                url: '/:urlName',
                templateUrl: '/modules/courses/views/course.root.view.html',
                controller: 'courseController',
                controllerAs: 'vm'
            })
            .state('courses.display.overview', {
                url: '',
                templateUrl: '/modules/courses/views/course.overview.view.html',
                controller: 'courseController',
                controllerAs: 'vm'
            })
            .state('courses.display.lection', {
                url: '/lection',
                templateUrl: '/modules/courses/views/course.lections.view.html',
                controller: 'courseController',
                controllerAs: 'vm'
            });
    }


}());
