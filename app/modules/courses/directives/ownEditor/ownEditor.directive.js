(function () {
    'use strict';

    angular
        .module('courses')
        .directive('ownEditor', ownEditor);

    function ownEditor() {
        return {
            scope: {
                data: '=',
                isRequired: '='
            },
            templateUrl: 'modules/courses/directives/ownEditor/ownEditor.template.html'
        };
    }
}());
