'use strict';

module.exports = {
    lib: {
        css: [
            'app/lib/angular-ui-notification/dist/angular-ui-notification.css'
        ],
        js: [
            'app/lib/lodash/dist/lodash.js',
            'app/lib/angular/angular.js',
            'app/lib/angular-animate/angular-animate.js',
            'app/lib/angular-bootstrap/ui-bootstrap-tpls.js',
            'app/lib/angular-messages/angular-messages.js',
            'app/lib/angular-mocks/angular-mocks.js',
            'app/lib/angular-resource/angular-resource.js',
            'app/lib/angular-ui-notification/dist/angular-ui-notification.js',
            'app/lib/angular-ui-router/release/angular-ui-router.js',
            'app/lib/ng-file-upload/ng-file-upload.js',
            'app/lib/owasp-password-strength-test/owasp-password-strength-test.js',
            'app/lib/angular-jwt/dist/angular-jwt.js',
            'app/lib/angular-local-storage/dist/angular-local-storage.js'
        ],
        tests: []
    },
    css: [
        'app/css/main.css'
    ],
    sass: [
        'app/css/bootstrap.scss',
        'app/modules/**/css/*.scss'
    ],
    js: [
        'app/js/*.js',
        'app/modules/*/*.js',
        'app/modules/*/**/*.js'
    ],
    views: [
        'app/index.html',
        'app/modules/*/views/*.html'
    ]
};
