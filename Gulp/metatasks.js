"use strict";
var gulp = require("gulp");

gulp.task("client", ["client:script", "client:styles", "client:assets"]);
gulp.task("server", ["server:script"]);

gulp.task("client#watch", ["client:script#watch", "client:styles#watch", "client:assets#watch"]);
gulp.task("server#watch", ["server:script#watch"]);

gulp.task("watch", ["client#watch", "server#watch"]);

gulp.task("default", ["client", "server"]);

gulp.task("clean", function (cb) {
    var fsExtra = require("fs-extra");

    fsExtra.remove("Build", cb);
});
