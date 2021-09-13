// Type definitions for hookrouter 2.2
// Project: https://github.com/Paratron/hookrouter
// Definitions by: Mete Can Eris <https://github.com/mcaneris>
//                 Sam Calvert <https://github.com/sam-outschool>
// Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped
// TypeScript Version: 3.4
import * as React from 'react';

type InterceptedPath = string | null;
interface AProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string;
}
interface QueryParams {
  [key: string]: any;
}
interface RouteObject<T = any> {
  [key: string]: (params: QueryParams) => T;
}
export function setLinkProps(props: AProps): AProps;
export function A(props: AProps): React.ReactHTMLElement<HTMLAnchorElement>;
export function confirmNavigation(): void;
export function resetPath(): void;
export function stopInterception(): void;
export function useControlledInterceptor(): [
  InterceptedPath,
  typeof confirmNavigation,
  typeof resetPath,
  typeof stopInterception
];
export function interceptRoute(previousRoute: string, nextRoute: string): string[];
export function get(componentId: number): RouteObject | null;
export function remove(componentId: number): void;
export function useInterceptor(
  handlerFn: (currentPath: string, nextPath: string) => string
): () => typeof remove;
export function setQueryParams(inObj: QueryParams, replace?: boolean): void;
export function getQueryParams(): QueryParams;
export function queryStringToObject(inStr: string): QueryParams;
export function objectToQueryString(inObj: QueryParams): string;
export function useQueryParams(): [QueryParams, typeof setQueryParams];
export function useRedirect(
  fromURL: string,
  toURL: string,
  queryParams?: QueryParams | null,
  replace?: boolean
): void;
export function setBasepath(inBasepath: string): void;
export function getBasepath(): string;
export function resolvePath(inPath: string): string;
export function prepareRoute(inRoute: string): [RegExp, string[]];
export function navigate(
  url: string,
  replace?: boolean,
  queryParams?: QueryParams | null,
  replaceQueryParams?: boolean
): void;
export function setPath(inPath: string): void;
export function getPath(): string;
export function usePath(active?: boolean, withBasePath?: boolean): string;
export function updatePathHooks(): void;
export function getWorkingPath(parentRouterId: string): string;
export function useRoutes<T = any>(routeObj: RouteObject<T>): T | null;
export function useTitle(inString: string): void;
export function getTitle(): string;
