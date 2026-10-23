import{e as A,f as l,g as f}from"./chunk-VRWQ57HX.js";import{A as c,B as _}from"./chunk-L6OIOM3D.js";var{I:y}=_;var p=t=>t.strings===void 0;var o=(t,e)=>{let s=t._$AN;if(s===void 0)return!1;for(let i of s)i._$AO?.(e,!1),o(i,e);return!0},n=t=>{let e,s;do{if((e=t._$AM)===void 0)break;s=e._$AN,s.delete(t),t=e}while(s?.size===0)},v=t=>{for(let e;e=t._$AM;t=e){let s=e._$AN;if(s===void 0)e._$AN=s=new Set;else if(s.has(t))break;s.add(t),g(e)}};function m(t){this._$AN!==void 0?(n(this),this._$AM=t,v(this)):this._$AM=t}function u(t,e=!1,s=0){let i=this._$AH,d=this._$AN;if(d!==void 0&&d.size!==0)if(e)if(Array.isArray(i))for(let r=s;r<i.length;r++)o(i[r],!1),n(i[r]);else i!=null&&(o(i,!1),n(i));else o(this,t)}var g=t=>{t.type==A.CHILD&&(t._$AP??(t._$AP=u),t._$AQ??(t._$AQ=m))},h=class extends f{constructor(){super(...arguments),this._$AN=void 0}_$AT(e,s,i){super._$AT(e,s,i),v(this),this.isConnected=e._$AU}_$AO(e,s=!0){e!==this.isConnected&&(this.isConnected=e,e?this.reconnected?.():this.disconnected?.()),s&&(o(this,e),n(this))}setValue(e){if(p(this._$Ct))this._$Ct._$AI(e,this);else{let s=[...this._$Ct._$AH];s[this._$Ci]=e,this._$Ct._$AI(s,this,0)}}disconnected(){}reconnected(){}};var b=()=>new $,$=class{},a=new WeakMap,R=l(class extends h{render(t){return c}update(t,[e]){let s=e!==this.G;return s&&this.rt(void 0),(s||this.lt!==this.ct)&&(this.G=e,this.ht=t.options?.host,this.rt(this.ct=t.element)),c}rt(t){if(this.G!==void 0)if(this.isConnected||(t=void 0),typeof this.G=="function"){let e=this.ht??globalThis,s=a.get(e);s===void 0&&(s=new WeakMap,a.set(e,s)),s.get(this.G)!==void 0&&this.G.call(this.ht,void 0),s.set(this.G,t),t!==void 0&&this.G.call(this.ht,t)}else this.G.value=t}get lt(){return typeof this.G=="function"?a.get(this.ht??globalThis)?.get(this.G):this.G?.value}disconnected(){this.lt===this.ct&&this.rt(void 0)}reconnected(){this.rt(this.ct)}});export{b as a,R as b};
/*! Bundled license information:

lit-html/directive-helpers.js:
lit-html/directives/ref.js:
  (**
   * @license
   * Copyright 2020 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

lit-html/async-directive.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)
*/
