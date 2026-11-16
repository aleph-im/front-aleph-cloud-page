"use strict";(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[4373],{44373:(e,t,i)=>{i.r(t),i.d(t,{W3mApproveTransactionView:()=>h,W3mRegisterAccountNameSuccess:()=>J,W3mRegisterAccountNameView:()=>K,W3mSmartAccountSettingsView:()=>_,W3mUpgradeWalletView:()=>S});var r=i(1850),o=i(58446),n=i(97749),a=i(24417),s=i(59390),c=i(70803),l=i(90889),d=i(44458);let u=(0,r.AH)`
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
`;var p=function(e,t,i,r){var o,n=arguments.length,a=n<3?t:null===r?r=Object.getOwnPropertyDescriptor(t,i):r;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(e,t,i,r);else for(var s=e.length-1;s>=0;s--)(o=e[s])&&(a=(n<3?o(a):n>3?o(t,i,a):o(t,i))||a);return n>3&&a&&Object.defineProperty(t,i,a),a};let h=class extends r.WF{constructor(){super(),this.bodyObserver=void 0,this.unsubscribe=[],this.iframe=document.getElementById("w3m-iframe"),this.ready=!1,this.unsubscribe.push(a.W.subscribeKey("open",e=>{e||this.onHideIframe()}),a.W.subscribeKey("shake",e=>{e?this.iframe.style.animation="w3m-shake 500ms var(--apkt-easings-ease-out-power-2)":this.iframe.style.animation="none"}))}disconnectedCallback(){this.onHideIframe(),this.unsubscribe.forEach(e=>e()),this.bodyObserver?.unobserve(window.document.body)}async firstUpdated(){await this.syncTheme(),this.iframe.style.display="block";let e=this?.renderRoot?.querySelector("div");this.bodyObserver=new ResizeObserver(t=>{let i=t?.[0]?.contentBoxSize,r=i?.[0]?.inlineSize;this.iframe.style.height="600px",e.style.height="600px",s.H.state.enableEmbedded?this.updateFrameSizeForEmbeddedMode():(r&&r<=430?(this.iframe.style.width="100%",this.iframe.style.left="0px",this.iframe.style.bottom="0px",this.iframe.style.top="unset"):(this.iframe.style.width="360px",this.iframe.style.left="calc(50% - 180px)",this.iframe.style.top="calc(50% - 300px + 32px)",this.iframe.style.bottom="unset"),this.onShowIframe())}),this.bodyObserver.observe(window.document.body)}render(){return(0,r.qy)`<div data-ready=${this.ready} id="w3m-frame-container"></div>`}onShowIframe(){let e=window.innerWidth<=430;this.ready=!0,this.iframe.style.animation=e?"w3m-iframe-zoom-in-mobile 200ms var(--apkt-easings-ease-out-power-2)":"w3m-iframe-zoom-in 200ms var(--apkt-easings-ease-out-power-2)"}onHideIframe(){this.iframe.style.display="none",this.iframe.style.animation="w3m-iframe-fade-out 200ms var(--apkt-easings-ease-out-power-2)"}async syncTheme(){let e=c.a.getAuthConnector();if(e){let t=l.W.getSnapshot().themeMode,i=l.W.getSnapshot().themeVariables;await e.provider.syncTheme({themeVariables:i,w3mThemeVariables:(0,n.o)(i,t)})}}async updateFrameSizeForEmbeddedMode(){let e=this?.renderRoot?.querySelector("div");await new Promise(e=>{setTimeout(e,300)});let t=this.getBoundingClientRect();e.style.width="100%",this.iframe.style.left=`${t.left}px`,this.iframe.style.top=`${t.top}px`,this.iframe.style.width=`${t.width}px`,this.iframe.style.height=`${t.height}px`,this.onShowIframe()}};h.styles=u,p([(0,o.wk)()],h.prototype,"ready",void 0),h=p([(0,d.EM)("w3m-approve-transaction-view")],h);var g=i(22797);i(85479),i(13496),i(56349),i(53059);var m=i(54684),f=i(51127),w=i(41608);let y=(0,w.AH)`
  a {
    border: none;
    border-radius: ${({borderRadius:e})=>e["20"]};
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
`;var b=function(e,t,i,r){var o,n=arguments.length,a=n<3?t:null===r?r=Object.getOwnPropertyDescriptor(t,i):r;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(e,t,i,r);else for(var s=e.length-1;s>=0;s--)(o=e[s])&&(a=(n<3?o(a):n>3?o(t,i,a):o(t,i))||a);return n>3&&a&&Object.defineProperty(t,i,a),a};let x={sm:"md-regular",md:"lg-regular",lg:"lg-regular"},v={success:"sealCheck",error:"warning",warning:"exclamationCircle"},$=class extends r.WF{constructor(){super(...arguments),this.type="success",this.size="md",this.imageSrc=void 0,this.disabled=!1,this.href="",this.text=void 0}render(){return(0,r.qy)`
      <a
        rel="noreferrer"
        target="_blank"
        href=${this.href}
        class=${this.disabled?"disabled":""}
        data-type=${this.type}
        data-size=${this.size}
      >
        ${this.imageTemplate()}
        <wui-text variant=${x[this.size]} color="inherit">${this.text}</wui-text>
      </a>
    `}imageTemplate(){return this.imageSrc?(0,r.qy)`<wui-image src=${this.imageSrc} size="inherit"></wui-image>`:(0,r.qy)`<wui-icon
      name=${v[this.type]}
      weight="fill"
      color="inherit"
      size="inherit"
      class="image-icon"
    ></wui-icon>`}};$.styles=[m.W5,m.fD,y],b([(0,o.MZ)()],$.prototype,"type",void 0),b([(0,o.MZ)()],$.prototype,"size",void 0),b([(0,o.MZ)()],$.prototype,"imageSrc",void 0),b([(0,o.MZ)({type:Boolean})],$.prototype,"disabled",void 0),b([(0,o.MZ)()],$.prototype,"href",void 0),b([(0,o.MZ)()],$.prototype,"text",void 0),$=b([(0,f.E)("wui-semantic-chip")],$),i(60347);let S=class extends r.WF{render(){return(0,r.qy)`
      <wui-flex flexDirection="column" alignItems="center" gap="5" padding="5">
        <wui-text variant="md-regular" color="primary">Follow the instructions on</wui-text>
        <wui-semantic-chip
          icon="externalLink"
          variant="fill"
          text=${g.oU.SECURE_SITE_DASHBOARD}
          href=${g.oU.SECURE_SITE_DASHBOARD}
          imageSrc=${g.oU.SECURE_SITE_FAVICON}
          data-testid="w3m-secure-website-button"
        >
        </wui-semantic-chip>
        <wui-text variant="sm-regular" color="secondary">
          You will have to reconnect for security reasons
        </wui-text>
      </wui-flex>
    `}};S=function(e,t,i,r){var o,n=arguments.length,a=n<3?t:null===r?r=Object.getOwnPropertyDescriptor(t,i):r;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(e,t,i,r);else for(var s=e.length-1;s>=0;s--)(o=e[s])&&(a=(n<3?o(a):n>3?o(t,i,a):o(t,i))||a);return n>3&&a&&Object.defineProperty(t,i,a),a}([(0,d.EM)("w3m-upgrade-wallet-view")],S);var A=i(96853),k=i(933),T=i(81805),E=i(26064),R=i(33306),C=i(2065),N=i(36421),O=function(e,t,i,r){var o,n=arguments.length,a=n<3?t:null===r?r=Object.getOwnPropertyDescriptor(t,i):r;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(e,t,i,r);else for(var s=e.length-1;s>=0;s--)(o=e[s])&&(a=(n<3?o(a):n>3?o(t,i,a):o(t,i))||a);return n>3&&a&&Object.defineProperty(t,i,a),a};let _=class extends r.WF{constructor(){super(...arguments),this.loading=!1,this.switched=!1,this.text="",this.network=k.W.state.activeCaipNetwork}render(){return(0,r.qy)`
      <wui-flex flexDirection="column" gap="2" .padding=${["6","4","3","4"]}>
        ${this.togglePreferredAccountTypeTemplate()} ${this.toggleSmartAccountVersionTemplate()}
      </wui-flex>
    `}toggleSmartAccountVersionTemplate(){return(0,r.qy)`
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
    `}isV6(){return"v6"===(C.o.get("dapp_smart_account_version")||"v6")}toggleSmartAccountVersion(){C.o.set("dapp_smart_account_version",this.isV6()?"v7":"v6"),"u">typeof window&&window?.location?.reload()}togglePreferredAccountTypeTemplate(){let e=this.network?.chainNamespace,t=k.W.checkIfSmartAccountEnabled(),i=c.a.getConnectorId(e);return c.a.getAuthConnector()&&i===A.o.CONNECTOR_ID.AUTH&&t?(this.switched||(this.text=(0,T.lj)(e)===N.Vl.ACCOUNT_TYPES.SMART_ACCOUNT?"Switch to your EOA":"Switch to your Smart Account"),(0,r.qy)`
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
    `):null}async changePreferredAccountType(){let e=this.network?.chainNamespace,t=k.W.checkIfSmartAccountEnabled(),i=(0,T.lj)(e)!==N.Vl.ACCOUNT_TYPES.SMART_ACCOUNT&&t?N.Vl.ACCOUNT_TYPES.SMART_ACCOUNT:N.Vl.ACCOUNT_TYPES.EOA;c.a.getAuthConnector()&&(this.loading=!0,await E.x.setPreferredAccountType(i,e),this.text=i===N.Vl.ACCOUNT_TYPES.SMART_ACCOUNT?"Switch to your EOA":"Switch to your Smart Account",this.switched=!0,R.R.resetSend(),this.loading=!1,this.requestUpdate())}};O([(0,o.wk)()],_.prototype,"loading",void 0),O([(0,o.wk)()],_.prototype,"switched",void 0),O([(0,o.wk)()],_.prototype,"text",void 0),O([(0,o.wk)()],_.prototype,"network",void 0),_=O([(0,d.EM)("w3m-smart-account-settings-view")],_);var P=i(40438),M=i(18629),W=i(21159),I=i(24101),D=i(82570);i(57074),i(1610);let j=(0,w.AH)`
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
`;var z=function(e,t,i,r){var o,n=arguments.length,a=n<3?t:null===r?r=Object.getOwnPropertyDescriptor(t,i):r;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(e,t,i,r);else for(var s=e.length-1;s>=0;s--)(o=e[s])&&(a=(n<3?o(a):n>3?o(t,i,a):o(t,i))||a);return n>3&&a&&Object.defineProperty(t,i,a),a};let U=class extends r.WF{constructor(){super(...arguments),this.name="",this.registered=!1,this.loading=!1,this.disabled=!1}render(){return(0,r.qy)`
      <button ?disabled=${this.disabled}>
        <wui-text class="name" color="primary" variant="md-regular">${this.name}</wui-text>
        ${this.templateRightContent()}
      </button>
    `}templateRightContent(){return this.loading?(0,r.qy)`<wui-loading-spinner size="lg" color="primary"></wui-loading-spinner>`:this.registered?(0,r.qy)`<wui-tag variant="info" size="sm">Registered</wui-tag>`:(0,r.qy)`<wui-tag variant="success" size="sm">Available</wui-tag>`}};U.styles=[m.W5,m.fD,j],z([(0,o.MZ)()],U.prototype,"name",void 0),z([(0,o.MZ)({type:Boolean})],U.prototype,"registered",void 0),z([(0,o.MZ)({type:Boolean})],U.prototype,"loading",void 0),z([(0,o.MZ)({type:Boolean})],U.prototype,"disabled",void 0),U=z([(0,f.E)("wui-account-name-suggestion-item")],U);var V=i(12689);i(93026);let q=(0,w.AH)`
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
`;var F=function(e,t,i,r){var o,n=arguments.length,a=n<3?t:null===r?r=Object.getOwnPropertyDescriptor(t,i):r;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(e,t,i,r);else for(var s=e.length-1;s>=0;s--)(o=e[s])&&(a=(n<3?o(a):n>3?o(t,i,a):o(t,i))||a);return n>3&&a&&Object.defineProperty(t,i,a),a};let Z=class extends r.WF{constructor(){super(...arguments),this.disabled=!1,this.loading=!1}render(){return(0,r.qy)`
      <wui-input-text
        value=${(0,V.J)(this.value)}
        ?disabled=${this.disabled}
        .value=${this.value||""}
        data-testid="wui-ens-input"
        icon="search"
        inputRightPadding="5xl"
        .onKeyDown=${this.onKeyDown}
      ></wui-input-text>
    `}};Z.styles=[m.W5,q],F([(0,o.MZ)()],Z.prototype,"errorMessage",void 0),F([(0,o.MZ)({type:Boolean})],Z.prototype,"disabled",void 0),F([(0,o.MZ)()],Z.prototype,"value",void 0),F([(0,o.MZ)({type:Boolean})],Z.prototype,"loading",void 0),F([(0,o.MZ)({attribute:!1})],Z.prototype,"onKeyDown",void 0),Z=F([(0,f.E)("wui-ens-input")],Z),i(80729),i(28824),i(17244);var H=i(91135);let B=(0,d.AH)`
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
`;var Y=function(e,t,i,r){var o,n=arguments.length,a=n<3?t:null===r?r=Object.getOwnPropertyDescriptor(t,i):r;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(e,t,i,r);else for(var s=e.length-1;s>=0;s--)(o=e[s])&&(a=(n<3?o(a):n>3?o(t,i,a):o(t,i))||a);return n>3&&a&&Object.defineProperty(t,i,a),a};let K=class extends r.WF{constructor(){super(),this.formRef=(0,P._)(),this.usubscribe=[],this.name="",this.error="",this.loading=M.f.state.loading,this.suggestions=M.f.state.suggestions,this.profileName=k.W.getAccountData()?.profileName,this.onDebouncedNameInputChange=W.w.debounce(e=>{e.length<4?this.error="Name must be at least 4 characters long":H.y.isValidReownName(e)?(this.error="",M.f.getSuggestions(e)):this.error="The value is not a valid username"}),this.usubscribe.push(M.f.subscribe(e=>{this.suggestions=e.suggestions,this.loading=e.loading}),k.W.subscribeChainProp("accountState",e=>{this.profileName=e?.profileName,e?.profileName&&(this.error="You already own a name")}))}firstUpdated(){this.formRef.value?.addEventListener("keydown",this.onEnterKey.bind(this))}disconnectedCallback(){super.disconnectedCallback(),this.usubscribe.forEach(e=>e()),this.formRef.value?.removeEventListener("keydown",this.onEnterKey.bind(this))}render(){return(0,r.qy)`
      <wui-flex
        flexDirection="column"
        alignItems="center"
        gap="4"
        .padding=${["1","3","4","3"]}
      >
        <form ${(0,P.K)(this.formRef)} @submit=${this.onSubmitName.bind(this)}>
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
    `}submitButtonTemplate(){let e=this.suggestions.find(e=>e.name?.split(".")?.[0]===this.name&&e.registered);if(this.loading)return(0,r.qy)`<wui-loading-spinner
        class="input-loading-spinner"
        color="secondary"
      ></wui-loading-spinner>`;let t=`${this.name}${A.o.WC_NAME_SUFFIX}`;return(0,r.qy)`
      <wui-icon-link
        ?disabled=${!!e}
        class="input-submit-button"
        size="sm"
        icon="chevronRight"
        iconColor=${e?"default":"accent-primary"}
        @click=${()=>this.onSubmitName(t)}
      >
      </wui-icon-link>
    `}onNameInputChange(e){let t=H.y.validateReownName(e.detail||"");this.name=t,this.onDebouncedNameInputChange(t)}onKeyDown(e){1!==e.key.length||H.y.isValidReownName(e.key)||e.preventDefault()}templateSuggestions(){return!this.name||this.name.length<4||this.error?null:(0,r.qy)`<wui-flex flexDirection="column" gap="1" alignItems="center">
      ${this.suggestions.map(e=>(0,r.qy)`<wui-account-name-suggestion-item
            name=${e.name}
            ?registered=${e.registered}
            ?loading=${this.loading}
            ?disabled=${e.registered||this.loading}
            data-testid="account-name-suggestion"
            @click=${()=>this.onSubmitName(e.name)}
          ></wui-account-name-suggestion-item>`)}
    </wui-flex>`}isAllowedToSubmit(e){let t=e.split(".")?.[0],i=this.suggestions.find(e=>e.name?.split(".")?.[0]===t&&e.registered);return!this.loading&&!this.error&&!this.profileName&&t&&M.f.validateName(t)&&!i}async onSubmitName(e){try{if(!this.isAllowedToSubmit(e))return;I.E.sendEvent({type:"track",event:"REGISTER_NAME_INITIATED",properties:{isSmartAccount:(0,T.lj)(k.W.state.activeChain)===N.Vl.ACCOUNT_TYPES.SMART_ACCOUNT,ensName:e}}),await M.f.registerName(e),I.E.sendEvent({type:"track",event:"REGISTER_NAME_SUCCESS",properties:{isSmartAccount:(0,T.lj)(k.W.state.activeChain)===N.Vl.ACCOUNT_TYPES.SMART_ACCOUNT,ensName:e}})}catch(t){D.P.showError(t.message),I.E.sendEvent({type:"track",event:"REGISTER_NAME_ERROR",properties:{isSmartAccount:(0,T.lj)(k.W.state.activeChain)===N.Vl.ACCOUNT_TYPES.SMART_ACCOUNT,ensName:e,error:W.w.parseError(t)}})}}onEnterKey(e){if("Enter"===e.key&&this.name&&this.isAllowedToSubmit(this.name)){let e=`${this.name}${A.o.WC_NAME_SUFFIX}`;this.onSubmitName(e)}}};K.styles=B,Y([(0,o.MZ)()],K.prototype,"errorMessage",void 0),Y([(0,o.wk)()],K.prototype,"name",void 0),Y([(0,o.wk)()],K.prototype,"error",void 0),Y([(0,o.wk)()],K.prototype,"loading",void 0),Y([(0,o.wk)()],K.prototype,"suggestions",void 0),Y([(0,o.wk)()],K.prototype,"profileName",void 0),K=Y([(0,d.EM)("w3m-register-account-name-view")],K);var L=i(55018),G=i(51105);i(34556),i(8285),i(83416);let X=(0,r.AH)`
  .continue-button-container {
    width: 100%;
  }
`,J=class extends r.WF{render(){return(0,r.qy)`
      <wui-flex
        flexDirection="column"
        alignItems="center"
        gap="6"
        .padding=${["0","0","4","0"]}
      >
        ${this.onboardingTemplate()} ${this.buttonsTemplate()}
        <wui-link
          @click=${()=>{W.w.openHref(L.T.URLS.FAQ,"_blank")}}
        >
          Learn more
          <wui-icon color="inherit" slot="iconRight" name="externalLink"></wui-icon>
        </wui-link>
      </wui-flex>
    `}onboardingTemplate(){return(0,r.qy)` <wui-flex
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
    </wui-flex>`}buttonsTemplate(){return(0,r.qy)`<wui-flex
      .padding=${["0","4","0","4"]}
      gap="3"
      class="continue-button-container"
    >
      <wui-button fullWidth size="lg" borderRadius="xs" @click=${this.redirectToAccount.bind(this)}
        >Let's Go!
      </wui-button>
    </wui-flex>`}redirectToAccount(){G.I.replace("Account")}};J.styles=X,J=function(e,t,i,r){var o,n=arguments.length,a=n<3?t:null===r?r=Object.getOwnPropertyDescriptor(t,i):r;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(e,t,i,r);else for(var s=e.length-1;s>=0;s--)(o=e[s])&&(a=(n<3?o(a):n>3?o(t,i,a):o(t,i))||a);return n>3&&a&&Object.defineProperty(t,i,a),a}([(0,d.EM)("w3m-register-account-name-success-view")],J)}}]);