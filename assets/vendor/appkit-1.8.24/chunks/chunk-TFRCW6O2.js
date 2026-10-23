import{a}from"./chunk-VRWQ57HX.js";import{C as b,E as p,I as m,J as f,M as v,w as l}from"./chunk-L6OIOM3D.js";var h=p`
  button {
    border: none;
    background: transparent;
    height: 20px;
    padding: ${({spacing:t})=>t[2]};
    column-gap: ${({spacing:t})=>t[1]};
    border-radius: ${({borderRadius:t})=>t[1]};
    padding: 0 ${({spacing:t})=>t[1]};
    border-radius: ${({spacing:t})=>t[1]};
  }

  /* -- Variants --------------------------------------------------------- */
  button[data-variant='accent'] {
    color: ${({tokens:t})=>t.core.textAccentPrimary};
  }

  button[data-variant='secondary'] {
    color: ${({tokens:t})=>t.theme.textSecondary};
  }

  /* -- Focus states --------------------------------------------------- */
  button:focus-visible:enabled {
    box-shadow: 0px 0px 0px 4px rgba(9, 136, 240, 0.2);
  }

  button[data-variant='accent']:focus-visible:enabled {
    background-color: ${({tokens:t})=>t.core.foregroundAccent010};
  }

  button[data-variant='secondary']:focus-visible:enabled {
    background-color: ${({tokens:t})=>t.theme.foregroundSecondary};
  }

  /* -- Hover & Active states ----------------------------------------------------------- */
  button[data-variant='accent']:hover:enabled {
    background-color: ${({tokens:t})=>t.core.foregroundAccent010};
  }

  button[data-variant='secondary']:hover:enabled {
    background-color: ${({tokens:t})=>t.theme.foregroundSecondary};
  }

  button[data-variant='accent']:focus-visible {
    background-color: ${({tokens:t})=>t.core.foregroundAccent010};
  }

  button[data-variant='secondary']:focus-visible {
    background-color: ${({tokens:t})=>t.theme.foregroundSecondary};
    box-shadow: 0px 0px 0px 4px rgba(9, 136, 240, 0.2);
  }

  button[disabled] {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;var i=function(t,r,n,c){var d=arguments.length,o=d<3?r:c===null?c=Object.getOwnPropertyDescriptor(r,n):c,s;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")o=Reflect.decorate(t,r,n,c);else for(var u=t.length-1;u>=0;u--)(s=t[u])&&(o=(d<3?s(o):d>3?s(r,n,o):s(r,n))||o);return d>3&&o&&Object.defineProperty(r,n,o),o},y={sm:"sm-medium",md:"md-medium"},g={accent:"accent-primary",secondary:"secondary"},e=class extends b{constructor(){super(...arguments),this.size="md",this.disabled=!1,this.variant="accent",this.icon=void 0}render(){return l`
      <button ?disabled=${this.disabled} data-variant=${this.variant}>
        <slot name="iconLeft"></slot>
        <wui-text
          color=${g[this.variant]}
          variant=${y[this.size]}
        >
          <slot></slot>
        </wui-text>
        ${this.iconTemplate()}
      </button>
    `}iconTemplate(){return this.icon?l`<wui-icon name=${this.icon} size="sm"></wui-icon>`:null}};e.styles=[m,f,h];i([a()],e.prototype,"size",void 0);i([a({type:Boolean})],e.prototype,"disabled",void 0);i([a()],e.prototype,"variant",void 0);i([a()],e.prototype,"icon",void 0);e=i([v("wui-link")],e);
