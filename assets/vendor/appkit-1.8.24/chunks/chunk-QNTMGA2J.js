import{b as R}from"./chunk-VRWQ57HX.js";import{C as u,E as p,I as C,J as _,M as m,t as v,w as s}from"./chunk-L6OIOM3D.js";import{H as c,P as y,T as x,Z as b,ia as g,y as h}from"./chunk-Z6Y4EM3A.js";var O=v``;var $=function(o,e,r,n){var i=arguments.length,t=i<3?e:n===null?n=Object.getOwnPropertyDescriptor(e,r):n,l;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")t=Reflect.decorate(o,e,r,n);else for(var a=o.length-1;a>=0;a--)(l=o[a])&&(t=(i<3?l(t):i>3?l(e,r,t):l(e,r))||t);return i>3&&t&&Object.defineProperty(e,r,t),t},w=class extends u{render(){let{termsConditionsUrl:e,privacyPolicyUrl:r}=c.state;return!e&&!r?null:s`
      <wui-flex
        .padding=${["4","3","3","3"]}
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        gap="3"
      >
        <wui-text color="secondary" variant="md-regular" align="center">
          We work with the best providers to give you the lowest fees and best support. More options
          coming soon!
        </wui-text>

        ${this.howDoesItWorkTemplate()}
      </wui-flex>
    `}howDoesItWorkTemplate(){return s` <wui-link @click=${this.onWhatIsBuy.bind(this)}>
      <wui-icon size="xs" color="accent-primary" slot="iconLeft" name="helpCircle"></wui-icon>
      How does it work?
    </wui-link>`}onWhatIsBuy(){y.sendEvent({type:"track",event:"SELECT_WHAT_IS_A_BUY",properties:{isSmartAccount:b(g.state.activeChain)===h.ACCOUNT_TYPES.SMART_ACCOUNT}}),x.push("WhatIsABuy")}};w.styles=[O];w=$([m("w3m-onramp-providers-footer")],w);var T="https://reown.com";var P=p`
  .reown-logo {
    height: 24px;
  }

  a {
    text-decoration: none;
    cursor: pointer;
    color: ${({tokens:o})=>o.theme.textSecondary};
  }

  a:hover {
    opacity: 0.9;
  }
`;var E=function(o,e,r,n){var i=arguments.length,t=i<3?e:n===null?n=Object.getOwnPropertyDescriptor(e,r):n,l;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")t=Reflect.decorate(o,e,r,n);else for(var a=o.length-1;a>=0;a--)(l=o[a])&&(t=(i<3?l(t):i>3?l(e,r,t):l(e,r))||t);return i>3&&t&&Object.defineProperty(e,r,t),t},d=class extends u{render(){return s`
      <a
        data-testid="ux-branding-reown"
        href=${T}
        rel="noreferrer"
        target="_blank"
        style="text-decoration: none;"
      >
        <wui-flex
          justifyContent="center"
          alignItems="center"
          gap="1"
          .padding=${["01","0","3","0"]}
        >
          <wui-text variant="sm-regular" color="inherit"> UX by </wui-text>
          <wui-icon name="reown" size="inherit" class="reown-logo"></wui-icon>
        </wui-flex>
      </a>
    `}};d.styles=[C,_,P];d=E([m("wui-ux-by-reown")],d);var U=p`
  :host wui-ux-by-reown {
    padding-top: 0;
  }

  :host wui-ux-by-reown.branding-only {
    padding-top: ${({spacing:o})=>o[3]};
  }

  a {
    text-decoration: none;
    color: ${({tokens:o})=>o.core.textAccentPrimary};
    font-weight: 500;
  }
`;var W=function(o,e,r,n){var i=arguments.length,t=i<3?e:n===null?n=Object.getOwnPropertyDescriptor(e,r):n,l;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")t=Reflect.decorate(o,e,r,n);else for(var a=o.length-1;a>=0;a--)(l=o[a])&&(t=(i<3?l(t):i>3?l(e,r,t):l(e,r))||t);return i>3&&t&&Object.defineProperty(e,r,t),t},f=class extends u{constructor(){super(),this.unsubscribe=[],this.remoteFeatures=c.state.remoteFeatures,this.unsubscribe.push(c.subscribeKey("remoteFeatures",e=>this.remoteFeatures=e))}disconnectedCallback(){this.unsubscribe.forEach(e=>e())}render(){let{termsConditionsUrl:e,privacyPolicyUrl:r}=c.state,n=c.state.features?.legalCheckbox;return!e&&!r||n?s`
        <wui-flex flexDirection="column"> ${this.reownBrandingTemplate(!0)} </wui-flex>
      `:s`
      <wui-flex flexDirection="column">
        <wui-flex .padding=${["4","3","3","3"]} justifyContent="center">
          <wui-text color="secondary" variant="md-regular" align="center">
            By connecting your wallet, you agree to our <br />
            ${this.termsTemplate()} ${this.andTemplate()} ${this.privacyTemplate()}
          </wui-text>
        </wui-flex>
        ${this.reownBrandingTemplate()}
      </wui-flex>
    `}andTemplate(){let{termsConditionsUrl:e,privacyPolicyUrl:r}=c.state;return e&&r?"and":""}termsTemplate(){let{termsConditionsUrl:e}=c.state;return e?s`<a href=${e} target="_blank" rel="noopener noreferrer"
      >Terms of Service</a
    >`:null}privacyTemplate(){let{privacyPolicyUrl:e}=c.state;return e?s`<a href=${e} target="_blank" rel="noopener noreferrer"
      >Privacy Policy</a
    >`:null}reownBrandingTemplate(e=!1){return this.remoteFeatures?.reownBranding?e?s`<wui-ux-by-reown class="branding-only"></wui-ux-by-reown>`:s`<wui-ux-by-reown></wui-ux-by-reown>`:null}};f.styles=[U];W([R()],f.prototype,"remoteFeatures",void 0);f=W([m("w3m-legal-footer")],f);
