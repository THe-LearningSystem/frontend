deferredBootstrapper.bootstrap({
    element: document.body,
    module: 'app',
    resolve: {
        I18N_DATA: ['$http', function ($http) {
            return $http.get(theLearningSystemConfig.serverUrl + '/i18n/?simplified=true');
        }],
        I18N_CONFIG: ['$http', function ($http) {
            return $http.get(theLearningSystemConfig.serverUrl + '/i18n/config');
        }]
    }
});


var config = {
    name: 'app',
    vendorDependencies: [
        'ui.router',
        'ui.bootstrap',
        'ui-notification',
        'angular-jwt',
        'LocalStorageModule',
        'ngSanitize',
        'ui.select',
        'dndLists',
        'bootstrap.angular.validation',
        'yaru22.angular-timeago',
        'jsonFormatter',
        'ngQuill',
        'rzModule'
    ]
};

var app = angular.module(config.name, config.vendorDependencies)
    .config(["$httpProvider", "$locationProvider", "localStorageServiceProvider", "jwtOptionsProvider", "I18N_DATA", 'bsValidationConfigProvider',
        function ($httpProvider, $locationProvider, localStorageServiceProvider, jwtOptionsProvider, I18N_DATA, bsValidationConfigProvider) {
            localStorageServiceProvider
                .setPrefix('learningsystem');
            jwtOptionsProvider
                .config({
                    //Prefix JWT already in the Token
                    authPrefix: '',
                    tokenGetter: ['Authentication', function (Authentication) {
                        return Authentication.token;
                    }],
                    unauthenticatedRedirectPath: '/login',
                    whiteListedDomains: [theLearningSystemConfig.whitedListedDomains]
                });
            $locationProvider.html5Mode(true);

            $httpProvider.interceptors.push('jwtInterceptor');


            bsValidationConfigProvider.global.setValidateFieldsOn('submit');
            bsValidationConfigProvider.global.errorClass = 'has-warning';
            bsValidationConfigProvider.global.successClass = '';
        }])

    .run(['$rootScope', '$state', 'jwtHelper', 'localStorageService', 'Authentication', 'Notification', 'I18nManager', "I18N_DATA", "I18N_CONFIG", 'bsValidationConfig', 'Courses', 'CustomNotify',
        function ($rootScope, $state, jwtHelper, localStorageService, Authentication, Notification, I18nManager, I18N_DATA, I18N_CONFIG, bsValidationConfig, Courses, CustomNotify) {
            $rootScope.getDeepValue = function (obj, path) {
                for (var i = 0, tmpPath = path.split('.'), len = tmpPath.length; i < len; i++) {
                    if (obj !== undefined) {
                        obj = obj[tmpPath[i]];
                    } else {
                        return path.toUpperCase();
                    }
                }
                if (_.has(obj, I18nManager.preferredLanguage)) {
                    return obj[I18nManager.preferredLanguage];
                } else {
                    return path;
                }
            };


            $rootScope.Authentication = Authentication.init();

            I18nManager.setData(I18N_DATA);
            I18nManager.setConfig(I18N_CONFIG);
            $rootScope.i18nj = I18nManager.init();
            $rootScope.preferredLanguage = I18nManager.preferredLanguage;


            $rootScope.getTranslation = function (input) {
                return $rootScope.getDeepValue(I18nManager.data, input);
            };

            bsValidationConfig.messages.required = $rootScope.getDeepValue(I18N_DATA, "core.general.required");

            $rootScope.serverUrl = theLearningSystemConfig.serverUrl;
            $rootScope.isAuthenticated = Authentication.isAuthenticated;


            $rootScope.getLocalized = function (obj, defaultLanguage) {
                if (obj !== undefined) {
                    if (_.has(obj, I18nManager.preferredLanguage))
                        return obj[I18nManager.preferredLanguage];
                    else
                        return obj[I18nManager.defaultLanguage];
                } else {
                }

            };


            //Dont show signin or signup page when the user is already logged in
            //Not the best solution
            //TODO: find a better solution
            // $rootScope.$on('$stateChangeError', function (event, toState, toParams, fromState, fromParams, error) {
            //     event.preventDefault();
            //     $state.transitionTo('not-reachable'); // error has data, status and config properties
            // });

            $rootScope.$on("$stateChangeStart",
                function (event, toState, toParams, fromState, fromParams) {
                    $state.previous = {};
                    $state.previous.state = fromState;
                    $state.previous.params = fromParams;
                    Authentication.init();
                    if (Authentication.isAuthenticated && (toState.name === "frontend.users.signin" || toState.name === "frontend.users.signup")) {
                        event.preventDefault();
                        $state.transitionTo('frontend.home');
                    }
                    if (toState.name === "frontend.users.signout" && Authentication.isAuthenticated) {
                        event.preventDefault();
                        Authentication.removeToken();
                        CustomNotify.success($rootScope.getTranslation('core.general.signoutSuccessfull'));
                        $state.go('frontend.home', {}, {reload: true});
                    }
                    //if the site is restricted and the user isnt logged in then redirect to login
                    if (toState.requiredRight !== undefined && Authentication.isAuthenticated === false) {
                        event.preventDefault();
                        $state.go('frontend.users.signin', {fromOutside: true});
                        //if the user has not the right then redirect to not-authorized
                    } else if (toState.requiredRight !== undefined && !Authentication.hasRight(toState.requiredRight)) {
                        event.preventDefault();
                        $state.go('not-authorized',{},{inherit:true});
                    }
                    //check if the user has the right to edit the course
                    if (toState.needCourseRights) {
                        var data = {
                            courseId: toParams.courseUrl
                        };
                        Courses.getCourseModerators(data).then(function (response) {
                            var data = response.data;
                            if (Authentication.user._id === data.author || _.includes(data.moderators, Authentication.user._id)) {
                            } else {
                                event.preventDefault();
                                $state.go('not-authorized',{},{inherit:true});
                            }
                        });
                    }

                }
            );
        }]);


app.filter('translate', ['I18nManager', function (I18nManager) {
    var _deep_value = function (obj, path) {
        if (path !== undefined) {
            for (var i = 0, tmpPath = path.split('.'), len = tmpPath.length; i < len; i++) {
                if (obj !== undefined) {
                    obj = obj[tmpPath[i]];
                } else {
                    return path.toUpperCase();
                }
            }
            if (_.has(obj, I18nManager.preferredLanguage)) {
                return obj[I18nManager.preferredLanguage];
            } else {
                return path;
            }
        }
    };

    return function (input) {
        return _deep_value(I18nManager.data, input);
    }
}]);

/**
 * Registers a new Module to the system (from https://github.com/meanjs/mean/blob/master/modules/core/client/app/config.js#L16)
 * @param moduleName
 * @param dependencies
 */
function registerModule(moduleName, dependencies) {
    // Create angular module
    angular.module(moduleName, dependencies || []);
    // Add the module to the AngularJS configuration file
    angular.module(config.name).requires.push(moduleName);
}
