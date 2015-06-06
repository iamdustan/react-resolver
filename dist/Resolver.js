"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _Container = require("./Container");

var _Container2 = _interopRequireDefault(_Container);

var _ResolverError = require("./ResolverError");

var _ResolverError2 = _interopRequireDefault(_ResolverError);

var _jsCspSrcCsp = require("./js-csp/src/csp");

var _jsCspSrcCsp2 = _interopRequireDefault(_jsCspSrcCsp);

/*eslint no-unused-vars:0 */

var myRenderTo = function myRenderTo(element, renderFunc) {
  Resolver.server = true;
  var resolver = new Resolver(); /*eslint no-use-before-define:0*/
  var context = _react2["default"].createElement(
    _Container2["default"],
    { resolver: resolver },
    element
  );
  return (0, _jsCspSrcCsp.go)(regeneratorRuntime.mark(function callee$1$0() {
    var html;
    return regeneratorRuntime.wrap(function callee$1$0$(context$2$0) {
      while (1) switch (context$2$0.prev = context$2$0.next) {
        case 0:
          context$2$0.next = 2;
          return resolver.finish(function () {
            return renderFunc(context);
          });

        case 2:
          html = context$2$0.sent;

          resolver.freeze();
          return context$2$0.abrupt("return", {
            data: resolver.states,
            toString: function toString() {
              return html;
            }
          });

        case 5:
        case "end":
          return context$2$0.stop();
      }
    }, callee$1$0, this);
  }));
};

