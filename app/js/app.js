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
        'ncy-angular-breadcrumb',
        'ngDraggable'
    ]
};

var app = angular.module(config.name, config.vendorDependencies)
    .config(["$httpProvider", "$locationProvider", "localStorageServiceProvider", "jwtOptionsProvider",
        function ($httpProvider, $locationProvider, localStorageServiceProvider, jwtOptionsProvider) {
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
                    whiteListedDomains: ['localhost']
                });
            $locationProvider.html5Mode(true);

            $httpProvider.interceptors.push('jwtInterceptor');
        }])

    .run(['$rootScope','$state','jwtHelper','localStorageService','Authentication','Notification','I18nManager',
        function ($rootScope, $state, jwtHelper, localStorageService, Authentication, Notification,I18nManager) {
        $rootScope.Authentication = Authentication.init();
        $rootScope.I18nManager = I18nManager.init();

        $rootScope.serverUrl = "http://localhost:3000/api";
        $rootScope.isAuthenticated = Authentication.isAuthenticated;


        //http://stackoverflow.com/questions/8817394/javascript-get-deep-value-from-object-by-passing-path-to-it-as-string
        //TODO: remove undefined errors and return undefined if no value found
        var _deep_value = function (obj, path) {
            for (var i = 0, path = path.split('.'), len = path.length; i < len; i++) {
                obj = obj[path[i]];
            }
            return obj;
        };


        $rootScope.i18nGet = function (value) {
            var returnVal = _deep_value(I18nManager.data, value + '.' + I18nManager.currentLanguage);
            if (returnVal === undefined)
                return value;
            else
                return returnVal;
        };


        //Dont show signin or signup page when the user is already logged in
        //Not the best solution
        //TODO: find a better solution
            $rootScope.$on('$stateChangeError', function(event, toState, toParams, fromState, fromParams, error) {
                event.preventDefault();
                $state.transitionTo('not-reachable'); // error has data, status and config properties
            });

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
                    Notification.success({
                        message: '<i class="glyphicon glyphicon-ok"></i> Signout successfull!',
                        positionX: 'right',
                        positionY: 'bottom'
                    });
                    Authentication.removeToken();
                    $state.go('frontend.home');
                }
                //if the site is restricted and the user isnt logged in then redirect to login
                if (toState.requiredRight !== undefined && Authentication.isAuthenticated === false) {
                    event.preventDefault();
                    $state.go('frontend.users.signin');
                    //if the user has not the right then redirect to not-authorized
                } else if (toState.requiredRight !== undefined && !Authentication.hasRight(toState.requiredRight)) {
                    console.log(toState.requiredRight, Authentication.rights);

                    event.preventDefault();
                    $state.go('not-authorized');
                }

            }
        );
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
