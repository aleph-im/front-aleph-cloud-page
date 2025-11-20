"use strict";(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[686],{70686:function(e,t,r){r.r(t),r.d(t,{W3mBuyInProgressView:function(){return B},W3mOnRampProvidersView:function(){return C},W3mOnrampFiatSelectView:function(){return m},W3mOnrampTokensView:function(){return k},W3mOnrampWidget:function(){return M},W3mWhatIsABuyView:function(){return S}});var i=r(19064),o=r(59662),n=r(35162),s=r(78600),a=r(87374),c=r(88686),u=r(35428),l=r(83662),d=r(28740);r(82100),r(84350),r(68390),r(27912);var p=d.iv`
  :host > wui-grid {
    max-height: 360px;
    overflow: auto;
  }

  wui-flex {
    transition: opacity ${({easings:e})=>e["ease-out-power-1"]}
      ${({durations:e})=>e.md};
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
`,__decorate=function(e,t,r,i){var o,n=arguments.length,s=n<3?t:null===i?i=Object.getOwnPropertyDescriptor(t,r):i;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)s=Reflect.decorate(e,t,r,i);else for(var a=e.length-1;a>=0;a--)(o=e[a])&&(s=(n<3?o(s):n>3?o(t,r,s):o(t,r))||s);return n>3&&s&&Object.defineProperty(t,r,s),s};let m=class extends i.oi{constructor(){super(),this.unsubscribe=[],this.selectedCurrency=s.ph.state.paymentCurrency,this.currencies=s.ph.state.paymentCurrencies,this.currencyImages=a.W.state.currencyImages,this.checked=c.M.state.isLegalCheckboxChecked,this.unsubscribe.push(...[s.ph.subscribe(e=>{this.selectedCurrency=e.paymentCurrency,this.currencies=e.paymentCurrencies}),a.W.subscribeKey("currencyImages",e=>this.currencyImages=e),c.M.subscribeKey("isLegalCheckboxChecked",e=>{this.checked=e})])}disconnectedCallback(){this.unsubscribe.forEach(e=>e())}render(){let{termsConditionsUrl:e,privacyPolicyUrl:t}=u.OptionsController.state,r=u.OptionsController.state.features?.legalCheckbox,o=!!(e||t)&&!!r&&!this.checked;return i.dy`
      <w3m-legal-checkbox></w3m-legal-checkbox>
      <wui-flex
        flexDirection="column"
        .padding=${["0","3","3","3"]}
        gap="2"
        class=${(0,n.o)(o?"disabled":void 0)}
      >
        ${this.currenciesTemplate(o)}
      </wui-flex>
    `}currenciesTemplate(e=!1){return this.currencies.map(t=>i.dy`
        <wui-list-item
          imageSrc=${(0,n.o)(this.currencyImages?.[t.id])}
          @click=${()=>this.selectCurrency(t)}
          variant="image"
          tabIdx=${(0,n.o)(e?-1:void 0)}
        >
          <wui-text variant="md-medium" color="primary">${t.id}</wui-text>
        </wui-list-item>
      `)}selectCurrency(e){e&&(s.ph.setPaymentCurrency(e),l.I.close())}};m.styles=p,__decorate([(0,o.SB)()],m.prototype,"selectedCurrency",void 0),__decorate([(0,o.SB)()],m.prototype,"currencies",void 0),__decorate([(0,o.SB)()],m.prototype,"currencyImages",void 0),__decorate([(0,o.SB)()],m.prototype,"checked",void 0),m=__decorate([(0,d.Mo)("w3m-onramp-fiat-select-view")],m);var h=r(59757),y=r(4511),w=r(83241),g=r(51440),b=r(18462),f=r(22192),v=r(44639);r(85642),r(87809),r(73049),r(40256);var _=d.iv`
  button {
    padding: ${({spacing:e})=>e["3"]};
    border-radius: ${({borderRadius:e})=>e["4"]};
    border: none;
    outline: none;
    background-color: ${({tokens:e})=>e.core.glass010};
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    gap: ${({spacing:e})=>e["3"]};
    transition: background-color ${({easings:e})=>e["ease-out-power-1"]}
      ${({durations:e})=>e.md};
    will-change: background-color;
    cursor: pointer;
  }

  button:hover {
    background-color: ${({tokens:e})=>e.theme.foregroundPrimary};
  }

  .provider-image {
    width: ${({spacing:e})=>e["10"]};
    min-width: ${({spacing:e})=>e["10"]};
    height: ${({spacing:e})=>e["10"]};
    border-radius: calc(
      ${({borderRadius:e})=>e["4"]} - calc(${({spacing:e})=>e["3"]} / 2)
    );
    position: relative;
    overflow: hidden;
  }

  .network-icon {
    width: ${({spacing:e})=>e["3"]};
    height: ${({spacing:e})=>e["3"]};
    border-radius: calc(${({spacing:e})=>e["3"]} / 2);
    overflow: hidden;
    box-shadow:
      0 0 0 3px ${({tokens:e})=>e.theme.foregroundPrimary},
      0 0 0 3px ${({tokens:e})=>e.theme.backgroundPrimary};
    transition: box-shadow ${({easings:e})=>e["ease-out-power-1"]}
      ${({durations:e})=>e.md};
    will-change: box-shadow;
  }

  button:hover .network-icon {
    box-shadow:
      0 0 0 3px ${({tokens:e})=>e.core.glass010},
      0 0 0 3px ${({tokens:e})=>e.theme.backgroundPrimary};
  }
`,w3m_onramp_provider_item_decorate=function(e,t,r,i){var o,n=arguments.length,s=n<3?t:null===i?i=Object.getOwnPropertyDescriptor(t,r):i;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)s=Reflect.decorate(e,t,r,i);else for(var a=e.length-1;a>=0;a--)(o=e[a])&&(s=(n<3?o(s):n>3?o(t,r,s):o(t,r))||s);return n>3&&s&&Object.defineProperty(t,r,s),s};let x=class extends i.oi{constructor(){super(...arguments),this.disabled=!1,this.color="inherit",this.label="",this.feeRange="",this.loading=!1,this.onClick=null}render(){return i.dy`
      <button ?disabled=${this.disabled} @click=${this.onClick} ontouchstart>
        <wui-visual name=${(0,n.o)(this.name)} class="provider-image"></wui-visual>
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
        ${this.loading?i.dy`<wui-loading-spinner color="secondary" size="md"></wui-loading-spinner>`:i.dy`<wui-icon name="chevronRight" color="default" size="sm"></wui-icon>`}
      </button>
    `}networksTemplate(){let e=h.R.getAllRequestedCaipNetworks(),t=e?.filter(e=>e?.assets?.imageId)?.slice(0,5);return i.dy`
      <wui-flex class="networks">
        ${t?.map(e=>i.dy`
            <wui-flex class="network-icon">
              <wui-image src=${n.o(v.f.getNetworkImage(e))}></wui-image>
            </wui-flex>
          `)}
      </wui-flex>
    `}};x.styles=[_],w3m_onramp_provider_item_decorate([(0,o.Cb)({type:Boolean})],x.prototype,"disabled",void 0),w3m_onramp_provider_item_decorate([(0,o.Cb)()],x.prototype,"color",void 0),w3m_onramp_provider_item_decorate([(0,o.Cb)()],x.prototype,"name",void 0),w3m_onramp_provider_item_decorate([(0,o.Cb)()],x.prototype,"label",void 0),w3m_onramp_provider_item_decorate([(0,o.Cb)()],x.prototype,"feeRange",void 0),w3m_onramp_provider_item_decorate([(0,o.Cb)({type:Boolean})],x.prototype,"loading",void 0),w3m_onramp_provider_item_decorate([(0,o.Cb)()],x.prototype,"onClick",void 0),x=w3m_onramp_provider_item_decorate([(0,d.Mo)("w3m-onramp-provider-item")],x),r(46647);var w3m_onramp_providers_view_decorate=function(e,t,r,i){var o,n=arguments.length,s=n<3?t:null===i?i=Object.getOwnPropertyDescriptor(t,r):i;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)s=Reflect.decorate(e,t,r,i);else for(var a=e.length-1;a>=0;a--)(o=e[a])&&(s=(n<3?o(s):n>3?o(t,r,s):o(t,r))||s);return n>3&&s&&Object.defineProperty(t,r,s),s};let C=class extends i.oi{constructor(){super(),this.unsubscribe=[],this.providers=s.ph.state.providers,this.unsubscribe.push(...[s.ph.subscribeKey("providers",e=>{this.providers=e})])}render(){return i.dy`
      <wui-flex flexDirection="column" .padding=${["0","3","3","3"]} gap="2">
        ${this.onRampProvidersTemplate()}
      </wui-flex>
    `}onRampProvidersTemplate(){return this.providers.filter(e=>e.supportedChains.includes(h.R.state.activeChain??"eip155")).map(e=>i.dy`
          <w3m-onramp-provider-item
            label=${e.label}
            name=${e.name}
            feeRange=${e.feeRange}
            @click=${()=>{this.onClickProvider(e)}}
            ?disabled=${!e.url}
            data-testid=${`onramp-provider-${e.name}`}
          ></w3m-onramp-provider-item>
        `)}onClickProvider(e){s.ph.setSelectedProvider(e),y.RouterController.push("BuyInProgress"),w.j.openHref(s.ph.state.selectedProvider?.url||e.url,"popupWindow","width=600,height=800,scrollbars=yes"),g.X.sendEvent({type:"track",event:"SELECT_BUY_PROVIDER",properties:{provider:e.name,isSmartAccount:(0,b.r9)(h.R.state.activeChain)===f.y_.ACCOUNT_TYPES.SMART_ACCOUNT}})}};w3m_onramp_providers_view_decorate([(0,o.SB)()],C.prototype,"providers",void 0),C=w3m_onramp_providers_view_decorate([(0,d.Mo)("w3m-onramp-providers-view")],C),r(86081);var $=d.iv`
  :host > wui-grid {
    max-height: 360px;
    overflow: auto;
  }

  wui-flex {
    transition: opacity ${({easings:e})=>e["ease-out-power-1"]}
      ${({durations:e})=>e.md};
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
`,w3m_onramp_tokens_select_view_decorate=function(e,t,r,i){var o,n=arguments.length,s=n<3?t:null===i?i=Object.getOwnPropertyDescriptor(t,r):i;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)s=Reflect.decorate(e,t,r,i);else for(var a=e.length-1;a>=0;a--)(o=e[a])&&(s=(n<3?o(s):n>3?o(t,r,s):o(t,r))||s);return n>3&&s&&Object.defineProperty(t,r,s),s};let k=class extends i.oi{constructor(){super(),this.unsubscribe=[],this.selectedCurrency=s.ph.state.purchaseCurrencies,this.tokens=s.ph.state.purchaseCurrencies,this.tokenImages=a.W.state.tokenImages,this.checked=c.M.state.isLegalCheckboxChecked,this.unsubscribe.push(...[s.ph.subscribe(e=>{this.selectedCurrency=e.purchaseCurrencies,this.tokens=e.purchaseCurrencies}),a.W.subscribeKey("tokenImages",e=>this.tokenImages=e),c.M.subscribeKey("isLegalCheckboxChecked",e=>{this.checked=e})])}disconnectedCallback(){this.unsubscribe.forEach(e=>e())}render(){let{termsConditionsUrl:e,privacyPolicyUrl:t}=u.OptionsController.state,r=u.OptionsController.state.features?.legalCheckbox,o=!!(e||t)&&!!r&&!this.checked;return i.dy`
      <w3m-legal-checkbox></w3m-legal-checkbox>
      <wui-flex
        flexDirection="column"
        .padding=${["0","3","3","3"]}
        gap="2"
        class=${(0,n.o)(o?"disabled":void 0)}
      >
        ${this.currenciesTemplate(o)}
      </wui-flex>
    `}currenciesTemplate(e=!1){return this.tokens.map(t=>i.dy`
        <wui-list-item
          imageSrc=${(0,n.o)(this.tokenImages?.[t.symbol])}
          @click=${()=>this.selectToken(t)}
          variant="image"
          tabIdx=${(0,n.o)(e?-1:void 0)}
        >
          <wui-flex gap="1" alignItems="center">
            <wui-text variant="md-medium" color="primary">${t.name}</wui-text>
            <wui-text variant="sm-regular" color="secondary">${t.symbol}</wui-text>
          </wui-flex>
        </wui-list-item>
      `)}selectToken(e){e&&(s.ph.setPurchaseCurrency(e),l.I.close())}};k.styles=$,w3m_onramp_tokens_select_view_decorate([(0,o.SB)()],k.prototype,"selectedCurrency",void 0),w3m_onramp_tokens_select_view_decorate([(0,o.SB)()],k.prototype,"tokens",void 0),w3m_onramp_tokens_select_view_decorate([(0,o.SB)()],k.prototype,"tokenImages",void 0),w3m_onramp_tokens_select_view_decorate([(0,o.SB)()],k.prototype,"checked",void 0),k=w3m_onramp_tokens_select_view_decorate([(0,d.Mo)("w3m-onramp-token-select-view")],k);var R=r(29460),P=r(12858),I=r(82879);r(37826),r(12441),r(69804),r(7013);var O=d.iv`
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
      ${({borderRadius:e})=>e["1"]} * 9 - ${({borderRadius:e})=>e["3"]}
    );
    position: relative;
    overflow: hidden;
  }

  wui-icon-box {
    position: absolute;
    right: calc(${({spacing:e})=>e["1"]} * -1);
    bottom: calc(${({spacing:e})=>e["1"]} * -1);
    opacity: 0;
    transform: scale(0.5);
    transition:
      opacity ${({durations:e})=>e.lg} ${({easings:e})=>e["ease-out-power-2"]},
      transform ${({durations:e})=>e.lg}
        ${({easings:e})=>e["ease-out-power-2"]};
    will-change: opacity, transform;
  }

  wui-text[align='center'] {
    width: 100%;
    padding: 0px ${({spacing:e})=>e["4"]};
  }

  [data-error='true'] wui-icon-box {
    opacity: 1;
    transform: scale(1);
  }

  [data-error='true'] > wui-flex:first-child {
    animation: shake 250ms ${({easings:e})=>e["ease-out-power-2"]} both;
  }

  [data-retry='false'] wui-link {
    display: none;
  }

  [data-retry='true'] wui-link {
    display: block;
    opacity: 1;
  }

  wui-link {
    padding: ${({spacing:e})=>e["01"]} ${({spacing:e})=>e["2"]};
  }
`,w3m_buy_in_progress_view_decorate=function(e,t,r,i){var o,n=arguments.length,s=n<3?t:null===i?i=Object.getOwnPropertyDescriptor(t,r):i;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)s=Reflect.decorate(e,t,r,i);else for(var a=e.length-1;a>=0;a--)(o=e[a])&&(s=(n<3?o(s):n>3?o(t,r,s):o(t,r))||s);return n>3&&s&&Object.defineProperty(t,r,s),s};let B=class extends i.oi{constructor(){super(),this.unsubscribe=[],this.selectedOnRampProvider=s.ph.state.selectedProvider,this.uri=R.ConnectionController.state.wcUri,this.ready=!1,this.showRetry=!1,this.buffering=!1,this.error=!1,this.isMobile=!1,this.onRetry=void 0,this.unsubscribe.push(...[s.ph.subscribeKey("selectedProvider",e=>{this.selectedOnRampProvider=e})])}disconnectedCallback(){this.intervalId&&clearInterval(this.intervalId)}render(){let e="Continue in external window";this.error?e="Buy failed":this.selectedOnRampProvider&&(e=`Buy in ${this.selectedOnRampProvider?.label}`);let t=this.error?"Buy can be declined from your side or due to and error on the provider app":`We’ll notify you once your Buy is processed`;return i.dy`
      <wui-flex
        data-error=${(0,n.o)(this.error)}
        data-retry=${this.showRetry}
        flexDirection="column"
        alignItems="center"
        .padding=${["10","5","5","5"]}
        gap="5"
      >
        <wui-flex justifyContent="center" alignItems="center">
          <wui-visual
            name=${(0,n.o)(this.selectedOnRampProvider?.name)}
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
          <wui-text align="center" variant="sm-medium" color="secondary">${t}</wui-text>
        </wui-flex>

        ${this.error?this.tryAgainTemplate():null}
      </wui-flex>

      <wui-flex .padding=${["0","5","5","5"]} justifyContent="center">
        <wui-link @click=${this.onCopyUri} color="secondary">
          <wui-icon size="sm" color="default" slot="iconLeft" name="copy"></wui-icon>
          Copy link
        </wui-link>
      </wui-flex>
    `}onTryAgain(){this.selectedOnRampProvider&&(this.error=!1,w.j.openHref(this.selectedOnRampProvider.url,"popupWindow","width=600,height=800,scrollbars=yes"))}tryAgainTemplate(){return this.selectedOnRampProvider?.url?i.dy`<wui-button size="md" variant="accent" @click=${this.onTryAgain.bind(this)}>
      <wui-icon color="inherit" slot="iconLeft" name="refresh"></wui-icon>
      Try again
    </wui-button>`:null}loaderTemplate(){let e=P.ThemeController.state.themeVariables["--w3m-border-radius-master"],t=e?parseInt(e.replace("px",""),10):4;return i.dy`<wui-loading-thumbnail radius=${9*t}></wui-loading-thumbnail>`}onCopyUri(){if(!this.selectedOnRampProvider?.url){I.SnackController.showError("No link found"),y.RouterController.goBack();return}try{w.j.copyToClopboard(this.selectedOnRampProvider.url),I.SnackController.showSuccess("Link copied")}catch{I.SnackController.showError("Failed to copy")}}};B.styles=O,w3m_buy_in_progress_view_decorate([(0,o.SB)()],B.prototype,"intervalId",void 0),w3m_buy_in_progress_view_decorate([(0,o.SB)()],B.prototype,"selectedOnRampProvider",void 0),w3m_buy_in_progress_view_decorate([(0,o.SB)()],B.prototype,"uri",void 0),w3m_buy_in_progress_view_decorate([(0,o.SB)()],B.prototype,"ready",void 0),w3m_buy_in_progress_view_decorate([(0,o.SB)()],B.prototype,"showRetry",void 0),w3m_buy_in_progress_view_decorate([(0,o.SB)()],B.prototype,"buffering",void 0),w3m_buy_in_progress_view_decorate([(0,o.SB)()],B.prototype,"error",void 0),w3m_buy_in_progress_view_decorate([(0,o.Cb)({type:Boolean})],B.prototype,"isMobile",void 0),w3m_buy_in_progress_view_decorate([(0,o.Cb)()],B.prototype,"onRetry",void 0),B=w3m_buy_in_progress_view_decorate([(0,d.Mo)("w3m-buy-in-progress-view")],B);let S=class extends i.oi{render(){return i.dy`
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
        <wui-button @click=${y.RouterController.goBack}>
          <wui-icon size="sm" color="inherit" name="add" slot="iconLeft"></wui-icon>
          Buy
        </wui-button>
      </wui-flex>
    `}};S=function(e,t,r,i){var o,n=arguments.length,s=n<3?t:null===i?i=Object.getOwnPropertyDescriptor(t,r):i;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)s=Reflect.decorate(e,t,r,i);else for(var a=e.length-1;a>=0;a--)(o=e[a])&&(s=(n<3?o(s):n>3?o(t,r,s):o(t,r))||s);return n>3&&s&&Object.defineProperty(t,r,s),s}([(0,d.Mo)("w3m-what-is-a-buy-view")],S),r(43722);var A=d.iv`
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
    right: ${({spacing:e})=>e["2"]};
    height: 40px;
    padding: ${({spacing:e})=>e["2"]} ${({spacing:e})=>e["2"]}
      ${({spacing:e})=>e["2"]} ${({spacing:e})=>e["2"]};
    min-width: 95px;
    border-radius: ${({borderRadius:e})=>e.round};
    border: 1px solid ${({tokens:e})=>e.theme.foregroundPrimary};
    background: ${({tokens:e})=>e.theme.foregroundPrimary};
    cursor: pointer;
  }

  .currency-container > wui-image {
    height: 24px;
    width: 24px;
    border-radius: 50%;
  }
`,w3m_onramp_input_decorate=function(e,t,r,i){var o,n=arguments.length,s=n<3?t:null===i?i=Object.getOwnPropertyDescriptor(t,r):i;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)s=Reflect.decorate(e,t,r,i);else for(var a=e.length-1;a>=0;a--)(o=e[a])&&(s=(n<3?o(s):n>3?o(t,r,s):o(t,r))||s);return n>3&&s&&Object.defineProperty(t,r,s),s};let j=class extends i.oi{constructor(){super(),this.unsubscribe=[],this.type="Token",this.value=0,this.currencies=[],this.selectedCurrency=this.currencies?.[0],this.currencyImages=a.W.state.currencyImages,this.tokenImages=a.W.state.tokenImages,this.unsubscribe.push(s.ph.subscribeKey("purchaseCurrency",e=>{e&&"Fiat"!==this.type&&(this.selectedCurrency=this.formatPurchaseCurrency(e))}),s.ph.subscribeKey("paymentCurrency",e=>{e&&"Token"!==this.type&&(this.selectedCurrency=this.formatPaymentCurrency(e))}),s.ph.subscribe(e=>{"Fiat"===this.type?this.currencies=e.purchaseCurrencies.map(this.formatPurchaseCurrency):this.currencies=e.paymentCurrencies.map(this.formatPaymentCurrency)}),a.W.subscribe(e=>{this.currencyImages={...e.currencyImages},this.tokenImages={...e.tokenImages}}))}firstUpdated(){s.ph.getAvailableCurrencies()}disconnectedCallback(){this.unsubscribe.forEach(e=>e())}render(){let e=this.selectedCurrency?.symbol||"",t=this.currencyImages[e]||this.tokenImages[e];return i.dy`<wui-input-text type="number" size="lg" value=${this.value}>
      ${this.selectedCurrency?i.dy` <wui-flex
            class="currency-container"
            justifyContent="space-between"
            alignItems="center"
            gap="1"
            @click=${()=>l.I.open({view:`OnRamp${this.type}Select`})}
          >
            <wui-image src=${(0,n.o)(t)}></wui-image>
            <wui-text color="primary">${this.selectedCurrency.symbol}</wui-text>
          </wui-flex>`:i.dy`<wui-loading-spinner></wui-loading-spinner>`}
    </wui-input-text>`}formatPaymentCurrency(e){return{name:e.id,symbol:e.id}}formatPurchaseCurrency(e){return{name:e.name,symbol:e.symbol}}};j.styles=A,w3m_onramp_input_decorate([(0,o.Cb)({type:String})],j.prototype,"type",void 0),w3m_onramp_input_decorate([(0,o.Cb)({type:Number})],j.prototype,"value",void 0),w3m_onramp_input_decorate([(0,o.SB)()],j.prototype,"currencies",void 0),w3m_onramp_input_decorate([(0,o.SB)()],j.prototype,"selectedCurrency",void 0),w3m_onramp_input_decorate([(0,o.SB)()],j.prototype,"currencyImages",void 0),w3m_onramp_input_decorate([(0,o.SB)()],j.prototype,"tokenImages",void 0),j=w3m_onramp_input_decorate([(0,d.Mo)("w3m-onramp-input")],j);var T=d.iv`
  :host > wui-flex {
    width: 100%;
    max-width: 360px;
  }

  :host > wui-flex > wui-flex {
    border-radius: ${({borderRadius:e})=>e["8"]};
    width: 100%;
  }

  .amounts-container {
    width: 100%;
  }
`,w3m_onramp_widget_decorate=function(e,t,r,i){var o,n=arguments.length,s=n<3?t:null===i?i=Object.getOwnPropertyDescriptor(t,r):i;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)s=Reflect.decorate(e,t,r,i);else for(var a=e.length-1;a>=0;a--)(o=e[a])&&(s=(n<3?o(s):n>3?o(t,r,s):o(t,r))||s);return n>3&&s&&Object.defineProperty(t,r,s),s};let D={USD:"$",EUR:"€",GBP:"\xa3"},W=[100,250,500,1e3],M=class extends i.oi{constructor(){super(),this.unsubscribe=[],this.disabled=!1,this.caipAddress=h.R.state.activeCaipAddress,this.loading=l.I.state.loading,this.paymentCurrency=s.ph.state.paymentCurrency,this.paymentAmount=s.ph.state.paymentAmount,this.purchaseAmount=s.ph.state.purchaseAmount,this.quoteLoading=s.ph.state.quotesLoading,this.unsubscribe.push(...[h.R.subscribeKey("activeCaipAddress",e=>this.caipAddress=e),l.I.subscribeKey("loading",e=>{this.loading=e}),s.ph.subscribe(e=>{this.paymentCurrency=e.paymentCurrency,this.paymentAmount=e.paymentAmount,this.purchaseAmount=e.purchaseAmount,this.quoteLoading=e.quotesLoading})])}disconnectedCallback(){this.unsubscribe.forEach(e=>e())}render(){return i.dy`
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
            ${W.map(e=>i.dy`<wui-button
                  variant=${this.paymentAmount===e?"accent-secondary":"neutral-secondary"}
                  size="md"
                  textVariant="md-medium"
                  fullWidth
                  @click=${()=>this.selectPresetAmount(e)}
                  >${`${D[this.paymentCurrency?.id||"USD"]} ${e}`}</wui-button
                >`)}
          </wui-flex>
          ${this.templateButton()}
        </wui-flex>
      </wui-flex>
    `}templateButton(){return this.caipAddress?i.dy`<wui-button
          @click=${this.getQuotes.bind(this)}
          variant="accent-primary"
          fullWidth
          size="lg"
          borderRadius="xs"
        >
          Get quotes
        </wui-button>`:i.dy`<wui-button
          @click=${this.openModal.bind(this)}
          variant="accent"
          fullWidth
          size="lg"
          borderRadius="xs"
        >
          Connect wallet
        </wui-button>`}getQuotes(){this.loading||l.I.open({view:"OnRampProviders"})}openModal(){l.I.open({view:"Connect"})}async onPaymentAmountChange(e){s.ph.setPaymentAmount(Number(e.detail)),await s.ph.getQuote()}async selectPresetAmount(e){s.ph.setPaymentAmount(e),await s.ph.getQuote()}};M.styles=T,w3m_onramp_widget_decorate([(0,o.Cb)({type:Boolean})],M.prototype,"disabled",void 0),w3m_onramp_widget_decorate([(0,o.SB)()],M.prototype,"caipAddress",void 0),w3m_onramp_widget_decorate([(0,o.SB)()],M.prototype,"loading",void 0),w3m_onramp_widget_decorate([(0,o.SB)()],M.prototype,"paymentCurrency",void 0),w3m_onramp_widget_decorate([(0,o.SB)()],M.prototype,"paymentAmount",void 0),w3m_onramp_widget_decorate([(0,o.SB)()],M.prototype,"purchaseAmount",void 0),w3m_onramp_widget_decorate([(0,o.SB)()],M.prototype,"quoteLoading",void 0),M=w3m_onramp_widget_decorate([(0,d.Mo)("w3m-onramp-widget")],M)},87809:function(e,t,r){r(31059)}}]);