import{a as s}from"./chunk-ID64J23X.js";import{a as d}from"./chunk-VRWQ57HX.js";import{C as g,E as v,I as $,M as y,w as p}from"./chunk-L6OIOM3D.js";import{H as l,T as f,f as h}from"./chunk-Z6Y4EM3A.js";var z={getTabsByNamespace(t){return!!t&&t===h.CHAIN.EVM?l.state.remoteFeatures?.activity===!1?s.ACCOUNT_TABS.filter(r=>r.label!=="Activity"):s.ACCOUNT_TABS:[]},isValidReownName(t){return/^[a-zA-Z0-9]+$/gu.test(t)},isValidEmail(t){return/^[^\s@]+@[^\s@]+\.[^\s@]+$/gu.test(t)},validateReownName(t){return t.replace(/\^/gu,"").toLowerCase().replace(/[^a-zA-Z0-9]/gu,"")},hasFooter(){let t=f.state.view;if(s.VIEWS_WITH_LEGAL_FOOTER.includes(t)){let{termsConditionsUrl:e,privacyPolicyUrl:r}=l.state,i=l.state.features?.legalCheckbox;return!(!e&&!r||i)}return s.VIEWS_WITH_DEFAULT_FOOTER.includes(t)}};var x=v`
  :host {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: ${({spacing:t})=>t[1]};
    text-transform: uppercase;
    white-space: nowrap;
  }

  :host([data-variant='accent']) {
    background-color: ${({tokens:t})=>t.core.foregroundAccent010};
    color: ${({tokens:t})=>t.core.textAccentPrimary};
  }

  :host([data-variant='info']) {
    background-color: ${({tokens:t})=>t.theme.foregroundSecondary};
    color: ${({tokens:t})=>t.theme.textSecondary};
  }

  :host([data-variant='success']) {
    background-color: ${({tokens:t})=>t.core.backgroundSuccess};
    color: ${({tokens:t})=>t.core.textSuccess};
  }

  :host([data-variant='warning']) {
    background-color: ${({tokens:t})=>t.core.backgroundWarning};
    color: ${({tokens:t})=>t.core.textWarning};
  }

  :host([data-variant='error']) {
    background-color: ${({tokens:t})=>t.core.backgroundError};
    color: ${({tokens:t})=>t.core.textError};
  }

  :host([data-variant='certified']) {
    background-color: ${({tokens:t})=>t.theme.foregroundSecondary};
    color: ${({tokens:t})=>t.theme.textSecondary};
  }

  :host([data-size='md']) {
    height: 30px;
    padding: 0 ${({spacing:t})=>t[2]};
    border-radius: ${({borderRadius:t})=>t[2]};
  }

  :host([data-size='sm']) {
    height: 20px;
    padding: 0 ${({spacing:t})=>t[1]};
    border-radius: ${({borderRadius:t})=>t[1]};
  }
`;var u=function(t,e,r,i){var n=arguments.length,o=n<3?e:i===null?i=Object.getOwnPropertyDescriptor(e,r):i,c;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")o=Reflect.decorate(t,e,r,i);else for(var m=t.length-1;m>=0;m--)(c=t[m])&&(o=(n<3?c(o):n>3?c(e,r,o):c(e,r))||o);return n>3&&o&&Object.defineProperty(e,r,o),o},a=class extends g{constructor(){super(...arguments),this.variant="accent",this.size="md",this.icon=void 0}render(){this.dataset.variant=this.variant,this.dataset.size=this.size;let e=this.size==="md"?"md-medium":"sm-medium",r=this.size==="md"?"md":"sm";return p`
      ${this.icon?p`<wui-icon size=${r} name=${this.icon}></wui-icon>`:null}
      <wui-text
        display="inline"
        data-variant=${this.variant}
        variant=${e}
        color="inherit"
      >
        <slot></slot>
      </wui-text>
    `}};a.styles=[$,x];u([d()],a.prototype,"variant",void 0);u([d()],a.prototype,"size",void 0);u([d()],a.prototype,"icon",void 0);a=u([y("wui-tag")],a);export{z as a};
