import{a as n,b as w}from"./chunk-VRWQ57HX.js";import{C as d,E as f,I as h,J as g,M as b,w as s}from"./chunk-L6OIOM3D.js";import{h as p}from"./chunk-Z6Y4EM3A.js";var k=f`
  :host {
    width: 100%;
  }

  button {
    padding: ${({spacing:e})=>e[3]};
    display: flex;
    gap: ${({spacing:e})=>e[3]};
    justify-content: space-between;
    width: 100%;
    border-radius: ${({borderRadius:e})=>e[4]};
    background-color: transparent;
  }

  @media (hover: hover) {
    button:hover:enabled {
      background-color: ${({tokens:e})=>e.theme.foregroundSecondary};
    }
  }

  button:focus-visible:enabled {
    background-color: ${({tokens:e})=>e.theme.foregroundSecondary};
    box-shadow: 0 0 0 4px ${({tokens:e})=>e.core.foregroundAccent040};
  }

  button[data-clickable='false'] {
    pointer-events: none;
    background-color: transparent;
  }

  wui-image,
  wui-icon {
    width: ${({spacing:e})=>e[10]};
    height: ${({spacing:e})=>e[10]};
  }

  wui-image {
    border-radius: ${({borderRadius:e})=>e[16]};
  }

  .token-name-container {
    flex: 1;
  }
`;var i=function(e,o,a,l){var u=arguments.length,r=u<3?o:l===null?l=Object.getOwnPropertyDescriptor(o,a):l,m;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")r=Reflect.decorate(e,o,a,l);else for(var c=e.length-1;c>=0;c--)(m=e[c])&&(r=(u<3?m(r):u>3?m(o,a,r):m(o,a))||r);return u>3&&r&&Object.defineProperty(o,a,r),r},t=class extends d{constructor(){super(...arguments),this.tokenName="",this.tokenImageUrl="",this.tokenValue=0,this.tokenAmount="0.0",this.tokenCurrency="",this.clickable=!1,this.imageError=!1}render(){return s`
      <button data-clickable=${String(this.clickable)}>
        <wui-flex gap="2" alignItems="center">
          ${this.visualTemplate()}
          <wui-flex
            flexDirection="column"
            justifyContent="space-between"
            gap="1"
            class="token-name-container"
          >
            <wui-text variant="md-regular" color="primary" lineClamp="1">
              ${this.tokenName}
            </wui-text>
            <wui-text variant="sm-regular-mono" color="secondary">
              ${p.formatNumberToLocalString(this.tokenAmount,4)} ${this.tokenCurrency}
            </wui-text>
          </wui-flex>
        </wui-flex>
        <wui-flex
          flexDirection="column"
          justifyContent="space-between"
          gap="1"
          alignItems="flex-end"
          width="auto"
        >
          <wui-text variant="md-regular-mono" color="primary"
            >$${this.tokenValue.toFixed(2)}</wui-text
          >
          <wui-text variant="sm-regular-mono" color="secondary">
            ${p.formatNumberToLocalString(this.tokenAmount,4)}
          </wui-text>
        </wui-flex>
      </button>
    `}updated(o){o.has("tokenImageUrl")&&(this.imageError=!1)}visualTemplate(){return this.tokenName&&this.tokenImageUrl&&!this.imageError?s`<wui-image
        alt=${this.tokenName}
        src=${this.tokenImageUrl}
        @onLoadError=${this.handleImageError}
      ></wui-image>`:s`<wui-icon name="coinPlaceholder" color="default"></wui-icon>`}handleImageError(){this.imageError=!0}};t.styles=[h,g,k];i([n()],t.prototype,"tokenName",void 0);i([n()],t.prototype,"tokenImageUrl",void 0);i([n({type:Number})],t.prototype,"tokenValue",void 0);i([n()],t.prototype,"tokenAmount",void 0);i([n()],t.prototype,"tokenCurrency",void 0);i([n({type:Boolean})],t.prototype,"clickable",void 0);i([w()],t.prototype,"imageError",void 0);t=i([b("wui-list-token")],t);
