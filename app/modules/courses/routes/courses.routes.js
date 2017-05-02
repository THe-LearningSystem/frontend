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
            .state('frontend.courses', {
                abstract: true,
                url: '/courses',
                template: '<ui-view/>'

            })
            .state('frontend.courses.lessons', {
                abstract: true
            })
            .state('frontend.courses.lessons.create', {
                url: '/courses/lessons/create',
                templateUrl: '/modules/courses/views/course-lesson-create.view.html',
                controller: 'CourseLessonCreateCtrl',
                controllerAs: 'vm',
                parent:'frontend'
            })
            .state('frontend.courses.list', {
                url: '',
                templateUrl: '/modules/courses/views/list-courses.view.html',
                controller: 'CoursesCtrl',
                controllerAs: 'vm',
                requiredRight:'courses.view'
            })
            .state('frontend.courses.create', {
                url: '/courses/create',
                templateUrl: '/modules/courses/views/course-create.html',
                controller: 'CourseCreateCtrl',
                controllerAs: 'vm',
                parent:'frontend'
            })
            .state('frontend.courses.display', {
                abstract: true,
                url: '/:urlName',
                templateUrl: '/modules/courses/views/course.template.view.html',
                controller: 'CourseCtrl',
                controllerAs: 'vm'
            })
            .state('frontend.courses.display.overview', {
                url: '',
                templateUrl: '/modules/courses/views/course-overview.view.html',
                controller: 'CourseCtrl',
                controllerAs: 'vm'
            })
            .state('frontend.courses.display.content', {
                url: '/content',
                templateUrl: '/modules/courses/views/course-content.view.html',
                controller: 'CourseContentCtrl',
                controllerAs: 'vm'
            })
            .state('frontend.courses.display.tools', {
                url: '/tools',
                templateUrl: '/modules/courses/views/course-tools.view.html',
                controller: 'courseController',
                controllerAs: 'vm'
            })
            .state('frontend.courses.display.questionsAndAnswers', {
                url: '/questions-and-answers',
                templateUrl: '/modules/courses/views/course-questions-and-answers.view.html',
                controller: 'courseController',
                controllerAs: 'vm'
            })
            .state('frontend.courses.display.notifications', {
                url: '/notifications',
                templateUrl: '/modules/courses/views/course-notifications.view.html',
                controller: 'courseController',
                controllerAs: 'vm'
            })
            .state('frontend.courses.display.edit', {
                url: '/edit',
                templateUrl: '/modules/courses/views/course-create.html',
                controller: 'CourseCreateCtrl',
                controllerAs: 'vm'
            });
    }
}());
