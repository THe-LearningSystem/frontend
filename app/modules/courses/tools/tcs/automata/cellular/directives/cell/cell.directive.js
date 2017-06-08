(function () {
    'use strict';

    angular
        .module('courses.tools')
        .directive('tcsCell', tcsCell);

    function tcsCell() {
        return {
            scope: false,
            templateUrl: 'modules/courses/tools/tcs/automata/cellular/directives/cell/cell.template.html'
        };
    }
}());
