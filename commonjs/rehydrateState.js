'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = rehydrateState;

var _constants = require('./constants');

var _utils = require('./utils');

/* eslint-disable no-undef */
/* eslint-disable no-console */

function rehydrateState() {
  return new Promise(function (resolve) {
    if (
    // Has this source been bundled by webpack, making the following global
    // available?
    // $FlowFixMe
    typeof __webpack_require__ === 'undefined'
    // Running in the browser?
    || typeof window === 'undefined'
    // Has the rehydrate state been bound to the window object?
    || typeof window[_constants.STATE_IDENTIFIER] === 'undefined'
    // Has the module/chunk mapping been bound to the window object? If not
    // there is no point continuing as we won't know how to map the
    // moduleHash's to the correct webpack identifiers.
    || typeof window[_constants.MODULE_CHUNK_MAPPING_IDENTIFIER] === 'undefined') {
      // Should we warn the user?  If they are using the rehydrateState
      // function perhaps they are expecting it to actually do some
      // rehydrating. :)
      resolve();
      return;
    }

    var moduleChunkMap = window[_constants.MODULE_CHUNK_MAPPING_IDENTIFIER];
    var _window$STATE_IDENTIF = window[_constants.STATE_IDENTIFIER],
        chunks = _window$STATE_IDENTIF.chunks,
        modules = _window$STATE_IDENTIF.modules;


    var safelyFetchChunk = function safelyFetchChunk(chunkName) {
      try {
        return __webpack_require__.e(moduleChunkMap.chunks[chunkName]);
      } catch (err) {
        // We swallow the error. It's possible an active webpack plugin did
        // some "shifting around" of our chunks.
        return false;
      }
    };

    var resolveModule = function resolveModule(moduleHash) {
      return {
        id: moduleHash,
        module: (0, _utils.es6Safe)(__webpack_require__(moduleChunkMap.modules[moduleHash]))
      };
    };

    Promise.all(chunks.map(safelyFetchChunk)).then(function () {
      return modules.map(resolveModule);
    }).then(resolve).catch(function (err) {
      console.log('An error occurred whilst attempting to rehydrate code-split-component.', err, err.stack);
    });
  });
}