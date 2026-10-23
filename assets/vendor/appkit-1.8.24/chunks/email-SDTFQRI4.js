import{a as v}from"./chunk-4PW2BSEE.js";import"./chunk-AUPXD6D4.js";import"./chunk-NEFL7XWX.js";import"./chunk-TFRCW6O2.js";import"./chunk-V7Z5TEQE.js";import{a as D,b as W}from"./chunk-IROS5LRB.js";import"./chunk-XJGBVDZY.js";import"./chunk-CDVOKJ4X.js";import"./chunk-SL6QOQTI.js";import"./chunk-KIA2J4MP.js";import{b as d}from"./chunk-VRWQ57HX.js";import{a as R}from"./chunk-HX3PCGE2.js";import{C as E,E as V,M as m,h as A,t as S,w as u}from"./chunk-L6OIOM3D.js";import"./chunk-7YSPBAD3.js";import{H as w,I as h,P as c,T as l,V as p,ca as O,f as x,ia as I,ka as b,x as f}from"./chunk-Z6Y4EM3A.js";import"./chunk-Z54M76ZS.js";import"./chunk-WRJA7Y6R.js";import"./chunk-DT4MQDPQ.js";import"./chunk-N46RBGYQ.js";import"./chunk-U72QSA2E.js";import"./chunk-HOCAI56M.js";var j=function(n,e,t,o){var r=arguments.length,i=r<3?e:o===null?o=Object.getOwnPropertyDescriptor(e,t):o,a;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")i=Reflect.decorate(n,e,t,o);else for(var s=n.length-1;s>=0;s--)(a=n[s])&&(i=(r<3?a(i):r>3?a(e,t,i):a(e,t))||i);return r>3&&i&&Object.defineProperty(e,t,i),i},P=class extends v{constructor(){super(...arguments),this.onOtpSubmit=async e=>{try{if(this.authConnector){let t=I.state.activeChain,o=O.getConnections(t),r=w.state.remoteFeatures?.multiWallet,i=o.length>0;if(await this.authConnector.provider.connectOtp({otp:e}),c.sendEvent({type:"track",event:"EMAIL_VERIFICATION_CODE_PASS"}),t)await O.connectExternal(this.authConnector,t);else throw new Error("Active chain is not set on ChainController");if(w.state.remoteFeatures?.emailCapture)return;if(w.state.siwx){await A.isAuthenticated()&&b.close();return}if(i&&r){l.replace("ProfileWallets"),h.showSuccess("New Wallet Added");return}b.close()}}catch(t){throw c.sendEvent({type:"track",event:"EMAIL_VERIFICATION_CODE_FAIL",properties:{message:f.parseError(t)}}),t}},this.onOtpResend=async e=>{this.authConnector&&(await this.authConnector.provider.connectEmail({email:e}),c.sendEvent({type:"track",event:"EMAIL_VERIFICATION_CODE_SENT"}))}}};P=j([m("w3m-email-verify-otp-view")],P);var U=V`
  wui-icon-box {
    height: ${({spacing:n})=>n[16]};
    width: ${({spacing:n})=>n[16]};
  }
`;var N=function(n,e,t,o){var r=arguments.length,i=r<3?e:o===null?o=Object.getOwnPropertyDescriptor(e,t):o,a;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")i=Reflect.decorate(n,e,t,o);else for(var s=n.length-1;s>=0;s--)(a=n[s])&&(i=(r<3?a(i):r>3?a(e,t,i):a(e,t))||i);return r>3&&i&&Object.defineProperty(e,t,i),i},y=class extends E{constructor(){super(),this.email=l.state.data?.email,this.authConnector=p.getAuthConnector(),this.loading=!1,this.listenForDeviceApproval()}render(){if(!this.email)throw new Error("w3m-email-verify-device-view: No email provided");if(!this.authConnector)throw new Error("w3m-email-verify-device-view: No auth connector provided");return u`
      <wui-flex
        flexDirection="column"
        alignItems="center"
        .padding=${["6","3","6","3"]}
        gap="4"
      >
        <wui-icon-box size="xl" color="accent-primary" icon="sealCheck"></wui-icon-box>

        <wui-flex flexDirection="column" alignItems="center" gap="3">
          <wui-flex flexDirection="column" alignItems="center">
            <wui-text variant="md-regular" color="primary">
              Approve the login link we sent to
            </wui-text>
            <wui-text variant="md-regular" color="primary"><b>${this.email}</b></wui-text>
          </wui-flex>

          <wui-text variant="sm-regular" color="secondary" align="center">
            The code expires in 20 minutes
          </wui-text>

          <wui-flex alignItems="center" id="w3m-resend-section" gap="2">
            <wui-text variant="sm-regular" color="primary" align="center">
              Didn't receive it?
            </wui-text>
            <wui-link @click=${this.onResendCode.bind(this)} .disabled=${this.loading}>
              Resend email
            </wui-link>
          </wui-flex>
        </wui-flex>
      </wui-flex>
    `}async listenForDeviceApproval(){if(this.authConnector)try{await this.authConnector.provider.connectDevice(),c.sendEvent({type:"track",event:"DEVICE_REGISTERED_FOR_EMAIL"}),c.sendEvent({type:"track",event:"EMAIL_VERIFICATION_CODE_SENT"}),l.replace("EmailVerifyOtp",{email:this.email})}catch{l.goBack()}}async onResendCode(){try{if(!this.loading){if(!this.authConnector||!this.email)throw new Error("w3m-email-login-widget: Unable to resend email");this.loading=!0,await this.authConnector.provider.connectEmail({email:this.email}),this.listenForDeviceApproval(),h.showSuccess("Code email resent")}}catch(e){h.showError(e)}finally{this.loading=!1}}};y.styles=U;N([d()],y.prototype,"loading",void 0);y=N([m("w3m-email-verify-device-view")],y);var T=S`
  wui-email-input {
    width: 100%;
  }

  form {
    width: 100%;
    display: block;
    position: relative;
  }
`;var g=function(n,e,t,o){var r=arguments.length,i=r<3?e:o===null?o=Object.getOwnPropertyDescriptor(e,t):o,a;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")i=Reflect.decorate(n,e,t,o);else for(var s=n.length-1;s>=0;s--)(a=n[s])&&(i=(r<3?a(i):r>3?a(e,t,i):a(e,t))||i);return r>3&&i&&Object.defineProperty(e,t,i),i},C=class extends E{constructor(){super(...arguments),this.formRef=D(),this.initialEmail=l.state.data?.email??"",this.redirectView=l.state.data?.redirectView,this.email="",this.loading=!1}firstUpdated(){this.formRef.value?.addEventListener("keydown",e=>{e.key==="Enter"&&this.onSubmitEmail(e)})}render(){return u`
      <wui-flex flexDirection="column" padding="4" gap="4">
        <form ${W(this.formRef)} @submit=${this.onSubmitEmail.bind(this)}>
          <wui-email-input
            value=${this.initialEmail}
            .disabled=${this.loading}
            @inputChange=${this.onEmailInputChange.bind(this)}
          >
          </wui-email-input>
          <input type="submit" hidden />
        </form>
        ${this.buttonsTemplate()}
      </wui-flex>
    `}onEmailInputChange(e){this.email=e.detail}async onSubmitEmail(e){try{if(this.loading)return;this.loading=!0,e.preventDefault();let t=p.getAuthConnector();if(!t)throw new Error("w3m-update-email-wallet: Auth connector not found");let o=await t.provider.updateEmail({email:this.email});c.sendEvent({type:"track",event:"EMAIL_EDIT"}),o.action==="VERIFY_SECONDARY_OTP"?l.push("UpdateEmailSecondaryOtp",{email:this.initialEmail,newEmail:this.email,redirectView:this.redirectView}):l.push("UpdateEmailPrimaryOtp",{email:this.initialEmail,newEmail:this.email,redirectView:this.redirectView})}catch(t){h.showError(t),this.loading=!1}}buttonsTemplate(){let e=!this.loading&&this.email.length>3&&this.email!==this.initialEmail;return this.redirectView?u`
      <wui-flex gap="3">
        <wui-button size="md" variant="neutral" fullWidth @click=${l.goBack}>
          Cancel
        </wui-button>

        <wui-button
          size="md"
          variant="accent-primary"
          fullWidth
          @click=${this.onSubmitEmail.bind(this)}
          .disabled=${!e}
          .loading=${this.loading}
        >
          Save
        </wui-button>
      </wui-flex>
    `:u`
        <wui-button
          size="md"
          variant="accent-primary"
          fullWidth
          @click=${this.onSubmitEmail.bind(this)}
          .disabled=${!e}
          .loading=${this.loading}
        >
          Save
        </wui-button>
      `}};C.styles=T;g([d()],C.prototype,"email",void 0);g([d()],C.prototype,"loading",void 0);C=g([m("w3m-update-email-wallet-view")],C);var M=function(n,e,t,o){var r=arguments.length,i=r<3?e:o===null?o=Object.getOwnPropertyDescriptor(e,t):o,a;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")i=Reflect.decorate(n,e,t,o);else for(var s=n.length-1;s>=0;s--)(a=n[s])&&(i=(r<3?a(i):r>3?a(e,t,i):a(e,t))||i);return r>3&&i&&Object.defineProperty(e,t,i),i},$=class extends v{constructor(){super(),this.email=l.state.data?.email,this.onOtpSubmit=async e=>{try{this.authConnector&&(await this.authConnector.provider.updateEmailPrimaryOtp({otp:e}),c.sendEvent({type:"track",event:"EMAIL_VERIFICATION_CODE_PASS"}),l.replace("UpdateEmailSecondaryOtp",l.state.data))}catch(t){throw c.sendEvent({type:"track",event:"EMAIL_VERIFICATION_CODE_FAIL",properties:{message:f.parseError(t)}}),t}},this.onStartOver=()=>{l.replace("UpdateEmailWallet",l.state.data)}}};$=M([m("w3m-update-email-primary-otp-view")],$);var H=function(n,e,t,o){var r=arguments.length,i=r<3?e:o===null?o=Object.getOwnPropertyDescriptor(e,t):o,a;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")i=Reflect.decorate(n,e,t,o);else for(var s=n.length-1;s>=0;s--)(a=n[s])&&(i=(r<3?a(i):r>3?a(e,t,i):a(e,t))||i);return r>3&&i&&Object.defineProperty(e,t,i),i},F=class extends v{constructor(){super(),this.email=l.state.data?.newEmail,this.redirectView=l.state.data?.redirectView,this.onOtpSubmit=async e=>{try{this.authConnector&&(await this.authConnector.provider.updateEmailSecondaryOtp({otp:e}),c.sendEvent({type:"track",event:"EMAIL_VERIFICATION_CODE_PASS"}),this.redirectView&&l.reset(this.redirectView))}catch(t){throw c.sendEvent({type:"track",event:"EMAIL_VERIFICATION_CODE_FAIL",properties:{message:f.parseError(t)}}),t}},this.onStartOver=()=>{l.replace("UpdateEmailWallet",l.state.data)}}};F=H([m("w3m-update-email-secondary-otp-view")],F);var L=function(n,e,t,o){var r=arguments.length,i=r<3?e:o===null?o=Object.getOwnPropertyDescriptor(e,t):o,a;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")i=Reflect.decorate(n,e,t,o);else for(var s=n.length-1;s>=0;s--)(a=n[s])&&(i=(r<3?a(i):r>3?a(e,t,i):a(e,t))||i);return r>3&&i&&Object.defineProperty(e,t,i),i},_=class extends E{constructor(){super(),this.authConnector=p.getAuthConnector(),this.isEmailEnabled=w.state.remoteFeatures?.email,this.isAuthEnabled=this.checkIfAuthEnabled(p.state.connectors),this.connectors=p.state.connectors,p.subscribeKey("connectors",e=>{this.connectors=e,this.isAuthEnabled=this.checkIfAuthEnabled(this.connectors)})}render(){if(!this.isEmailEnabled)throw new Error("w3m-email-login-view: Email is not enabled");if(!this.isAuthEnabled)throw new Error("w3m-email-login-view: No auth connector provided");return u`<wui-flex flexDirection="column" .padding=${["1","3","3","3"]} gap="4">
      <w3m-email-login-widget></w3m-email-login-widget>
    </wui-flex> `}checkIfAuthEnabled(e){let t=e.filter(r=>r.type===R.CONNECTOR_TYPE_AUTH).map(r=>r.chain);return x.AUTH_CONNECTOR_SUPPORTED_CHAINS.some(r=>t.includes(r))}};L([d()],_.prototype,"connectors",void 0);_=L([m("w3m-email-login-view")],_);export{_ as W3mEmailLoginView,v as W3mEmailOtpWidget,y as W3mEmailVerifyDeviceView,P as W3mEmailVerifyOtpView,$ as W3mUpdateEmailPrimaryOtpView,F as W3mUpdateEmailSecondaryOtpView,C as W3mUpdateEmailWalletView};
