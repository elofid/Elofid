import"./chunk-BEKVYPOR.js";import"./chunk-H6XR4XVN.js";import"./chunk-QNTMGA2J.js";import"./chunk-TVTUHLH3.js";import"./chunk-NEFL7XWX.js";import"./chunk-EPNHF45E.js";import"./chunk-TFRCW6O2.js";import"./chunk-V7YPZH6A.js";import"./chunk-V7Z5TEQE.js";import"./chunk-3Q4QTSFT.js";import"./chunk-IROS5LRB.js";import"./chunk-XJGBVDZY.js";import"./chunk-CDVOKJ4X.js";import"./chunk-SL6QOQTI.js";import"./chunk-KIA2J4MP.js";import"./chunk-MLQ7QHQ2.js";import{a as d,b as l,c as h}from"./chunk-VRWQ57HX.js";import{C as m,E as f,M as p,b as a,m as E,w as u}from"./chunk-L6OIOM3D.js";import"./chunk-7YSPBAD3.js";import{H as A,I as W,M as b,N as U,P as S,T as _,U as z,Z as M,ca as N,ia as $,ka as w,x as T,y as D}from"./chunk-Z6Y4EM3A.js";import"./chunk-Z54M76ZS.js";import"./chunk-WRJA7Y6R.js";import"./chunk-DT4MQDPQ.js";import"./chunk-N46RBGYQ.js";import"./chunk-U72QSA2E.js";import"./chunk-HOCAI56M.js";var V=f`
  :host > wui-grid {
    max-height: 360px;
    overflow: auto;
  }

  wui-flex {
    transition: opacity ${({easings:t})=>t["ease-out-power-1"]}
      ${({durations:t})=>t.md};
    will-change: opacity;
  }

  wui-grid::-webkit-scrollbar {
    display: none;
  }

  wui-flex.disabled {
    opacity: 0.3;
    pointer-events: none;
    user-select: none;
  }
`;var j=function(t,e,i,o){var s=arguments.length,r=s<3?e:o===null?o=Object.getOwnPropertyDescriptor(e,i):o,n;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")r=Reflect.decorate(t,e,i,o);else for(var c=t.length-1;c>=0;c--)(n=t[c])&&(r=(s<3?n(r):s>3?n(e,i,r):n(e,i))||r);return s>3&&r&&Object.defineProperty(e,i,r),r},P=class extends m{constructor(){super(),this.unsubscribe=[],this.selectedCurrency=a.state.paymentCurrency,this.currencies=a.state.paymentCurrencies,this.currencyImages=b.state.currencyImages,this.checked=E.state.isLegalCheckboxChecked,this.unsubscribe.push(a.subscribe(e=>{this.selectedCurrency=e.paymentCurrency,this.currencies=e.paymentCurrencies}),b.subscribeKey("currencyImages",e=>this.currencyImages=e),E.subscribeKey("isLegalCheckboxChecked",e=>{this.checked=e}))}disconnectedCallback(){this.unsubscribe.forEach(e=>e())}render(){let{termsConditionsUrl:e,privacyPolicyUrl:i}=A.state,o=A.state.features?.legalCheckbox,n=!!(e||i)&&!!o&&!this.checked;return u`
      <w3m-legal-checkbox></w3m-legal-checkbox>
      <wui-flex
        flexDirection="column"
        .padding=${["0","3","3","3"]}
        gap="2"
        class=${h(n?"disabled":void 0)}
      >
        ${this.currenciesTemplate(n)}
      </wui-flex>
    `}currenciesTemplate(e=!1){return this.currencies.map(i=>u`
        <wui-list-item
          imageSrc=${h(this.currencyImages?.[i.id])}
          @click=${()=>this.selectCurrency(i)}
          variant="image"
          tabIdx=${h(e?-1:void 0)}
        >
          <wui-text variant="md-medium" color="primary">${i.id}</wui-text>
        </wui-list-item>
      `)}selectCurrency(e){e&&(a.setPaymentCurrency(e),w.close())}};P.styles=V;j([l()],P.prototype,"selectedCurrency",void 0);j([l()],P.prototype,"currencies",void 0);j([l()],P.prototype,"currencyImages",void 0);j([l()],P.prototype,"checked",void 0);P=j([p("w3m-onramp-fiat-select-view")],P);var q=f`
  button {
    padding: ${({spacing:t})=>t[3]};
    border-radius: ${({borderRadius:t})=>t[4]};
    border: none;
    outline: none;
    background-color: ${({tokens:t})=>t.core.glass010};
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    gap: ${({spacing:t})=>t[3]};
    transition: background-color ${({easings:t})=>t["ease-out-power-1"]}
      ${({durations:t})=>t.md};
    will-change: background-color;
    cursor: pointer;
  }

  button:hover {
    background-color: ${({tokens:t})=>t.theme.foregroundPrimary};
  }

  .provider-image {
    width: ${({spacing:t})=>t[10]};
    min-width: ${({spacing:t})=>t[10]};
    height: ${({spacing:t})=>t[10]};
    border-radius: calc(
      ${({borderRadius:t})=>t[4]} - calc(${({spacing:t})=>t[3]} / 2)
    );
    position: relative;
    overflow: hidden;
  }

  .network-icon {
    width: ${({spacing:t})=>t[3]};
    height: ${({spacing:t})=>t[3]};
    border-radius: calc(${({spacing:t})=>t[3]} / 2);
    overflow: hidden;
    box-shadow:
      0 0 0 3px ${({tokens:t})=>t.theme.foregroundPrimary},
      0 0 0 3px ${({tokens:t})=>t.theme.backgroundPrimary};
    transition: box-shadow ${({easings:t})=>t["ease-out-power-1"]}
      ${({durations:t})=>t.md};
    will-change: box-shadow;
  }

  button:hover .network-icon {
    box-shadow:
      0 0 0 3px ${({tokens:t})=>t.core.glass010},
      0 0 0 3px ${({tokens:t})=>t.theme.backgroundPrimary};
  }
`;var k=function(t,e,i,o){var s=arguments.length,r=s<3?e:o===null?o=Object.getOwnPropertyDescriptor(e,i):o,n;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")r=Reflect.decorate(t,e,i,o);else for(var c=t.length-1;c>=0;c--)(n=t[c])&&(r=(s<3?n(r):s>3?n(e,i,r):n(e,i))||r);return s>3&&r&&Object.defineProperty(e,i,r),r},g=class extends m{constructor(){super(...arguments),this.disabled=!1,this.color="inherit",this.label="",this.feeRange="",this.loading=!1,this.onClick=null}render(){return u`
      <button ?disabled=${this.disabled} @click=${this.onClick} ontouchstart>
        <wui-visual name=${h(this.name)} class="provider-image"></wui-visual>
        <wui-flex flexDirection="column" gap="01">
          <wui-text variant="md-regular" color="primary">${this.label}</wui-text>
          <wui-flex alignItems="center" justifyContent="flex-start" gap="4">
            <wui-text variant="sm-medium" color="primary">
              <wui-text variant="sm-regular" color="secondary">Fees</wui-text>
              ${this.feeRange}
            </wui-text>
            <wui-flex gap="2">
              <wui-icon name="bank" size="sm" color="default"></wui-icon>
              <wui-icon name="card" size="sm" color="default"></wui-icon>
            </wui-flex>
            ${this.networksTemplate()}
          </wui-flex>
        </wui-flex>
        ${this.loading?u`<wui-loading-spinner color="secondary" size="md"></wui-loading-spinner>`:u`<wui-icon name="chevronRight" color="default" size="sm"></wui-icon>`}
      </button>
    `}networksTemplate(){let i=$.getAllRequestedCaipNetworks()?.filter(o=>o?.assets?.imageId)?.slice(0,5);return u`
      <wui-flex class="networks">
        ${i?.map(o=>u`
            <wui-flex class="network-icon">
              <wui-image src=${h(U.getNetworkImage(o))}></wui-image>
            </wui-flex>
          `)}
      </wui-flex>
    `}};g.styles=[q];k([d({type:Boolean})],g.prototype,"disabled",void 0);k([d()],g.prototype,"color",void 0);k([d()],g.prototype,"name",void 0);k([d()],g.prototype,"label",void 0);k([d()],g.prototype,"feeRange",void 0);k([d({type:Boolean})],g.prototype,"loading",void 0);k([d()],g.prototype,"onClick",void 0);g=k([p("w3m-onramp-provider-item")],g);var K=function(t,e,i,o){var s=arguments.length,r=s<3?e:o===null?o=Object.getOwnPropertyDescriptor(e,i):o,n;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")r=Reflect.decorate(t,e,i,o);else for(var c=t.length-1;c>=0;c--)(n=t[c])&&(r=(s<3?n(r):s>3?n(e,i,r):n(e,i))||r);return s>3&&r&&Object.defineProperty(e,i,r),r},B=class extends m{constructor(){super(),this.unsubscribe=[],this.providers=a.state.providers,this.unsubscribe.push(a.subscribeKey("providers",e=>{this.providers=e}))}render(){return u`
      <wui-flex flexDirection="column" .padding=${["0","3","3","3"]} gap="2">
        ${this.onRampProvidersTemplate()}
      </wui-flex>
    `}onRampProvidersTemplate(){return this.providers.filter(e=>e.supportedChains.includes($.state.activeChain??"eip155")).map(e=>u`
          <w3m-onramp-provider-item
            label=${e.label}
            name=${e.name}
            feeRange=${e.feeRange}
            @click=${()=>{this.onClickProvider(e)}}
            ?disabled=${!e.url}
            data-testid=${`onramp-provider-${e.name}`}
          ></w3m-onramp-provider-item>
        `)}onClickProvider(e){a.setSelectedProvider(e),_.push("BuyInProgress"),T.openHref(a.state.selectedProvider?.url||e.url,"popupWindow","width=600,height=800,scrollbars=yes"),S.sendEvent({type:"track",event:"SELECT_BUY_PROVIDER",properties:{provider:e.name,isSmartAccount:M($.state.activeChain)===D.ACCOUNT_TYPES.SMART_ACCOUNT}})}};K([l()],B.prototype,"providers",void 0);B=K([p("w3m-onramp-providers-view")],B);var F=f`
  :host > wui-grid {
    max-height: 360px;
    overflow: auto;
  }

  wui-flex {
    transition: opacity ${({easings:t})=>t["ease-out-power-1"]}
      ${({durations:t})=>t.md};
    will-change: opacity;
  }

  wui-grid::-webkit-scrollbar {
    display: none;
  }

  wui-flex.disabled {
    opacity: 0.3;
    pointer-events: none;
    user-select: none;
  }
`;var L=function(t,e,i,o){var s=arguments.length,r=s<3?e:o===null?o=Object.getOwnPropertyDescriptor(e,i):o,n;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")r=Reflect.decorate(t,e,i,o);else for(var c=t.length-1;c>=0;c--)(n=t[c])&&(r=(s<3?n(r):s>3?n(e,i,r):n(e,i))||r);return s>3&&r&&Object.defineProperty(e,i,r),r},O=class extends m{constructor(){super(),this.unsubscribe=[],this.selectedCurrency=a.state.purchaseCurrencies,this.tokens=a.state.purchaseCurrencies,this.tokenImages=b.state.tokenImages,this.checked=E.state.isLegalCheckboxChecked,this.unsubscribe.push(a.subscribe(e=>{this.selectedCurrency=e.purchaseCurrencies,this.tokens=e.purchaseCurrencies}),b.subscribeKey("tokenImages",e=>this.tokenImages=e),E.subscribeKey("isLegalCheckboxChecked",e=>{this.checked=e}))}disconnectedCallback(){this.unsubscribe.forEach(e=>e())}render(){let{termsConditionsUrl:e,privacyPolicyUrl:i}=A.state,o=A.state.features?.legalCheckbox,n=!!(e||i)&&!!o&&!this.checked;return u`
      <w3m-legal-checkbox></w3m-legal-checkbox>
      <wui-flex
        flexDirection="column"
        .padding=${["0","3","3","3"]}
        gap="2"
        class=${h(n?"disabled":void 0)}
      >
        ${this.currenciesTemplate(n)}
      </wui-flex>
    `}currenciesTemplate(e=!1){return this.tokens.map(i=>u`
        <wui-list-item
          imageSrc=${h(this.tokenImages?.[i.symbol])}
          @click=${()=>this.selectToken(i)}
          variant="image"
          tabIdx=${h(e?-1:void 0)}
        >
          <wui-flex gap="1" alignItems="center">
            <wui-text variant="md-medium" color="primary">${i.name}</wui-text>
            <wui-text variant="sm-regular" color="secondary">${i.symbol}</wui-text>
          </wui-flex>
        </wui-list-item>
      `)}selectToken(e){e&&(a.setPurchaseCurrency(e),w.close())}};O.styles=F;L([l()],O.prototype,"selectedCurrency",void 0);L([l()],O.prototype,"tokens",void 0);L([l()],O.prototype,"tokenImages",void 0);L([l()],O.prototype,"checked",void 0);O=L([p("w3m-onramp-token-select-view")],O);var Y=f`
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

  wui-visual {
    border-radius: calc(
      ${({borderRadius:t})=>t[1]} * 9 - ${({borderRadius:t})=>t[3]}
    );
    position: relative;
    overflow: hidden;
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

  [data-retry='false'] wui-link {
    display: none;
  }

  [data-retry='true'] wui-link {
    display: block;
    opacity: 1;
  }

  wui-link {
    padding: ${({spacing:t})=>t["01"]} ${({spacing:t})=>t[2]};
  }
`;var x=function(t,e,i,o){var s=arguments.length,r=s<3?e:o===null?o=Object.getOwnPropertyDescriptor(e,i):o,n;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")r=Reflect.decorate(t,e,i,o);else for(var c=t.length-1;c>=0;c--)(n=t[c])&&(r=(s<3?n(r):s>3?n(e,i,r):n(e,i))||r);return s>3&&r&&Object.defineProperty(e,i,r),r},y=class extends m{constructor(){super(),this.unsubscribe=[],this.selectedOnRampProvider=a.state.selectedProvider,this.uri=N.state.wcUri,this.ready=!1,this.showRetry=!1,this.buffering=!1,this.error=!1,this.isMobile=!1,this.onRetry=void 0,this.unsubscribe.push(a.subscribeKey("selectedProvider",e=>{this.selectedOnRampProvider=e}))}disconnectedCallback(){this.intervalId&&clearInterval(this.intervalId)}render(){let e="Continue in external window";this.error?e="Buy failed":this.selectedOnRampProvider&&(e=`Buy in ${this.selectedOnRampProvider?.label}`);let i=this.error?"Buy can be declined from your side or due to and error on the provider app":"We\u2019ll notify you once your Buy is processed";return u`
      <wui-flex
        data-error=${h(this.error)}
        data-retry=${this.showRetry}
        flexDirection="column"
        alignItems="center"
        .padding=${["10","5","5","5"]}
        gap="5"
      >
        <wui-flex justifyContent="center" alignItems="center">
          <wui-visual
            name=${h(this.selectedOnRampProvider?.name)}
            size="lg"
            class="provider-image"
          >
          </wui-visual>

          ${this.error?null:this.loaderTemplate()}

          <wui-icon-box
            color="error"
            icon="close"
            size="sm"
            border
            borderColor="wui-color-bg-125"
          ></wui-icon-box>
        </wui-flex>

        <wui-flex
          flexDirection="column"
          alignItems="center"
          gap="2"
          .padding=${["4","0","0","0"]}
        >
          <wui-text variant="md-medium" color=${this.error?"error":"primary"}>
            ${e}
          </wui-text>
          <wui-text align="center" variant="sm-medium" color="secondary">${i}</wui-text>
        </wui-flex>

        ${this.error?this.tryAgainTemplate():null}
      </wui-flex>

      <wui-flex .padding=${["0","5","5","5"]} justifyContent="center">
        <wui-link @click=${this.onCopyUri} color="secondary">
          <wui-icon size="sm" color="default" slot="iconLeft" name="copy"></wui-icon>
          Copy link
        </wui-link>
      </wui-flex>
    `}onTryAgain(){this.selectedOnRampProvider&&(this.error=!1,T.openHref(this.selectedOnRampProvider.url,"popupWindow","width=600,height=800,scrollbars=yes"))}tryAgainTemplate(){return this.selectedOnRampProvider?.url?u`<wui-button size="md" variant="accent" @click=${this.onTryAgain.bind(this)}>
      <wui-icon color="inherit" slot="iconLeft" name="refresh"></wui-icon>
      Try again
    </wui-button>`:null}loaderTemplate(){let e=z.state.themeVariables["--w3m-border-radius-master"],i=e?parseInt(e.replace("px",""),10):4;return u`<wui-loading-thumbnail radius=${i*9}></wui-loading-thumbnail>`}onCopyUri(){if(!this.selectedOnRampProvider?.url){W.showError("No link found"),_.goBack();return}try{T.copyToClopboard(this.selectedOnRampProvider.url),W.showSuccess("Link copied")}catch{W.showError("Failed to copy")}}};y.styles=Y;x([l()],y.prototype,"intervalId",void 0);x([l()],y.prototype,"selectedOnRampProvider",void 0);x([l()],y.prototype,"uri",void 0);x([l()],y.prototype,"ready",void 0);x([l()],y.prototype,"showRetry",void 0);x([l()],y.prototype,"buffering",void 0);x([l()],y.prototype,"error",void 0);x([d({type:Boolean})],y.prototype,"isMobile",void 0);x([d()],y.prototype,"onRetry",void 0);y=x([p("w3m-buy-in-progress-view")],y);var G=function(t,e,i,o){var s=arguments.length,r=s<3?e:o===null?o=Object.getOwnPropertyDescriptor(e,i):o,n;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")r=Reflect.decorate(t,e,i,o);else for(var c=t.length-1;c>=0;c--)(n=t[c])&&(r=(s<3?n(r):s>3?n(e,i,r):n(e,i))||r);return s>3&&r&&Object.defineProperty(e,i,r),r},Q=class extends m{render(){return u`
      <wui-flex
        flexDirection="column"
        .padding=${["6","10","5","10"]}
        alignItems="center"
        gap="5"
      >
        <wui-visual name="onrampCard"></wui-visual>
        <wui-flex flexDirection="column" gap="2" alignItems="center">
          <wui-text align="center" variant="md-medium" color="primary">
            Quickly and easily buy digital assets!
          </wui-text>
          <wui-text align="center" variant="sm-regular" color="secondary">
            Simply select your preferred onramp provider and add digital assets to your account
            using your credit card or bank transfer
          </wui-text>
        </wui-flex>
        <wui-button @click=${_.goBack}>
          <wui-icon size="sm" color="inherit" name="add" slot="iconLeft"></wui-icon>
          Buy
        </wui-button>
      </wui-flex>
    `}};Q=G([p("w3m-what-is-a-buy-view")],Q);var X=f`
  :host {
    width: 100%;
  }

  wui-loading-spinner {
    position: absolute;
    top: 50%;
    right: 20px;
    transform: translateY(-50%);
  }

  .currency-container {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    right: ${({spacing:t})=>t[2]};
    height: 40px;
    padding: ${({spacing:t})=>t[2]} ${({spacing:t})=>t[2]}
      ${({spacing:t})=>t[2]} ${({spacing:t})=>t[2]};
    min-width: 95px;
    border-radius: ${({borderRadius:t})=>t.round};
    border: 1px solid ${({tokens:t})=>t.theme.foregroundPrimary};
    background: ${({tokens:t})=>t.theme.foregroundPrimary};
    cursor: pointer;
  }

  .currency-container > wui-image {
    height: 24px;
    width: 24px;
    border-radius: 50%;
  }
`;var I=function(t,e,i,o){var s=arguments.length,r=s<3?e:o===null?o=Object.getOwnPropertyDescriptor(e,i):o,n;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")r=Reflect.decorate(t,e,i,o);else for(var c=t.length-1;c>=0;c--)(n=t[c])&&(r=(s<3?n(r):s>3?n(e,i,r):n(e,i))||r);return s>3&&r&&Object.defineProperty(e,i,r),r},C=class extends m{constructor(){super(),this.unsubscribe=[],this.type="Token",this.value=0,this.currencies=[],this.selectedCurrency=this.currencies?.[0],this.currencyImages=b.state.currencyImages,this.tokenImages=b.state.tokenImages,this.unsubscribe.push(a.subscribeKey("purchaseCurrency",e=>{!e||this.type==="Fiat"||(this.selectedCurrency=this.formatPurchaseCurrency(e))}),a.subscribeKey("paymentCurrency",e=>{!e||this.type==="Token"||(this.selectedCurrency=this.formatPaymentCurrency(e))}),a.subscribe(e=>{this.type==="Fiat"?this.currencies=e.purchaseCurrencies.map(this.formatPurchaseCurrency):this.currencies=e.paymentCurrencies.map(this.formatPaymentCurrency)}),b.subscribe(e=>{this.currencyImages={...e.currencyImages},this.tokenImages={...e.tokenImages}}))}firstUpdated(){a.getAvailableCurrencies()}disconnectedCallback(){this.unsubscribe.forEach(e=>e())}render(){let e=this.selectedCurrency?.symbol||"",i=this.currencyImages[e]||this.tokenImages[e];return u`<wui-input-text type="number" size="lg" value=${this.value}>
      ${this.selectedCurrency?u` <wui-flex
            class="currency-container"
            justifyContent="space-between"
            alignItems="center"
            gap="1"
            @click=${()=>w.open({view:`OnRamp${this.type}Select`})}
          >
            <wui-image src=${h(i)}></wui-image>
            <wui-text color="primary">${this.selectedCurrency.symbol}</wui-text>
          </wui-flex>`:u`<wui-loading-spinner></wui-loading-spinner>`}
    </wui-input-text>`}formatPaymentCurrency(e){return{name:e.id,symbol:e.id}}formatPurchaseCurrency(e){return{name:e.name,symbol:e.symbol}}};C.styles=X;I([d({type:String})],C.prototype,"type",void 0);I([d({type:Number})],C.prototype,"value",void 0);I([l()],C.prototype,"currencies",void 0);I([l()],C.prototype,"selectedCurrency",void 0);I([l()],C.prototype,"currencyImages",void 0);I([l()],C.prototype,"tokenImages",void 0);C=I([p("w3m-onramp-input")],C);var H=f`
  :host > wui-flex {
    width: 100%;
    max-width: 360px;
  }

  :host > wui-flex > wui-flex {
    border-radius: ${({borderRadius:t})=>t[8]};
    width: 100%;
  }

  .amounts-container {
    width: 100%;
  }
`;var R=function(t,e,i,o){var s=arguments.length,r=s<3?e:o===null?o=Object.getOwnPropertyDescriptor(e,i):o,n;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")r=Reflect.decorate(t,e,i,o);else for(var c=t.length-1;c>=0;c--)(n=t[c])&&(r=(s<3?n(r):s>3?n(e,i,r):n(e,i))||r);return s>3&&r&&Object.defineProperty(e,i,r),r},J={USD:"$",EUR:"\u20AC",GBP:"\xA3"},Z=[100,250,500,1e3],v=class extends m{constructor(){super(),this.unsubscribe=[],this.disabled=!1,this.caipAddress=$.state.activeCaipAddress,this.loading=w.state.loading,this.paymentCurrency=a.state.paymentCurrency,this.paymentAmount=a.state.paymentAmount,this.purchaseAmount=a.state.purchaseAmount,this.quoteLoading=a.state.quotesLoading,this.unsubscribe.push($.subscribeKey("activeCaipAddress",e=>this.caipAddress=e),w.subscribeKey("loading",e=>{this.loading=e}),a.subscribe(e=>{this.paymentCurrency=e.paymentCurrency,this.paymentAmount=e.paymentAmount,this.purchaseAmount=e.purchaseAmount,this.quoteLoading=e.quotesLoading}))}disconnectedCallback(){this.unsubscribe.forEach(e=>e())}render(){return u`
      <wui-flex flexDirection="column" justifyContent="center" alignItems="center">
        <wui-flex flexDirection="column" alignItems="center" gap="2">
          <w3m-onramp-input
            type="Fiat"
            @inputChange=${this.onPaymentAmountChange.bind(this)}
            .value=${this.paymentAmount||0}
          ></w3m-onramp-input>
          <w3m-onramp-input
            type="Token"
            .value=${this.purchaseAmount||0}
            .loading=${this.quoteLoading}
          ></w3m-onramp-input>
          <wui-flex justifyContent="space-evenly" class="amounts-container" gap="2">
            ${Z.map(e=>u`<wui-button
                  variant=${this.paymentAmount===e?"accent-secondary":"neutral-secondary"}
                  size="md"
                  textVariant="md-medium"
                  fullWidth
                  @click=${()=>this.selectPresetAmount(e)}
                  >${`${J[this.paymentCurrency?.id||"USD"]} ${e}`}</wui-button
                >`)}
          </wui-flex>
          ${this.templateButton()}
        </wui-flex>
      </wui-flex>
    `}templateButton(){return this.caipAddress?u`<wui-button
          @click=${this.getQuotes.bind(this)}
          variant="accent-primary"
          fullWidth
          size="lg"
          borderRadius="xs"
        >
          Get quotes
        </wui-button>`:u`<wui-button
          @click=${this.openModal.bind(this)}
          variant="accent"
          fullWidth
          size="lg"
          borderRadius="xs"
        >
          Connect wallet
        </wui-button>`}getQuotes(){this.loading||w.open({view:"OnRampProviders"})}openModal(){w.open({view:"Connect"})}async onPaymentAmountChange(e){a.setPaymentAmount(Number(e.detail)),await a.getQuote()}async selectPresetAmount(e){a.setPaymentAmount(e),await a.getQuote()}};v.styles=H;R([d({type:Boolean})],v.prototype,"disabled",void 0);R([l()],v.prototype,"caipAddress",void 0);R([l()],v.prototype,"loading",void 0);R([l()],v.prototype,"paymentCurrency",void 0);R([l()],v.prototype,"paymentAmount",void 0);R([l()],v.prototype,"purchaseAmount",void 0);R([l()],v.prototype,"quoteLoading",void 0);v=R([p("w3m-onramp-widget")],v);export{y as W3mBuyInProgressView,B as W3mOnRampProvidersView,P as W3mOnrampFiatSelectView,O as W3mOnrampTokensView,v as W3mOnrampWidget,Q as W3mWhatIsABuyView};
