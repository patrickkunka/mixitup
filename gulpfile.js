/* global process */
var gulp            = require('gulp'),
    merge           = require('merge-stream'),
    jshint          = require('gulp-jshint'),
    stylish         = require('jshint-stylish'),
    rename          = require('gulp-rename'),
    jscs            = require('gulp-jscs'),
    uglify          = require('gulp-uglify'),
    livereload      = require('gulp-livereload'),
    sourcemaps      = require('gulp-sourcemaps'),
    parse           = require('jsdoc-parse'),
    exec            = require('child_process').exec,
    p               = require('./package.json');

gulp.task('default', ['watch']);

gulp.task('watch', function() {
    livereload.listen(35730);

    gulp.watch([
        './src/*.js',
        './build/*.js',
        './build/*.md'
    ], ['reload-js'])
        .on('change', function(e) {
            console.log(
                '[gulp-watch] file ' +
                e.path +
                ' was ' +
                e.type +
                ', building'
            );
        });
});

gulp.task('reload-js', ['prod'], function() {
    return livereload.changed();
});

gulp.task('prod', ['uglify']);

gulp.task('uglify', ['build'], function() {
    return gulp.src([
        './dist/mixitup.js'
    ])
        .pipe(uglify({
            preserveComments: 'license'
        }))
        .pipe(rename('mixitup.min.js'))
        .on('error', function(e) {
            console.error('[uglify] ' + e.message);
        })
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest('./dist/'));
});

gulp.task('build', ['build-script'], function(done) {
    exec('node build/build-docs.js', function(e, out) {
        if (out) {
            console.log(out);
        }

        done(e);
    });
});

gulp.task('build-script', ['lint', 'code-style'], function(done) {
    var name    = p.name,
        version = p.version;

    exec('node build/build-script.js -n ' + name + ' -v ' + version + ' -o mixitup.js', function(e, out) {
        if (out) {
            console.log(out);
        }

        done(e);
    });
});

gulp.task('lint', function() {
    return gulp.src([
        './src/*.js',
        '!./src/wrapper.js'
    ],
    {
        base: '/'
    })
        .pipe(jshint('./.jshintrc'))
        .pipe(jshint.reporter(stylish))
        .pipe(jshint.reporter('fail'));
});

gulp.task('code-style', function() {
    return gulp.src([
        './src/*.js',
        '!./src/wrapper.js'
    ],
    {
        base: '/'
    })
        .pipe(jscs())
        .pipe(jscs.reporter());
});