(function () {
    'use strict';

    angular
        .module('core')
        .directive('mainSidebar', mainSidebar);

    function mainSidebar() {
        return {
            scope: false,
            templateUrl: 'modules/core/directives/mainSidebar/mainSidebar.template.html'
        };
    }
}());