var Resolver = (function () {
  function Resolver() {
    var states = arguments[0] === undefined ? {} : arguments[0];

    _classCallCheck(this, Resolver);

    this.channels = [];
    this.frozen = false;
    this.awaitChan = (0, _jsCspSrcCsp.chan)();
    this.refreshChan = (0, _jsCspSrcCsp.chan)();

    this.states = states;
  }

  _createClass(Resolver, [{
    key: "finish",
    value: function finish(renderer) {
      var values = arguments[1] === undefined ? [] : arguments[1];

      var self = this;
      return (0, _jsCspSrcCsp.go)(regeneratorRuntime.mark(function callee$2$0() {
        var total;
        return regeneratorRuntime.wrap(function callee$2$0$(context$3$0) {
          while (1) switch (context$3$0.prev = context$3$0.next) {
            case 0:
              total = self.channels.length;

            case 1:
              if (!true) {
                context$3$0.next = 14;
                break;
              }

              renderer();

              if (!(self.channels.length > total)) {
                context$3$0.next = 11;
                break;
              }

              total = self.channels.length;
              context$3$0.next = 7;
              return self.awaitChan;

            case 7:
              context$3$0.t0 = context$3$0.sent;
              values = values.concat(context$3$0.t0);
              context$3$0.next = 12;
              break;

            case 11:
              return context$3$0.abrupt("return", renderer());

            case 12:
              context$3$0.next = 1;
              break;

            case 14:
            case "end":
              return context$3$0.stop();
          }
        }, callee$2$0, this);
      }));
    }
  }, {
    key: "freeze",
    value: function freeze() {
      this.frozen = true;
    }
  }, {
    key: "fulfillState",
    value: function fulfillState(state, callback) {
      state.error = undefined;
      state.fulfilled = true;
      state.rejected = false;

      return callback ? callback(state) : state;
    }
  }, {
    key: "getContainerState",
    value: function getContainerState(container) {
      var id = container.id;

      if (!id) {
        throw new ReferenceError("" + container.constructor.displayName + " should have an ID");
      }

      var state = this.states[id] || this.rehydrate(id) || {
        fulfilled: false,
        rejected: false,
        values: {}
      };

      if (!this.states[id]) {
        this.states[id] = state;
      }

      return state;
    }
  }, {
    key: "clearContainerState",
    value: function clearContainerState(container) {
      var _this = this;

      var id = container.id;

      Object.keys(this.states).filter(function (key) {
        return key.indexOf(id) === 0;
      }).forEach(function (key) {
        return _this.states[key] = undefined;
      });
      var self = this;
      (0, _jsCspSrcCsp.go)(regeneratorRuntime.mark(function callee$2$0() {
        return regeneratorRuntime.wrap(function callee$2$0$(context$3$0) {
          while (1) switch (context$3$0.prev = context$3$0.next) {
            case 0:
              context$3$0.next = 2;
              return self.refreshChan.close();

            case 2:
            case "end":
              return context$3$0.stop();
          }
        }, callee$2$0, this);
      }));
    }
  }, {
    key: "rejectState",
    value: function rejectState(error, state, callback) {
      state.error = error;
      state.fulfilled = false;
      state.rejected = true;

      if (callback) {
        callback(state);
      }
      throw new Error("" + this.constructor.displayName + " was rejected: " + error);
    }
  }, {
    key: "rehydrate",
    value: function rehydrate(id) {
      if (typeof __resolver__ === "undefined") {
        return null;
      }
      return __resolver__[id]; /*eslint no-undef:0*/
    }
  }, {
    key: "resolve",
    value: function resolve(container, callback) {
      var self = this;
      var asyncProps = container.props.resolve || {};
      var state = this.getContainerState(container);
      var asyncKeys = Object.keys(asyncProps)
      // Assign existing prop values
      .filter(function (asyncProp) {
        if (container.props.hasOwnProperty(asyncProp)) {
          state.values[asyncProp] = container.props[asyncProp];

          return false;
        }

        return true;
      })
      // Filter out pre-loaded values
      .filter(function (asyncProp) {
        return !state.values.hasOwnProperty(asyncProp);
      });

      if (!asyncKeys.length) {
        this.fulfillState(state, callback);
        (0, _jsCspSrcCsp.go)(regeneratorRuntime.mark(function callee$2$0() {
          return regeneratorRuntime.wrap(function callee$2$0$(context$3$0) {
            while (1) switch (context$3$0.prev = context$3$0.next) {
              case 0:
                context$3$0.next = 2;
                return (0, _jsCspSrcCsp.put)(self.awaitChan, []);

              case 2:
              case "end":
                return context$3$0.stop();
            }
          }, callee$2$0, this);
        }));
      }

      if (this.frozen) {
        throw new _ResolverError2["default"](["Resolver is frozen for server rendering.", "" + container.constructor.displayName + " (#" + container.id + ") should have already resolved" //,
        //i've only commented this out because it scuppers my sublime text colouring
        //`"${asyncKeys.join("\", \"")}". (http://git.io/vvvkr)`,
        ].join(" "));
      }

      var channels = asyncKeys.map(function (prop) {
        var valueOf = container.props.resolve[prop];
        var value = container.props.hasOwnProperty(prop) ? container.props[prop] : valueOf(container.props.props, container.props.context);
        return { prop: prop, value: value };
      });
      var rejectState = this.rejectState;
      var fulfillState = this.fulfillState;

      this.channels = this.channels.concat(channels);
      (0, _jsCspSrcCsp.go)(regeneratorRuntime.mark(function callee$2$0() {
        var _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, channel, result, myChannels, channelResult;

        return regeneratorRuntime.wrap(function callee$2$0$(context$3$0) {
          while (1) switch (context$3$0.prev = context$3$0.next) {
            case 0:
              context$3$0.prev = 0;
              _iteratorNormalCompletion = true;
              _didIteratorError = false;
              _iteratorError = undefined;
              context$3$0.prev = 4;
              _iterator = channels[Symbol.iterator]();

            case 6:
              if (_iteratorNormalCompletion = (_step = _iterator.next()).done) {
                context$3$0.next = 17;
                break;
              }

              channel = _step.value;
              context$3$0.next = 10;
              return channel.value;

            case 10:
              result = channel.result = context$3$0.sent;

              if (!(Object.prototype.toString.call(result) === "[object Error]")) {
                context$3$0.next = 13;
                break;
              }

              throw result;

            case 13:
              state.values[channel.prop] = channel.result; // = result;

            case 14:
              _iteratorNormalCompletion = true;
              context$3$0.next = 6;
              break;

            case 17:
              context$3$0.next = 23;
              break;

            case 19:
              context$3$0.prev = 19;
              context$3$0.t0 = context$3$0["catch"](4);
              _didIteratorError = true;
              _iteratorError = context$3$0.t0;

            case 23:
              context$3$0.prev = 23;
              context$3$0.prev = 24;

              if (!_iteratorNormalCompletion && _iterator["return"]) {
                _iterator["return"]();
              }

            case 26:
              context$3$0.prev = 26;

              if (!_didIteratorError) {
                context$3$0.next = 29;
                break;
              }

              throw _iteratorError;

            case 29:
              return context$3$0.finish(26);

            case 30:
              return context$3$0.finish(23);

            case 31:
              fulfillState.bind(self)(state, callback);

              if (!Resolver.server) {
                context$3$0.next = 35;
                break;
              }

              context$3$0.next = 35;
              return (0, _jsCspSrcCsp.put)(self.awaitChan, channels.filter(function (p) {
                return p.result;
              }).map(function (p) {
                return p.result;
              }));

            case 35:
              context$3$0.next = 40;
              break;

            case 37:
              context$3$0.prev = 37;
              context$3$0.t1 = context$3$0["catch"](0);

              rejectState.bind(self)(context$3$0.t1, state, callback);

            case 40:
              if (Resolver.server) {
                context$3$0.next = 51;
                break;
              }

              myChannels = channels.map(function (c) {
                return c.value;
              }).concat([self.refreshChan]);

            case 42:
              context$3$0.next = 44;
              return (0, _jsCspSrcCsp.alts)(myChannels);

            case 44:
              context$3$0.t2 = (channelResult = context$3$0.sent).channel;

              if (!(context$3$0.t2 !== self.refreshChan)) {
                context$3$0.next = 51;
                break;
              }

              channel = channels[channels.map(function (c) {
                return c.value;
              }).indexOf(channelResult.channel)];
              /*eslint no-loop-func:0*/
              state.values[channel.prop] = channel.result = channelResult.value;
              fulfillState.bind(self)(state, callback);
              context$3$0.next = 42;
              break;

            case 51:
            case "end":
              return context$3$0.stop();
          }
        }, callee$2$0, this, [[0, 37], [4, 19, 23, 31], [24,, 26, 30]]);
      }));
    }
  }], [{
    key: "createContainer",
    value: function createContainer(Component) {
      var props = arguments[1] === undefined ? {} : arguments[1];

      if (!Component.hasOwnProperty("displayName")) {
        throw new ReferenceError("Resolver.createContainer requires wrapped component to have `displayName`");
      }

      var ComponentContainer = (function (_React$Component) {
        function ComponentContainer() {
          _classCallCheck(this, ComponentContainer);

          if (_React$Component != null) {
            _React$Component.apply(this, arguments);
          }
        }

        _inherits(ComponentContainer, _React$Component);

        _createClass(ComponentContainer, [{
          key: "render",
          value: function render() {
            return _react2["default"].createElement(_Container2["default"], _extends({
              component: Component,
              context: this.context,
              props: this.props
            }, props));
          }
        }]);

        return ComponentContainer;
      })(_react2["default"].Component);

      ComponentContainer.childContextTypes = props.childContextTypes;
      ComponentContainer.contextTypes = props.contextTypes;
      ComponentContainer.displayName = "" + Component.displayName + "Container";

      return ComponentContainer;
    }
  }, {
    key: "render",
    value: function render(element, node) {
      var instance = arguments[2] === undefined ? new Resolver() : arguments[2];

      Resolver.server = false;
      _react2["default"].render(_react2["default"].createElement(
        _Container2["default"],
        { resolver: instance },
        element
      ), node);

      return instance;
    }
  }, {
    key: "renderToString",
    value: function renderToString(element) {
      return myRenderTo(element, _react2["default"].renderToString);
    }
  }, {
    key: "renderToStaticMarkup",
    value: function renderToStaticMarkup(element) {
      return myRenderTo(element, _react2["default"].renderToStaticMarkup);
    }
  }]);

  return Resolver;
})();

exports["default"] = Resolver;
module.exports = exports["default"];
//var html = React.renderToStaticMarkup(context);
/*eslint no-constant-condition:0*/

//replace with alts