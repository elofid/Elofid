import{a as b,b as m,c as f,h as J}from"./chunk-VRWQ57HX.js";import{c as P}from"./chunk-HX3PCGE2.js";import{C as y,D as _e,E as I,I as Z,J as Ue,K as Re,M as x,s as le,t as ve,w as l}from"./chunk-L6OIOM3D.js";import{G as Te,H as X,I as _,N as S,P as z,T as W,V as C,Y as ce,a as Ie,b as Ne,ca as v,d as Pe,da as Ce,f as k,fa as ke,h as w,ia as h,j as Se,ka as L,m as g,x as T}from"./chunk-Z6Y4EM3A.js";var $e=I`
  :host {
    position: relative;
  }

  button {
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: transparent;
    padding: ${({spacing:t})=>t[1]};
  }

  /* -- Colors --------------------------------------------------- */
  button[data-type='accent'] wui-icon {
    color: ${({tokens:t})=>t.core.iconAccentPrimary};
  }

  button[data-type='neutral'][data-variant='primary'] wui-icon {
    color: ${({tokens:t})=>t.theme.iconInverse};
  }

  button[data-type='neutral'][data-variant='secondary'] wui-icon {
    color: ${({tokens:t})=>t.theme.iconDefault};
  }

  button[data-type='success'] wui-icon {
    color: ${({tokens:t})=>t.core.iconSuccess};
  }

  button[data-type='error'] wui-icon {
    color: ${({tokens:t})=>t.core.iconError};
  }

  /* -- Sizes --------------------------------------------------- */
  button[data-size='xs'] {
    width: 16px;
    height: 16px;

    border-radius: ${({borderRadius:t})=>t[1]};
  }

  button[data-size='sm'] {
    width: 20px;
    height: 20px;
    border-radius: ${({borderRadius:t})=>t[1]};
  }

  button[data-size='md'] {
    width: 24px;
    height: 24px;
    border-radius: ${({borderRadius:t})=>t[2]};
  }

  button[data-size='lg'] {
    width: 28px;
    height: 28px;
    border-radius: ${({borderRadius:t})=>t[2]};
  }

  button[data-size='xs'] wui-icon {
    width: 8px;
    height: 8px;
  }

  button[data-size='sm'] wui-icon {
    width: 12px;
    height: 12px;
  }

  button[data-size='md'] wui-icon {
    width: 16px;
    height: 16px;
  }

  button[data-size='lg'] wui-icon {
    width: 20px;
    height: 20px;
  }

  /* -- Hover --------------------------------------------------- */
  @media (hover: hover) {
    button[data-type='accent']:hover:enabled {
      background-color: ${({tokens:t})=>t.core.foregroundAccent010};
    }

    button[data-variant='primary'][data-type='neutral']:hover:enabled {
      background-color: ${({tokens:t})=>t.theme.foregroundSecondary};
    }

    button[data-variant='secondary'][data-type='neutral']:hover:enabled {
      background-color: ${({tokens:t})=>t.theme.foregroundSecondary};
    }

    button[data-type='success']:hover:enabled {
      background-color: ${({tokens:t})=>t.core.backgroundSuccess};
    }

    button[data-type='error']:hover:enabled {
      background-color: ${({tokens:t})=>t.core.backgroundError};
    }
  }

  /* -- Focus --------------------------------------------------- */
  button:focus-visible {
    box-shadow: 0 0 0 4px ${({tokens:t})=>t.core.foregroundAccent020};
  }

  /* -- Properties --------------------------------------------------- */
  button[data-full-width='true'] {
    width: 100%;
  }

  :host([fullWidth]) {
    width: 100%;
  }

  button[disabled] {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;var q=function(t,e,n,r){var s=arguments.length,i=s<3?e:r===null?r=Object.getOwnPropertyDescriptor(e,n):r,a;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")i=Reflect.decorate(t,e,n,r);else for(var u=t.length-1;u>=0;u--)(a=t[u])&&(i=(s<3?a(i):s>3?a(e,n,i):a(e,n))||i);return s>3&&i&&Object.defineProperty(e,n,i),i},R=class extends y{constructor(){super(...arguments),this.icon="card",this.variant="primary",this.type="accent",this.size="md",this.iconSize=void 0,this.fullWidth=!1,this.disabled=!1}render(){return l`<button
      data-variant=${this.variant}
      data-type=${this.type}
      data-size=${this.size}
      data-full-width=${this.fullWidth}
      ?disabled=${this.disabled}
    >
      <wui-icon color="inherit" name=${this.icon} size=${f(this.iconSize)}></wui-icon>
    </button>`}};R.styles=[Z,Ue,$e];q([b()],R.prototype,"icon",void 0);q([b()],R.prototype,"variant",void 0);q([b()],R.prototype,"type",void 0);q([b()],R.prototype,"size",void 0);q([b()],R.prototype,"iconSize",void 0);q([b({type:Boolean})],R.prototype,"fullWidth",void 0);q([b({type:Boolean})],R.prototype,"disabled",void 0);R=q([x("wui-icon-button")],R);var p={INVALID_PAYMENT_CONFIG:"INVALID_PAYMENT_CONFIG",INVALID_RECIPIENT:"INVALID_RECIPIENT",INVALID_ASSET:"INVALID_ASSET",INVALID_AMOUNT:"INVALID_AMOUNT",UNKNOWN_ERROR:"UNKNOWN_ERROR",UNABLE_TO_INITIATE_PAYMENT:"UNABLE_TO_INITIATE_PAYMENT",INVALID_CHAIN_NAMESPACE:"INVALID_CHAIN_NAMESPACE",GENERIC_PAYMENT_ERROR:"GENERIC_PAYMENT_ERROR",UNABLE_TO_GET_EXCHANGES:"UNABLE_TO_GET_EXCHANGES",ASSET_NOT_SUPPORTED:"ASSET_NOT_SUPPORTED",UNABLE_TO_GET_PAY_URL:"UNABLE_TO_GET_PAY_URL",UNABLE_TO_GET_BUY_STATUS:"UNABLE_TO_GET_BUY_STATUS",UNABLE_TO_GET_TOKEN_BALANCES:"UNABLE_TO_GET_TOKEN_BALANCES",UNABLE_TO_GET_QUOTE:"UNABLE_TO_GET_QUOTE",UNABLE_TO_GET_QUOTE_STATUS:"UNABLE_TO_GET_QUOTE_STATUS",INVALID_RECIPIENT_ADDRESS_FOR_ASSET:"INVALID_RECIPIENT_ADDRESS_FOR_ASSET"},D={[p.INVALID_PAYMENT_CONFIG]:"Invalid payment configuration",[p.INVALID_RECIPIENT]:"Invalid recipient address",[p.INVALID_ASSET]:"Invalid asset specified",[p.INVALID_AMOUNT]:"Invalid payment amount",[p.INVALID_RECIPIENT_ADDRESS_FOR_ASSET]:"Invalid recipient address for the asset selected",[p.UNKNOWN_ERROR]:"Unknown payment error occurred",[p.UNABLE_TO_INITIATE_PAYMENT]:"Unable to initiate payment",[p.INVALID_CHAIN_NAMESPACE]:"Invalid chain namespace",[p.GENERIC_PAYMENT_ERROR]:"Unable to process payment",[p.UNABLE_TO_GET_EXCHANGES]:"Unable to get exchanges",[p.ASSET_NOT_SUPPORTED]:"Asset not supported by the selected exchange",[p.UNABLE_TO_GET_PAY_URL]:"Unable to get payment URL",[p.UNABLE_TO_GET_BUY_STATUS]:"Unable to get buy status",[p.UNABLE_TO_GET_TOKEN_BALANCES]:"Unable to get token balances",[p.UNABLE_TO_GET_QUOTE]:"Unable to get quote. Please choose a different token",[p.UNABLE_TO_GET_QUOTE_STATUS]:"Unable to get quote status"},d=class t extends Error{get message(){return D[this.code]}constructor(e,n){super(D[e]),this.name="AppKitPayError",this.code=e,this.details=n,Error.captureStackTrace&&Error.captureStackTrace(this,t)}};var Oe="https://rpc.walletconnect.org/v1/json-rpc",ue="reown_test";function De(){let{chainNamespace:t}=g.parseCaipNetworkId(c.state.paymentAsset.network);if(!T.isAddress(c.state.recipient,t))throw new d(p.INVALID_RECIPIENT_ADDRESS_FOR_ASSET,`Provide valid recipient address for namespace "${t}"`)}async function Le(t,e,n){if(e!==k.CHAIN.EVM)throw new d(p.INVALID_CHAIN_NAMESPACE);if(!n.fromAddress)throw new d(p.INVALID_PAYMENT_CONFIG,"fromAddress is required for native EVM payments.");let r=typeof n.amount=="string"?parseFloat(n.amount):n.amount;if(isNaN(r))throw new d(p.INVALID_PAYMENT_CONFIG);let s=t.metadata?.decimals??18,i=v.parseUnits(r.toString(),s);if(typeof i!="bigint")throw new d(p.GENERIC_PAYMENT_ERROR);return await v.sendTransaction({chainNamespace:e,to:n.recipient,address:n.fromAddress,value:i,data:"0x"})??void 0}async function qe(t,e){if(!e.fromAddress)throw new d(p.INVALID_PAYMENT_CONFIG,"fromAddress is required for ERC20 EVM payments.");let n=t.asset,r=e.recipient,s=Number(t.metadata.decimals),i=v.parseUnits(e.amount.toString(),s);if(i===void 0)throw new d(p.GENERIC_PAYMENT_ERROR);return await v.writeContract({fromAddress:e.fromAddress,tokenAddress:n,args:[r,i],method:"transfer",abi:Se.getERC20Abi(n),chainNamespace:k.CHAIN.EVM})??void 0}async function Fe(t,e){if(t!==k.CHAIN.SOLANA)throw new d(p.INVALID_CHAIN_NAMESPACE);if(!e.fromAddress)throw new d(p.INVALID_PAYMENT_CONFIG,"fromAddress is required for Solana payments.");let n=typeof e.amount=="string"?parseFloat(e.amount):e.amount;if(isNaN(n)||n<=0)throw new d(p.INVALID_PAYMENT_CONFIG,"Invalid payment amount.");try{if(!ke.getProvider(t))throw new d(p.GENERIC_PAYMENT_ERROR,"No Solana provider available.");let s=await v.sendTransaction({chainNamespace:k.CHAIN.SOLANA,to:e.recipient,value:n,tokenMint:e.tokenMint});if(!s)throw new d(p.GENERIC_PAYMENT_ERROR,"Transaction failed.");return s}catch(r){throw r instanceof d?r:new d(p.GENERIC_PAYMENT_ERROR,`Solana payment failed: ${r}`)}}async function Be({sourceToken:t,toToken:e,amount:n,recipient:r}){let s=v.parseUnits(n,t.metadata.decimals),i=v.parseUnits(n,e.metadata.decimals);return Promise.resolve({type:ee,origin:{amount:s?.toString()??"0",currency:t},destination:{amount:i?.toString()??"0",currency:e},fees:[{id:"service",label:"Service Fee",amount:"0",currency:e}],steps:[{requestId:ee,type:"deposit",deposit:{amount:s?.toString()??"0",currency:t.asset,receiver:r}}],timeInSeconds:6})}function K(t){if(!t)return null;let e=t.steps[0];return!e||e.type!==Me?null:e}function te(t,e=0){if(!t)return[];let n=t.steps.filter(s=>s.type===We),r=n.filter((s,i)=>i+1>e);return n.length>0&&n.length<3?r:[]}var de=new Te({baseUrl:T.getApiUrl(),clientId:null}),pe=class extends Error{};function pt(){let t=X.getSnapshot().projectId;return`${Oe}?projectId=${t}`}function me(){let{projectId:t,sdkType:e,sdkVersion:n}=X.state;return{projectId:t,st:e||"appkit",sv:n||"html-wagmi-4.2.2"}}async function he(t,e){let n=pt(),{sdkType:r,sdkVersion:s,projectId:i}=X.getSnapshot(),a={jsonrpc:"2.0",id:1,method:t,params:{...e||{},st:r,sv:s,projectId:i}},A=await(await fetch(n,{method:"POST",body:JSON.stringify(a),headers:{"Content-Type":"application/json"}})).json();if(A.error)throw new pe(A.error.message);return A}async function fe(t){return(await he("reown_getExchanges",t)).result}async function ge(t){return(await he("reown_getExchangePayUrl",t)).result}async function je(t){return(await he("reown_getExchangeBuyStatus",t)).result}async function dt(t){let e=w.bigNumber(t.amount).times(10**t.toToken.metadata.decimals).toString(),{chainId:n,chainNamespace:r}=g.parseCaipNetworkId(t.sourceToken.network),{chainId:s,chainNamespace:i}=g.parseCaipNetworkId(t.toToken.network),a=t.sourceToken.asset==="native"?ce(r):t.sourceToken.asset,u=t.toToken.asset==="native"?ce(i):t.toToken.asset;return await de.post({path:"/appkit/v1/transfers/quote",body:{user:t.address,originChainId:n.toString(),originCurrency:a,destinationChainId:s.toString(),destinationCurrency:u,recipient:t.recipient,amount:e},params:me()})}async function Ge(t){let e=P.isLowerCaseMatch(t.sourceToken.network,t.toToken.network),n=P.isLowerCaseMatch(t.sourceToken.asset,t.toToken.asset);return e&&n?Be(t):dt(t)}async function ze(t){return await de.get({path:"/appkit/v1/transfers/status",params:{requestId:t.requestId,...me()}})}async function Qe(t){return await de.get({path:`/appkit/v1/transfers/assets/exchanges/${t}`,params:me()})}var mt=["eip155","solana"],ht={eip155:{native:{assetNamespace:"slip44",assetReference:"60"},defaultTokenNamespace:"erc20"},solana:{native:{assetNamespace:"slip44",assetReference:"501"},defaultTokenNamespace:"token"}},Ye={56:"714",204:"714"};function ne(t,e){let{chainNamespace:n,chainId:r}=g.parseCaipNetworkId(t),s=ht[n];if(!s)throw new Error(`Unsupported chain namespace for CAIP-19 formatting: ${n}`);let i=s.native.assetNamespace,a=s.native.assetReference;return e!=="native"?(i=s.defaultTokenNamespace,a=e):n==="eip155"&&Ye[r]&&(a=Ye[r]),`${`${n}:${r}`}/${i}:${a}`}function Ve(t){let{chainNamespace:e}=g.parseCaipNetworkId(t);return mt.includes(e)}function He(t){let n=h.getAllRequestedCaipNetworks().find(s=>s.caipNetworkId===t.chainId),r=t.address;if(!n)throw new Error(`Target network not found for balance chainId "${t.chainId}"`);if(P.isLowerCaseMatch(t.symbol,n.nativeCurrency.symbol))r="native";else if(T.isCaipAddress(r)){let{address:s}=g.parseCaipAddress(r);r=s}else if(!r)throw new Error(`Balance address not found for balance symbol "${t.symbol}"`);return{network:n.caipNetworkId,asset:r,metadata:{name:t.name,symbol:t.symbol,decimals:Number(t.quantity.decimals),logoURI:t.iconUrl},amount:t.quantity.numeric}}function Ke(t){return{chainId:t.network,address:`${t.network}:${t.asset}`,symbol:t.metadata.symbol,name:t.metadata.name,iconUrl:t.metadata.logoURI||"",price:0,quantity:{numeric:"0",decimals:t.metadata.decimals.toString()}}}function j(t){let e=w.bigNumber(t,{safe:!0});return e.lt(.001)?"<0.001":e.round(4).toString()}function Xe(t){let n=h.getAllRequestedCaipNetworks().find(r=>r.caipNetworkId===t.network);return n?!!n.testnet:!1}var Ze=0,we="unknown",ee="direct-transfer",Me="deposit",We="transaction",o=Ie({paymentAsset:{network:"eip155:1",asset:"0x0",metadata:{name:"0x0",symbol:"0x0",decimals:0}},recipient:"0x0",amount:0,isConfigured:!1,error:null,isPaymentInProgress:!1,exchanges:[],isLoading:!1,openInNewTab:!0,redirectUrl:void 0,payWithExchange:void 0,currentPayment:void 0,analyticsSet:!1,paymentId:void 0,choice:"pay",tokenBalances:{[k.CHAIN.EVM]:[],[k.CHAIN.SOLANA]:[]},isFetchingTokenBalances:!1,selectedPaymentAsset:null,quote:void 0,quoteStatus:"waiting",quoteError:null,isFetchingQuote:!1,selectedExchange:void 0,exchangeUrlForQuote:void 0,requestId:void 0}),c={state:o,subscribe(t){return Ne(o,()=>t(o))},subscribeKey(t,e){return Pe(o,t,e)},async handleOpenPay(t){this.resetState(),this.setPaymentConfig(t),this.initializeAnalytics(),De(),await this.prepareTokenLogo(),o.isConfigured=!0,z.sendEvent({type:"track",event:"PAY_MODAL_OPEN",properties:{exchanges:o.exchanges,configuration:{network:o.paymentAsset.network,asset:o.paymentAsset.asset,recipient:o.recipient,amount:o.amount}}}),await L.open({view:"Pay"})},resetState(){o.paymentAsset={network:"eip155:1",asset:"0x0",metadata:{name:"0x0",symbol:"0x0",decimals:0}},o.recipient="0x0",o.amount=0,o.isConfigured=!1,o.error=null,o.isPaymentInProgress=!1,o.isLoading=!1,o.currentPayment=void 0,o.selectedExchange=void 0,o.exchangeUrlForQuote=void 0,o.requestId=void 0},resetQuoteState(){o.quote=void 0,o.quoteStatus="waiting",o.quoteError=null,o.isFetchingQuote=!1,o.requestId=void 0},setPaymentConfig(t){if(!t.paymentAsset)throw new d(p.INVALID_PAYMENT_CONFIG);try{o.choice=t.choice??"pay",o.paymentAsset=t.paymentAsset,o.recipient=t.recipient,o.amount=t.amount,o.openInNewTab=t.openInNewTab??!0,o.redirectUrl=t.redirectUrl,o.payWithExchange=t.payWithExchange,o.error=null}catch(e){throw new d(p.INVALID_PAYMENT_CONFIG,e.message)}},setSelectedPaymentAsset(t){o.selectedPaymentAsset=t},setSelectedExchange(t){o.selectedExchange=t},setRequestId(t){o.requestId=t},setPaymentInProgress(t){o.isPaymentInProgress=t},getPaymentAsset(){return o.paymentAsset},getExchanges(){return o.exchanges},async fetchExchanges(){try{o.isLoading=!0;let t=await fe({page:Ze});o.exchanges=t.exchanges.slice(0,2)}catch{throw _.showError(D.UNABLE_TO_GET_EXCHANGES),new d(p.UNABLE_TO_GET_EXCHANGES)}finally{o.isLoading=!1}},async getAvailableExchanges(t){try{let e=t?.asset&&t?.network?ne(t.network,t.asset):void 0;return await fe({page:t?.page??Ze,asset:e,amount:t?.amount?.toString()})}catch{throw new d(p.UNABLE_TO_GET_EXCHANGES)}},async getPayUrl(t,e,n=!1){try{let r=Number(e.amount),s=await ge({exchangeId:t,asset:ne(e.network,e.asset),amount:r.toString(),recipient:`${e.network}:${e.recipient}`});return z.sendEvent({type:"track",event:"PAY_EXCHANGE_SELECTED",properties:{source:"pay",exchange:{id:t},configuration:{network:e.network,asset:e.asset,recipient:e.recipient,amount:r},currentPayment:{type:"exchange",exchangeId:t},headless:n}}),n&&(this.initiatePayment(),z.sendEvent({type:"track",event:"PAY_INITIATED",properties:{source:"pay",paymentId:o.paymentId||we,configuration:{network:e.network,asset:e.asset,recipient:e.recipient,amount:r},currentPayment:{type:"exchange",exchangeId:t}}})),s}catch(r){throw r instanceof Error&&r.message.includes("is not supported")?new d(p.ASSET_NOT_SUPPORTED):new Error(r.message)}},async generateExchangeUrlForQuote({exchangeId:t,paymentAsset:e,amount:n,recipient:r}){let s=await ge({exchangeId:t,asset:ne(e.network,e.asset),amount:n.toString(),recipient:r});o.exchangeSessionId=s.sessionId,o.exchangeUrlForQuote=s.url},async openPayUrl(t,e,n=!1){try{let r=await this.getPayUrl(t.exchangeId,e,n);if(!r)throw new d(p.UNABLE_TO_GET_PAY_URL);let i=t.openInNewTab??!0?"_blank":"_self";return T.openHref(r.url,i),r}catch(r){throw r instanceof d?o.error=r.message:o.error=D.GENERIC_PAYMENT_ERROR,new d(p.UNABLE_TO_GET_PAY_URL)}},async onTransfer({chainNamespace:t,fromAddress:e,toAddress:n,amount:r,paymentAsset:s}){if(o.currentPayment={type:"wallet",status:"IN_PROGRESS"},!o.isPaymentInProgress)try{this.initiatePayment();let a=h.getAllRequestedCaipNetworks().find(A=>A.caipNetworkId===s.network);if(!a)throw new Error("Target network not found");let u=h.state.activeCaipNetwork;switch(P.isLowerCaseMatch(u?.caipNetworkId,a.caipNetworkId)||await h.switchActiveNetwork(a),t){case k.CHAIN.EVM:s.asset==="native"&&(o.currentPayment.result=await Le(s,t,{recipient:n,amount:r,fromAddress:e})),s.asset.startsWith("0x")&&(o.currentPayment.result=await qe(s,{recipient:n,amount:r,fromAddress:e})),o.currentPayment.status="SUCCESS";break;case k.CHAIN.SOLANA:o.currentPayment.result=await Fe(t,{recipient:n,amount:r,fromAddress:e,tokenMint:s.asset==="native"?void 0:s.asset}),o.currentPayment.status="SUCCESS";break;default:throw new d(p.INVALID_CHAIN_NAMESPACE)}}catch(i){throw i instanceof d?o.error=i.message:o.error=D.GENERIC_PAYMENT_ERROR,o.currentPayment.status="FAILED",_.showError(o.error),i}finally{o.isPaymentInProgress=!1}},async onSendTransaction(t){try{let{namespace:e,transactionStep:n}=t;c.initiatePayment();let s=h.getAllRequestedCaipNetworks().find(a=>a.caipNetworkId===o.paymentAsset?.network);if(!s)throw new Error("Target network not found");let i=h.state.activeCaipNetwork;if(P.isLowerCaseMatch(i?.caipNetworkId,s.caipNetworkId)||await h.switchActiveNetwork(s),e===k.CHAIN.EVM){let{from:a,to:u,data:A,value:V}=n.transaction;await v.sendTransaction({address:a,to:u,data:A,value:BigInt(V),chainNamespace:e})}else if(e===k.CHAIN.SOLANA){let{instructions:a}=n.transaction;await v.writeSolanaTransaction({instructions:a})}}catch(e){throw e instanceof d?o.error=e.message:o.error=D.GENERIC_PAYMENT_ERROR,_.showError(o.error),e}finally{o.isPaymentInProgress=!1}},getExchangeById(t){return o.exchanges.find(e=>e.id===t)},validatePayConfig(t){let{paymentAsset:e,recipient:n,amount:r}=t;if(!e)throw new d(p.INVALID_PAYMENT_CONFIG);if(!n)throw new d(p.INVALID_RECIPIENT);if(!e.asset)throw new d(p.INVALID_ASSET);if(r==null||r<=0)throw new d(p.INVALID_AMOUNT)},async handlePayWithExchange(t){try{o.currentPayment={type:"exchange",exchangeId:t};let{network:e,asset:n}=o.paymentAsset,r={network:e,asset:n,amount:o.amount,recipient:o.recipient},s=await this.getPayUrl(t,r);if(!s)throw new d(p.UNABLE_TO_INITIATE_PAYMENT);return o.currentPayment.sessionId=s.sessionId,o.currentPayment.status="IN_PROGRESS",o.currentPayment.exchangeId=t,this.initiatePayment(),{url:s.url,openInNewTab:o.openInNewTab}}catch(e){return e instanceof d?o.error=e.message:o.error=D.GENERIC_PAYMENT_ERROR,o.isPaymentInProgress=!1,_.showError(o.error),null}},async getBuyStatus(t,e){try{let n=await je({sessionId:e,exchangeId:t});return(n.status==="SUCCESS"||n.status==="FAILED")&&z.sendEvent({type:"track",event:n.status==="SUCCESS"?"PAY_SUCCESS":"PAY_ERROR",properties:{message:n.status==="FAILED"?T.parseError(o.error):void 0,source:"pay",paymentId:o.paymentId||we,configuration:{network:o.paymentAsset.network,asset:o.paymentAsset.asset,recipient:o.recipient,amount:o.amount},currentPayment:{type:"exchange",exchangeId:o.currentPayment?.exchangeId,sessionId:o.currentPayment?.sessionId,result:n.txHash}}}),n}catch{throw new d(p.UNABLE_TO_GET_BUY_STATUS)}},async fetchTokensFromEOA({caipAddress:t,caipNetwork:e,namespace:n}){if(!t)return[];let{address:r}=g.parseCaipAddress(t),s=e;return n===k.CHAIN.EVM&&(s=void 0),await Ce.getMyTokensWithBalance({address:r,caipNetwork:s})},async fetchTokensFromExchange(){if(!o.selectedExchange)return[];let t=await Qe(o.selectedExchange.id),e=Object.values(t.assets).flat();return await Promise.all(e.map(async r=>{let s=Ke(r),{chainNamespace:i}=g.parseCaipNetworkId(s.chainId),a=s.address;if(T.isCaipAddress(a)){let{address:A}=g.parseCaipAddress(a);a=A}let u=await S.getImageByToken(a??"",i).catch(()=>{});return s.iconUrl=u??"",s}))},async fetchTokens({caipAddress:t,caipNetwork:e,namespace:n}){try{o.isFetchingTokenBalances=!0;let i=await(!!o.selectedExchange?this.fetchTokensFromExchange():this.fetchTokensFromEOA({caipAddress:t,caipNetwork:e,namespace:n}));o.tokenBalances={...o.tokenBalances,[n]:i}}catch(r){let s=r instanceof Error?r.message:"Unable to get token balances";_.showError(s)}finally{o.isFetchingTokenBalances=!1}},async fetchQuote({amount:t,address:e,sourceToken:n,toToken:r,recipient:s}){try{c.resetQuoteState(),o.isFetchingQuote=!0;let i=await Ge({amount:t,address:o.selectedExchange?void 0:e,sourceToken:n,toToken:r,recipient:s});if(o.selectedExchange){let a=K(i);if(a){let u=`${n.network}:${a.deposit.receiver}`,A=w.formatNumber(a.deposit.amount,{decimals:n.metadata.decimals??0,round:8});await c.generateExchangeUrlForQuote({exchangeId:o.selectedExchange.id,paymentAsset:n,amount:A.toString(),recipient:u})}}o.quote=i}catch(i){let a=D.UNABLE_TO_GET_QUOTE;if(i instanceof Error&&i.cause&&i.cause instanceof Response)try{let u=await i.cause.json();u.error&&typeof u.error=="string"&&(a=u.error)}catch{}throw o.quoteError=a,_.showError(a),new d(p.UNABLE_TO_GET_QUOTE)}finally{o.isFetchingQuote=!1}},async fetchQuoteStatus({requestId:t}){try{if(t===ee){let n=o.selectedExchange,r=o.exchangeSessionId;if(n&&r){switch((await this.getBuyStatus(n.id,r)).status){case"IN_PROGRESS":o.quoteStatus="waiting";break;case"SUCCESS":o.quoteStatus="success",o.isPaymentInProgress=!1;break;case"FAILED":o.quoteStatus="failure",o.isPaymentInProgress=!1;break;case"UNKNOWN":o.quoteStatus="waiting";break;default:o.quoteStatus="waiting";break}return}o.quoteStatus="success";return}let{status:e}=await ze({requestId:t});o.quoteStatus=e}catch{throw o.quoteStatus="failure",new d(p.UNABLE_TO_GET_QUOTE_STATUS)}},initiatePayment(){o.isPaymentInProgress=!0,o.paymentId=crypto.randomUUID()},initializeAnalytics(){o.analyticsSet||(o.analyticsSet=!0,this.subscribeKey("isPaymentInProgress",t=>{if(o.currentPayment?.status&&o.currentPayment.status!=="UNKNOWN"){let e={IN_PROGRESS:"PAY_INITIATED",SUCCESS:"PAY_SUCCESS",FAILED:"PAY_ERROR"}[o.currentPayment.status];z.sendEvent({type:"track",event:e,properties:{message:o.currentPayment.status==="FAILED"?T.parseError(o.error):void 0,source:"pay",paymentId:o.paymentId||we,configuration:{network:o.paymentAsset.network,asset:o.paymentAsset.asset,recipient:o.recipient,amount:o.amount},currentPayment:{type:o.currentPayment.type,exchangeId:o.currentPayment.exchangeId,sessionId:o.currentPayment.sessionId,result:o.currentPayment.result}}})}}))},async prepareTokenLogo(){if(!o.paymentAsset.metadata.logoURI)try{let{chainNamespace:t}=g.parseCaipNetworkId(o.paymentAsset.network),e=await S.getImageByToken(o.paymentAsset.asset,t);o.paymentAsset.metadata.logoURI=e}catch{}}};var Je=I`
  wui-separator {
    margin: var(--apkt-spacing-3) calc(var(--apkt-spacing-3) * -1) var(--apkt-spacing-2)
      calc(var(--apkt-spacing-3) * -1);
    width: calc(100% + var(--apkt-spacing-3) * 2);
  }

  .token-display {
    padding: var(--apkt-spacing-3) var(--apkt-spacing-3);
    border-radius: var(--apkt-borderRadius-5);
    background-color: var(--apkt-tokens-theme-backgroundPrimary);
    margin-top: var(--apkt-spacing-3);
    margin-bottom: var(--apkt-spacing-3);
  }

  .token-display wui-text {
    text-transform: none;
  }

  wui-loading-spinner {
    padding: var(--apkt-spacing-2);
  }

  .left-image-container {
    position: relative;
    justify-content: center;
    align-items: center;
  }

  .token-image {
    border-radius: ${({borderRadius:t})=>t.round};
    width: 40px;
    height: 40px;
  }

  .chain-image {
    position: absolute;
    width: 20px;
    height: 20px;
    bottom: -3px;
    right: -5px;
    border-radius: ${({borderRadius:t})=>t.round};
    border: 2px solid ${({tokens:t})=>t.theme.backgroundPrimary};
  }

  .payment-methods-container {
    background-color: ${({tokens:t})=>t.theme.foregroundPrimary};
    border-top-right-radius: ${({borderRadius:t})=>t[8]};
    border-top-left-radius: ${({borderRadius:t})=>t[8]};
  }
