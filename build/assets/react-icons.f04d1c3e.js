import{R as i,j as c}from"./react.b19ff3b0.js";var m={color:void 0,size:void 0,className:void 0,style:void 0,attr:void 0},g=i.createContext&&i.createContext(m);const O=c.exports.Fragment,o=c.exports.jsx,v=c.exports.jsxs;var l=globalThis&&globalThis.__assign||function(){return l=Object.assign||function(t){for(var r,e=1,n=arguments.length;e<n;e++){r=arguments[e];for(var a in r)Object.prototype.hasOwnProperty.call(r,a)&&(t[a]=r[a])}return t},l.apply(this,arguments)},x=globalThis&&globalThis.__rest||function(t,r){var e={};for(var n in t)Object.prototype.hasOwnProperty.call(t,n)&&r.indexOf(n)<0&&(e[n]=t[n]);if(t!=null&&typeof Object.getOwnPropertySymbols=="function")for(var a=0,n=Object.getOwnPropertySymbols(t);a<n.length;a++)r.indexOf(n[a])<0&&Object.prototype.propertyIsEnumerable.call(t,n[a])&&(e[n[a]]=t[n[a]]);return e};function d(t){return t&&t.map(function(r,e){return i.createElement(r.tag,l({key:e},r.attr),d(r.child))})}function y(t){return function(r){return o(b,{...l({attr:l({},t.attr)},r),children:d(t.child)})}}function b(t){var r=function(e){var n=t.attr,a=t.size,u=t.title,h=x(t,["attr","size","title"]),f=a||e.size||"1em",s;return e.className&&(s=e.className),t.className&&(s=(s?s+" ":"")+t.className),v("svg",{...l({stroke:"currentColor",fill:"currentColor",strokeWidth:"0"},e.attr,n,h,{className:s,style:l(l({color:t.color||e.color},e.style),t.style),height:f,width:f,xmlns:"http://www.w3.org/2000/svg"}),children:[u&&o("title",{children:u}),t.children]})};return g!==void 0?o(g.Consumer,{children:function(e){return r(e)}}):r(m)}function w(t){return y({tag:"svg",attr:{version:"1.1",viewBox:"0 0 17 17"},child:[{tag:"g",attr:{},child:[]},{tag:"path",attr:{d:"M9.207 8.5l6.646 6.646-0.707 0.707-6.646-6.646-6.646 6.646-0.707-0.707 6.646-6.646-6.647-6.646 0.707-0.707 6.647 6.646 6.646-6.646 0.707 0.707-6.646 6.646z"}}]})(t)}export{O as F,w as T,o as a,v as j};