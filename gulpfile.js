'use strict';

const gulp            = require('gulp');
const jshint          = require('gulp-jshint');
const stylish         = require('jshint-stylish');
const rename          = require('gulp-rename');
const jscs            = require('gulp-jscs');
const uglify          = require('gulp-uglify');
const livereload      = require('gulp-livereload');
const exec            = require('child_process').exec;

gulp.task('default', ['watch']);

gulp.task('watch', () => {
    livereload.listen(35730);

    gulp.watch([
        './src/*.js',
        './src/*.hbs'
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

gulp.task('reload-js', ['build-dist'], () => {
    return livereload.changed();
});

gulp.task('prod', ['uglify']);

gulp.task('uglify', ['build'], () => {
    return gulp.src([
        './dist/mixitup.js'
    ])
        .pipe(uglify({
            preserveComments: 'license'
        }))
        .pipe(rename('mixitup.min.js'))
        .on('error', e => console.error('[uglify] ' + e.message))
        .pipe(gulp.dest('./dist/'))
        .pipe(gulp.dest('./demos/'));
});

gulp.task('build', ['build-dist'], done => {
    exec('node node_modules/mixitup-build/docs.js -s mixitup.js', (e, out) => {
        if (out) {
            console.log(out);
        }

        done(e);
    });
});

gulp.task('build-dist', ['lint', 'code-style'], done => {
    exec('node node_modules/mixitup-build/dist.js -o mixitup.js', (e, out) => {
        if (out) {
            console.log(out);
        }

        done(e);
    });
});

gulp.task('lint', () => {
    return gulp.src([
        './src/*.js'
    ], {
        base: '/'
    })
        .pipe(jshint('./.jshintrc'))
        .pipe(jshint.reporter(stylish))
        .pipe(jshint.reporter('fail'));
});

gulp.task('code-style', () => {
    return gulp.src([
        './src/*.js'
    ], {
        base: '/'
    })
        .pipe(jscs())
        .pipe(jscs.reporter());
});