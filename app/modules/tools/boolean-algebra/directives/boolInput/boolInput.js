/**
 * Created by Sergej Görzen on 04.09.2016.
 */
(function () {
    var app = angular.module('boolean-algebra');

    app.directive('boolInput', function(){
        return {
            restrict: 'E',
            replace:true,
            scope:true,
            templateUrl: "modules/tools/boolean-algebra/directives/boolInput/boolInput.html",
            link: function($scope, $element, $attr) {

                $scope.symbol = $attr.boolSymbol;
                $scope.symbolSmall = $attr.boolSymbolSmall;

                //testExpr = '(B∧A)⇒(¬A∧B∨(B∧(J⇒K)∧C))';
                //testExpr = '¬A∧¬(B∨C)∧(B∨C)∧(A∨(B∨C∧(B∨C)))';

                var EXPR = $attr.boolExpr || '';
                $scope.expression = new BAExpression(EXPR);

                $scope.groups = BAGroup.groups;

                //BAGroup.add(new BAGroup("A" + SYMBOL_AND + "B"));
                //BAGroup.add(new BAGroup("B" + SYMBOL_OR + "C"));

                $scope.expression.useAllGroups();

                var testExpr = function(expr, letters){
                    console.log("TEST: " + expr.text);
                    var max = Math.pow(2, letters.length);

                    for (var l = 0; l < max; l++) {
                        var bitLine = {};

                        var lTemp = l;
                        for (var i = letters.length - 1; i >= 0; i--) {
                            var v = 0;
                            var vTemp = Math.pow(2, i);

                            if (lTemp >= vTemp) {
                                lTemp -= vTemp;
                                v = 1;
                            }
                            var letter = letters[letters.length - 1 - i];
                            bitLine[letter] = v;
                        }
                    }
                };

                //testExpr($scope.expression, ['A','B','C']);

                var domain = app.domains[$attr.boolDomain];
                if (domain) {
                    domain.expression = $scope.expression;
                }

                $scope.boolDomain = $attr.boolDomain;
            }
        };
    });
})();