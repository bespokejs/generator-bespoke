'use strict';

var pkg = require('./package.json'),
  autoprefixer = require('gulp-autoprefixer'),
  browserify = require('browserify'),
  buffer = require('vinyl-buffer'),
  chmod = require('gulp-chmod'),
  connect = require('gulp-connect'),
  csso = require('gulp-csso'),
  del = require('del'),
<% if (useAsciiDoc) { -%>
  exec = require('gulp-exec'),
<% } -%>
  ghpages = require('gh-pages'),
  gulp = require('gulp'),
  log = require('fancy-log'),
  path = require('node:path'),
  plumber = require('gulp-plumber'), // plumber prevents pipe breaking caused by errors thrown by plugins
<% if (usePug) { -%>
  pug = require('gulp-pug'),
<% } -%>
  rename = require('gulp-rename'),
  source = require('vinyl-source-stream'),
  stylus = require('gulp-stylus'),
  through = require('through'),
  uglify = require('gulp-uglify'),
  isDist = process.argv.indexOf('serve') === -1,
  // browserifyPlumber fills the role of plumber() when working with browserify
  browserifyPlumber = function(e) {
    if (isDist) throw e;
    gutil.log(e.stack);
    this.emit('end');
  },
  MAX_HTML_FILE_SIZE = 100 * 1024 * 1024;

gulp.task('clean:css', del.bind(null, 'public/build/build.css'));

gulp.task('css', gulp.series('clean:css', function _css() {
  return gulp.src('src/styles/main.styl')
    .pipe(isDist ? through() : plumber())
    .pipe(stylus({ 'include css': true, paths: ['./node_modules'] }))
    .pipe(autoprefixer({ cascade: false }))
    .pipe(isDist ? csso() : through())
    .pipe(rename('build.css'))
    .pipe(gulp.dest('public/build'))
    .pipe(connect.reload());
}));

gulp.task('clean:fonts', del.bind(null, 'public/fonts'));

gulp.task('fonts', gulp.series('clean:fonts', function _fonts() {
  return gulp.src('src/fonts/*')
    .pipe(gulp.dest('public/fonts'))
    .pipe(connect.reload());
}));

gulp.task('clean:html', del.bind(null, 'public/index.html'));

gulp.task('html', gulp.series('clean:html', function _html() {
<% if (usePug) { -%>
  return gulp.src('src/index.pug')
    .pipe(isDist ? through() : plumber())
    .pipe(pug({ pretty: '  ' }))
<% } -%>
<% if (useAsciiDoc) { -%>
  return gulp.src('src/index.adoc')
    .pipe(isDist ? through() : plumber())
    .pipe(exec('bundle exec asciidoctor-bespoke -o - src/index.adoc', { pipeStdout: true, maxBuffer: MAX_HTML_FILE_SIZE }))
    .pipe(exec.reporter({ stdout: false }))
<% } -%>
<% if (useHtml) { -%>
  return gulp.src('src/index.html')
<% } -%>
    .pipe(rename('index.html'))
    .pipe(gulp.dest('public'))
    .pipe(connect.reload());
}));

gulp.task('clean:images', del.bind(null, 'public/images'));

gulp.task('images', gulp.series('clean:images', function _images() {
  return gulp.src('src/images/**/*')
    .pipe(gulp.dest('public/images'))
    .pipe(connect.reload());
}));

gulp.task('clean:js', del.bind(null, 'public/build/build.js'));

gulp.task('js', gulp.series('clean:js', function _js() {
  return browserify('src/scripts/main.js', { detectGlobals: false })
    .plugin('browser-pack-flat/plugin')
    .bundle()
    .on('error', browserifyPlumber)
    .pipe(source('main.bundle.js'))
    .pipe(buffer())
    .pipe(isDist ? uglify() : through())
    .pipe(rename('build.js'))
    .pipe(gulp.dest('public/build'))
    .pipe(connect.reload());
}));

gulp.task('build', gulp.series('js', 'html', 'css', 'fonts', 'images'));

gulp.task('clean', del.bind(null, 'public'));

gulp.task('publish', gulp.series('clean', 'build', function _deploy(done) {
  ghpages.publish(path.join(__dirname, 'public'), { logger: log }, done);
}));

gulp.task('deploy', gulp.series('publish'));

gulp.task('connect', gulp.series('build', function _connect(done) {
  connect.server({ root: 'public', port: 8000, livereload: true });
  done();
}));

gulp.task('watch', function _watch(done) {
<% if (usePug) { -%>
  gulp.watch('src/**/*.pug', gulp.series('html'));
<% } -%>
<% if (useAsciiDoc) { -%>
  gulp.watch('src/**/*.adoc', gulp.series('html'));
<% } -%>
<% if (useHtml) { -%>
  gulp.watch('src/**/*.html', gulp.series('html'));
<% } -%>
  gulp.watch('src/scripts/**/*.js', gulp.series('js'));
  gulp.watch('src/styles/**/*.styl', gulp.series('css'));
  gulp.watch('src/images/**/*', gulp.series('images'));
  gulp.watch('src/fonts/*', gulp.series('fonts'));
  done();
});

gulp.task('serve', gulp.series('connect', 'watch'));

gulp.task('default', gulp.series('build'));
