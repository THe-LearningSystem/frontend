(function () {
    'use strict';

    angular
        .module('courses')
        .directive('courseFormControlButtons', courseFormControlButtons);

    function courseFormControlButtons() {
        return {
            scope: false,
            templateUrl: 'modules/courses/directives/formControlButtons/formControlButtons.template.html'
        };
    }
}());
