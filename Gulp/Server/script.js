"use strict";
var gulp = require("gulp"),
    babel  = require("gulp-babel"),
    sourcemaps = require("gulp-sourcemaps"),
    path = require("path"),
    watch = require("gulp-watch");

var sourceGlob = path.join("Server", "**", "*.js"),
    destDir = path.join("Build", "Server");

gulp.task("server:script", function () {
    return gulp.src(sourceGlob)
        .pipe(sourcemaps.init())
        .pipe(babel())
        .pipe(sourcemaps.write("sourcemaps"))
        .pipe(gulp.dest(destDir));
});

gulp.task("server:script#watch", ["server:script"], function () {
    watch(sourceGlob, function () {
        gulp.start("server:script");
    });
});
