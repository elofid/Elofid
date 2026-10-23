import{a as c}from"./chunk-VRWQ57HX.js";import{C as m,E as d,I as f,M as h,w as p}from"./chunk-L6OIOM3D.js";var g=d`
  :host {
    position: relative;
    display: flex;
    width: 100%;
    height: 1px;
    background-color: ${({tokens:t})=>t.theme.borderPrimary};
    justify-content: center;
    align-items: center;
  }

  :host > wui-text {
    position: absolute;
    padding: 0px 8px;
    transition: background-color ${({durations:t})=>t.lg}
      ${({easings:t})=>t["ease-out-power-2"]};
    will-change: background-color;
  }

  :host([data-bg-color='primary']) > wui-text {
    background-color: ${({tokens:t})=>t.theme.backgroundPrimary};
  }

  :host([data-bg-color='secondary']) > wui-text {
    background-color: ${({tokens:t})=>t.theme.foregroundPrimary};
  }
`;var u=function(t,o,e,a){var l=arguments.length,r=l<3?o:a===null?a=Object.getOwnPropertyDescriptor(o,e):a,n;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")r=Reflect.decorate(t,o,e,a);else for(var s=t.length-1;s>=0;s--)(n=t[s])&&(r=(l<3?n(r):l>3?n(o,e,r):n(o,e))||r);return l>3&&r&&Object.defineProperty(o,e,r),r},i=class extends m{constructor(){super(...arguments),this.text="",this.bgColor="primary"}render(){return this.dataset.bgColor=this.bgColor,p`${this.template()}`}template(){return this.text?p`<wui-text variant="md-regular" color="secondary">${this.text}</wui-text>`:null}};i.styles=[f,g];u([c()],i.prototype,"text",void 0);u([c()],i.prototype,"bgColor",void 0);i=u([h("wui-separator")],i);
