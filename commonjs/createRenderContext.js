"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = createRenderContext;

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function createRenderContext() {
  var chunks = new Set();
  var modules = new Set();

  var registerChunk = function registerChunk(chunkName) {
    return chunks.add(chunkName);
  };
  var registerModule = function registerModule(moduleId) {
    return modules.add(moduleId);
  };

  var getState = function getState() {
    return {
      // $FlowFixMe
      chunks: [].concat(_toConsumableArray(chunks)),
      // $FlowFixMe
      modules: [].concat(_toConsumableArray(modules))
    };
  };

  return {
    registerChunk: registerChunk,
    registerModule: registerModule,
    getState: getState
  };
}