function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

import React from "react";
import { navigate, getBasepath } from "./router";
/**
 * Accepts HTML `a`-tag properties, requiring `href` and optionally
 * `onClick`, which are appropriately wrapped to allow other
 * frameworks to be used for creating `hookrouter` navigatable links.
 *
 * If `onClick` is supplied, then the navigation will happen before
 * the supplied `onClick` action!
 *
 * @example
 *
 * &lt;MyFrameworkLink what="ever" {...useLink({ href: '/' })}&gt;
 *   Link text
 * &lt;/MyFrameworkLink&gt;
 *
 * @param {Object} props Requires `href`. `onClick` is optional.
 */

export const setLinkProps = props => {
  const onClick = e => {
    if (!e.shiftKey && !e.ctrlKey && !e.altKey && !e.metaKey && props.target !== "_blank") {
      e.preventDefault(); // prevent the link from actually navigating

      navigate(e.currentTarget.href);
    }

    if (props.onClick) {
      props.onClick(e);
    }
  };

  const href = props.href.substr(0, 1) === '/' ? getBasepath() + props.href : props.href;
  return { ...props,
    href,
    onClick
  };
};
/**
 * Accepts standard HTML `a`-tag properties. `href` and, optionally,
 * `onClick` are used to create links that work with `hookrouter`.
 *
 * @example
 *
 * &lt;A href="/" target="_blank"&gt;
 *   Home
 * &lt;/A&gt;
 *
 * @param {Object} props Requires `href`. `onClick` is optional
 */

