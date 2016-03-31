/* eslint-disable */
'use strict';

const path    = require('path');
const gulp    = require('gulp');
const $       = require('gulp-load-plugins')();

const paths = {
    src : {
        js : path.join(__dirname, '/src')
    },
    dist : {
        js   : path.join(__dirname, '/dist/')
    }
};

function onError(err) {
    console.log(err);
    this.emit('end');
}

gulp.task('browserify', function() {
	gulp.src(paths.src.js + '/ngD3.directive.js')
		.pipe($.browserify({
            insertGlobals: true,
            debug: true
		}))
        .on('error', onError)
        .pipe($.rename('ng-d3.js'))
		.pipe(gulp.dest(paths.dist.js))
        .pipe($.uglify())
        .pipe($.rename('ng-d3.min.js'))
        .pipe(gulp.dest(paths.dist.js));
});

gulp.task('css', function() {
    gulp.src(paths.src.js + '/css/ng-d3.css')
        .pipe($.rename('ng-d3.css'))
        .pipe(gulp.dest(paths.dist.js))
        .pipe($.cleanCss())
        .pipe($.rename('ng-d3.min.css'))
        .pipe(gulp.dest(paths.dist.js));
});

gulp.task('watch', function watch() {
    gulp.watch(paths.src.js + '/**/*.js', ['browserify']);
    gulp.watch(paths.src.js + '/*.js', ['browserify']);
    gulp.watch(paths.src.js + '/css/*.css', ['css']);
});
