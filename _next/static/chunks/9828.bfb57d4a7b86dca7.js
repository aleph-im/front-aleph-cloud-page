"use strict";(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[9828],{59828:function(e,t,i){i.r(t),i.d(t,{W3mApproveTransactionView:function(){return p},W3mRegisterAccountNameSuccess:function(){return H},W3mRegisterAccountNameView:function(){return Y},W3mSmartAccountSettingsView:function(){return k},W3mUpgradeWalletView:function(){return v}});var o=i(19064),r=i(59662),n=i(45374),a=i(83662),s=i(35428),c=i(9793),d=i(12858),u=i(28740),l=o.iv`
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
`,__decorate=function(e,t,i,o){var r,n=arguments.length,a=n<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(e,t,i,o);else for(var s=e.length-1;s>=0;s--)(r=e[s])&&(a=(n<3?r(a):n>3?r(t,i,a):r(t,i))||a);return n>3&&a&&Object.defineProperty(t,i,a),a};let p=class extends o.oi{constructor(){super(),this.bodyObserver=void 0,this.unsubscribe=[],this.iframe=document.getElementById("w3m-iframe"),this.ready=!1,this.unsubscribe.push(...[a.I.subscribeKey("open",e=>{e||this.onHideIframe()}),a.I.subscribeKey("shake",e=>{e?this.iframe.style.animation="w3m-shake 500ms var(--apkt-easings-ease-out-power-2)":this.iframe.style.animation="none"})])}disconnectedCallback(){this.onHideIframe(),this.unsubscribe.forEach(e=>e()),this.bodyObserver?.unobserve(window.document.body)}async firstUpdated(){await this.syncTheme(),this.iframe.style.display="block";let e=this?.renderRoot?.querySelector("div");this.bodyObserver=new ResizeObserver(t=>{let i=t?.[0]?.contentBoxSize,o=i?.[0]?.inlineSize;this.iframe.style.height="600px",e.style.height="600px",s.OptionsController.state.enableEmbedded?this.updateFrameSizeForEmbeddedMode():(o&&o<=430?(this.iframe.style.width="100%",this.iframe.style.left="0px",this.iframe.style.bottom="0px",this.iframe.style.top="unset"):(this.iframe.style.width="360px",this.iframe.style.left="calc(50% - 180px)",this.iframe.style.top="calc(50% - 300px + 32px)",this.iframe.style.bottom="unset"),this.onShowIframe())}),this.bodyObserver.observe(window.document.body)}render(){return o.dy`<div data-ready=${this.ready} id="w3m-frame-container"></div>`}onShowIframe(){let e=window.innerWidth<=430;this.ready=!0,this.iframe.style.animation=e?"w3m-iframe-zoom-in-mobile 200ms var(--apkt-easings-ease-out-power-2)":"w3m-iframe-zoom-in 200ms var(--apkt-easings-ease-out-power-2)"}onHideIframe(){this.iframe.style.display="none",this.iframe.style.animation="w3m-iframe-fade-out 200ms var(--apkt-easings-ease-out-power-2)"}async syncTheme(){let e=c.ConnectorController.getAuthConnector();if(e){let t=d.ThemeController.getSnapshot().themeMode,i=d.ThemeController.getSnapshot().themeVariables;await e.provider.syncTheme({themeVariables:i,w3mThemeVariables:(0,n.t)(i,t)})}}async updateFrameSizeForEmbeddedMode(){let e=this?.renderRoot?.querySelector("div");await new Promise(e=>{setTimeout(e,300)});let t=this.getBoundingClientRect();e.style.width="100%",this.iframe.style.left=`${t.left}px`,this.iframe.style.top=`${t.top}px`,this.iframe.style.width=`${t.width}px`,this.iframe.style.height=`${t.height}px`,this.onShowIframe()}};p.styles=l,__decorate([(0,r.SB)()],p.prototype,"ready",void 0),p=__decorate([(0,u.Mo)("w3m-approve-transaction-view")],p);var m=i(47205);i(82100),i(21927),i(31059),i(79556);var h=i(24134),g=i(25729),w=i(95636),f=w.iv`
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
`,wui_semantic_chip_decorate=function(e,t,i,o){var r,n=arguments.length,a=n<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(e,t,i,o);else for(var s=e.length-1;s>=0;s--)(r=e[s])&&(a=(n<3?r(a):n>3?r(t,i,a):r(t,i))||a);return n>3&&a&&Object.defineProperty(t,i,a),a};let b={sm:"md-regular",md:"lg-regular",lg:"lg-regular"},y={success:"sealCheck",error:"warning",warning:"exclamationCircle"},_=class extends o.oi{constructor(){super(...arguments),this.type="success",this.size="md",this.imageSrc=void 0,this.disabled=!1,this.href="",this.text=void 0}render(){return o.dy`
      <a
        rel="noreferrer"
        target="_blank"
        href=${this.href}
        class=${this.disabled?"disabled":""}
        data-type=${this.type}
        data-size=${this.size}
      >
        ${this.imageTemplate()}
        <wui-text variant=${b[this.size]} color="inherit">${this.text}</wui-text>
      </a>
    `}imageTemplate(){return this.imageSrc?o.dy`<wui-image src=${this.imageSrc} size="inherit"></wui-image>`:o.dy`<wui-icon
      name=${y[this.type]}
      weight="fill"
      color="inherit"
      size="inherit"
      class="image-icon"
    ></wui-icon>`}};_.styles=[h.ET,h.ZM,f],wui_semantic_chip_decorate([(0,r.Cb)()],_.prototype,"type",void 0),wui_semantic_chip_decorate([(0,r.Cb)()],_.prototype,"size",void 0),wui_semantic_chip_decorate([(0,r.Cb)()],_.prototype,"imageSrc",void 0),wui_semantic_chip_decorate([(0,r.Cb)({type:Boolean})],_.prototype,"disabled",void 0),wui_semantic_chip_decorate([(0,r.Cb)()],_.prototype,"href",void 0),wui_semantic_chip_decorate([(0,r.Cb)()],_.prototype,"text",void 0),_=wui_semantic_chip_decorate([(0,g.M)("wui-semantic-chip")],_),i(68390);let v=class extends o.oi{render(){return o.dy`
      <wui-flex flexDirection="column" alignItems="center" gap="5" padding="5">
        <wui-text variant="md-regular" color="primary">Follow the instructions on</wui-text>
        <wui-semantic-chip
          icon="externalLink"
          variant="fill"
          text=${m.bq.SECURE_SITE_DASHBOARD}
          href=${m.bq.SECURE_SITE_DASHBOARD}
          imageSrc=${m.bq.SECURE_SITE_FAVICON}
          data-testid="w3m-secure-website-button"
        >
        </wui-semantic-chip>
        <wui-text variant="sm-regular" color="secondary">
          You will have to reconnect for security reasons
        </wui-text>
      </wui-flex>
    `}};v=function(e,t,i,o){var r,n=arguments.length,a=n<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(e,t,i,o);else for(var s=e.length-1;s>=0;s--)(r=e[s])&&(a=(n<3?r(a):n>3?r(t,i,a):r(t,i))||a);return n>3&&a&&Object.defineProperty(t,i,a),a}([(0,u.Mo)("w3m-upgrade-wallet-view")],v);var x=i(68314),$=i(59757),S=i(18462),C=i(29460),A=i(21522),R=i(97363),T=i(22192),w3m_smart_account_settings_view_decorate=function(e,t,i,o){var r,n=arguments.length,a=n<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(e,t,i,o);else for(var s=e.length-1;s>=0;s--)(r=e[s])&&(a=(n<3?r(a):n>3?r(t,i,a):r(t,i))||a);return n>3&&a&&Object.defineProperty(t,i,a),a};let k=class extends o.oi{constructor(){super(...arguments),this.loading=!1,this.switched=!1,this.text="",this.network=$.R.state.activeCaipNetwork}render(){return o.dy`
      <wui-flex flexDirection="column" gap="2" .padding=${["6","4","3","4"]}>
        ${this.togglePreferredAccountTypeTemplate()} ${this.toggleSmartAccountVersionTemplate()}
      </wui-flex>
    `}toggleSmartAccountVersionTemplate(){return o.dy`
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
    `}isV6(){let e=R.e.get("dapp_smart_account_version")||"v6";return"v6"===e}toggleSmartAccountVersion(){R.e.set("dapp_smart_account_version",this.isV6()?"v7":"v6"),"undefined"!=typeof window&&window?.location?.reload()}togglePreferredAccountTypeTemplate(){let e=this.network?.chainNamespace,t=$.R.checkIfSmartAccountEnabled(),i=c.ConnectorController.getConnectorId(e),r=c.ConnectorController.getAuthConnector();return r&&i===x.b.CONNECTOR_ID.AUTH&&t?(this.switched||(this.text=(0,S.r9)(e)===T.y_.ACCOUNT_TYPES.SMART_ACCOUNT?"Switch to your EOA":"Switch to your Smart Account"),o.dy`
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
    `):null}async changePreferredAccountType(){let e=this.network?.chainNamespace,t=$.R.checkIfSmartAccountEnabled(),i=(0,S.r9)(e)!==T.y_.ACCOUNT_TYPES.SMART_ACCOUNT&&t?T.y_.ACCOUNT_TYPES.SMART_ACCOUNT:T.y_.ACCOUNT_TYPES.EOA,o=c.ConnectorController.getAuthConnector();o&&(this.loading=!0,await C.ConnectionController.setPreferredAccountType(i,e),this.text=i===T.y_.ACCOUNT_TYPES.SMART_ACCOUNT?"Switch to your EOA":"Switch to your Smart Account",this.switched=!0,A.S.resetSend(),this.loading=!1,this.requestUpdate())}};w3m_smart_account_settings_view_decorate([(0,r.SB)()],k.prototype,"loading",void 0),w3m_smart_account_settings_view_decorate([(0,r.SB)()],k.prototype,"switched",void 0),w3m_smart_account_settings_view_decorate([(0,r.SB)()],k.prototype,"text",void 0),w3m_smart_account_settings_view_decorate([(0,r.SB)()],k.prototype,"network",void 0),k=w3m_smart_account_settings_view_decorate([(0,u.Mo)("w3m-smart-account-settings-view")],k);var E=i(38192),N=i(26258),O=i(83241),P=i(51440),I=i(82879);i(51243),i(85185);var z=w.iv`
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
`,wui_account_name_suggestion_item_decorate=function(e,t,i,o){var r,n=arguments.length,a=n<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(e,t,i,o);else for(var s=e.length-1;s>=0;s--)(r=e[s])&&(a=(n<3?r(a):n>3?r(t,i,a):r(t,i))||a);return n>3&&a&&Object.defineProperty(t,i,a),a};let D=class extends o.oi{constructor(){super(...arguments),this.name="",this.registered=!1,this.loading=!1,this.disabled=!1}render(){return o.dy`
      <button ?disabled=${this.disabled}>
        <wui-text class="name" color="primary" variant="md-regular">${this.name}</wui-text>
        ${this.templateRightContent()}
      </button>
    `}templateRightContent(){return this.loading?o.dy`<wui-loading-spinner size="lg" color="primary"></wui-loading-spinner>`:this.registered?o.dy`<wui-tag variant="info" size="sm">Registered</wui-tag>`:o.dy`<wui-tag variant="success" size="sm">Available</wui-tag>`}};D.styles=[h.ET,h.ZM,z],wui_account_name_suggestion_item_decorate([(0,r.Cb)()],D.prototype,"name",void 0),wui_account_name_suggestion_item_decorate([(0,r.Cb)({type:Boolean})],D.prototype,"registered",void 0),wui_account_name_suggestion_item_decorate([(0,r.Cb)({type:Boolean})],D.prototype,"loading",void 0),wui_account_name_suggestion_item_decorate([(0,r.Cb)({type:Boolean})],D.prototype,"disabled",void 0),D=wui_account_name_suggestion_item_decorate([(0,g.M)("wui-account-name-suggestion-item")],D);var j=i(35162);i(72785);var M=w.iv`
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
`,wui_ens_input_decorate=function(e,t,i,o){var r,n=arguments.length,a=n<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(e,t,i,o);else for(var s=e.length-1;s>=0;s--)(r=e[s])&&(a=(n<3?r(a):n>3?r(t,i,a):r(t,i))||a);return n>3&&a&&Object.defineProperty(t,i,a),a};let U=class extends o.oi{constructor(){super(...arguments),this.disabled=!1,this.loading=!1}render(){return o.dy`
      <wui-input-text
        value=${(0,j.o)(this.value)}
        ?disabled=${this.disabled}
        .value=${this.value||""}
        data-testid="wui-ens-input"
        icon="search"
        inputRightPadding="5xl"
        .onKeyDown=${this.onKeyDown}
      ></wui-input-text>
    `}};U.styles=[h.ET,M],wui_ens_input_decorate([(0,r.Cb)()],U.prototype,"errorMessage",void 0),wui_ens_input_decorate([(0,r.Cb)({type:Boolean})],U.prototype,"disabled",void 0),wui_ens_input_decorate([(0,r.Cb)()],U.prototype,"value",void 0),wui_ens_input_decorate([(0,r.Cb)({type:Boolean})],U.prototype,"loading",void 0),wui_ens_input_decorate([(0,r.Cb)({attribute:!1})],U.prototype,"onKeyDown",void 0),U=wui_ens_input_decorate([(0,g.M)("wui-ens-input")],U),i(85642),i(8035),i(73049);var B=i(26249),V=u.iv`
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
`,w3m_register_account_name_view_decorate=function(e,t,i,o){var r,n=arguments.length,a=n<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(e,t,i,o);else for(var s=e.length-1;s>=0;s--)(r=e[s])&&(a=(n<3?r(a):n>3?r(t,i,a):r(t,i))||a);return n>3&&a&&Object.defineProperty(t,i,a),a};let Y=class extends o.oi{constructor(){super(),this.formRef=(0,E.V)(),this.usubscribe=[],this.name="",this.error="",this.loading=N.a.state.loading,this.suggestions=N.a.state.suggestions,this.profileName=$.R.getAccountData()?.profileName,this.onDebouncedNameInputChange=O.j.debounce(e=>{e.length<4?this.error="Name must be at least 4 characters long":B.g.isValidReownName(e)?(this.error="",N.a.getSuggestions(e)):this.error="The value is not a valid username"}),this.usubscribe.push(...[N.a.subscribe(e=>{this.suggestions=e.suggestions,this.loading=e.loading}),$.R.subscribeChainProp("accountState",e=>{this.profileName=e?.profileName,e?.profileName&&(this.error="You already own a name")})])}firstUpdated(){this.formRef.value?.addEventListener("keydown",this.onEnterKey.bind(this))}disconnectedCallback(){super.disconnectedCallback(),this.usubscribe.forEach(e=>e()),this.formRef.value?.removeEventListener("keydown",this.onEnterKey.bind(this))}render(){return o.dy`
      <wui-flex
        flexDirection="column"
        alignItems="center"
        gap="4"
        .padding=${["1","3","4","3"]}
      >
        <form ${(0,E.i)(this.formRef)} @submit=${this.onSubmitName.bind(this)}>
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
    `}submitButtonTemplate(){let e=this.suggestions.find(e=>e.name?.split(".")?.[0]===this.name&&e.registered);if(this.loading)return o.dy`<wui-loading-spinner
        class="input-loading-spinner"
        color="secondary"
      ></wui-loading-spinner>`;let t=`${this.name}${x.b.WC_NAME_SUFFIX}`;return o.dy`
      <wui-icon-link
        ?disabled=${!!e}
        class="input-submit-button"
        size="sm"
        icon="chevronRight"
        iconColor=${e?"default":"accent-primary"}
        @click=${()=>this.onSubmitName(t)}
      >
      </wui-icon-link>
    `}onNameInputChange(e){let t=B.g.validateReownName(e.detail||"");this.name=t,this.onDebouncedNameInputChange(t)}onKeyDown(e){1!==e.key.length||B.g.isValidReownName(e.key)||e.preventDefault()}templateSuggestions(){return!this.name||this.name.length<4||this.error?null:o.dy`<wui-flex flexDirection="column" gap="1" alignItems="center">
      ${this.suggestions.map(e=>o.dy`<wui-account-name-suggestion-item
            name=${e.name}
            ?registered=${e.registered}
            ?loading=${this.loading}
            ?disabled=${e.registered||this.loading}
            data-testid="account-name-suggestion"
            @click=${()=>this.onSubmitName(e.name)}
          ></wui-account-name-suggestion-item>`)}
    </wui-flex>`}isAllowedToSubmit(e){let t=e.split(".")?.[0],i=this.suggestions.find(e=>e.name?.split(".")?.[0]===t&&e.registered);return!this.loading&&!this.error&&!this.profileName&&t&&N.a.validateName(t)&&!i}async onSubmitName(e){try{if(!this.isAllowedToSubmit(e))return;P.X.sendEvent({type:"track",event:"REGISTER_NAME_INITIATED",properties:{isSmartAccount:(0,S.r9)($.R.state.activeChain)===T.y_.ACCOUNT_TYPES.SMART_ACCOUNT,ensName:e}}),await N.a.registerName(e),P.X.sendEvent({type:"track",event:"REGISTER_NAME_SUCCESS",properties:{isSmartAccount:(0,S.r9)($.R.state.activeChain)===T.y_.ACCOUNT_TYPES.SMART_ACCOUNT,ensName:e}})}catch(t){I.SnackController.showError(t.message),P.X.sendEvent({type:"track",event:"REGISTER_NAME_ERROR",properties:{isSmartAccount:(0,S.r9)($.R.state.activeChain)===T.y_.ACCOUNT_TYPES.SMART_ACCOUNT,ensName:e,error:O.j.parseError(t)}})}}onEnterKey(e){if("Enter"===e.key&&this.name&&this.isAllowedToSubmit(this.name)){let e=`${this.name}${x.b.WC_NAME_SUFFIX}`;this.onSubmitName(e)}}};Y.styles=V,w3m_register_account_name_view_decorate([(0,r.Cb)()],Y.prototype,"errorMessage",void 0),w3m_register_account_name_view_decorate([(0,r.SB)()],Y.prototype,"name",void 0),w3m_register_account_name_view_decorate([(0,r.SB)()],Y.prototype,"error",void 0),w3m_register_account_name_view_decorate([(0,r.SB)()],Y.prototype,"loading",void 0),w3m_register_account_name_view_decorate([(0,r.SB)()],Y.prototype,"suggestions",void 0),w3m_register_account_name_view_decorate([(0,r.SB)()],Y.prototype,"profileName",void 0),Y=w3m_register_account_name_view_decorate([(0,u.Mo)("w3m-register-account-name-view")],Y);var W=i(63735),F=i(4511);i(37826),i(12441),i(69804);var K=o.iv`
  .continue-button-container {
    width: 100%;
  }
`;let H=class extends o.oi{render(){return o.dy`
      <wui-flex
        flexDirection="column"
        alignItems="center"
        gap="6"
        .padding=${["0","0","4","0"]}
      >
        ${this.onboardingTemplate()} ${this.buttonsTemplate()}
        <wui-link
          @click=${()=>{O.j.openHref(W.U.URLS.FAQ,"_blank")}}
        >
          Learn more
          <wui-icon color="inherit" slot="iconRight" name="externalLink"></wui-icon>
        </wui-link>
      </wui-flex>
    `}onboardingTemplate(){return o.dy` <wui-flex
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
    </wui-flex>`}buttonsTemplate(){return o.dy`<wui-flex
      .padding=${["0","4","0","4"]}
      gap="3"
      class="continue-button-container"
    >
      <wui-button fullWidth size="lg" borderRadius="xs" @click=${this.redirectToAccount.bind(this)}
        >Let's Go!
      </wui-button>
    </wui-flex>`}redirectToAccount(){F.RouterController.replace("Account")}};H.styles=K,H=function(e,t,i,o){var r,n=arguments.length,a=n<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(e,t,i,o);else for(var s=e.length-1;s>=0;s--)(r=e[s])&&(a=(n<3?r(a):n>3?r(t,i,a):r(t,i))||a);return n>3&&a&&Object.defineProperty(t,i,a),a}([(0,u.Mo)("w3m-register-account-name-success-view")],H)}}]);