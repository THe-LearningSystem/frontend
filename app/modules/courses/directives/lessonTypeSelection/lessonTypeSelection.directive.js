(function () {
    'use strict';

    angular
        .module('courses')
        .directive('courseLessonCreateHeader', courseLessonCreateHeader);

    function courseLessonCreateHeader() {
        return {
            scope: false,
            templateUrl: 'modules/courses/directives/lessonCreateHeader/lessonCreateHeader.template.html'
        };
    }
}());
