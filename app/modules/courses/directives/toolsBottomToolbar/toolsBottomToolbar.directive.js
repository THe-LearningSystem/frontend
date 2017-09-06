(function () {
    'use strict';

    angular
        .module('courses')
        .directive('toolsBottomToolbar', toolsBottomToolbar);

    function toolsBottomToolbar() {
        return {
            scope: false,
            templateUrl: 'modules/courses/directives/toolsBottomToolbar/toolsBottomToolbar.template.html'
        };
    }


}());
