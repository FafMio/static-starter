"use strict";
let babel = require('gulp-babel'),
    browserSync = require('browser-sync').create(),
    data = require('gulp-data'),
    del = require('del'),
    fileExists = require('file-exists'),
    fs = require('fs'),
    gulp = require('gulp'),
    plumber = require('gulp-plumber'),
    path = require('path'),
    rename = require("gulp-rename"),
    sass = require('gulp-sass')(require('sass')),
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
        dir: 'src' + path.sep + 'datas' + path.sep + '',
    }
};

//* Building the CSS from Sass
gulp.task('sass', () => {
    return gulp.src(paths.styles.src)
        //? If there is errors
        .pipe(sass({ outputStyle: 'compressed' }).on('error', (err) => { console.log(err.message); }))
        //? Rename the dirname to set the destination.
        .pipe(rename((file) => {
            file.dirname = '';
            file.basename = "style";
        }))
        //? Set destination folder.
        .pipe(gulp.dest(paths.styles.dest))
        .pipe(browserSync.stream());
});

//* Building Javascripts
gulp.task('js', () => {
    return gulp.src(paths.scripts.src)
        //? Babel compiler
        .pipe(babel())
        //? Rename the dirname to set the destination.
        .pipe(rename((file) => {
            file.dirname += path.sep;
            file.dirname = (file.dirname).replace(paths.scripts.dir, '').replace('build' + path.sep, '');
        }))
        //? Set destination folder.
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
        //? Compile twig files with their own data with own json file if there is one.
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
        //? check if there is error in twig files.
        .pipe(twig().on('error', (err) => {
            process.stderr.write(err.message + '\n');
        }))
        //? Rename the dirname to set the destination.
        .pipe(rename((file) => {
            file.dirname += path.sep;
            file.dirname = (file.dirname).replace(paths.twig.dir, paths.twig.dest).replace('build' + path.sep, '');
        }))
        //? Set destination folder.
        .pipe(gulp.dest(paths.twig.dest));
});

//* Delete the 'build' file.
gulp.task('clean', () => {
    //? Delete the build folder.
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
    gulp.watch(paths.twig.src.split(path.sep).join('/'), gulp.series('twig')).on('change', () => { browserSync.reload(); });
}));

//* Default command : start the serve
gulp.task('default', gulp.series('serve'));
