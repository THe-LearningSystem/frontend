(function () {
    'use strict';

    angular
        .module('core')
        .directive('mainHeader', mainHeader);

    function mainHeader() {
        return {
            scope: false,
            templateUrl: 'modules/core/directives/mainHeader/mainHeader.template.html'
        };
    }
}());
