"use strict";(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[6326],{36326:function(e,t,a){a.r(t),a.d(t,{W3mPayLoadingView:function(){return eX},W3mPayView:function(){return eV},arbitrumUSDC:function(){return e3},arbitrumUSDT:function(){return e6},baseETH:function(){return eJ},baseSepoliaETH:function(){return eQ},baseUSDC:function(){return eZ},ethereumUSDC:function(){return e0},ethereumUSDT:function(){return e8},getExchanges:function(){return client_getExchanges},getIsPaymentInProgress:function(){return getIsPaymentInProgress},getPayError:function(){return getPayError},getPayResult:function(){return getPayResult},openPay:function(){return openPay},optimismUSDC:function(){return e1},optimismUSDT:function(){return e4},pay:function(){return pay},polygonUSDC:function(){return e2},polygonUSDT:function(){return e9},solanaSOL:function(){return te},solanaUSDC:function(){return e5},solanaUSDT:function(){return e7}});/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */let s=globalThis,o=s.ShadowRoot&&(void 0===s.ShadyCSS||s.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,l=Symbol(),c=new WeakMap;let n=class n{constructor(e,t,a){if(this._$cssResult$=!0,a!==l)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=e,this.t=t}get styleSheet(){let e=this.o,t=this.t;if(o&&void 0===e){let a=void 0!==t&&1===t.length;a&&(e=c.get(t)),void 0===e&&((this.o=e=new CSSStyleSheet).replaceSync(this.cssText),a&&c.set(t,e))}return e}toString(){return this.cssText}};let r=e=>new n("string"==typeof e?e:e+"",void 0,l),i=(e,...t)=>{let a=1===e.length?e[0]:t.reduce((t,a,s)=>t+(e=>{if(!0===e._$cssResult$)return e.cssText;if("number"==typeof e)return e;throw Error("Value passed to 'css' function must be a 'css' function result: "+e+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(a)+e[s+1],e[0]);return new n(a,e,l)},S=(e,t)=>{if(o)e.adoptedStyleSheets=t.map(e=>e instanceof CSSStyleSheet?e:e.styleSheet);else for(let a of t){let t=document.createElement("style"),o=s.litNonce;void 0!==o&&t.setAttribute("nonce",o),t.textContent=a.cssText,e.appendChild(t)}},p=o?e=>e:e=>e instanceof CSSStyleSheet?(e=>{let t="";for(let a of e.cssRules)t+=a.cssText;return r(t)})(e):e,{is:u,defineProperty:h,getOwnPropertyDescriptor:m,getOwnPropertyNames:_,getOwnPropertySymbols:g,getPrototypeOf:A}=Object,E=globalThis,w=E.trustedTypes,b=w?w.emptyScript:"",v=E.reactiveElementPolyfillSupport,d=(e,t)=>e,C={toAttribute(e,t){switch(t){case Boolean:e=e?b:null;break;case Object:case Array:e=null==e?e:JSON.stringify(e)}return e},fromAttribute(e,t){let a=e;switch(t){case Boolean:a=null!==e;break;case Number:a=null===e?null:Number(e);break;case Object:case Array:try{a=JSON.parse(e)}catch(e){a=null}}return a}},f=(e,t)=>!u(e,t),$={attribute:!0,type:String,converter:C,reflect:!1,useDefault:!1,hasChanged:f};Symbol.metadata??=Symbol("metadata"),E.litPropertyMetadata??=new WeakMap;let y=class y extends HTMLElement{static addInitializer(e){this._$Ei(),(this.l??=[]).push(e)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(e,t=$){if(t.state&&(t.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(e)&&((t=Object.create(t)).wrapped=!0),this.elementProperties.set(e,t),!t.noAccessor){let a=Symbol(),s=this.getPropertyDescriptor(e,a,t);void 0!==s&&h(this.prototype,e,s)}}static getPropertyDescriptor(e,t,a){let{get:s,set:o}=m(this.prototype,e)??{get(){return this[t]},set(e){this[t]=e}};return{get:s,set(t){let l=s?.call(this);o?.call(this,t),this.requestUpdate(e,l,a)},configurable:!0,enumerable:!0}}static getPropertyOptions(e){return this.elementProperties.get(e)??$}static _$Ei(){if(this.hasOwnProperty(d("elementProperties")))return;let e=A(this);e.finalize(),void 0!==e.l&&(this.l=[...e.l]),this.elementProperties=new Map(e.elementProperties)}static finalize(){if(this.hasOwnProperty(d("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(d("properties"))){let e=this.properties,t=[..._(e),...g(e)];for(let a of t)this.createProperty(a,e[a])}let e=this[Symbol.metadata];if(null!==e){let t=litPropertyMetadata.get(e);if(void 0!==t)for(let[e,a]of t)this.elementProperties.set(e,a)}for(let[e,t]of(this._$Eh=new Map,this.elementProperties)){let a=this._$Eu(e,t);void 0!==a&&this._$Eh.set(a,e)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(e){let t=[];if(Array.isArray(e)){let a=new Set(e.flat(1/0).reverse());for(let e of a)t.unshift(p(e))}else void 0!==e&&t.push(p(e));return t}static _$Eu(e,t){let a=t.attribute;return!1===a?void 0:"string"==typeof a?a:"string"==typeof e?e.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(e=>this.enableUpdating=e),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(e=>e(this))}addController(e){(this._$EO??=new Set).add(e),void 0!==this.renderRoot&&this.isConnected&&e.hostConnected?.()}removeController(e){this._$EO?.delete(e)}_$E_(){let e=new Map,t=this.constructor.elementProperties;for(let a of t.keys())this.hasOwnProperty(a)&&(e.set(a,this[a]),delete this[a]);e.size>0&&(this._$Ep=e)}createRenderRoot(){let e=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return S(e,this.constructor.elementStyles),e}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(e=>e.hostConnected?.())}enableUpdating(e){}disconnectedCallback(){this._$EO?.forEach(e=>e.hostDisconnected?.())}attributeChangedCallback(e,t,a){this._$AK(e,a)}_$ET(e,t){let a=this.constructor.elementProperties.get(e),s=this.constructor._$Eu(e,a);if(void 0!==s&&!0===a.reflect){let o=(void 0!==a.converter?.toAttribute?a.converter:C).toAttribute(t,a.type);this._$Em=e,null==o?this.removeAttribute(s):this.setAttribute(s,o),this._$Em=null}}_$AK(e,t){let a=this.constructor,s=a._$Eh.get(e);if(void 0!==s&&this._$Em!==s){let e=a.getPropertyOptions(s),o="function"==typeof e.converter?{fromAttribute:e.converter}:void 0!==e.converter?.fromAttribute?e.converter:C;this._$Em=s;let l=o.fromAttribute(t,e.type);this[s]=l??this._$Ej?.get(s)??l,this._$Em=null}}requestUpdate(e,t,a){if(void 0!==e){let s=this.constructor,o=this[e];if(!(((a??=s.getPropertyOptions(e)).hasChanged??f)(o,t)||a.useDefault&&a.reflect&&o===this._$Ej?.get(e)&&!this.hasAttribute(s._$Eu(e,a))))return;this.C(e,t,a)}!1===this.isUpdatePending&&(this._$ES=this._$EP())}C(e,t,{useDefault:a,reflect:s,wrapped:o},l){a&&!(this._$Ej??=new Map).has(e)&&(this._$Ej.set(e,l??t??this[e]),!0!==o||void 0!==l)||(this._$AL.has(e)||(this.hasUpdated||a||(t=void 0),this._$AL.set(e,t)),!0===s&&this._$Em!==e&&(this._$Eq??=new Set).add(e))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(e){Promise.reject(e)}let e=this.scheduleUpdate();return null!=e&&await e,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(let[e,t]of this._$Ep)this[e]=t;this._$Ep=void 0}let e=this.constructor.elementProperties;if(e.size>0)for(let[t,a]of e){let{wrapped:e}=a,s=this[t];!0!==e||this._$AL.has(t)||void 0===s||this.C(t,void 0,a,s)}}let e=!1,t=this._$AL;try{(e=this.shouldUpdate(t))?(this.willUpdate(t),this._$EO?.forEach(e=>e.hostUpdate?.()),this.update(t)):this._$EM()}catch(t){throw e=!1,this._$EM(),t}e&&this._$AE(t)}willUpdate(e){}_$AE(e){this._$EO?.forEach(e=>e.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(e)),this.updated(e)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(e){return!0}update(e){this._$Eq&&=this._$Eq.forEach(e=>this._$ET(e,this[e])),this._$EM()}updated(e){}firstUpdated(e){}};y.elementStyles=[],y.shadowRootOptions={mode:"open"},y[d("elementProperties")]=new Map,y[d("finalized")]=new Map,v?.({ReactiveElement:y}),(E.reactiveElementVersions??=[]).push("2.1.1");/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */let x=globalThis,T=x.trustedTypes,U=T?T.createPolicy("lit-html",{createHTML:e=>e}):void 0,O="$lit$",D=`lit$${Math.random().toFixed(9).slice(2)}$`,j="?"+D,K=`<${j}>`,G=document,lit_html_l=()=>G.createComment(""),lit_html_c=e=>null===e||"object"!=typeof e&&"function"!=typeof e,Y=Array.isArray,lit_html_u=e=>Y(e)||"function"==typeof e?.[Symbol.iterator],W="[ 	\n\f\r]",F=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,q=/-->/g,X=/>/g,J=RegExp(`>|${W}(?:([^\\s"'>=/]+)(${W}*=${W}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),Z=/'/g,Q=/"/g,ee=/^(?:script|style|textarea|title)$/i,lit_html_y=e=>(t,...a)=>({_$litType$:e,strings:t,values:a}),et=lit_html_y(1),er=(lit_html_y(2),lit_html_y(3),Symbol.for("lit-noChange")),en=Symbol.for("lit-nothing"),ei=new WeakMap,ea=G.createTreeWalker(G,129);function P(e,t){if(!Y(e)||!e.hasOwnProperty("raw"))throw Error("invalid template strings array");return void 0!==U?U.createHTML(t):t}let V=(e,t)=>{let a=e.length-1,s=[],o,l=2===t?"<svg>":3===t?"<math>":"",c=F;for(let t=0;t<a;t++){let a=e[t],p,u,h=-1,m=0;for(;m<a.length&&(c.lastIndex=m,null!==(u=c.exec(a)));)m=c.lastIndex,c===F?"!--"===u[1]?c=q:void 0!==u[1]?c=X:void 0!==u[2]?(ee.test(u[2])&&(o=RegExp("</"+u[2],"g")),c=J):void 0!==u[3]&&(c=J):c===J?">"===u[0]?(c=o??F,h=-1):void 0===u[1]?h=-2:(h=c.lastIndex-u[2].length,p=u[1],c=void 0===u[3]?J:'"'===u[3]?Q:Z):c===Q||c===Z?c=J:c===q||c===X?c=F:(c=J,o=void 0);let _=c===J&&e[t+1].startsWith("/>")?" ":"";l+=c===F?a+K:h>=0?(s.push(p),a.slice(0,h)+O+a.slice(h)+D+_):a+D+(-2===h?t:_)}return[P(e,l+(e[a]||"<?>")+(2===t?"</svg>":3===t?"</math>":"")),s]};let N=class N{constructor({strings:e,_$litType$:t},a){let s;this.parts=[];let o=0,l=0,c=e.length-1,p=this.parts,[u,h]=V(e,t);if(this.el=N.createElement(u,a),ea.currentNode=this.el.content,2===t||3===t){let e=this.el.content.firstChild;e.replaceWith(...e.childNodes)}for(;null!==(s=ea.nextNode())&&p.length<c;){if(1===s.nodeType){if(s.hasAttributes())for(let e of s.getAttributeNames())if(e.endsWith(O)){let t=h[l++],a=s.getAttribute(e).split(D),c=/([.?@])?(.*)/.exec(t);p.push({type:1,index:o,name:c[2],strings:a,ctor:"."===c[1]?H:"?"===c[1]?I:"@"===c[1]?L:k}),s.removeAttribute(e)}else e.startsWith(D)&&(p.push({type:6,index:o}),s.removeAttribute(e));if(ee.test(s.tagName)){let e=s.textContent.split(D),t=e.length-1;if(t>0){s.textContent=T?T.emptyScript:"";for(let a=0;a<t;a++)s.append(e[a],lit_html_l()),ea.nextNode(),p.push({type:2,index:++o});s.append(e[t],lit_html_l())}}}else if(8===s.nodeType){if(s.data===j)p.push({type:2,index:o});else{let e=-1;for(;-1!==(e=s.data.indexOf(D,e+1));)p.push({type:7,index:o}),e+=D.length-1}}o++}}static createElement(e,t){let a=G.createElement("template");return a.innerHTML=e,a}};function lit_html_S(e,t,a=e,s){if(t===er)return t;let o=void 0!==s?a._$Co?.[s]:a._$Cl,l=lit_html_c(t)?void 0:t._$litDirective$;return o?.constructor!==l&&(o?._$AO?.(!1),void 0===l?o=void 0:(o=new l(e))._$AT(e,a,s),void 0!==s?(a._$Co??=[])[s]=o:a._$Cl=o),void 0!==o&&(t=lit_html_S(e,o._$AS(e,t.values),o,s)),t}let M=class M{constructor(e,t){this._$AV=[],this._$AN=void 0,this._$AD=e,this._$AM=t}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(e){let{el:{content:t},parts:a}=this._$AD,s=(e?.creationScope??G).importNode(t,!0);ea.currentNode=s;let o=ea.nextNode(),l=0,c=0,p=a[0];for(;void 0!==p;){if(l===p.index){let t;2===p.type?t=new R(o,o.nextSibling,this,e):1===p.type?t=new p.ctor(o,p.name,p.strings,this,e):6===p.type&&(t=new z(o,this,e)),this._$AV.push(t),p=a[++c]}l!==p?.index&&(o=ea.nextNode(),l++)}return ea.currentNode=G,s}p(e){let t=0;for(let a of this._$AV)void 0!==a&&(void 0!==a.strings?(a._$AI(e,a,t),t+=a.strings.length-2):a._$AI(e[t])),t++}};let R=class R{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(e,t,a,s){this.type=2,this._$AH=en,this._$AN=void 0,this._$AA=e,this._$AB=t,this._$AM=a,this.options=s,this._$Cv=s?.isConnected??!0}get parentNode(){let e=this._$AA.parentNode,t=this._$AM;return void 0!==t&&11===e?.nodeType&&(e=t.parentNode),e}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(e,t=this){lit_html_c(e=lit_html_S(this,e,t))?e===en||null==e||""===e?(this._$AH!==en&&this._$AR(),this._$AH=en):e!==this._$AH&&e!==er&&this._(e):void 0!==e._$litType$?this.$(e):void 0!==e.nodeType?this.T(e):lit_html_u(e)?this.k(e):this._(e)}O(e){return this._$AA.parentNode.insertBefore(e,this._$AB)}T(e){this._$AH!==e&&(this._$AR(),this._$AH=this.O(e))}_(e){this._$AH!==en&&lit_html_c(this._$AH)?this._$AA.nextSibling.data=e:this.T(G.createTextNode(e)),this._$AH=e}$(e){let{values:t,_$litType$:a}=e,s="number"==typeof a?this._$AC(e):(void 0===a.el&&(a.el=N.createElement(P(a.h,a.h[0]),this.options)),a);if(this._$AH?._$AD===s)this._$AH.p(t);else{let e=new M(s,this),a=e.u(this.options);e.p(t),this.T(a),this._$AH=e}}_$AC(e){let t=ei.get(e.strings);return void 0===t&&ei.set(e.strings,t=new N(e)),t}k(e){Y(this._$AH)||(this._$AH=[],this._$AR());let t=this._$AH,a,s=0;for(let o of e)s===t.length?t.push(a=new R(this.O(lit_html_l()),this.O(lit_html_l()),this,this.options)):a=t[s],a._$AI(o),s++;s<t.length&&(this._$AR(a&&a._$AB.nextSibling,s),t.length=s)}_$AR(e=this._$AA.nextSibling,t){for(this._$AP?.(!1,!0,t);e!==this._$AB;){let t=e.nextSibling;e.remove(),e=t}}setConnected(e){void 0===this._$AM&&(this._$Cv=e,this._$AP?.(e))}};let k=class k{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(e,t,a,s,o){this.type=1,this._$AH=en,this._$AN=void 0,this.element=e,this.name=t,this._$AM=s,this.options=o,a.length>2||""!==a[0]||""!==a[1]?(this._$AH=Array(a.length-1).fill(new String),this.strings=a):this._$AH=en}_$AI(e,t=this,a,s){let o=this.strings,l=!1;if(void 0===o)(l=!lit_html_c(e=lit_html_S(this,e,t,0))||e!==this._$AH&&e!==er)&&(this._$AH=e);else{let s,c;let p=e;for(e=o[0],s=0;s<o.length-1;s++)(c=lit_html_S(this,p[a+s],t,s))===er&&(c=this._$AH[s]),l||=!lit_html_c(c)||c!==this._$AH[s],c===en?e=en:e!==en&&(e+=(c??"")+o[s+1]),this._$AH[s]=c}l&&!s&&this.j(e)}j(e){e===en?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,e??"")}};let H=class H extends k{constructor(){super(...arguments),this.type=3}j(e){this.element[this.name]=e===en?void 0:e}};let I=class I extends k{constructor(){super(...arguments),this.type=4}j(e){this.element.toggleAttribute(this.name,!!e&&e!==en)}};let L=class L extends k{constructor(e,t,a,s,o){super(e,t,a,s,o),this.type=5}_$AI(e,t=this){if((e=lit_html_S(this,e,t,0)??en)===er)return;let a=this._$AH,s=e===en&&a!==en||e.capture!==a.capture||e.once!==a.once||e.passive!==a.passive,o=e!==en&&(a===en||s);s&&this.element.removeEventListener(this.name,this,a),o&&this.element.addEventListener(this.name,this,e),this._$AH=e}handleEvent(e){"function"==typeof this._$AH?this._$AH.call(this.options?.host??this.element,e):this._$AH.handleEvent(e)}};let z=class z{constructor(e,t,a){this.element=e,this.type=6,this._$AN=void 0,this._$AM=t,this.options=a}get _$AU(){return this._$AM._$AU}_$AI(e){lit_html_S(this,e)}};let es=x.litHtmlPolyfillSupport;es?.(N,R),(x.litHtmlVersions??=[]).push("3.3.1");let B=(e,t,a)=>{let s=a?.renderBefore??t,o=s._$litPart$;if(void 0===o){let e=a?.renderBefore??null;s._$litPart$=o=new R(t.insertBefore(lit_html_l(),e),e,void 0,a??{})}return o._$AI(e),o},eo=globalThis;let lit_element_i=class lit_element_i extends y{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){let e=super.createRenderRoot();return this.renderOptions.renderBefore??=e.firstChild,e}update(e){let t=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(e),this._$Do=B(t,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return er}};lit_element_i._$litElement$=!0,lit_element_i.finalized=!0,eo.litElementHydrateSupport?.({LitElement:lit_element_i});let el=eo.litElementPolyfillSupport;el?.({LitElement:lit_element_i}),(eo.litElementVersions??=[]).push("4.2.1");/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */let ec={attribute:!0,type:String,converter:C,reflect:!1,hasChanged:f},property_r=(e=ec,t,a)=>{let{kind:s,metadata:o}=a,l=globalThis.litPropertyMetadata.get(o);if(void 0===l&&globalThis.litPropertyMetadata.set(o,l=new Map),"setter"===s&&((e=Object.create(e)).wrapped=!0),l.set(a.name,e),"accessor"===s){let{name:s}=a;return{set(a){let o=t.get.call(this);t.set.call(this,a),this.requestUpdate(s,o,e)},init(t){return void 0!==t&&this.C(s,void 0,e,t),t}}}if("setter"===s){let{name:s}=a;return function(a){let o=this[s];t.call(this,a),this.requestUpdate(s,o,e)}}throw Error("Unsupported decorator location: "+s)};/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */function state_r(e){var t;return t={...e,state:!0,attribute:!1},(e,a)=>"object"==typeof a?property_r(t,e,a):((e,t,a)=>{let s=t.hasOwnProperty(a);return t.constructor.createProperty(a,e),s?Object.getOwnPropertyDescriptor(t,a):void 0})(t,e,a)}/**
 * @license
 * Copyright 2018 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */let if_defined_o=e=>e??en;var ep=a(59757),eu=a(83662),eh=a(83241),ed=a(82879),ey=a(29460),em=a(28740);a(37826),a(82100),a(85642),a(54530),a(8035),a(87809),a(84350),a(73049),a(48808),a(82002),a(68390),a(73783);let e_=Symbol(),eg=Symbol(),newProxy=(e,t)=>new Proxy(e,t),ef=Object.getPrototypeOf,eA=new WeakMap,isObjectToTrack=e=>e&&(eA.has(e)?eA.get(e):ef(e)===Object.prototype||ef(e)===Array.prototype),needsToCopyTargetObject=e=>Object.values(Object.getOwnPropertyDescriptors(e)).some(e=>!e.configurable&&!e.writable),copyTargetObject=e=>{if(Array.isArray(e))return Array.from(e);let t=Object.getOwnPropertyDescriptors(e);return Object.values(t).forEach(e=>{e.configurable=!0}),Object.create(ef(e),t)},createProxyHandler=(e,t)=>{let a={f:t},s=!1,recordUsage=(t,o)=>{if(!s){let s=a.a.get(e);if(s||(s={},a.a.set(e,s)),"w"===t)s.w=!0;else{let e=s[t];e||(e=new Set,s[t]=e),e.add(o)}}},recordObjectAsUsed=()=>{s=!0,a.a.delete(e)},o={get:(t,s)=>s===eg?e:(recordUsage("k",s),createProxy(Reflect.get(t,s),a.a,a.c,a.t)),has:(e,t)=>t===e_?(recordObjectAsUsed(),!0):(recordUsage("h",t),Reflect.has(e,t)),getOwnPropertyDescriptor:(e,t)=>(recordUsage("o",t),Reflect.getOwnPropertyDescriptor(e,t)),ownKeys:e=>(recordUsage("w"),Reflect.ownKeys(e))};return t&&(o.set=o.deleteProperty=()=>!1),[o,a]},getOriginalObject=e=>e[eg]||e,createProxy=(e,t,a,s)=>{if(!isObjectToTrack(e))return e;let o=s&&s.get(e);if(!o){let t=getOriginalObject(e);o=needsToCopyTargetObject(t)?[t,copyTargetObject(t)]:[t],null==s||s.set(e,o)}let[l,c]=o,p=a&&a.get(l);return(!p||!!c!==p[1].f)&&((p=createProxyHandler(l,!!c))[1].p=newProxy(c||l,p[0]),a&&a.set(l,p)),p[1].a=t,p[1].c=a,p[1].t=s,p[1].p},getUntracked=e=>isObjectToTrack(e)&&e[eg]||null,vanilla_isObject=e=>"object"==typeof e&&null!==e,eE=new WeakMap,ew=new WeakSet,eP=new WeakMap,eb=[1],ev=new WeakMap,eS=Object.is,vanilla_newProxy=(e,t)=>new Proxy(e,t),canProxy=e=>vanilla_isObject(e)&&!ew.has(e)&&(Array.isArray(e)||!(Symbol.iterator in e))&&!(e instanceof WeakMap)&&!(e instanceof WeakSet)&&!(e instanceof Error)&&!(e instanceof Number)&&!(e instanceof Date)&&!(e instanceof String)&&!(e instanceof RegExp)&&!(e instanceof ArrayBuffer)&&!(e instanceof Promise),createHandler=(e,t,a,s)=>({deleteProperty(e,t){let o=Reflect.get(e,t);a(t);let l=Reflect.deleteProperty(e,t);return l&&s(["delete",[t],o]),l},set(o,l,c,p){let u=!e()&&Reflect.has(o,l),h=Reflect.get(o,l,p);if(u&&(eS(h,c)||ev.has(c)&&eS(h,ev.get(c))))return!0;a(l),vanilla_isObject(c)&&(c=getUntracked(c)||c);let m=!eE.has(c)&&canProxy(c)?vanilla_proxy(c):c;return t(l,m),Reflect.set(o,l,m,p),s(["set",[l],c,h]),!0}});function vanilla_proxy(e={}){if(!vanilla_isObject(e))throw Error("object required");let t=ev.get(e);if(t)return t;let a=eb[0],s=new Set,notifyUpdate=(e,t=++eb[0])=>{a!==t&&(o=a=t,s.forEach(a=>a(e,t)))},o=a,createPropListener=e=>(t,a)=>{let s=[...t];s[1]=[e,...s[1]],notifyUpdate(s,a)},l=new Map,c=!0,p=createHandler(()=>c,(e,t)=>{let a=!ew.has(t)&&eE.get(t);if(a){if(l.has(e))throw Error("prop listener already exists");if(s.size){let t=a[2](createPropListener(e));l.set(e,[a,t])}else l.set(e,[a])}},e=>{var t;let a=l.get(e);a&&(l.delete(e),null==(t=a[1])||t.call(a))},notifyUpdate),u=vanilla_newProxy(e,p);ev.set(e,u);let h=[e,(e=eb[0])=>(o!==e&&(o=e,l.forEach(([t])=>{let s=t[1](e);s>a&&(a=s)})),a),e=>(s.add(e),1===s.size&&l.forEach(([e,t],a)=>{if(t)throw Error("remove already exists");let s=e[2](createPropListener(a));l.set(a,[e,s])}),()=>{s.delete(e),0===s.size&&l.forEach(([e,t],a)=>{t&&(t(),l.set(a,[e]))})})];return eE.set(u,h),Reflect.ownKeys(e).forEach(t=>{let a=Object.getOwnPropertyDescriptor(e,t);"value"in a&&a.writable&&(u[t]=e[t])}),c=!1,u}function vanilla_subscribe(e,t,a){let s;let o=eE.get(e);o||console.warn("Please use proxy object");let l=[],c=o[2],p=!1,u=c(e=>{if(l.push(e),a){t(l.splice(0));return}s||(s=Promise.resolve().then(()=>{s=void 0,p&&t(l.splice(0))}))});return p=!0,()=>{p=!1,u()}}function vanilla_unstable_getInternalStates(){return{proxyStateMap:eE,refSet:ew,snapCache:eP,versionHolder:eb,proxyCache:ev}}Symbol();let{proxyStateMap:eN,snapCache:eI}=vanilla_unstable_getInternalStates(),{proxyStateMap:eC,snapCache:e$}=vanilla_unstable_getInternalStates();var ex=a(68314),eT=a(50738),eR=a(51440),ek=a(4104),eU=a(4511);let eO={INVALID_PAYMENT_CONFIG:"INVALID_PAYMENT_CONFIG",INVALID_RECIPIENT:"INVALID_RECIPIENT",INVALID_ASSET:"INVALID_ASSET",INVALID_AMOUNT:"INVALID_AMOUNT",UNKNOWN_ERROR:"UNKNOWN_ERROR",UNABLE_TO_INITIATE_PAYMENT:"UNABLE_TO_INITIATE_PAYMENT",INVALID_CHAIN_NAMESPACE:"INVALID_CHAIN_NAMESPACE",GENERIC_PAYMENT_ERROR:"GENERIC_PAYMENT_ERROR",UNABLE_TO_GET_EXCHANGES:"UNABLE_TO_GET_EXCHANGES",ASSET_NOT_SUPPORTED:"ASSET_NOT_SUPPORTED",UNABLE_TO_GET_PAY_URL:"UNABLE_TO_GET_PAY_URL",UNABLE_TO_GET_BUY_STATUS:"UNABLE_TO_GET_BUY_STATUS"},eD={[eO.INVALID_PAYMENT_CONFIG]:"Invalid payment configuration",[eO.INVALID_RECIPIENT]:"Invalid recipient address",[eO.INVALID_ASSET]:"Invalid asset specified",[eO.INVALID_AMOUNT]:"Invalid payment amount",[eO.UNKNOWN_ERROR]:"Unknown payment error occurred",[eO.UNABLE_TO_INITIATE_PAYMENT]:"Unable to initiate payment",[eO.INVALID_CHAIN_NAMESPACE]:"Invalid chain namespace",[eO.GENERIC_PAYMENT_ERROR]:"Unable to process payment",[eO.UNABLE_TO_GET_EXCHANGES]:"Unable to get exchanges",[eO.ASSET_NOT_SUPPORTED]:"Asset not supported by the selected exchange",[eO.UNABLE_TO_GET_PAY_URL]:"Unable to get payment URL",[eO.UNABLE_TO_GET_BUY_STATUS]:"Unable to get buy status"};let AppKitPayError=class AppKitPayError extends Error{get message(){return eD[this.code]}constructor(e,t){super(eD[e]),this.name="AppKitPayError",this.code=e,this.details=t,Error.captureStackTrace&&Error.captureStackTrace(this,AppKitPayError)}};var eM=a(35428);let JsonRpcError=class JsonRpcError extends Error{};async function sendRequest(e,t){let a=function(){let e=eM.OptionsController.getSnapshot().projectId;return`https://rpc.walletconnect.org/v1/json-rpc?projectId=${e}`}(),{sdkType:s,sdkVersion:o,projectId:l}=eM.OptionsController.getSnapshot(),c={jsonrpc:"2.0",id:1,method:e,params:{...t||{},st:s,sv:o,projectId:l}},p=await fetch(a,{method:"POST",body:JSON.stringify(c),headers:{"Content-Type":"application/json"}}),u=await p.json();if(u.error)throw new JsonRpcError(u.error.message);return u}async function getExchanges(e){let t=await sendRequest("reown_getExchanges",e);return t.result}async function getPayUrl(e){let t=await sendRequest("reown_getExchangePayUrl",e);return t.result}async function getBuyStatus(e){let t=await sendRequest("reown_getExchangeBuyStatus",e);return t.result}let eL=["eip155","solana"],eH={eip155:{native:{assetNamespace:"slip44",assetReference:"60"},defaultTokenNamespace:"erc20"},solana:{native:{assetNamespace:"slip44",assetReference:"501"},defaultTokenNamespace:"token"}};function formatCaip19Asset(e,t){let{chainNamespace:a,chainId:s}=eT.u.parseCaipNetworkId(e),o=eH[a];if(!o)throw Error(`Unsupported chain namespace for CAIP-19 formatting: ${a}`);let l=o.native.assetNamespace,c=o.native.assetReference;"native"!==t&&(l=o.defaultTokenNamespace,c=t);let p=`${a}:${s}`;return`${p}/${l}:${c}`}var ej=a(30508);async function ensureCorrectNetwork(e){let{paymentAssetNetwork:t,activeCaipNetwork:a,approvedCaipNetworkIds:s,requestedCaipNetworks:o}=e,l=eh.j.sortRequestedNetworks(s,o),c=l.find(e=>e.caipNetworkId===t);if(!c)throw new AppKitPayError(eO.INVALID_PAYMENT_CONFIG);if(c.caipNetworkId===a.caipNetworkId)return;let p=ep.R.getNetworkProp("supportsAllNetworks",c.chainNamespace),u=s?.includes(c.caipNetworkId)||p;if(!u)throw new AppKitPayError(eO.INVALID_PAYMENT_CONFIG);try{await ep.R.switchActiveNetwork(c)}catch(e){throw new AppKitPayError(eO.GENERIC_PAYMENT_ERROR,e)}}async function processEvmNativePayment(e,t,a){if(t!==ex.b.CHAIN.EVM)throw new AppKitPayError(eO.INVALID_CHAIN_NAMESPACE);if(!a.fromAddress)throw new AppKitPayError(eO.INVALID_PAYMENT_CONFIG,"fromAddress is required for native EVM payments.");let s="string"==typeof a.amount?parseFloat(a.amount):a.amount;if(isNaN(s))throw new AppKitPayError(eO.INVALID_PAYMENT_CONFIG);let o=e.metadata?.decimals??18,l=ey.ConnectionController.parseUnits(s.toString(),o);if("bigint"!=typeof l)throw new AppKitPayError(eO.GENERIC_PAYMENT_ERROR);let c=await ey.ConnectionController.sendTransaction({chainNamespace:t,to:a.recipient,address:a.fromAddress,value:l,data:"0x"});return c??void 0}async function processEvmErc20Payment(e,t){if(!t.fromAddress)throw new AppKitPayError(eO.INVALID_PAYMENT_CONFIG,"fromAddress is required for ERC20 EVM payments.");let a=e.asset,s=t.recipient,o=Number(e.metadata.decimals),l=ey.ConnectionController.parseUnits(t.amount.toString(),o);if(void 0===l)throw new AppKitPayError(eO.GENERIC_PAYMENT_ERROR);let c=await ey.ConnectionController.writeContract({fromAddress:t.fromAddress,tokenAddress:a,args:[s,l],method:"transfer",abi:ej.g.getERC20Abi(a),chainNamespace:ex.b.CHAIN.EVM});return c??void 0}async function processSolanaPayment(e,t){if(e!==ex.b.CHAIN.SOLANA)throw new AppKitPayError(eO.INVALID_CHAIN_NAMESPACE);if(!t.fromAddress)throw new AppKitPayError(eO.INVALID_PAYMENT_CONFIG,"fromAddress is required for Solana payments.");let a="string"==typeof t.amount?parseFloat(t.amount):t.amount;if(isNaN(a)||a<=0)throw new AppKitPayError(eO.INVALID_PAYMENT_CONFIG,"Invalid payment amount.");try{let s=ek.O.getProvider(e);if(!s)throw new AppKitPayError(eO.GENERIC_PAYMENT_ERROR,"No Solana provider available.");let o=await ey.ConnectionController.sendTransaction({chainNamespace:ex.b.CHAIN.SOLANA,to:t.recipient,value:a,tokenMint:t.tokenMint});if(!o)throw new AppKitPayError(eO.GENERIC_PAYMENT_ERROR,"Transaction failed.");return o}catch(e){if(e instanceof AppKitPayError)throw e;throw new AppKitPayError(eO.GENERIC_PAYMENT_ERROR,`Solana payment failed: ${e}`)}}let eK="unknown",eB=vanilla_proxy({paymentAsset:{network:"eip155:1",asset:"0x0",metadata:{name:"0x0",symbol:"0x0",decimals:0}},recipient:"0x0",amount:0,isConfigured:!1,error:null,isPaymentInProgress:!1,exchanges:[],isLoading:!1,openInNewTab:!0,redirectUrl:void 0,payWithExchange:void 0,currentPayment:void 0,analyticsSet:!1,paymentId:void 0}),eG={state:eB,subscribe:e=>vanilla_subscribe(eB,()=>e(eB)),subscribeKey:(e,t)=>{let a;return a=eB[e],vanilla_subscribe(eB,()=>{let s=eB[e];Object.is(a,s)||t(a=s)},void 0)},async handleOpenPay(e){this.resetState(),this.setPaymentConfig(e),this.subscribeEvents(),this.initializeAnalytics(),eB.isConfigured=!0,eR.X.sendEvent({type:"track",event:"PAY_MODAL_OPEN",properties:{exchanges:eB.exchanges,configuration:{network:eB.paymentAsset.network,asset:eB.paymentAsset.asset,recipient:eB.recipient,amount:eB.amount}}}),await eu.I.open({view:"Pay"})},resetState(){eB.paymentAsset={network:"eip155:1",asset:"0x0",metadata:{name:"0x0",symbol:"0x0",decimals:0}},eB.recipient="0x0",eB.amount=0,eB.isConfigured=!1,eB.error=null,eB.isPaymentInProgress=!1,eB.isLoading=!1,eB.currentPayment=void 0},setPaymentConfig(e){if(!e.paymentAsset)throw new AppKitPayError(eO.INVALID_PAYMENT_CONFIG);try{eB.paymentAsset=e.paymentAsset,eB.recipient=e.recipient,eB.amount=e.amount,eB.openInNewTab=e.openInNewTab??!0,eB.redirectUrl=e.redirectUrl,eB.payWithExchange=e.payWithExchange,eB.error=null}catch(e){throw new AppKitPayError(eO.INVALID_PAYMENT_CONFIG,e.message)}},getPaymentAsset:()=>eB.paymentAsset,getExchanges:()=>eB.exchanges,async fetchExchanges(){try{eB.isLoading=!0;let e=await getExchanges({page:0,asset:formatCaip19Asset(eB.paymentAsset.network,eB.paymentAsset.asset),amount:eB.amount.toString()});eB.exchanges=e.exchanges.slice(0,2)}catch(e){throw ed.SnackController.showError(eD.UNABLE_TO_GET_EXCHANGES),new AppKitPayError(eO.UNABLE_TO_GET_EXCHANGES)}finally{eB.isLoading=!1}},async getAvailableExchanges(e){try{let t=e?.asset&&e?.network?formatCaip19Asset(e.network,e.asset):void 0,a=await getExchanges({page:e?.page??0,asset:t,amount:e?.amount?.toString()});return a}catch(e){throw new AppKitPayError(eO.UNABLE_TO_GET_EXCHANGES)}},async getPayUrl(e,t,a=!1){try{let s=Number(t.amount),o=await getPayUrl({exchangeId:e,asset:formatCaip19Asset(t.network,t.asset),amount:s.toString(),recipient:`${t.network}:${t.recipient}`});return eR.X.sendEvent({type:"track",event:"PAY_EXCHANGE_SELECTED",properties:{source:"pay",exchange:{id:e},configuration:{network:t.network,asset:t.asset,recipient:t.recipient,amount:s},currentPayment:{type:"exchange",exchangeId:e},headless:a}}),a&&(this.initiatePayment(),eR.X.sendEvent({type:"track",event:"PAY_INITIATED",properties:{source:"pay",paymentId:eB.paymentId||eK,configuration:{network:t.network,asset:t.asset,recipient:t.recipient,amount:s},currentPayment:{type:"exchange",exchangeId:e}}})),o}catch(e){if(e instanceof Error&&e.message.includes("is not supported"))throw new AppKitPayError(eO.ASSET_NOT_SUPPORTED);throw Error(e.message)}},async openPayUrl(e,t,a=!1){try{let s=await this.getPayUrl(e.exchangeId,t,a);if(!s)throw new AppKitPayError(eO.UNABLE_TO_GET_PAY_URL);let o=e.openInNewTab??!0;return eh.j.openHref(s.url,o?"_blank":"_self"),s}catch(e){throw e instanceof AppKitPayError?eB.error=e.message:eB.error=eD.GENERIC_PAYMENT_ERROR,new AppKitPayError(eO.UNABLE_TO_GET_PAY_URL)}},subscribeEvents(){eB.isConfigured||(ey.ConnectionController.subscribeKey("connections",e=>{e.size>0&&this.handlePayment()}),ep.R.subscribeChainProp("accountState",e=>{let t=ey.ConnectionController.hasAnyConnection(ex.b.CONNECTOR_ID.WALLET_CONNECT);e?.caipAddress&&(t?setTimeout(()=>{this.handlePayment()},100):this.handlePayment())}))},async handlePayment(){eB.currentPayment={type:"wallet",status:"IN_PROGRESS"};let e=ep.R.getActiveCaipAddress();if(!e)return;let{chainId:t,address:a}=eT.u.parseCaipAddress(e),s=ep.R.state.activeChain;if(!a||!t||!s)return;let o=ek.O.getProvider(s);if(!o)return;let l=ep.R.state.activeCaipNetwork;if(l&&!eB.isPaymentInProgress)try{this.initiatePayment();let e=ep.R.getAllRequestedCaipNetworks(),t=ep.R.getAllApprovedCaipNetworkIds();switch(await ensureCorrectNetwork({paymentAssetNetwork:eB.paymentAsset.network,activeCaipNetwork:l,approvedCaipNetworkIds:t,requestedCaipNetworks:e}),await eu.I.open({view:"PayLoading"}),s){case ex.b.CHAIN.EVM:"native"===eB.paymentAsset.asset&&(eB.currentPayment.result=await processEvmNativePayment(eB.paymentAsset,s,{recipient:eB.recipient,amount:eB.amount,fromAddress:a})),eB.paymentAsset.asset.startsWith("0x")&&(eB.currentPayment.result=await processEvmErc20Payment(eB.paymentAsset,{recipient:eB.recipient,amount:eB.amount,fromAddress:a})),eB.currentPayment.status="SUCCESS";break;case ex.b.CHAIN.SOLANA:eB.currentPayment.result=await processSolanaPayment(s,{recipient:eB.recipient,amount:eB.amount,fromAddress:a,tokenMint:"native"===eB.paymentAsset.asset?void 0:eB.paymentAsset.asset}),eB.currentPayment.status="SUCCESS";break;default:throw new AppKitPayError(eO.INVALID_CHAIN_NAMESPACE)}}catch(e){e instanceof AppKitPayError?eB.error=e.message:eB.error=eD.GENERIC_PAYMENT_ERROR,eB.currentPayment.status="FAILED",ed.SnackController.showError(eB.error)}finally{eB.isPaymentInProgress=!1}},getExchangeById:e=>eB.exchanges.find(t=>t.id===e),validatePayConfig(e){let{paymentAsset:t,recipient:a,amount:s}=e;if(!t)throw new AppKitPayError(eO.INVALID_PAYMENT_CONFIG);if(!a)throw new AppKitPayError(eO.INVALID_RECIPIENT);if(!t.asset)throw new AppKitPayError(eO.INVALID_ASSET);if(null==s||s<=0)throw new AppKitPayError(eO.INVALID_AMOUNT)},handlePayWithWallet(){let e=ep.R.getActiveCaipAddress();if(!e){eU.RouterController.push("Connect");return}let{chainId:t,address:a}=eT.u.parseCaipAddress(e),s=ep.R.state.activeChain;if(!a||!t||!s){eU.RouterController.push("Connect");return}this.handlePayment()},async handlePayWithExchange(e){try{eB.currentPayment={type:"exchange",exchangeId:e};let{network:t,asset:a}=eB.paymentAsset,s={network:t,asset:a,amount:eB.amount,recipient:eB.recipient},o=await this.getPayUrl(e,s);if(!o)throw new AppKitPayError(eO.UNABLE_TO_INITIATE_PAYMENT);return eB.currentPayment.sessionId=o.sessionId,eB.currentPayment.status="IN_PROGRESS",eB.currentPayment.exchangeId=e,this.initiatePayment(),{url:o.url,openInNewTab:eB.openInNewTab}}catch(e){return e instanceof AppKitPayError?eB.error=e.message:eB.error=eD.GENERIC_PAYMENT_ERROR,eB.isPaymentInProgress=!1,ed.SnackController.showError(eB.error),null}},async getBuyStatus(e,t){try{let a=await getBuyStatus({sessionId:t,exchangeId:e});return("SUCCESS"===a.status||"FAILED"===a.status)&&eR.X.sendEvent({type:"track",event:"SUCCESS"===a.status?"PAY_SUCCESS":"PAY_ERROR",properties:{message:"FAILED"===a.status?eh.j.parseError(eB.error):void 0,source:"pay",paymentId:eB.paymentId||eK,configuration:{network:eB.paymentAsset.network,asset:eB.paymentAsset.asset,recipient:eB.recipient,amount:eB.amount},currentPayment:{type:"exchange",exchangeId:eB.currentPayment?.exchangeId,sessionId:eB.currentPayment?.sessionId,result:a.txHash}}}),a}catch(e){throw new AppKitPayError(eO.UNABLE_TO_GET_BUY_STATUS)}},async updateBuyStatus(e,t){try{let a=await this.getBuyStatus(e,t);eB.currentPayment&&(eB.currentPayment.status=a.status,eB.currentPayment.result=a.txHash),("SUCCESS"===a.status||"FAILED"===a.status)&&(eB.isPaymentInProgress=!1)}catch(e){throw new AppKitPayError(eO.UNABLE_TO_GET_BUY_STATUS)}},initiatePayment(){eB.isPaymentInProgress=!0,eB.paymentId=crypto.randomUUID()},initializeAnalytics(){eB.analyticsSet||(eB.analyticsSet=!0,this.subscribeKey("isPaymentInProgress",e=>{if(eB.currentPayment?.status&&"UNKNOWN"!==eB.currentPayment.status){let e={IN_PROGRESS:"PAY_INITIATED",SUCCESS:"PAY_SUCCESS",FAILED:"PAY_ERROR"}[eB.currentPayment.status];eR.X.sendEvent({type:"track",event:e,properties:{message:"FAILED"===eB.currentPayment.status?eh.j.parseError(eB.error):void 0,source:"pay",paymentId:eB.paymentId||eK,configuration:{network:eB.paymentAsset.network,asset:eB.paymentAsset.asset,recipient:eB.recipient,amount:eB.amount},currentPayment:{type:eB.currentPayment.type,exchangeId:eB.currentPayment.exchangeId,sessionId:eB.currentPayment.sessionId,result:eB.currentPayment.result}}})}}))}};var eY=i`
  wui-separator {
    margin: var(--apkt-spacing-3) calc(var(--apkt-spacing-3) * -1) var(--apkt-spacing-2)
      calc(var(--apkt-spacing-3) * -1);
    width: calc(100% + var(--apkt-spacing-3) * 2);
  }

  .token-display {
    padding: var(--apkt-spacing-3) var(--apkt-spacing-3);
    border-radius: var(--apkt-borderRadius-5);
    background-color: var(--apkt-tokens-theme-backgroundPrimary);
    margin-top: var(--apkt-spacing-3);
    margin-bottom: var(--apkt-spacing-3);
  }

  .token-display wui-text {
    text-transform: none;
  }

  wui-loading-spinner {
    padding: var(--apkt-spacing-2);
  }
`,__decorate=function(e,t,a,s){var o,l=arguments.length,c=l<3?t:null===s?s=Object.getOwnPropertyDescriptor(t,a):s;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)c=Reflect.decorate(e,t,a,s);else for(var p=e.length-1;p>=0;p--)(o=e[p])&&(c=(l<3?o(c):l>3?o(t,a,c):o(t,a))||c);return l>3&&c&&Object.defineProperty(t,a,c),c};let eV=class extends lit_element_i{constructor(){super(),this.unsubscribe=[],this.amount="",this.tokenSymbol="",this.networkName="",this.exchanges=eG.state.exchanges,this.isLoading=eG.state.isLoading,this.loadingExchangeId=null,this.connectedWalletInfo=ep.R.getAccountData()?.connectedWalletInfo,this.initializePaymentDetails(),this.unsubscribe.push(eG.subscribeKey("exchanges",e=>this.exchanges=e)),this.unsubscribe.push(eG.subscribeKey("isLoading",e=>this.isLoading=e)),this.unsubscribe.push(ep.R.subscribeChainProp("accountState",e=>{this.connectedWalletInfo=e?.connectedWalletInfo})),eG.fetchExchanges()}get isWalletConnected(){let e=ep.R.getAccountData();return e?.status==="connected"}render(){return et`
      <wui-flex flexDirection="column">
        <wui-flex flexDirection="column" .padding=${["0","4","4","4"]} gap="3">
          ${this.renderPaymentHeader()}

          <wui-flex flexDirection="column" gap="3">
            ${this.renderPayWithWallet()} ${this.renderExchangeOptions()}
          </wui-flex>
        </wui-flex>
      </wui-flex>
    `}initializePaymentDetails(){let e=eG.getPaymentAsset();this.networkName=e.network,this.tokenSymbol=e.metadata.symbol,this.amount=eG.state.amount.toString()}renderPayWithWallet(){return!function(e){let{chainNamespace:t}=eT.u.parseCaipNetworkId(e);return eL.includes(t)}(this.networkName)?et``:et`<wui-flex flexDirection="column" gap="3">
        ${this.isWalletConnected?this.renderConnectedView():this.renderDisconnectedView()}
      </wui-flex>
      <wui-separator text="or"></wui-separator>`}renderPaymentHeader(){let e=this.networkName;if(this.networkName){let t=ep.R.getAllRequestedCaipNetworks(),a=t.find(e=>e.caipNetworkId===this.networkName);a&&(e=a.name)}return et`
      <wui-flex flexDirection="column" alignItems="center">
        <wui-flex alignItems="center" gap="2">
          <wui-text variant="h1-regular" color="primary">${this.amount||"0.0000"}</wui-text>
          <wui-flex class="token-display" alignItems="center" gap="1">
            <wui-text variant="md-medium" color="primary">
              ${this.tokenSymbol||"Unknown Asset"}
            </wui-text>
            ${e?et`
                  <wui-text variant="sm-medium" color="secondary">
                    on ${e}
                  </wui-text>
                `:""}
          </wui-flex>
        </wui-flex>
      </wui-flex>
    `}renderConnectedView(){let e=this.connectedWalletInfo?.name||"connected wallet";return et`
      <wui-list-item
        @click=${this.onWalletPayment}
        ?chevron=${!0}
        ?fullSize=${!0}
        ?rounded=${!0}
        data-testid="wallet-payment-option"
        imageSrc=${if_defined_o(this.connectedWalletInfo?.icon)}
      >
        <wui-text variant="lg-regular" color="primary">Pay with ${e}</wui-text>
      </wui-list-item>

      <wui-list-item
        icon="power"
        ?rounded=${!0}
        iconColor="error"
        @click=${this.onDisconnect}
        data-testid="disconnect-button"
        ?chevron=${!1}
      >
        <wui-text variant="lg-regular" color="secondary">Disconnect</wui-text>
      </wui-list-item>
    `}renderDisconnectedView(){return et`<wui-list-item
      variant="icon"
      iconVariant="overlay"
      icon="wallet"
      ?rounded=${!0}
      @click=${this.onWalletPayment}
      ?chevron=${!0}
      data-testid="wallet-payment-option"
    >
      <wui-text variant="lg-regular" color="primary">Pay from wallet</wui-text>
    </wui-list-item>`}renderExchangeOptions(){return this.isLoading?et`<wui-flex justifyContent="center" alignItems="center">
        <wui-spinner size="md"></wui-spinner>
      </wui-flex>`:0===this.exchanges.length?et`<wui-flex justifyContent="center" alignItems="center">
        <wui-text variant="md-medium" color="primary">No exchanges available</wui-text>
      </wui-flex>`:this.exchanges.map(e=>et`
        <wui-list-item
          @click=${()=>this.onExchangePayment(e.id)}
          data-testid="exchange-option-${e.id}"
          ?chevron=${!0}
          ?disabled=${null!==this.loadingExchangeId}
          ?loading=${this.loadingExchangeId===e.id}
          imageSrc=${if_defined_o(e.imageUrl)}
        >
          <wui-flex alignItems="center" gap="3">
            <wui-text flexGrow="1" variant="md-medium" color="primary"
              >Pay with ${e.name} <wui-spinner size="sm" color="secondary"></wui-spinner
            ></wui-text>
          </wui-flex>
        </wui-list-item>
      `)}onWalletPayment(){eG.handlePayWithWallet()}async onExchangePayment(e){try{this.loadingExchangeId=e;let t=await eG.handlePayWithExchange(e);t&&(await eu.I.open({view:"PayLoading"}),eh.j.openHref(t.url,t.openInNewTab?"_blank":"_self"))}catch(e){console.error("Failed to pay with exchange",e),ed.SnackController.showError("Failed to pay with exchange")}finally{this.loadingExchangeId=null}}async onDisconnect(e){e.stopPropagation();try{await ey.ConnectionController.disconnect()}catch{console.error("Failed to disconnect"),ed.SnackController.showError("Failed to disconnect")}}disconnectedCallback(){this.unsubscribe.forEach(e=>e())}};eV.styles=eY,__decorate([state_r()],eV.prototype,"amount",void 0),__decorate([state_r()],eV.prototype,"tokenSymbol",void 0),__decorate([state_r()],eV.prototype,"networkName",void 0),__decorate([state_r()],eV.prototype,"exchanges",void 0),__decorate([state_r()],eV.prototype,"isLoading",void 0),__decorate([state_r()],eV.prototype,"loadingExchangeId",void 0),__decorate([state_r()],eV.prototype,"connectedWalletInfo",void 0),eV=__decorate([(0,em.Mo)("w3m-pay-view")],eV);var eW=a(12858),ez=a(9793),eF=a(44639);a(7013);var eq=i`
  :host {
    display: block;
    height: 100%;
    width: 100%;
  }

  wui-flex:first-child:not(:only-child) {
    position: relative;
  }

  wui-loading-thumbnail {
    position: absolute;
  }
`,w3m_pay_loading_view_decorate=function(e,t,a,s){var o,l=arguments.length,c=l<3?t:null===s?s=Object.getOwnPropertyDescriptor(t,a):s;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)c=Reflect.decorate(e,t,a,s);else for(var p=e.length-1;p>=0;p--)(o=e[p])&&(c=(l<3?o(c):l>3?o(t,a,c):o(t,a))||c);return l>3&&c&&Object.defineProperty(t,a,c),c};let eX=class extends lit_element_i{constructor(){super(),this.loadingMessage="",this.subMessage="",this.paymentState="in-progress",this.paymentState=eG.state.isPaymentInProgress?"in-progress":"completed",this.updateMessages(),this.setupSubscription(),this.setupExchangeSubscription()}disconnectedCallback(){clearInterval(this.exchangeSubscription)}render(){return et`
      <wui-flex
        flexDirection="column"
        alignItems="center"
        .padding=${["7","5","5","5"]}
        gap="9"
      >
        <wui-flex justifyContent="center" alignItems="center"> ${this.getStateIcon()} </wui-flex>
        <wui-flex flexDirection="column" alignItems="center" gap="2">
          <wui-text align="center" variant="lg-medium" color="primary">
            ${this.loadingMessage}
          </wui-text>
          <wui-text align="center" variant="lg-regular" color="secondary">
            ${this.subMessage}
          </wui-text>
        </wui-flex>
      </wui-flex>
    `}updateMessages(){switch(this.paymentState){case"completed":this.loadingMessage="Payment completed",this.subMessage="Your transaction has been successfully processed";break;case"error":this.loadingMessage="Payment failed",this.subMessage="There was an error processing your transaction";break;default:eG.state.currentPayment?.type==="exchange"?(this.loadingMessage="Payment initiated",this.subMessage="Please complete the payment on the exchange"):(this.loadingMessage="Awaiting payment confirmation",this.subMessage="Please confirm the payment transaction in your wallet")}}getStateIcon(){switch(this.paymentState){case"completed":return this.successTemplate();case"error":return this.errorTemplate();default:return this.loaderTemplate()}}setupExchangeSubscription(){eG.state.currentPayment?.type==="exchange"&&(this.exchangeSubscription=setInterval(async()=>{let e=eG.state.currentPayment?.exchangeId,t=eG.state.currentPayment?.sessionId;e&&t&&(await eG.updateBuyStatus(e,t),eG.state.currentPayment?.status==="SUCCESS"&&clearInterval(this.exchangeSubscription))},4e3))}setupSubscription(){eG.subscribeKey("isPaymentInProgress",e=>{e||"in-progress"!==this.paymentState||(eG.state.error||!eG.state.currentPayment?.result?this.paymentState="error":this.paymentState="completed",this.updateMessages(),setTimeout(()=>{"disconnected"!==ey.ConnectionController.state.status&&eu.I.close()},3e3))}),eG.subscribeKey("error",e=>{e&&"in-progress"===this.paymentState&&(this.paymentState="error",this.updateMessages())})}loaderTemplate(){let e=eW.ThemeController.state.themeVariables["--w3m-border-radius-master"],t=e?parseInt(e.replace("px",""),10):4,a=this.getPaymentIcon();return et`
      <wui-flex justifyContent="center" alignItems="center" style="position: relative;">
        ${a?et`<wui-wallet-image size="lg" imageSrc=${a}></wui-wallet-image>`:null}
        <wui-loading-thumbnail radius=${9*t}></wui-loading-thumbnail>
      </wui-flex>
    `}getPaymentIcon(){let e=eG.state.currentPayment;if(e){if("exchange"===e.type){let t=e.exchangeId;if(t){let e=eG.getExchangeById(t);return e?.imageUrl}}if("wallet"===e.type){let e=ep.R.getAccountData()?.connectedWalletInfo?.icon;if(e)return e;let t=ep.R.state.activeChain;if(!t)return;let a=ez.ConnectorController.getConnectorId(t);if(!a)return;let s=ez.ConnectorController.getConnectorById(a);if(!s)return;return eF.f.getConnectorImage(s)}}}successTemplate(){return et`<wui-icon size="xl" color="success" name="checkmark"></wui-icon>`}errorTemplate(){return et`<wui-icon size="xl" color="error" name="close"></wui-icon>`}};async function openPay(e){return eG.handleOpenPay(e)}async function pay(e,t=3e5){if(t<=0)throw new AppKitPayError(eO.INVALID_PAYMENT_CONFIG,"Timeout must be greater than 0");try{await openPay(e)}catch(e){if(e instanceof AppKitPayError)throw e;throw new AppKitPayError(eO.UNABLE_TO_INITIATE_PAYMENT,e.message)}return new Promise((e,a)=>{var s;let o=!1,l=setTimeout(()=>{o||(o=!0,h(),a(new AppKitPayError(eO.GENERIC_PAYMENT_ERROR,"Payment timeout")))},t);function checkAndResolve(){if(o)return;let t=eG.state.currentPayment,a=eG.state.error,s=eG.state.isPaymentInProgress;if(t?.status==="SUCCESS"){o=!0,h(),clearTimeout(l),e({success:!0,result:t.result});return}if(t?.status==="FAILED"){o=!0,h(),clearTimeout(l),e({success:!1,error:a||"Payment failed"});return}!a||s||t||(o=!0,h(),clearTimeout(l),e({success:!1,error:a}))}let c=subscribeStateKey("currentPayment",checkAndResolve),p=subscribeStateKey("error",checkAndResolve),u=subscribeStateKey("isPaymentInProgress",checkAndResolve),h=(s=[c,p,u],()=>{s.forEach(e=>{try{e()}catch{}})});checkAndResolve()})}function client_getExchanges(){return eG.getExchanges()}function getPayResult(){return eG.state.currentPayment?.result}function getPayError(){return eG.state.error}function getIsPaymentInProgress(){return eG.state.isPaymentInProgress}function subscribeStateKey(e,t){return eG.subscribeKey(e,t)}eX.styles=eq,w3m_pay_loading_view_decorate([state_r()],eX.prototype,"loadingMessage",void 0),w3m_pay_loading_view_decorate([state_r()],eX.prototype,"subMessage",void 0),w3m_pay_loading_view_decorate([state_r()],eX.prototype,"paymentState",void 0),eX=w3m_pay_loading_view_decorate([(0,em.Mo)("w3m-pay-loading-view")],eX);let eJ={network:"eip155:8453",asset:"native",metadata:{name:"Ethereum",symbol:"ETH",decimals:18}},eZ={network:"eip155:8453",asset:"0x833589fcd6edb6e08f4c7c32d4f71b54bda02913",metadata:{name:"USD Coin",symbol:"USDC",decimals:6}},eQ={network:"eip155:84532",asset:"native",metadata:{name:"Ethereum",symbol:"ETH",decimals:18}},e0={network:"eip155:1",asset:"0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",metadata:{name:"USD Coin",symbol:"USDC",decimals:6}},e1={network:"eip155:10",asset:"0x0b2c639c533813f4aa9d7837caf62653d097ff85",metadata:{name:"USD Coin",symbol:"USDC",decimals:6}},e3={network:"eip155:42161",asset:"0xaf88d065e77c8cC2239327C5EDb3A432268e5831",metadata:{name:"USD Coin",symbol:"USDC",decimals:6}},e2={network:"eip155:137",asset:"0x3c499c542cef5e3811e1192ce70d8cc03d5c3359",metadata:{name:"USD Coin",symbol:"USDC",decimals:6}},e5={network:"solana:5eykt4UsFv8P8NJdTREpY1vzqKqZKvdp",asset:"EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",metadata:{name:"USD Coin",symbol:"USDC",decimals:6}},e8={network:"eip155:1",asset:"0xdAC17F958D2ee523a2206206994597C13D831ec7",metadata:{name:"Tether USD",symbol:"USDT",decimals:6}},e4={network:"eip155:10",asset:"0x94b008aA00579c1307B0EF2c499aD98a8ce58e58",metadata:{name:"Tether USD",symbol:"USDT",decimals:6}},e6={network:"eip155:42161",asset:"0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9",metadata:{name:"Tether USD",symbol:"USDT",decimals:6}},e9={network:"eip155:137",asset:"0xc2132d05d31c914a87c6611c10748aeb04b58e8f",metadata:{name:"Tether USD",symbol:"USDT",decimals:6}},e7={network:"solana:5eykt4UsFv8P8NJdTREpY1vzqKqZKvdp",asset:"Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB",metadata:{name:"Tether USD",symbol:"USDT",decimals:6}},te={network:"solana:5eykt4UsFv8P8NJdTREpY1vzqKqZKvdp",asset:"native",metadata:{name:"Solana",symbol:"SOL",decimals:9}}},54530:function(e,t,a){var s=a(34615),o=a(38895),l=a(8681);a(98088);var c=a(48113),p=a(25729),u=a(95636),h=u.iv`
  :host {
    position: relative;
  }

  button {
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: transparent;
    padding: ${({spacing:e})=>e[1]};
  }

  /* -- Colors --------------------------------------------------- */
  button[data-type='accent'] wui-icon {
    color: ${({tokens:e})=>e.core.iconAccentPrimary};
  }

  button[data-type='neutral'][data-variant='primary'] wui-icon {
    color: ${({tokens:e})=>e.theme.iconInverse};
  }

  button[data-type='neutral'][data-variant='secondary'] wui-icon {
    color: ${({tokens:e})=>e.theme.iconDefault};
  }

  button[data-type='success'] wui-icon {
    color: ${({tokens:e})=>e.core.iconSuccess};
  }

  button[data-type='error'] wui-icon {
    color: ${({tokens:e})=>e.core.iconError};
  }

  /* -- Sizes --------------------------------------------------- */
  button[data-size='xs'] {
    width: 16px;
    height: 16px;

    border-radius: ${({borderRadius:e})=>e[1]};
  }

  button[data-size='sm'] {
    width: 20px;
    height: 20px;
    border-radius: ${({borderRadius:e})=>e[1]};
  }

  button[data-size='md'] {
    width: 24px;
    height: 24px;
    border-radius: ${({borderRadius:e})=>e[2]};
  }

  button[data-size='lg'] {
    width: 28px;
    height: 28px;
    border-radius: ${({borderRadius:e})=>e[2]};
  }

  button[data-size='xs'] wui-icon {
    width: 8px;
    height: 8px;
  }

  button[data-size='sm'] wui-icon {
    width: 12px;
    height: 12px;
  }

  button[data-size='md'] wui-icon {
    width: 16px;
    height: 16px;
  }

  button[data-size='lg'] wui-icon {
    width: 20px;
    height: 20px;
  }

  /* -- Hover --------------------------------------------------- */
  @media (hover: hover) {
    button[data-type='accent']:hover:enabled {
      background-color: ${({tokens:e})=>e.core.foregroundAccent010};
    }

    button[data-variant='primary'][data-type='neutral']:hover:enabled {
      background-color: ${({tokens:e})=>e.theme.foregroundSecondary};
    }

    button[data-variant='secondary'][data-type='neutral']:hover:enabled {
      background-color: ${({tokens:e})=>e.theme.foregroundSecondary};
    }

    button[data-type='success']:hover:enabled {
      background-color: ${({tokens:e})=>e.core.backgroundSuccess};
    }

    button[data-type='error']:hover:enabled {
      background-color: ${({tokens:e})=>e.core.backgroundError};
    }
  }

  /* -- Focus --------------------------------------------------- */
  button:focus-visible {
    box-shadow: 0 0 0 4px ${({tokens:e})=>e.core.foregroundAccent020};
  }

  /* -- Properties --------------------------------------------------- */
  button[data-full-width='true'] {
    width: 100%;
  }

  :host([fullWidth]) {
    width: 100%;
  }

  button[disabled] {
    opacity: 0.5;
    cursor: not-allowed;
  }
`,__decorate=function(e,t,a,s){var o,l=arguments.length,c=l<3?t:null===s?s=Object.getOwnPropertyDescriptor(t,a):s;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)c=Reflect.decorate(e,t,a,s);else for(var p=e.length-1;p>=0;p--)(o=e[p])&&(c=(l<3?o(c):l>3?o(t,a,c):o(t,a))||c);return l>3&&c&&Object.defineProperty(t,a,c),c};let m=class extends s.oi{constructor(){super(...arguments),this.icon="card",this.variant="primary",this.type="accent",this.size="md",this.iconSize=void 0,this.fullWidth=!1,this.disabled=!1}render(){return s.dy`<button
      data-variant=${this.variant}
      data-type=${this.type}
      data-size=${this.size}
      data-full-width=${this.fullWidth}
      ?disabled=${this.disabled}
    >
      <wui-icon color="inherit" name=${this.icon} size=${(0,l.o)(this.iconSize)}></wui-icon>
    </button>`}};m.styles=[c.ET,c.ZM,h],__decorate([(0,o.Cb)()],m.prototype,"icon",void 0),__decorate([(0,o.Cb)()],m.prototype,"variant",void 0),__decorate([(0,o.Cb)()],m.prototype,"type",void 0),__decorate([(0,o.Cb)()],m.prototype,"size",void 0),__decorate([(0,o.Cb)()],m.prototype,"iconSize",void 0),__decorate([(0,o.Cb)({type:Boolean})],m.prototype,"fullWidth",void 0),__decorate([(0,o.Cb)({type:Boolean})],m.prototype,"disabled",void 0),__decorate([(0,p.M)("wui-icon-button")],m)},87809:function(e,t,a){a(31059)}}]);