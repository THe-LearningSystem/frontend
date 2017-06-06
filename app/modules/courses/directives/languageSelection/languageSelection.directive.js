(function () {
    'use strict';

    angular
        .module('courses')
        .directive('courseLanguageSelection', courseLanguageSelection);

    function courseLanguageSelection() {
        return {
            scope: false,
            templateUrl: 'modules/courses/directives/languageSelection/languageSelection.template.html'
        };
    }
}());
