/* @flow */

import { Component } from 'react';
import PropTypes from 'prop-types';
import invariant from 'invariant';
import Msgs from './messages';
import { ensureES6Safe } from './utils';

type Resolved = { [key: string]: Function };

const isSyncModules = modules => typeof modules === 'object';
const isAsyncModules = modules => typeof modules === 'function';

class CodeSplit extends Component {
  static contextTypes = {
    registerChunkLoaded: PropTypes.func.isRequired,
    registerModule: PropTypes.func.isRequired,
    retrieveModule: PropTypes.func.isRequired,
  };

  static propTypes = {
    children: PropTypes.func.isRequired,
    // The name of the chunk to be generated by webpack.  Need not be
    // unique across instances.
    chunkName: PropTypes.string.isRequired,
    // Indicates whether the component rendering should not occur on the server,
    // deferring to asynchrnous rendering within the client.
    defer: PropTypes.bool,
    // A transpilation generated mapping of moduleHash -> moduleName
    moduleMap: PropTypes.object, // eslint-disable-line react/forbid-prop-types
    // If not transpiled then should be a mapping of moduleName -> module,
    // else it will be the async callback supporting function.
    modules: PropTypes.oneOfType([PropTypes.func, PropTypes.object]).isRequired,
    // When transpiled this will state client|server
    mode: PropTypes.string,
    // When transpiled this flag will be set, if it is not then we can consider
    // the code split feature disabled, and should render synchronously.
    transpiled: PropTypes.bool,
  };

  state = { resolving: false };

  componentWillMount() {
    const { mode, modules, moduleMap, defer, transpiled } = this.props;

    if (!transpiled) {
      // If not transpiled then likely the code split module has been disabled.
      // Let's ensure that the expected modules prop type has been provided.
      invariant(isSyncModules(modules), Msgs.InvalidModulesPropForNotTranspiled);
      return;
    }

    if (mode === 'client') {
      // Transpiled modules MUST be async for client.
      invariant(isAsyncModules(modules), Msgs.InvalidModulesPropForClient);

      if (module.hot) {
        console.warn(Msgs.HMRNotSupported); // eslint-disable-line no-console
      }
      const expectedModuleCount = Object.keys(moduleMap).length;
      const actualModuleCount = Object.keys(this.getModules()).length;
      const alreadyResolved = expectedModuleCount === actualModuleCount;
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
      invariant(isSyncModules(modules), Msgs.InvalidModulesPropForServer);

      // Lets pass the modules to our resolutionCallback which will ensure
      // that they are registered with our provider. Subsequently the state
      // can be fetched and attached to the client response.
      this.resolutionCallback(modules);
    } else {
      throw new Error('Unexpected mode');
    }
  }

  resolutionCallback = (resolved: Resolved) => {
    const { chunkName, moduleMap } = this.props;
    const { registerChunkLoaded, registerModule } = this.context;
    registerChunkLoaded(chunkName);
    Object.keys(resolved).forEach(moduleName =>
      registerModule(
        moduleMap[moduleName], // module hash
        resolved[moduleName], // actual module
      ),
    );
    // The only use of this is to ensure that a render is triggered.
    this.setState({ resolving: false });
  }

  getModules = ensureES6Safe(() => {
    const { moduleMap, transpiled, modules } = this.props;
    if (!transpiled) {
      return modules;
    }
    const { retrieveModule } = this.context;
    const moduleNames = Object.keys(moduleMap);
    const result = moduleNames.reduce((acc, moduleName) => {
      const moduleHash = moduleMap[moduleName];
      const module = retrieveModule(moduleHash);
      return module
        ? Object.assign(acc, { [moduleName]: module })
        : acc;
    }, {});
    return result;
  })

  render() {
    const { children } = this.props;

    // It's possible for the render function to return a falsey value.
    // e.g. ({ Foo }) => Foo && <Foo />
    // So for these cases we need to make sure we do the || null in order to
    // return a null instead of an actual "false" for the render result.
    return children(this.getModules()) || null;
  }
}

export default CodeSplit;
