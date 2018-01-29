'use strict';

var _babelTemplate = require('babel-template');

var _babelTemplate2 = _interopRequireDefault(_babelTemplate);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _utils = require('../utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// -----------------------------------------------------------------------------
// PRIVATES

var CODE_SPLIT_COMPONENT_NAME = 'CodeSplit'; /* eslint-disable no-console */
/* eslint-disable new-cap */
/* eslint-disable-line no-param-reassign */
/* eslint-disable import/no-extraneous-dependencies */

var INVALID_PROPS = '\nInvalid props provided to a CodeSplit component.\n\nA "chunkName" prop must be provided.  This should be a string literal containing alphanumeric characters only.\n\nA "modules" prop must be provided, and must contain an object literal that has a minimum of one property. Each property should be assigned a "require" statement which has a string literal within.\n\nFor example:\n\n  <CodeSplit chunkName="foo" modules={{ Foo: require(\'./Foo\') }>\n    { ({ Foo }) => Foo && <Foo /> }\n  </CodeSplit>';

function err(error) {
  throw new Error('\n\nERROR IN code-split-component BABEL PLUGIN TRANSPILATION ATTEMPT\n----------------------------------------------------------------\n' + error + '\n');
}

var modulesTemplate = (0, _babelTemplate2.default)('resolvedModules => require.ensure(\n  [],\n  require => resolvedModules(REQUIRES),\n  CHUNKNAME\n)');

function getProp(props, propName) {
  return props.find(function (prop) {
    return prop.name.name === propName;
  });
}

function validateProps(chunkName, modules) {
  var isValidModuleProperty = function isValidModuleProperty(element) {
    return element.type === 'ObjectProperty' && element.value.type === 'CallExpression' && element.value.callee.name === 'require' && element.value.arguments.length > 0 && element.value.arguments[0].type === 'StringLiteral';
  };

  var isInvalidModuleProperty = function isInvalidModuleProperty(element) {
    return !isValidModuleProperty(element);
  };

  var valid = chunkName && chunkName.value.type === 'StringLiteral' && modules && modules.value.type === 'JSXExpressionContainer' && modules.value.expression.type === 'ObjectExpression' && modules.value.expression.properties.findIndex(isInvalidModuleProperty) === -1;

  if (!valid) {
    err(INVALID_PROPS);
  }
}

// -----------------------------------------------------------------------------
// PLUGIN

function codeSplitBabelPlugin(_ref) {
  var t = _ref.types;

  return {
    visitor: {
      JSXElement: function JSXElement(path, state) {
        if (state.opts.disabled) {
          return;
        }

        if (path.node.openingElement.name.name === CODE_SPLIT_COMPONENT_NAME) {
          (function () {
            var props = path.node.openingElement.attributes;
            var chunkNameProp = getProp(props, 'chunkName');
            var modulesProp = getProp(props, 'modules');

            validateProps(chunkNameProp, modulesProp);

            // -------------------------------------------------------------------
            // Add the moduleMap

            // This is the base path from which the require statements will be
            // getting resolved against.
            var basePath = _path2.default.dirname(state.file.opts.filename);

            var requireProperties = modulesProp.value.expression.properties;
            var moduleMapProperties = requireProperties.map(function (moduleRequire) {
              var moduleName = moduleRequire.key.name;
              var modulePath = _path2.default.resolve(basePath, moduleRequire.value.arguments[0].value);
              var hash = (0, _utils.modulePathHash)(modulePath);
              return t.objectProperty(t.identifier(moduleName), t.stringLiteral(hash));
            });

            path.node.openingElement.attributes.push(t.jSXAttribute(t.jSXIdentifier('moduleMap'), t.jSXExpressionContainer(t.objectExpression(moduleMapProperties))));

            // -------------------------------------------------------------------
            // Transpile the modules prop into the async format

            if (state.opts.mode !== 'server') {
              // For a server we don't want to transpile the modules into
              // asynchronous code.  They'll need to be executed synchronously.
              modulesProp.value = t.jSXExpressionContainer(modulesTemplate({
                REQUIRES: t.objectExpression(modulesProp.value.expression.properties),
                CHUNKNAME: t.stringLiteral(chunkNameProp.value.value)
              }).expression);
            }

            // -------------------------------------------------------------------
            // Add the mode prop

            path.node.openingElement.attributes.push(t.jSXAttribute(t.jSXIdentifier('mode'), t.jSXExpressionContainer(t.stringLiteral(state.opts.mode || 'client'))));

            // -------------------------------------------------------------------
            // Add the transpiled prop

            path.node.openingElement.attributes.push(t.jSXAttribute(t.jSXIdentifier('transpiled'), t.jSXExpressionContainer(t.booleanLiteral(true))));
          })();
        }
      }
    }
  };
}

module.exports = codeSplitBabelPlugin;