/**DIRECTIVES**/

//State-Transition-Function
angular.module('courses.tcs').directive("caStateTransitionFunction", function () {
    return {
        templateUrl: 'modules/courses/tools/tcs/automata/cellular/directives/ca-state-transition-function.html'
    };
});


angular.module('courses.tcs').directive('elemReady', function ($parse) {
    return {
        restrict: 'A',
        link: function ($scope, elem, attrs) {
            elem.ready(function () {
                $scope.$apply(function () {
                    var func = $parse(attrs.elemReady);
                    func($scope);
                });
            });
        }
    };
});

angular.module('courses.tcs').directive("caSimulation", function () {
    return {
        templateUrl: 'modules/courses/tools/tcs/automata/cellular/directives/ca.simulation.html'
    };
});

angular.module('courses.tcs').directive("cellSpaceSettings", function () {
    return {
        templateUrl: 'modules/courses/tools/tcs/automata/cellular/directives/cell-space-settings.html'
    };
});