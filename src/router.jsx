import React from 'react';
import isNode from './isNode';
import { setQueryParams } from './queryParams';
import { interceptRoute } from './interceptor';

const preparedRoutes = {};
const stack = {};
let componentId = 1;
let currentPath = isNode ? '' : window.location.pathname;
let basePath = '';
let basePathRegEx = null;
const pathUpdaters = [];

/**
 * Will define a base path that will be utilized in your routing and navigation.
 * To be called _before_ any routing or navigation happens.
 * @param {string} inBasepath
 */
export const setBasepath = (inBasepath) => {
  basePath = inBasepath;
  basePathRegEx = new RegExp(`^${basePath}`);
};

/**
 * Returns the currently used base path.
 * @returns {string}
 */
export const getBasepath = () => basePath;

const resolvePath = (inPath) => {
  if (isNode) {
    // eslint-disable-next-line global-require
    const url = require('url');
    return url.resolve(currentPath, inPath);
  }

  const current = new URL(currentPath, window.location.href);
  const resolved = new URL(inPath, current);
  return resolved.pathname;
};

export const ParentContext = React.createContext(null);

/**
 * Pass a route string to this function to receive a regular expression.
 * The transformation will be cached and if you pass the same route a second
 * time, the cached regex will be returned.
 * @param {string} inRoute
 * @returns {Array} [RegExp, propList]
 */
const prepareRoute = (inRoute) => {
  if (preparedRoutes[inRoute]) {
    return preparedRoutes[inRoute];
  }

  const preparedRoute = [
    new RegExp(
      `${inRoute.substr(0, 1) === '*' ? '' : '^'}${inRoute
        .replace(/:[a-zA-Z]+/g, '([^/]+)')
        .replace(/\*/g, '')}${inRoute.substr(-1) === '*' ? '' : '$'}`,
    ),
  ];

  const propList = inRoute.match(/:[a-zA-Z]+/g);
  preparedRoute.push(propList ? propList.map((paramName) => paramName.substr(1)) : []);

  preparedRoutes[inRoute] = preparedRoute;
  return preparedRoute;
};

let customPath = '/';
/**
 * Enables you to manually set the path from outside in a nodeJS environment,
 *  where window.history is not available.
 * @param {string} inPath
 */
export const setPath = (inPath) => {
  // eslint-disable-next-line global-require
  const url = require('url');
  customPath = url.resolve(customPath, inPath);
};

/**
 * Returns the current path of the router.
 * @returns {string}
 */
export const getPath = () => customPath;

/**
 * This hook returns the currently used URI.
 * Works in a browser context as well as for SSR.
 *
 * _Heads up:_ This will make your component render on every navigation unless you
 * set this hook to passive!
 * @param {boolean} [active=true] Will update the component upon path changes.
 *  Set to false to only retrieve the path, once.
 * @param {boolean} [withBasepath=false] Should the base path be left at the beginning of the URI?
 * @returns {string}
 */
export const usePath = (active = true, withBasepath = false) => {
  const [, setUpdate] = React.useState(0);

  React.useEffect(() => {
    if (!active) {
      return () => {};
    }

    pathUpdaters.push(setUpdate);
    return () => {
      const index = pathUpdaters.indexOf(setUpdate);
      if (index !== -1) {
        pathUpdaters.splice(index, 1);
      }
    };
  }, [setUpdate, active]);

  return withBasepath ? currentPath : currentPath.replace(basePathRegEx, '');
};

/**
 * Render all components that use path hooks.
 */
const updatePathHooks = () => {
  const now = Date.now();
  pathUpdaters.forEach((cb) => cb(now));
};

/**
 * Called from within the router. This returns either the current windows url path
 * or a already reduced path, if a parent router has already matched with a finishing
 * wildcard before.
 * @param {string} [parentRouterId]
 * @returns {string}
 */
export const getWorkingPath = (parentRouterId) => {
  if (!parentRouterId) {
    return isNode ? customPath : window.location.pathname.replace(basePathRegEx, '') || '/';
  }
  const stackEntry = stack[parentRouterId];
  if (!stackEntry) {
    // this should not be reached at all
    throw new Error('wtf');
  }

  return stackEntry.reducedPath !== null ? stackEntry.reducedPath || '/' : window.location.pathname;
};

const emptyFunc = () => null;

/**
 * This function takes two objects and compares if they have the same
 * keys and their keys have the same values assigned, so the objects are
 * basically the same.
 * @param {object} objA
 * @param {object} objB
 * @return {boolean}
 */
const objectsEqual = (objA, objB) => {
  const objAKeys = Object.keys(objA);
  const objBKeys = Object.keys(objB);

  const valueIsEqual = (key) =>
    Object.prototype.hasOwnProperty.call(objB, key) && objA[key] === objB[key];

  return objAKeys.length === objBKeys.length && objAKeys.every(valueIsEqual);
};

/**
 * This will calculate the match of a given router.
 * @param {object} stackObj
 * @param {boolean} [directCall] If its not a direct call, the process function might
 *  trigger a component render.
 */
