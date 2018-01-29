'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
function verboseMessage(body) {
  return '\n================================================================================\ncode-split-component\n--------------------------------------------------------------------------------\n' + body + '\n================================================================================\n';
}

// We use environment checking so that we can provide verbose messages for
// development that can be dead code elimnated out of production builds.
exports.default = process.env.NODE_ENV === 'development' ? {
  HMRNotSupported: verboseMessage('\nSorry, code-split-component does not support hot module reloading.\n\nIf you wish to use it in a hot relaoading environment please set the \'disabled\'\noption on both the babel and webpack plugins to true.  This will force the\ncode-split-component instances to work in a synchronous manner that is friendlier\nto development and hot reloading environments.  Code splitting is a production\nbased optimisation, so hopefully this is not an issue for you.\n\ne.g.\n\nconst webpackConfig = {\n  plugins: [\n    new CodeSplitWebpackPlugin({\n      // The code-split-component doesn\'t work nicely with hot module reloading,\n      // which we use in our development builds, so we will disable it (which\n      // ensures synchronously behaviour on the CodeSplit instances).\n      disabled: process.env.NODE_ENV === \'development\',\n    }),\n  ],\n  module: {\n    rules: [\n      {\n        test: \'js\',\n        loader: \'babel\',\n        query: {\n          plugins: [\n            [\n              \'code-split-component/babel\',\n              {\n                // The code-split-component doesn\'t work nicely with hot\n                // module reloading, which we use in our development builds,\n                // so we will disable it (which ensures synchronously\n                // behaviour on the CodeSplit instances).\n                disabled: process.env.NODE_ENV === \'development\',\n              },\n            ],\n          ]\n        }\n      }\n\n    ]\n  }\n}\n'),
  InvalidModulesPropForClient: verboseMessage('\nA client rendered code-split-component should have a generated function that asynchronously resolves the modules assigned to the "modules" prop. The transpilation process appears to have failed.  Please ensure that you have the babel plugin enabled, with the correct "mode" option set (for a browser target the mode should be "client").\n'),
  InvalidModulesPropForServer: verboseMessage('\nA client rendered code-split-component should have the originally provided synchronous module map assigned to the "modules" prop. The transpilation process appears to have failed.  Please ensure that you have the babel plugin enabled, with the correct "mode" option set (for a node target the mode should be "server").\n'),
  InvalidModulesPropForNotTranspiled: verboseMessage('\nA code-split-component with code splitting disabled should have the originally provided synchronous module map assigned to the "modules" prop.\n')
}
// Optimised messages.
: {
  HMRNotSupported: 'HMR not supported',
  InvalidModulesPropForClient: '"modules" prop invalid',
  InvalidModulesPropForServer: '"modules" prop invalid',
  InvalidModulesPropForNotTranspiled: '"modules" prop invalid'
};