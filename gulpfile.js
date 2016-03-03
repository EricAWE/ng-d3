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

gulp.task('browserify', function() {
    // return $.browserify(paths.src.js + '/ng-d3.js')
    //     .bundle()
    //     //Pass desired output filename to vinyl-source-stream
    //     .pipe(source('bundle.js'))
    //     // Start piping stream to tasks!
    //     .pipe(gulp.dest(paths.dist.js));
	gulp.src(paths.src.js + '/ng-d3.js')
		.pipe($.browserify({
            insertGlobals: true,
            debug: true
		}))
		.pipe(gulp.dest(paths.dist.js))
});

gulp.task('watch', function watch() {
    gulp.watch(paths.src.js + '/**/*.js', ['browserify']);
});