export const A = React.forwardRef((props, ref) => React.createElement("a", _extends({
  ref: ref
}, setLinkProps(props))));
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9MaW5rLmpzIl0sIm5hbWVzIjpbIlJlYWN0IiwibmF2aWdhdGUiLCJnZXRCYXNlcGF0aCIsInNldExpbmtQcm9wcyIsInByb3BzIiwib25DbGljayIsImUiLCJzaGlmdEtleSIsImN0cmxLZXkiLCJhbHRLZXkiLCJtZXRhS2V5IiwidGFyZ2V0IiwicHJldmVudERlZmF1bHQiLCJjdXJyZW50VGFyZ2V0IiwiaHJlZiIsInN1YnN0ciIsIkEiLCJmb3J3YXJkUmVmIiwicmVmIl0sIm1hcHBpbmdzIjoiOztBQUFBLE9BQU9BLEtBQVAsTUFBa0IsT0FBbEI7QUFDQSxTQUFRQyxRQUFSLEVBQWtCQyxXQUFsQixRQUFvQyxVQUFwQztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUNBLE9BQU8sTUFBTUMsWUFBWSxHQUFJQyxLQUFELElBQVc7QUFDdEMsUUFBTUMsT0FBTyxHQUFJQyxDQUFELElBQU87QUFDdEIsUUFBSSxDQUFDQSxDQUFDLENBQUNDLFFBQUgsSUFBZSxDQUFDRCxDQUFDLENBQUNFLE9BQWxCLElBQTZCLENBQUNGLENBQUMsQ0FBQ0csTUFBaEMsSUFBMEMsQ0FBQ0gsQ0FBQyxDQUFDSSxPQUE3QyxJQUF3RE4sS0FBSyxDQUFDTyxNQUFOLEtBQWlCLFFBQTdFLEVBQXVGO0FBQ3RGTCxNQUFBQSxDQUFDLENBQUNNLGNBQUYsR0FEc0YsQ0FDbEU7O0FBQ3BCWCxNQUFBQSxRQUFRLENBQUNLLENBQUMsQ0FBQ08sYUFBRixDQUFnQkMsSUFBakIsQ0FBUjtBQUNBOztBQUVELFFBQUlWLEtBQUssQ0FBQ0MsT0FBVixFQUFtQjtBQUNsQkQsTUFBQUEsS0FBSyxDQUFDQyxPQUFOLENBQWNDLENBQWQ7QUFDQTtBQUNELEdBVEQ7O0FBVUEsUUFBTVEsSUFBSSxHQUNUVixLQUFLLENBQUNVLElBQU4sQ0FBV0MsTUFBWCxDQUFrQixDQUFsQixFQUFxQixDQUFyQixNQUE0QixHQUE1QixHQUNHYixXQUFXLEtBQUtFLEtBQUssQ0FBQ1UsSUFEekIsR0FFR1YsS0FBSyxDQUFDVSxJQUhWO0FBS0EsU0FBTyxFQUFDLEdBQUdWLEtBQUo7QUFBV1UsSUFBQUEsSUFBWDtBQUFpQlQsSUFBQUE7QUFBakIsR0FBUDtBQUNBLENBakJNO0FBbUJQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFDQSxPQUFPLE1BQU1XLENBQUMsR0FBR2hCLEtBQUssQ0FBQ2lCLFVBQU4sQ0FDZCxDQUFDYixLQUFELEVBQVFjLEdBQVIsS0FBZ0I7QUFBRyxFQUFBLEdBQUcsRUFBRUE7QUFBUixHQUFpQmYsWUFBWSxDQUFDQyxLQUFELENBQTdCLEVBREYsQ0FBViIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBSZWFjdCBmcm9tIFwicmVhY3RcIjtcclxuaW1wb3J0IHtuYXZpZ2F0ZSwgZ2V0QmFzZXBhdGh9IGZyb20gXCIuL3JvdXRlclwiO1xyXG5cclxuLyoqXHJcbiAqIEFjY2VwdHMgSFRNTCBgYWAtdGFnIHByb3BlcnRpZXMsIHJlcXVpcmluZyBgaHJlZmAgYW5kIG9wdGlvbmFsbHlcclxuICogYG9uQ2xpY2tgLCB3aGljaCBhcmUgYXBwcm9wcmlhdGVseSB3cmFwcGVkIHRvIGFsbG93IG90aGVyXHJcbiAqIGZyYW1ld29ya3MgdG8gYmUgdXNlZCBmb3IgY3JlYXRpbmcgYGhvb2tyb3V0ZXJgIG5hdmlnYXRhYmxlIGxpbmtzLlxyXG4gKlxyXG4gKiBJZiBgb25DbGlja2AgaXMgc3VwcGxpZWQsIHRoZW4gdGhlIG5hdmlnYXRpb24gd2lsbCBoYXBwZW4gYmVmb3JlXHJcbiAqIHRoZSBzdXBwbGllZCBgb25DbGlja2AgYWN0aW9uIVxyXG4gKlxyXG4gKiBAZXhhbXBsZVxyXG4gKlxyXG4gKiAmbHQ7TXlGcmFtZXdvcmtMaW5rIHdoYXQ9XCJldmVyXCIgey4uLnVzZUxpbmsoeyBocmVmOiAnLycgfSl9Jmd0O1xyXG4gKiAgIExpbmsgdGV4dFxyXG4gKiAmbHQ7L015RnJhbWV3b3JrTGluayZndDtcclxuICpcclxuICogQHBhcmFtIHtPYmplY3R9IHByb3BzIFJlcXVpcmVzIGBocmVmYC4gYG9uQ2xpY2tgIGlzIG9wdGlvbmFsLlxyXG4gKi9cclxuZXhwb3J0IGNvbnN0IHNldExpbmtQcm9wcyA9IChwcm9wcykgPT4ge1xyXG5cdGNvbnN0IG9uQ2xpY2sgPSAoZSkgPT4ge1xyXG5cdFx0aWYgKCFlLnNoaWZ0S2V5ICYmICFlLmN0cmxLZXkgJiYgIWUuYWx0S2V5ICYmICFlLm1ldGFLZXkgJiYgcHJvcHMudGFyZ2V0ICE9PSBcIl9ibGFua1wiKSB7XHJcblx0XHRcdGUucHJldmVudERlZmF1bHQoKTsgLy8gcHJldmVudCB0aGUgbGluayBmcm9tIGFjdHVhbGx5IG5hdmlnYXRpbmdcclxuXHRcdFx0bmF2aWdhdGUoZS5jdXJyZW50VGFyZ2V0LmhyZWYpO1xyXG5cdFx0fVxyXG5cclxuXHRcdGlmIChwcm9wcy5vbkNsaWNrKSB7XHJcblx0XHRcdHByb3BzLm9uQ2xpY2soZSk7XHJcblx0XHR9XHJcblx0fTtcclxuXHRjb25zdCBocmVmID1cclxuXHRcdHByb3BzLmhyZWYuc3Vic3RyKDAsIDEpID09PSAnLydcclxuXHRcdFx0PyBnZXRCYXNlcGF0aCgpICsgcHJvcHMuaHJlZlxyXG5cdFx0XHQ6IHByb3BzLmhyZWY7XHJcblxyXG5cdHJldHVybiB7Li4ucHJvcHMsIGhyZWYsIG9uQ2xpY2t9O1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIEFjY2VwdHMgc3RhbmRhcmQgSFRNTCBgYWAtdGFnIHByb3BlcnRpZXMuIGBocmVmYCBhbmQsIG9wdGlvbmFsbHksXHJcbiAqIGBvbkNsaWNrYCBhcmUgdXNlZCB0byBjcmVhdGUgbGlua3MgdGhhdCB3b3JrIHdpdGggYGhvb2tyb3V0ZXJgLlxyXG4gKlxyXG4gKiBAZXhhbXBsZVxyXG4gKlxyXG4gKiAmbHQ7QSBocmVmPVwiL1wiIHRhcmdldD1cIl9ibGFua1wiJmd0O1xyXG4gKiAgIEhvbWVcclxuICogJmx0Oy9BJmd0O1xyXG4gKlxyXG4gKiBAcGFyYW0ge09iamVjdH0gcHJvcHMgUmVxdWlyZXMgYGhyZWZgLiBgb25DbGlja2AgaXMgb3B0aW9uYWxcclxuICovXHJcbmV4cG9ydCBjb25zdCBBID0gUmVhY3QuZm9yd2FyZFJlZihcclxuICAgKHByb3BzLCByZWYpID0+IDxhIHJlZj17cmVmfSB7Li4uc2V0TGlua1Byb3BzKHByb3BzKX0gLz5cclxuKTtcclxuIl19