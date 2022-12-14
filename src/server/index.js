#!/usr/bin/env node
var debug = require("debug")("DocumentBuilderNodeJSVueBootstrap");
var app = require("./app");
var config = require("config");

app.set("port", process.env.PORT || config.get("server.port") || 3000);

var server = app.listen(app.get("port"), function() {
    debug("Express server listening on port " + server.address().port);
    console.log("Server listen for : http://localhost:" + config.get("server.port"));
});