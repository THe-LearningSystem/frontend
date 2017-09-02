(function () {
    'use strict';

    angular
        .module('courses')
        .directive('passedLesson', passedLesson);

    function passedLesson() {
        return {
            scope: false,
            templateUrl: 'modules/courses/directives/passedLesson/passedLesson.template.html'
        };
    }
}());
