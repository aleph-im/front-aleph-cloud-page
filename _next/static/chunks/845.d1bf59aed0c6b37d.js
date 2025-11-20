"use strict";(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[845],{87946:function(e,t,i){i.d(t,{z:function(){return ReownAuthentication}});var r=i(35855),o=i(68314),a=i(48113),n=i(66691),s=i(59757),l=i(18462),c=i(27777);let ReownAuthenticationMessenger=class ReownAuthenticationMessenger{constructor(e){this.getNonce=e.getNonce}async createMessage(e){let t={accountAddress:e.accountAddress,chainId:e.chainId,version:"1",domain:"undefined"==typeof document?"Unknown Domain":document.location.host,uri:"undefined"==typeof document?"Unknown URI":document.location.href,resources:this.resources,nonce:await this.getNonce(e),issuedAt:this.stringifyDate(new Date),statement:void 0,expirationTime:void 0,notBefore:void 0};return Object.assign(t,{toString:()=>this.stringify(t)})}stringify(e){let t=this.getNetworkName(e.chainId);return[`${e.domain} wants you to sign in with your ${t} account:`,e.accountAddress,e.statement?`
${e.statement}
`:"",`URI: ${e.uri}`,`Version: ${e.version}`,`Chain ID: ${e.chainId}`,`Nonce: ${e.nonce}`,e.issuedAt&&`Issued At: ${e.issuedAt}`,e.expirationTime&&`Expiration Time: ${e.expirationTime}`,e.notBefore&&`Not Before: ${e.notBefore}`,e.requestId&&`Request ID: ${e.requestId}`,e.resources?.length&&e.resources.reduce((e,t)=>`${e}
- ${t}`,"Resources:")].filter(e=>"string"==typeof e).join("\n").trim()}getNetworkName(e){let t=s.R.getAllRequestedCaipNetworks();return c.p.getNetworkNameByCaipNetworkId(t,e)}stringifyDate(e){return e.toISOString()}};let ReownAuthentication=class ReownAuthentication{constructor(e={}){this.otpUuid=null,this.listeners={sessionChanged:[]},this.localAuthStorageKey=e.localAuthStorageKey||r.uJ.SIWX_AUTH_TOKEN,this.localNonceStorageKey=e.localNonceStorageKey||r.uJ.SIWX_NONCE_TOKEN,this.required=e.required??!0,this.messenger=new ReownAuthenticationMessenger({getNonce:this.getNonce.bind(this)})}async createMessage(e){return this.messenger.createMessage(e)}async addSession(e){let t=await this.request({method:"POST",key:"authenticate",body:{data:e.data,message:e.message,signature:e.signature,clientId:this.getClientId(),walletInfo:this.getWalletInfo()},headers:["nonce","otp"]});this.setStorageToken(t.token,this.localAuthStorageKey),this.emit("sessionChanged",e),this.setAppKitAccountUser(function(e){let t=e.split(".");if(3!==t.length)throw Error("Invalid token");let i=t[1];if("string"!=typeof i)throw Error("Invalid token");let r=i.replace(/-/gu,"+").replace(/_/gu,"/"),o=r.padEnd(r.length+(4-r.length%4)%4,"="),a=JSON.parse(atob(o));return a}(t.token)),this.otpUuid=null}async getSessions(e,t){try{if(!this.getStorageToken(this.localAuthStorageKey))return[];let i=await this.request({method:"GET",key:"me",query:{},headers:["auth"]});if(!i)return[];let r=i.address.toLowerCase()===t.toLowerCase(),o=i.caip2Network===e;if(!r||!o)return[];let a={data:{accountAddress:i.address,chainId:i.caip2Network},message:"",signature:""};return this.emit("sessionChanged",a),this.setAppKitAccountUser(i),[a]}catch{return[]}}async revokeSession(e,t){return Promise.resolve(this.clearStorageTokens())}async setSessions(e){if(0===e.length)this.clearStorageTokens();else{let t=e.find(e=>e.data.chainId===l.eq()?.caipNetworkId)||e[0];await this.addSession(t)}}getRequired(){return this.required}async getSessionAccount(){if(!this.getStorageToken(this.localAuthStorageKey))throw Error("Not authenticated");return this.request({method:"GET",key:"me",body:void 0,query:{includeAppKitAccount:!0},headers:["auth"]})}async setSessionAccountMetadata(e=null){if(!this.getStorageToken(this.localAuthStorageKey))throw Error("Not authenticated");return this.request({method:"PUT",key:"account-metadata",body:{metadata:e},headers:["auth"]})}on(e,t){return this.listeners[e].push(t),()=>{this.listeners[e]=this.listeners[e].filter(e=>e!==t)}}removeAllListeners(){let e=Object.keys(this.listeners);e.forEach(e=>{this.listeners[e]=[]})}async requestEmailOtp({email:e,account:t}){let i=await this.request({method:"POST",key:"otp",body:{email:e,account:t}});return this.otpUuid=i.uuid,this.messenger.resources=[`email:${e}`],i}confirmEmailOtp({code:e}){return this.request({method:"PUT",key:"otp",body:{code:e},headers:["otp"]})}async request({method:e,key:t,query:i,body:r,headers:a}){let{projectId:n,st:s,sv:l}=this.getSDKProperties(),c=new URL(`${o.b.W3M_API_URL}/auth/v1/${String(t)}`);c.searchParams.set("projectId",n),c.searchParams.set("st",s),c.searchParams.set("sv",l),i&&Object.entries(i).forEach(([e,t])=>c.searchParams.set(e,String(t)));let u=await fetch(c,{method:e,body:r?JSON.stringify(r):void 0,headers:Array.isArray(a)?a.reduce((e,t)=>{switch(t){case"nonce":e["x-nonce-jwt"]=`Bearer ${this.getStorageToken(this.localNonceStorageKey)}`;break;case"auth":e.Authorization=`Bearer ${this.getStorageToken(this.localAuthStorageKey)}`;break;case"otp":this.otpUuid&&(e["x-otp"]=this.otpUuid)}return e},{}):void 0});if(!u.ok)throw Error(await u.text());return u.headers.get("content-type")?.includes("application/json")?u.json():null}getStorageToken(e){return r.mr.getItem(e)}setStorageToken(e,t){r.mr.setItem(t,e)}clearStorageTokens(){this.otpUuid=null,r.mr.removeItem(this.localAuthStorageKey),r.mr.removeItem(this.localNonceStorageKey),this.emit("sessionChanged",void 0)}async getNonce(){let{nonce:e,token:t}=await this.request({method:"GET",key:"nonce"});return this.setStorageToken(t,this.localNonceStorageKey),e}getClientId(){return n.L.state.clientId}getWalletInfo(){let e=s.R.getAccountData()?.connectedWalletInfo;if(!e)return;if("social"in e&&"identifier"in e){let t=e.social,i=e.identifier;return{type:"social",social:t,identifier:i}}let{name:t,icon:i}=e,r="unknown";switch(e.type){case"EXTERNAL":case"INJECTED":case"ANNOUNCED":r="extension";break;case"WALLET_CONNECT":r="walletconnect";break;default:r="unknown"}return{type:r,name:t,icon:i}}getSDKProperties(){return a.ApiController._getSdkProperties()}emit(e,t){this.listeners[e].forEach(e=>e(t))}setAppKitAccountUser(e){let{email:t}=e;t&&Object.values(o.b.CHAIN).forEach(e=>{s.R.setAccountProp("user",{email:t},e)})}}},60845:function(e,t,i){i.r(t),i.d(t,{W3mDataCaptureOtpConfirmView:function(){return f},W3mDataCaptureView:function(){return b},W3mEmailSuffixesWidget:function(){return l},W3mRecentEmailsWidget:function(){return u}});var r=i(19064),o=i(59662),a=i(28740),n=r.iv`
  .email-sufixes {
    display: flex;
    flex-direction: row;
    gap: var(--wui-spacing-3xs);
    overflow-x: auto;
    max-width: 100%;
    margin-top: var(--wui-spacing-s);
    margin-bottom: calc(-1 * var(--wui-spacing-m));
    padding-bottom: var(--wui-spacing-m);
    margin-left: calc(-1 * var(--wui-spacing-m));
    margin-right: calc(-1 * var(--wui-spacing-m));
    padding-left: var(--wui-spacing-m);
    padding-right: var(--wui-spacing-m);

    &::-webkit-scrollbar {
      display: none;
    }
  }
`,__decorate=function(e,t,i,r){var o,a=arguments.length,n=a<3?t:null===r?r=Object.getOwnPropertyDescriptor(t,i):r;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)n=Reflect.decorate(e,t,i,r);else for(var s=e.length-1;s>=0;s--)(o=e[s])&&(n=(a<3?o(n):a>3?o(t,i,n):o(t,i))||n);return a>3&&n&&Object.defineProperty(t,i,n),n};let s=["@gmail.com","@outlook.com","@yahoo.com","@hotmail.com","@aol.com","@icloud.com","@zoho.com"],l=class extends r.oi{constructor(){super(...arguments),this.email=""}render(){let e=s.filter(this.filter.bind(this)).map(this.item.bind(this));return 0===e.length?null:r.dy`<div class="email-sufixes">${e}</div>`}filter(e){if(!this.email)return!1;let t=this.email.split("@");if(t.length<2)return!0;let i=t.pop();return e.includes(i)&&e!==`@${i}`}item(e){return r.dy`<wui-button variant="neutral" size="sm" @click=${()=>{let t=this.email.split("@");t.length>1&&t.pop();let i=t[0]+e;this.dispatchEvent(new CustomEvent("change",{detail:i,bubbles:!0,composed:!0}))}}
      >${e}</wui-button
    >`}};l.styles=[n],__decorate([(0,o.Cb)()],l.prototype,"email",void 0),l=__decorate([(0,a.Mo)("w3m-email-suffixes-widget")],l);var c=r.iv`
  .recent-emails {
    display: flex;
    flex-direction: column;
    padding: var(--wui-spacing-s) 0;
    border-top: 1px solid var(--wui-color-gray-glass-005);
    border-bottom: 1px solid var(--wui-color-gray-glass-005);
  }

  .recent-emails-heading {
    margin-bottom: var(--wui-spacing-s);
  }

  .recent-emails-list-item {
    --wui-color-gray-glass-002: transparent;
  }
`,w3m_recent_emails_widget_decorate=function(e,t,i,r){var o,a=arguments.length,n=a<3?t:null===r?r=Object.getOwnPropertyDescriptor(t,i):r;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)n=Reflect.decorate(e,t,i,r);else for(var s=e.length-1;s>=0;s--)(o=e[s])&&(n=(a<3?o(n):a>3?o(t,i,n):o(t,i))||n);return a>3&&n&&Object.defineProperty(t,i,n),n};let u=class extends r.oi{constructor(){super(...arguments),this.emails=[]}render(){return 0===this.emails.length?null:r.dy`<div class="recent-emails">
      <wui-text variant="micro-600" color="fg-200" class="recent-emails-heading"
        >Recently used emails</wui-text
      >
      ${this.emails.map(this.item.bind(this))}
    </div>`}item(e){return r.dy`<wui-list-item
      @click=${()=>{this.dispatchEvent(new CustomEvent("select",{detail:e,bubbles:!0,composed:!0}))}}
      ?chevron=${!0}
      icon="mail"
      iconVariant="overlay"
      class="recent-emails-list-item"
    >
      <wui-text variant="paragraph-500" color="fg-100">${e}</wui-text>
    </wui-list-item>`}};u.styles=[c],w3m_recent_emails_widget_decorate([(0,o.Cb)()],u.prototype,"emails",void 0),u=w3m_recent_emails_widget_decorate([(0,a.Mo)("w3m-recent-emails-widget")],u);var d=i(35428),h=i(4511),p=i(59757),m=i(82879),g=i(87946),w=i(19617),w3m_data_capture_otp_confirm_view_decorate=function(e,t,i,r){var o,a=arguments.length,n=a<3?t:null===r?r=Object.getOwnPropertyDescriptor(t,i):r;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)n=Reflect.decorate(e,t,i,r);else for(var s=e.length-1;s>=0;s--)(o=e[s])&&(n=(a<3?o(n):a>3?o(t,i,n):o(t,i))||n);return a>3&&n&&Object.defineProperty(t,i,n),n};let f=class extends w.m{constructor(){super(...arguments),this.siwx=d.OptionsController.state.siwx,this.onOtpSubmit=async e=>{await this.siwx.confirmEmailOtp({code:e}),h.RouterController.replace("SIWXSignMessage")},this.onOtpResend=async e=>{let t=p.R.getAccountData();if(!t?.caipAddress)throw Error("No account data found");await this.siwx.requestEmailOtp({email:e,account:t.caipAddress})}}connectedCallback(){this.siwx&&this.siwx instanceof g.z||m.SnackController.showError("ReownAuthentication is not initialized."),super.connectedCallback()}shouldSubmitOnOtpChange(){return this.otp.length===w.m.OTP_LENGTH}};w3m_data_capture_otp_confirm_view_decorate([(0,o.SB)()],f.prototype,"siwx",void 0),f=w3m_data_capture_otp_confirm_view_decorate([(0,a.Mo)("w3m-data-capture-otp-confirm-view")],f);var y=i(35855),v=r.iv`
  .hero {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: var(--wui-spacing-3xs);

    transition-property: margin, height;
    transition-duration: var(--wui-duration-md);
    transition-timing-function: var(--wui-ease-out-power-1);
    margin-top: -100px;

    &[data-state='loading'] {
      margin-top: 0px;
    }

    position: relative;
    &:after {
      content: '';
      position: absolute;
      bottom: 0;
      height: 252px;
      width: 360px;
      background: radial-gradient(
        96.11% 53.95% at 50% 51.28%,
        transparent 0%,
        color-mix(in srgb, var(--wui-color-bg-100) 5%, transparent) 49%,
        color-mix(in srgb, var(--wui-color-bg-100) 65%, transparent) 99.43%
      );
    }
  }

  .hero-main-icon {
    width: 176px;
    transition-property: background-color;
    transition-duration: var(--wui-duration-lg);
    transition-timing-function: var(--wui-ease-out-power-1);

    &[data-state='loading'] {
      width: 56px;
    }
  }

  .hero-row {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    gap: var(--wui-spacing-3xs);
    flex-wrap: nowrap;
    min-width: fit-content;

    &:nth-child(1) {
      transform: translateX(-30px);
    }

    &:nth-child(2) {
      transform: translateX(30px);
    }

    &:nth-child(4) {
      transform: translateX(40px);
    }

    transition-property: height;
    transition-duration: var(--wui-duration-md);
    transition-timing-function: var(--wui-ease-out-power-1);
    height: 68px;

    &[data-state='loading'] {
      height: 0px;
    }
  }

  .hero-row-icon {
    opacity: 0.1;
    transition-property: opacity;
    transition-duration: var(--wui-duration-md);
    transition-timing-function: var(--wui-ease-out-power-1);

    &[data-state='loading'] {
      opacity: 0;
    }
  }
`,w3m_data_capture_view_decorate=function(e,t,i,r){var o,a=arguments.length,n=a<3?t:null===r?r=Object.getOwnPropertyDescriptor(t,i):r;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)n=Reflect.decorate(e,t,i,r);else for(var s=e.length-1;s>=0;s--)(o=e[s])&&(n=(a<3?o(n):a>3?o(t,i,n):o(t,i))||n);return a>3&&n&&Object.defineProperty(t,i,n),n};let b=class extends r.oi{constructor(){super(...arguments),this.email=h.RouterController.state.data?.email??p.R.getAccountData()?.user?.email??"",this.address=p.R.getAccountData()?.address??"",this.loading=!1,this.appName=d.OptionsController.state.metadata?.name??"AppKit",this.siwx=d.OptionsController.state.siwx,this.isRequired=Array.isArray(d.OptionsController.state.remoteFeatures?.emailCapture)&&d.OptionsController.state.remoteFeatures?.emailCapture.includes("required"),this.recentEmails=this.getRecentEmails()}connectedCallback(){this.siwx&&this.siwx instanceof g.z||m.SnackController.showError("ReownAuthentication is not initialized. Please contact support."),super.connectedCallback()}firstUpdated(){this.loading=!1,this.recentEmails=this.getRecentEmails(),this.email&&this.onSubmit()}render(){return r.dy`
      <wui-flex flexDirection="column" .padding=${["3xs","m","m","m"]} gap="l">
        ${this.hero()} ${this.paragraph()} ${this.emailInput()} ${this.recentEmailsWidget()}
        ${this.footerActions()}
      </wui-flex>
    `}hero(){return r.dy`
      <div class="hero" data-state=${this.loading?"loading":"default"}>
        ${this.heroRow(["id","mail","wallet","x","solana","qrCode"])}
        ${this.heroRow(["mail","farcaster","wallet","discord","mobile","qrCode"])}
        <div class="hero-row">
          ${this.heroIcon("github")} ${this.heroIcon("bank")}
          <wui-icon-box
            size="xl"
            iconSize="xxl"
            iconColor=${this.loading?"fg-100":"accent-100"}
            backgroundColor=${this.loading?"fg-100":"accent-100"}
            icon=${this.loading?"id":"user"}
            isOpaque
            class="hero-main-icon"
            data-state=${this.loading?"loading":"default"}
          >
          </wui-icon-box>
          ${this.heroIcon("id")} ${this.heroIcon("card")}
        </div>
        ${this.heroRow(["google","id","github","verify","apple","mobile"])}
      </div>
    `}heroRow(e){return r.dy`
      <div class="hero-row" data-state=${this.loading?"loading":"default"}>
        ${e.map(this.heroIcon.bind(this))}
      </div>
    `}heroIcon(e){return r.dy`
      <wui-icon-box
        size="xl"
        iconSize="xxl"
        iconColor="fg-100"
        backgroundColor="fg-100"
        icon=${e}
        data-state=${this.loading?"loading":"default"}
        isOpaque
        class="hero-row-icon"
      >
      </wui-icon-box>
    `}paragraph(){return this.loading?r.dy`
        <wui-text variant="paragraph-400" color="fg-200" align="center"
          >We are verifying your account with email
          <wui-text variant="paragraph-600" color="accent-100">${this.email}</wui-text> and address
          <wui-text variant="paragraph-600" color="fg-100">
            ${a.Hg.getTruncateString({string:this.address,charsEnd:4,charsStart:4,truncate:"middle"})} </wui-text
          >, please wait a moment.</wui-text
        >
      `:this.isRequired?r.dy`
        <wui-text variant="paragraph-600" color="fg-100" align="center">
          ${this.appName} requires your email for authentication.
        </wui-text>
      `:r.dy`
      <wui-flex flexDirection="column" gap="xs" alignItems="center">
        <wui-text variant="paragraph-600" color="fg-100" align="center" size>
          ${this.appName} would like to collect your email.
        </wui-text>

        <wui-text variant="small-400" color="fg-200" align="center">
          Don't worry, it's optional&mdash;you can skip this step.
        </wui-text>
      </wui-flex>
    `}emailInput(){if(this.loading)return null;let changeHandler=e=>{this.email=e.detail};return r.dy`
      <wui-flex flexDirection="column">
        <wui-email-input
          .value=${this.email}
          .disabled=${this.loading}
          @inputChange=${changeHandler}
          @keydown=${e=>{"Enter"===e.key&&this.onSubmit()}}
        ></wui-email-input>

        <w3m-email-suffixes-widget
          .email=${this.email}
          @change=${changeHandler}
        ></w3m-email-suffixes-widget>
      </wui-flex>
    `}recentEmailsWidget(){return 0===this.recentEmails.length||this.loading?null:r.dy`
      <w3m-recent-emails-widget
        .emails=${this.recentEmails}
        @select=${e=>{this.email=e.detail,this.onSubmit()}}
      ></w3m-recent-emails-widget>
    `}footerActions(){return r.dy`
      <wui-flex flexDirection="row" fullWidth gap="s">
        ${this.isRequired?null:r.dy`<wui-button
              size="lg"
              variant="neutral"
              fullWidth
              .disabled=${this.loading}
              @click=${this.onSkip.bind(this)}
              >Skip this step</wui-button
            >`}

        <wui-button
          size="lg"
          variant="main"
          type="submit"
          fullWidth
          .disabled=${!this.email||!this.isValidEmail(this.email)}
          .loading=${this.loading}
          @click=${this.onSubmit.bind(this)}
        >
          Continue
        </wui-button>
      </wui-flex>
    `}async onSubmit(){if(!(this.siwx instanceof g.z)){m.SnackController.showError("ReownAuthentication is not initialized. Please contact support.");return}let e=p.R.getActiveCaipAddress();if(!e)throw Error("Account is not connected.");if(!this.isValidEmail(this.email)){m.SnackController.showError("Please provide a valid email.");return}try{this.loading=!0;let t=await this.siwx.requestEmailOtp({email:this.email,account:e});this.pushRecentEmail(this.email),null===t.uuid?h.RouterController.replace("SIWXSignMessage"):h.RouterController.replace("DataCaptureOtpConfirm",{email:this.email})}catch(e){m.SnackController.showError("Failed to send email OTP"),this.loading=!1}}onSkip(){h.RouterController.replace("SIWXSignMessage")}getRecentEmails(){let e=y.mr.getItem(y.uJ.RECENT_EMAILS),t=e?e.split(","):[];return t.filter(this.isValidEmail.bind(this)).slice(0,3)}pushRecentEmail(e){let t=this.getRecentEmails(),i=Array.from(new Set([e,...t])).slice(0,3);y.mr.setItem(y.uJ.RECENT_EMAILS,i.join(","))}isValidEmail(e){return/^\S+@\S+\.\S+$/u.test(e)}};b.styles=[v],w3m_data_capture_view_decorate([(0,o.SB)()],b.prototype,"email",void 0),w3m_data_capture_view_decorate([(0,o.SB)()],b.prototype,"address",void 0),w3m_data_capture_view_decorate([(0,o.SB)()],b.prototype,"loading",void 0),w3m_data_capture_view_decorate([(0,o.SB)()],b.prototype,"appName",void 0),w3m_data_capture_view_decorate([(0,o.SB)()],b.prototype,"siwx",void 0),w3m_data_capture_view_decorate([(0,o.SB)()],b.prototype,"isRequired",void 0),w3m_data_capture_view_decorate([(0,o.SB)()],b.prototype,"recentEmails",void 0),b=w3m_data_capture_view_decorate([(0,a.Mo)("w3m-data-capture-view")],b)},19617:function(e,t,i){i.d(t,{m:function(){return x}});var r,o=i(19064),a=i(59662),n=i(4511),s=i(9793),l=i(83241),c=i(82879),u=i(28740);i(82100),i(69804),i(73049),i(76630);var d=i(24134),h=i(1512),p=i(25729),m=i(95636),g=m.iv`
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
`,__decorate=function(e,t,i,r){var o,a=arguments.length,n=a<3?t:null===r?r=Object.getOwnPropertyDescriptor(t,i):r;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)n=Reflect.decorate(e,t,i,r);else for(var s=e.length-1;s>=0;s--)(o=e[s])&&(n=(a<3?o(n):a>3?o(t,i,n):o(t,i))||n);return a>3&&n&&Object.defineProperty(t,i,n),n};let w=class extends o.oi{constructor(){super(...arguments),this.disabled=!1,this.value=""}render(){return o.dy`<input
      type="number"
      maxlength="1"
      inputmode="numeric"
      autofocus
      ?disabled=${this.disabled}
      value=${this.value}
    /> `}};w.styles=[d.ET,d.ZM,g],__decorate([(0,a.Cb)({type:Boolean})],w.prototype,"disabled",void 0),__decorate([(0,a.Cb)({type:String})],w.prototype,"value",void 0),w=__decorate([(0,p.M)("wui-input-numeric")],w);var f=o.iv`
  :host {
    position: relative;
    display: block;
  }
`,wui_otp_decorate=function(e,t,i,r){var o,a=arguments.length,n=a<3?t:null===r?r=Object.getOwnPropertyDescriptor(t,i):r;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)n=Reflect.decorate(e,t,i,r);else for(var s=e.length-1;s>=0;s--)(o=e[s])&&(n=(a<3?o(n):a>3?o(t,i,n):o(t,i))||n);return a>3&&n&&Object.defineProperty(t,i,n),n};let y=class extends o.oi{constructor(){super(...arguments),this.length=6,this.otp="",this.values=Array.from({length:this.length}).map(()=>""),this.numerics=[],this.shouldInputBeEnabled=e=>{let t=this.values.slice(0,e);return t.every(e=>""!==e)},this.handleKeyDown=(e,t)=>{let i=e.target,r=this.getInputElement(i);if(!r)return;["ArrowLeft","ArrowRight","Shift","Delete"].includes(e.key)&&e.preventDefault();let o=r.selectionStart;switch(e.key){case"ArrowLeft":o&&r.setSelectionRange(o+1,o+1),this.focusInputField("prev",t);break;case"ArrowRight":case"Shift":this.focusInputField("next",t);break;case"Delete":case"Backspace":""===r.value?this.focusInputField("prev",t):this.updateInput(r,t,"")}},this.focusInputField=(e,t)=>{if("next"===e){let e=t+1;if(!this.shouldInputBeEnabled(e))return;let i=this.numerics[e<this.length?e:t],r=i?this.getInputElement(i):void 0;r&&(r.disabled=!1,r.focus())}if("prev"===e){let e=t-1,i=this.numerics[e>-1?e:t],r=i?this.getInputElement(i):void 0;r&&r.focus()}}}firstUpdated(){this.otp&&(this.values=this.otp.split(""));let e=this.shadowRoot?.querySelectorAll("wui-input-numeric");e&&(this.numerics=Array.from(e)),this.numerics[0]?.focus()}render(){return o.dy`
      <wui-flex gap="1" data-testid="wui-otp-input">
        ${Array.from({length:this.length}).map((e,t)=>o.dy`
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
    `}updateInput(e,t,i){let r=this.numerics[t],o=e||(r?this.getInputElement(r):void 0);o&&(o.value=i,this.values=this.values.map((e,r)=>r===t?i:e))}selectInput(e){let t=e.target;if(t){let e=this.getInputElement(t);e?.select()}}handleInput(e,t){let i=e.target,r=this.getInputElement(i);if(r){let i=r.value;if("insertFromPaste"===e.inputType)this.handlePaste(r,i,t);else{let o=h.H.isNumber(i);o&&e.data?(this.updateInput(r,t,e.data),this.focusInputField("next",t)):this.updateInput(r,t,"")}}this.dispatchInputChangeEvent()}handlePaste(e,t,i){let r=t[0],o=r&&h.H.isNumber(r);if(o){this.updateInput(e,i,r);let o=t.substring(1);if(i+1<this.length&&o.length){let e=this.numerics[i+1],t=e?this.getInputElement(e):void 0;t&&this.handlePaste(t,o,i+1)}else this.focusInputField("next",i)}else this.updateInput(e,i,"")}getInputElement(e){return e.shadowRoot?.querySelector("input")?e.shadowRoot.querySelector("input"):null}dispatchInputChangeEvent(){let e=this.values.join("");this.dispatchEvent(new CustomEvent("inputChange",{detail:e,bubbles:!0,composed:!0}))}};y.styles=[d.ET,f],wui_otp_decorate([(0,a.Cb)({type:Number})],y.prototype,"length",void 0),wui_otp_decorate([(0,a.Cb)({type:String})],y.prototype,"otp",void 0),wui_otp_decorate([(0,a.SB)()],y.prototype,"values",void 0),y=wui_otp_decorate([(0,p.M)("wui-otp")],y),i(68390);var v=i(19445),b=o.iv`
  wui-loading-spinner {
    margin: 9px auto;
  }

  .email-display,
  .email-display wui-text {
    max-width: 100%;
  }
`,w3m_email_otp_widget_decorate=function(e,t,i,r){var o,a=arguments.length,n=a<3?t:null===r?r=Object.getOwnPropertyDescriptor(t,i):r;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)n=Reflect.decorate(e,t,i,r);else for(var s=e.length-1;s>=0;s--)(o=e[s])&&(n=(a<3?o(n):a>3?o(t,i,n):o(t,i))||n);return a>3&&n&&Object.defineProperty(t,i,n),n};let x=r=class extends o.oi{firstUpdated(){this.startOTPTimeout()}disconnectedCallback(){clearTimeout(this.OTPTimeout)}constructor(){super(),this.loading=!1,this.timeoutTimeLeft=v.$.getTimeToNextEmailLogin(),this.error="",this.otp="",this.email=n.RouterController.state.data?.email,this.authConnector=s.ConnectorController.getAuthConnector()}render(){if(!this.email)throw Error("w3m-email-otp-widget: No email provided");let e=!!this.timeoutTimeLeft,t=this.getFooterLabels(e);return o.dy`
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

        ${this.loading?o.dy`<wui-loading-spinner size="xl" color="accent-primary"></wui-loading-spinner>`:o.dy` <wui-flex flexDirection="column" alignItems="center" gap="2">
              <wui-otp
                dissabled
                length="6"
                @inputChange=${this.onOtpInputChange.bind(this)}
                .otp=${this.otp}
              ></wui-otp>
              ${this.error?o.dy`
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
    `}startOTPTimeout(){this.timeoutTimeLeft=v.$.getTimeToNextEmailLogin(),this.OTPTimeout=setInterval(()=>{this.timeoutTimeLeft>0?this.timeoutTimeLeft=v.$.getTimeToNextEmailLogin():clearInterval(this.OTPTimeout)},1e3)}async onOtpInputChange(e){try{!this.loading&&(this.otp=e.detail,this.shouldSubmitOnOtpChange()&&(this.loading=!0,await this.onOtpSubmit?.(this.otp)))}catch(e){this.error=l.j.parseError(e),this.loading=!1}}async onResendCode(){try{if(this.onOtpResend){if(!this.loading&&!this.timeoutTimeLeft){this.error="",this.otp="";let e=s.ConnectorController.getAuthConnector();if(!e||!this.email)throw Error("w3m-email-otp-widget: Unable to resend email");this.loading=!0,await this.onOtpResend(this.email),this.startOTPTimeout(),c.SnackController.showSuccess("Code email resent")}}else this.onStartOver&&this.onStartOver()}catch(e){c.SnackController.showError(e)}finally{this.loading=!1}}getFooterLabels(e){return this.onStartOver?{title:"Something wrong?",action:`Try again ${e?`in ${this.timeoutTimeLeft}s`:""}`}:{title:"Didn't receive it?",action:`Resend ${e?`in ${this.timeoutTimeLeft}s`:"Code"}`}}shouldSubmitOnOtpChange(){return this.authConnector&&this.otp.length===r.OTP_LENGTH}};x.OTP_LENGTH=6,x.styles=b,w3m_email_otp_widget_decorate([(0,a.SB)()],x.prototype,"loading",void 0),w3m_email_otp_widget_decorate([(0,a.SB)()],x.prototype,"timeoutTimeLeft",void 0),w3m_email_otp_widget_decorate([(0,a.SB)()],x.prototype,"error",void 0),x=r=w3m_email_otp_widget_decorate([(0,u.Mo)("w3m-email-otp-widget")],x)}}]);