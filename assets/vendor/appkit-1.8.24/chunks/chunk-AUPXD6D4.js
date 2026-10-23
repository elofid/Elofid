import{a as o,c as v}from"./chunk-VRWQ57HX.js";import{C as f,I as c,M as h,t as d,w as u}from"./chunk-L6OIOM3D.js";var b=d`
  :host {
    position: relative;
    display: inline-block;
    width: 100%;
  }
`;var l=function(p,r,i,s){var a=arguments.length,t=a<3?r:s===null?s=Object.getOwnPropertyDescriptor(r,i):s,m;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")t=Reflect.decorate(p,r,i,s);else for(var n=p.length-1;n>=0;n--)(m=p[n])&&(t=(a<3?m(t):a>3?m(r,i,t):m(r,i))||t);return a>3&&t&&Object.defineProperty(r,i,t),t},e=class extends f{constructor(){super(...arguments),this.disabled=!1}render(){return u`
      <wui-input-text
        type="email"
        placeholder="Email"
        icon="mail"
        size="lg"
        .disabled=${this.disabled}
        .value=${this.value}
        data-testid="wui-email-input"
        tabIdx=${v(this.tabIdx)}
      ></wui-input-text>
      ${this.templateError()}
    `}templateError(){return this.errorMessage?u`<wui-text variant="sm-regular" color="error">${this.errorMessage}</wui-text>`:null}};e.styles=[c,b];l([o()],e.prototype,"errorMessage",void 0);l([o({type:Boolean})],e.prototype,"disabled",void 0);l([o()],e.prototype,"value",void 0);l([o()],e.prototype,"tabIdx",void 0);e=l([h("wui-email-input")],e);
