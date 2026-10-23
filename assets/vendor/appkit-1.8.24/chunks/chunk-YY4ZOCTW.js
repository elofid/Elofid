import{a as n}from"./chunk-VRWQ57HX.js";import{C as l,E as p,M as f,w as u}from"./chunk-L6OIOM3D.js";var c=p`
  :host {
    display: block;
    background: linear-gradient(
      90deg,
      ${({tokens:e})=>e.theme.foregroundPrimary} 0%,
      ${({tokens:e})=>e.theme.foregroundSecondary} 50%,
      ${({tokens:e})=>e.theme.foregroundPrimary} 100%
    );
    background-size: 200% 100%;
    animation: shimmer 2s linear infinite;
    border-radius: ${({borderRadius:e})=>e[1]};
  }

  :host([data-rounded='true']) {
    border-radius: ${({borderRadius:e})=>e[16]};
  }

  @keyframes shimmer {
    0% {
      background-position: 100% 0;
    }
    100% {
      background-position: -100% 0;
    }
  }
`;var s=function(e,o,i,d){var h=arguments.length,t=h<3?o:d===null?d=Object.getOwnPropertyDescriptor(o,i):d,m;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")t=Reflect.decorate(e,o,i,d);else for(var a=e.length-1;a>=0;a--)(m=e[a])&&(t=(h<3?m(t):h>3?m(o,i,t):m(o,i))||t);return h>3&&t&&Object.defineProperty(o,i,t),t},r=class extends l{constructor(){super(...arguments),this.width="",this.height="",this.variant="default",this.rounded=!1}render(){return this.style.cssText=`
      width: ${this.width};
      height: ${this.height};
    `,this.dataset.rounded=this.rounded?"true":"false",u`<slot></slot>`}};r.styles=[c];s([n()],r.prototype,"width",void 0);s([n()],r.prototype,"height",void 0);s([n()],r.prototype,"variant",void 0);s([n({type:Boolean})],r.prototype,"rounded",void 0);r=s([f("wui-shimmer")],r);
