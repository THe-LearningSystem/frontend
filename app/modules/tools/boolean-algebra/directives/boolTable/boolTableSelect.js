/**
 * Created by Sergej on 19.10.2016.
 */
(function () {
    var app = angular.module('boolean-algebra');

    app.directive('boolTableSelect', function($parse, $sce) {
        return {
            restrict: 'E',
            replace: true,
            templateUrl: "modules/tools/boolean-algebra/directives/boolTable/boolTableSelect.html",
            scope: {
                param: '=bindParam',
                expression: '=bindExpression'
            },
            link: function ($scope, $element, $attr) {
                $scope.isCorrect = null;
                $scope.faClass = '';
                $scope.value = '';

                $scope.isDirty = false;

                var locateClass = function(){
                    if ($scope.isCorrect == null) {
                        $scope.faClass = 'no-info';
                    } else if ($scope.isCorrect == true) {
                        $scope.faClass = 'fa-check';
                    } else {
                        $scope.faClass = 'fa-close';
                    }
                };
                locateClass();

                var checkResult = function(){
                    /* Überprüfe Eingabe */
                    if (!$scope.isDirty) return false;
                    if ($scope.value == '') {
                        $scope.isCorrect = null;
                    } else {
                        var value = Number($scope.value);
                        var result = $scope.expression.getResult($scope.param);
                        $scope.isCorrect = value == result;
                    }
                };

                $scope.$on('check-result', function(){
                    checkResult();
                    locateClass();
                });

                $element.on('change', function(){
                    $scope.isDirty = true;
                    //locateClass();
                });
            }
        };
    });
})();