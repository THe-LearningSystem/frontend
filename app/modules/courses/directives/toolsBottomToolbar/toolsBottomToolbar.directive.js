(function () {
    'use strict';

    angular
        .module('courses')
        .directive('toolsBottomToolbar', toolsBottomToolbar);

    function toolsBottomToolbar() {
        return {
            scope: false,
            link:function(scope,element,attrs){
                console.log(scope.vm);
            },
            templateUrl: 'modules/courses/directives/toolsBottomToolbar/toolsBottomToolbar.template.html'
        };
    }


}());
