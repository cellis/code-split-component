'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var CodeSplitProvider = function (_Component) {
  _inherits(CodeSplitProvider, _Component);

  function CodeSplitProvider() {
    var _ref;

    var _temp, _this, _ret;

    _classCallCheck(this, CodeSplitProvider);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = CodeSplitProvider.__proto__ || Object.getPrototypeOf(CodeSplitProvider)).call.apply(_ref, [this].concat(args))), _this), _this.chunks = {}, _this.modules = {}, _this.registerChunkLoaded = function (chunkName) {
      _this.chunks[chunkName] = true;
      if (_this.props.context) {
        _this.props.context.registerChunk(chunkName);
      }
    }, _this.registerModule = function (moduleHash, module) {
      _this.modules[moduleHash] = module;
      if (_this.props.context) {
        _this.props.context.registerModule(moduleHash);
      }
    }, _this.retrieveModule = function (moduleHash) {
      return _this.modules[moduleHash];
    }, _temp), _possibleConstructorReturn(_this, _ret);
  }
  // Prop types.


  // Context types


  // Members.


  _createClass(CodeSplitProvider, [{
    key: 'getChildContext',
    value: function getChildContext() {
      return {
        registerChunkLoaded: this.registerChunkLoaded,
        registerModule: this.registerModule,
        retrieveModule: this.retrieveModule
      };
    }
  }, {
    key: 'componentWillMount',
    value: function componentWillMount() {
      var _this2 = this;

      var state = this.props.state;

      if (state) {
        state.forEach(function (_ref2) {
          var id = _ref2.id,
              module = _ref2.module;
          return _this2.registerModule(id, module);
        });
      }
    }
  }, {
    key: 'render',
    value: function render() {
      return _react.Children.only(this.props.children);
    }
  }]);

  return CodeSplitProvider;
}(_react.Component);

CodeSplitProvider.propTypes = {
  children: _propTypes2.default.element.isRequired,
  context: _propTypes2.default.object, // eslint-disable-line
  state: _propTypes2.default.arrayOf(_propTypes2.default.shape({
    id: _propTypes2.default.string.isRequired,
    module: _propTypes2.default.func.isRequired
  }))
};
CodeSplitProvider.childContextTypes = {
  registerChunkLoaded: _propTypes2.default.func.isRequired,
  registerModule: _propTypes2.default.func.isRequired,
  retrieveModule: _propTypes2.default.func.isRequired
};
exports.default = CodeSplitProvider;