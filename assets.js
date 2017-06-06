'use strict';

module.exports = {
    lib: {
        css: [
            'app/lib/angular-ui-notification/dist/angular-ui-notification.css',
            'app/lib/angular-ui-select/dist/select.css',
            'app/lib/font-awesome/css/font-awesome.css',
            'app/lib/froala-wysiwyg-editor/css/froala_editor.css',
            'app/lib/froala-wysiwyg-editor/css/froala_style.css',

        ],
        js: [
            'app/lib/lodash/dist/lodash.js',
            'app/lib/jquery/dist/jquery.slim.js',
            'app/lib/froala-wysiwyg-editor/js/froala_editor.min.js',
            'app/lib/froala-wysiwyg-editor/js/plugins/align.min.js',
            'app/lib/angular/angular.js',
            'app/lib/angular-deferred-bootstrap/angular-deferred-bootstrap.js',
            'app/lib/angular-animate/angular-animate.js',
            'app/lib/angular-bootstrap/ui-bootstrap-tpls.js',
            'app/lib/angular-messages/angular-messages.js',
            'app/lib/angular-mocks/angular-mocks.js',
            'app/lib/angular-resource/angular-resource.js',
            'app/lib/angular-ui-notification/dist/angular-ui-notification.js',
            'app/lib/angular-ui-router/release/angular-ui-router.js',
            'app/lib/angular-jwt/dist/angular-jwt.js',
            'app/lib/angular-local-storage/dist/angular-local-storage.js',
            'app/lib/angular-sanitize/angular-sanitize.js',
            'app/lib/angular-ui-select/dist/select.js',
            'app/lib/angular-breadcrumb/dist/angular-breadcrumb.js',
            'app/lib/angular-drag-and-drop-lists/angular-drag-and-drop-lists.js',
            'app/lib/bootstrap-angular-validation/dist/bootstrap-angular-validation-all.min.js',
            'app/lib/d3/d3.js',
            'app/js/lib.js',
            'app/js/mathHelper.js',
            'app/lib/angular-froala/src/angular-froala.js',
            'app/lib/angular-timeago/dist/angular-timeago.js'
        ],
        tests: []
    },
    css: [
        'app/css/main.css'
    ],
    sass: [

        'app/css/bootstrap.scss',
        'app/css/bootstrap_variables.scss',
        'app/css/variables.scss',
        'app/modules/**/css/*.scss'
    ],
    js: [
        'app/js/*.js',
        'app/modules/**/*.module.js',
        'app/modules/**/*.controller.js',
        'app/modules/**/*.service.js',
        'app/modules/**/*.routes.js',
        'app/modules/**/*.js'
    ],
    views: [
        'app/index.html',
        'app/modules/**/views/*.html'
    ]
};
