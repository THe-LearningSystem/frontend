(function () {
    'use strict';

    angular
        .module('courses')
        .directive('courseIsPublished', courseIsPublished);

    function courseIsPublished() {
        return {
            scope: false,
            templateUrl: 'modules/courses/directives/isPublished/isPublished.template.html'
        };
    }
}());
