var gulp = require('gulp'),
    prefixer = require('gulp-autoprefixer'),
    uglify = require('gulp-uglify'),
    sass = require('gulp-sass'),
    sourcemaps = require('gulp-sourcemaps'),
    rigger = require('gulp-rigger'),
    cleanCSS = require('gulp-clean-css'),
    imagemin = require('gulp-imagemin'),
    pngquant = require('imagemin-pngquant'),
    del = require('del'),
    browserSync = require("browser-sync"),
    reload = browserSync.reload;

gulp.task('webserver', function () {
  browserSync({
    server: {
      baseDir: 'build'
    },
    port: 3000,
    ui: {
      port: 4000
    },
    // tunnel: true,
    notify: false
  });
});

gulp.task('html:build', function () {
  gulp.src('src/*.html')
      .pipe(rigger())
      .pipe(gulp.dest('build'))
      .pipe(reload({stream: true}));
});

gulp.task('style:build', function () {
  gulp.src('src/style/main.scss')
      .pipe(sourcemaps.init())
      .pipe(sass())
      .pipe(prefixer(['last 10 versions']))
      // .pipe(cleanCSS())
      .pipe(sourcemaps.write())
      .pipe(gulp.dest('build/css'))
      .pipe(reload({stream: true}));
});

gulp.task('js:build', function () {
  gulp.src('src/js/main.js')
      .pipe(rigger())
      .pipe(sourcemaps.init())
      // .pipe(uglify())
      .pipe(sourcemaps.write())
      .pipe(gulp.dest('build/js'))
      .pipe(reload({stream: true}));
});

gulp.task('image:build', function () {
  gulp.src('src/img/**/*.*')
      .pipe(imagemin({
        interlaced: true,
        progressive: true,
        svgoPlugins: [{removeViewBox: false}],
        use: [pngquant()]
      }))
      .pipe(gulp.dest('build/img'))
      .pipe(reload({stream: true}));
});

gulp.task('fonts:build', function () {
  gulp.src('src/fonts/*.*')
      .pipe(gulp.dest('build/fonts'))
});

gulp.task('build', [
  'html:build',
  'js:build',
  'style:build',
  'fonts:build',
  'image:build'
]);

gulp.task('clean', function () {
  del.sync('build');
});

gulp.task('watch', function () {
  gulp.watch('src/**/*.html', ['html:build']);
  gulp.watch('src/style/**/*.scss', ['style:build']);
  gulp.watch('src/js/**/*.js', ['js:build']);
  gulp.watch('src/img/**/*.*', ['image:build']);
  gulp.watch('src/fonts/**/*.*', ['fonts:build']);
});

gulp.task('default', [
  'build',
  'webserver',
  'watch'
]);
