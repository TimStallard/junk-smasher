"use strict";
var gulp        = require("gulp"),
    source      = require("vinyl-source-stream"),
    buffer      = require("vinyl-buffer"),
    sourcemaps  = require("gulp-sourcemaps"),
    uglify      = require("gulp-uglify"),
    browserify  = require("browserify"),
    watchify    = require("watchify"),
    path        = require("path");

watchify.fromArgs = require("watchify/bin/args");

var entryFile = path.join("Client", "Script", "main.js");
var destDir   = path.join("Build", "Client", "Script");
var bundleName = "main.bundle.js";

var basicBundler, watchingBundler;

function generateBundle(bundler) {
    return bundler
        .bundle()
        .pipe(source(bundleName))
        .pipe(buffer())
        .pipe(sourcemaps.init({ loadMaps: true }))
        .pipe(uglify({ mangle: false }))
        .pipe(sourcemaps.write("sourcemaps"))
        .pipe(gulp.dest(destDir));
}

gulp.task("client:script", function () {
    if (!basicBundler) {
        basicBundler = browserify({ debug: true })
          .add(entryFile)
          .transform("babelify");
    }

	return generateBundle(basicBundler);
});

gulp.task("client:script#watch", function () {
    if (!watchingBundler) {
        watchingBundler = watchify.fromArgs({ debug: true })
            .add(entryFile)
            .transform("babelify");

        watchingBundler.on("update", function () {
            gulp.start("client:script#watch");
        });
    }

    return generateBundle(watchingBundler);
});
