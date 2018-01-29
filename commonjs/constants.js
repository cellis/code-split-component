'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
// The identifier to use for window/global binding of the object that maps our
// chunk names and module path hashes to their respective webpack identifiers.
var MODULE_CHUNK_MAPPING_IDENTIFIER = exports.MODULE_CHUNK_MAPPING_IDENTIFIER = '__CODE_SPLIT_MODULE_CHUNK_MAPPING__';

// The identifier to use for window/global binding of the object that
// represents which chunks and modules were loaded/rendered for a server request.
var STATE_IDENTIFIER = exports.STATE_IDENTIFIER = '__CODE_SPLIT_STATE__';