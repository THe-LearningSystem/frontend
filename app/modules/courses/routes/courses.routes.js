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
                template: '<ui-view/>',
                requiredRight: 'courses.view'

            })
            .state('frontend.courses.lessons', {
                abstract: true
            })
            .state('frontend.courses.lessons.update', {
                abstract: true
            })
            .state('frontend.courses.lessons.update.content', {
                url: '/courses/:courseUrl/sections/:sectionUrl/lessons/:lessonId/update',
                templateUrl: '/modules/courses/views/course-lesson-create-content.view.html',
                controller: 'CourseLessonContentCreateCtrl',
                controllerAs: 'vm',
                parent: 'frontend'
            })
            .state('frontend.courses.lessons.update.quiz', {
                url: '/courses/:courseUrl/sections/:sectionUrl/lessons/:lessonId/update/quiz',
                templateUrl: '/modules/courses/views/course-lesson-create-quiz.view.html',
                controller: 'CourseLessonQuizCreateCtrl',
                controllerAs: 'vm',
                parent: 'frontend'
            })
            .state('frontend.courses.lessons.update.automaton', {
                url: '/courses/:courseUrl/sections/:sectionUrl/lessons/:lessonId/update/automaton',
                templateUrl: '/modules/courses/views/course-lesson-create-automaton.view.html',
                controller: 'CourseLessonAutomatonCreateCtrl',
                controllerAs: 'vm',
                parent: 'frontend'
            })
            .state('frontend.courses.lessons.create', {
                abstract: true
            })
            .state('frontend.courses.lessons.create.content', {
                url: '/courses/:courseUrl/sections/:sectionUrl/lessons/create',
                templateUrl: '/modules/courses/views/course-lesson-create-content.view.html',
                controller: 'CourseLessonContentCreateCtrl',
                controllerAs: 'vm',
                parent: 'frontend'

            })
            .state('frontend.courses.lessons.create.quiz', {
                url: '/courses/:courseUrl/sections/:sectionUrl/lessons/create/quiz',
                templateUrl: '/modules/courses/views/course-lesson-create-quiz.view.html',
                controller: 'CourseLessonQuizCreateCtrl',
                controllerAs: 'vm',
                parent: 'frontend'
            })
            .state('frontend.courses.lessons.create.automaton', {
                url: '/courses/:courseUrl/sections/:sectionUrl/lessons/create/automaton',
                templateUrl: '/modules/courses/views/course-lesson-create-automaton.view.html',
                controller: 'CourseLessonAutomatonCreateCtrl',
                controllerAs: 'vm',
                parent: 'frontend'
            })
            .state('frontend.courses.list', {
                url: '',
                templateUrl: '/modules/courses/views/list-courses.view.html',
                controller: 'CoursesCtrl',
                controllerAs: 'vm',
                requiredRight: 'courses.view'
            })
            .state('frontend.courses.create', {
                url: '/courses/create',
                templateUrl: '/modules/courses/views/course-create.html',
                controller: 'CourseCreateCtrl',
                controllerAs: 'vm',
                parent: 'frontend',
                requiredRight: 'courses.create'
            })
            .state('frontend.courses.display', {
                abstract: true,
                url: '/:courseUrl',
                templateUrl: '/modules/courses/views/course.template.view.html',
                controller: 'CourseCtrl',
                controllerAs: 'vm',
                requiredRight: 'courses.view'
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
                controllerAs: 'vm',
                requiredRight: 'courses.view'
            })
            .state('frontend.courses.display.lesson', {
                url: '/courses/:courseUrl/lessons/:lessonId',
                templateUrl: '/modules/courses/views/course-lesson.view.html',
                controller: 'LessonCtrl',
                controllerAs: 'vm',
                parent:'frontend'
            })
            .state('frontend.courses.display.tools', {
                url: '/tools',
                templateUrl: '/modules/courses/views/course-tools.view.html',
                controller: 'ToolsCtrl',
                controllerAs: 'vm'
            })
            .state('frontend.courses.display.createQuestion', {
                url: '/questions-and-answers/create',
                templateUrl: '/modules/courses/views/course-create-question.html',
                controller: 'QuestionCreateCtrl',
                controllerAs: 'vm',
                parent:'frontend.courses.display'
            })
            .state('frontend.courses.display.questionsAndAnswers', {
                url: '/questions-and-answers',
                templateUrl: '/modules/courses/views/course-questions-and-answers.view.html',
                controller: 'QuestionAndAnswersCtrl',
                controllerAs: 'vm'
            })
            .state('frontend.courses.display.questionsAndAnswers.display', {
                url: '/questions-and-answers/:questionId',
                templateUrl: '/modules/courses/views/course-question-and-answers.view.html',
                controller: 'QuestionAndAnswersCtrl',
                controllerAs: 'vm',
                parent:'frontend.courses.display'
            })

            .state('frontend.courses.display.notifications', {
                url: '/notifications',
                templateUrl: '/modules/courses/views/course-notifications.view.html',
                parent:'frontend.courses.display'
            })
            .state('frontend.courses.display.createNotification', {
                url: '/notifications/create',
                templateUrl: '/modules/courses/views/course-create-notification.html',
                controller: 'NotificationCreateCtrl',
                controllerAs: 'vm',
                parent:'frontend.courses.display'
            })
            .state('frontend.courses.display.updateNotifications', {
                url: '/notifications/:notificationId',
                templateUrl: '/modules/courses/views/course-create-notification.html',
                controller: 'NotificationCreateCtrl',
                controllerAs: 'vm',
                parent:'frontend.courses.display'
            })
            .state('frontend.courses.display.edit', {
                url: '/edit',
                templateUrl: '/modules/courses/views/course-create.html',
                controller: 'CourseCreateCtrl',
                controllerAs: 'vm'
            });
    }
}());
