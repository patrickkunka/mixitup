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
        './src/*.js'
    ], ['reload-js'])
        .on('change', function(e) {
            console.log(
                '[gulp-watch] Javascript file ' +
                e.path.replace(/.*(?=tpl)/, '') +
                ' was ' +
                e.type +
                ', linting...'
            );
        });
});

gulp.task('reload-js', ['prod'], function() {
    return livereload.changed();
});

gulp.task('uglify', ['build'], function() {
    return gulp.src([
        './dist/mixitup.js',
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

gulp.task('build', ['lint', 'code-style'], function(done) {
    var version = p.version;

    exec('node build/build.js -v ' + version + ' -o mixitup.js', function(e, out) {
        if (out) {
            console.log(out);
        }

        done(e);
    });
});

gulp.task('parse-docs', function() {
    parse({
        src: './dist/mixitup.js'
    })
        .pipe(process.stdout);
});

gulp.task('prod', ['uglify']);