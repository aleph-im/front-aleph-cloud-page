"use strict";(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[3419],{33419:(e,t,i)=>{i.r(t),i.d(t,{W3mEmailLoginView:()=>T,W3mEmailOtpWidget:()=>p.H,W3mEmailVerifyDeviceView:()=>E,W3mEmailVerifyOtpView:()=>m,W3mUpdateEmailPrimaryOtpView:()=>C,W3mUpdateEmailSecondaryOtpView:()=>A,W3mUpdateEmailWalletView:()=>O});var r=i(933),n=i(26064),a=i(59390),o=i(24101),l=i(84443),s=i(24417),c=i(51105),u=i(82570),h=i(21159),d=i(44458),p=i(71927);let m=class extends p.H{constructor(){super(...arguments),this.onOtpSubmit=async e=>{try{if(this.authConnector){let t=r.W.state.activeChain,i=n.x.getConnections(t),h=a.H.state.remoteFeatures?.multiWallet,d=i.length>0;if(await this.authConnector.provider.connectOtp({otp:e}),o.E.sendEvent({type:"track",event:"EMAIL_VERIFICATION_CODE_PASS"}),t)await n.x.connectExternal(this.authConnector,t);else throw Error("Active chain is not set on ChainController");if(a.H.state.remoteFeatures?.emailCapture)return;if(a.H.state.siwx){await l.U.isAuthenticated()&&s.W.close();return}if(d&&h){c.I.replace("ProfileWallets"),u.P.showSuccess("New Wallet Added");return}s.W.close()}}catch(e){throw o.E.sendEvent({type:"track",event:"EMAIL_VERIFICATION_CODE_FAIL",properties:{message:h.w.parseError(e)}}),e}},this.onOtpResend=async e=>{this.authConnector&&(await this.authConnector.provider.connectEmail({email:e}),o.E.sendEvent({type:"track",event:"EMAIL_VERIFICATION_CODE_SENT"}))}}};m=function(e,t,i,r){var n,a=arguments.length,o=a<3?t:null===r?r=Object.getOwnPropertyDescriptor(t,i):r;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)o=Reflect.decorate(e,t,i,r);else for(var l=e.length-1;l>=0;l--)(n=e[l])&&(o=(a<3?n(o):a>3?n(t,i,o):n(t,i))||o);return a>3&&o&&Object.defineProperty(t,i,o),o}([(0,d.EM)("w3m-email-verify-otp-view")],m);var f=i(1850),w=i(58446),g=i(70803);i(85479),i(8285),i(83416),i(60347);let v=(0,d.AH)`
  wui-icon-box {
    height: ${({spacing:e})=>e["16"]};
    width: ${({spacing:e})=>e["16"]};
  }
`;var y=function(e,t,i,r){var n,a=arguments.length,o=a<3?t:null===r?r=Object.getOwnPropertyDescriptor(t,i):r;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)o=Reflect.decorate(e,t,i,r);else for(var l=e.length-1;l>=0;l--)(n=e[l])&&(o=(a<3?n(o):a>3?n(t,i,o):n(t,i))||o);return a>3&&o&&Object.defineProperty(t,i,o),o};let E=class extends f.WF{constructor(){super(),this.email=c.I.state.data?.email,this.authConnector=g.a.getAuthConnector(),this.loading=!1,this.listenForDeviceApproval()}render(){if(!this.email)throw Error("w3m-email-verify-device-view: No email provided");if(!this.authConnector)throw Error("w3m-email-verify-device-view: No auth connector provided");return(0,f.qy)`
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
    `}async listenForDeviceApproval(){if(this.authConnector)try{await this.authConnector.provider.connectDevice(),o.E.sendEvent({type:"track",event:"DEVICE_REGISTERED_FOR_EMAIL"}),o.E.sendEvent({type:"track",event:"EMAIL_VERIFICATION_CODE_SENT"}),c.I.replace("EmailVerifyOtp",{email:this.email})}catch(e){c.I.goBack()}}async onResendCode(){try{if(!this.loading){if(!this.authConnector||!this.email)throw Error("w3m-email-login-widget: Unable to resend email");this.loading=!0,await this.authConnector.provider.connectEmail({email:this.email}),this.listenForDeviceApproval(),u.P.showSuccess("Code email resent")}}catch(e){u.P.showError(e)}finally{this.loading=!1}}};E.styles=v,y([(0,w.wk)()],E.prototype,"loading",void 0),E=y([(0,d.EM)("w3m-email-verify-device-view")],E);var b=i(40438);i(34556),i(17598);let I=(0,f.AH)`
  wui-email-input {
    width: 100%;
  }

  form {
    width: 100%;
    display: block;
    position: relative;
  }
`;var x=function(e,t,i,r){var n,a=arguments.length,o=a<3?t:null===r?r=Object.getOwnPropertyDescriptor(t,i):r;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)o=Reflect.decorate(e,t,i,r);else for(var l=e.length-1;l>=0;l--)(n=e[l])&&(o=(a<3?n(o):a>3?n(t,i,o):n(t,i))||o);return a>3&&o&&Object.defineProperty(t,i,o),o};let O=class extends f.WF{constructor(){super(...arguments),this.formRef=(0,b._)(),this.initialEmail=c.I.state.data?.email??"",this.redirectView=c.I.state.data?.redirectView,this.email="",this.loading=!1}firstUpdated(){this.formRef.value?.addEventListener("keydown",e=>{"Enter"===e.key&&this.onSubmitEmail(e)})}render(){return(0,f.qy)`
      <wui-flex flexDirection="column" padding="4" gap="4">
        <form ${(0,b.K)(this.formRef)} @submit=${this.onSubmitEmail.bind(this)}>
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
    `}onEmailInputChange(e){this.email=e.detail}async onSubmitEmail(e){try{if(this.loading)return;this.loading=!0,e.preventDefault();let t=g.a.getAuthConnector();if(!t)throw Error("w3m-update-email-wallet: Auth connector not found");let i=await t.provider.updateEmail({email:this.email});o.E.sendEvent({type:"track",event:"EMAIL_EDIT"}),"VERIFY_SECONDARY_OTP"===i.action?c.I.push("UpdateEmailSecondaryOtp",{email:this.initialEmail,newEmail:this.email,redirectView:this.redirectView}):c.I.push("UpdateEmailPrimaryOtp",{email:this.initialEmail,newEmail:this.email,redirectView:this.redirectView})}catch(e){u.P.showError(e),this.loading=!1}}buttonsTemplate(){let e=!this.loading&&this.email.length>3&&this.email!==this.initialEmail;return this.redirectView?(0,f.qy)`
      <wui-flex gap="3">
        <wui-button size="md" variant="neutral" fullWidth @click=${c.I.goBack}>
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
    `:(0,f.qy)`
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
      `}};O.styles=I,x([(0,w.wk)()],O.prototype,"email",void 0),x([(0,w.wk)()],O.prototype,"loading",void 0),O=x([(0,d.EM)("w3m-update-email-wallet-view")],O);let C=class extends p.H{constructor(){super(),this.email=c.I.state.data?.email,this.onOtpSubmit=async e=>{try{this.authConnector&&(await this.authConnector.provider.updateEmailPrimaryOtp({otp:e}),o.E.sendEvent({type:"track",event:"EMAIL_VERIFICATION_CODE_PASS"}),c.I.replace("UpdateEmailSecondaryOtp",c.I.state.data))}catch(e){throw o.E.sendEvent({type:"track",event:"EMAIL_VERIFICATION_CODE_FAIL",properties:{message:h.w.parseError(e)}}),e}},this.onStartOver=()=>{c.I.replace("UpdateEmailWallet",c.I.state.data)}}};C=function(e,t,i,r){var n,a=arguments.length,o=a<3?t:null===r?r=Object.getOwnPropertyDescriptor(t,i):r;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)o=Reflect.decorate(e,t,i,r);else for(var l=e.length-1;l>=0;l--)(n=e[l])&&(o=(a<3?n(o):a>3?n(t,i,o):n(t,i))||o);return a>3&&o&&Object.defineProperty(t,i,o),o}([(0,d.EM)("w3m-update-email-primary-otp-view")],C);let A=class extends p.H{constructor(){super(),this.email=c.I.state.data?.newEmail,this.redirectView=c.I.state.data?.redirectView,this.onOtpSubmit=async e=>{try{this.authConnector&&(await this.authConnector.provider.updateEmailSecondaryOtp({otp:e}),o.E.sendEvent({type:"track",event:"EMAIL_VERIFICATION_CODE_PASS"}),this.redirectView&&c.I.reset(this.redirectView))}catch(e){throw o.E.sendEvent({type:"track",event:"EMAIL_VERIFICATION_CODE_FAIL",properties:{message:h.w.parseError(e)}}),e}},this.onStartOver=()=>{c.I.replace("UpdateEmailWallet",c.I.state.data)}}};A=function(e,t,i,r){var n,a=arguments.length,o=a<3?t:null===r?r=Object.getOwnPropertyDescriptor(t,i):r;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)o=Reflect.decorate(e,t,i,r);else for(var l=e.length-1;l>=0;l--)(n=e[l])&&(o=(a<3?n(o):a>3?n(t,i,o):n(t,i))||o);return a>3&&o&&Object.defineProperty(t,i,o),o}([(0,d.EM)("w3m-update-email-secondary-otp-view")],A);var R=i(96853),$=i(87543),k=function(e,t,i,r){var n,a=arguments.length,o=a<3?t:null===r?r=Object.getOwnPropertyDescriptor(t,i):r;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)o=Reflect.decorate(e,t,i,r);else for(var l=e.length-1;l>=0;l--)(n=e[l])&&(o=(a<3?n(o):a>3?n(t,i,o):n(t,i))||o);return a>3&&o&&Object.defineProperty(t,i,o),o};let T=class extends f.WF{constructor(){super(),this.authConnector=g.a.getAuthConnector(),this.isEmailEnabled=a.H.state.remoteFeatures?.email,this.isAuthEnabled=this.checkIfAuthEnabled(g.a.state.connectors),this.connectors=g.a.state.connectors,g.a.subscribeKey("connectors",e=>{this.connectors=e,this.isAuthEnabled=this.checkIfAuthEnabled(this.connectors)})}render(){if(!this.isEmailEnabled)throw Error("w3m-email-login-view: Email is not enabled");if(!this.isAuthEnabled)throw Error("w3m-email-login-view: No auth connector provided");return(0,f.qy)`<wui-flex flexDirection="column" .padding=${["1","3","3","3"]} gap="4">
      <w3m-email-login-widget></w3m-email-login-widget>
    </wui-flex> `}checkIfAuthEnabled(e){let t=e.filter(e=>e.type===$.o.CONNECTOR_TYPE_AUTH).map(e=>e.chain);return R.o.AUTH_CONNECTOR_SUPPORTED_CHAINS.some(e=>t.includes(e))}};k([(0,w.wk)()],T.prototype,"connectors",void 0),T=k([(0,d.EM)("w3m-email-login-view")],T)},71927:(e,t,i)=>{i.d(t,{H:()=>O});var r,n=i(1850),a=i(58446),o=i(51105),l=i(70803),s=i(21159),c=i(82570),u=i(44458);i(85479),i(83416),i(17244),i(18341);var h=i(54684),d=i(86833),p=i(51127),m=i(41608);let f=(0,m.AH)`
  :host {
    position: relative;
    display: inline-block;
  }

  input {
    width: 48px;
    height: 48px;
    background: ${({tokens:e})=>e.theme.foregroundPrimary};
    border-radius: ${({borderRadius:e})=>e[4]};
    border: 1px solid ${({tokens:e})=>e.theme.borderPrimary};
    font-family: ${({fontFamily:e})=>e.regular};
    font-size: ${({textSize:e})=>e.large};
    line-height: 18px;
    letter-spacing: -0.16px;
    text-align: center;
    color: ${({tokens:e})=>e.theme.textPrimary};
    caret-color: ${({tokens:e})=>e.core.textAccentPrimary};
    transition:
      background-color ${({durations:e})=>e.lg}
        ${({easings:e})=>e["ease-out-power-2"]},
      border-color ${({durations:e})=>e.lg}
        ${({easings:e})=>e["ease-out-power-2"]},
      box-shadow ${({durations:e})=>e.lg}
        ${({easings:e})=>e["ease-out-power-2"]};
    will-change: background-color, border-color, box-shadow;
    box-sizing: border-box;
    -webkit-appearance: none;
    -moz-appearance: textfield;
    padding: ${({spacing:e})=>e[4]};
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
    border: 1px solid ${({tokens:e})=>e.theme.borderSecondary};
    box-shadow: 0px 0px 0px 4px ${({tokens:e})=>e.core.foregroundAccent040};
  }
`;var w=function(e,t,i,r){var n,a=arguments.length,o=a<3?t:null===r?r=Object.getOwnPropertyDescriptor(t,i):r;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)o=Reflect.decorate(e,t,i,r);else for(var l=e.length-1;l>=0;l--)(n=e[l])&&(o=(a<3?n(o):a>3?n(t,i,o):n(t,i))||o);return a>3&&o&&Object.defineProperty(t,i,o),o};let g=class extends n.WF{constructor(){super(...arguments),this.disabled=!1,this.value=""}render(){return(0,n.qy)`<input
      type="number"
      maxlength="1"
      inputmode="numeric"
      autofocus
      ?disabled=${this.disabled}
      value=${this.value}
    /> `}};g.styles=[h.W5,h.fD,f],w([(0,a.MZ)({type:Boolean})],g.prototype,"disabled",void 0),w([(0,a.MZ)({type:String})],g.prototype,"value",void 0),g=w([(0,p.E)("wui-input-numeric")],g);let v=(0,n.AH)`
  :host {
    position: relative;
    display: block;
  }
`;var y=function(e,t,i,r){var n,a=arguments.length,o=a<3?t:null===r?r=Object.getOwnPropertyDescriptor(t,i):r;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)o=Reflect.decorate(e,t,i,r);else for(var l=e.length-1;l>=0;l--)(n=e[l])&&(o=(a<3?n(o):a>3?n(t,i,o):n(t,i))||o);return a>3&&o&&Object.defineProperty(t,i,o),o};let E=class extends n.WF{constructor(){super(...arguments),this.length=6,this.otp="",this.values=Array.from({length:this.length}).map(()=>""),this.numerics=[],this.shouldInputBeEnabled=e=>this.values.slice(0,e).every(e=>""!==e),this.handleKeyDown=(e,t)=>{let i=e.target,r=this.getInputElement(i);if(!r)return;["ArrowLeft","ArrowRight","Shift","Delete"].includes(e.key)&&e.preventDefault();let n=r.selectionStart;switch(e.key){case"ArrowLeft":n&&r.setSelectionRange(n+1,n+1),this.focusInputField("prev",t);break;case"ArrowRight":case"Shift":this.focusInputField("next",t);break;case"Delete":case"Backspace":""===r.value?this.focusInputField("prev",t):this.updateInput(r,t,"")}},this.focusInputField=(e,t)=>{if("next"===e){let e=t+1;if(!this.shouldInputBeEnabled(e))return;let i=this.numerics[e<this.length?e:t],r=i?this.getInputElement(i):void 0;r&&(r.disabled=!1,r.focus())}if("prev"===e){let e=t-1,i=this.numerics[e>-1?e:t],r=i?this.getInputElement(i):void 0;r&&r.focus()}}}firstUpdated(){this.otp&&(this.values=this.otp.split(""));let e=this.shadowRoot?.querySelectorAll("wui-input-numeric");e&&(this.numerics=Array.from(e)),this.numerics[0]?.focus()}render(){return(0,n.qy)`
      <wui-flex gap="1" data-testid="wui-otp-input">
        ${Array.from({length:this.length}).map((e,t)=>(0,n.qy)`
            <wui-input-numeric
              @input=${e=>this.handleInput(e,t)}
              @click=${e=>this.selectInput(e)}
              @keydown=${e=>this.handleKeyDown(e,t)}
              .disabled=${!this.shouldInputBeEnabled(t)}
              .value=${this.values[t]||""}
            >
            </wui-input-numeric>
          `)}
      </wui-flex>
    `}updateInput(e,t,i){let r=this.numerics[t],n=e||(r?this.getInputElement(r):void 0);n&&(n.value=i,this.values=this.values.map((e,r)=>r===t?i:e))}selectInput(e){let t=e.target;if(t){let e=this.getInputElement(t);e?.select()}}handleInput(e,t){let i=e.target,r=this.getInputElement(i);if(r){let i=r.value;"insertFromPaste"===e.inputType?this.handlePaste(r,i,t):d.Z.isNumber(i)&&e.data?(this.updateInput(r,t,e.data),this.focusInputField("next",t)):this.updateInput(r,t,"")}this.dispatchInputChangeEvent()}handlePaste(e,t,i){let r=t[0];if(r&&d.Z.isNumber(r)){this.updateInput(e,i,r);let n=t.substring(1);if(i+1<this.length&&n.length){let e=this.numerics[i+1],t=e?this.getInputElement(e):void 0;t&&this.handlePaste(t,n,i+1)}else this.focusInputField("next",i)}else this.updateInput(e,i,"")}getInputElement(e){return e.shadowRoot?.querySelector("input")?e.shadowRoot.querySelector("input"):null}dispatchInputChangeEvent(){let e=this.values.join("");this.dispatchEvent(new CustomEvent("inputChange",{detail:e,bubbles:!0,composed:!0}))}};E.styles=[h.W5,v],y([(0,a.MZ)({type:Number})],E.prototype,"length",void 0),y([(0,a.MZ)({type:String})],E.prototype,"otp",void 0),y([(0,a.wk)()],E.prototype,"values",void 0),E=y([(0,p.E)("wui-otp")],E),i(60347);var b=i(85563);let I=(0,n.AH)`
  wui-loading-spinner {
    margin: 9px auto;
  }

  .email-display,
  .email-display wui-text {
    max-width: 100%;
  }
`;var x=function(e,t,i,r){var n,a=arguments.length,o=a<3?t:null===r?r=Object.getOwnPropertyDescriptor(t,i):r;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)o=Reflect.decorate(e,t,i,r);else for(var l=e.length-1;l>=0;l--)(n=e[l])&&(o=(a<3?n(o):a>3?n(t,i,o):n(t,i))||o);return a>3&&o&&Object.defineProperty(t,i,o),o};let O=r=class extends n.WF{firstUpdated(){this.startOTPTimeout()}disconnectedCallback(){clearTimeout(this.OTPTimeout)}constructor(){super(),this.loading=!1,this.timeoutTimeLeft=b.Q.getTimeToNextEmailLogin(),this.error="",this.otp="",this.email=o.I.state.data?.email,this.authConnector=l.a.getAuthConnector()}render(){if(!this.email)throw Error("w3m-email-otp-widget: No email provided");let e=!!this.timeoutTimeLeft,t=this.getFooterLabels(e);return(0,n.qy)`
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

        ${this.loading?(0,n.qy)`<wui-loading-spinner size="xl" color="accent-primary"></wui-loading-spinner>`:(0,n.qy)` <wui-flex flexDirection="column" alignItems="center" gap="2">
              <wui-otp
                dissabled
                length="6"
                @inputChange=${this.onOtpInputChange.bind(this)}
                .otp=${this.otp}
              ></wui-otp>
              ${this.error?(0,n.qy)`
                    <wui-text variant="sm-regular" align="center" color="error">
                      ${this.error}. Try Again
                    </wui-text>
                  `:null}
            </wui-flex>`}

        <wui-flex alignItems="center" gap="2">
          <wui-text variant="sm-regular" color="secondary">${t.title}</wui-text>
          <wui-link @click=${this.onResendCode.bind(this)} .disabled=${e}>
            ${t.action}
          </wui-link>
        </wui-flex>
      </wui-flex>
    `}startOTPTimeout(){this.timeoutTimeLeft=b.Q.getTimeToNextEmailLogin(),this.OTPTimeout=setInterval(()=>{this.timeoutTimeLeft>0?this.timeoutTimeLeft=b.Q.getTimeToNextEmailLogin():clearInterval(this.OTPTimeout)},1e3)}async onOtpInputChange(e){try{!this.loading&&(this.otp=e.detail,this.shouldSubmitOnOtpChange()&&(this.loading=!0,await this.onOtpSubmit?.(this.otp)))}catch(e){this.error=s.w.parseError(e),this.loading=!1}}async onResendCode(){try{if(this.onOtpResend){if(!this.loading&&!this.timeoutTimeLeft){if(this.error="",this.otp="",!l.a.getAuthConnector()||!this.email)throw Error("w3m-email-otp-widget: Unable to resend email");this.loading=!0,await this.onOtpResend(this.email),this.startOTPTimeout(),c.P.showSuccess("Code email resent")}}else this.onStartOver&&this.onStartOver()}catch(e){c.P.showError(e)}finally{this.loading=!1}}getFooterLabels(e){return this.onStartOver?{title:"Something wrong?",action:`Try again ${e?`in ${this.timeoutTimeLeft}s`:""}`}:{title:"Didn't receive it?",action:`Resend ${e?`in ${this.timeoutTimeLeft}s`:"Code"}`}}shouldSubmitOnOtpChange(){return this.authConnector&&this.otp.length===r.OTP_LENGTH}};O.OTP_LENGTH=6,O.styles=I,x([(0,a.wk)()],O.prototype,"loading",void 0),x([(0,a.wk)()],O.prototype,"timeoutTimeLeft",void 0),x([(0,a.wk)()],O.prototype,"error",void 0),O=r=x([(0,u.EM)("w3m-email-otp-widget")],O)}}]);