/**
 * Created by Sergej Görzen on 04.09.2016.
 */
(function(){
    var app = angular.module('boolean-algebra');
    var _crCounter = 0;
    app.directive('boolCircuit', function($parse, $timeout){
        return {
            restrict: 'E',
            replace:true,
            scope:true,
            templateUrl: "modules/tools/boolean-algebra/directives/boolCircuit/boolCircuit.html",
            link: function($scope, $element, $attr) {
                var cv = $element.find('#circuitCanvasContainer');
                cv[0].id = 'circuitCanvasContainer' + (_crCounter++);

                var domain = app.domains[$attr.boolDomain];
                var expr = domain && !$attr.boolExpr ? domain.expression : new BAExpression($attr.boolExpr);

                CanvasInterface.isTouch = angular.element('html').hasClass('touch');

                var circuit = new BACircuit({target: cv[0].id, expression: expr});

                $scope.checkResult = function(){

                };

                $scope.help = function () {

                };

                $scope.circuit = circuit;
            }
        };
    });
})();