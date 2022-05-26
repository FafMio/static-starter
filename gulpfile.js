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
    rename = require("gulp-rename"),
    browserSync = require('browser-sync'),
    del = require('del'),
    fs = require('fs'),
    fileExists = require('file-exists');

//? Using `path.sep` for kernel compatibilities (Windows, Linux, MacOS)
let paths = {
    styles: {
        src: '.' + path.sep + 'src' + path.sep + 'styles' + path.sep + '**' + path.sep + '*.scss',
        dir: '.' + path.sep + 'src' + path.sep + 'styles' + path.sep + '',
        files: '**' + path.sep + '*.scss',
        dest: '.' + path.sep + 'build' + path.sep + 'assets' + path.sep + 'css' + path.sep + ''
    },
    scripts: {
        src: '.' + path.sep + 'src' + path.sep + 'scripts' + path.sep + '**' + path.sep + '*.js',
        dir: '.' + path.sep + 'src' + path.sep + 'scripts' + path.sep + '',
        files: '**' + path.sep + '*.js',
        dest: '.' + path.sep + 'build' + path.sep + 'assets' + path.sep + 'js' + path.sep + ''
    },
    build: {
        dest: '.' + path.sep + 'build' + path.sep + '',
    },
    twig: {
        src: '.' + path.sep + 'src' + path.sep + 'templates' + path.sep + 'pages' + path.sep + '**' + path.sep + '*.twig',
        dir: '.' + path.sep + 'src' + path.sep + 'templates' + path.sep + 'pages' + path.sep + '',
        files: '**' + path.sep + '*.twig',
        dest: '.' + path.sep + 'build' + path.sep + ''
    },
    datas: {
        dir: '.' + path.sep + 'src' + path.sep + 'datas' + path.sep + '',
    }
};

//* Building the CSS from Sass
gulp.task('scss', () => {
    return gulp.src(paths.styles.dir + paths.styles.files)
        //? If there is errors
        .pipe(sass({ outputStyle: 'compressed' }).on('error', function (err) { console.log(err.message) }))
        //? Set destination folder.
        .pipe(rename((file) => {
            file.dirname = '';
            file.basename = "style";
        }))
        .pipe(gulp.dest(paths.styles.dest));
});

//* Building Twig to HTML Files
gulp.task('twig', () => {
    return gulp.src(paths.twig.src)
        .pipe(plumber({ errorHandler: (err) => { console.log(err) } }))
        .pipe(data((file) => {
            let fileDir = path.dirname(file.path).replace(__filename.replace('gulpfile.js', ''), '') + path.sep + path.basename(file.path);
            let fileData = fileDir.replace(paths.twig.dir, paths.datas.dir).replace('.twig', '.json');

            //? Render Twig template with data if data.json exist.
            //? Else, juste render the Twig template.
            fileExists(fileData)
                .then((exist) => {
                    if (exist) { return JSON.parse(fs.readFileSync(fileData)) };
                });
        }))
        .pipe(twig().on('error', (err) => {
            process.stderr.write(err.message + '\n');
        }))
        //? Set destination folder.
        .pipe(gulp.dest(paths.twig.dest));
});

//* Delete the 'build' file.
gulp.task('clean', () => {
    return del([paths.build.dest]);
});

//* Building Javascripts
//! Not working yet
//TODO Have to continue the scripts renderer
gulp.task('js', () => {
    return gulp.src(paths.scripts.src)
    .pipe(concat(paths.scripts.src))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(paths.scripts.dest));
});

//* Creating the watchers
gulp.task('watch', () => {
    gulp.watch(paths.styles.dir, ['scss']);
    // gulp.watch(paths.scripts.dir, ['js', browserSync.reload()]);
    // gulp.watch(paths.twig.dir, ['twig', browserSync.reload()]);
});