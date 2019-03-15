'use strict';

module.exports = {
    lib: {
        css: [
            'app/lib/angular-ui-notification/dist/angular-ui-notification.css',
            'app/lib/angular-ui-select/dist/select.css',
            'app/lib/font-awesome/css/font-awesome.css',
            'app/lib/json-formatter/dist/json-formatter.css',
            'app/lib/angularjs-slider/dist/rzslider.css',
            'app/lib/font-awesome/css/font-awesome.css'
        ],
        js: [
            'app/lib/lodash/dist/lodash.js',
            'app/lib/jquery/dist/jquery.slim.js',
            'app/lib/angular/angular.js',
            'app/lib/angular-deferred-bootstrap/angular-deferred-bootstrap.js',
            'app/lib/angular-animate/angular-animate.js',
            'app/lib/angular-bootstrap/ui-bootstrap-tpls.js',
            'app/lib/angular-messages/angular-messages.js',
            'app/lib/angular-mocks/angular-mocks.js',
            'app/lib/angular-ui-notification/dist/angular-ui-notification.js',
            'app/lib/angular-ui-router/release/angular-ui-router.js',
            'app/lib/angular-local-storage/dist/angular-local-storage.js',
            'app/lib/angular-sanitize/angular-sanitize.js',
            'app/lib/angular-ui-select/dist/select.js',
            'app/lib/angular-drag-and-drop-lists/angular-drag-and-drop-lists.js',
            'app/lib/bootstrap-angular-validation/dist/bootstrap-angular-validation-all.min.js',
            'app/lib/d3/d3.js',
            'app/js/lib.js',
            'app/js/mathHelper.js',
            'app/lib/angular-timeago/dist/angular-timeago.js',
            'app/lib/EaselJS/lib/easeljs-0.8.2.combined.js',
            'app/lib/extend.js/bin/extend.min.js',
            'app/lib/jquery-slimscroll/jquery.slimscroll.js',
            'app/lib/json-formatter/dist/json-formatter.js',
            'app/lib/ngQuill/src/ng-quill.js',
            'app/lib/angularjs-slider/dist/rzslider.js'
        ],
        tests: []
    },
    css: [
        'app/css/main.css',
        'app/modules/**/directives/**/*.css'
    ],
    sass: [

        'app/css/bootstrap.scss',
        'app/css/bootstrap_variables.scss',
        'app/css/variables.scss',
        'app/modules/**/css/*.scss'
    ],
    js: [
        'app/js/config.js',
        'app/js/*.js',
        'app/modules/**/*.module.js',
        'app/modules/**/*.controller.js',
        'app/modules/**/*.service.js',
        'app/modules/**/*.routes.js',
        'app/modules/**/*.js'
    ],
    views: [
        'app/index.html',
        'app/modules/**/views/*.html',
        'app/modules/tools/**/directives/**/*.html'
    ]
};
