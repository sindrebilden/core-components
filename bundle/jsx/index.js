!function(t,e){"object"==typeof exports&&"undefined"!=typeof module?e(exports,require("react")):"function"==typeof define&&define.amd?define(["exports","react"],e):e(t.Components={},t.React)}(this,function(t,e){"use strict";e=e&&e.hasOwnProperty("default")?e.default:e;var n="undefined"!=typeof window&&/(android)/i.test(window.navigator.userAgent),o='a,button,input,select,textarea,iframe,[tabindex],[contenteditable="true"]';function r(t){for(var e=[],n=arguments.length-1;n-- >0;)e[n]=arguments[n+1];return e.filter(Boolean).forEach(function(e){Object.keys(e).forEach(function(n){return t[n]=e[n]})}),t}function i(t,e){var n=u(t),o="true"===t.getAttribute("aria-expanded"),r="boolean"==typeof e?e:"toggle"===e?!o:o,i=o===r||function(t,e,n){void 0===n&&(n={});return t.dispatchEvent(new a(e,{bubbles:!0,cancelable:!0,detail:n}))}(t,"toggle",{relatedTarget:n,isOpen:o})?r:o;return n[i?"removeAttribute":"setAttribute"]("hidden",""),t.setAttribute("aria-expanded",i),i}function u(t,e,o){var r=t.getAttribute("aria-controls")||t.getAttribute("aria-owns")||t.getAttribute("list"),i=o||document.getElementById(r)||t.nextElementSibling,u=n?"data":"aria";if(!i)throw new Error("missing nextElementSibling on "+t.outerHTML);return e&&(t.setAttribute("aria-"+e,i.id=i.id||p()),i.setAttribute(u+"-labelledby",t.id=t.id||p())),i}var a=function(){if("undefined"!=typeof window)return"function"==typeof window.CustomEvent?window.CustomEvent:(t.prototype=window.Event.prototype,t);function t(t,e){void 0===e&&(e={});var n=document.createEvent("CustomEvent");return n.initCustomEvent(t,Boolean(e.bubbles),Boolean(e.cancelable),e.detail),n}}();function p(t,e){return Date.now().toString(36)+Math.random().toString(36).slice(2,5)}function d(t,e){return void 0===e&&(e=document),":focusable"===t?d(o,e).filter(function(t){return!t.disabled&&function(t){return t.offsetWidth&&t.offsetHeight&&"hidden"!==window.getComputedStyle(t).getPropertyValue("visibility")}(t)}):"string"==typeof t?d(e.querySelectorAll(t)):t.length?[].slice.call(t):t.nodeType?[t]:[]}var c,l,f,s="data-@nrk/core-toggle-1.0.0".replace(/\W+/g,"-"),b="aria-expanded",g="aria-haspopup",v=function(t){return"boolean"==typeof t};function y(t,e){var n="object"==typeof e?e:{open:e},o=d(t);return o.forEach(function(t){var e=v(n.open)?n.open:"true"===t.getAttribute(b),o=v(n.popup)?n.popup:"true"===t.getAttribute(g);t.setAttribute(s,""),t.setAttribute(g,o),u(t,"controls"),i(t,e)}),o}function h(t){y(ReactDOM.findDOMNode(t).firstElementChild)}c=s,l="click",f=function(t){var e=t.target;d("["+s+"]").forEach(function(t){var n="true"===t.getAttribute(b),o="true"===t.getAttribute(g);t.contains(e)?y(t,!n):o&&y(t,u(t).contains(e))})},"undefined"==typeof window||window[c+"-"+l]||document.addEventListener(l,f,window[c+"-"+l]=!0);var m=function(t){function n(){t.apply(this,arguments)}return t&&(n.__proto__=t),n.prototype=Object.create(t&&t.prototype),n.prototype.constructor=n,n.prototype.componentDidMount=function(){h(this)},n.prototype.componentDidUpdate=function(){h(this)},n.prototype.render=function(){var t=this;return e.createElement("div",r({},this.props,{open:null,popup:null}),e.Children.map(this.props.children,function(e,n){return r({},e,{props:r({},e.props,n?{hidden:!t.props.open}:{"aria-expanded":String(Boolean(t.props.open)),"aria-haspopup":String(Boolean(t.props.popup))})})}))},n}(e.Component);t.Toggle=m,t.Input=function(){return e.createElement("div",null,"Testing input")},Object.defineProperty(t,"__esModule",{value:!0})});
//# sourceMappingURL=index.js.map