const process = (stackObj, directCall) => {
  const {
    routerId,
    parentRouterId,
    routes,
    setUpdate,
    resultFunc,
    resultProps,
    reducedPath: previousReducedPath,
  } = stackObj;

  if (!stack[routerId]) {
    return;
  }

  const currentPathF = getWorkingPath(parentRouterId);
  let route = null;
  let targetFunction = null;
  let targetProps = null;
  let reducedPath = null;
  let anyMatched = false;

  for (let i = 0; i < routes.length; i += 1) {
    [route, targetFunction] = routes[i];
    const [regex, groupNames] = preparedRoutes[route] ? preparedRoutes[route] : prepareRoute(route);

    const result = currentPathF.match(regex);
    if (!result) {
      targetFunction = emptyFunc;
      // eslint-disable-next-line no-continue
      continue;
    }

    if (groupNames.length) {
      targetProps = {};
      for (let j = 0; j < groupNames.length; j += 1) {
        targetProps[groupNames[j]] = result[j + 1];
      }
    }

    reducedPath = currentPathF.replace(result[0], '');
    anyMatched = true;
    break;
  }

  if (!anyMatched) {
    route = null;
    targetFunction = null;
    targetProps = null;
    reducedPath = null;
  }

  const funcsDiffer = resultFunc !== targetFunction;
  const pathDiffer = reducedPath !== previousReducedPath;
  let propsDiffer = true;

  if (!funcsDiffer) {
    if (!resultProps && !targetProps) {
      propsDiffer = false;
    } else {
      propsDiffer = !(
        resultProps &&
        targetProps &&
        objectsEqual(resultProps, targetProps) === true
      );
    }

    if (!propsDiffer) {
      if (!pathDiffer) {
        return;
      }
    }
  }

  const result =
    funcsDiffer || propsDiffer
      ? targetFunction
        ? targetFunction(targetProps)
        : null
      : stackObj.result;

  Object.assign(stack[routerId], {
    result,
    reducedPath,
    matchedRoute: route,
    passContext: route ? route.substr(-1) === '*' : false,
  });

  if (!directCall && (funcsDiffer || propsDiffer || route === null)) {
    setUpdate(Date.now());
  }
};

const processStack = () => Object.values(stack).forEach(process);

if (!isNode) {
  window.addEventListener('popstate', (e) => {
    const nextPath = interceptRoute(currentPath, window.location.pathname);

    if (currentPath !== window.location.pathname && (!nextPath || nextPath === currentPath)) {
      e.preventDefault();
      e.stopPropagation();
      window.history.pushState(window.history.state, null, currentPath);
      return;
    }

    currentPath = nextPath;

    if (nextPath !== window.location.pathname) {
      window.history.replaceState(window.history.state, null, nextPath);
    }
    processStack();
    updatePathHooks();
  });
}

/**
 * If a route returns a function, instead of a react element, we need to wrap this function
 * to eventually wrap a context object around its result.
 * @param RouteContext
 * @param originalResult
 * @returns {function(): *}
 */
const wrapperFunction = (RouteContext, originalResult) =>
  function (...args) {
    return <RouteContext>{originalResult.apply(originalResult, args)}</RouteContext>;
  };

/**
 * Pass an object to this function where the keys are routes and the values
 * are functions to be executed when a route matches. Whatever your function returns
 * will be returned from the hook as well into your react component. Ideally you would
 * return components to be rendered when certain routes match, but you are not limited
 * to that.
 * @param {object} routeObj {"/someRoute": () => <Example />}
 */
export const useRoutes = (routeObj) => {
  // Each router gets an internal id to look them up again.
  const [routerId] = React.useState(componentId);
  const setUpdate = React.useState(0)[1];
  // Needed to create nested routers which use only a subset of the URL.
  const parentRouterId = React.useContext(ParentContext);

  // If we just took the last ID, increase it for the next hook.
  if (routerId === componentId) {
    componentId += 1;
  }

  // Removes the router from the stack after component unmount - it won't be processed anymore.
  React.useEffect(() => () => delete stack[routerId], [routerId]);

  let stackObj = stack[routerId];

  if (stackObj && stackObj.originalRouteObj !== routeObj) {
    stackObj = null;
  }

  if (!stackObj) {
    stackObj = {
      routerId,
      originalRouteObj: routeObj,
      routes: Object.entries(routeObj),
      setUpdate,
      parentRouterId,
      matchedRoute: null,
      reducedPath: null,
      passContext: false,
      result: null,
    };

    stack[routerId] = stackObj;

    process(stackObj, true);
  }

  React.useDebugValue(stackObj.matchedRoute);

  if (!stackObj.matchedRoute) {
    return null;
  }

  const { result } = stackObj;

  if (!stackObj.passContext) {
    return result;
  }
  // eslint-disable-next-line react/prop-types
  const RouteContext = ({ children }) => (
    <ParentContext.Provider value={routerId}>{children}</ParentContext.Provider>
  );

  if (typeof result === 'function') {
    return wrapperFunction(RouteContext, result);
  }

  return React.isValidElement(result) && result.type !== RouteContext ? (
    <RouteContext>{result}</RouteContext>
  ) : (
    result
  );
};

/**
 * Virtually navigates the browser to the given URL and re-processes all routers.
 * @param {string} newUrl The URL to navigate to. Do not mix adding GET params here and
 *  using the `getParams` argument.
 * @param {boolean} [replace=false] Should the navigation be done with a history replace
 *  to prevent back navigation by the user
 * @param {object} [queryParams] Key/Value pairs to convert into get parameters
 *  to be appended to the URL.
 * @param {boolean} [replaceQueryParams=true] Should existing query parameters
 *  be carried over, or dropped (replaced)?
 */
export const navigate = (
  url,
  replace = false,
  queryParams = null,
  replaceQueryParams = true,
  state = null,
) => {
  const newUrl = interceptRoute(currentPath, resolvePath(url));

  if (!newUrl || newUrl === currentPath) {
    return;
  }

  currentPath = newUrl;

  if (isNode) {
    setPath(newUrl);
    processStack();
    updatePathHooks();
    return;
  }

  const finalURL = basePathRegEx
    ? newUrl.match(basePathRegEx)
      ? newUrl
      : basePath + newUrl
    : newUrl;

  window.history[`${replace ? 'replace' : 'push'}State`](state, null, finalURL);
  processStack();
  updatePathHooks();

  if (queryParams) {
    setQueryParams(queryParams, replaceQueryParams);
  }
};
