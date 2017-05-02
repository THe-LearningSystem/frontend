'use strict';

/**
 * Module dependencies.
 */
var _ = require('lodash'),
    defaultAssets = require('./assets'),
    gulp = require('gulp'),
    gulpLoadPlugins = require('gulp-load-plugins'),
    runSequence = require('run-sequence'),
    plugins = gulpLoadPlugins(),
    browserSync = require('browser-sync').create(),
    historyApiFallback = require('connect-history-api-fallback'); // create a browser sync instance.

// Sass task
gulp.task('sass', function () {
    return gulp.src([
        'app/css/bootstrap.scss',
        'app/modules/**/css/*.scss'
    ])
        .pipe(plugins.concat('main.css'))
        .pipe(plugins.sass({
            includePaths: ['./app/css'],
            errLogToConsole: true
        }))
        .pipe(gulp.dest('./app/css/'))
        .pipe(browserSync.stream());
});

gulp.task('inject', function () {
    var target = gulp.src('./app/index.html');
    // It's not necessary to read the files (will speed up things), we're only after their paths:
    return target
        .pipe(plugins.inject(
            gulp.src(_.concat(defaultAssets.lib.js, defaultAssets.js), {read: false}), {
                relative: true,
                addRootSlash: true
            }))
        .pipe(plugins.inject(
            gulp.src(_.concat(defaultAssets.lib.css, defaultAssets.css), {read: false}), {
                relative: true,
                addRootSlash: true
            }))
        .pipe(gulp.dest('./app'));
});

// Watch Files For Changes
gulp.task('watch', function () {
    gulp.watch([defaultAssets.lib.js, defaultAssets.js, defaultAssets.lib.css, defaultAssets.css], ['inject']);
    gulp.watch(defaultAssets.sass, ['sass']);
    gulp.watch([defaultAssets.views, defaultAssets.js], browserSync.reload);
});

gulp.task('browserSync', function () {
    return browserSync.init({
        server: {
            baseDir: "./app",
            middleware: [historyApiFallback()]
        },
        notify: false,
        open: false,
        port: 8080,
        ui: {
            port: 8081
        }
    });
});

// Run the project in development mode
gulp.task('default', function (done) {
    runSequence('inject', 'sass', 'browserSync', 'watch');

});