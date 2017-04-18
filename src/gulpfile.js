'use strict';
var gulp = require('gulp'),
    plumber = require('gulp-plumber'),
    nodemon = require('gulp-nodemon'),
    del = require('del'),
    eslint = require('gulp-eslint');

// ESLint Task
gulp.task('lint', function() {
    // ESLint ignores files with "node_modules" paths.
    // So, it's best to have gulp ignore the directory as well.
    // Also, Be sure to return the stream from the task;
    // Otherwise, the task may end before the stream has finished.
    return gulp.src(['**/*.js', '!node_modules/**', '!coverage/**', '!public/**'])
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

gulp.task('default', ['lint', 'clean'], function() {
    nodemon({
            script: 'index.js',
            ext: 'html js',
            ignore: ['cleanup.js'],
            env: {
                'NODE_ENV': 'development',
                'PORT': 8080
            }
        })
        .on('restart', ['lint', 'clean'], function() {
            console.log('Amazon SES restart with changes');
        });
});

gulp.task('clean', function() {
    return del(['uploads/**']);
});

module.exports = gulp;