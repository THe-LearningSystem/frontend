(function () {
    'use strict';

    angular
        .module('courses')
        .directive('ownEditor', ownEditor);

    function ownEditor() {
        return {
            scope: {
                data: '=',
                isRequired: '=',
                isSmallVersion :'='
            },
            templateUrl: 'modules/courses/directives/ownEditor/ownEditor.template.html',
            link: function(scope,el,attrs){
            }
        };
    }
}());
