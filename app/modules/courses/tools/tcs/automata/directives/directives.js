/**DIRECTIVES**/

//menuButton
angular.module('courses.tcs').directive("menubutton", function () {
    return {
        restrict: 'EA',
        replace: true,
        transclude: false,
        scope: {
            icon: '@',
            action: '&',
            tttext: '@'
        },
        template: '<button class="menu-button btn btn-default" type="button" ng-click="action()" aria-label="Left Align"  uib-tooltip="{{tttext | translate}}" tooltip-placement="bottom"><span class="icon icon-{{icon}} icon-position" aria-hidden="true"></span></button>'
    };
});

angular.module('courses.tcs').directive("containerItem", function () {

    return {
        restrict: 'E',
        replace: true,
        transclude: true,
        link: function (scope, elm, attrs) {
            if (scope.extendableRaw == undefined || scope.extendableRaw != false) {
                scope.extendable = true;
            } else {
                scope.extendable = false;
            }
            scope.extended = true;

            scope.toggle = function () {
                if (scope.extendable)
                    scope.extended = !scope.extended;
            };
        },
        scope: {
            titlename: '@',
            extendableRaw: '='
        },
        templateUrl: 'modules/courses/tools/tcs//automata/directives/container-item.html'
    };

});
angular.module('courses.tcs').directive("simulation", function () {
    return {
        templateUrl: 'modules/courses/tools/tcs//automata/directives/simulation.html'
    };
});
angular.module('courses.tcs').directive("simulationSettings", function () {
    return {
        link: function (scope, elm, attrs) {
            /**
             * Options for the stepTimeOut-Slider
             */
            scope.stepTimeOutSlider = {
                options: {
                    floor: 0,
                    step: 100,
                    ceil: 3000,
                    hideLimitLabels: true,
                    translate: function (value) {
                        return value + ' ms';
                    }
                }
            };

            /**
             * Options for the loopTimeOut-Slider
             */
            scope.loopTimeOutSlider = {
                options: {
                    floor: 0,
                    step: 100,
                    ceil: 4000,
                    hideLimitLabels: true,
                    translate: function (value) {
                        return value + ' ms';
                    }
                }
            };
        },
        templateUrl: 'modules/courses/tools/tcs//automata/directives/simulation-settings.html'
    };
});
angular.module('courses.tcs').directive("topMenu", function () {
    return {
        link: function (scope, elm, attrs) {
            //TODO:LATER
            // scope.portation.addInputListener();
        },
        templateUrl: 'modules/courses/tools/tcs//automata/directives/top-menu.html'
    };
});
angular.module('courses.tcs').directive("develop", function () {
    return {
        templateUrl: 'modules/courses/tools/tcs//automata/directives/develop.html'
    };
});
angular.module('courses.tcs').directive("automatonName", function () {
    return {
        replace: true,
        link: function (scope, elm, attrs) {
            /**
             * Leave the input field after clicking the enter button
             */
            scope.keypressCallback = function ($event) {
                if ($event.charCode == 13) {
                    document.getElementById("automatonNameEdit").blur();
                }
            };


        },
        templateUrl: 'modules/courses/tools/tcs//automata/directives/automaton-name.html'
    };
});

angular.module('courses.tcs').directive("ownTable", function () {
    return {
        templateUrl: 'modules/courses/tools/tcs//automata/directives/own-table.html'
    };
});
angular.module('courses.tcs').directive("stateTransitionFunction", function () {
    return {
        templateUrl: 'modules/courses/tools/tcs//automata/directives/state-transition-function.html'
    };
});
angular.module('courses.tcs').directive("stateMenu", function () {
    return {
        templateUrl: 'modules/courses/tools/tcs//automata/directives/state-menu.html'
    };
});
angular.module('courses.tcs').directive("transitionMenu", function () {
    return {
        templateUrl: 'modules/courses/tools/tcs//automata/directives/transition-menu.html'
    };
});
angular.module('courses.tcs').directive("settings", function () {
    return {
        templateUrl: 'modules/courses/tools/tcs//automata/directives/settings.html'
    };
});


angular.module('courses.tcs').directive("contextMenu", function () {
    return {
        templateUrl: 'modules/courses/tools/tcs//automata/directives/context-menu.html'
    };
});
angular.module('courses.tcs').directive("zoomTooltip", function () {
    return {
        replace: true,
        templateUrl: 'modules/courses/tools/tcs//automata/directives/zoom-tooltip.html'
    };
});


angular.module('courses.tcs').directive("unsavedChanges", function () {
    return {
        restrict: 'E',
        replace: true,
        transclude: true,
        templateUrl: 'modules/courses/tools/tcs//automata/directives/unsaved-changes.html'

    };

});
