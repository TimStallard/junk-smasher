"use strict";
var gulp = require("gulp"),
	path = require("path"),
	watch = require("gulp-watch");

var sourceGlob = path.join("Client", "Assets", "**", "*.*");
var destGlob   = path.join("Build", "Client");

gulp.task("client:assets", function () {
	return gulp.src(sourceGlob)
		.pipe(gulp.dest(destGlob));
});

gulp.task("client:assets#watch", ["client:assets"], function () {
	watch(sourceGlob, function () {
		gulp.start("client:assets");
	});
});
