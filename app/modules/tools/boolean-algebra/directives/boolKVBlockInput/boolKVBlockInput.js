/**
 * Created by Sergej Görzen on 04.09.2016.
 */
(function () {
    var app = angular.module('boolean-algebra');

    app.directive('boolKvBlockInput', function($timeout){
        return {
            restrict: 'E',
            replace:true,
            scope:{
                layer: "=bindLayer"
            },
            templateUrl: "modules/tools/boolean-algebra/directives/boolKVBlockInput/boolKVBlockInput.html",
            link: function($scope, $element, $attr) {
                var expression = $scope.layer.expression;

                $scope.showSolution = false;

                expression.onTextChanged = function () {
                  $scope.showSolution = false;
                };

                $scope.$on("showResult", function () {
                    /* Zeige Lösung an */
                    var $resInput = $element.find('.result-input .input');
                    var resExpr = $scope.layer.getBlocksExpr();
                    $resInput.html(resExpr.getHtml());
                    $scope.showSolution = true;
                });

                /* Überprüfe Lösung */
                $scope.$on('checkResults', function () {
                    $scope.layer.checkExpression();
                    $scope.showSolution = false;
                });
            }
        };
    });
})();