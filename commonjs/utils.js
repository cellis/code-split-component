'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.modulePathHash = exports.ensureES6Safe = exports.es6Safe = undefined;

var _md = require('md5');

var _md2 = _interopRequireDefault(_md);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Given the module, if the module is an ES6 module, then the "default" is
// returned.
var es6Safe = exports.es6Safe = function es6Safe(module) {
  return module && module.default ? module.default : module;
};

/**
 * Ensures that the "default" export is returned if the resolved modules
 * are ES6 modules.
 */


var ensureES6Safe = exports.ensureES6Safe = function ensureES6Safe(x) {
  return function () {
    var result = x();
    Object.keys(result).forEach(function (key) {
      result[key] = es6Safe(result[key]);
    });
    return result;
  };
};

/**
 * This exists so that we can create a deterministic unique value to identify
 * a module with. We use the module's absolute path as that is unique, but
 * we can't just use the path in the module maps as these will be served to
 * browsers.  Therefore we hash the filepath.
 */
var modulePathHash = exports.modulePathHash = function modulePathHash(modulePath) {
  var cleansedPath = modulePath
  // remove index files as they would be equivalent to just the folder specified
  .replace(/[/\\]index\.jsx?$/, '')
  // remove any extension
  .replace(/.jsx?$/, '')
  // We don't want base path as it changes per environment.
  .replace(process.cwd(), '');
  // This _should_ be enough of the hash for uniqueness.
  // Anything more starts to pump up the bundle sizes.
  return (0, _md2.default)(cleansedPath).substr(0, 12);
};