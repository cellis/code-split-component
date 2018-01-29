'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _react = require('react');

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _invariant = require('invariant');

var _invariant2 = _interopRequireDefault(_invariant);

var _messages = require('./messages');

var _messages2 = _interopRequireDefault(_messages);

var _utils = require('./utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var isSyncModules = function isSyncModules(modules) {
  return (typeof modules === 'undefined' ? 'undefined' : _typeof(modules)) === 'object';
};
var isAsyncModules = function isAsyncModules(modules) {
  return typeof modules === 'function';
};

var CodeSplit = function (_Component) {
  _inherits(CodeSplit, _Component);

  function CodeSplit() {
    var _ref;

    var _temp, _this, _ret;

    _classCallCheck(this, CodeSplit);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = CodeSplit.__proto__ || Object.getPrototypeOf(CodeSplit)).call.apply(_ref, [this].concat(args))), _this), _this.state = { resolving: false }, _this.resolutionCallback = function (resolved) {
      var _this$props = _this.props,
          chunkName = _this$props.chunkName,
          moduleMap = _this$props.moduleMap;
      var _this$context = _this.context,
          registerChunkLoaded = _this$context.registerChunkLoaded,
          registerModule = _this$context.registerModule;

      registerChunkLoaded(chunkName);
      Object.keys(resolved).forEach(function (moduleName) {
        return registerModule(moduleMap[moduleName], // module hash
        resolved[moduleName]);
      });
      // The only use of this is to ensure that a render is triggered.
      _this.setState({ resolving: false });
    }, _this.getModules = (0, _utils.ensureES6Safe)(function () {
      var _this$props2 = _this.props,
          moduleMap = _this$props2.moduleMap,
          transpiled = _this$props2.transpiled,
          modules = _this$props2.modules;

      if (!transpiled) {
        return modules;
      }
      var retrieveModule = _this.context.retrieveModule;

      var moduleNames = Object.keys(moduleMap);
      var result = moduleNames.reduce(function (acc, moduleName) {
        var moduleHash = moduleMap[moduleName];
        var module = retrieveModule(moduleHash);
        return module ? Object.assign(acc, _defineProperty({}, moduleName, module)) : acc;
      }, {});
      return result;
    }), _temp), _possibleConstructorReturn(_this, _ret);
  }

  _createClass(CodeSplit, [{
    key: 'componentWillMount',
    value: function componentWillMount() {
      var _props = this.props,
          mode = _props.mode,
          modules = _props.modules,
          moduleMap = _props.moduleMap,
          defer = _props.defer,
          transpiled = _props.transpiled;


      if (!transpiled) {
        // If not transpiled then likely the code split module has been disabled.
        // Let's ensure that the expected modules prop type has been provided.
        (0, _invariant2.default)(isSyncModules(modules), _messages2.default.InvalidModulesPropForNotTranspiled);
        return;
      }

      if (mode === 'client') {
        // Transpiled modules MUST be async for client.
        (0, _invariant2.default)(isAsyncModules(modules), _messages2.default.InvalidModulesPropForClient);

        if (module.hot) {
          console.warn(_messages2.default.HMRNotSupported); // eslint-disable-line no-console
        }
        var expectedModuleCount = Object.keys(moduleMap).length;
        var actualModuleCount = Object.keys(this.getModules()).length;
        var alreadyResolved = expectedModuleCount === actualModuleCount;
        if (!alreadyResolved) {
          this.setState({ resolving: true });
          // Fire the modules function, which will resolve the modules from
          // the server. We provide our resolutionCallback to handle the response.
          modules(this.resolutionCallback);
        }
      } else if (mode === 'server') {
        if (defer) {
          // Do nothing, rendering deferred to the client.
          return;
        }

        // Transpiled modules MUST be sync for server.
        (0, _invariant2.default)(isSyncModules(modules), _messages2.default.InvalidModulesPropForServer);

        // Lets pass the modules to our resolutionCallback which will ensure
        // that they are registered with our provider. Subsequently the state
        // can be fetched and attached to the client response.
        this.resolutionCallback(modules);
      } else {
        throw new Error('Unexpected mode');
      }
    }
  }, {
    key: 'render',
    value: function render() {
      var children = this.props.children;

      // It's possible for the render function to return a falsey value.
      // e.g. ({ Foo }) => Foo && <Foo />
      // So for these cases we need to make sure we do the || null in order to
      // return a null instead of an actual "false" for the render result.

      return children(this.getModules()) || null;
    }
  }]);

  return CodeSplit;
}(_react.Component);

CodeSplit.contextTypes = {
  registerChunkLoaded: _propTypes2.default.func.isRequired,
  registerModule: _propTypes2.default.func.isRequired,
  retrieveModule: _propTypes2.default.func.isRequired
};
CodeSplit.propTypes = {
  children: _propTypes2.default.func.isRequired,
  // The name of the chunk to be generated by webpack.  Need not be
  // unique across instances.
  chunkName: _propTypes2.default.string.isRequired,
  // Indicates whether the component rendering should not occur on the server,
  // deferring to asynchrnous rendering within the client.
  defer: _propTypes2.default.bool,
  // A transpilation generated mapping of moduleHash -> moduleName
  moduleMap: _propTypes2.default.object, // eslint-disable-line react/forbid-prop-types
  // If not transpiled then should be a mapping of moduleName -> module,
  // else it will be the async callback supporting function.
  modules: _propTypes2.default.oneOfType([_propTypes2.default.func, _propTypes2.default.object]).isRequired,
  // When transpiled this will state client|server
  mode: _propTypes2.default.string,
  // When transpiled this flag will be set, if it is not then we can consider
  // the code split feature disabled, and should render synchronously.
  transpiled: _propTypes2.default.bool
};
exports.default = CodeSplit;