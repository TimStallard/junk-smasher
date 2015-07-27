"use strict";
const angular = require("angular");

const templateApp = angular.module("templateApp", []);

templateApp.controller("TemplateController", function ($scope) {
	$scope.test = [
		"World",
		"Galaxy",
		"Universe"
	];
});
