import React from 'react';

let incrementalId = 1;

const interceptors = [];

export const interceptRoute = (previousRoute, nextRoute) => {
  if (!interceptors.length) {
    return nextRoute;
  }

  return interceptors.reduceRight(
    (nextNewRoute, interceptor) => (nextNewRoute === previousRoute
      ? nextNewRoute
      : interceptor.handlerFunction(previousRoute, nextNewRoute)),
    nextRoute
  );
};

const get = (componentId) => interceptors.find((obj) => obj.componentId === componentId) || null;
const remove = (componentId) => {
  const index = interceptors.findIndex((obj) => obj.componentId === componentId);
  if (index !== -1) {
    interceptors.splice(index, 1);
  }
};

export const useInterceptor = (handlerFunction) => {
  const [componentId] = React.useState(incrementalId += 1);

  let obj = get(componentId);

  if (!obj) {
    obj = {
      componentId,
      stop: () => remove(componentId),
      handlerFunction
    };

    interceptors.unshift(obj);
  }

  React.useEffect(() => () => obj.stop(), []);

  return obj.stop;
};