`;var F=function(t,e,n,r){var s=arguments.length,i=s<3?e:r===null?r=Object.getOwnPropertyDescriptor(e,n):r,a;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")i=Reflect.decorate(t,e,n,r);else for(var u=t.length-1;u>=0;u--)(a=t[u])&&(i=(s<3?a(i):s>3?a(e,n,i):a(e,n))||i);return s>3&&i&&Object.defineProperty(e,n,i),i},$=class extends y{constructor(){super(),this.unsubscribe=[],this.amount=c.state.amount,this.namespace=void 0,this.paymentAsset=c.state.paymentAsset,this.activeConnectorIds=C.state.activeConnectorIds,this.caipAddress=void 0,this.exchanges=c.state.exchanges,this.isLoading=c.state.isLoading,this.initializeNamespace(),this.unsubscribe.push(c.subscribeKey("amount",e=>this.amount=e)),this.unsubscribe.push(C.subscribeKey("activeConnectorIds",e=>this.activeConnectorIds=e)),this.unsubscribe.push(c.subscribeKey("exchanges",e=>this.exchanges=e)),this.unsubscribe.push(c.subscribeKey("isLoading",e=>this.isLoading=e)),c.fetchExchanges(),c.setSelectedExchange(void 0)}disconnectedCallback(){this.unsubscribe.forEach(e=>e())}render(){return l`
      <wui-flex flexDirection="column">
        ${this.paymentDetailsTemplate()} ${this.paymentMethodsTemplate()}
      </wui-flex>
    `}paymentMethodsTemplate(){return l`
      <wui-flex flexDirection="column" padding="3" gap="2" class="payment-methods-container">
        ${this.payWithWalletTemplate()} ${this.templateSeparator()}
        ${this.templateExchangeOptions()}
      </wui-flex>
    `}initializeNamespace(){let e=h.state.activeChain;this.namespace=e,this.caipAddress=h.getAccountData(e)?.caipAddress,this.unsubscribe.push(h.subscribeChainProp("accountState",n=>{this.caipAddress=n?.caipAddress},e))}paymentDetailsTemplate(){let n=h.getAllRequestedCaipNetworks().find(r=>r.caipNetworkId===this.paymentAsset.network);return l`
      <wui-flex
        alignItems="center"
        justifyContent="space-between"
        .padding=${["6","8","6","8"]}
        gap="2"
      >
        <wui-flex alignItems="center" gap="1">
          <wui-text variant="h1-regular" color="primary">
            ${j(this.amount||"0")}
          </wui-text>

          <wui-flex flexDirection="column">
            <wui-text variant="h6-regular" color="secondary">
              ${this.paymentAsset.metadata.symbol||"Unknown"}
            </wui-text>
            <wui-text variant="md-medium" color="secondary"
              >on ${n?.name||"Unknown"}</wui-text
            >
          </wui-flex>
        </wui-flex>

        <wui-flex class="left-image-container">
          <wui-image
            src=${f(this.paymentAsset.metadata.logoURI)}
            class="token-image"
          ></wui-image>
          <wui-image
            src=${f(S.getNetworkImage(n))}
            class="chain-image"
          ></wui-image>
        </wui-flex>
      </wui-flex>
    `}payWithWalletTemplate(){return Ve(this.paymentAsset.network)?this.caipAddress?this.connectedWalletTemplate():this.disconnectedWalletTemplate():l``}connectedWalletTemplate(){let{name:e,image:n}=this.getWalletProperties({namespace:this.namespace});return l`
      <wui-flex flexDirection="column" gap="3">
        <wui-list-item
          type="secondary"
          boxColor="foregroundSecondary"
          @click=${this.onWalletPayment}
          .boxed=${!1}
          ?chevron=${!0}
          ?fullSize=${!1}
          ?rounded=${!0}
          data-testid="wallet-payment-option"
          imageSrc=${f(n)}
          imageSize="3xl"
        >
          <wui-text variant="lg-regular" color="primary">Pay with ${e}</wui-text>
        </wui-list-item>

        <wui-list-item
          type="secondary"
          icon="power"
          iconColor="error"
          @click=${this.onDisconnect}
          data-testid="disconnect-button"
          ?chevron=${!1}
          boxColor="foregroundSecondary"
        >
          <wui-text variant="lg-regular" color="secondary">Disconnect</wui-text>
        </wui-list-item>
      </wui-flex>
    `}disconnectedWalletTemplate(){return l`<wui-list-item
      type="secondary"
      boxColor="foregroundSecondary"
      variant="icon"
      iconColor="default"
      iconVariant="overlay"
      icon="wallet"
      @click=${this.onWalletPayment}
      ?chevron=${!0}
      data-testid="wallet-payment-option"
    >
      <wui-text variant="lg-regular" color="primary">Pay with wallet</wui-text>
    </wui-list-item>`}templateExchangeOptions(){if(this.isLoading)return l`<wui-flex justifyContent="center" alignItems="center">
        <wui-loading-spinner size="md"></wui-loading-spinner>
      </wui-flex>`;let e=this.exchanges.filter(n=>Xe(this.paymentAsset)?n.id===ue:n.id!==ue);return e.length===0?l`<wui-flex justifyContent="center" alignItems="center">
        <wui-text variant="md-medium" color="primary">No exchanges available</wui-text>
      </wui-flex>`:e.map(n=>l`
        <wui-list-item
          type="secondary"
          boxColor="foregroundSecondary"
          @click=${()=>this.onExchangePayment(n)}
          data-testid="exchange-option-${n.id}"
          ?chevron=${!0}
          imageSrc=${f(n.imageUrl)}
        >
          <wui-text flexGrow="1" variant="lg-regular" color="primary">
            Pay with ${n.name}
          </wui-text>
        </wui-list-item>
      `)}templateSeparator(){return l`<wui-separator text="or" bgColor="secondary"></wui-separator>`}async onWalletPayment(){if(!this.namespace)throw new Error("Namespace not found");this.caipAddress?W.push("PayQuote"):(await C.connect(),await L.open({view:"PayQuote"}))}onExchangePayment(e){c.setSelectedExchange(e),W.push("PayQuote")}async onDisconnect(){try{await v.disconnect(),await L.open({view:"Pay"})}catch{console.error("Failed to disconnect"),_.showError("Failed to disconnect")}}getWalletProperties({namespace:e}){if(!e)return{name:void 0,image:void 0};let n=this.activeConnectorIds[e];if(!n)return{name:void 0,image:void 0};let r=C.getConnector({id:n,namespace:e});if(!r)return{name:void 0,image:void 0};let s=S.getConnectorImage(r);return{name:r.name,image:s}}};$.styles=Je;F([m()],$.prototype,"amount",void 0);F([m()],$.prototype,"namespace",void 0);F([m()],$.prototype,"paymentAsset",void 0);F([m()],$.prototype,"activeConnectorIds",void 0);F([m()],$.prototype,"caipAddress",void 0);F([m()],$.prototype,"exchanges",void 0);F([m()],$.prototype,"isLoading",void 0);$=F([x("w3m-pay-view")],$);var et=I`
  :host {
    display: inline-flex;
    align-items: center;
    justify-content: center;
  }

  .pulse-container {
    position: relative;
    width: var(--pulse-size);
    height: var(--pulse-size);
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .pulse-rings {
    position: absolute;
    inset: 0;
    pointer-events: none;
  }

  .pulse-ring {
    position: absolute;
    inset: 0;
    border-radius: 50%;
    border: 2px solid var(--pulse-color);
    opacity: 0;
    animation: pulse var(--pulse-duration, 2s) ease-out infinite;
  }

  .pulse-content {
    position: relative;
    z-index: 1;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  @keyframes pulse {
    0% {
      transform: scale(0.5);
      opacity: var(--pulse-opacity, 0.3);
    }
    50% {
      opacity: calc(var(--pulse-opacity, 0.3) * 0.5);
    }
    100% {
      transform: scale(1.2);
      opacity: 0;
    }
  }
`;var Q=function(t,e,n,r){var s=arguments.length,i=s<3?e:r===null?r=Object.getOwnPropertyDescriptor(e,n):r,a;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")i=Reflect.decorate(t,e,n,r);else for(var u=t.length-1;u>=0;u--)(a=t[u])&&(i=(s<3?a(i):s>3?a(e,n,i):a(e,n))||i);return s>3&&i&&Object.defineProperty(e,n,i),i},ft=3,gt=2,wt=.3,yt="200px",xt={"accent-primary":_e.tokens.core.backgroundAccentPrimary},B=class extends y{constructor(){super(...arguments),this.rings=ft,this.duration=gt,this.opacity=wt,this.size=yt,this.variant="accent-primary"}render(){let e=xt[this.variant];this.style.cssText=`
      --pulse-size: ${this.size};
      --pulse-duration: ${this.duration}s;
      --pulse-color: ${e};
      --pulse-opacity: ${this.opacity};
    `;let n=Array.from({length:this.rings},(r,s)=>this.renderRing(s,this.rings));return l`
      <div class="pulse-container">
        <div class="pulse-rings">${n}</div>
        <div class="pulse-content">
          <slot></slot>
        </div>
      </div>
    `}renderRing(e,n){let s=`animation-delay: ${e/n*this.duration}s;`;return l`<div class="pulse-ring" style=${s}></div>`}};B.styles=[Z,et];Q([b({type:Number})],B.prototype,"rings",void 0);Q([b({type:Number})],B.prototype,"duration",void 0);Q([b({type:Number})],B.prototype,"opacity",void 0);Q([b()],B.prototype,"size",void 0);Q([b()],B.prototype,"variant",void 0);B=Q([x("wui-pulse")],B);var ye=[{id:"received",title:"Receiving funds",icon:"dollar"},{id:"processing",title:"Swapping asset",icon:"recycleHorizontal"},{id:"sending",title:"Sending asset to the recipient address",icon:"send"}],xe=["success","submitted","failure","timeout","refund"];var tt=I`
  :host {
    display: block;
    height: 100%;
    width: 100%;
  }

  wui-image {
    border-radius: ${({borderRadius:t})=>t.round};
  }

  .token-badge-container {
    position: absolute;
    bottom: 6px;
    left: 50%;
    transform: translateX(-50%);
    border-radius: ${({borderRadius:t})=>t[4]};
    z-index: 3;
    min-width: 105px;
  }

  .token-badge-container.loading {
    background-color: ${({tokens:t})=>t.theme.backgroundPrimary};
    border: 3px solid ${({tokens:t})=>t.theme.backgroundPrimary};
  }

  .token-badge-container.success {
    background-color: ${({tokens:t})=>t.theme.backgroundPrimary};
    border: 3px solid ${({tokens:t})=>t.theme.backgroundPrimary};
  }

  .token-image-container {
    position: relative;
  }

  .token-image {
    border-radius: ${({borderRadius:t})=>t.round};
    width: 64px;
    height: 64px;
  }

  .token-image.success {
    background-color: ${({tokens:t})=>t.theme.foregroundPrimary};
  }

  .token-image.error {
    background-color: ${({tokens:t})=>t.theme.foregroundPrimary};
  }

  .token-image.loading {
    background: ${({colors:t})=>t.accent010};
  }

  .token-image wui-icon {
    width: 32px;
    height: 32px;
  }

  .token-badge {
    background-color: ${({tokens:t})=>t.theme.foregroundPrimary};
    border: 1px solid ${({tokens:t})=>t.theme.foregroundSecondary};
    border-radius: ${({borderRadius:t})=>t[4]};
  }

  .token-badge wui-text {
    white-space: nowrap;
  }

  .payment-lifecycle-container {
    background-color: ${({tokens:t})=>t.theme.foregroundPrimary};
    border-top-right-radius: ${({borderRadius:t})=>t[6]};
    border-top-left-radius: ${({borderRadius:t})=>t[6]};
  }

  .payment-step-badge {
    padding: ${({spacing:t})=>t[1]} ${({spacing:t})=>t[2]};
    border-radius: ${({borderRadius:t})=>t[1]};
  }

  .payment-step-badge.loading {
    background-color: ${({tokens:t})=>t.theme.foregroundSecondary};
  }

  .payment-step-badge.error {
    background-color: ${({tokens:t})=>t.core.backgroundError};
  }

  .payment-step-badge.success {
    background-color: ${({tokens:t})=>t.core.backgroundSuccess};
  }

  .step-icon-container {
    position: relative;
    height: 40px;
    width: 40px;
    border-radius: ${({borderRadius:t})=>t.round};
    background-color: ${({tokens:t})=>t.theme.foregroundSecondary};
  }

  .step-icon-box {
    position: absolute;
    right: -4px;
    bottom: -1px;
    padding: 2px;
    border-radius: ${({borderRadius:t})=>t.round};
    border: 2px solid ${({tokens:t})=>t.theme.backgroundPrimary};
    background-color: ${({tokens:t})=>t.theme.foregroundPrimary};
  }

  .step-icon-box.success {
    background-color: ${({tokens:t})=>t.core.backgroundSuccess};
  }
`;var O=function(t,e,n,r){var s=arguments.length,i=s<3?e:r===null?r=Object.getOwnPropertyDescriptor(e,n):r,a;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")i=Reflect.decorate(t,e,n,r);else for(var u=t.length-1;u>=0;u--)(a=t[u])&&(i=(s<3?a(i):s>3?a(e,n,i):a(e,n))||i);return s>3&&i&&Object.defineProperty(e,n,i),i},bt={received:["pending","success","submitted"],processing:["success","submitted"],sending:["success","submitted"]},Et=3e3,U=class extends y{constructor(){super(),this.unsubscribe=[],this.pollingInterval=null,this.paymentAsset=c.state.paymentAsset,this.quoteStatus=c.state.quoteStatus,this.quote=c.state.quote,this.amount=c.state.amount,this.namespace=void 0,this.caipAddress=void 0,this.profileName=null,this.activeConnectorIds=C.state.activeConnectorIds,this.selectedExchange=c.state.selectedExchange,this.initializeNamespace(),this.unsubscribe.push(c.subscribeKey("quoteStatus",e=>this.quoteStatus=e),c.subscribeKey("quote",e=>this.quote=e),C.subscribeKey("activeConnectorIds",e=>this.activeConnectorIds=e),c.subscribeKey("selectedExchange",e=>this.selectedExchange=e))}connectedCallback(){super.connectedCallback(),this.startPolling()}disconnectedCallback(){super.disconnectedCallback(),this.stopPolling(),this.unsubscribe.forEach(e=>e())}render(){return l`
      <wui-flex flexDirection="column" .padding=${["3","0","0","0"]} gap="2">
        ${this.tokenTemplate()} ${this.paymentTemplate()} ${this.paymentLifecycleTemplate()}
      </wui-flex>
    `}tokenTemplate(){let e=j(this.amount||"0"),n=this.paymentAsset.metadata.symbol??"Unknown",s=h.getAllRequestedCaipNetworks().find(u=>u.caipNetworkId===this.paymentAsset.network),i=this.quoteStatus==="failure"||this.quoteStatus==="timeout"||this.quoteStatus==="refund";return this.quoteStatus==="success"||this.quoteStatus==="submitted"?l`<wui-flex alignItems="center" justifyContent="center">
        <wui-flex justifyContent="center" alignItems="center" class="token-image success">
          <wui-icon name="checkmark" color="success" size="inherit"></wui-icon>
        </wui-flex>
      </wui-flex>`:i?l`<wui-flex alignItems="center" justifyContent="center">
        <wui-flex justifyContent="center" alignItems="center" class="token-image error">
          <wui-icon name="close" color="error" size="inherit"></wui-icon>
        </wui-flex>
      </wui-flex>`:l`
      <wui-flex alignItems="center" justifyContent="center">
        <wui-flex class="token-image-container">
          <wui-pulse size="125px" rings="3" duration="4" opacity="0.5" variant="accent-primary">
            <wui-flex justifyContent="center" alignItems="center" class="token-image loading">
              <wui-icon name="paperPlaneTitle" color="accent-primary" size="inherit"></wui-icon>
            </wui-flex>
          </wui-pulse>

          <wui-flex
            justifyContent="center"
            alignItems="center"
            class="token-badge-container loading"
          >
            <wui-flex
              alignItems="center"
              justifyContent="center"
              gap="01"
              padding="1"
              class="token-badge"
            >
              <wui-image
                src=${f(S.getNetworkImage(s))}
                class="chain-image"
                size="mdl"
              ></wui-image>

              <wui-text variant="lg-regular" color="primary">${e} ${n}</wui-text>
            </wui-flex>
          </wui-flex>
        </wui-flex>
      </wui-flex>
    `}paymentTemplate(){return l`
      <wui-flex flexDirection="column" gap="2" .padding=${["0","6","0","6"]}>
        ${this.renderPayment()}
        <wui-separator></wui-separator>
        ${this.renderWallet()}
      </wui-flex>
    `}paymentLifecycleTemplate(){let e=this.getStepsWithStatus();return l`
      <wui-flex flexDirection="column" padding="4" gap="2" class="payment-lifecycle-container">
        <wui-flex alignItems="center" justifyContent="space-between">
          <wui-text variant="md-regular" color="secondary">PAYMENT CYCLE</wui-text>

          ${this.renderPaymentCycleBadge()}
        </wui-flex>

        <wui-flex flexDirection="column" gap="5" .padding=${["2","0","2","0"]}>
          ${e.map(n=>this.renderStep(n))}
        </wui-flex>
      </wui-flex>
    `}renderPaymentCycleBadge(){let e=this.quoteStatus==="failure"||this.quoteStatus==="timeout"||this.quoteStatus==="refund",n=this.quoteStatus==="success"||this.quoteStatus==="submitted";if(e)return l`
        <wui-flex
          justifyContent="center"
          alignItems="center"
          class="payment-step-badge error"
          gap="1"
        >
          <wui-icon name="close" color="error" size="xs"></wui-icon>
          <wui-text variant="sm-regular" color="error">Failed</wui-text>
        </wui-flex>
      `;if(n)return l`
        <wui-flex
          justifyContent="center"
          alignItems="center"
          class="payment-step-badge success"
          gap="1"
        >
          <wui-icon name="checkmark" color="success" size="xs"></wui-icon>
          <wui-text variant="sm-regular" color="success">Completed</wui-text>
        </wui-flex>
      `;let r=this.quote?.timeInSeconds??0;return l`
      <wui-flex alignItems="center" justifyContent="space-between" gap="3">
        <wui-flex
          justifyContent="center"
          alignItems="center"
          class="payment-step-badge loading"
          gap="1"
        >
          <wui-icon name="clock" color="default" size="xs"></wui-icon>
          <wui-text variant="sm-regular" color="primary">Est. ${r} sec</wui-text>
        </wui-flex>

        <wui-icon name="chevronBottom" color="default" size="xxs"></wui-icon>
      </wui-flex>
    `}renderPayment(){let n=h.getAllRequestedCaipNetworks().find(a=>{let u=this.quote?.origin.currency.network;if(!u)return!1;let{chainId:A}=g.parseCaipNetworkId(u);return P.isLowerCaseMatch(a.id.toString(),A.toString())}),r=w.formatNumber(this.quote?.origin.amount||"0",{decimals:this.quote?.origin.currency.metadata.decimals??0}).toString(),s=j(r),i=this.quote?.origin.currency.metadata.symbol??"Unknown";return l`
      <wui-flex
        alignItems="flex-start"
        justifyContent="space-between"
        .padding=${["3","0","3","0"]}
      >
        <wui-text variant="lg-regular" color="secondary">Payment Method</wui-text>

        <wui-flex flexDirection="column" alignItems="flex-end" gap="1">
          <wui-flex alignItems="center" gap="01">
            <wui-text variant="lg-regular" color="primary">${s}</wui-text>
            <wui-text variant="lg-regular" color="secondary">${i}</wui-text>
          </wui-flex>

          <wui-flex alignItems="center" gap="1">
            <wui-text variant="md-regular" color="secondary">on</wui-text>
            <wui-image
              src=${f(S.getNetworkImage(n))}
              size="xs"
            ></wui-image>
            <wui-text variant="md-regular" color="secondary">${n?.name}</wui-text>
          </wui-flex>
        </wui-flex>
      </wui-flex>
    `}renderWallet(){return l`
      <wui-flex
        alignItems="flex-start"
        justifyContent="space-between"
        .padding=${["3","0","3","0"]}
      >
        <wui-text variant="lg-regular" color="secondary"
          >${this.selectedExchange?"Exchange":"Wallet"}</wui-text
        >

        ${this.renderWalletText()}
      </wui-flex>
    `}renderWalletText(){let{image:e}=this.getWalletProperties({namespace:this.namespace}),{address:n}=this.caipAddress?g.parseCaipAddress(this.caipAddress):{},r=this.selectedExchange?.name;return this.selectedExchange?l`
        <wui-flex alignItems="center" justifyContent="flex-end" gap="1">
          <wui-text variant="lg-regular" color="primary">${r}</wui-text>
          <wui-image src=${f(this.selectedExchange.imageUrl)} size="mdl"></wui-image>
        </wui-flex>
      `:l`
      <wui-flex alignItems="center" justifyContent="flex-end" gap="1">
        <wui-text variant="lg-regular" color="primary">
          ${Re.getTruncateString({string:this.profileName||n||r||"",charsStart:this.profileName?16:4,charsEnd:this.profileName?0:6,truncate:this.profileName?"end":"middle"})}
        </wui-text>

        <wui-image src=${f(e)} size="mdl"></wui-image>
      </wui-flex>
    `}getStepsWithStatus(){return this.quoteStatus==="failure"||this.quoteStatus==="timeout"||this.quoteStatus==="refund"?ye.map(n=>({...n,status:"failed"})):ye.map(n=>{let s=(bt[n.id]??[]).includes(this.quoteStatus)?"completed":"pending";return{...n,status:s}})}renderStep({title:e,icon:n,status:r}){return l`
      <wui-flex alignItems="center" gap="3">
        <wui-flex justifyContent="center" alignItems="center" class="step-icon-container">
          <wui-icon name=${n} color="default" size="mdl"></wui-icon>

          <wui-flex alignItems="center" justifyContent="center" class=${J({"step-icon-box":!0,success:r==="completed"})}>
            ${this.renderStatusIndicator(r)}
          </wui-flex>
        </wui-flex>

        <wui-text variant="md-regular" color="primary">${e}</wui-text>
      </wui-flex>
    `}renderStatusIndicator(e){return e==="completed"?l`<wui-icon size="sm" color="success" name="checkmark"></wui-icon>`:e==="failed"?l`<wui-icon size="sm" color="error" name="close"></wui-icon>`:e==="pending"?l`<wui-loading-spinner color="accent-primary" size="sm"></wui-loading-spinner>`:null}startPolling(){this.pollingInterval||(this.fetchQuoteStatus(),this.pollingInterval=setInterval(()=>{this.fetchQuoteStatus()},Et))}stopPolling(){this.pollingInterval&&(clearInterval(this.pollingInterval),this.pollingInterval=null)}async fetchQuoteStatus(){let e=c.state.requestId;if(!e||xe.includes(this.quoteStatus))this.stopPolling();else try{await c.fetchQuoteStatus({requestId:e}),xe.includes(this.quoteStatus)&&this.stopPolling()}catch{this.stopPolling()}}initializeNamespace(){let e=h.state.activeChain;this.namespace=e,this.caipAddress=h.getAccountData(e)?.caipAddress,this.profileName=h.getAccountData(e)?.profileName??null,this.unsubscribe.push(h.subscribeChainProp("accountState",n=>{this.caipAddress=n?.caipAddress,this.profileName=n?.profileName??null},e))}getWalletProperties({namespace:e}){if(!e)return{name:void 0,image:void 0};let n=this.activeConnectorIds[e];if(!n)return{name:void 0,image:void 0};let r=C.getConnector({id:n,namespace:e});if(!r)return{name:void 0,image:void 0};let s=S.getConnectorImage(r);return{name:r.name,image:s}}};U.styles=tt;O([m()],U.prototype,"paymentAsset",void 0);O([m()],U.prototype,"quoteStatus",void 0);O([m()],U.prototype,"quote",void 0);O([m()],U.prototype,"amount",void 0);O([m()],U.prototype,"namespace",void 0);O([m()],U.prototype,"caipAddress",void 0);O([m()],U.prototype,"profileName",void 0);O([m()],U.prototype,"activeConnectorIds",void 0);O([m()],U.prototype,"selectedExchange",void 0);U=O([x("w3m-pay-loading-view")],U);var nt=ve`
  :host {
    display: block;
  }
`;var At=function(t,e,n,r){var s=arguments.length,i=s<3?e:r===null?r=Object.getOwnPropertyDescriptor(e,n):r,a;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")i=Reflect.decorate(t,e,n,r);else for(var u=t.length-1;u>=0;u--)(a=t[u])&&(i=(s<3?a(i):s>3?a(e,n,i):a(e,n))||i);return s>3&&i&&Object.defineProperty(e,n,i),i},be=class extends y{render(){return l`
      <wui-flex flexDirection="column" gap="4">
        <wui-flex alignItems="center" justifyContent="space-between">
          <wui-text variant="md-regular" color="secondary">Pay</wui-text>
          <wui-shimmer width="60px" height="16px" borderRadius="4xs" variant="light"></wui-shimmer>
        </wui-flex>

        <wui-flex alignItems="center" justifyContent="space-between">
          <wui-text variant="md-regular" color="secondary">Network Fee</wui-text>

          <wui-flex flexDirection="column" alignItems="flex-end" gap="2">
            <wui-shimmer
              width="75px"
              height="16px"
              borderRadius="4xs"
              variant="light"
            ></wui-shimmer>

            <wui-flex alignItems="center" gap="01">
              <wui-shimmer width="14px" height="14px" rounded variant="light"></wui-shimmer>
              <wui-shimmer
                width="49px"
                height="14px"
                borderRadius="4xs"
                variant="light"
              ></wui-shimmer>
            </wui-flex>
          </wui-flex>
        </wui-flex>

        <wui-flex alignItems="center" justifyContent="space-between">
          <wui-text variant="md-regular" color="secondary">Service Fee</wui-text>
          <wui-shimmer width="75px" height="16px" borderRadius="4xs" variant="light"></wui-shimmer>
        </wui-flex>
      </wui-flex>
    `}};be.styles=[nt];be=At([x("w3m-pay-fees-skeleton")],be);var rt=I`
  :host {
    display: block;
  }

  wui-image {
    border-radius: ${({borderRadius:t})=>t.round};
  }
`;var st=function(t,e,n,r){var s=arguments.length,i=s<3?e:r===null?r=Object.getOwnPropertyDescriptor(e,n):r,a;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")i=Reflect.decorate(t,e,n,r);else for(var u=t.length-1;u>=0;u--)(a=t[u])&&(i=(s<3?a(i):s>3?a(e,n,i):a(e,n))||i);return s>3&&i&&Object.defineProperty(e,n,i),i},re=class extends y{constructor(){super(),this.unsubscribe=[],this.quote=c.state.quote,this.unsubscribe.push(c.subscribeKey("quote",e=>this.quote=e))}disconnectedCallback(){this.unsubscribe.forEach(e=>e())}render(){let e=w.formatNumber(this.quote?.origin.amount||"0",{decimals:this.quote?.origin.currency.metadata.decimals??0,round:6}).toString();return l`
      <wui-flex flexDirection="column" gap="4">
        <wui-flex alignItems="center" justifyContent="space-between">
          <wui-text variant="md-regular" color="secondary">Pay</wui-text>
          <wui-text variant="md-regular" color="primary">
            ${e} ${this.quote?.origin.currency.metadata.symbol||"Unknown"}
          </wui-text>
        </wui-flex>

        ${this.quote&&this.quote.fees.length>0?this.quote.fees.map(n=>this.renderFee(n)):null}
      </wui-flex>
    `}renderFee(e){let n=e.id==="network",r=w.formatNumber(e.amount||"0",{decimals:e.currency.metadata.decimals??0,round:6}).toString();if(n){let i=h.getAllRequestedCaipNetworks().find(a=>P.isLowerCaseMatch(a.caipNetworkId,e.currency.network));return l`
        <wui-flex alignItems="center" justifyContent="space-between">
          <wui-text variant="md-regular" color="secondary">${e.label}</wui-text>

          <wui-flex flexDirection="column" alignItems="flex-end" gap="2">
            <wui-text variant="md-regular" color="primary">
              ${r} ${e.currency.metadata.symbol||"Unknown"}
            </wui-text>

            <wui-flex alignItems="center" gap="01">
              <wui-image
                src=${f(S.getNetworkImage(i))}
                size="xs"
              ></wui-image>
              <wui-text variant="sm-regular" color="secondary">
                ${i?.name||"Unknown"}
              </wui-text>
            </wui-flex>
          </wui-flex>
        </wui-flex>
      `}return l`
      <wui-flex alignItems="center" justifyContent="space-between">
        <wui-text variant="md-regular" color="secondary">${e.label}</wui-text>
        <wui-text variant="md-regular" color="primary">
          ${r} ${e.currency.metadata.symbol||"Unknown"}
        </wui-text>
      </wui-flex>
    `}};re.styles=[rt];st([m()],re.prototype,"quote",void 0);re=st([x("w3m-pay-fees")],re);var it=I`
  :host {
    display: block;
    width: 100%;
  }

  .disabled-container {
    padding: ${({spacing:t})=>t[2]};
    min-height: 168px;
  }

  wui-icon {
    width: ${({spacing:t})=>t[8]};
    height: ${({spacing:t})=>t[8]};
  }

  wui-flex > wui-text {
    max-width: 273px;
  }
`;var ot=function(t,e,n,r){var s=arguments.length,i=s<3?e:r===null?r=Object.getOwnPropertyDescriptor(e,n):r,a;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")i=Reflect.decorate(t,e,n,r);else for(var u=t.length-1;u>=0;u--)(a=t[u])&&(i=(s<3?a(i):s>3?a(e,n,i):a(e,n))||i);return s>3&&i&&Object.defineProperty(e,n,i),i},se=class extends y{constructor(){super(),this.unsubscribe=[],this.selectedExchange=c.state.selectedExchange,this.unsubscribe.push(c.subscribeKey("selectedExchange",e=>this.selectedExchange=e))}disconnectedCallback(){this.unsubscribe.forEach(e=>e())}render(){let e=!!this.selectedExchange;return l`
      <wui-flex
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        gap="3"
        class="disabled-container"
      >
        <wui-icon name="coins" color="default" size="inherit"></wui-icon>

        <wui-text variant="md-regular" color="primary" align="center">
          You don't have enough funds to complete this transaction
        </wui-text>

        ${e?null:l`<wui-button
              size="md"
              variant="neutral-secondary"
              @click=${this.dispatchConnectOtherWalletEvent.bind(this)}
              >Connect other wallet</wui-button
            >`}
      </wui-flex>
    `}dispatchConnectOtherWalletEvent(){this.dispatchEvent(new CustomEvent("connectOtherWallet",{detail:!0,bubbles:!0,composed:!0}))}};se.styles=[it];ot([b({type:Array})],se.prototype,"selectedExchange",void 0);se=ot([x("w3m-pay-options-empty")],se);var at=I`
  :host {
    display: block;
    width: 100%;
  }

  .pay-options-container {
    max-height: 196px;
    overflow-y: auto;
    overflow-x: hidden;
    scrollbar-width: none;
  }

  .pay-options-container::-webkit-scrollbar {
    display: none;
  }

  .pay-option-container {
    border-radius: ${({borderRadius:t})=>t[4]};
    padding: ${({spacing:t})=>t[3]};
    min-height: 60px;
  }

  .token-images-container {
    position: relative;
    justify-content: center;
    align-items: center;
  }

  .chain-image {
    position: absolute;
    bottom: -3px;
    right: -5px;
    border: 2px solid ${({tokens:t})=>t.theme.foregroundSecondary};
  }
`;var It=function(t,e,n,r){var s=arguments.length,i=s<3?e:r===null?r=Object.getOwnPropertyDescriptor(e,n):r,a;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")i=Reflect.decorate(t,e,n,r);else for(var u=t.length-1;u>=0;u--)(a=t[u])&&(i=(s<3?a(i):s>3?a(e,n,i):a(e,n))||i);return s>3&&i&&Object.defineProperty(e,n,i),i},Ee=class extends y{render(){return l`
      <wui-flex flexDirection="column" gap="2" class="pay-options-container">
        ${this.renderOptionEntry()} ${this.renderOptionEntry()} ${this.renderOptionEntry()}
      </wui-flex>
    `}renderOptionEntry(){return l`
      <wui-flex
        alignItems="center"
        justifyContent="space-between"
        gap="2"
        class="pay-option-container"
      >
        <wui-flex alignItems="center" gap="2">
          <wui-flex class="token-images-container">
            <wui-shimmer
              width="32px"
              height="32px"
              rounded
              variant="light"
              class="token-image"
            ></wui-shimmer>
            <wui-shimmer
              width="16px"
              height="16px"
              rounded
              variant="light"
              class="chain-image"
            ></wui-shimmer>
          </wui-flex>

          <wui-flex flexDirection="column" gap="1">
            <wui-shimmer
              width="74px"
              height="16px"
              borderRadius="4xs"
              variant="light"
            ></wui-shimmer>
            <wui-shimmer
              width="46px"
              height="14px"
              borderRadius="4xs"
              variant="light"
            ></wui-shimmer>
          </wui-flex>
        </wui-flex>
      </wui-flex>
    `}};Ee.styles=[at];Ee=It([x("w3m-pay-options-skeleton")],Ee);var ct=I`
  :host {
    display: block;
    width: 100%;
  }

  .pay-options-container {
    max-height: 196px;
    overflow-y: auto;
    overflow-x: hidden;
    scrollbar-width: none;
    mask-image: var(--options-mask-image);
    -webkit-mask-image: var(--options-mask-image);
  }

  .pay-options-container::-webkit-scrollbar {
    display: none;
  }

  .pay-option-container {
    cursor: pointer;
    border-radius: ${({borderRadius:t})=>t[4]};
    padding: ${({spacing:t})=>t[3]};
    transition: background-color ${({durations:t})=>t.lg}
      ${({easings:t})=>t["ease-out-power-1"]};
    will-change: background-color;
  }

  .token-images-container {
    position: relative;
    justify-content: center;
    align-items: center;
  }

  .token-image {
    border-radius: ${({borderRadius:t})=>t.round};
    width: 32px;
    height: 32px;
  }

  .chain-image {
    position: absolute;
    width: 16px;
    height: 16px;
    bottom: -3px;
    right: -5px;
    border-radius: ${({borderRadius:t})=>t.round};
    border: 2px solid ${({tokens:t})=>t.theme.backgroundPrimary};
  }

  @media (hover: hover) and (pointer: fine) {
    .pay-option-container:hover {
      background-color: ${({tokens:t})=>t.theme.foregroundPrimary};
    }
  }
`;var ie=function(t,e,n,r){var s=arguments.length,i=s<3?e:r===null?r=Object.getOwnPropertyDescriptor(e,n):r,a;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")i=Reflect.decorate(t,e,n,r);else for(var u=t.length-1;u>=0;u--)(a=t[u])&&(i=(s<3?a(i):s>3?a(e,n,i):a(e,n))||i);return s>3&&i&&Object.defineProperty(e,n,i),i},Nt=300,Y=class extends y{constructor(){super(),this.unsubscribe=[],this.options=[],this.selectedPaymentAsset=null}disconnectedCallback(){this.unsubscribe.forEach(n=>n()),this.resizeObserver?.disconnect(),this.shadowRoot?.querySelector(".pay-options-container")?.removeEventListener("scroll",this.handleOptionsListScroll.bind(this))}firstUpdated(){let e=this.shadowRoot?.querySelector(".pay-options-container");e&&(requestAnimationFrame(this.handleOptionsListScroll.bind(this)),e?.addEventListener("scroll",this.handleOptionsListScroll.bind(this)),this.resizeObserver=new ResizeObserver(()=>{this.handleOptionsListScroll()}),this.resizeObserver?.observe(e),this.handleOptionsListScroll())}render(){return l`
      <wui-flex flexDirection="column" gap="2" class="pay-options-container">
        ${this.options.map(e=>this.payOptionTemplate(e))}
      </wui-flex>
    `}payOptionTemplate(e){let{network:n,metadata:r,asset:s,amount:i="0"}=e,u=h.getAllRequestedCaipNetworks().find(ae=>ae.caipNetworkId===n),A=`${n}:${s}`,V=`${this.selectedPaymentAsset?.network}:${this.selectedPaymentAsset?.asset}`,G=A===V,M=w.bigNumber(i,{safe:!0}),H=M.gt(0);return l`
      <wui-flex
        alignItems="center"
        justifyContent="space-between"
        gap="2"
        @click=${()=>this.onSelect?.(e)}
        class="pay-option-container"
      >
        <wui-flex alignItems="center" gap="2">
          <wui-flex class="token-images-container">
            <wui-image
              src=${f(r.logoURI)}
              class="token-image"
              size="3xl"
            ></wui-image>
            <wui-image
              src=${f(S.getNetworkImage(u))}
              class="chain-image"
              size="md"
            ></wui-image>
          </wui-flex>

          <wui-flex flexDirection="column" gap="1">
            <wui-text variant="lg-regular" color="primary">${r.symbol}</wui-text>
            ${H?l`<wui-text variant="sm-regular" color="secondary">
                  ${M.round(6).toString()} ${r.symbol}
                </wui-text>`:null}
          </wui-flex>
        </wui-flex>

        ${G?l`<wui-icon name="checkmark" size="md" color="success"></wui-icon>`:null}
      </wui-flex>
    `}handleOptionsListScroll(){let e=this.shadowRoot?.querySelector(".pay-options-container");if(!e)return;e.scrollHeight>Nt?(e.style.setProperty("--options-mask-image",`linear-gradient(
          to bottom,
          rgba(0, 0, 0, calc(1 - var(--options-scroll--top-opacity))) 0px,
          rgba(200, 200, 200, calc(1 - var(--options-scroll--top-opacity))) 1px,
          black 50px,
          black calc(100% - 50px),
          rgba(155, 155, 155, calc(1 - var(--options-scroll--bottom-opacity))) calc(100% - 1px),
          rgba(0, 0, 0, calc(1 - var(--options-scroll--bottom-opacity))) 100%
        )`),e.style.setProperty("--options-scroll--top-opacity",le.interpolate([0,50],[0,1],e.scrollTop).toString()),e.style.setProperty("--options-scroll--bottom-opacity",le.interpolate([0,50],[0,1],e.scrollHeight-e.scrollTop-e.offsetHeight).toString())):(e.style.setProperty("--options-mask-image","none"),e.style.setProperty("--options-scroll--top-opacity","0"),e.style.setProperty("--options-scroll--bottom-opacity","0"))}};Y.styles=[ct];ie([b({type:Array})],Y.prototype,"options",void 0);ie([b()],Y.prototype,"selectedPaymentAsset",void 0);ie([b()],Y.prototype,"onSelect",void 0);Y=ie([x("w3m-pay-options")],Y);var lt=I`
  .payment-methods-container {
    background-color: ${({tokens:t})=>t.theme.foregroundPrimary};
    border-top-right-radius: ${({borderRadius:t})=>t[5]};
    border-top-left-radius: ${({borderRadius:t})=>t[5]};
  }

  .pay-options-container {
    background-color: ${({tokens:t})=>t.theme.foregroundSecondary};
    border-radius: ${({borderRadius:t})=>t[5]};
    padding: ${({spacing:t})=>t[1]};
  }

  w3m-tooltip-trigger {
    display: flex;
    align-items: center;
    justify-content: center;
    max-width: fit-content;
  }

  wui-image {
    border-radius: ${({borderRadius:t})=>t.round};
  }

  w3m-pay-options.disabled {
    opacity: 0.5;
    pointer-events: none;
  }
`;var N=function(t,e,n,r){var s=arguments.length,i=s<3?e:r===null?r=Object.getOwnPropertyDescriptor(e,n):r,a;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")i=Reflect.decorate(t,e,n,r);else for(var u=t.length-1;u>=0;u--)(a=t[u])&&(i=(s<3?a(i):s>3?a(e,n,i):a(e,n))||i);return s>3&&i&&Object.defineProperty(e,n,i),i},oe={eip155:"ethereum",solana:"solana",bip122:"bitcoin",ton:"ton"},Pt={eip155:{icon:oe.eip155,label:"EVM"},solana:{icon:oe.solana,label:"Solana"},bip122:{icon:oe.bip122,label:"Bitcoin"},ton:{icon:oe.ton,label:"Ton"}},E=class extends y{constructor(){super(),this.unsubscribe=[],this.profileName=null,this.paymentAsset=c.state.paymentAsset,this.namespace=void 0,this.caipAddress=void 0,this.amount=c.state.amount,this.recipient=c.state.recipient,this.activeConnectorIds=C.state.activeConnectorIds,this.selectedPaymentAsset=c.state.selectedPaymentAsset,this.selectedExchange=c.state.selectedExchange,this.isFetchingQuote=c.state.isFetchingQuote,this.quoteError=c.state.quoteError,this.quote=c.state.quote,this.isFetchingTokenBalances=c.state.isFetchingTokenBalances,this.tokenBalances=c.state.tokenBalances,this.isPaymentInProgress=c.state.isPaymentInProgress,this.exchangeUrlForQuote=c.state.exchangeUrlForQuote,this.completedTransactionsCount=0,this.unsubscribe.push(c.subscribeKey("paymentAsset",e=>this.paymentAsset=e)),this.unsubscribe.push(c.subscribeKey("tokenBalances",e=>this.onTokenBalancesChanged(e))),this.unsubscribe.push(c.subscribeKey("isFetchingTokenBalances",e=>this.isFetchingTokenBalances=e)),this.unsubscribe.push(C.subscribeKey("activeConnectorIds",e=>this.activeConnectorIds=e)),this.unsubscribe.push(c.subscribeKey("selectedPaymentAsset",e=>this.selectedPaymentAsset=e)),this.unsubscribe.push(c.subscribeKey("isFetchingQuote",e=>this.isFetchingQuote=e)),this.unsubscribe.push(c.subscribeKey("quoteError",e=>this.quoteError=e)),this.unsubscribe.push(c.subscribeKey("quote",e=>this.quote=e)),this.unsubscribe.push(c.subscribeKey("amount",e=>this.amount=e)),this.unsubscribe.push(c.subscribeKey("recipient",e=>this.recipient=e)),this.unsubscribe.push(c.subscribeKey("isPaymentInProgress",e=>this.isPaymentInProgress=e)),this.unsubscribe.push(c.subscribeKey("selectedExchange",e=>this.selectedExchange=e)),this.unsubscribe.push(c.subscribeKey("exchangeUrlForQuote",e=>this.exchangeUrlForQuote=e)),this.resetQuoteState(),this.initializeNamespace(),this.fetchTokens()}disconnectedCallback(){super.disconnectedCallback(),this.resetAssetsState(),this.unsubscribe.forEach(e=>e())}updated(e){super.updated(e),e.has("selectedPaymentAsset")&&this.fetchQuote()}render(){return l`
      <wui-flex flexDirection="column">
        ${this.profileTemplate()}

        <wui-flex
          flexDirection="column"
          gap="4"
          class="payment-methods-container"
          .padding=${["4","4","5","4"]}
        >
          ${this.paymentOptionsViewTemplate()} ${this.amountWithFeeTemplate()}

          <wui-flex
            alignItems="center"
            justifyContent="space-between"
            .padding=${["1","0","1","0"]}
          >
            <wui-separator></wui-separator>
          </wui-flex>

          ${this.paymentActionsTemplate()}
        </wui-flex>
      </wui-flex>
    `}profileTemplate(){if(this.selectedExchange){let a=w.formatNumber(this.quote?.origin.amount,{decimals:this.quote?.origin.currency.metadata.decimals??0}).toString();return l`
        <wui-flex
          .padding=${["4","3","4","3"]}
          alignItems="center"
          justifyContent="space-between"
          gap="2"
        >
          <wui-text variant="lg-regular" color="secondary">Paying with</wui-text>

          ${this.quote?l`<wui-text variant="lg-regular" color="primary">
                ${w.bigNumber(a,{safe:!0}).round(6).toString()}
                ${this.quote.origin.currency.metadata.symbol}
              </wui-text>`:l`<wui-shimmer width="80px" height="18px" variant="light"></wui-shimmer>`}
        </wui-flex>
      `}let e=T.getPlainAddress(this.caipAddress)??"",{name:n,image:r}=this.getWalletProperties({namespace:this.namespace}),{icon:s,label:i}=Pt[this.namespace]??{};return l`
      <wui-flex
        .padding=${["4","3","4","3"]}
        alignItems="center"
        justifyContent="space-between"
        gap="2"
      >
        <wui-wallet-switch
          profileName=${f(this.profileName)}
          address=${f(e)}
          imageSrc=${f(r)}
          alt=${f(n)}
          @click=${this.onConnectOtherWallet.bind(this)}
          data-testid="wui-wallet-switch"
        ></wui-wallet-switch>

        <wui-wallet-switch
          profileName=${f(i)}
          address=${f(e)}
          icon=${f(s)}
          iconSize="xs"
          .enableGreenCircle=${!1}
          alt=${f(i)}
          @click=${this.onConnectOtherWallet.bind(this)}
          data-testid="wui-wallet-switch"
        ></wui-wallet-switch>
      </wui-flex>
    `}initializeNamespace(){let e=h.state.activeChain;this.namespace=e,this.caipAddress=h.getAccountData(e)?.caipAddress,this.profileName=h.getAccountData(e)?.profileName??null,this.unsubscribe.push(h.subscribeChainProp("accountState",n=>this.onAccountStateChanged(n),e))}async fetchTokens(){if(this.namespace){let e;if(this.caipAddress){let{chainId:n,chainNamespace:r}=g.parseCaipAddress(this.caipAddress),s=`${r}:${n}`;e=h.getAllRequestedCaipNetworks().find(a=>a.caipNetworkId===s)}await c.fetchTokens({caipAddress:this.caipAddress,caipNetwork:e,namespace:this.namespace})}}fetchQuote(){if(this.amount&&this.recipient&&this.selectedPaymentAsset&&this.paymentAsset){let{address:e}=this.caipAddress?g.parseCaipAddress(this.caipAddress):{};c.fetchQuote({amount:this.amount.toString(),address:e,sourceToken:this.selectedPaymentAsset,toToken:this.paymentAsset,recipient:this.recipient})}}getWalletProperties({namespace:e}){if(!e)return{name:void 0,image:void 0};let n=this.activeConnectorIds[e];if(!n)return{name:void 0,image:void 0};let r=C.getConnector({id:n,namespace:e});if(!r)return{name:void 0,image:void 0};let s=S.getConnectorImage(r);return{name:r.name,image:s}}paymentOptionsViewTemplate(){return l`
      <wui-flex flexDirection="column" gap="2">
        <wui-text variant="sm-regular" color="secondary">CHOOSE PAYMENT OPTION</wui-text>
        <wui-flex class="pay-options-container">${this.paymentOptionsTemplate()}</wui-flex>
      </wui-flex>
    `}paymentOptionsTemplate(){let e=this.getPaymentAssetFromTokenBalances();if(this.isFetchingTokenBalances)return l`<w3m-pay-options-skeleton></w3m-pay-options-skeleton>`;if(e.length===0)return l`<w3m-pay-options-empty
        @connectOtherWallet=${this.onConnectOtherWallet.bind(this)}
      ></w3m-pay-options-empty>`;let n={disabled:this.isFetchingQuote};return l`<w3m-pay-options
      class=${J(n)}
      .options=${e}
      .selectedPaymentAsset=${f(this.selectedPaymentAsset)}
      .onSelect=${this.onSelectedPaymentAssetChanged.bind(this)}
    ></w3m-pay-options>`}amountWithFeeTemplate(){return this.isFetchingQuote||!this.selectedPaymentAsset||this.quoteError?l`<w3m-pay-fees-skeleton></w3m-pay-fees-skeleton>`:l`<w3m-pay-fees></w3m-pay-fees>`}paymentActionsTemplate(){let e=this.isFetchingQuote||this.isFetchingTokenBalances,n=this.isFetchingQuote||this.isFetchingTokenBalances||!this.selectedPaymentAsset||!!this.quoteError,r=w.formatNumber(this.quote?.origin.amount??0,{decimals:this.quote?.origin.currency.metadata.decimals??0}).toString();return this.selectedExchange?e||n?l`
          <wui-shimmer width="100%" height="48px" variant="light" ?rounded=${!0}></wui-shimmer>
        `:l`<wui-button
        size="lg"
        fullWidth
        variant="accent-secondary"
        @click=${this.onPayWithExchange.bind(this)}
      >
        ${`Continue in ${this.selectedExchange.name}`}

        <wui-icon name="arrowRight" color="inherit" size="sm" slot="iconRight"></wui-icon>
      </wui-button>`:l`
      <wui-flex alignItems="center" justifyContent="space-between">
        <wui-flex flexDirection="column" gap="1">
          <wui-text variant="md-regular" color="secondary">Order Total</wui-text>

          ${e||n?l`<wui-shimmer width="58px" height="32px" variant="light"></wui-shimmer>`:l`<wui-flex alignItems="center" gap="01">
                <wui-text variant="h4-regular" color="primary">${j(r)}</wui-text>

                <wui-text variant="lg-regular" color="secondary">
                  ${this.quote?.origin.currency.metadata.symbol||"Unknown"}
                </wui-text>
              </wui-flex>`}
        </wui-flex>

        ${this.actionButtonTemplate({isLoading:e,isDisabled:n})}
      </wui-flex>
    `}actionButtonTemplate(e){let n=te(this.quote),{isLoading:r,isDisabled:s}=e,i="Pay";return n.length>1&&this.completedTransactionsCount===0&&(i="Approve"),l`
      <wui-button
        size="lg"
        variant="accent-primary"
        ?loading=${r||this.isPaymentInProgress}
        ?disabled=${s||this.isPaymentInProgress}
        @click=${()=>{n.length>0?this.onSendTransactions():this.onTransfer()}}
      >
        ${i}
        ${r?null:l`<wui-icon
              name="arrowRight"
              color="inherit"
              size="sm"
              slot="iconRight"
            ></wui-icon>`}
      </wui-button>
    `}getPaymentAssetFromTokenBalances(){return this.namespace?(this.tokenBalances[this.namespace]??[]).map(s=>{try{return He(s)}catch{return null}}).filter(s=>!!s).filter(s=>{let{chainId:i}=g.parseCaipNetworkId(s.network),{chainId:a}=g.parseCaipNetworkId(this.paymentAsset.network);return P.isLowerCaseMatch(s.asset,this.paymentAsset.asset)?!0:this.selectedExchange?!P.isLowerCaseMatch(i.toString(),a.toString()):!0}):[]}onTokenBalancesChanged(e){this.tokenBalances=e;let[n]=this.getPaymentAssetFromTokenBalances();n&&c.setSelectedPaymentAsset(n)}async onConnectOtherWallet(){await C.connect(),await L.open({view:"PayQuote"})}onAccountStateChanged(e){let{address:n}=this.caipAddress?g.parseCaipAddress(this.caipAddress):{};if(this.caipAddress=e?.caipAddress,this.profileName=e?.profileName??null,n){let{address:r}=this.caipAddress?g.parseCaipAddress(this.caipAddress):{};r?P.isLowerCaseMatch(r,n)||(this.resetAssetsState(),this.resetQuoteState(),this.fetchTokens()):L.close()}}onSelectedPaymentAssetChanged(e){this.isFetchingQuote||c.setSelectedPaymentAsset(e)}async onTransfer(){let e=K(this.quote);if(e){if(!P.isLowerCaseMatch(this.selectedPaymentAsset?.asset,e.deposit.currency))throw new Error("Quote asset is not the same as the selected payment asset");let r=this.selectedPaymentAsset?.amount??"0",s=w.formatNumber(e.deposit.amount,{decimals:this.selectedPaymentAsset?.metadata.decimals??0}).toString();if(!w.bigNumber(r).gte(s)){_.showError("Insufficient funds");return}if(this.quote&&this.selectedPaymentAsset&&this.caipAddress&&this.namespace){let{address:a}=g.parseCaipAddress(this.caipAddress);await c.onTransfer({chainNamespace:this.namespace,fromAddress:a,toAddress:e.deposit.receiver,amount:s,paymentAsset:this.selectedPaymentAsset}),c.setRequestId(e.requestId),W.push("PayLoading")}}}async onSendTransactions(){let e=this.selectedPaymentAsset?.amount??"0",n=w.formatNumber(this.quote?.origin.amount??0,{decimals:this.selectedPaymentAsset?.metadata.decimals??0}).toString();if(!w.bigNumber(e).gte(n)){_.showError("Insufficient funds");return}let s=te(this.quote),[i]=te(this.quote,this.completedTransactionsCount);i&&this.namespace&&(await c.onSendTransaction({namespace:this.namespace,transactionStep:i}),this.completedTransactionsCount+=1,this.completedTransactionsCount===s.length&&(c.setRequestId(i.requestId),W.push("PayLoading")))}onPayWithExchange(){if(this.exchangeUrlForQuote){let e=T.returnOpenHref("","popupWindow","scrollbar=yes,width=480,height=720");if(!e)throw new Error("Could not create popup window");e.location.href=this.exchangeUrlForQuote;let n=K(this.quote);n&&c.setRequestId(n.requestId),c.initiatePayment(),W.push("PayLoading")}}resetAssetsState(){c.setSelectedPaymentAsset(null)}resetQuoteState(){c.resetQuoteState()}};E.styles=lt;N([m()],E.prototype,"profileName",void 0);N([m()],E.prototype,"paymentAsset",void 0);N([m()],E.prototype,"namespace",void 0);N([m()],E.prototype,"caipAddress",void 0);N([m()],E.prototype,"amount",void 0);N([m()],E.prototype,"recipient",void 0);N([m()],E.prototype,"activeConnectorIds",void 0);N([m()],E.prototype,"selectedPaymentAsset",void 0);N([m()],E.prototype,"selectedExchange",void 0);N([m()],E.prototype,"isFetchingQuote",void 0);N([m()],E.prototype,"quoteError",void 0);N([m()],E.prototype,"quote",void 0);N([m()],E.prototype,"isFetchingTokenBalances",void 0);N([m()],E.prototype,"tokenBalances",void 0);N([m()],E.prototype,"isPaymentInProgress",void 0);N([m()],E.prototype,"exchangeUrlForQuote",void 0);N([m()],E.prototype,"completedTransactionsCount",void 0);E=N([x("w3m-pay-quote-view")],E);var St=3e5;async function ut(t){return c.handleOpenPay(t)}async function Tt(t,e=St){if(e<=0)throw new d(p.INVALID_PAYMENT_CONFIG,"Timeout must be greater than 0");try{await ut(t)}catch(n){throw n instanceof d?n:new d(p.UNABLE_TO_INITIATE_PAYMENT,n.message)}return new Promise((n,r)=>{let s=!1,i=setTimeout(()=>{s||(s=!0,G(),r(new d(p.GENERIC_PAYMENT_ERROR,"Payment timeout")))},e);function a(){if(s)return;let M=c.state.currentPayment,H=c.state.error,ae=c.state.isPaymentInProgress;if(M?.status==="SUCCESS"){s=!0,G(),clearTimeout(i),n({success:!0,result:M.result});return}if(M?.status==="FAILED"){s=!0,G(),clearTimeout(i),n({success:!1,error:H||"Payment failed"});return}H&&!ae&&!M&&(s=!0,G(),clearTimeout(i),n({success:!1,error:H}))}let u=Ae("currentPayment",a),A=Ae("error",a),V=Ae("isPaymentInProgress",a),G=Ut([u,A,V]);a()})}function Ct(){return c.getExchanges()}function kt(){return c.state.currentPayment?.result}function vt(){return c.state.error}function _t(){return c.state.isPaymentInProgress}function Ae(t,e){return c.subscribeKey(t,e)}function Ut(t){return()=>{t.forEach(e=>{try{e()}catch{}})}}var ui={network:"eip155:8453",asset:"native",metadata:{name:"Ethereum",symbol:"ETH",decimals:18}},pi={network:"eip155:8453",asset:"0x833589fcd6edb6e08f4c7c32d4f71b54bda02913",metadata:{name:"USD Coin",symbol:"USDC",decimals:6}},di={network:"eip155:84532",asset:"native",metadata:{name:"Ethereum",symbol:"ETH",decimals:18}},mi={network:"eip155:1",asset:"0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",metadata:{name:"USD Coin",symbol:"USDC",decimals:6}},hi={network:"eip155:10",asset:"0x0b2c639c533813f4aa9d7837caf62653d097ff85",metadata:{name:"USD Coin",symbol:"USDC",decimals:6}},fi={network:"eip155:42161",asset:"0xaf88d065e77c8cC2239327C5EDb3A432268e5831",metadata:{name:"USD Coin",symbol:"USDC",decimals:6}},gi={network:"eip155:137",asset:"0x3c499c542cef5e3811e1192ce70d8cc03d5c3359",metadata:{name:"USD Coin",symbol:"USDC",decimals:6}},wi={network:"solana:5eykt4UsFv8P8NJdTREpY1vzqKqZKvdp",asset:"EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",metadata:{name:"USD Coin",symbol:"USDC",decimals:6}},yi={network:"eip155:1",asset:"0xdAC17F958D2ee523a2206206994597C13D831ec7",metadata:{name:"Tether USD",symbol:"USDT",decimals:6}},xi={network:"eip155:10",asset:"0x94b008aA00579c1307B0EF2c499aD98a8ce58e58",metadata:{name:"Tether USD",symbol:"USDT",decimals:6}},bi={network:"eip155:42161",asset:"0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9",metadata:{name:"Tether USD",symbol:"USDT",decimals:6}},Ei={network:"eip155:137",asset:"0xc2132d05d31c914a87c6611c10748aeb04b58e8f",metadata:{name:"Tether USD",symbol:"USDT",decimals:6}},Ai={network:"solana:5eykt4UsFv8P8NJdTREpY1vzqKqZKvdp",asset:"Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB",metadata:{name:"Tether USD",symbol:"USDT",decimals:6}},Ii={network:"solana:5eykt4UsFv8P8NJdTREpY1vzqKqZKvdp",asset:"native",metadata:{name:"Solana",symbol:"SOL",decimals:9}};export{c as a,$ as b,U as c,E as d,ut as e,Tt as f,Ct as g,kt as h,vt as i,_t as j,ui as k,pi as l,di as m,mi as n,hi as o,fi as p,gi as q,wi as r,yi as s,xi as t,bi as u,Ei as v,Ai as w,Ii as x};
