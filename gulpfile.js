var gulp = require('gulp');
var inject = require('gulp-inject');
var bowerFiles = require('main-bower-files');

gulp.task('default', function() {
    gulp.src('./app/index.html')
        .pipe(inject(gulp.src(bowerFiles(), {read: false}), {name: 'bower'}))
        .pipe(inject(gulp.src(['./js/*.js'], {read: false})))
        .pipe(gulp.dest('./public'))
});
