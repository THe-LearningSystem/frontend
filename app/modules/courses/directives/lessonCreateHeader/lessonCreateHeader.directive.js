(function () {
    'use strict';

    angular
        .module('courses')
        .directive('courseLessonTypeSelection', courseLessonTypeSelection);

    function courseLessonTypeSelection() {
        return {
            scope: false,
            templateUrl: 'modules/courses/directives/lessonTypeSelection/lessonTypeSelection.template.html'
        };
    }
}());
