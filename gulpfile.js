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
    fs = require('fs'),
    fileExists = require('file-exists');

//? Using `path.sep` for kernel compatibilities (Windows, Linux, MacOS)
let paths = {
    styles: {
        src: 'src' + path.sep + 'styles' + path.sep + '**' + path.sep + '*.scss',
        dir: 'src' + path.sep + 'styles' + path.sep + '',
        dest: 'build' + path.sep + 'assets' + path.sep + 'css' + path.sep + ''
    },
    scripts: {
        src: 'src' + path.sep + 'scripts' + path.sep + '**' + path.sep + '*.scss',
        dir: 'src' + path.sep + 'scripts' + path.sep + '',
        dest: 'build' + path.sep + 'assets' + path.sep + 'js' + path.sep + ''
    },
    build: {
        dest: 'build' + path.sep + '',
    },
    twig: {
        src: 'src' + path.sep + 'templates' + path.sep + 'pages' + path.sep + '**' + path.sep + '*.twig',
        dir: 'src' + path.sep + 'templates' + path.sep + 'pages' + path.sep + '',
        dest: 'build' + path.sep + ''
    },
    datas: {
        dir: 'src' + path.sep + 'datas' + path.sep + '',
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

//*Building Twig to HTML Files
gulp.task('twig', () => {
    return gulp.src(paths.twig.src)
        .pipe(plumber({
            errorHandler: (err) => {
                console.log(err);
            }
        }))
        .pipe(data((file) => {
            let fileDir = path.dirname(file.path).replace(__filename.replace('gulpfile.js', ''), '') + path.sep + path.basename(file.path);
            let fileData = fileDir.replace(paths.twig.dir, paths.datas.dir).replace('.twig', '.json');

            fileExists(fileData)
                .then((exist) => {
                    if(exist) {return JSON.parse(fs.readFileSync(fileData))};
                });
        }))
        .pipe(twig().on('error', (err) => {
            process.stderr.write(err.message + '\n');
        }))
        .pipe(gulp.dest(paths.build.dest));
})


gulp.task('clean', () => {
    return del([paths.build.dest]);
})