"use strict";
const { dest } = require('gulp');
let gulp = require('gulp'),
    path = require('path'),
    data = require('gulp-data'),
    twig = require('gulp-twig'),
    prefix = require('gulp-autoprefixer'),
    sass = require('gulp-sass')(require('sass')),
    plumber = require('gulp-plumber'),
    concat = require('gulp-concat'),
    sourcemaps = require('gulp-sourcemaps'),
    browserSync = require('browser-sync'),
    del = require('del'),
    fs = require('fs');

let paths = {
    styles: {
        src: 'src/styles/**/*.scss',
        dest: 'build/assets/css/'
    },
    scripts: {
        src: 'src/scripts/**/*.scss',
        dest: 'build/assets/js/'
    },
    build: {
        dest: 'build/',
    },
    twig: {
        src: 'src/templates/pages/**/*.twig',
        dest: 'build/'
    },
    data: {
        src: 'src/data/**/*.twig',
    }
};

gulp.task('scss', () => {
    return gulp.src(paths.styles.src)
        .pipe(
            sass({ outputStyle: 'compressed' })
            .on('error', function (err) {
                console.log(err.message);
                this.emit('end');
            })
        )
        .pipe(gulp.dest(paths.styles.dest));
});

gulp.task('twig', () => {
    return gulp.src(paths.twig.src)
        .pipe(plumber({
            errorHandler: (err) => {
                console.log(err);
            }
        }))
        .pipe(data((file) => {
            return JSON.parse(fs.readFileSync(paths.data.src + path.basename(file.path) + '.json'));
        }))
        .pipe(twig().on('error', (err) => {
            process.stderr.write(err.message + '\n');
        }))
        .pipe(gulp.dest(paths.build));
})


gulp.task('clean', () => {
    return del([paths.build.dest]);
})