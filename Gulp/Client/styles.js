"use strict";
var gulp      = require("gulp"),
    sass        = require("gulp-sass"),
    sourcemaps  = require("gulp-sourcemaps"),
    path        = require("path"),
    watch       = require("gulp-watch");

var sourceGlob = path.join("Client", "Styles", "**", "!(_)*.scss"),
    destDir = path.join("Build", "Client", "Styles");

gulp.task("client:styles", function () {
    return gulp.src(sourceGlob)
        .pipe(sourcemaps.init())
        .pipe(sass())
        .pipe(sourcemaps.write("sourcemaps"))
        .pipe(gulp.dest(destDir));
});

gulp.task("client:styles#watch", ["client:styles"], function () {
    watch(sourceGlob, function() {
        gulp.start("client:styles");
    });
});
