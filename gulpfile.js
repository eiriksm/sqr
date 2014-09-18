var gulp = require('gulp');
var source = require('vinyl-source-stream');
var browserify = require('browserify');
var streamify = require('gulp-streamify');
var uglify = require('gulp-uglify');
var sass = require('gulp-sass');
var prefix = require('gulp-autoprefixer');
var rename = require('gulp-rename');
var webpack = require('gulp-webpack');

gulp.task('scripts', function() {
  browserify('./static/js/app.js')
    .bundle()
    .pipe(source('js.min.js'))
    //.pipe(streamify(uglify()))
    .pipe(gulp.dest('./static/build'));
});

gulp.task('css', function() {
  gulp.src('./static/sass/style.scss')
    .pipe(sass({
      outputStyle: 'compressed',
      errLogToConsole: true,
      error: function(err) {
        console.log(err);
      }
    }))
    .pipe(prefix("last 1 version", "> 1%", "ie 8", "ie 7"))
    .pipe(rename('css.min.css'))
    .pipe(gulp.dest('./static/build'));
});

gulp.task('webpack', function(callback) {
  return gulp.src('./static/js/app.js')
    .pipe(webpack({ /* webpack configuration */ }))
    .pipe(uglify())
    .pipe(rename('js.min.js'))
    .pipe(gulp.dest('./static/build'));
});

// Watch
gulp.task('watch', function() {

  // Watch .scss files
  gulp.watch(['static/js/**/*', 'static/sass/**/*'], ['css', 'webpack']);

});

gulp.task('default', ['scripts', 'css']);
