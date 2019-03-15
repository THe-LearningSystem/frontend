'use strict';

/**
 * Module dependencies.
 */
var _ = require('lodash'),
    defaultAssets = require('./assets'),
    gulp = require('gulp'),
    del = require('del'),
    gulpLoadPlugins = require('gulp-load-plugins'),
    runSequence = require('run-sequence'),
    plugins = gulpLoadPlugins(),
    browserSync = require('browser-sync').create(),
    historyApiFallback = require('connect-history-api-fallback'); // create a browser sync instance.

function swallowError(error) {

    // If you want details of the error in the console
    console.log(error.toString())

    this.emit('end')
}

// Sass task
gulp.task('sass', function () {
    return gulp.src([
        'app/css/bootstrap.scss',
        'app/modules/**/css/*.scss'
    ])
        .pipe(plugins.concat('main.css'))
        .pipe(plugins.sass({
            includePaths: ['./app/css']
        }).on('error', plugins.sass.logError))
        .pipe(gulp.dest('./app/css/'))
        .pipe(browserSync.stream());
});

gulp.task('inject', function () {
    var target = gulp.src('./app/index_template.html');
    // It's not necessary to read the files (will speed up things), we're only after their paths:
    return target
        .pipe(plugins.inject(
            gulp.src(_.concat(defaultAssets.lib.js, defaultAssets.js), { read: false }), {
                relative: true,
                addRootSlash: true
            }))
        .pipe(plugins.inject(
            gulp.src(_.concat(defaultAssets.lib.css, defaultAssets.css), { read: false }), {
                relative: true,
                addRootSlash: true
            }))
        .pipe(plugins.rename('index.html'))
        .pipe(gulp.dest('./app'));
});

// Watch Files For Changes
gulp.task('watch', function () {
    //, defaultAssets.lib.css, defaultAssets.css
    gulp.watch([defaultAssets.lib.js, defaultAssets.js], ['inject']);
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

gulp.task('clean', function () {
    return del('dist/**/*');
});

gulp.task('serveModules', function () {
    gulp.src(['app/modules/**/*'])
        .pipe(gulp.dest('dist/modules'));
});

gulp.task('serveLibs', function () {
    gulp.src(['app/lib/**/*'])
        .pipe(gulp.dest('dist/lib'));
    gulp.src(['app/translations/*'])
        .pipe(gulp.dest('dist/translations'));
    gulp.src(['app/lib/font-awesome/fonts/*'])
        .pipe(gulp.dest('dist/fonts'));
});
gulp.task('serveIndex', function () {
    gulp.src(['app/index_template.html'])
        .pipe(gulp.dest('dist'));
});

gulp.task('serveLibsJs', function () {
    var jsDest = 'dist/scripts';
    return gulp.src(defaultAssets.lib.js)
        .pipe(plugins.concat('lib.js'))
        .pipe(gulp.dest(jsDest))
        .pipe(plugins.rename('lib.min.js'))
        .pipe(plugins.uglify())
        .pipe(gulp.dest(jsDest));
});

gulp.task('serveJs', function () {
    var jsDest = 'dist/scripts';
    return gulp.src(defaultAssets.js)
        .pipe(plugins.babel({ presets: ['env'] }))
        .pipe(plugins.concat('app.js'))
        .pipe(gulp.dest(jsDest))
        .pipe(plugins.rename('app.min.js'))
        .pipe(plugins.uglify({
            mangle: false
        }))
        .on('error', function (err) {
            plugins.util.log(plugins.util.colors.red('[Error]'), err.toString());
        })
        .pipe(gulp.dest(jsDest));
});

gulp.task('serveCss', function () {
    var cssDest = 'dist/css';
    return gulp.src(defaultAssets.css)
        .pipe(plugins.concat('main.css'))
        .pipe(plugins.sass({
            includePaths: ['./app/css']
        }).on('error', plugins.sass.logError))
        .pipe(plugins.autoprefixer())
        .pipe(gulp.dest(cssDest))
        .pipe(plugins.rename('main.min.css'))
        .pipe(plugins.minifyCss())
        .pipe(gulp.dest(cssDest));
});


gulp.task('serveLibsCss', function () {
    var cssDest = 'dist/css';
    return gulp.src(defaultAssets.lib.css)
        .pipe(plugins.concat('lib.css'))
        .pipe(plugins.sass({
            includePaths: ['./app/css']
        }).on('error', plugins.sass.logError))
        .pipe(plugins.autoprefixer())
        .pipe(gulp.dest(cssDest))
        .pipe(plugins.rename('lib.min.css'))
        .pipe(plugins.minifyCss())
        .pipe(gulp.dest(cssDest));
});


gulp.task('build-inject', function () {
    var target = gulp.src('./dist/index_template.html');
    // It's not necessary to read the files (will speed up things), we're only after their paths:
    return target
        .pipe(plugins.inject(
            gulp.src(_.concat('./dist/scripts/lib.js', './dist/scripts/app.js'), { read: false }), {
                relative: true,
                addRootSlash: true
            }))
        .pipe(plugins.inject(
            gulp.src(_.concat('./dist/css/**/*.min.css'), { read: false }), {
                relative: true,
                addRootSlash: true
            }))
        .pipe(plugins.rename('index.html'))
        .pipe(gulp.dest('./dist'));
});


gulp.task('build', function () {
    runSequence('clean', 'serveLibs', 'serveModules', 'serveIndex', 'serveLibsJs', 'serveJs', 'serveLibsCss', 'serveCss', 'build-inject');
});

gulp.task('prodServer', function () {
    runSequence('build', 'browserSync-dev');
});
gulp.task('browserSync-dev', function () {
    return browserSync.init({
        server: {
            baseDir: "./dist",
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
