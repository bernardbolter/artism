"use strict";

var gulp = require('gulp'),
	gutil = require('gulp-util'),
	sass = require('gulp-sass'),
	autoprefixer = require('gulp-autoprefixer'),
	concat = require('gulp-concat'),
	sourcemaps = require('gulp-sourcemaps'),
	svgstore = require('gulp-svgstore'),
	svgmin = require('gulp-svgmin'),
	clean = require('gulp-clean'),
	rename = require('gulp-rename'),
	watch = require('gulp-watch'),
	connect = require('gulp-connect')

var path = {
		HTML: 'assets/index.html',
		LOGO_HTML: 'assets/logo/index.html',
		SASS: [
			'assets/sass/style.sass',
			'assets/sass/**/*.scss',
			'assets/sass/**/*.sass'
		],
		FAVICON: 'assets/img/favicon.ico',
		SVG: 'assets/svgs/*.svg'
};

gulp.task('sass', function() {
	gulp.src(path.SASS)
		.pipe(sourcemaps.init())
		.pipe(sass({style: 'expanded', lineNumbers : true }).on('error', sass.logError))
		.pipe(autoprefixer('last 2 versions', 'safari 5', 'ie8', 'ie9', 'opera 12.1', 'ios 6', 'android 4'))
		.pipe(concat('style.css'))
		.pipe(sourcemaps.write())
		.pipe(gulp.dest('builds/outbound/css'))
		.pipe(gulp.dest('builds/outbound/logo/css'))
		.pipe(connect.reload());
});

gulp.task('svg', function() {
		gulp.src(path.SVG)
			.pipe(rename({prefix: 'svg-'}))
			.pipe(svgmin())
			.pipe(svgstore())
			.pipe(rename('defs.svg'))
			.pipe(gulp.dest('builds/outbound/svgs'))
			.pipe(connect.reload());
});


gulp.task('clean', function() {
	return gulp.src('builds/outbound', {read: false})
		.pipe(clean());
});


gulp.task('copyHTML', function() {
	gulp.src(path.HTML)
		.pipe(gulp.dest('builds/outbound'));
});

gulp.task('copyLOGO_HTML', function() {
	gulp.src(path.LOGO_HTML)
		.pipe(gulp.dest('builds/outbound/logo'));
});


gulp.task('connect', function() {
	connect.server({
		root: 'builds/outbound',
		livereload: true,
		port: 8005
	});
});

gulp.task('watch', function() {
	gulp.watch(path.SASS, ['sass']);
	gulp.watch(path.SVG), ['svg-in'];
});

gulp.task('default', ['sass', 'copyHTML', 'copyLOGO_HTML', 'svg' , 'connect', 'watch']);