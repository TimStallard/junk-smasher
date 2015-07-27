"use strict";
module.exports = (app) => {
	app.get("/test", function(req, res){
		res.send("Hello, test");
	});
};
