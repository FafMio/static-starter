"use strict";
let babel = require('gulp-babel'),
    browserSync = require('browser-sync').create(),
    concat = require('gulp-concat'),
    data = require('gulp-data'),
    del = require('del'),
    fs = require('fs'),
    gulp = require('gulp'),
    htmlmin = require('gulp-htmlmin'),
    plumber = require('gulp-plumber'),
    prettify = require('gulp-prettify'),
    path = require('path'),
    postcss = require('gulp-postcss'),
    rename = require("gulp-rename"),
    sass = require('gulp-sass')(require('sass')),
    tailwindcss = require('tailwindcss'),
    twig = require('gulp-twig');

//? Using `path.sep` for kernel compatibilities (Windows, Linux, MacOS)
let paths = {
    styles: {
        src: 'src' + path.sep + 'styles' + path.sep + '**' + path.sep + '*.scss',
        dir: 'src' + path.sep + 'styles' + path.sep + '',
        files: '**' + path.sep + '*.scss',
        dest: 'build' + path.sep + 'assets' + path.sep + 'css' + path.sep + ''
    },
    scripts: {
        src: 'src' + path.sep + 'scripts' + path.sep + '**' + path.sep + '*.js',
        dir: 'src' + path.sep + 'scripts' + path.sep + '',
        files: '**' + path.sep + '*.js',
        dest: 'build' + path.sep + 'assets' + path.sep + 'js' + path.sep + ''
    },
    build: {
        dest: 'build' + path.sep + '',
    },
    twig: {
        src: 'src' + path.sep + 'templates' + path.sep + 'pages' + path.sep + '**' + path.sep + '*.twig',
        watcher: 'src' + path.sep + 'templates' + path.sep + '**' + path.sep + '*.twig',
        dir: 'src' + path.sep + 'templates' + path.sep + 'pages' + path.sep + '',
        files: '**' + path.sep + '*.twig',
        dest: 'build' + path.sep + ''
    },
    images: {
        src: 'src' + path.sep + 'images' + path.sep + '**' + path.sep + '*.{gif,jpg,png,svg}',
        dir: 'src' + path.sep + 'images' + path.sep + '',
        files: '**' + path.sep + '*.twig',
        dest: 'build' + path.sep + 'assets' + path.sep + 'images' + path.sep + ''
    },
    datas: {
        src: 'src' + path.sep + 'datas' + path.sep + '**' + path.sep + '*.json',
        watcher: 'src' + path.sep + 'datas' + path.sep + '**' + path.sep + '*.json',
        dir: 'src' + path.sep + 'datas' + path.sep + '',
        src: '**' + path.sep + '*.json',
    }
};

//* Building the CSS from Sass
gulp.task('sass', () => {
    return gulp.src(paths.styles.src)
        .pipe(sass({ outputStyle: 'compressed' }).on('error', (err) => { console.log(err.message); }))
        .pipe(rename((file) => {
            file.dirname = '';
            file.basename = "style";
        }))
        .pipe(gulp.dest(paths.styles.dest))
        .pipe(browserSync.stream())

        .pipe(postcss([
            tailwindcss('./tailwind.config.js'),
            require('autoprefixer')
        ]))
        .pipe(concat({ path: 'vendor.css'}))
        .pipe(gulp.dest(paths.styles.dest))
        
        ;
});

//* Building Javascripts
gulp.task('js', () => {
    return gulp.src(paths.scripts.src)
        .pipe(babel())
        .pipe(rename((file) => {
            file.dirname += path.sep;
            file.dirname = (file.dirname).replace(paths.scripts.dir, '').replace('build' + path.sep, '');
        }))
        .pipe(gulp.dest(paths.scripts.dest));
});

//* Building Javascripts
gulp.task('img', () => {
    return gulp.src(paths.images.src)
        .pipe(rename((file) => {
            file.dirname += path.sep;
            file.dirname = (file.dirname).replace(paths.images.dir, '').replace('build' + path.sep, '');
        }))
        .pipe(gulp.dest(paths.images.dest));
});

//* Building Twig to HTML Files
gulp.task('twig', () => {
    return gulp.src(paths.twig.src)
        .pipe(plumber({ errorHandler: (err) => { console.log(err); } }))
        .pipe(data(function (file) {
            let fileDir = path.dirname(file.path).replace(__filename.replace('gulpfile.js', ''), '') + path.sep + path.basename(file.path);
            let fileData = fileDir.replace(paths.twig.dir, paths.datas.dir).replace('.twig', '.json');

            try {
                return JSON.parse(fs.readFileSync(fileData));
            } catch (error) {
                return {};
            }
        }))
        .pipe(twig().on('error', (err) => {
            process.stderr.write(err.message + '\n');
        }))
        .pipe(htmlmin({
            collapseWhitespace: false,
            html5: true
        }))
        .pipe(prettify({
            indent_size: 4,
            preserve_newlines: true
        }))
        .pipe(rename((file) => {
            file.dirname += path.sep;
            file.dirname = (file.dirname).replace(paths.twig.dir, paths.twig.dest).replace('build' + path.sep, '');
        }))
        .pipe(gulp.dest(paths.twig.dest));
});

//* Delete the 'build' file.
gulp.task('clean', () => {
    return del([paths.build.dest]);
});

//* Make build
gulp.task('build', gulp.series('clean', 'img', 'js', 'sass', 'twig'));

//* Starting auto reloadable server withs watchers
gulp.task('serve', gulp.series('build', () => {
    browserSync.init({ server: paths.build.dest, notify: true });
    gulp.watch(paths.styles.src.split(path.sep).join('/'), gulp.series('sass')).on('change', () => { browserSync.reload(); });
    gulp.watch(paths.scripts.src.split(path.sep).join('/'), gulp.series('js')).on('change', () => { browserSync.reload(); });
    gulp.watch(paths.images.src.split(path.sep).join('/'), gulp.series('img')).on('change', () => { browserSync.reload(); });
    gulp.watch([paths.twig.watcher.split(path.sep).join('/'), paths.datas.watcher.split(path.sep).join('/')], gulp.series('twig', 'sass')).on('change', () => { browserSync.reload(); });
}));

//* Default command : start the serve
gulp.task('default', gulp.series('serve'));
