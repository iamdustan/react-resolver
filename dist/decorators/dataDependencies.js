"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _index = require("../index");

exports["default"] = function (resolve) {
    return function (target) {
        return _index.Resolver.createContainer(target, { resolve: resolve });
    };
};

var errorRender = function errorRender(render) {
    return function (target) {
        target.errorRender = render;
        return target;
    };
};

exports.errorRender = errorRender;
var waitRender = function waitRender(render) {
    return function (target) {
        target.waitRender = render;
        return target;
    };
};
exports.waitRender = waitRender;