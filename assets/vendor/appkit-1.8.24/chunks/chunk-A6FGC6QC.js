import{a as r}from"./chunk-VRWQ57HX.js";import{C as b,E as p,I as h,J as v,M as m,w as l}from"./chunk-L6OIOM3D.js";var f=p`
  button {
    background-color: transparent;
    padding: ${({spacing:t})=>t[1]};
  }

  button:focus-visible {
    box-shadow: 0 0 0 4px ${({tokens:t})=>t.core.foregroundAccent020};
  }

  button[data-variant='accent']:hover:enabled,
  button[data-variant='accent']:focus-visible {
    background-color: ${({tokens:t})=>t.core.foregroundAccent010};
  }

  button[data-variant='primary']:hover:enabled,
  button[data-variant='primary']:focus-visible,
  button[data-variant='secondary']:hover:enabled,
  button[data-variant='secondary']:focus-visible {
    background-color: ${({tokens:t})=>t.theme.foregroundSecondary};
  }

  button[data-size='xs'] > wui-icon {
    width: 8px;
    height: 8px;
  }

  button[data-size='sm'] > wui-icon {
    width: 12px;
    height: 12px;
  }

  button[data-size='xs'],
  button[data-size='sm'] {
    border-radius: ${({borderRadius:t})=>t[1]};
  }

  button[data-size='md'],
  button[data-size='lg'] {
    border-radius: ${({borderRadius:t})=>t[2]};
  }

  button[data-size='md'] > wui-icon {
    width: 16px;
    height: 16px;
  }

  button[data-size='lg'] > wui-icon {
    width: 20px;
    height: 20px;
  }

  button:disabled {
    background-color: transparent;
    cursor: not-allowed;
    opacity: 0.5;
  }

  button:hover:not(:disabled) {
    background-color: var(--wui-color-accent-glass-015);
  }

  button:focus-visible:not(:disabled) {
    background-color: var(--wui-color-accent-glass-015);
    box-shadow:
      inset 0 0 0 1px var(--wui-color-accent-100),
      0 0 0 4px var(--wui-color-accent-glass-020);
  }
`;var a=function(t,o,n,c){var s=arguments.length,e=s<3?o:c===null?c=Object.getOwnPropertyDescriptor(o,n):c,d;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")e=Reflect.decorate(t,o,n,c);else for(var u=t.length-1;u>=0;u--)(d=t[u])&&(e=(s<3?d(e):s>3?d(o,n,e):d(o,n))||e);return s>3&&e&&Object.defineProperty(o,n,e),e},i=class extends b{constructor(){super(...arguments),this.size="md",this.disabled=!1,this.icon="copy",this.iconColor="default",this.variant="accent"}render(){let o={accent:"accent-primary",primary:"inverse",secondary:"default"};return l`
      <button data-variant=${this.variant} ?disabled=${this.disabled} data-size=${this.size}>
        <wui-icon
          color=${o[this.variant]||this.iconColor}
          size=${this.size}
          name=${this.icon}
        ></wui-icon>
      </button>
    `}};i.styles=[h,v,f];a([r()],i.prototype,"size",void 0);a([r({type:Boolean})],i.prototype,"disabled",void 0);a([r()],i.prototype,"icon",void 0);a([r()],i.prototype,"iconColor",void 0);a([r()],i.prototype,"variant",void 0);i=a([m("wui-icon-link")],i);
