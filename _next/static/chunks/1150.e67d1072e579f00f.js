"use strict";(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[1150],{31150:(e,t,r)=>{r.r(t),r.d(t,{W3mBuyInProgressView:()=>M,W3mOnRampProvidersView:()=>R,W3mOnrampFiatSelectView:()=>h,W3mOnrampTokensView:()=>A,W3mOnrampWidget:()=>Z,W3mWhatIsABuyView:()=>E});var i=r(1850),o=r(58446),n=r(12689),s=r(33569),a=r(96320),c=r(4319),u=r(59390),l=r(24417),d=r(44458);r(85479),r(15241),r(60347),r(22071);let p=(0,d.AH)`
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
`;var m=function(e,t,r,i){var o,n=arguments.length,s=n<3?t:null===i?i=Object.getOwnPropertyDescriptor(t,r):i;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)s=Reflect.decorate(e,t,r,i);else for(var a=e.length-1;a>=0;a--)(o=e[a])&&(s=(n<3?o(s):n>3?o(t,r,s):o(t,r))||s);return n>3&&s&&Object.defineProperty(t,r,s),s};let h=class extends i.WF{constructor(){super(),this.unsubscribe=[],this.selectedCurrency=s.aG.state.paymentCurrency,this.currencies=s.aG.state.paymentCurrencies,this.currencyImages=a.j.state.currencyImages,this.checked=c.o.state.isLegalCheckboxChecked,this.unsubscribe.push(s.aG.subscribe(e=>{this.selectedCurrency=e.paymentCurrency,this.currencies=e.paymentCurrencies}),a.j.subscribeKey("currencyImages",e=>this.currencyImages=e),c.o.subscribeKey("isLegalCheckboxChecked",e=>{this.checked=e}))}disconnectedCallback(){this.unsubscribe.forEach(e=>e())}render(){let{termsConditionsUrl:e,privacyPolicyUrl:t}=u.H.state,r=u.H.state.features?.legalCheckbox,o=!!(e||t)&&!!r&&!this.checked;return(0,i.qy)`
      <w3m-legal-checkbox></w3m-legal-checkbox>
      <wui-flex
        flexDirection="column"
        .padding=${["0","3","3","3"]}
        gap="2"
        class=${(0,n.J)(o?"disabled":void 0)}
      >
        ${this.currenciesTemplate(o)}
      </wui-flex>
    `}currenciesTemplate(e=!1){return this.currencies.map(t=>(0,i.qy)`
        <wui-list-item
          imageSrc=${(0,n.J)(this.currencyImages?.[t.id])}
          @click=${()=>this.selectCurrency(t)}
          variant="image"
          tabIdx=${(0,n.J)(e?-1:void 0)}
        >
          <wui-text variant="md-medium" color="primary">${t.id}</wui-text>
        </wui-list-item>
      `)}selectCurrency(e){e&&(s.aG.setPaymentCurrency(e),l.W.close())}};h.styles=p,m([(0,o.wk)()],h.prototype,"selectedCurrency",void 0),m([(0,o.wk)()],h.prototype,"currencies",void 0),m([(0,o.wk)()],h.prototype,"currencyImages",void 0),m([(0,o.wk)()],h.prototype,"checked",void 0),h=m([(0,d.EM)("w3m-onramp-fiat-select-view")],h);var y=r(933),w=r(51105),f=r(21159),g=r(24101),b=r(81805),v=r(36421),x=r(11464);r(80729),r(41473),r(17244),r(36781);let k=(0,d.AH)`
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
`;var $=function(e,t,r,i){var o,n=arguments.length,s=n<3?t:null===i?i=Object.getOwnPropertyDescriptor(t,r):i;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)s=Reflect.decorate(e,t,r,i);else for(var a=e.length-1;a>=0;a--)(o=e[a])&&(s=(n<3?o(s):n>3?o(t,r,s):o(t,r))||s);return n>3&&s&&Object.defineProperty(t,r,s),s};let C=class extends i.WF{constructor(){super(...arguments),this.disabled=!1,this.color="inherit",this.label="",this.feeRange="",this.loading=!1,this.onClick=null}render(){return(0,i.qy)`
      <button ?disabled=${this.disabled} @click=${this.onClick} ontouchstart>
        <wui-visual name=${(0,n.J)(this.name)} class="provider-image"></wui-visual>
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
        ${this.loading?(0,i.qy)`<wui-loading-spinner color="secondary" size="md"></wui-loading-spinner>`:(0,i.qy)`<wui-icon name="chevronRight" color="default" size="sm"></wui-icon>`}
      </button>
    `}networksTemplate(){let e=y.W.getAllRequestedCaipNetworks(),t=e?.filter(e=>e?.assets?.imageId)?.slice(0,5);return(0,i.qy)`
      <wui-flex class="networks">
        ${t?.map(e=>(0,i.qy)`
            <wui-flex class="network-icon">
              <wui-image src=${(0,n.J)(x.$.getNetworkImage(e))}></wui-image>
            </wui-flex>
          `)}
      </wui-flex>
    `}};C.styles=[k],$([(0,o.MZ)({type:Boolean})],C.prototype,"disabled",void 0),$([(0,o.MZ)()],C.prototype,"color",void 0),$([(0,o.MZ)()],C.prototype,"name",void 0),$([(0,o.MZ)()],C.prototype,"label",void 0),$([(0,o.MZ)()],C.prototype,"feeRange",void 0),$([(0,o.MZ)({type:Boolean})],C.prototype,"loading",void 0),$([(0,o.MZ)()],C.prototype,"onClick",void 0),C=$([(0,d.EM)("w3m-onramp-provider-item")],C),r(6823);var P=function(e,t,r,i){var o,n=arguments.length,s=n<3?t:null===i?i=Object.getOwnPropertyDescriptor(t,r):i;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)s=Reflect.decorate(e,t,r,i);else for(var a=e.length-1;a>=0;a--)(o=e[a])&&(s=(n<3?o(s):n>3?o(t,r,s):o(t,r))||s);return n>3&&s&&Object.defineProperty(t,r,s),s};let R=class extends i.WF{constructor(){super(),this.unsubscribe=[],this.providers=s.aG.state.providers,this.unsubscribe.push(s.aG.subscribeKey("providers",e=>{this.providers=e}))}render(){return(0,i.qy)`
      <wui-flex flexDirection="column" .padding=${["0","3","3","3"]} gap="2">
        ${this.onRampProvidersTemplate()}
      </wui-flex>
    `}onRampProvidersTemplate(){return this.providers.filter(e=>e.supportedChains.includes(y.W.state.activeChain??"eip155")).map(e=>(0,i.qy)`
          <w3m-onramp-provider-item
            label=${e.label}
            name=${e.name}
            feeRange=${e.feeRange}
            @click=${()=>{this.onClickProvider(e)}}
            ?disabled=${!e.url}
            data-testid=${`onramp-provider-${e.name}`}
          ></w3m-onramp-provider-item>
        `)}onClickProvider(e){s.aG.setSelectedProvider(e),w.I.push("BuyInProgress"),f.w.openHref(s.aG.state.selectedProvider?.url||e.url,"popupWindow","width=600,height=800,scrollbars=yes"),g.E.sendEvent({type:"track",event:"SELECT_BUY_PROVIDER",properties:{provider:e.name,isSmartAccount:(0,b.lj)(y.W.state.activeChain)===v.Vl.ACCOUNT_TYPES.SMART_ACCOUNT}})}};P([(0,o.wk)()],R.prototype,"providers",void 0),R=P([(0,d.EM)("w3m-onramp-providers-view")],R),r(58014);let I=(0,d.AH)`
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
`;var O=function(e,t,r,i){var o,n=arguments.length,s=n<3?t:null===i?i=Object.getOwnPropertyDescriptor(t,r):i;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)s=Reflect.decorate(e,t,r,i);else for(var a=e.length-1;a>=0;a--)(o=e[a])&&(s=(n<3?o(s):n>3?o(t,r,s):o(t,r))||s);return n>3&&s&&Object.defineProperty(t,r,s),s};let A=class extends i.WF{constructor(){super(),this.unsubscribe=[],this.selectedCurrency=s.aG.state.purchaseCurrencies,this.tokens=s.aG.state.purchaseCurrencies,this.tokenImages=a.j.state.tokenImages,this.checked=c.o.state.isLegalCheckboxChecked,this.unsubscribe.push(s.aG.subscribe(e=>{this.selectedCurrency=e.purchaseCurrencies,this.tokens=e.purchaseCurrencies}),a.j.subscribeKey("tokenImages",e=>this.tokenImages=e),c.o.subscribeKey("isLegalCheckboxChecked",e=>{this.checked=e}))}disconnectedCallback(){this.unsubscribe.forEach(e=>e())}render(){let{termsConditionsUrl:e,privacyPolicyUrl:t}=u.H.state,r=u.H.state.features?.legalCheckbox,o=!!(e||t)&&!!r&&!this.checked;return(0,i.qy)`
      <w3m-legal-checkbox></w3m-legal-checkbox>
      <wui-flex
        flexDirection="column"
        .padding=${["0","3","3","3"]}
        gap="2"
        class=${(0,n.J)(o?"disabled":void 0)}
      >
        ${this.currenciesTemplate(o)}
      </wui-flex>
    `}currenciesTemplate(e=!1){return this.tokens.map(t=>(0,i.qy)`
        <wui-list-item
          imageSrc=${(0,n.J)(this.tokenImages?.[t.symbol])}
          @click=${()=>this.selectToken(t)}
          variant="image"
          tabIdx=${(0,n.J)(e?-1:void 0)}
        >
          <wui-flex gap="1" alignItems="center">
            <wui-text variant="md-medium" color="primary">${t.name}</wui-text>
            <wui-text variant="sm-regular" color="secondary">${t.symbol}</wui-text>
          </wui-flex>
        </wui-list-item>
      `)}selectToken(e){e&&(s.aG.setPurchaseCurrency(e),l.W.close())}};A.styles=I,O([(0,o.wk)()],A.prototype,"selectedCurrency",void 0),O([(0,o.wk)()],A.prototype,"tokens",void 0),O([(0,o.wk)()],A.prototype,"tokenImages",void 0),O([(0,o.wk)()],A.prototype,"checked",void 0),A=O([(0,d.EM)("w3m-onramp-token-select-view")],A);var j=r(26064),W=r(90889),q=r(82570);r(34556),r(8285),r(83416),r(74508);let G=(0,d.AH)`
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
`;var T=function(e,t,r,i){var o,n=arguments.length,s=n<3?t:null===i?i=Object.getOwnPropertyDescriptor(t,r):i;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)s=Reflect.decorate(e,t,r,i);else for(var a=e.length-1;a>=0;a--)(o=e[a])&&(s=(n<3?o(s):n>3?o(t,r,s):o(t,r))||s);return n>3&&s&&Object.defineProperty(t,r,s),s};let M=class extends i.WF{constructor(){super(),this.unsubscribe=[],this.selectedOnRampProvider=s.aG.state.selectedProvider,this.uri=j.x.state.wcUri,this.ready=!1,this.showRetry=!1,this.buffering=!1,this.error=!1,this.isMobile=!1,this.onRetry=void 0,this.unsubscribe.push(s.aG.subscribeKey("selectedProvider",e=>{this.selectedOnRampProvider=e}))}disconnectedCallback(){this.intervalId&&clearInterval(this.intervalId)}render(){let e="Continue in external window";this.error?e="Buy failed":this.selectedOnRampProvider&&(e=`Buy in ${this.selectedOnRampProvider?.label}`);let t=this.error?"Buy can be declined from your side or due to and error on the provider app":"We’ll notify you once your Buy is processed";return(0,i.qy)`
      <wui-flex
        data-error=${(0,n.J)(this.error)}
        data-retry=${this.showRetry}
        flexDirection="column"
        alignItems="center"
        .padding=${["10","5","5","5"]}
        gap="5"
      >
        <wui-flex justifyContent="center" alignItems="center">
          <wui-visual
            name=${(0,n.J)(this.selectedOnRampProvider?.name)}
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
    `}onTryAgain(){this.selectedOnRampProvider&&(this.error=!1,f.w.openHref(this.selectedOnRampProvider.url,"popupWindow","width=600,height=800,scrollbars=yes"))}tryAgainTemplate(){return this.selectedOnRampProvider?.url?(0,i.qy)`<wui-button size="md" variant="accent" @click=${this.onTryAgain.bind(this)}>
      <wui-icon color="inherit" slot="iconLeft" name="refresh"></wui-icon>
      Try again
    </wui-button>`:null}loaderTemplate(){let e=W.W.state.themeVariables["--w3m-border-radius-master"],t=e?parseInt(e.replace("px",""),10):4;return(0,i.qy)`<wui-loading-thumbnail radius=${9*t}></wui-loading-thumbnail>`}onCopyUri(){if(!this.selectedOnRampProvider?.url){q.P.showError("No link found"),w.I.goBack();return}try{f.w.copyToClopboard(this.selectedOnRampProvider.url),q.P.showSuccess("Link copied")}catch{q.P.showError("Failed to copy")}}};M.styles=G,T([(0,o.wk)()],M.prototype,"intervalId",void 0),T([(0,o.wk)()],M.prototype,"selectedOnRampProvider",void 0),T([(0,o.wk)()],M.prototype,"uri",void 0),T([(0,o.wk)()],M.prototype,"ready",void 0),T([(0,o.wk)()],M.prototype,"showRetry",void 0),T([(0,o.wk)()],M.prototype,"buffering",void 0),T([(0,o.wk)()],M.prototype,"error",void 0),T([(0,o.MZ)({type:Boolean})],M.prototype,"isMobile",void 0),T([(0,o.MZ)()],M.prototype,"onRetry",void 0),M=T([(0,d.EM)("w3m-buy-in-progress-view")],M);let E=class extends i.WF{render(){return(0,i.qy)`
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
        <wui-button @click=${w.I.goBack}>
          <wui-icon size="sm" color="inherit" name="add" slot="iconLeft"></wui-icon>
          Buy
        </wui-button>
      </wui-flex>
    `}};E=function(e,t,r,i){var o,n=arguments.length,s=n<3?t:null===i?i=Object.getOwnPropertyDescriptor(t,r):i;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)s=Reflect.decorate(e,t,r,i);else for(var a=e.length-1;a>=0;a--)(o=e[a])&&(s=(n<3?o(s):n>3?o(t,r,s):o(t,r))||s);return n>3&&s&&Object.defineProperty(t,r,s),s}([(0,d.EM)("w3m-what-is-a-buy-view")],E),r(39220);let D=(0,d.AH)`
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
`;var B=function(e,t,r,i){var o,n=arguments.length,s=n<3?t:null===i?i=Object.getOwnPropertyDescriptor(t,r):i;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)s=Reflect.decorate(e,t,r,i);else for(var a=e.length-1;a>=0;a--)(o=e[a])&&(s=(n<3?o(s):n>3?o(t,r,s):o(t,r))||s);return n>3&&s&&Object.defineProperty(t,r,s),s};let L=class extends i.WF{constructor(){super(),this.unsubscribe=[],this.type="Token",this.value=0,this.currencies=[],this.selectedCurrency=this.currencies?.[0],this.currencyImages=a.j.state.currencyImages,this.tokenImages=a.j.state.tokenImages,this.unsubscribe.push(s.aG.subscribeKey("purchaseCurrency",e=>{e&&"Fiat"!==this.type&&(this.selectedCurrency=this.formatPurchaseCurrency(e))}),s.aG.subscribeKey("paymentCurrency",e=>{e&&"Token"!==this.type&&(this.selectedCurrency=this.formatPaymentCurrency(e))}),s.aG.subscribe(e=>{"Fiat"===this.type?this.currencies=e.purchaseCurrencies.map(this.formatPurchaseCurrency):this.currencies=e.paymentCurrencies.map(this.formatPaymentCurrency)}),a.j.subscribe(e=>{this.currencyImages={...e.currencyImages},this.tokenImages={...e.tokenImages}}))}firstUpdated(){s.aG.getAvailableCurrencies()}disconnectedCallback(){this.unsubscribe.forEach(e=>e())}render(){let e=this.selectedCurrency?.symbol||"",t=this.currencyImages[e]||this.tokenImages[e];return(0,i.qy)`<wui-input-text type="number" size="lg" value=${this.value}>
      ${this.selectedCurrency?(0,i.qy)` <wui-flex
            class="currency-container"
            justifyContent="space-between"
            alignItems="center"
            gap="1"
            @click=${()=>l.W.open({view:`OnRamp${this.type}Select`})}
          >
            <wui-image src=${(0,n.J)(t)}></wui-image>
            <wui-text color="primary">${this.selectedCurrency.symbol}</wui-text>
          </wui-flex>`:(0,i.qy)`<wui-loading-spinner></wui-loading-spinner>`}
    </wui-input-text>`}formatPaymentCurrency(e){return{name:e.id,symbol:e.id}}formatPurchaseCurrency(e){return{name:e.name,symbol:e.symbol}}};L.styles=D,B([(0,o.MZ)({type:String})],L.prototype,"type",void 0),B([(0,o.MZ)({type:Number})],L.prototype,"value",void 0),B([(0,o.wk)()],L.prototype,"currencies",void 0),B([(0,o.wk)()],L.prototype,"selectedCurrency",void 0),B([(0,o.wk)()],L.prototype,"currencyImages",void 0),B([(0,o.wk)()],L.prototype,"tokenImages",void 0),L=B([(0,d.EM)("w3m-onramp-input")],L);let F=(0,d.AH)`
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
`;var S=function(e,t,r,i){var o,n=arguments.length,s=n<3?t:null===i?i=Object.getOwnPropertyDescriptor(t,r):i;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)s=Reflect.decorate(e,t,r,i);else for(var a=e.length-1;a>=0;a--)(o=e[a])&&(s=(n<3?o(s):n>3?o(t,r,s):o(t,r))||s);return n>3&&s&&Object.defineProperty(t,r,s),s};let z={USD:"$",EUR:"€",GBP:"\xa3"},H=[100,250,500,1e3],Z=class extends i.WF{constructor(){super(),this.unsubscribe=[],this.disabled=!1,this.caipAddress=y.W.state.activeCaipAddress,this.loading=l.W.state.loading,this.paymentCurrency=s.aG.state.paymentCurrency,this.paymentAmount=s.aG.state.paymentAmount,this.purchaseAmount=s.aG.state.purchaseAmount,this.quoteLoading=s.aG.state.quotesLoading,this.unsubscribe.push(y.W.subscribeKey("activeCaipAddress",e=>this.caipAddress=e),l.W.subscribeKey("loading",e=>{this.loading=e}),s.aG.subscribe(e=>{this.paymentCurrency=e.paymentCurrency,this.paymentAmount=e.paymentAmount,this.purchaseAmount=e.purchaseAmount,this.quoteLoading=e.quotesLoading}))}disconnectedCallback(){this.unsubscribe.forEach(e=>e())}render(){return(0,i.qy)`
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
            ${H.map(e=>(0,i.qy)`<wui-button
                  variant=${this.paymentAmount===e?"accent-secondary":"neutral-secondary"}
                  size="md"
                  textVariant="md-medium"
                  fullWidth
                  @click=${()=>this.selectPresetAmount(e)}
                  >${`${z[this.paymentCurrency?.id||"USD"]} ${e}`}</wui-button
                >`)}
          </wui-flex>
          ${this.templateButton()}
        </wui-flex>
      </wui-flex>
    `}templateButton(){return this.caipAddress?(0,i.qy)`<wui-button
          @click=${this.getQuotes.bind(this)}
          variant="accent-primary"
          fullWidth
          size="lg"
          borderRadius="xs"
        >
          Get quotes
        </wui-button>`:(0,i.qy)`<wui-button
          @click=${this.openModal.bind(this)}
          variant="accent"
          fullWidth
          size="lg"
          borderRadius="xs"
        >
          Connect wallet
        </wui-button>`}getQuotes(){this.loading||l.W.open({view:"OnRampProviders"})}openModal(){l.W.open({view:"Connect"})}async onPaymentAmountChange(e){s.aG.setPaymentAmount(Number(e.detail)),await s.aG.getQuote()}async selectPresetAmount(e){s.aG.setPaymentAmount(e),await s.aG.getQuote()}};Z.styles=F,S([(0,o.MZ)({type:Boolean})],Z.prototype,"disabled",void 0),S([(0,o.wk)()],Z.prototype,"caipAddress",void 0),S([(0,o.wk)()],Z.prototype,"loading",void 0),S([(0,o.wk)()],Z.prototype,"paymentCurrency",void 0),S([(0,o.wk)()],Z.prototype,"paymentAmount",void 0),S([(0,o.wk)()],Z.prototype,"purchaseAmount",void 0),S([(0,o.wk)()],Z.prototype,"quoteLoading",void 0),Z=S([(0,d.EM)("w3m-onramp-widget")],Z)},41473:(e,t,r)=>{r(56349)}}]);