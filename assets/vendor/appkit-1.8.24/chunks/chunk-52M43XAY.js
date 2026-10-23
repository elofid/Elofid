import{a as p,c as w}from"./chunk-VRWQ57HX.js";import{C as c,E as f,I as d,J as b,M as h,w as a}from"./chunk-L6OIOM3D.js";var y=f`
  :host {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 40px;
    height: 40px;
    border-radius: ${({borderRadius:t})=>t[20]};
    overflow: hidden;
  }

  wui-icon {
    width: 100%;
    height: 100%;
  }
`;var x=function(t,o,r,i){var n=arguments.length,e=n<3?o:i===null?i=Object.getOwnPropertyDescriptor(o,r):i,l;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")e=Reflect.decorate(t,o,r,i);else for(var s=t.length-1;s>=0;s--)(l=t[s])&&(e=(n<3?l(e):n>3?l(o,r,e):l(o,r))||e);return n>3&&e&&Object.defineProperty(o,r,e),e},g=class extends c{constructor(){super(...arguments),this.logo="google"}render(){return a`<wui-icon color="inherit" size="inherit" name=${this.logo}></wui-icon> `}};g.styles=[d,y];x([p()],g.prototype,"logo",void 0);g=x([h("wui-logo")],g);var v=f`
  :host {
    width: 100%;
  }

  button {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: ${({spacing:t})=>t[3]};
    width: 100%;
    background-color: transparent;
    border-radius: ${({borderRadius:t})=>t[4]};
  }

  wui-text {
    text-transform: capitalize;
  }

  @media (hover: hover) {
    button:hover:enabled {
      background-color: ${({tokens:t})=>t.theme.foregroundPrimary};
    }
  }

  button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;var u=function(t,o,r,i){var n=arguments.length,e=n<3?o:i===null?i=Object.getOwnPropertyDescriptor(o,r):i,l;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")e=Reflect.decorate(t,o,r,i);else for(var s=t.length-1;s>=0;s--)(l=t[s])&&(e=(n<3?l(e):n>3?l(o,r,e):l(o,r))||e);return n>3&&e&&Object.defineProperty(o,r,e),e},m=class extends c{constructor(){super(...arguments),this.logo="google",this.name="Continue with google",this.disabled=!1}render(){return a`
      <button ?disabled=${this.disabled} tabindex=${w(this.tabIdx)}>
        <wui-flex gap="2" alignItems="center">
          <wui-image ?boxed=${!0} logo=${this.logo}></wui-image>
          <wui-text variant="lg-regular" color="primary">${this.name}</wui-text>
        </wui-flex>
        <wui-icon name="chevronRight" size="lg" color="default"></wui-icon>
      </button>
    `}};m.styles=[d,b,v];u([p()],m.prototype,"logo",void 0);u([p()],m.prototype,"name",void 0);u([p()],m.prototype,"tabIdx",void 0);u([p({type:Boolean})],m.prototype,"disabled",void 0);m=u([h("wui-list-social")],m);
