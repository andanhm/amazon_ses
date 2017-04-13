'use strict';
var gulp = require('gulp'),
    plumber = require('gulp-plumber'),
    nodemon = require('gulp-nodemon'),
    eslint = require('gulp-eslint');

// ESLint Task
gulp.task('lint', function() {
    // ESLint ignores files with "node_modules" paths.
    // So, it's best to have gulp ignore the directory as well.
    // Also, Be sure to return the stream from the task;
    // Otherwise, the task may end before the stream has finished.
    return gulp.src(['**/*.js', '!node_modules/**', '!coverage/**'])
        //Prevent pipe breaking caused by errors from gulp plugins
        .pipe(plumber())
        // eslint() attaches the lint output to the "eslint" property
        // of the file object so it can be used by other modules.
        .pipe(eslint())
        // eslint.format() outputs the lint results to the console.
        // Alternatively use eslint.formatEach() (see Docs).
        .pipe(eslint.format())
        // To have the process exit with an error code (1) on
        // lint error, return the stream and pipe to failAfterError last.
        .pipe(eslint.failAfterError());
});

gulp.task('default', [], function() {
    nodemon({
            script: 'app.js',
            ext: 'html js',
            ignore: ['cleanup.js'],
            env: {
                'NODE_ENV': 'development'
            }
        })
        .on('restart', ['lint'], function() {
            console.log('Queue man restart with changes');
        });
});

module.exports = gulp;