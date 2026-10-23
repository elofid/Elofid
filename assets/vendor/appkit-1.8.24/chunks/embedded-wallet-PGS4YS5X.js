import{a as z}from"./chunk-MSZ3NJMY.js";import"./chunk-A6FGC6QC.js";import"./chunk-NEFL7XWX.js";import"./chunk-ID64J23X.js";import"./chunk-TFRCW6O2.js";import"./chunk-V7Z5TEQE.js";import"./chunk-3Q4QTSFT.js";import{a as Q,b as Z}from"./chunk-IROS5LRB.js";import"./chunk-XJGBVDZY.js";import"./chunk-CDVOKJ4X.js";import"./chunk-SL6QOQTI.js";import"./chunk-KIA2J4MP.js";import"./chunk-MLQ7QHQ2.js";import{a as l,b as p,c as X}from"./chunk-VRWQ57HX.js";import{C as m,E as w,I as A,J as U,M as u,e as x,t as k,w as c}from"./chunk-L6OIOM3D.js";import"./chunk-7YSPBAD3.js";import{H as F,I as L,P,T as K,U as j,V as C,Z as y,ca as G,f as _,ha as q,ia as h,k as H,ka as V,s as Y,v as I,x as R,y as d,z as W}from"./chunk-Z6Y4EM3A.js";import"./chunk-Z54M76ZS.js";import"./chunk-WRJA7Y6R.js";import"./chunk-DT4MQDPQ.js";import"./chunk-N46RBGYQ.js";import"./chunk-U72QSA2E.js";import"./chunk-HOCAI56M.js";var J=k`
  div {
    width: 100%;
  }

  [data-ready='false'] {
    transform: scale(1.05);
  }

  @media (max-width: 430px) {
    [data-ready='false'] {
      transform: translateY(-50px);
    }
  }
`;var te=function(e,t,o,i){var n=arguments.length,r=n<3?t:i===null?i=Object.getOwnPropertyDescriptor(t,o):i,s;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")r=Reflect.decorate(e,t,o,i);else for(var a=e.length-1;a>=0;a--)(s=e[a])&&(r=(n<3?s(r):n>3?s(t,o,r):s(t,o))||r);return n>3&&r&&Object.defineProperty(t,o,r),r},M=600,ee=360,ce=64,D=class extends m{constructor(){super(),this.bodyObserver=void 0,this.unsubscribe=[],this.iframe=document.getElementById("w3m-iframe"),this.ready=!1,this.unsubscribe.push(V.subscribeKey("open",t=>{t||this.onHideIframe()}),V.subscribeKey("shake",t=>{t?this.iframe.style.animation="w3m-shake 500ms var(--apkt-easings-ease-out-power-2)":this.iframe.style.animation="none"}))}disconnectedCallback(){this.onHideIframe(),this.unsubscribe.forEach(t=>t()),this.bodyObserver?.unobserve(window.document.body)}async firstUpdated(){await this.syncTheme(),this.iframe.style.display="block";let t=this?.renderRoot?.querySelector("div");this.bodyObserver=new ResizeObserver(o=>{let n=o?.[0]?.contentBoxSize?.[0]?.inlineSize;this.iframe.style.height=`${M}px`,t.style.height=`${M}px`,F.state.enableEmbedded?this.updateFrameSizeForEmbeddedMode():n&&n<=430?(this.iframe.style.width="100%",this.iframe.style.left="0px",this.iframe.style.bottom="0px",this.iframe.style.top="unset",this.onShowIframe()):(this.iframe.style.width=`${ee}px`,this.iframe.style.left=`calc(50% - ${ee/2}px)`,this.iframe.style.top=`calc(50% - ${M/2}px + ${ce/2}px)`,this.iframe.style.bottom="unset",this.onShowIframe())}),this.bodyObserver.observe(window.document.body)}render(){return c`<div data-ready=${this.ready} id="w3m-frame-container"></div>`}onShowIframe(){let t=window.innerWidth<=430;this.ready=!0,this.iframe.style.animation=t?"w3m-iframe-zoom-in-mobile 200ms var(--apkt-easings-ease-out-power-2)":"w3m-iframe-zoom-in 200ms var(--apkt-easings-ease-out-power-2)"}onHideIframe(){this.iframe.style.display="none",this.iframe.style.animation="w3m-iframe-fade-out 200ms var(--apkt-easings-ease-out-power-2)"}async syncTheme(){let t=C.getAuthConnector();if(t){let o=j.getSnapshot().themeMode,i=j.getSnapshot().themeVariables;await t.provider.syncTheme({themeVariables:i,w3mThemeVariables:Y(i,o)})}}async updateFrameSizeForEmbeddedMode(){let t=this?.renderRoot?.querySelector("div");await new Promise(i=>{setTimeout(i,300)});let o=this.getBoundingClientRect();t.style.width="100%",this.iframe.style.left=`${o.left}px`,this.iframe.style.top=`${o.top}px`,this.iframe.style.width=`${o.width}px`,this.iframe.style.height=`${o.height}px`,this.onShowIframe()}};D.styles=J;te([p()],D.prototype,"ready",void 0);D=te([u("w3m-approve-transaction-view")],D);var oe=w`
  a {
    border: none;
    border-radius: ${({borderRadius:e})=>e[20]};
    display: flex;
    flex-direction: row;
    align-items: center;
    padding: ${({spacing:e})=>e[1]};
    transition:
      background-color ${({durations:e})=>e.lg}
        ${({easings:e})=>e["ease-out-power-2"]},
      box-shadow ${({durations:e})=>e.lg}
        ${({easings:e})=>e["ease-out-power-2"]},
      border ${({durations:e})=>e.lg} ${({easings:e})=>e["ease-out-power-2"]};
    will-change: background-color, box-shadow, border;
  }

  /* -- Variants --------------------------------------------------------------- */
  a[data-type='success'] {
    background-color: ${({tokens:e})=>e.core.backgroundSuccess};
    color: ${({tokens:e})=>e.core.textSuccess};
  }

  a[data-type='error'] {
    background-color: ${({tokens:e})=>e.core.backgroundError};
    color: ${({tokens:e})=>e.core.textError};
  }

  a[data-type='warning'] {
    background-color: ${({tokens:e})=>e.core.backgroundWarning};
    color: ${({tokens:e})=>e.core.textWarning};
  }

  /* -- Sizes --------------------------------------------------------------- */
  a[data-size='sm'] {
    height: 24px;
  }

  a[data-size='md'] {
    height: 28px;
  }

  a[data-size='lg'] {
    height: 32px;
  }

  a[data-size='sm'] > wui-image,
  a[data-size='sm'] > wui-icon {
    width: 16px;
    height: 16px;
  }

  a[data-size='md'] > wui-image,
  a[data-size='md'] > wui-icon {
    width: 20px;
    height: 20px;
  }

  a[data-size='lg'] > wui-image,
  a[data-size='lg'] > wui-icon {
    width: 24px;
    height: 24px;
  }

  wui-text {
    padding-left: ${({spacing:e})=>e[1]};
    padding-right: ${({spacing:e})=>e[1]};
  }

  wui-image {
    border-radius: ${({borderRadius:e})=>e[3]};
    overflow: hidden;
    user-drag: none;
    user-select: none;
    -moz-user-select: none;
    -webkit-user-drag: none;
    -webkit-user-select: none;
    -ms-user-select: none;
  }

  /* -- States --------------------------------------------------------------- */
  @media (hover: hover) and (pointer: fine) {
    a[data-type='success']:not(:disabled):hover {
      background-color: ${({tokens:e})=>e.theme.foregroundPrimary};
      box-shadow: 0px 0px 0px 1px ${({tokens:e})=>e.core.borderSuccess};
    }

    a[data-type='error']:not(:disabled):hover {
      background-color: ${({tokens:e})=>e.theme.foregroundPrimary};
      box-shadow: 0px 0px 0px 1px ${({tokens:e})=>e.core.borderError};
    }

    a[data-type='warning']:not(:disabled):hover {
      background-color: ${({tokens:e})=>e.theme.foregroundPrimary};
      box-shadow: 0px 0px 0px 1px ${({tokens:e})=>e.core.borderWarning};
    }
  }

  a[data-type='success']:not(:disabled):focus-visible {
    box-shadow:
      0px 0px 0px 1px ${({tokens:e})=>e.core.backgroundAccentPrimary},
      0px 0px 0px 4px ${({tokens:e})=>e.core.foregroundAccent020};
  }

  a[data-type='error']:not(:disabled):focus-visible {
    box-shadow:
      0px 0px 0px 1px ${({tokens:e})=>e.core.backgroundAccentPrimary},
      0px 0px 0px 4px ${({tokens:e})=>e.core.foregroundAccent020};
  }

  a[data-type='warning']:not(:disabled):focus-visible {
    box-shadow:
      0px 0px 0px 1px ${({tokens:e})=>e.core.backgroundAccentPrimary},
      0px 0px 0px 4px ${({tokens:e})=>e.core.foregroundAccent020};
  }

  a:disabled {
    opacity: 0.5;
  }
`;var v=function(e,t,o,i){var n=arguments.length,r=n<3?t:i===null?i=Object.getOwnPropertyDescriptor(t,o):i,s;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")r=Reflect.decorate(e,t,o,i);else for(var a=e.length-1;a>=0;a--)(s=e[a])&&(r=(n<3?s(r):n>3?s(t,o,r):s(t,o))||r);return n>3&&r&&Object.defineProperty(t,o,r),r},le={sm:"md-regular",md:"lg-regular",lg:"lg-regular"},me={success:"sealCheck",error:"warning",warning:"exclamationCircle"},f=class extends m{constructor(){super(...arguments),this.type="success",this.size="md",this.imageSrc=void 0,this.disabled=!1,this.href="",this.text=void 0}render(){return c`
      <a
        rel="noreferrer"
        target="_blank"
        href=${this.href}
        class=${this.disabled?"disabled":""}
        data-type=${this.type}
        data-size=${this.size}
      >
        ${this.imageTemplate()}
        <wui-text variant=${le[this.size]} color="inherit">${this.text}</wui-text>
      </a>
    `}imageTemplate(){return this.imageSrc?c`<wui-image src=${this.imageSrc} size="inherit"></wui-image>`:c`<wui-icon
      name=${me[this.type]}
      weight="fill"
      color="inherit"
      size="inherit"
      class="image-icon"
    ></wui-icon>`}};f.styles=[A,U,oe];v([l()],f.prototype,"type",void 0);v([l()],f.prototype,"size",void 0);v([l()],f.prototype,"imageSrc",void 0);v([l({type:Boolean})],f.prototype,"disabled",void 0);v([l()],f.prototype,"href",void 0);v([l()],f.prototype,"text",void 0);f=v([u("wui-semantic-chip")],f);var ue=function(e,t,o,i){var n=arguments.length,r=n<3?t:i===null?i=Object.getOwnPropertyDescriptor(t,o):i,s;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")r=Reflect.decorate(e,t,o,i);else for(var a=e.length-1;a>=0;a--)(s=e[a])&&(r=(n<3?s(r):n>3?s(t,o,r):s(t,o))||r);return n>3&&r&&Object.defineProperty(t,o,r),r},re=class extends m{render(){return c`
      <wui-flex flexDirection="column" alignItems="center" gap="5" padding="5">
        <wui-text variant="md-regular" color="primary">Follow the instructions on</wui-text>
        <wui-semantic-chip
          icon="externalLink"
          variant="fill"
          text=${I.SECURE_SITE_DASHBOARD}
          href=${I.SECURE_SITE_DASHBOARD}
          imageSrc=${I.SECURE_SITE_FAVICON}
          data-testid="w3m-secure-website-button"
        >
        </wui-semantic-chip>
        <wui-text variant="sm-regular" color="secondary">
          You will have to reconnect for security reasons
        </wui-text>
      </wui-flex>
    `}};re=ue([u("w3m-upgrade-wallet-view")],re);var N=function(e,t,o,i){var n=arguments.length,r=n<3?t:i===null?i=Object.getOwnPropertyDescriptor(t,o):i,s;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")r=Reflect.decorate(e,t,o,i);else for(var a=e.length-1;a>=0;a--)(s=e[a])&&(r=(n<3?s(r):n>3?s(t,o,r):s(t,o))||r);return n>3&&r&&Object.defineProperty(t,o,r),r},E=class extends m{constructor(){super(...arguments),this.loading=!1,this.switched=!1,this.text="",this.network=h.state.activeCaipNetwork}render(){return c`
      <wui-flex flexDirection="column" gap="2" .padding=${["6","4","3","4"]}>
        ${this.togglePreferredAccountTypeTemplate()} ${this.toggleSmartAccountVersionTemplate()}
      </wui-flex>
    `}toggleSmartAccountVersionTemplate(){return c`
      <w3m-tooltip-trigger text="Changing the smart account version will reload the page">
        <wui-list-item
          icon=${this.isV6()?"arrowTop":"arrowBottom"}
          ?rounded=${!0}
          ?chevron=${!0}
          data-testid="account-toggle-smart-account-version"
          @click=${this.toggleSmartAccountVersion.bind(this)}
        >
          <wui-text variant="lg-regular" color="primary"
            >Force Smart Account Version ${this.isV6()?"7":"6"}</wui-text
          >
        </wui-list-item>
      </w3m-tooltip-trigger>
    `}isV6(){return(W.get("dapp_smart_account_version")||"v6")==="v6"}toggleSmartAccountVersion(){W.set("dapp_smart_account_version",this.isV6()?"v7":"v6"),typeof window<"u"&&window?.location?.reload()}togglePreferredAccountTypeTemplate(){let t=this.network?.chainNamespace,o=h.checkIfSmartAccountEnabled(),i=C.getConnectorId(t);return!C.getAuthConnector()||i!==_.CONNECTOR_ID.AUTH||!o?null:(this.switched||(this.text=y(t)===d.ACCOUNT_TYPES.SMART_ACCOUNT?"Switch to your EOA":"Switch to your Smart Account"),c`
      <wui-list-item
        icon="swapHorizontal"
        ?rounded=${!0}
        ?chevron=${!0}
        ?loading=${this.loading}
        @click=${this.changePreferredAccountType.bind(this)}
        data-testid="account-toggle-preferred-account-type"
      >
        <wui-text variant="lg-regular" color="primary">${this.text}</wui-text>
      </wui-list-item>
    `)}async changePreferredAccountType(){let t=this.network?.chainNamespace,o=h.checkIfSmartAccountEnabled(),i=y(t)===d.ACCOUNT_TYPES.SMART_ACCOUNT||!o?d.ACCOUNT_TYPES.EOA:d.ACCOUNT_TYPES.SMART_ACCOUNT;C.getAuthConnector()&&(this.loading=!0,await G.setPreferredAccountType(i,t),this.text=i===d.ACCOUNT_TYPES.SMART_ACCOUNT?"Switch to your EOA":"Switch to your Smart Account",this.switched=!0,q.resetSend(),this.loading=!1,this.requestUpdate())}};N([p()],E.prototype,"loading",void 0);N([p()],E.prototype,"switched",void 0);N([p()],E.prototype,"text",void 0);N([p()],E.prototype,"network",void 0);E=N([u("w3m-smart-account-settings-view")],E);var ie=w`
  :host {
    width: 100%;
  }

  button {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: ${({tokens:e})=>e.theme.foregroundPrimary};
    border-radius: ${({borderRadius:e})=>e[4]};
    padding: ${({spacing:e})=>e[4]};
  }

  .name {
    max-width: 75%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  @media (hover: hover) and (pointer: fine) {
    button:hover:enabled {
      cursor: pointer;
      background-color: ${({tokens:e})=>e.theme.foregroundSecondary};
      border-radius: ${({borderRadius:e})=>e[6]};
    }
  }

  button:disabled {
    opacity: 0.5;
    cursor: default;
  }

  button:focus-visible:enabled {
    box-shadow: 0 0 0 4px ${({tokens:e})=>e.core.foregroundAccent040};
    background-color: ${({tokens:e})=>e.theme.foregroundSecondary};
  }
`;var O=function(e,t,o,i){var n=arguments.length,r=n<3?t:i===null?i=Object.getOwnPropertyDescriptor(t,o):i,s;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")r=Reflect.decorate(e,t,o,i);else for(var a=e.length-1;a>=0;a--)(s=e[a])&&(r=(n<3?s(r):n>3?s(t,o,r):s(t,o))||r);return n>3&&r&&Object.defineProperty(t,o,r),r},$=class extends m{constructor(){super(...arguments),this.name="",this.registered=!1,this.loading=!1,this.disabled=!1}render(){return c`
      <button ?disabled=${this.disabled}>
        <wui-text class="name" color="primary" variant="md-regular">${this.name}</wui-text>
        ${this.templateRightContent()}
      </button>
    `}templateRightContent(){return this.loading?c`<wui-loading-spinner size="lg" color="primary"></wui-loading-spinner>`:this.registered?c`<wui-tag variant="info" size="sm">Registered</wui-tag>`:c`<wui-tag variant="success" size="sm">Available</wui-tag>`}};$.styles=[A,U,ie];O([l()],$.prototype,"name",void 0);O([l({type:Boolean})],$.prototype,"registered",void 0);O([l({type:Boolean})],$.prototype,"loading",void 0);O([l({type:Boolean})],$.prototype,"disabled",void 0);$=O([u("wui-account-name-suggestion-item")],$);var ne=w`
  :host {
    position: relative;
    width: 100%;
    display: inline-block;
  }

  :host([disabled]) {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .base-name {
    position: absolute;
    right: ${({spacing:e})=>e[4]};
    top: 50%;
    transform: translateY(-50%);
    text-align: right;
    padding: ${({spacing:e})=>e[1]};
    background-color: ${({tokens:e})=>e.theme.foregroundSecondary};
    border-radius: ${({borderRadius:e})=>e[1]};
  }
`;var T=function(e,t,o,i){var n=arguments.length,r=n<3?t:i===null?i=Object.getOwnPropertyDescriptor(t,o):i,s;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")r=Reflect.decorate(e,t,o,i);else for(var a=e.length-1;a>=0;a--)(s=e[a])&&(r=(n<3?s(r):n>3?s(t,o,r):s(t,o))||r);return n>3&&r&&Object.defineProperty(t,o,r),r},b=class extends m{constructor(){super(...arguments),this.disabled=!1,this.loading=!1}render(){return c`
      <wui-input-text
        value=${X(this.value)}
        ?disabled=${this.disabled}
        .value=${this.value||""}
        data-testid="wui-ens-input"
        icon="search"
        inputRightPadding="5xl"
        .onKeyDown=${this.onKeyDown}
      ></wui-input-text>
    `}};b.styles=[A,ne];T([l()],b.prototype,"errorMessage",void 0);T([l({type:Boolean})],b.prototype,"disabled",void 0);T([l()],b.prototype,"value",void 0);T([l({type:Boolean})],b.prototype,"loading",void 0);T([l({attribute:!1})],b.prototype,"onKeyDown",void 0);b=T([u("wui-ens-input")],b);var se=w`
  wui-flex {
    width: 100%;
  }

  .suggestion {
    background-color: ${({tokens:e})=>e.theme.foregroundPrimary};
    border-radius: ${({borderRadius:e})=>e[4]};
  }

  .suggestion:hover:not(:disabled) {
    cursor: pointer;
    border: none;
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: ${({tokens:e})=>e.theme.foregroundSecondary};
    border-radius: ${({borderRadius:e})=>e[6]};
    padding: ${({spacing:e})=>e[4]};
  }

  .suggestion:disabled {
    opacity: 0.5;
    cursor: default;
  }

  .suggestion:focus-visible:not(:disabled) {
    box-shadow: 0 0 0 4px ${({tokens:e})=>e.core.foregroundAccent040};
    background-color: ${({tokens:e})=>e.theme.foregroundSecondary};
  }

  .suggested-name {
    max-width: 75%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  form {
    width: 100%;
    position: relative;
  }

  .input-submit-button,
  .input-loading-spinner {
    position: absolute;
    top: 22px;
    transform: translateY(-50%);
    right: 10px;
  }
`;var S=function(e,t,o,i){var n=arguments.length,r=n<3?t:i===null?i=Object.getOwnPropertyDescriptor(t,o):i,s;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")r=Reflect.decorate(e,t,o,i);else for(var a=e.length-1;a>=0;a--)(s=e[a])&&(r=(n<3?s(r):n>3?s(t,o,r):s(t,o))||r);return n>3&&r&&Object.defineProperty(t,o,r),r},g=class extends m{constructor(){super(),this.formRef=Q(),this.usubscribe=[],this.name="",this.error="",this.loading=x.state.loading,this.suggestions=x.state.suggestions,this.profileName=h.getAccountData()?.profileName,this.onDebouncedNameInputChange=R.debounce(t=>{t.length<4?this.error="Name must be at least 4 characters long":z.isValidReownName(t)?(this.error="",x.getSuggestions(t)):this.error="The value is not a valid username"}),this.usubscribe.push(x.subscribe(t=>{this.suggestions=t.suggestions,this.loading=t.loading}),h.subscribeChainProp("accountState",t=>{this.profileName=t?.profileName,t?.profileName&&(this.error="You already own a name")}))}firstUpdated(){this.formRef.value?.addEventListener("keydown",this.onEnterKey.bind(this))}disconnectedCallback(){super.disconnectedCallback(),this.usubscribe.forEach(t=>t()),this.formRef.value?.removeEventListener("keydown",this.onEnterKey.bind(this))}render(){return c`
      <wui-flex
        flexDirection="column"
        alignItems="center"
        gap="4"
        .padding=${["1","3","4","3"]}
      >
        <form ${Z(this.formRef)} @submit=${this.onSubmitName.bind(this)}>
          <wui-ens-input
            @inputChange=${this.onNameInputChange.bind(this)}
            .errorMessage=${this.error}
            .value=${this.name}
            .onKeyDown=${this.onKeyDown.bind(this)}
          >
          </wui-ens-input>
          ${this.submitButtonTemplate()}
          <input type="submit" hidden />
        </form>
        ${this.templateSuggestions()}
      </wui-flex>
    `}submitButtonTemplate(){let t=this.suggestions.find(i=>i.name?.split(".")?.[0]===this.name&&i.registered);if(this.loading)return c`<wui-loading-spinner
        class="input-loading-spinner"
        color="secondary"
      ></wui-loading-spinner>`;let o=`${this.name}${_.WC_NAME_SUFFIX}`;return c`
      <wui-icon-link
        ?disabled=${!!t}
        class="input-submit-button"
        size="sm"
        icon="chevronRight"
        iconColor=${t?"default":"accent-primary"}
        @click=${()=>this.onSubmitName(o)}
      >
      </wui-icon-link>
    `}onNameInputChange(t){let o=z.validateReownName(t.detail||"");this.name=o,this.onDebouncedNameInputChange(o)}onKeyDown(t){t.key.length===1&&!z.isValidReownName(t.key)&&t.preventDefault()}templateSuggestions(){return!this.name||this.name.length<4||this.error?null:c`<wui-flex flexDirection="column" gap="1" alignItems="center">
      ${this.suggestions.map(t=>c`<wui-account-name-suggestion-item
            name=${t.name}
            ?registered=${t.registered}
            ?loading=${this.loading}
            ?disabled=${t.registered||this.loading}
            data-testid="account-name-suggestion"
            @click=${()=>this.onSubmitName(t.name)}
          ></wui-account-name-suggestion-item>`)}
    </wui-flex>`}isAllowedToSubmit(t){let o=t.split(".")?.[0],i=this.suggestions.find(n=>n.name?.split(".")?.[0]===o&&n.registered);return!this.loading&&!this.error&&!this.profileName&&o&&x.validateName(o)&&!i}async onSubmitName(t){try{if(!this.isAllowedToSubmit(t))return;P.sendEvent({type:"track",event:"REGISTER_NAME_INITIATED",properties:{isSmartAccount:y(h.state.activeChain)===d.ACCOUNT_TYPES.SMART_ACCOUNT,ensName:t}}),await x.registerName(t),P.sendEvent({type:"track",event:"REGISTER_NAME_SUCCESS",properties:{isSmartAccount:y(h.state.activeChain)===d.ACCOUNT_TYPES.SMART_ACCOUNT,ensName:t}})}catch(o){L.showError(o.message),P.sendEvent({type:"track",event:"REGISTER_NAME_ERROR",properties:{isSmartAccount:y(h.state.activeChain)===d.ACCOUNT_TYPES.SMART_ACCOUNT,ensName:t,error:R.parseError(o)}})}}onEnterKey(t){if(t.key==="Enter"&&this.name&&this.isAllowedToSubmit(this.name)){let o=`${this.name}${_.WC_NAME_SUFFIX}`;this.onSubmitName(o)}}};g.styles=se;S([l()],g.prototype,"errorMessage",void 0);S([p()],g.prototype,"name",void 0);S([p()],g.prototype,"error",void 0);S([p()],g.prototype,"loading",void 0);S([p()],g.prototype,"suggestions",void 0);S([p()],g.prototype,"profileName",void 0);g=S([u("w3m-register-account-name-view")],g);var ae=k`
  .continue-button-container {
    width: 100%;
  }
`;var pe=function(e,t,o,i){var n=arguments.length,r=n<3?t:i===null?i=Object.getOwnPropertyDescriptor(t,o):i,s;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")r=Reflect.decorate(e,t,o,i);else for(var a=e.length-1;a>=0;a--)(s=e[a])&&(r=(n<3?s(r):n>3?s(t,o,r):s(t,o))||r);return n>3&&r&&Object.defineProperty(t,o,r),r},B=class extends m{render(){return c`
      <wui-flex
        flexDirection="column"
        alignItems="center"
        gap="6"
        .padding=${["0","0","4","0"]}
      >
        ${this.onboardingTemplate()} ${this.buttonsTemplate()}
        <wui-link
          @click=${()=>{R.openHref(H.URLS.FAQ,"_blank")}}
        >
          Learn more
          <wui-icon color="inherit" slot="iconRight" name="externalLink"></wui-icon>
        </wui-link>
      </wui-flex>
    `}onboardingTemplate(){return c` <wui-flex
      flexDirection="column"
      gap="6"
      alignItems="center"
      .padding=${["0","6","0","6"]}
    >
      <wui-flex gap="3" alignItems="center" justifyContent="center">
        <wui-icon-box size="xl" color="success" icon="checkmark"></wui-icon-box>
      </wui-flex>
      <wui-flex flexDirection="column" alignItems="center" gap="3">
        <wui-text align="center" variant="md-medium" color="primary">
          Account name chosen successfully
        </wui-text>
        <wui-text align="center" variant="md-regular" color="primary">
          You can now fund your account and trade crypto
        </wui-text>
      </wui-flex>
    </wui-flex>`}buttonsTemplate(){return c`<wui-flex
      .padding=${["0","4","0","4"]}
      gap="3"
      class="continue-button-container"
    >
      <wui-button fullWidth size="lg" borderRadius="xs" @click=${this.redirectToAccount.bind(this)}
        >Let's Go!
      </wui-button>
    </wui-flex>`}redirectToAccount(){K.replace("Account")}};B.styles=ae;B=pe([u("w3m-register-account-name-success-view")],B);export{D as W3mApproveTransactionView,B as W3mRegisterAccountNameSuccess,g as W3mRegisterAccountNameView,E as W3mSmartAccountSettingsView,re as W3mUpgradeWalletView};
