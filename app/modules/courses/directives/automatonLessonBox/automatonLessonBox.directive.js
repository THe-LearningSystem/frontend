(function () {
    'use strict';

    angular
        .module('courses')
        .directive('automatonLessonBox', automatonLessonBox);

    function automatonLessonBox() {
        return {
            scope: false,
            templateUrl: 'modules/courses/directives/automatonLessonBox/automatonLessonBox.template.html'
        };
    }
}());
