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
                smallVersion :'='
            },
            templateUrl: 'modules/courses/directives/ownEditor/ownEditor.template.html',
            link: function(scope,el,attrs){
                console.log(scope);
                if(scope.smallVersion){

                }
            }
        };
    }
}());
