/**
 * Created by Sergej Görzen on 04.09.2016.
 */
(function () {
    var app = angular.module('boolean-algebra');

    app.directive('boolKvBlockMin', function($timeout){
        return {
            restrict: 'E',
            replace:true,
            scope: {
                kv: "=bindKv"
            },
            templateUrl: "modules/tools/boolean-algebra/directives/boolKVBlockMin/boolKVBlockMin.html",
            link: function($scope, $element, $attr) {
                /* Initialsiere Minimierungsobjekte */
                $scope.knf = new BAExpression();
                $scope.dnf = new BAExpression();
                $scope.knfResultState = 0;
                $scope.dnfResultState = 0;

                $scope.dnfResolution = false;
                $scope.knfResolution = false;
                $scope.showResolution = false;

                $scope.$on("showResult", function () {
                   showResolution();
                });

                /* Setze den Status zurück, wenn sich der Ausdruck ändert */
                $scope.knf.onTextChanged = function () {
                    $scope.knfResultState = 0;
                    $scope.knfResolution = false;
                };

                $scope.dnf.onTextChanged = function () {
                    $scope.dnfResultState = 0;
                    $scope.dnfResolution = false;
                };

                var colorMap = $scope.kv.colorMap;
                $scope.customLayers = colorMap.layers;

                colorMap.onChangedLayer = function() {
                    $timeout(function(){
                        $scope.$apply();
                    });
                };

                var minimizeInfo;

                var $dnfInput = $element.find('.dnfInput');
                var $knfInput = $element.find('.knfInput');

                var compareKnfDnf = function(info){
                    /* Vergleiche, ob Eingabe mit der korrekten Lösung übereinstimmt */
                    var compareKnfB = new KVExprCompare(info.knf.expr);
                    var compareDnfB = new KVExprCompare(info.dnf.expr);
                    var compareDnfA = new KVExprCompare($scope.dnf);
                    var compareKnfA = new KVExprCompare($scope.knf);

                    if (KVExprCompare.isDNF($scope.dnf.text)) {
                        $scope.dnfResultState = compareDnfA.equals(compareDnfB) ? 1 : -1;
                    } else {
                        $scope.dnfResultState = -1;
                    }

                    if (KVExprCompare.isKNF($scope.knf.text)) {
                        $scope.knfResultState = compareKnfA.equals(compareKnfB) ? 1 : -1;
                    } else {
                        $scope.knfResultState = -1;
                    }

                };

                var showResolution = function(){
                    /* Zeige Musterlösung an */
                    minimizeInfo = $scope.kv.minimize();
                    $dnfInput.html(minimizeInfo.dnf.expr.getHtml());
                    $knfInput.html(minimizeInfo.knf.expr.getHtml());
                    $scope.dnfResolution = $scope.knfResolution = true;
                };

                $scope.$on('checkResults', function(){
                    minimizeInfo = $scope.kv.minimize();
                    compareKnfDnf(minimizeInfo);
                    $scope.dnfResolution = $scope.knfResolution = false;
                });

                $scope.$on('removeColorLayer', function(layer){
                    colorMap.removeLayer(layer);
                });
            }
        };
    });
})();