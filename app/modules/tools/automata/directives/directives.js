/**DIRECTIVES**/

//menuButton
    angular.module('tcs-tools').directive("menubutton", function () {
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

    angular.module('tcs-tools').directive("containerItem", function () {

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
            if (!scope.isCollapsed)
                scope.extended = true;
            else
                scope.extended = false;
            scope.toggle = function () {
                if (scope.extendable)
                    scope.extended = !scope.extended;
            };
        },
        scope: {
            titlename: '@',
            extendableRaw: '=',
            isCollapsed: '@'
        },
        templateUrl: 'modules/tools/automata/directives/container-item.html'
    };

});
    angular.module('tcs-tools').directive("simulation", function () {
    return {
        templateUrl: 'modules/tools/automata/directives/simulation.html'
    };
});
    angular.module('tcs-tools').directive("simulationSettings", function () {
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
        templateUrl: 'modules/tools/automata/directives/simulation-settings.html'
    };
});
    angular.module('tcs-tools').directive("topMenu", function () {
    return {
        link: function (scope, elm, attrs) {
            //TODO:LATER
            // scope.portation.addInputListener();
        },
        templateUrl: 'modules/tools/automata/directives/top-menu.html'
    };
});
    angular.module('tcs-tools').directive("develop", function () {
    return {
        templateUrl: 'modules/tools/automata/directives/develop.html'
    };
});
    angular.module('tcs-tools').directive("automatonName", function () {
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
        templateUrl: 'modules/tools/automata/directives/automaton-name.html'
    };
});

    angular.module('tcs-tools').directive("ownTable", function () {
    return {
        templateUrl: 'modules/tools/automata/directives/own-table.html'
    };
});
    angular.module('tcs-tools').directive("stateTransitionFunction", function () {
    return {
        templateUrl: 'modules/tools/automata/directives/state-transition-function.html'
    };
});
    angular.module('tcs-tools').directive("stateMenu", function () {
    return {
        scope: false,
        templateUrl: 'modules/tools/automata/directives/state-menu.html'
    };
});
    angular.module('tcs-tools').directive("transitionMenu", function () {
    return {
        templateUrl: 'modules/tools/automata/directives/transition-menu.html'
    };
});
    angular.module('tcs-tools').directive("settings", function () {
    return {
        templateUrl: 'modules/tools/automata/directives/settings.html'
    };
});


    angular.module('tcs-tools').directive("contextMenu", function () {
    return {
        templateUrl: 'modules/tools/automata/directives/context-menu.html'
    };
});
    angular.module('tcs-tools').directive("zoomTooltip", function () {
    return {
        replace: true,
        templateUrl: 'modules/tools/automata/directives/zoom-tooltip.html'
    };
});


    angular.module('tcs-tools').directive("unsavedChanges", function () {
    return {
        restrict: 'E',
        replace: true,
        transclude: true,
        templateUrl: 'modules/tools/automata/directives/unsaved-changes.html'

    };

});

    angular.module('tcs-tools').directive("capacityChangeToInfinite", function () {
    return {
        restrict: 'E',
        scope: {
            char: '@char'
        },
        link: function (scope, elm, attrs) {
            scope.saveApply = scopeSaveApply;
            scope.changeInputFieldValue = function () {
                scope.saveApply(function () {
                    event.preventDefault();
                    var element = document.getElementById('state-input-capacity');
                    if (element != null) {
                        element.value = scope.char;
                        if ("createEvent" in document) {
                            var evt = document.createEvent("HTMLEvents");
                            evt.initEvent("change", false, true);
                            element.dispatchEvent(evt);
                        }
                        else
                            element.fireEvent("onchange");
                    }
                });
            };
        },
        template: '<button class="btn btn-default" ng-mousedown="changeInputFieldValue()">{{char}}</button>'
    };
});