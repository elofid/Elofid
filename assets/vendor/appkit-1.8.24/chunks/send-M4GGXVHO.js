import"./chunk-URIGJCRT.js";import"./chunk-LJLEJPFN.js";import"./chunk-3YMHKYM4.js";import"./chunk-NGDGXLOC.js";import"./chunk-TFRCW6O2.js";import"./chunk-HSBJBDNP.js";import"./chunk-4XSXNTT4.js";import"./chunk-V7YPZH6A.js";import"./chunk-V7Z5TEQE.js";import"./chunk-YY4ZOCTW.js";import"./chunk-3Q4QTSFT.js";import{a as K,b as G}from"./chunk-IROS5LRB.js";import"./chunk-XJGBVDZY.js";import"./chunk-CDVOKJ4X.js";import"./chunk-SL6QOQTI.js";import"./chunk-KIA2J4MP.js";import"./chunk-MLQ7QHQ2.js";import{a as d,b as u,c as ee}from"./chunk-VRWQ57HX.js";import{C as p,E as m,I as j,J as V,K as $,M as f,k as T,w as l}from"./chunk-L6OIOM3D.js";import"./chunk-7YSPBAD3.js";import{I as b,K as q,N as U,P as X,T as h,ca as _,da as Z,h as S,ha as a,ia as w,ka as W,n as M,v as Q,x as A}from"./chunk-Z6Y4EM3A.js";import"./chunk-Z54M76ZS.js";import"./chunk-WRJA7Y6R.js";import"./chunk-DT4MQDPQ.js";import"./chunk-N46RBGYQ.js";import"./chunk-U72QSA2E.js";import"./chunk-HOCAI56M.js";var te=m`
  :host {
    width: 100%;
    height: 100px;
    border-radius: ${({borderRadius:e})=>e[5]};
    border: 1px solid ${({tokens:e})=>e.theme.foregroundPrimary};
    background-color: ${({tokens:e})=>e.theme.foregroundPrimary};
    transition: background-color ${({durations:e})=>e.lg}
      ${({easings:e})=>e["ease-out-power-1"]};
    will-change: background-color;
    position: relative;
  }

  :host(:hover) {
    background-color: ${({tokens:e})=>e.theme.foregroundSecondary};
  }

  wui-flex {
    width: 100%;
    height: fit-content;
  }

  wui-button {
    display: ruby;
    color: ${({tokens:e})=>e.theme.textPrimary};
    margin: 0 ${({spacing:e})=>e[2]};
  }

  .instruction {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    z-index: 2;
  }

  .paste {
    display: inline-flex;
  }

  textarea {
    background: transparent;
    width: 100%;
    font-family: ${({fontFamily:e})=>e.regular};
    font-style: normal;
    font-size: ${({textSize:e})=>e.large};
    font-weight: ${({fontWeight:e})=>e.regular};
    line-height: ${({typography:e})=>e["lg-regular"].lineHeight};
    letter-spacing: ${({typography:e})=>e["lg-regular"].letterSpacing};
    color: ${({tokens:e})=>e.theme.textPrimary};
    caret-color: ${({tokens:e})=>e.core.backgroundAccentPrimary};
    box-sizing: border-box;
    -webkit-appearance: none;
    -moz-appearance: textfield;
    padding: 0px;
    border: none;
    outline: none;
    appearance: none;
    resize: none;
    overflow: hidden;
  }
`;var O=function(e,t,i,n){var o=arguments.length,r=o<3?t:n===null?n=Object.getOwnPropertyDescriptor(t,i):n,s;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")r=Reflect.decorate(e,t,i,n);else for(var c=e.length-1;c>=0;c--)(s=e[c])&&(r=(o<3?s(r):o>3?s(t,i,r):s(t,i))||r);return o>3&&r&&Object.defineProperty(t,i,r),r},E=class extends p{constructor(){super(...arguments),this.inputElementRef=K(),this.instructionElementRef=K(),this.readOnly=!1,this.instructionHidden=!!this.value,this.pasting=!1,this.onDebouncedSearch=A.debounce(async t=>{if(!t.length){this.setReceiverAddress("");return}let i=w.state.activeChain;if(A.isAddress(t,i)){this.setReceiverAddress(t);return}try{let o=await _.getEnsAddress(t);if(o){a.setReceiverProfileName(t),a.setReceiverAddress(o);let r=await _.getEnsAvatar(t);a.setReceiverProfileImageUrl(r||void 0)}}catch{this.setReceiverAddress(t)}finally{a.setLoading(!1)}})}firstUpdated(){this.value&&(this.instructionHidden=!0),this.checkHidden()}render(){return this.readOnly?l` <wui-flex
        flexDirection="column"
        justifyContent="center"
        gap="01"
        .padding=${["8","4","5","4"]}
      >
        <textarea
          spellcheck="false"
          ?disabled=${!0}
          autocomplete="off"
          .value=${this.value??""}
        ></textarea>
      </wui-flex>`:l` <wui-flex
      @click=${this.onBoxClick.bind(this)}
      flexDirection="column"
      justifyContent="center"
      gap="01"
      .padding=${["8","4","5","4"]}
    >
      <wui-text
        ${G(this.instructionElementRef)}
        class="instruction"
        color="secondary"
        variant="md-medium"
      >
        Type or
        <wui-button
          class="paste"
          size="md"
          variant="neutral-secondary"
          iconLeft="copy"
          @click=${this.onPasteClick.bind(this)}
        >
          <wui-icon size="sm" color="inherit" slot="iconLeft" name="copy"></wui-icon>
          Paste
        </wui-button>
        address
      </wui-text>
      <textarea
        spellcheck="false"
        ?disabled=${!this.instructionHidden}
        ${G(this.inputElementRef)}
        @input=${this.onInputChange.bind(this)}
        @blur=${this.onBlur.bind(this)}
        .value=${this.value??""}
        autocomplete="off"
      ></textarea>
    </wui-flex>`}async focusInput(){this.instructionElementRef.value&&(this.instructionHidden=!0,await this.toggleInstructionFocus(!1),this.instructionElementRef.value.style.pointerEvents="none",this.inputElementRef.value?.focus(),this.inputElementRef.value&&(this.inputElementRef.value.selectionStart=this.inputElementRef.value.selectionEnd=this.inputElementRef.value.value.length))}async focusInstruction(){this.instructionElementRef.value&&(this.instructionHidden=!1,await this.toggleInstructionFocus(!0),this.instructionElementRef.value.style.pointerEvents="auto",this.inputElementRef.value?.blur())}async toggleInstructionFocus(t){this.instructionElementRef.value&&await this.instructionElementRef.value.animate([{opacity:t?0:1},{opacity:t?1:0}],{duration:100,easing:"ease",fill:"forwards"}).finished}onBoxClick(){!this.value&&!this.instructionHidden&&this.focusInput()}onBlur(){!this.value&&this.instructionHidden&&!this.pasting&&this.focusInstruction()}checkHidden(){this.instructionHidden&&this.focusInput()}async onPasteClick(){this.pasting=!0;let t=await navigator.clipboard.readText();a.setReceiverAddress(t),this.focusInput()}onInputChange(t){let i=t.target;this.pasting=!1,this.value=t.target?.value,i.value&&!this.instructionHidden&&this.focusInput(),a.setLoading(!0),this.onDebouncedSearch(i.value)}setReceiverAddress(t){a.setReceiverAddress(t),a.setReceiverProfileName(void 0),a.setReceiverProfileImageUrl(void 0),a.setLoading(!1)}};E.styles=te;O([d()],E.prototype,"value",void 0);O([d({type:Boolean})],E.prototype,"readOnly",void 0);O([u()],E.prototype,"instructionHidden",void 0);O([u()],E.prototype,"pasting",void 0);E=O([f("w3m-input-address")],E);var ie=m`
  :host {
    width: 100%;
    height: 100px;
    border-radius: ${({borderRadius:e})=>e[5]};
    border: 1px solid ${({tokens:e})=>e.theme.foregroundPrimary};
    background-color: ${({tokens:e})=>e.theme.foregroundPrimary};
    transition: background-color ${({durations:e})=>e.lg}
      ${({easings:e})=>e["ease-out-power-1"]};
    will-change: background-color;
    transition: all ${({easings:e})=>e["ease-out-power-1"]}
      ${({durations:e})=>e.lg};
  }

  :host(:hover) {
    background-color: ${({tokens:e})=>e.theme.foregroundSecondary};
  }

  wui-flex {
    width: 100%;
    height: fit-content;
  }

  wui-button {
    width: 100%;
    display: flex;
    justify-content: flex-end;
  }

  wui-input-amount {
    mask-image: linear-gradient(
      270deg,
      transparent 0px,
      transparent 8px,
      black 24px,
      black 25px,
      black 32px,
      black 100%
    );
  }

  .totalValue {
    width: 100%;
  }
`;var N=function(e,t,i,n){var o=arguments.length,r=o<3?t:n===null?n=Object.getOwnPropertyDescriptor(t,i):n,s;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")r=Reflect.decorate(e,t,i,n);else for(var c=e.length-1;c>=0;c--)(s=e[c])&&(r=(o<3?s(r):o>3?s(t,i,r):s(t,i))||r);return o>3&&r&&Object.defineProperty(t,i,r),r},C=class extends p{constructor(){super(...arguments),this.readOnly=!1,this.isInsufficientBalance=!1}render(){let t=this.readOnly||!this.token;return l` <wui-flex
      flexDirection="column"
      gap="01"
      .padding=${["5","3","4","3"]}
    >
      <wui-flex alignItems="center">
        <wui-input-amount
          @inputChange=${this.onInputChange.bind(this)}
          ?disabled=${t}
          .value=${this.sendTokenAmount??""}
          ?error=${!!this.isInsufficientBalance}
        ></wui-input-amount>
        ${this.buttonTemplate()}
      </wui-flex>
      ${this.bottomTemplate()}
    </wui-flex>`}buttonTemplate(){return this.token?l`<wui-token-button
        text=${this.token.symbol}
        imageSrc=${this.token.iconUrl}
        @click=${this.handleSelectButtonClick.bind(this)}
      >
      </wui-token-button>`:l`<wui-button
      size="md"
      variant="neutral-secondary"
      @click=${this.handleSelectButtonClick.bind(this)}
      >Select token</wui-button
    >`}handleSelectButtonClick(){this.readOnly||h.push("WalletSendSelectToken")}sendValueTemplate(){if(!this.readOnly&&this.token&&this.sendTokenAmount){let i=this.token.price*Number(this.sendTokenAmount);return l`<wui-text class="totalValue" variant="sm-regular" color="secondary"
        >${i?`$${S.formatNumberToLocalString(i,2)}`:"Incorrect value"}</wui-text
      >`}return null}maxAmountTemplate(){return this.token?l` <wui-text variant="sm-regular" color="secondary">
        ${$.roundNumber(Number(this.token.quantity.numeric),6,5)}
      </wui-text>`:null}actionTemplate(){return this.token?l`<wui-link @click=${this.onMaxClick.bind(this)}>Max</wui-link>`:null}bottomTemplate(){return this.readOnly?null:l`<wui-flex alignItems="center" justifyContent="space-between">
      ${this.sendValueTemplate()}
      <wui-flex alignItems="center" gap="01" justifyContent="flex-end">
        ${this.maxAmountTemplate()} ${this.actionTemplate()}
      </wui-flex>
    </wui-flex>`}onInputChange(t){a.setTokenAmount(String(t.detail))}onMaxClick(){if(this.token){let t=Number(this.token.quantity.decimals),i=S.bigNumber(this.token.quantity.numeric);if(!this.token.address&&this.gasPrice){let o=65000n*BigInt(this.gasPrice),r=S.bigNumber(o.toString()).div(S.bigNumber(10).pow(t)),s=i.minus(r);a.setTokenAmount(s.gt(0)?s.toFixed(t,0):"0")}else a.setTokenAmount(i.toFixed(t,0))}}};C.styles=ie;N([d({type:Object})],C.prototype,"token",void 0);N([d({type:Boolean})],C.prototype,"readOnly",void 0);N([d({type:String})],C.prototype,"sendTokenAmount",void 0);N([d({type:Boolean})],C.prototype,"isInsufficientBalance",void 0);N([d({type:String})],C.prototype,"gasPrice",void 0);C=N([f("w3m-input-token")],C);var re=m`
  :host {
    display: block;
  }

  wui-flex {
    position: relative;
  }

  wui-icon-box {
    width: 32px;
    height: 32px;
    border-radius: ${({borderRadius:e})=>e[10]} !important;
    border: 4px solid ${({tokens:e})=>e.theme.backgroundPrimary};
    background: ${({tokens:e})=>e.theme.foregroundPrimary};
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 3;
  }

  wui-button {
    --local-border-radius: ${({borderRadius:e})=>e[4]} !important;
  }

  .inputContainer {
    height: fit-content;
  }
`;var k=function(e,t,i,n){var o=arguments.length,r=o<3?t:n===null?n=Object.getOwnPropertyDescriptor(t,i):n,s;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")r=Reflect.decorate(e,t,i,n);else for(var c=e.length-1;c>=0;c--)(s=e[c])&&(r=(o<3?s(r):o>3?s(t,i,r):s(t,i))||r);return o>3&&r&&Object.defineProperty(t,i,r),r},v={INSUFFICIENT_FUNDS:"Insufficient Funds",INCORRECT_VALUE:"Incorrect Value",INVALID_ADDRESS:"Invalid Address",ADD_ADDRESS:"Add Address",ADD_AMOUNT:"Add Amount",SELECT_TOKEN:"Select Token",PREVIEW_SEND:"Preview Send"},g=class extends p{constructor(){super(),this.unsubscribe=[],this.isTryingToChooseDifferentWallet=!1,this.token=a.state.token,this.sendTokenAmount=a.state.sendTokenAmount,this.receiverAddress=a.state.receiverAddress,this.receiverProfileName=a.state.receiverProfileName,this.loading=a.state.loading,this.params=h.state.data?.send,this.caipAddress=w.getAccountData()?.caipAddress,this.disconnecting=!1,this.gasFee=T.state.gasFee,this.token&&!this.params&&(this.fetchBalances(),this.fetchNetworkPrice());let t=w.subscribeKey("activeCaipAddress",i=>{!i&&this.isTryingToChooseDifferentWallet&&(this.isTryingToChooseDifferentWallet=!1,W.open({view:"Connect",data:{redirectView:"WalletSend"}}).catch(()=>null),t())});this.unsubscribe.push(w.subscribeAccountStateProp("caipAddress",i=>{this.caipAddress=i}),a.subscribe(i=>{this.token=i.token,this.sendTokenAmount=i.sendTokenAmount,this.receiverAddress=i.receiverAddress,this.receiverProfileName=i.receiverProfileName,this.loading=i.loading}),T.subscribeKey("gasFee",i=>{this.gasFee=i}))}disconnectedCallback(){this.unsubscribe.forEach(t=>t())}async firstUpdated(){await this.handleSendParameters()}render(){let t=this.getMessage(),i=!!this.params;return l` <wui-flex flexDirection="column" .padding=${["0","4","4","4"]}>
      <wui-flex class="inputContainer" gap="2" flexDirection="column">
        <w3m-input-token
          .token=${this.token}
          .sendTokenAmount=${this.sendTokenAmount}
          .gasPrice=${this.gasFee}
          ?readOnly=${i}
          ?isInsufficientBalance=${t===v.INSUFFICIENT_FUNDS}
        ></w3m-input-token>
        <wui-icon-box size="md" variant="secondary" icon="arrowBottom"></wui-icon-box>
        <w3m-input-address
          ?readOnly=${i}
          .value=${this.receiverProfileName?this.receiverProfileName:this.receiverAddress}
        ></w3m-input-address>
      </wui-flex>
      ${this.buttonTemplate(t)}
    </wui-flex>`}async fetchBalances(){await a.fetchTokenBalance(),a.fetchNetworkBalance()}async fetchNetworkPrice(){await T.getNetworkTokenPrice(),await T.getInitialGasPrice()}onButtonClick(){h.push("WalletSendPreview",{send:this.params})}onFundWalletClick(){h.push("FundWallet",{redirectView:"WalletSend"})}async onConnectDifferentWalletClick(){try{this.isTryingToChooseDifferentWallet=!0,this.disconnecting=!0,await _.disconnect()}finally{this.disconnecting=!1}}getMessage(){return this.token?this.sendTokenAmount?this.token.price&&!(Number(this.sendTokenAmount)*this.token.price)?v.INCORRECT_VALUE:S.bigNumber(this.sendTokenAmount).gt(this.token.quantity.numeric)?v.INSUFFICIENT_FUNDS:this.receiverAddress?A.isAddress(this.receiverAddress,w.state.activeChain)?v.PREVIEW_SEND:v.INVALID_ADDRESS:v.ADD_ADDRESS:v.ADD_AMOUNT:v.SELECT_TOKEN}buttonTemplate(t){let i=!t.startsWith(v.PREVIEW_SEND),n=t===v.INSUFFICIENT_FUNDS,o=!!this.params;return n&&!o?l`
        <wui-flex .margin=${["4","0","0","0"]} flexDirection="column" gap="4">
          <wui-button
            @click=${this.onFundWalletClick.bind(this)}
            size="lg"
            variant="accent-secondary"
            fullWidth
          >
            Fund Wallet
          </wui-button>

          <wui-separator data-testid="wui-separator" text="or"></wui-separator>

          <wui-button
            @click=${this.onConnectDifferentWalletClick.bind(this)}
            size="lg"
            variant="neutral-secondary"
            fullWidth
            ?loading=${this.disconnecting}
          >
            Connect a different wallet
          </wui-button>
        </wui-flex>
      `:l`<wui-flex .margin=${["4","0","0","0"]}>
      <wui-button
        @click=${this.onButtonClick.bind(this)}
        ?disabled=${i}
        size="lg"
        variant="accent-primary"
        ?loading=${this.loading}
        fullWidth
      >
        ${t}
      </wui-button>
    </wui-flex>`}async handleSendParameters(){if(this.loading=!0,!this.params){this.loading=!1;return}let t=Number(this.params.amount);if(isNaN(t)){b.showError("Invalid amount"),this.loading=!1;return}let{namespace:i,chainId:n,assetAddress:o}=this.params;if(!Q.SEND_PARAMS_SUPPORTED_CHAINS.includes(i)){b.showError(`Chain "${i}" is not supported for send parameters`),this.loading=!1;return}let r=w.getCaipNetworkById(n,i);if(!r){b.showError(`Network with id "${n}" not found`),this.loading=!1;return}try{let{balance:s,name:c,symbol:H,decimals:J}=await Z.fetchERC20Balance({caipAddress:this.caipAddress,assetAddress:o,caipNetwork:r});if(!c||!H||!J||!s){b.showError("Token not found");return}a.setToken({name:c,symbol:H,chainId:r.id.toString(),address:`${r.chainNamespace}:${r.id}:${o}`,value:0,price:0,quantity:{decimals:J.toString(),numeric:s.toString()},iconUrl:U.getTokenImage(H)??""}),a.setTokenAmount(String(t)),a.setReceiverAddress(this.params.to)}catch(s){console.error("Failed to load token information:",s),b.showError("Failed to load token information")}finally{this.loading=!1}}};g.styles=re;k([u()],g.prototype,"token",void 0);k([u()],g.prototype,"sendTokenAmount",void 0);k([u()],g.prototype,"receiverAddress",void 0);k([u()],g.prototype,"receiverProfileName",void 0);k([u()],g.prototype,"loading",void 0);k([u()],g.prototype,"params",void 0);k([u()],g.prototype,"caipAddress",void 0);k([u()],g.prototype,"disconnecting",void 0);k([u()],g.prototype,"gasFee",void 0);g=k([f("w3m-wallet-send-view")],g);var oe=m`
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
`;var B=function(e,t,i,n){var o=arguments.length,r=o<3?t:n===null?n=Object.getOwnPropertyDescriptor(t,i):n,s;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")r=Reflect.decorate(e,t,i,n);else for(var c=e.length-1;c>=0;c--)(s=e[c])&&(r=(o<3?s(r):o>3?s(t,i,r):s(t,i))||r);return o>3&&r&&Object.defineProperty(t,i,r),r},R=class extends p{constructor(){super(),this.unsubscribe=[],this.tokenBalances=a.state.tokenBalances,this.search="",this.onDebouncedSearch=A.debounce(t=>{this.search=t}),this.fetchBalancesAndNetworkPrice(),this.unsubscribe.push(a.subscribe(t=>{this.tokenBalances=t.tokenBalances}))}disconnectedCallback(){this.unsubscribe.forEach(t=>t())}render(){return l`
      <wui-flex flexDirection="column">
        ${this.templateSearchInput()} <wui-separator></wui-separator> ${this.templateTokens()}
      </wui-flex>
    `}async fetchBalancesAndNetworkPrice(){(!this.tokenBalances||this.tokenBalances?.length===0)&&(await this.fetchBalances(),await this.fetchNetworkPrice())}async fetchBalances(){await a.fetchTokenBalance(),a.fetchNetworkBalance()}async fetchNetworkPrice(){await T.getNetworkTokenPrice()}templateSearchInput(){return l`
      <wui-flex gap="2" padding="3">
        <wui-input-text
          @inputChange=${this.onInputChange.bind(this)}
          class="network-search-input"
          size="sm"
          placeholder="Search token"
          icon="search"
        ></wui-input-text>
      </wui-flex>
    `}templateTokens(){return this.tokens=this.tokenBalances?.filter(t=>t.chainId===w.state.activeCaipNetwork?.caipNetworkId),this.search?this.filteredTokens=this.tokenBalances?.filter(t=>t.name.toLowerCase().includes(this.search.toLowerCase())):this.filteredTokens=this.tokens,l`
      <wui-flex
        class="contentContainer"
        flexDirection="column"
        .padding=${["0","3","0","3"]}
      >
        <wui-flex justifyContent="flex-start" .padding=${["4","3","3","3"]}>
          <wui-text variant="md-medium" color="secondary">Your tokens</wui-text>
        </wui-flex>
        <wui-flex flexDirection="column" gap="2">
          ${this.filteredTokens&&this.filteredTokens.length>0?this.filteredTokens.map(t=>l`<wui-list-token
                    @click=${this.handleTokenClick.bind(this,t)}
                    ?clickable=${!0}
                    tokenName=${t.name}
                    tokenImageUrl=${t.iconUrl}
                    tokenAmount=${t.quantity.numeric}
                    tokenValue=${t.value}
                    tokenCurrency=${t.symbol}
                  ></wui-list-token>`):l`<wui-flex
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
                  flexDirection="column"
                >
                  <wui-text variant="lg-medium" align="center" color="primary">
                    No tokens found
                  </wui-text>
                  <wui-text variant="lg-regular" align="center" color="secondary">
                    Your tokens will appear here
                  </wui-text>
                </wui-flex>
                <wui-link @click=${this.onBuyClick.bind(this)}>Buy</wui-link>
              </wui-flex>`}
        </wui-flex>
      </wui-flex>
    `}onBuyClick(){h.push("OnRampProviders")}onInputChange(t){this.onDebouncedSearch(t.detail)}handleTokenClick(t){a.setToken(t),a.setTokenAmount(void 0),h.goBack()}};R.styles=oe;B([u()],R.prototype,"tokenBalances",void 0);B([u()],R.prototype,"tokens",void 0);B([u()],R.prototype,"filteredTokens",void 0);B([u()],R.prototype,"search",void 0);R=B([f("w3m-wallet-send-select-token-view")],R);var ne=m`
  :host {
    height: 32px;
    display: flex;
    align-items: center;
    gap: ${({spacing:e})=>e[1]};
    border-radius: ${({borderRadius:e})=>e[32]};
    background-color: ${({tokens:e})=>e.theme.foregroundPrimary};
    padding: ${({spacing:e})=>e[1]};
    padding-left: ${({spacing:e})=>e[2]};
  }

  wui-avatar,
  wui-image {
    width: 24px;
    height: 24px;
    border-radius: ${({borderRadius:e})=>e[16]};
  }

  wui-icon {
    border-radius: ${({borderRadius:e})=>e[16]};
  }
`;var F=function(e,t,i,n){var o=arguments.length,r=o<3?t:n===null?n=Object.getOwnPropertyDescriptor(t,i):n,s;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")r=Reflect.decorate(e,t,i,n);else for(var c=e.length-1;c>=0;c--)(s=e[c])&&(r=(o<3?s(r):o>3?s(t,i,r):s(t,i))||r);return o>3&&r&&Object.defineProperty(t,i,r),r},P=class extends p{constructor(){super(...arguments),this.text=""}render(){return l`<wui-text variant="lg-regular" color="primary">${this.text}</wui-text>
      ${this.imageTemplate()}`}imageTemplate(){return this.address?l`<wui-avatar address=${this.address} .imageSrc=${this.imageSrc}></wui-avatar>`:this.imageSrc?l`<wui-image src=${this.imageSrc}></wui-image>`:l`<wui-icon size="lg" color="inverse" name="networkPlaceholder"></wui-icon>`}};P.styles=[j,V,ne];F([d({type:String})],P.prototype,"text",void 0);F([d({type:String})],P.prototype,"address",void 0);F([d({type:String})],P.prototype,"imageSrc",void 0);P=F([f("wui-preview-item")],P);var se=m`
  :host {
    display: flex;
    padding: ${({spacing:e})=>e[4]} ${({spacing:e})=>e[3]};
    width: 100%;
    background-color: ${({tokens:e})=>e.theme.foregroundPrimary};
    border-radius: ${({borderRadius:e})=>e[4]};
  }

  wui-image {
    width: 20px;
    height: 20px;
    border-radius: ${({borderRadius:e})=>e[16]};
  }

  wui-icon {
    width: 20px;
    height: 20px;
  }
`;var L=function(e,t,i,n){var o=arguments.length,r=o<3?t:n===null?n=Object.getOwnPropertyDescriptor(t,i):n,s;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")r=Reflect.decorate(e,t,i,n);else for(var c=e.length-1;c>=0;c--)(s=e[c])&&(r=(o<3?s(r):o>3?s(t,i,r):s(t,i))||r);return o>3&&r&&Object.defineProperty(t,i,r),r},I=class extends p{constructor(){super(...arguments),this.imageSrc=void 0,this.textTitle="",this.textValue=void 0}render(){return l`
      <wui-flex justifyContent="space-between" alignItems="center">
        <wui-text variant="lg-regular" color="primary"> ${this.textTitle} </wui-text>
        ${this.templateContent()}
      </wui-flex>
    `}templateContent(){return this.imageSrc?l`<wui-image src=${this.imageSrc} alt=${this.textTitle}></wui-image>`:this.textValue?l` <wui-text variant="md-regular" color="secondary"> ${this.textValue} </wui-text>`:l`<wui-icon size="inherit" color="default" name="networkPlaceholder"></wui-icon>`}};I.styles=[j,V,se];L([d()],I.prototype,"imageSrc",void 0);L([d()],I.prototype,"textTitle",void 0);L([d()],I.prototype,"textValue",void 0);I=L([f("wui-list-content")],I);var ae=m`
  :host {
    display: flex;
    width: auto;
    flex-direction: column;
    gap: ${({spacing:e})=>e[1]};
    border-radius: ${({borderRadius:e})=>e[5]};
    background: ${({tokens:e})=>e.theme.foregroundPrimary};
    padding: ${({spacing:e})=>e[3]} ${({spacing:e})=>e[2]}
      ${({spacing:e})=>e[2]} ${({spacing:e})=>e[2]};
  }

  wui-list-content {
    width: -webkit-fill-available !important;
  }

  wui-text {
    padding: 0 ${({spacing:e})=>e[2]};
  }

  wui-flex {
    margin-top: ${({spacing:e})=>e[2]};
  }

  .network {
    cursor: pointer;
    transition: background-color ${({durations:e})=>e.lg}
      ${({easings:e})=>e["ease-out-power-1"]};
    will-change: background-color;
  }

  .network:focus-visible {
    border: 1px solid ${({tokens:e})=>e.core.textAccentPrimary};
    background-color: ${({tokens:e})=>e.core.glass010};
    -webkit-box-shadow: 0px 0px 0px 4px ${({tokens:e})=>e.core.foregroundAccent010};
    -moz-box-shadow: 0px 0px 0px 4px ${({tokens:e})=>e.core.foregroundAccent010};
    box-shadow: 0px 0px 0px 4px ${({tokens:e})=>e.core.foregroundAccent010};
  }

  .network:hover {
    background-color: ${({tokens:e})=>e.core.glass010};
  }

  .network:active {
    background-color: ${({tokens:e})=>e.core.glass010};
  }
`;var z=function(e,t,i,n){var o=arguments.length,r=o<3?t:n===null?n=Object.getOwnPropertyDescriptor(t,i):n,s;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")r=Reflect.decorate(e,t,i,n);else for(var c=e.length-1;c>=0;c--)(s=e[c])&&(r=(o<3?s(r):o>3?s(t,i,r):s(t,i))||r);return o>3&&r&&Object.defineProperty(t,i,r),r},D=class extends p{constructor(){super(...arguments),this.params=h.state.data?.send}render(){return l` <wui-text variant="sm-regular" color="secondary">Details</wui-text>
      <wui-flex flexDirection="column" gap="1">
        <wui-list-content
          textTitle="Address"
          textValue=${$.getTruncateString({string:this.receiverAddress??"",charsStart:4,charsEnd:4,truncate:"middle"})}
        >
        </wui-list-content>
        ${this.networkTemplate()}
      </wui-flex>`}networkTemplate(){return this.caipNetwork?.name?l` <wui-list-content
        @click=${()=>this.onNetworkClick(this.caipNetwork)}
        class="network"
        textTitle="Network"
        imageSrc=${ee(U.getNetworkImage(this.caipNetwork))}
      ></wui-list-content>`:null}onNetworkClick(t){t&&!this.params&&h.push("Networks",{network:t})}};D.styles=ae;z([d()],D.prototype,"receiverAddress",void 0);z([d({type:Object})],D.prototype,"caipNetwork",void 0);z([u()],D.prototype,"params",void 0);D=z([f("w3m-wallet-send-details")],D);var le=m`
  wui-avatar,
  wui-image {
    display: ruby;
    width: 32px;
    height: 32px;
    border-radius: ${({borderRadius:e})=>e[20]};
  }

  .sendButton {
    width: 70%;
    --local-width: 100% !important;
    --local-border-radius: ${({borderRadius:e})=>e[4]} !important;
  }

  .cancelButton {
    width: 30%;
    --local-width: 100% !important;
    --local-border-radius: ${({borderRadius:e})=>e[4]} !important;
  }
`;var y=function(e,t,i,n){var o=arguments.length,r=o<3?t:n===null?n=Object.getOwnPropertyDescriptor(t,i):n,s;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")r=Reflect.decorate(e,t,i,n);else for(var c=e.length-1;c>=0;c--)(s=e[c])&&(r=(o<3?s(r):o>3?s(t,i,r):s(t,i))||r);return o>3&&r&&Object.defineProperty(t,i,r),r},x=class extends p{constructor(){super(),this.unsubscribe=[],this.token=a.state.token,this.sendTokenAmount=a.state.sendTokenAmount,this.receiverAddress=a.state.receiverAddress,this.receiverProfileName=a.state.receiverProfileName,this.receiverProfileImageUrl=a.state.receiverProfileImageUrl,this.caipNetwork=w.state.activeCaipNetwork,this.loading=a.state.loading,this.params=h.state.data?.send,this.unsubscribe.push(a.subscribe(t=>{this.token=t.token,this.sendTokenAmount=t.sendTokenAmount,this.receiverAddress=t.receiverAddress,this.receiverProfileName=t.receiverProfileName,this.receiverProfileImageUrl=t.receiverProfileImageUrl,this.loading=t.loading}),w.subscribeKey("activeCaipNetwork",t=>this.caipNetwork=t))}disconnectedCallback(){this.unsubscribe.forEach(t=>t())}render(){return l` <wui-flex flexDirection="column" .padding=${["0","4","4","4"]}>
      <wui-flex gap="2" flexDirection="column" .padding=${["0","2","0","2"]}>
        <wui-flex alignItems="center" justifyContent="space-between">
          <wui-flex flexDirection="column" gap="01">
            <wui-text variant="sm-regular" color="secondary">Send</wui-text>
            ${this.sendValueTemplate()}
          </wui-flex>
          <wui-preview-item
            text="${this.sendTokenAmount?$.roundNumber(Number(this.sendTokenAmount),6,5):"unknown"} ${this.token?.symbol}"
            .imageSrc=${this.token?.iconUrl}
          ></wui-preview-item>
        </wui-flex>
        <wui-flex>
          <wui-icon color="default" size="md" name="arrowBottom"></wui-icon>
        </wui-flex>
        <wui-flex alignItems="center" justifyContent="space-between">
          <wui-text variant="sm-regular" color="secondary">To</wui-text>
          <wui-preview-item
            text="${this.receiverProfileName?$.getTruncateString({string:this.receiverProfileName,charsStart:20,charsEnd:0,truncate:"end"}):$.getTruncateString({string:this.receiverAddress?this.receiverAddress:"",charsStart:4,charsEnd:4,truncate:"middle"})}"
            address=${this.receiverAddress??""}
            .imageSrc=${this.receiverProfileImageUrl??void 0}
            .isAddress=${!0}
          ></wui-preview-item>
        </wui-flex>
      </wui-flex>
      <wui-flex flexDirection="column" .padding=${["6","0","0","0"]}>
        <w3m-wallet-send-details
          .caipNetwork=${this.caipNetwork}
          .receiverAddress=${this.receiverAddress}
        ></w3m-wallet-send-details>
        <wui-flex justifyContent="center" gap="1" .padding=${["3","0","0","0"]}>
          <wui-icon size="sm" color="default" name="warningCircle"></wui-icon>
          <wui-text variant="sm-regular" color="secondary">Review transaction carefully</wui-text>
        </wui-flex>
        <wui-flex justifyContent="center" gap="3" .padding=${["4","0","0","0"]}>
          <wui-button
            class="cancelButton"
            @click=${this.onCancelClick.bind(this)}
            size="lg"
            variant="neutral-secondary"
          >
            Cancel
          </wui-button>
          <wui-button
            class="sendButton"
            @click=${this.onSendClick.bind(this)}
            size="lg"
            variant="accent-primary"
            .loading=${this.loading}
          >
            Send
          </wui-button>
        </wui-flex>
      </wui-flex></wui-flex
    >`}sendValueTemplate(){if(!this.params&&this.token&&this.sendTokenAmount){let i=this.token.price*Number(this.sendTokenAmount);return l`<wui-text variant="md-regular" color="primary"
        >$${i.toFixed(2)}</wui-text
      >`}return null}async onSendClick(){if(!this.sendTokenAmount||!this.receiverAddress){b.showError("Please enter a valid amount and receiver address");return}try{await a.sendToken(),this.params?h.reset("WalletSendConfirmed"):(b.showSuccess("Transaction started"),h.replace("Account"))}catch(t){let i="Failed to send transaction",n=t instanceof q&&t.originalName===M.PROVIDER_RPC_ERROR_NAME.USER_REJECTED_REQUEST,o=t instanceof q&&t.originalName===M.PROVIDER_RPC_ERROR_NAME.SEND_TRANSACTION_ERROR;(n||o)&&(i=t.message),X.sendEvent({type:"track",event:n?"SEND_REJECTED":"SEND_ERROR",properties:a.getSdkEventProperties(t)}),b.showError(i)}}onCancelClick(){h.goBack()}};x.styles=le;y([u()],x.prototype,"token",void 0);y([u()],x.prototype,"sendTokenAmount",void 0);y([u()],x.prototype,"receiverAddress",void 0);y([u()],x.prototype,"receiverProfileName",void 0);y([u()],x.prototype,"receiverProfileImageUrl",void 0);y([u()],x.prototype,"caipNetwork",void 0);y([u()],x.prototype,"loading",void 0);y([u()],x.prototype,"params",void 0);x=y([f("w3m-wallet-send-preview-view")],x);var ce=m`
  .icon-box {
    width: 64px;
    height: 64px;
    border-radius: 16px;
    background-color: ${({spacing:e})=>e[16]};
    border: 8px solid ${({tokens:e})=>e.theme.borderPrimary};
    border-radius: ${({borderRadius:e})=>e.round};
  }
`;var ue=function(e,t,i,n){var o=arguments.length,r=o<3?t:n===null?n=Object.getOwnPropertyDescriptor(t,i):n,s;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")r=Reflect.decorate(e,t,i,n);else for(var c=e.length-1;c>=0;c--)(s=e[c])&&(r=(o<3?s(r):o>3?s(t,i,r):s(t,i))||r);return o>3&&r&&Object.defineProperty(t,i,r),r},Y=class extends p{constructor(){super(),this.unsubscribe=[],this.unsubscribe.push()}render(){return l`
      <wui-flex
        flexDirection="column"
        alignItems="center"
        gap="4"
        .padding="${["1","3","4","3"]}"
      >
        <wui-flex justifyContent="center" alignItems="center" class="icon-box">
          <wui-icon size="xxl" color="success" name="checkmark"></wui-icon>
        </wui-flex>

        <wui-text variant="h6-medium" color="primary">You successfully sent asset</wui-text>

        <wui-button
          fullWidth
          @click=${this.onCloseClick.bind(this)}
          size="lg"
          variant="neutral-secondary"
        >
          Close
        </wui-button>
      </wui-flex>
    `}onCloseClick(){W.close()}};Y.styles=ce;Y=ue([f("w3m-send-confirmed-view")],Y);export{Y as W3mSendConfirmedView,R as W3mSendSelectTokenView,x as W3mWalletSendPreviewView,g as W3mWalletSendView};
