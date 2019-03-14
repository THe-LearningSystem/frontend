/**
 * Created by Sergej Görzen on 04.09.2016.
 */
(function(){
    var app = angular.module('boolean-algebra');
    var _kvCounter = 0;
    var _kvResCounter = 0;
    app.directive('boolKv', function($parse, $timeout){
        return {
            restrict: 'E',
            replace:true,
            scope:true,
            templateUrl: "modules/tools/boolean-algebra/directives/boolKV/boolKV.html",
            link: function($scope, $element, $attr) {
                /* Initialisere Canvas für Arbeitsfläche und Lösung */
                var cv = $element.find('#kvCanvasContainer');
                cv[0].id = 'kvCanvasContainer' + (_kvCounter++);

                var cvSol = $element.find('#kvCanvasSolution');
                cvSol[0].id = 'kvCanvasSolution' + (_kvResCounter++);

                var domain = app.domains[$attr.boolDomain];
                var expr = domain && !$attr.boolExpr ? domain.expression : new BAExpression($attr.boolExpr);

                /* Setze das isTouch Flag */
                CanvasInterface.isTouch = angular.element('html').hasClass('touch');

                var kv = new BAKV({target: cv[0].id, solutionTarget: cvSol[0].id, expression: expr});

                $scope.showSolution = false;

                /* Initialsiere die Farbauswahl */
                var $colors;
                var initColors = function () {
                    $colors = $element.find('.kvColor');
                    $colors.each(function () {
                        var $this = angular.element(this);
                        if ($this.hasClass('active')) {
                            var startColor = $this.data('color');
                            kv.setSelectColor(startColor);
                        }
                        $this.css('background-color', $this.data('color'));
                    }).click(function(){
                        var $el = angular.element(this);
                        var color = $el.data('color');
                        if (color == "reset") {
                            kv.setSelectColor(null);
                        } else {
                            kv.setSelectColor(color);
                        }
                        $colors.removeClass('active');
                        $el.addClass('active');
                    });
                };
                initColors();

                $scope.checkResult = function(){
                    $scope.showSolution = false;
                    $scope.$broadcast('checkResults');
                };

                $scope.showResult = function () {
                    $scope.$broadcast("showResult");

                    kv.showSolution();
                    $scope.showSolution = true;
                };

                if (domain) {
                    /* Aktualisere das KV */
                    domain.refreshKV = function () {
                        if (domain.toKV) $timeout.cancel(domain.toKV);
                        domain.toKV = $timeout(function(){
                            $scope.$broadcast('reset');
                            kv.setExpression(expr = domain.expression);
                            kv.generateKV();
                            $scope.showSolution = false;
                        },50);
                    };
                }

                kv.generateKV();

                $scope.kv = kv;
            }
        };
    });
})();