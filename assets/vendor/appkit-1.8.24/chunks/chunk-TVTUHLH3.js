import{a as t,c as u}from"./chunk-VRWQ57HX.js";import{C as h,E as m,I as f,J as g,M as y,w as a}from"./chunk-L6OIOM3D.js";var b=m`
  :host {
    width: 100%;
  }

  :host([data-type='primary']) > button {
    background-color: ${({tokens:o})=>o.theme.backgroundPrimary};
  }

  :host([data-type='secondary']) > button {
    background-color: ${({tokens:o})=>o.theme.foregroundPrimary};
  }

  button {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: ${({spacing:o})=>o[3]};
    width: 100%;
    border-radius: ${({borderRadius:o})=>o[4]};
    transition:
      background-color ${({durations:o})=>o.lg}
        ${({easings:o})=>o["ease-out-power-2"]},
      scale ${({durations:o})=>o.lg} ${({easings:o})=>o["ease-out-power-2"]};
    will-change: background-color, scale;
  }

  wui-text {
    text-transform: capitalize;
  }

  wui-image {
    color: ${({tokens:o})=>o.theme.textPrimary};
  }

  @media (hover: hover) {
    :host([data-type='primary']) > button:hover:enabled {
      background-color: ${({tokens:o})=>o.theme.foregroundPrimary};
    }

    :host([data-type='secondary']) > button:hover:enabled {
      background-color: ${({tokens:o})=>o.theme.foregroundSecondary};
    }
  }

  button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;var i=function(o,n,l,d){var s=arguments.length,r=s<3?n:d===null?d=Object.getOwnPropertyDescriptor(n,l):d,p;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")r=Reflect.decorate(o,n,l,d);else for(var c=o.length-1;c>=0;c--)(p=o[c])&&(r=(s<3?p(r):s>3?p(n,l,r):p(n,l))||r);return s>3&&r&&Object.defineProperty(n,l,r),r},e=class extends h{constructor(){super(...arguments),this.type="primary",this.imageSrc="google",this.imageSize=void 0,this.loading=!1,this.boxColor="foregroundPrimary",this.disabled=!1,this.rightIcon=!0,this.boxed=!0,this.rounded=!1,this.fullSize=!1}render(){return this.dataset.rounded=this.rounded?"true":"false",this.dataset.type=this.type,a`
      <button
        ?disabled=${this.loading?!0:!!this.disabled}
        data-loading=${this.loading}
        tabindex=${u(this.tabIdx)}
      >
        <wui-flex gap="2" alignItems="center">
          ${this.templateLeftIcon()}
          <wui-flex gap="1">
            <slot></slot>
          </wui-flex>
        </wui-flex>
        ${this.templateRightIcon()}
      </button>
    `}templateLeftIcon(){return this.icon?a`<wui-image
        icon=${this.icon}
        iconColor=${u(this.iconColor)}
        ?boxed=${this.boxed}
        ?rounded=${this.rounded}
        boxColor=${this.boxColor}
      ></wui-image>`:a`<wui-image
      ?boxed=${this.boxed}
      ?rounded=${this.rounded}
      ?fullSize=${this.fullSize}
      size=${u(this.imageSize)}
      src=${this.imageSrc}
      boxColor=${this.boxColor}
    ></wui-image>`}templateRightIcon(){return this.rightIcon?this.loading?a`<wui-loading-spinner size="md" color="accent-primary"></wui-loading-spinner>`:a`<wui-icon name="chevronRight" size="lg" color="default"></wui-icon>`:null}};e.styles=[f,g,b];i([t()],e.prototype,"type",void 0);i([t()],e.prototype,"imageSrc",void 0);i([t()],e.prototype,"imageSize",void 0);i([t()],e.prototype,"icon",void 0);i([t()],e.prototype,"iconColor",void 0);i([t({type:Boolean})],e.prototype,"loading",void 0);i([t()],e.prototype,"tabIdx",void 0);i([t()],e.prototype,"boxColor",void 0);i([t({type:Boolean})],e.prototype,"disabled",void 0);i([t({type:Boolean})],e.prototype,"rightIcon",void 0);i([t({type:Boolean})],e.prototype,"boxed",void 0);i([t({type:Boolean})],e.prototype,"rounded",void 0);i([t({type:Boolean})],e.prototype,"fullSize",void 0);e=i([y("wui-list-item")],e);
