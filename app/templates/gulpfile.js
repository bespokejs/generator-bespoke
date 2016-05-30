'use strict';

var pkg = require('./package.json'),
  gulp = require('gulp'),
  gutil = require('gulp-util'),
  plumber = require('gulp-plumber'),
  rename = require('gulp-rename'),
  connect = require('gulp-connect'),
  browserify = require('gulp-browserify'),
  uglify = require('gulp-uglify'),
<% if (usePug) { -%>
  pug = require('gulp-pug'),
<% } -%>
  stylus = require('gulp-stylus'),
  autoprefixer = require('gulp-autoprefixer'),
  csso = require('gulp-csso'),
  del = require('del'),
  through = require('through'),
  ghpages = require('gh-pages'),
  path = require('path'),
  isDist = process.argv.indexOf('serve') === -1;

gulp.task('js', ['clean:js'], function() {
  return gulp.src('src/scripts/main.js')
    .pipe(isDist ? through() : plumber())
    .pipe(browserify({ debug: !isDist }))
    .pipe(isDist ? uglify() : through())
    .pipe(rename('build.js'))
    .pipe(gulp.dest('dist/build'))
    .pipe(connect.reload());
});

gulp.task('html', ['clean:html'], function() {
<% if (usePug) { -%>
  return gulp.src('src/index.pug')
    .pipe(isDist ? through() : plumber())
    .pipe(pug({ pretty: true }))
    .pipe(rename('index.html'))
<% } -%>
<% if (useHtml) { -%>
  return gulp.src('src/index.html')
<% } -%>
    .pipe(gulp.dest('dist'))
    .pipe(connect.reload());
});

gulp.task('css', ['clean:css'], function() {
  return gulp.src('src/styles/main.styl')
    .pipe(isDist ? through() : plumber())
    .pipe(stylus({
      'include css': true,
      'paths': ['./node_modules']
    }))
    .pipe(autoprefixer('last 2 versions', { map: false }))
    .pipe(isDist ? csso() : through())
    .pipe(rename('build.css'))
    .pipe(gulp.dest('dist/build'))
    .pipe(connect.reload());
});

gulp.task('images', ['clean:images'], function() {
  return gulp.src('src/images/**/*')
    .pipe(gulp.dest('dist/images'))
    .pipe(connect.reload());
});

gulp.task('clean', function(done) {
  return del('dist');
});

gulp.task('clean:html', function(done) {
  return del('dist/index.html');
});

gulp.task('clean:js', function(done) {
  return del('dist/build/build.js');
});

gulp.task('clean:css', function(done) {
  return del('dist/build/build.css');
});

gulp.task('clean:images', function(done) {
  return del('dist/images');
});

gulp.task('connect', ['build'], function() {
  connect.server({
    root: 'dist',
    livereload: true
  });
});

gulp.task('watch', function() {
<% if (usePug) { -%>
  gulp.watch('src/**/*.pug', ['html']);
<% } -%>
<% if (useHtml) { -%>
  gulp.watch('src/**/*.html', ['html']);
<% } -%>
  gulp.watch('src/styles/**/*.styl', ['css']);
  gulp.watch('src/images/**/*', ['images']);
  gulp.watch([
    'src/scripts/**/*.js',
    'bespoke-theme-*/dist/*.js' // Allow themes to be developed in parallel
  ], ['js']);
});
gulp.task('deploy', ['build'], function(done) {
  ghpages.publish(path.join(__dirname, 'dist'), { logger: gutil.log }, done);
});

gulp.task('build', ['js', 'html', 'css', 'images']);

gulp.task('serve', ['connect', 'watch']);

gulp.task('default', ['build']);
