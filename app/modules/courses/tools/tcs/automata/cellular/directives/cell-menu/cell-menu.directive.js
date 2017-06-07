(function () {
    'use strict';

    angular
        .module('courses.tools')
        .directive('tcsCaMenu', tcsCaMenu);

    function tcsCaMenu() {
        return {
            scope: false,
            templateUrl: 'modules/courses/tools/tcs/automata/cellular/directives/cell-menu/cell-menu.template.html'
        };
    }
}());
