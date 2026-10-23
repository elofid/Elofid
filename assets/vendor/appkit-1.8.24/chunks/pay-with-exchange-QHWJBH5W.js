import"./chunk-H6XR4XVN.js";import"./chunk-TVTUHLH3.js";import"./chunk-A6FGC6QC.js";import"./chunk-VNS4K43S.js";import"./chunk-URIGJCRT.js";import"./chunk-3YMHKYM4.js";import"./chunk-NGDGXLOC.js";import"./chunk-TFRCW6O2.js";import"./chunk-V7YPZH6A.js";import"./chunk-V7Z5TEQE.js";import"./chunk-YY4ZOCTW.js";import"./chunk-3Q4QTSFT.js";import"./chunk-IROS5LRB.js";import"./chunk-XJGBVDZY.js";import"./chunk-CDVOKJ4X.js";import"./chunk-SL6QOQTI.js";import"./chunk-KIA2J4MP.js";import"./chunk-MLQ7QHQ2.js";import{a as p,b as m,c as v}from"./chunk-VRWQ57HX.js";import{C as g,E as y,I as L,J as z,M as w,p as r,w as s}from"./chunk-L6OIOM3D.js";import"./chunk-7YSPBAD3.js";import{I as b,N as D,T as f,ca as E,ia as $,x as C}from"./chunk-Z6Y4EM3A.js";import"./chunk-Z54M76ZS.js";import"./chunk-WRJA7Y6R.js";import"./chunk-DT4MQDPQ.js";import"./chunk-N46RBGYQ.js";import"./chunk-U72QSA2E.js";import"./chunk-HOCAI56M.js";var _=y`
  button {
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
        ${({easings:e})=>e["ease-out-power-2"]};
    will-change: background-color, box-shadow;
  }

  /* -- Variants --------------------------------------------------------------- */
  button[data-type='accent'] {
    background-color: ${({tokens:e})=>e.core.backgroundAccentPrimary};
    color: ${({tokens:e})=>e.theme.textPrimary};
  }

  button[data-type='neutral'] {
    background-color: ${({tokens:e})=>e.theme.foregroundSecondary};
    color: ${({tokens:e})=>e.theme.textPrimary};
  }

  /* -- Sizes --------------------------------------------------------------- */
  button[data-size='sm'] {
    height: 24px;
  }

  button[data-size='md'] {
    height: 28px;
  }

  button[data-size='lg'] {
    height: 32px;
  }

  button[data-size='sm'] > wui-image,
  button[data-size='sm'] > wui-icon {
    width: 16px;
    height: 16px;
  }

  button[data-size='md'] > wui-image,
  button[data-size='md'] > wui-icon {
    width: 20px;
    height: 20px;
  }

  button[data-size='lg'] > wui-image,
  button[data-size='lg'] > wui-icon {
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
    button[data-type='accent']:not(:disabled):hover {
      background-color: ${({tokens:e})=>e.core.foregroundAccent060};
    }

    button[data-type='neutral']:not(:disabled):hover {
      background-color: ${({tokens:e})=>e.theme.foregroundTertiary};
    }
  }

  button[data-type='accent']:not(:disabled):focus-visible,
  button[data-type='accent']:not(:disabled):active {
    box-shadow: 0 0 0 4px ${({tokens:e})=>e.core.foregroundAccent020};
  }

  button[data-type='neutral']:not(:disabled):focus-visible,
  button[data-type='neutral']:not(:disabled):active {
    box-shadow: 0 0 0 4px ${({tokens:e})=>e.core.foregroundAccent020};
  }

  button:disabled {
    opacity: 0.5;
  }
`;var x=function(e,t,o,n){var a=arguments.length,i=a<3?t:n===null?n=Object.getOwnPropertyDescriptor(t,o):n,u;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")i=Reflect.decorate(e,t,o,n);else for(var c=e.length-1;c>=0;c--)(u=e[c])&&(i=(a<3?u(i):a>3?u(t,o,i):u(t,o))||i);return a>3&&i&&Object.defineProperty(t,o,i),i},j={sm:"sm-regular",md:"md-regular",lg:"lg-regular"},h=class extends g{constructor(){super(...arguments),this.type="accent",this.size="md",this.imageSrc="",this.disabled=!1,this.leftIcon=void 0,this.rightIcon=void 0,this.text=""}render(){return s`
      <button ?disabled=${this.disabled} data-type=${this.type} data-size=${this.size}>
        ${this.imageSrc?s`<wui-image src=${this.imageSrc}></wui-image>`:null}
        ${this.leftIcon?s`<wui-icon name=${this.leftIcon} color="inherit" size="inherit"></wui-icon>`:null}
        <wui-text variant=${j[this.size]} color="inherit">${this.text}</wui-text>
        ${this.rightIcon?s`<wui-icon name=${this.rightIcon} color="inherit" size="inherit"></wui-icon>`:null}
      </button>
    `}};h.styles=[L,z,_];x([p()],h.prototype,"type",void 0);x([p()],h.prototype,"size",void 0);x([p()],h.prototype,"imageSrc",void 0);x([p({type:Boolean})],h.prototype,"disabled",void 0);x([p()],h.prototype,"leftIcon",void 0);x([p()],h.prototype,"rightIcon",void 0);x([p()],h.prototype,"text",void 0);h=x([w("wui-chip-button")],h);var A=function(e,t,o,n){var a=arguments.length,i=a<3?t:n===null?n=Object.getOwnPropertyDescriptor(t,o):n,u;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")i=Reflect.decorate(e,t,o,n);else for(var c=e.length-1;c>=0;c--)(u=e[c])&&(i=(a<3?u(i):a>3?u(t,o,i):u(t,o))||i);return a>3&&i&&Object.defineProperty(t,o,i),i},I=class extends g{constructor(){super(...arguments),this.maxDecimals=void 0,this.maxIntegers=void 0}render(){return s`
      <wui-flex alignItems="center" gap="1">
        <wui-input-amount
          widthVariant="fit"
          fontSize="h2"
          .maxDecimals=${v(this.maxDecimals)}
          .maxIntegers=${v(this.maxIntegers)}
          .value=${this.amount?String(this.amount):""}
        ></wui-input-amount>
        <wui-text variant="md-regular" color="secondary">USD</wui-text>
      </wui-flex>
    `}};A([p({type:Number})],I.prototype,"amount",void 0);A([p({type:Number})],I.prototype,"maxDecimals",void 0);A([p({type:Number})],I.prototype,"maxIntegers",void 0);I=A([w("w3m-fund-input")],I);var S=y`
  .amount-input-container {
    border-radius: ${({borderRadius:e})=>e[6]};
    border-top-right-radius: 0;
    border-top-left-radius: 0;
    background-color: ${({tokens:e})=>e.theme.foregroundPrimary};
    padding: ${({spacing:e})=>e[1]};
  }

  .container {
    border-radius: 30px;
  }
`;var d=function(e,t,o,n){var a=arguments.length,i=a<3?t:n===null?n=Object.getOwnPropertyDescriptor(t,o):n,u;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")i=Reflect.decorate(e,t,o,n);else for(var c=e.length-1;c>=0;c--)(u=e[c])&&(i=(a<3?u(i):a>3?u(t,o,i):u(t,o))||i);return a>3&&i&&Object.defineProperty(t,o,i),i},T=[10,50,100],N=6,O=10,l=class extends g{constructor(){super(),this.unsubscribe=[],this.network=$.state.activeCaipNetwork,this.exchanges=r.state.exchanges,this.isLoading=r.state.isLoading,this.amount=r.state.amount,this.tokenAmount=r.state.tokenAmount,this.priceLoading=r.state.priceLoading,this.isPaymentInProgress=r.state.isPaymentInProgress,this.currentPayment=r.state.currentPayment,this.paymentId=r.state.paymentId,this.paymentAsset=r.state.paymentAsset,this.unsubscribe.push($.subscribeKey("activeCaipNetwork",t=>{this.network=t,this.setDefaultPaymentAsset()}),r.subscribe(t=>{this.exchanges=t.exchanges,this.isLoading=t.isLoading,this.amount=t.amount,this.tokenAmount=t.tokenAmount,this.priceLoading=t.priceLoading,this.paymentId=t.paymentId,this.isPaymentInProgress=t.isPaymentInProgress,this.currentPayment=t.currentPayment,this.paymentAsset=t.paymentAsset,t.isPaymentInProgress&&t.currentPayment?.exchangeId&&t.currentPayment?.sessionId&&t.paymentId&&this.handlePaymentInProgress()}))}disconnectedCallback(){this.unsubscribe.forEach(o=>o()),r.state.isPaymentInProgress||r.reset()}async firstUpdated(){await this.getPaymentAssets(),this.paymentAsset||await this.setDefaultPaymentAsset(),r.setAmount(T[0]),await r.fetchExchanges()}render(){return s`
      <wui-flex flexDirection="column" class="container">
        ${this.amountInputTemplate()} ${this.exchangesTemplate()}
      </wui-flex>
    `}exchangesLoadingTemplate(){return Array.from({length:2}).map(()=>s`<wui-shimmer width="100%" height="65px" borderRadius="xxs"></wui-shimmer>`)}_exchangesTemplate(){return this.exchanges.length>0?this.exchanges.map(t=>s`<wui-list-item
              @click=${()=>this.onExchangeClick(t)}
              chevron
              variant="image"
              imageSrc=${t.imageUrl}
              ?loading=${this.isLoading}
            >
              <wui-text variant="md-regular" color="primary">
                Deposit from ${t.name}
              </wui-text>
            </wui-list-item>`):s`<wui-flex flexDirection="column" alignItems="center" gap="4" padding="4">
          <wui-text variant="lg-medium" align="center" color="primary">
            No exchanges support this asset on this network
          </wui-text>
        </wui-flex>`}exchangesTemplate(){return s`<wui-flex
      flexDirection="column"
      gap="2"
      .padding=${["3","3","3","3"]}
      class="exchanges-container"
    >
      ${this.isLoading?this.exchangesLoadingTemplate():this._exchangesTemplate()}
    </wui-flex>`}amountInputTemplate(){return s`
      <wui-flex
        flexDirection="column"
        .padding=${["0","3","3","3"]}
        class="amount-input-container"
      >
        <wui-flex
          justifyContent="space-between"
          alignItems="center"
          .margin=${["0","0","6","0"]}
        >
          <wui-text variant="md-medium" color="secondary">Asset</wui-text>
          <wui-token-button
            data-testid="deposit-from-exchange-asset-button"
            flexDirection="row-reverse"
            text=${this.paymentAsset?.metadata.symbol||""}
            imageSrc=${this.paymentAsset?.metadata.iconUrl||""}
            @click=${()=>f.push("PayWithExchangeSelectAsset")}
            size="lg"
            .chainImageSrc=${v(D.getNetworkImage(this.network))}
          >
          </wui-token-button>
        </wui-flex>
        <wui-flex
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          .margin=${["0","0","4","0"]}
        >
          <w3m-fund-input
            @inputChange=${this.onAmountChange.bind(this)}
            .amount=${this.amount}
            .maxDecimals=${N}
            .maxIntegers=${O}
          >
          </w3m-fund-input>
          ${this.tokenAmountTemplate()}
        </wui-flex>
        <wui-flex justifyContent="center" gap="2">
          ${T.map(t=>s`<wui-chip-button
                @click=${()=>r.setAmount(t)}
                type="neutral"
                size="lg"
                text=${`$${t}`}
              ></wui-chip-button>`)}
        </wui-flex>
      </wui-flex>
    `}tokenAmountTemplate(){return this.priceLoading?s`<wui-shimmer
        width="65px"
        height="20px"
        borderRadius="xxs"
        variant="light"
      ></wui-shimmer>`:s`
      <wui-text variant="md-regular" color="secondary">
        ${this.tokenAmount.toFixed(4)} ${this.paymentAsset?.metadata.symbol}
      </wui-text>
    `}async onExchangeClick(t){if(!this.amount){b.showError("Please enter an amount");return}await r.handlePayWithExchange(t.id)}handlePaymentInProgress(){let t=$.state.activeChain,{redirectView:o="Account"}=f.state.data??{};this.isPaymentInProgress&&this.currentPayment?.exchangeId&&this.currentPayment?.sessionId&&this.paymentId&&(r.waitUntilComplete({exchangeId:this.currentPayment.exchangeId,sessionId:this.currentPayment.sessionId,paymentId:this.paymentId}).then(n=>{n.status==="SUCCESS"?(b.showSuccess("Deposit completed"),r.reset(),t&&($.fetchTokenBalance(),E.updateBalance(t)),f.replace("Transactions")):n.status==="FAILED"&&b.showError("Deposit failed")}),b.showLoading("Deposit in progress..."),f.replace(o))}onAmountChange({detail:t}){r.setAmount(t?Number(t):null)}async getPaymentAssets(){this.network&&await r.getAssetsForNetwork(this.network.caipNetworkId)}async setDefaultPaymentAsset(){if(this.network){let t=await r.getAssetsForNetwork(this.network.caipNetworkId);t[0]&&r.setPaymentAsset(t[0])}}};l.styles=S;d([m()],l.prototype,"network",void 0);d([m()],l.prototype,"exchanges",void 0);d([m()],l.prototype,"isLoading",void 0);d([m()],l.prototype,"amount",void 0);d([m()],l.prototype,"tokenAmount",void 0);d([m()],l.prototype,"priceLoading",void 0);d([m()],l.prototype,"isPaymentInProgress",void 0);d([m()],l.prototype,"currentPayment",void 0);d([m()],l.prototype,"paymentId",void 0);d([m()],l.prototype,"paymentAsset",void 0);l=d([w("w3m-deposit-from-exchange-view")],l);var R=y`
  .contentContainer {
    height: 440px;
    overflow: scroll;
    scrollbar-width: none;
  }

  .contentContainer::-webkit-scrollbar {
    display: none;
  }

  wui-icon-box {
    width: 40px;
    height: 40px;
    border-radius: ${({borderRadius:e})=>e[3]};
  }
`;var k=function(e,t,o,n){var a=arguments.length,i=a<3?t:n===null?n=Object.getOwnPropertyDescriptor(t,o):n,u;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")i=Reflect.decorate(e,t,o,n);else for(var c=e.length-1;c>=0;c--)(u=e[c])&&(i=(a<3?u(i):a>3?u(t,o,i):u(t,o))||i);return a>3&&i&&Object.defineProperty(t,o,i),i},P=class extends g{constructor(){super(),this.unsubscribe=[],this.assets=r.state.assets,this.search="",this.onDebouncedSearch=C.debounce(t=>{this.search=t}),this.unsubscribe.push(r.subscribe(t=>{this.assets=t.assets}))}disconnectedCallback(){this.unsubscribe.forEach(t=>t())}render(){return s`
      <wui-flex flexDirection="column">
        ${this.templateSearchInput()} <wui-separator></wui-separator> ${this.templateTokens()}
      </wui-flex>
    `}templateSearchInput(){return s`
      <wui-flex gap="2" padding="3">
        <wui-input-text
          @inputChange=${this.onInputChange.bind(this)}
          class="network-search-input"
          size="sm"
          placeholder="Search token"
          icon="search"
        ></wui-input-text>
      </wui-flex>
    `}templateTokens(){let t=this.assets.filter(n=>n.metadata.name.toLowerCase().includes(this.search.toLowerCase())),o=t.length>0;return s`
      <wui-flex
        class="contentContainer"
        flexDirection="column"
        .padding=${["0","3","0","3"]}
      >
        <wui-flex justifyContent="flex-start" .padding=${["4","3","3","3"]}>
          <wui-text variant="md-medium" color="secondary">Available tokens</wui-text>
        </wui-flex>
        <wui-flex flexDirection="column" gap="2">
          ${o?t.map(n=>s`<wui-list-item
                    .imageSrc=${n.metadata.iconUrl}
                    ?clickable=${!0}
                    @click=${this.handleTokenClick.bind(this,n)}
                  >
                    <wui-text variant="md-medium" color="primary">${n.metadata.name}</wui-text>
                    <wui-text variant="md-regular" color="secondary"
                      >${n.metadata.symbol}</wui-text
                    >
                  </wui-list-item>`):s`<wui-flex
                .padding=${["20","0","0","0"]}
                alignItems="center"
                flexDirection="column"
                gap="4"
              >
                <wui-icon-box icon="coinPlaceholder" color="default" size="lg"></wui-icon-box>
                <wui-flex
                  class="textContent"
                  gap="2"
                  flexDirection="column"
                  justifyContent="center"
                >
                  <wui-text variant="lg-medium" align="center" color="primary">
                    No tokens found
                  </wui-text>
                </wui-flex>
                <wui-link @click=${this.onBuyClick.bind(this)}>Buy</wui-link>
              </wui-flex>`}
        </wui-flex>
      </wui-flex>
    `}onBuyClick(){f.push("OnRampProviders")}onInputChange(t){this.onDebouncedSearch(t.detail)}handleTokenClick(t){r.setPaymentAsset(t),f.goBack()}};P.styles=R;k([m()],P.prototype,"assets",void 0);k([m()],P.prototype,"search",void 0);P=k([w("w3m-deposit-from-exchange-select-asset-view")],P);export{P as W3mDepositFromExchangeSelectAssetView,l as W3mDepositFromExchangeView};
