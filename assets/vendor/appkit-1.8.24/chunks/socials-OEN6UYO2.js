import"./chunk-52M43XAY.js";import"./chunk-EPNHF45E.js";import{a as M}from"./chunk-ID64J23X.js";import"./chunk-VNS4K43S.js";import{a as j}from"./chunk-HSBJBDNP.js";import"./chunk-YY4ZOCTW.js";import"./chunk-3Q4QTSFT.js";import"./chunk-IROS5LRB.js";import"./chunk-XJGBVDZY.js";import"./chunk-CDVOKJ4X.js";import"./chunk-SL6QOQTI.js";import"./chunk-KIA2J4MP.js";import"./chunk-FORE7YHT.js";import"./chunk-MLQ7QHQ2.js";import{a as N,b as l,c as x}from"./chunk-VRWQ57HX.js";import{d as D}from"./chunk-HX3PCGE2.js";import{C,E as b,M as v,h as T,j as F,m as R,w as a}from"./chunk-L6OIOM3D.js";import"./chunk-7YSPBAD3.js";import{F as k,H as d,I as g,P as p,Q as W,T as h,U as E,V as $,ca as L,ia as u,ka as I,v as A,w as U,x as m}from"./chunk-Z6Y4EM3A.js";import"./chunk-Z54M76ZS.js";import"./chunk-WRJA7Y6R.js";import"./chunk-DT4MQDPQ.js";import"./chunk-N46RBGYQ.js";import"./chunk-U72QSA2E.js";import"./chunk-HOCAI56M.js";var q=b`
  :host {
    margin-top: ${({spacing:t})=>t[1]};
  }
  wui-separator {
    margin: ${({spacing:t})=>t[3]} calc(${({spacing:t})=>t[3]} * -1)
      ${({spacing:t})=>t[2]} calc(${({spacing:t})=>t[3]} * -1);
    width: calc(100% + ${({spacing:t})=>t[3]} * 2);
  }
`;var S=function(t,e,i,r){var s=arguments.length,o=s<3?e:r===null?r=Object.getOwnPropertyDescriptor(e,i):r,n;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")o=Reflect.decorate(t,e,i,r);else for(var c=t.length-1;c>=0;c--)(n=t[c])&&(o=(s<3?n(o):s>3?n(e,i,o):n(e,i))||o);return s>3&&o&&Object.defineProperty(e,i,o),o},f=class extends C{constructor(){super(),this.unsubscribe=[],this.tabIdx=void 0,this.connectors=$.state.connectors,this.authConnector=this.connectors.find(e=>e.type==="AUTH"),this.remoteFeatures=d.state.remoteFeatures,this.isPwaLoading=!1,this.hasExceededUsageLimit=W.state.plan.hasExceededUsageLimit,this.unsubscribe.push($.subscribeKey("connectors",e=>{this.connectors=e,this.authConnector=this.connectors.find(i=>i.type==="AUTH")}),d.subscribeKey("remoteFeatures",e=>this.remoteFeatures=e))}connectedCallback(){super.connectedCallback(),this.handlePwaFrameLoad()}disconnectedCallback(){this.unsubscribe.forEach(e=>e())}render(){let e=this.remoteFeatures?.socials||[],i=!!this.authConnector,r=e?.length,s=h.state.view==="ConnectSocials";return(!i||!r)&&!s?null:(s&&!r&&(e=A.DEFAULT_SOCIALS),a` <wui-flex flexDirection="column" gap="2">
      ${e.map(o=>a`<wui-list-social
            @click=${()=>{this.onSocialClick(o)}}
            data-testid=${`social-selector-${o}`}
            name=${o}
            logo=${o}
            ?disabled=${this.isPwaLoading}
          ></wui-list-social>`)}
    </wui-flex>`)}async onSocialClick(e){if(this.hasExceededUsageLimit){h.push("UsageExceeded");return}e&&await j(e)}async handlePwaFrameLoad(){if(m.isPWA()){this.isPwaLoading=!0;try{this.authConnector?.provider instanceof k&&await this.authConnector.provider.init()}catch(e){F.open({displayMessage:"Error loading embedded wallet in PWA",debugMessage:e.message},"error")}finally{this.isPwaLoading=!1}}}};f.styles=q;S([N()],f.prototype,"tabIdx",void 0);S([l()],f.prototype,"connectors",void 0);S([l()],f.prototype,"authConnector",void 0);S([l()],f.prototype,"remoteFeatures",void 0);S([l()],f.prototype,"isPwaLoading",void 0);S([l()],f.prototype,"hasExceededUsageLimit",void 0);f=S([v("w3m-social-login-list")],f);var z=b`
  wui-flex {
    max-height: clamp(360px, 540px, 80vh);
    overflow: scroll;
    scrollbar-width: none;
    transition: opacity ${({durations:t})=>t.md}
      ${({easings:t})=>t["ease-out-power-1"]};
    will-change: opacity;
  }

  wui-flex::-webkit-scrollbar {
    display: none;
  }

  wui-flex.disabled {
    opacity: 0.3;
    pointer-events: none;
    user-select: none;
  }
`;var B=function(t,e,i,r){var s=arguments.length,o=s<3?e:r===null?r=Object.getOwnPropertyDescriptor(e,i):r,n;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")o=Reflect.decorate(t,e,i,r);else for(var c=t.length-1;c>=0;c--)(n=t[c])&&(o=(s<3?n(o):s>3?n(e,i,o):n(e,i))||o);return s>3&&o&&Object.defineProperty(e,i,o),o},_=class extends C{constructor(){super(),this.unsubscribe=[],this.checked=R.state.isLegalCheckboxChecked,this.unsubscribe.push(R.subscribeKey("isLegalCheckboxChecked",e=>{this.checked=e}))}disconnectedCallback(){this.unsubscribe.forEach(e=>e())}render(){let{termsConditionsUrl:e,privacyPolicyUrl:i}=d.state,r=d.state.features?.legalCheckbox,n=!!(e||i)&&!!r&&!this.checked,c=n?-1:void 0;return a`
      <w3m-legal-checkbox></w3m-legal-checkbox>
      <wui-flex
        flexDirection="column"
        .padding=${["0","3","3","3"]}
        gap="01"
        class=${x(n?"disabled":void 0)}
      >
        <w3m-social-login-list tabIdx=${x(c)}></w3m-social-login-list>
      </wui-flex>
    `}};_.styles=z;B([l()],_.prototype,"checked",void 0);_=B([v("w3m-connect-socials-view")],_);var G=b`
  wui-logo {
    width: 80px;
    height: 80px;
    border-radius: ${({borderRadius:t})=>t[8]};
  }
  @keyframes shake {
    0% {
      transform: translateX(0);
    }
    25% {
      transform: translateX(3px);
    }
    50% {
      transform: translateX(-3px);
    }
    75% {
      transform: translateX(3px);
    }
    100% {
      transform: translateX(0);
    }
  }
  wui-flex:first-child:not(:only-child) {
    position: relative;
  }
  wui-loading-thumbnail {
    position: absolute;
  }
  wui-icon-box {
    position: absolute;
    right: calc(${({spacing:t})=>t[1]} * -1);
    bottom: calc(${({spacing:t})=>t[1]} * -1);
    opacity: 0;
    transform: scale(0.5);
    transition: all ${({easings:t})=>t["ease-out-power-2"]}
      ${({durations:t})=>t.lg};
  }
  wui-text[align='center'] {
    width: 100%;
    padding: 0px ${({spacing:t})=>t[4]};
  }
  [data-error='true'] wui-icon-box {
    opacity: 1;
    transform: scale(1);
  }
  [data-error='true'] > wui-flex:first-child {
    animation: shake 250ms ${({easings:t})=>t["ease-out-power-2"]} both;
  }
  .capitalize {
    text-transform: capitalize;
  }
`;var P=function(t,e,i,r){var s=arguments.length,o=s<3?e:r===null?r=Object.getOwnPropertyDescriptor(e,i):r,n;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")o=Reflect.decorate(t,e,i,r);else for(var c=t.length-1;c>=0;c--)(n=t[c])&&(o=(s<3?n(o):s>3?n(e,i,o):n(e,i))||o);return s>3&&o&&Object.defineProperty(e,i,o),o},w=class extends C{constructor(){super(),this.unsubscribe=[],this.socialProvider=u.getAccountData()?.socialProvider,this.socialWindow=u.getAccountData()?.socialWindow,this.error=!1,this.connecting=!1,this.message="Connect in the provider window",this.remoteFeatures=d.state.remoteFeatures,this.address=u.getAccountData()?.address,this.connectionsByNamespace=L.getConnections(u.state.activeChain),this.hasMultipleConnections=this.connectionsByNamespace.length>0,this.authConnector=$.getAuthConnector(),this.handleSocialConnection=async i=>{if(i.data?.resultUri)if(i.origin===M.SECURE_SITE_ORIGIN){window.removeEventListener("message",this.handleSocialConnection,!1);try{if(this.authConnector&&!this.connecting){this.connecting=!0;let r=this.parseURLError(i.data.resultUri);if(r){this.handleSocialError(r);return}this.closeSocialWindow(),this.updateMessage();let s=i.data.resultUri;this.socialProvider&&p.sendEvent({type:"track",event:"SOCIAL_LOGIN_REQUEST_USER_DATA",properties:{provider:this.socialProvider}}),await L.connectExternal({id:this.authConnector.id,type:this.authConnector.type,socialUri:s},this.authConnector.chain),this.socialProvider&&(U.setConnectedSocialProvider(this.socialProvider),p.sendEvent({type:"track",event:"SOCIAL_LOGIN_SUCCESS",properties:{provider:this.socialProvider}}))}}catch(r){this.error=!0,this.updateMessage(),this.socialProvider&&p.sendEvent({type:"track",event:"SOCIAL_LOGIN_ERROR",properties:{provider:this.socialProvider,message:m.parseError(r)}})}}else h.goBack(),g.showError("Untrusted Origin"),this.socialProvider&&p.sendEvent({type:"track",event:"SOCIAL_LOGIN_ERROR",properties:{provider:this.socialProvider,message:"Untrusted Origin"}})},D.EmbeddedWalletAbortController.signal.addEventListener("abort",()=>{this.closeSocialWindow()}),this.unsubscribe.push(u.subscribeChainProp("accountState",i=>{if(i&&(this.socialProvider=i.socialProvider,i.socialWindow&&(this.socialWindow=i.socialWindow),i.address)){let r=this.remoteFeatures?.multiWallet;i.address!==this.address&&(this.hasMultipleConnections&&r?(h.replace("ProfileWallets"),g.showSuccess("New Wallet Added"),this.address=i.address):(I.state.open||d.state.enableEmbedded)&&I.close())}}),d.subscribeKey("remoteFeatures",i=>{this.remoteFeatures=i})),this.authConnector&&this.connectSocial()}disconnectedCallback(){this.unsubscribe.forEach(i=>i()),window.removeEventListener("message",this.handleSocialConnection,!1),!u.state.activeCaipAddress&&this.socialProvider&&!this.connecting&&p.sendEvent({type:"track",event:"SOCIAL_LOGIN_CANCELED",properties:{provider:this.socialProvider}}),this.closeSocialWindow()}render(){return a`
      <wui-flex
        data-error=${x(this.error)}
        flexDirection="column"
        alignItems="center"
        .padding=${["10","5","5","5"]}
        gap="6"
      >
        <wui-flex justifyContent="center" alignItems="center">
          <wui-logo logo=${x(this.socialProvider)}></wui-logo>
          ${this.error?null:this.loaderTemplate()}
          <wui-icon-box color="error" icon="close" size="sm"></wui-icon-box>
        </wui-flex>
        <wui-flex flexDirection="column" alignItems="center" gap="2">
          <wui-text align="center" variant="lg-medium" color="primary"
            >Log in with
            <span class="capitalize">${this.socialProvider??"Social"}</span></wui-text
          >
          <wui-text align="center" variant="lg-regular" color=${this.error?"error":"secondary"}
            >${this.message}</wui-text
          ></wui-flex
        >
      </wui-flex>
    `}loaderTemplate(){let e=E.state.themeVariables["--w3m-border-radius-master"],i=e?parseInt(e.replace("px",""),10):4;return a`<wui-loading-thumbnail radius=${i*9}></wui-loading-thumbnail>`}parseURLError(e){try{let i="error=",r=e.indexOf(i);return r===-1?null:e.substring(r+i.length)}catch{return null}}connectSocial(){let e=setInterval(()=>{this.socialWindow?.closed&&(!this.connecting&&h.state.view==="ConnectingSocial"&&h.goBack(),clearInterval(e))},1e3);window.addEventListener("message",this.handleSocialConnection,!1)}updateMessage(){this.error?this.message="Something went wrong":this.connecting?this.message="Retrieving user data":this.message="Connect in the provider window"}handleSocialError(e){this.error=!0,this.updateMessage(),this.socialProvider&&p.sendEvent({type:"track",event:"SOCIAL_LOGIN_ERROR",properties:{provider:this.socialProvider,message:e}}),this.closeSocialWindow()}closeSocialWindow(){this.socialWindow&&(this.socialWindow.close(),u.setAccountProp("socialWindow",void 0,u.state.activeChain))}};w.styles=G;P([l()],w.prototype,"socialProvider",void 0);P([l()],w.prototype,"socialWindow",void 0);P([l()],w.prototype,"error",void 0);P([l()],w.prototype,"connecting",void 0);P([l()],w.prototype,"message",void 0);P([l()],w.prototype,"remoteFeatures",void 0);w=P([v("w3m-connecting-social-view")],w);var V=b`
  wui-shimmer {
    width: 100%;
    aspect-ratio: 1 / 1;
    border-radius: ${({borderRadius:t})=>t[4]};
  }

  wui-qr-code {
    opacity: 0;
    animation-duration: ${({durations:t})=>t.xl};
    animation-timing-function: ${({easings:t})=>t["ease-out-power-2"]};
    animation-name: fade-in;
    animation-fill-mode: forwards;
  }

  wui-logo {
    width: 80px;
    height: 80px;
    border-radius: ${({borderRadius:t})=>t[8]};
  }

  wui-flex:first-child:not(:only-child) {
    position: relative;
  }

  wui-loading-thumbnail {
    position: absolute;
  }

  wui-icon-box {
    position: absolute;
    right: calc(${({spacing:t})=>t[1]} * -1);
    bottom: calc(${({spacing:t})=>t[1]} * -1);
    opacity: 0;
    transform: scale(0.5);
    transition:
      opacity ${({durations:t})=>t.lg} ${({easings:t})=>t["ease-out-power-2"]},
      transform ${({durations:t})=>t.lg}
        ${({easings:t})=>t["ease-out-power-2"]};
    will-change: opacity, transform;
  }

  @keyframes fade-in {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
`;var O=function(t,e,i,r){var s=arguments.length,o=s<3?e:r===null?r=Object.getOwnPropertyDescriptor(e,i):r,n;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")o=Reflect.decorate(t,e,i,r);else for(var c=t.length-1;c>=0;c--)(n=t[c])&&(o=(s<3?n(o):s>3?n(e,i,o):n(e,i))||o);return s>3&&o&&Object.defineProperty(e,i,o),o},y=class extends C{constructor(){super(),this.unsubscribe=[],this.timeout=void 0,this.socialProvider=u.getAccountData()?.socialProvider,this.uri=u.getAccountData()?.farcasterUrl,this.ready=!1,this.loading=!1,this.remoteFeatures=d.state.remoteFeatures,this.authConnector=$.getAuthConnector(),this.forceUpdate=()=>{this.requestUpdate()},this.unsubscribe.push(u.subscribeChainProp("accountState",e=>{this.socialProvider=e?.socialProvider,this.uri=e?.farcasterUrl,this.connectFarcaster()}),d.subscribeKey("remoteFeatures",e=>{this.remoteFeatures=e})),window.addEventListener("resize",this.forceUpdate)}disconnectedCallback(){super.disconnectedCallback(),clearTimeout(this.timeout),window.removeEventListener("resize",this.forceUpdate),!u.state.activeCaipAddress&&this.socialProvider&&(this.uri||this.loading)&&p.sendEvent({type:"track",event:"SOCIAL_LOGIN_CANCELED",properties:{provider:this.socialProvider}})}render(){return this.onRenderProxy(),a`${this.platformTemplate()}`}platformTemplate(){return m.isMobile()?a`${this.mobileTemplate()}`:a`${this.desktopTemplate()}`}desktopTemplate(){return this.loading?a`${this.loadingTemplate()}`:a`${this.qrTemplate()}`}qrTemplate(){return a` <wui-flex
      flexDirection="column"
      alignItems="center"
      .padding=${["0","5","5","5"]}
      gap="5"
    >
      <wui-shimmer width="100%"> ${this.qrCodeTemplate()} </wui-shimmer>

      <wui-text variant="lg-medium" color="primary"> Scan this QR Code with your phone </wui-text>
      ${this.copyTemplate()}
    </wui-flex>`}loadingTemplate(){return a`
      <wui-flex
        flexDirection="column"
        alignItems="center"
        .padding=${["5","5","5","5"]}
        gap="5"
      >
        <wui-flex justifyContent="center" alignItems="center">
          <wui-logo logo="farcaster"></wui-logo>
          ${this.loaderTemplate()}
          <wui-icon-box color="error" icon="close" size="sm"></wui-icon-box>
        </wui-flex>
        <wui-flex flexDirection="column" alignItems="center" gap="2">
          <wui-text align="center" variant="md-medium" color="primary">
            Loading user data
          </wui-text>
          <wui-text align="center" variant="sm-regular" color="secondary">
            Please wait a moment while we load your data.
          </wui-text>
        </wui-flex>
      </wui-flex>
    `}mobileTemplate(){return a` <wui-flex
      flexDirection="column"
      alignItems="center"
      .padding=${["10","5","5","5"]}
      gap="5"
    >
      <wui-flex justifyContent="center" alignItems="center">
        <wui-logo logo="farcaster"></wui-logo>
        ${this.loaderTemplate()}
        <wui-icon-box
          color="error"
          icon="close"
          size="sm"
        ></wui-icon-box>
      </wui-flex>
      <wui-flex flexDirection="column" alignItems="center" gap="2">
        <wui-text align="center" variant="md-medium" color="primary"
          >Continue in Farcaster</span></wui-text
        >
        <wui-text align="center" variant="sm-regular" color="secondary"
          >Accept connection request in the app</wui-text
        ></wui-flex
      >
      ${this.mobileLinkTemplate()}
    </wui-flex>`}loaderTemplate(){let e=E.state.themeVariables["--w3m-border-radius-master"],i=e?parseInt(e.replace("px",""),10):4;return a`<wui-loading-thumbnail radius=${i*9}></wui-loading-thumbnail>`}async connectFarcaster(){if(this.authConnector)try{await this.authConnector?.provider.connectFarcaster(),this.socialProvider&&(U.setConnectedSocialProvider(this.socialProvider),p.sendEvent({type:"track",event:"SOCIAL_LOGIN_REQUEST_USER_DATA",properties:{provider:this.socialProvider}})),this.loading=!0;let i=L.getConnections(this.authConnector.chain).length>0;await L.connectExternal(this.authConnector,this.authConnector.chain);let r=this.remoteFeatures?.multiWallet;this.socialProvider&&p.sendEvent({type:"track",event:"SOCIAL_LOGIN_SUCCESS",properties:{provider:this.socialProvider}}),this.loading=!1,(!d.state.siwx||await T.isAuthenticated())&&(i&&r?(h.replace("ProfileWallets"),g.showSuccess("New Wallet Added")):I.close())}catch(e){this.socialProvider&&p.sendEvent({type:"track",event:"SOCIAL_LOGIN_ERROR",properties:{provider:this.socialProvider,message:m.parseError(e)}}),h.goBack(),g.showError(e)}}mobileLinkTemplate(){return a`<wui-button
      size="md"
      ?loading=${this.loading}
      ?disabled=${!this.uri||this.loading}
      @click=${()=>{this.uri&&m.openHref(this.uri,"_blank")}}
    >
      Open farcaster</wui-button
    >`}onRenderProxy(){!this.ready&&this.uri&&(this.timeout=setTimeout(()=>{this.ready=!0},200))}qrCodeTemplate(){if(!this.uri||!this.ready)return null;let e=this.getBoundingClientRect().width-40,i=E.state.themeVariables["--apkt-qr-color"]??E.state.themeVariables["--w3m-qr-color"];return a` <wui-qr-code
      size=${e}
      theme=${E.state.themeMode}
      uri=${this.uri}
      ?farcaster=${!0}
      data-testid="wui-qr-code"
      color=${x(i)}
    ></wui-qr-code>`}copyTemplate(){let e=!this.uri||!this.ready;return a`<wui-button
      .disabled=${e}
      @click=${this.onCopyUri}
      variant="neutral-secondary"
      size="sm"
      data-testid="copy-wc2-uri"
    >
      <wui-icon size="sm" color="default" slot="iconRight" name="copy"></wui-icon>
      Copy link
    </wui-button>`}onCopyUri(){try{this.uri&&(m.copyToClopboard(this.uri),g.showSuccess("Link copied"))}catch{g.showError("Failed to copy")}}};y.styles=V;O([l()],y.prototype,"socialProvider",void 0);O([l()],y.prototype,"uri",void 0);O([l()],y.prototype,"ready",void 0);O([l()],y.prototype,"loading",void 0);O([l()],y.prototype,"remoteFeatures",void 0);y=O([v("w3m-connecting-farcaster-view")],y);export{_ as W3mConnectSocialsView,y as W3mConnectingFarcasterView,w as W3mConnectingSocialView};
