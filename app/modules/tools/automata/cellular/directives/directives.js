/**DIRECTIVES**/

/**
 * Directive for the elemReady function
 */
angular.module('tcs-tools').directive('elemReady', function ($parse) {
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

/**
 * Directive with buttons for controlling the simulation-->
 */
angular.module('tcs-tools').directive("caSimulation", function () {
    return {
        templateUrl: 'modules/tools/automata/cellular/directives/ca-simulation.html'
    };
});

/**
 * Directive for setting at the automaton-->
 */
angular.module('tcs-tools').directive("cellSpaceSettings", function () {
    return {
        templateUrl: 'modules/tools/automata/cellular/directives/cell-space-settings.html'
    };
});

/**
 * Directive for color-picker-->
 */
angular.module('tcs-tools').directive("caColorPicker", function () {
    return {
        templateUrl: 'modules/tools/automata/cellular/directives/ca-color-picker.html'
    };
});

/**
 * Directive for the toolbar with the buttons for zoom, randomize, clear and delete
 */
angular.module('tcs-tools').directive("caToolbar", function () {
    return {
        templateUrl: 'modules/tools/automata/cellular/directives/ca-toolbar.html'
    };
});

/**
 * Directive for the slider with which the cell space size can be adjusted
 */
angular.module('tcs-tools').directive("cellSpaceSizeSlider", function () {
    return {
        link: function (scope, elm, attrs) {
            /**
             * Options for the stepTimeOut-Slider
             */
            scope.cellSpaceSizeSlider = {
                options: {
                    floor: 0,
                    step: 1,
                    ceil: 100,
                    hideLimitLabels: true,
                    translate: function (value) {
                        return value + ' ms';
                    }
                }
            };
        },
        templateUrl: 'modules/tools/automata/cellular/directives/cell-space-settings.html'
    };
});