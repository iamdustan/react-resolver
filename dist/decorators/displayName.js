"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

exports["default"] = function (name) {
    return function (target) {
        target.displayName = name;
        return target;
    };
};

module.exports = exports["default"];