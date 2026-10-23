import{a as m,b as h}from"./chunk-VRWQ57HX.js";import{C as p,E as S,I as b,J as L,K as E,M as c,t as w,w as u}from"./chunk-L6OIOM3D.js";import{A as g,I as x,T as P,V as I,x as C}from"./chunk-Z6Y4EM3A.js";var R=S`
  :host {
    position: relative;
    display: inline-block;
  }

  input {
    width: 48px;
    height: 48px;
    background: ${({tokens:i})=>i.theme.foregroundPrimary};
    border-radius: ${({borderRadius:i})=>i[4]};
    border: 1px solid ${({tokens:i})=>i.theme.borderPrimary};
    font-family: ${({fontFamily:i})=>i.regular};
    font-size: ${({textSize:i})=>i.large};
    line-height: 18px;
    letter-spacing: -0.16px;
    text-align: center;
    color: ${({tokens:i})=>i.theme.textPrimary};
    caret-color: ${({tokens:i})=>i.core.textAccentPrimary};
    transition:
      background-color ${({durations:i})=>i.lg}
        ${({easings:i})=>i["ease-out-power-2"]},
      border-color ${({durations:i})=>i.lg}
        ${({easings:i})=>i["ease-out-power-2"]},
      box-shadow ${({durations:i})=>i.lg}
        ${({easings:i})=>i["ease-out-power-2"]};
    will-change: background-color, border-color, box-shadow;
    box-sizing: border-box;
    -webkit-appearance: none;
    -moz-appearance: textfield;
    padding: ${({spacing:i})=>i[4]};
  }

  input::-webkit-outer-spin-button,
  input::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }

  input[type='number'] {
    -moz-appearance: textfield;
  }

  input:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }

  input:focus-visible:enabled {
    background-color: transparent;
    border: 1px solid ${({tokens:i})=>i.theme.borderSecondary};
    box-shadow: 0px 0px 0px 4px ${({tokens:i})=>i.core.foregroundAccent040};
  }
`;var $=function(i,t,e,o){var n=arguments.length,r=n<3?t:o===null?o=Object.getOwnPropertyDescriptor(t,e):o,s;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")r=Reflect.decorate(i,t,e,o);else for(var l=i.length-1;l>=0;l--)(s=i[l])&&(r=(n<3?s(r):n>3?s(t,e,r):s(t,e))||r);return n>3&&r&&Object.defineProperty(t,e,r),r},f=class extends p{constructor(){super(...arguments),this.disabled=!1,this.value=""}render(){return u`<input
      type="number"
      maxlength="1"
      inputmode="numeric"
      autofocus
      ?disabled=${this.disabled}
      value=${this.value}
    /> `}};f.styles=[b,L,R];$([m({type:Boolean})],f.prototype,"disabled",void 0);$([m({type:String})],f.prototype,"value",void 0);f=$([c("wui-input-numeric")],f);var _=w`
  :host {
    position: relative;
    display: block;
  }
`;var v=function(i,t,e,o){var n=arguments.length,r=n<3?t:o===null?o=Object.getOwnPropertyDescriptor(t,e):o,s;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")r=Reflect.decorate(i,t,e,o);else for(var l=i.length-1;l>=0;l--)(s=i[l])&&(r=(n<3?s(r):n>3?s(t,e,r):s(t,e))||r);return n>3&&r&&Object.defineProperty(t,e,r),r},d=class extends p{constructor(){super(...arguments),this.length=6,this.otp="",this.values=Array.from({length:this.length}).map(()=>""),this.numerics=[],this.shouldInputBeEnabled=t=>this.values.slice(0,t).every(o=>o!==""),this.handleKeyDown=(t,e)=>{let o=t.target,n=this.getInputElement(o),r=["ArrowLeft","ArrowRight","Shift","Delete"];if(!n)return;r.includes(t.key)&&t.preventDefault();let s=n.selectionStart;switch(t.key){case"ArrowLeft":s&&n.setSelectionRange(s+1,s+1),this.focusInputField("prev",e);break;case"ArrowRight":this.focusInputField("next",e);break;case"Shift":this.focusInputField("next",e);break;case"Delete":n.value===""?this.focusInputField("prev",e):this.updateInput(n,e,"");break;case"Backspace":n.value===""?this.focusInputField("prev",e):this.updateInput(n,e,"");break;default:}},this.focusInputField=(t,e)=>{if(t==="next"){let o=e+1;if(!this.shouldInputBeEnabled(o))return;let n=this.numerics[o<this.length?o:e],r=n?this.getInputElement(n):void 0;r&&(r.disabled=!1,r.focus())}if(t==="prev"){let o=e-1,n=this.numerics[o>-1?o:e],r=n?this.getInputElement(n):void 0;r&&r.focus()}}}firstUpdated(){this.otp&&(this.values=this.otp.split(""));let t=this.shadowRoot?.querySelectorAll("wui-input-numeric");t&&(this.numerics=Array.from(t)),this.numerics[0]?.focus()}render(){return u`
      <wui-flex gap="1" data-testid="wui-otp-input">
        ${Array.from({length:this.length}).map((t,e)=>u`
            <wui-input-numeric
              @input=${o=>this.handleInput(o,e)}
              @click=${o=>this.selectInput(o)}
              @keydown=${o=>this.handleKeyDown(o,e)}
              .disabled=${!this.shouldInputBeEnabled(e)}
              .value=${this.values[e]||""}
            >
            </wui-input-numeric>
          `)}
      </wui-flex>
    `}updateInput(t,e,o){let n=this.numerics[e],r=t||(n?this.getInputElement(n):void 0);r&&(r.value=o,this.values=this.values.map((s,l)=>l===e?o:s))}selectInput(t){let e=t.target;e&&this.getInputElement(e)?.select()}handleInput(t,e){let o=t.target,n=this.getInputElement(o);if(n){let r=n.value;t.inputType==="insertFromPaste"?this.handlePaste(n,r,e):E.isNumber(r)&&t.data?(this.updateInput(n,e,t.data),this.focusInputField("next",e)):this.updateInput(n,e,"")}this.dispatchInputChangeEvent()}handlePaste(t,e,o){let n=e[0];if(n&&E.isNumber(n)){this.updateInput(t,o,n);let s=e.substring(1);if(o+1<this.length&&s.length){let l=this.numerics[o+1],O=l?this.getInputElement(l):void 0;O&&this.handlePaste(O,s,o+1)}else this.focusInputField("next",o)}else this.updateInput(t,o,"")}getInputElement(t){return t.shadowRoot?.querySelector("input")?t.shadowRoot.querySelector("input"):null}dispatchInputChangeEvent(){let t=this.values.join("");this.dispatchEvent(new CustomEvent("inputChange",{detail:t,bubbles:!0,composed:!0}))}};d.styles=[b,_];v([m({type:Number})],d.prototype,"length",void 0);v([m({type:String})],d.prototype,"otp",void 0);v([h()],d.prototype,"values",void 0);d=v([c("wui-otp")],d);var k=w`
  wui-loading-spinner {
    margin: 9px auto;
  }

  .email-display,
  .email-display wui-text {
    max-width: 100%;
  }
`;var y=function(i,t,e,o){var n=arguments.length,r=n<3?t:o===null?o=Object.getOwnPropertyDescriptor(t,e):o,s;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")r=Reflect.decorate(i,t,e,o);else for(var l=i.length-1;l>=0;l--)(s=i[l])&&(r=(n<3?s(r):n>3?s(t,e,r):s(t,e))||r);return n>3&&r&&Object.defineProperty(t,e,r),r},T,a=T=class extends p{firstUpdated(){this.startOTPTimeout()}disconnectedCallback(){clearTimeout(this.OTPTimeout)}constructor(){super(),this.loading=!1,this.timeoutTimeLeft=g.getTimeToNextEmailLogin(),this.error="",this.otp="",this.email=P.state.data?.email,this.authConnector=I.getAuthConnector()}render(){if(!this.email)throw new Error("w3m-email-otp-widget: No email provided");let t=!!this.timeoutTimeLeft,e=this.getFooterLabels(t);return u`
      <wui-flex
        flexDirection="column"
        alignItems="center"
        .padding=${["4","0","4","0"]}
        gap="4"
      >
        <wui-flex
          class="email-display"
          flexDirection="column"
          alignItems="center"
          .padding=${["0","5","0","5"]}
        >
          <wui-text variant="md-regular" color="primary" align="center">
            Enter the code we sent to
          </wui-text>
          <wui-text variant="md-medium" color="primary" lineClamp="1" align="center">
            ${this.email}
          </wui-text>
        </wui-flex>

        <wui-text variant="sm-regular" color="secondary">The code expires in 20 minutes</wui-text>

        ${this.loading?u`<wui-loading-spinner size="xl" color="accent-primary"></wui-loading-spinner>`:u` <wui-flex flexDirection="column" alignItems="center" gap="2">
              <wui-otp
                dissabled
                length="6"
                @inputChange=${this.onOtpInputChange.bind(this)}
                .otp=${this.otp}
              ></wui-otp>
              ${this.error?u`
                    <wui-text variant="sm-regular" align="center" color="error">
                      ${this.error}. Try Again
                    </wui-text>
                  `:null}
            </wui-flex>`}

        <wui-flex alignItems="center" gap="2">
          <wui-text variant="sm-regular" color="secondary">${e.title}</wui-text>
          <wui-link @click=${this.onResendCode.bind(this)} .disabled=${t}>
            ${e.action}
          </wui-link>
        </wui-flex>
      </wui-flex>
    `}startOTPTimeout(){this.timeoutTimeLeft=g.getTimeToNextEmailLogin(),this.OTPTimeout=setInterval(()=>{this.timeoutTimeLeft>0?this.timeoutTimeLeft=g.getTimeToNextEmailLogin():clearInterval(this.OTPTimeout)},1e3)}async onOtpInputChange(t){try{this.loading||(this.otp=t.detail,this.shouldSubmitOnOtpChange()&&(this.loading=!0,await this.onOtpSubmit?.(this.otp)))}catch(e){this.error=C.parseError(e),this.loading=!1}}async onResendCode(){try{if(this.onOtpResend){if(!this.loading&&!this.timeoutTimeLeft){if(this.error="",this.otp="",!I.getAuthConnector()||!this.email)throw new Error("w3m-email-otp-widget: Unable to resend email");this.loading=!0,await this.onOtpResend(this.email),this.startOTPTimeout(),x.showSuccess("Code email resent")}}else this.onStartOver&&this.onStartOver()}catch(t){x.showError(t)}finally{this.loading=!1}}getFooterLabels(t){return this.onStartOver?{title:"Something wrong?",action:`Try again ${t?`in ${this.timeoutTimeLeft}s`:""}`}:{title:"Didn't receive it?",action:`Resend ${t?`in ${this.timeoutTimeLeft}s`:"Code"}`}}shouldSubmitOnOtpChange(){return this.authConnector&&this.otp.length===T.OTP_LENGTH}};a.OTP_LENGTH=6;a.styles=k;y([h()],a.prototype,"loading",void 0);y([h()],a.prototype,"timeoutTimeLeft",void 0);y([h()],a.prototype,"error",void 0);a=T=y([c("w3m-email-otp-widget")],a);export{a};
