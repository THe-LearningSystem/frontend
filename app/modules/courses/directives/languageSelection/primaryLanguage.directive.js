(function () {
    'use strict';

    angular
        .module('courses')
        .directive('coursePrimaryLanguage', coursePrimaryLanguage);

    function coursePrimaryLanguage() {
        return {
            scope: false,
            templateUrl: 'modules/courses/directives/languageSelection/primaryLanguage.template.html'
        };
    }
}());
