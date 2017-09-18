angular.module('courses.tcs').directive("langmenubutton", function () {
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

angular.module('courses.tcs').directive("langzoomtooltip", function () {
    return {
        replace: true,
        templateUrl: 'modules/courses/tools/tcs/languages/directives/lang-zoom-tooltip.html'
    };
});

angular.module('courses.tcs').directive("langprogramsettings", function () {
    return {
        templateUrl: 'modules/courses/tools/tcs/languages/directives/lang-generalSettings.html'
    };
});

angular.module('courses.tcs').directive("langgrammar", function () {
    return {
        templateUrl: 'modules/courses/tools/tcs/languages/directives/lang-grammar.html'
    };
});

angular.module('courses.tcs').directive("langderivationsequence", function () {
    return {
        templateUrl: 'modules/courses/tools/tcs/languages/directives/lang-derivationsequence.html'
    };
});

angular.module('courses.tcs').directive("languagename", function () {
    return {
        replace: true,
        link: function (scope, elm, attrs) {
            /**
             * Leave the input field after clicking the enter button
             */
            scope.keypressCallback = function ($event) {
                if ($event.charCode == 13) {
                    document.getElementById("languageNameEdit").blur();
                }
            };
        },
        templateUrl: 'modules/courses/tools/tcs/languages/directives/lang-languagename.html'
    };
});

angular.module('courses.tcs').directive("langchangesmenu", function () {
    return {
        link: function (scope, elm, attrs) {
            /**
             * Leave the input field after clicking the enter button
             */
            scope.keypressCallback = function ($event) {
                if ($event.charCode == 13) {
                    document.getElementById("production-input-left").focus();
                }
            };
        },
        templateUrl: 'modules/courses/tools/tcs/languages/directives/lang-changes-menu.html'
    };
});

angular.module('courses.tcs').directive("langsimulation", function () {
    return {
        templateUrl: 'modules/courses/tools/tcs/languages/directives/lang-simulation.html'
    };
});

angular.module('courses.tcs').directive("langsimulationsettings", function () {
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
        templateUrl: 'modules/courses/tools/tcs/languages/directives/lang-simulation-settings.html'
    };
});
