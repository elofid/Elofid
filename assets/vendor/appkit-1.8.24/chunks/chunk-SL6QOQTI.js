import{a,c as y}from"./chunk-VRWQ57HX.js";import{C as p,E as h,I as f,J as m,M as g,w as u}from"./chunk-L6OIOM3D.js";var b=h`
  :host {
    display: inline-flex;
    justify-content: center;
    align-items: center;
    border-radius: ${({borderRadius:o})=>o[2]};
    padding: ${({spacing:o})=>o[1]} !important;
    background-color: ${({tokens:o})=>o.theme.backgroundPrimary};
    position: relative;
  }

  :host([data-padding='2']) {
    padding: ${({spacing:o})=>o[2]} !important;
  }

  :host:after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    border-radius: ${({borderRadius:o})=>o[2]};
  }

  :host > wui-icon {
    z-index: 10;
  }

  /* -- Colors --------------------------------------------------- */
  :host([data-color='accent-primary']) {
    color: ${({tokens:o})=>o.core.iconAccentPrimary};
  }

  :host([data-color='accent-primary']):after {
    background-color: ${({tokens:o})=>o.core.foregroundAccent010};
  }

  :host([data-color='default']),
  :host([data-color='secondary']) {
    color: ${({tokens:o})=>o.theme.iconDefault};
  }

  :host([data-color='default']):after {
    background-color: ${({tokens:o})=>o.theme.foregroundPrimary};
  }

  :host([data-color='secondary']):after {
    background-color: ${({tokens:o})=>o.theme.foregroundSecondary};
  }

  :host([data-color='success']) {
    color: ${({tokens:o})=>o.core.iconSuccess};
  }

  :host([data-color='success']):after {
    background-color: ${({tokens:o})=>o.core.backgroundSuccess};
  }

  :host([data-color='error']) {
    color: ${({tokens:o})=>o.core.iconError};
  }

  :host([data-color='error']):after {
    background-color: ${({tokens:o})=>o.core.backgroundError};
  }

  :host([data-color='warning']) {
    color: ${({tokens:o})=>o.core.iconWarning};
  }

  :host([data-color='warning']):after {
    background-color: ${({tokens:o})=>o.core.backgroundWarning};
  }

  :host([data-color='inverse']) {
    color: ${({tokens:o})=>o.theme.iconInverse};
  }

  :host([data-color='inverse']):after {
    background-color: transparent;
  }
`;var n=function(o,e,c,i){var s=arguments.length,r=s<3?e:i===null?i=Object.getOwnPropertyDescriptor(e,c):i,d;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")r=Reflect.decorate(o,e,c,i);else for(var l=o.length-1;l>=0;l--)(d=o[l])&&(r=(s<3?d(r):s>3?d(e,c,r):d(e,c))||r);return s>3&&r&&Object.defineProperty(e,c,r),r},t=class extends p{constructor(){super(...arguments),this.icon="copy",this.size="md",this.padding="1",this.color="default"}render(){return this.dataset.padding=this.padding,this.dataset.color=this.color,u`
      <wui-icon size=${y(this.size)} name=${this.icon} color="inherit"></wui-icon>
    `}};t.styles=[f,m,b];n([a()],t.prototype,"icon",void 0);n([a()],t.prototype,"size",void 0);n([a()],t.prototype,"padding",void 0);n([a()],t.prototype,"color",void 0);t=n([g("wui-icon-box")],t);
