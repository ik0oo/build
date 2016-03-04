var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
var browserSync = require('browser-sync').create();
var runSequence = require('run-sequence');

gulp.task('webpack', function () {
	return gulp.src('./app/modules/react.js')
		.pipe(webpack({
			entry: './app/modules/react.js',
			output: {
				filename: 'react.js'
			},
			module: {
				loaders: [
					{
						test: /\.jsx?$/,
						exclude: /(node_modules|bower_components)/,
						loader: 'babel-loader',
						query: {
							presets: ['react', 'es2015', 'stage-0'],
							plugins: ['react-html-attrs', 'transform-class-properties', 'transform-decorators-legacy']
						}
					}
				]
			}
		}))
		.pipe(debug())
		.pipe(gulp.dest('./dist/assets/js/'))
});

gulp.task('clean', function () {
	return gulp.src('dist')
		.pipe($.clean())
});

gulp.task('archive', function () {
	return gulp.src('dist/**/*.*')
		.pipe($.zip('build.zip'))
		.pipe(gulp.dest('./'));
});

gulp.task('styles', function () {
	return gulp.src('./app/styles/app.styl')
		.pipe($.sourcemaps.init())
		.pipe($.stylus())
		.pipe($.concat('style.css'))
		.pipe($.autoprefixer({
			browsers: ['last 10 versions'],
			cascade: false
		}))
		.pipe($.sourcemaps.write())
		.pipe(gulp.dest('./dist/assets/styles'));
});

gulp.task('templates', function () {
	return gulp.src('./app/pages/**/*.jade')
		.pipe($.jade({
			pretty: true
		}))
		.pipe(gulp.dest('./dist/'));
});

gulp.task('browser-sync', function () {
	return browserSync.init({
		server: {
			baseDir: './dist'
		},
		open: false
	});
});

gulp.task('scripts', function () {
	return gulp.src('./app/scripts/**/*.js')
		.pipe(gulp.dest('./dist/assets/js/'))
});

gulp.task('sprites', function () {
	return gulp.src('./app/sprites/svg/*.svg')
		.pipe($.svgSprites({
			mode: 'symbols',
			svg: {
				symbols: 'sprite.svg'
			},
			preview: {
				symbols: ''
			}
		}))
		.pipe(gulp.dest('./dist/assets/images/'));
});

gulp.task('copy', function () {

	gulp.src('./app/resources/bower_components/jquery/dist/**/*')
		.pipe(gulp.dest('./dist/assets/js/jquery/'));

	gulp.src('./app/resources/bower_components/owlcarousel/owl-carousel/**/*')
		.pipe(gulp.dest('./dist/assets/js/owlcarousel/'));

	return gulp.src('./app/resources/assets/**/*')
		.pipe(gulp.dest('./dist/assets/'));
});

gulp.task('watch', function () {
	// global.watch = gulp.watch;

	gulp.watch(['./app/scripts/**/*.js'], ['scripts']);
	gulp.watch(['./app/styles/**/*.styl', './app/blocks/**/*.styl'], ['styles']);
	gulp.watch(['./app/pages/**/*.jade', './app/blocks/**/*.jade'], ['templates']);
});


gulp.task('default', ['browser-sync', 'templates', 'styles', 'scripts', 'watch']);

gulp.task('build', function () {
	runSequence(['clean'], ['copy', 'sprites', 'templates', 'styles', 'scripts'])
});
gulp.task('zip', function () {
	runSequence('clean', 'copy', ['sprites', 'templates', 'styles', 'scripts'], 'archive');
});
