"use strict";(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[6018],{46018:function(e,t,i){i.r(t),i.d(t,{W3mDepositFromExchangeSelectAssetView:function(){return C},W3mDepositFromExchangeView:function(){return v}});var n=i(19064),o=i(59662),a=i(35162),r=i(59757),s=i(92103),u=i(4511),c=i(44639),d=i(82879),l=i(29460),p=i(28740);i(21927),i(31059),i(79556);var h=i(24134),m=i(25729),g=i(95636),w=g.iv`
  button {
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
        ${({easings:e})=>e["ease-out-power-2"]};
    will-change: background-color, box-shadow;
  }

  /* -- Variants --------------------------------------------------------------- */
  button[data-type='accent'] {
    background-color: ${({tokens:e})=>e.core.backgroundAccentPrimary};
    color: ${({tokens:e})=>e.theme.textPrimary};
  }

  button[data-type='neutral'] {
    background-color: ${({tokens:e})=>e.theme.foregroundSecondary};
    color: ${({tokens:e})=>e.theme.textPrimary};
  }

  /* -- Sizes --------------------------------------------------------------- */
  button[data-size='sm'] {
    height: 24px;
  }

  button[data-size='md'] {
    height: 28px;
  }

  button[data-size='lg'] {
    height: 32px;
  }

  button[data-size='sm'] > wui-image,
  button[data-size='sm'] > wui-icon {
    width: 16px;
    height: 16px;
  }

  button[data-size='md'] > wui-image,
  button[data-size='md'] > wui-icon {
    width: 20px;
    height: 20px;
  }

  button[data-size='lg'] > wui-image,
  button[data-size='lg'] > wui-icon {
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
    button[data-type='accent']:not(:disabled):hover {
      background-color: ${({tokens:e})=>e.core.foregroundAccent060};
    }

    button[data-type='neutral']:not(:disabled):hover {
      background-color: ${({tokens:e})=>e.theme.foregroundTertiary};
    }
  }

  button[data-type='accent']:not(:disabled):focus-visible,
  button[data-type='accent']:not(:disabled):active {
    box-shadow: 0 0 0 4px ${({tokens:e})=>e.core.foregroundAccent020};
  }

  button[data-type='neutral']:not(:disabled):focus-visible,
  button[data-type='neutral']:not(:disabled):active {
    box-shadow: 0 0 0 4px ${({tokens:e})=>e.core.foregroundAccent020};
  }

  button:disabled {
    opacity: 0.5;
  }
`,__decorate=function(e,t,i,n){var o,a=arguments.length,r=a<3?t:null===n?n=Object.getOwnPropertyDescriptor(t,i):n;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)r=Reflect.decorate(e,t,i,n);else for(var s=e.length-1;s>=0;s--)(o=e[s])&&(r=(a<3?o(r):a>3?o(t,i,r):o(t,i))||r);return a>3&&r&&Object.defineProperty(t,i,r),r};let f={sm:"sm-regular",md:"md-regular",lg:"lg-regular"},y=class extends n.oi{constructor(){super(...arguments),this.type="accent",this.size="md",this.imageSrc="",this.disabled=!1,this.leftIcon=void 0,this.rightIcon=void 0,this.text=""}render(){return n.dy`
      <button ?disabled=${this.disabled} data-type=${this.type} data-size=${this.size}>
        ${this.imageSrc?n.dy`<wui-image src=${this.imageSrc}></wui-image>`:null}
        ${this.leftIcon?n.dy`<wui-icon name=${this.leftIcon} color="inherit" size="inherit"></wui-icon>`:null}
        <wui-text variant=${f[this.size]} color="inherit">${this.text}</wui-text>
        ${this.rightIcon?n.dy`<wui-icon name=${this.rightIcon} color="inherit" size="inherit"></wui-icon>`:null}
      </button>
    `}};y.styles=[h.ET,h.ZM,w],__decorate([(0,o.Cb)()],y.prototype,"type",void 0),__decorate([(0,o.Cb)()],y.prototype,"size",void 0),__decorate([(0,o.Cb)()],y.prototype,"imageSrc",void 0),__decorate([(0,o.Cb)({type:Boolean})],y.prototype,"disabled",void 0),__decorate([(0,o.Cb)()],y.prototype,"leftIcon",void 0),__decorate([(0,o.Cb)()],y.prototype,"rightIcon",void 0),__decorate([(0,o.Cb)()],y.prototype,"text",void 0),y=__decorate([(0,m.M)("wui-chip-button")],y),i(82100),i(8035),i(87809),i(84350),i(91833),i(68390),i(37826),i(27058),i(69804);var w3m_fund_input_decorate=function(e,t,i,n){var o,a=arguments.length,r=a<3?t:null===n?n=Object.getOwnPropertyDescriptor(t,i):n;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)r=Reflect.decorate(e,t,i,n);else for(var s=e.length-1;s>=0;s--)(o=e[s])&&(r=(a<3?o(r):a>3?o(t,i,r):o(t,i))||r);return a>3&&r&&Object.defineProperty(t,i,r),r};let x=class extends n.oi{constructor(){super(...arguments),this.maxDecimals=void 0,this.maxIntegers=void 0}render(){return n.dy`
      <wui-flex alignItems="center" gap="1">
        <wui-input-amount
          widthVariant="fit"
          fontSize="h2"
          .maxDecimals=${(0,a.o)(this.maxDecimals)}
          .maxIntegers=${(0,a.o)(this.maxIntegers)}
          .value=${this.amount?String(this.amount):""}
        ></wui-input-amount>
        <wui-text variant="md-regular" color="secondary">USD</wui-text>
      </wui-flex>
    `}};w3m_fund_input_decorate([(0,o.Cb)({type:Number})],x.prototype,"amount",void 0),w3m_fund_input_decorate([(0,o.Cb)({type:Number})],x.prototype,"maxDecimals",void 0),w3m_fund_input_decorate([(0,o.Cb)({type:Number})],x.prototype,"maxIntegers",void 0),x=w3m_fund_input_decorate([(0,p.Mo)("w3m-fund-input")],x);var b=p.iv`
  .amount-input-container {
    border-radius: ${({borderRadius:e})=>e["6"]};
    border-top-right-radius: 0;
    border-top-left-radius: 0;
    background-color: ${({tokens:e})=>e.theme.foregroundPrimary};
    padding: ${({spacing:e})=>e[1]};
  }

  .container {
    border-radius: 30px;
  }
`,w3m_deposit_from_exchange_view_decorate=function(e,t,i,n){var o,a=arguments.length,r=a<3?t:null===n?n=Object.getOwnPropertyDescriptor(t,i):n;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)r=Reflect.decorate(e,t,i,n);else for(var s=e.length-1;s>=0;s--)(o=e[s])&&(r=(a<3?o(r):a>3?o(t,i,r):o(t,i))||r);return a>3&&r&&Object.defineProperty(t,i,r),r};let _=[10,50,100],v=class extends n.oi{constructor(){super(),this.unsubscribe=[],this.network=r.R.state.activeCaipNetwork,this.exchanges=s.u.state.exchanges,this.isLoading=s.u.state.isLoading,this.amount=s.u.state.amount,this.tokenAmount=s.u.state.tokenAmount,this.priceLoading=s.u.state.priceLoading,this.isPaymentInProgress=s.u.state.isPaymentInProgress,this.currentPayment=s.u.state.currentPayment,this.paymentId=s.u.state.paymentId,this.paymentAsset=s.u.state.paymentAsset,this.unsubscribe.push(r.R.subscribeKey("activeCaipNetwork",e=>{this.network=e,this.setDefaultPaymentAsset()}),s.u.subscribe(e=>{this.exchanges=e.exchanges,this.isLoading=e.isLoading,this.amount=e.amount,this.tokenAmount=e.tokenAmount,this.priceLoading=e.priceLoading,this.paymentId=e.paymentId,this.isPaymentInProgress=e.isPaymentInProgress,this.currentPayment=e.currentPayment,this.paymentAsset=e.paymentAsset;let t=e.isPaymentInProgress&&e.currentPayment?.exchangeId&&e.currentPayment?.sessionId&&e.paymentId;t&&this.handlePaymentInProgress()}))}disconnectedCallback(){this.unsubscribe.forEach(e=>e());let e=s.u.state.isPaymentInProgress;e||s.u.reset()}async firstUpdated(){await this.getPaymentAssets(),this.paymentAsset||await this.setDefaultPaymentAsset(),s.u.setAmount(_[0]),await s.u.fetchExchanges()}render(){return n.dy`
      <wui-flex flexDirection="column" class="container">
        ${this.amountInputTemplate()} ${this.exchangesTemplate()}
      </wui-flex>
    `}exchangesLoadingTemplate(){return Array.from({length:2}).map(()=>n.dy`<wui-shimmer width="100%" height="65px" borderRadius="xxs"></wui-shimmer>`)}_exchangesTemplate(){return this.exchanges.length>0?this.exchanges.map(e=>n.dy`<wui-list-item
              @click=${()=>this.onExchangeClick(e)}
              chevron
              variant="image"
              imageSrc=${e.imageUrl}
              ?loading=${this.isLoading}
            >
              <wui-text variant="md-regular" color="primary">
                Deposit from ${e.name}
              </wui-text>
            </wui-list-item>`):n.dy`<wui-flex flexDirection="column" alignItems="center" gap="4" padding="4">
          <wui-text variant="lg-medium" align="center" color="primary">
            No exchanges support this asset on this network
          </wui-text>
        </wui-flex>`}exchangesTemplate(){return n.dy`<wui-flex
      flexDirection="column"
      gap="2"
      .padding=${["3","3","3","3"]}
      class="exchanges-container"
    >
      ${this.isLoading?this.exchangesLoadingTemplate():this._exchangesTemplate()}
    </wui-flex>`}amountInputTemplate(){return n.dy`
      <wui-flex
        flexDirection="column"
        .padding=${["0","3","3","3"]}
        class="amount-input-container"
      >
        <wui-flex
          justifyContent="space-between"
          alignItems="center"
          .margin=${["0","0","6","0"]}
        >
          <wui-text variant="md-medium" color="secondary">Asset</wui-text>
          <wui-token-button
            data-testid="deposit-from-exchange-asset-button"
            flexDirection="row-reverse"
            text=${this.paymentAsset?.metadata.symbol||""}
            imageSrc=${this.paymentAsset?.metadata.iconUrl||""}
            @click=${()=>u.RouterController.push("PayWithExchangeSelectAsset")}
            size="lg"
            .chainImageSrc=${(0,a.o)(c.f.getNetworkImage(this.network))}
          >
          </wui-token-button>
        </wui-flex>
        <wui-flex
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          .margin=${["0","0","4","0"]}
        >
          <w3m-fund-input
            @inputChange=${this.onAmountChange.bind(this)}
            .amount=${this.amount}
            .maxDecimals=${6}
            .maxIntegers=${10}
          >
          </w3m-fund-input>
          ${this.tokenAmountTemplate()}
        </wui-flex>
        <wui-flex justifyContent="center" gap="2">
          ${_.map(e=>n.dy`<wui-chip-button
                @click=${()=>s.u.setAmount(e)}
                type="neutral"
                size="lg"
                text=${`$${e}`}
              ></wui-chip-button>`)}
        </wui-flex>
      </wui-flex>
    `}tokenAmountTemplate(){return this.priceLoading?n.dy`<wui-shimmer
        width="65px"
        height="20px"
        borderRadius="xxs"
        variant="light"
      ></wui-shimmer>`:n.dy`
      <wui-text variant="md-regular" color="secondary">
        ${this.tokenAmount.toFixed(4)} ${this.paymentAsset?.metadata.symbol}
      </wui-text>
    `}async onExchangeClick(e){if(!this.amount){d.SnackController.showError("Please enter an amount");return}await s.u.handlePayWithExchange(e.id)}handlePaymentInProgress(){let e=r.R.state.activeChain,{redirectView:t="Account"}=u.RouterController.state.data??{};this.isPaymentInProgress&&this.currentPayment?.exchangeId&&this.currentPayment?.sessionId&&this.paymentId&&(s.u.waitUntilComplete({exchangeId:this.currentPayment.exchangeId,sessionId:this.currentPayment.sessionId,paymentId:this.paymentId}).then(t=>{"SUCCESS"===t.status?(d.SnackController.showSuccess("Deposit completed"),s.u.reset(),e&&(r.R.fetchTokenBalance(),l.ConnectionController.updateBalance(e)),u.RouterController.replace("Transactions")):"FAILED"===t.status&&d.SnackController.showError("Deposit failed")}),d.SnackController.showLoading("Deposit in progress..."),u.RouterController.replace(t))}onAmountChange({detail:e}){s.u.setAmount(e?Number(e):null)}async getPaymentAssets(){this.network&&await s.u.getAssetsForNetwork(this.network.caipNetworkId)}async setDefaultPaymentAsset(){if(this.network){let e=await s.u.getAssetsForNetwork(this.network.caipNetworkId);e[0]&&s.u.setPaymentAsset(e[0])}}};v.styles=b,w3m_deposit_from_exchange_view_decorate([(0,o.SB)()],v.prototype,"network",void 0),w3m_deposit_from_exchange_view_decorate([(0,o.SB)()],v.prototype,"exchanges",void 0),w3m_deposit_from_exchange_view_decorate([(0,o.SB)()],v.prototype,"isLoading",void 0),w3m_deposit_from_exchange_view_decorate([(0,o.SB)()],v.prototype,"amount",void 0),w3m_deposit_from_exchange_view_decorate([(0,o.SB)()],v.prototype,"tokenAmount",void 0),w3m_deposit_from_exchange_view_decorate([(0,o.SB)()],v.prototype,"priceLoading",void 0),w3m_deposit_from_exchange_view_decorate([(0,o.SB)()],v.prototype,"isPaymentInProgress",void 0),w3m_deposit_from_exchange_view_decorate([(0,o.SB)()],v.prototype,"currentPayment",void 0),w3m_deposit_from_exchange_view_decorate([(0,o.SB)()],v.prototype,"paymentId",void 0),w3m_deposit_from_exchange_view_decorate([(0,o.SB)()],v.prototype,"paymentAsset",void 0),v=w3m_deposit_from_exchange_view_decorate([(0,p.Mo)("w3m-deposit-from-exchange-view")],v);var $=i(83241);i(85642),i(12441),i(43722),i(87204),i(82002);var k=p.iv`
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
    border-radius: ${({borderRadius:e})=>e["3"]};
  }
`,w3m_deposit_from_exchange_select_asset_view_decorate=function(e,t,i,n){var o,a=arguments.length,r=a<3?t:null===n?n=Object.getOwnPropertyDescriptor(t,i):n;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)r=Reflect.decorate(e,t,i,n);else for(var s=e.length-1;s>=0;s--)(o=e[s])&&(r=(a<3?o(r):a>3?o(t,i,r):o(t,i))||r);return a>3&&r&&Object.defineProperty(t,i,r),r};let C=class extends n.oi{constructor(){super(),this.unsubscribe=[],this.assets=s.u.state.assets,this.search="",this.onDebouncedSearch=$.j.debounce(e=>{this.search=e}),this.unsubscribe.push(...[s.u.subscribe(e=>{this.assets=e.assets})])}disconnectedCallback(){this.unsubscribe.forEach(e=>e())}render(){return n.dy`
      <wui-flex flexDirection="column">
        ${this.templateSearchInput()} <wui-separator></wui-separator> ${this.templateTokens()}
      </wui-flex>
    `}templateSearchInput(){return n.dy`
      <wui-flex gap="2" padding="3">
        <wui-input-text
          @inputChange=${this.onInputChange.bind(this)}
          class="network-search-input"
          size="sm"
          placeholder="Search token"
          icon="search"
        ></wui-input-text>
      </wui-flex>
    `}templateTokens(){let e=this.assets.filter(e=>e.metadata.name.toLowerCase().includes(this.search.toLowerCase())),t=e.length>0;return n.dy`
      <wui-flex
        class="contentContainer"
        flexDirection="column"
        .padding=${["0","3","0","3"]}
      >
        <wui-flex justifyContent="flex-start" .padding=${["4","3","3","3"]}>
          <wui-text variant="md-medium" color="secondary">Available tokens</wui-text>
        </wui-flex>
        <wui-flex flexDirection="column" gap="2">
          ${t?e.map(e=>n.dy`<wui-list-item
                    .imageSrc=${e.metadata.iconUrl}
                    ?clickable=${!0}
                    @click=${this.handleTokenClick.bind(this,e)}
                  >
                    <wui-text variant="md-medium" color="primary">${e.metadata.name}</wui-text>
                    <wui-text variant="md-regular" color="secondary"
                      >${e.metadata.symbol}</wui-text
                    >
                  </wui-list-item>`):n.dy`<wui-flex
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
                >
                  <wui-text variant="lg-medium" align="center" color="primary">
                    No tokens found
                  </wui-text>
                </wui-flex>
                <wui-link @click=${this.onBuyClick.bind(this)}>Buy</wui-link>
              </wui-flex>`}
        </wui-flex>
      </wui-flex>
    `}onBuyClick(){u.RouterController.push("OnRampProviders")}onInputChange(e){this.onDebouncedSearch(e.detail)}handleTokenClick(e){s.u.setPaymentAsset(e),u.RouterController.goBack()}};C.styles=k,w3m_deposit_from_exchange_select_asset_view_decorate([(0,o.SB)()],C.prototype,"assets",void 0),w3m_deposit_from_exchange_select_asset_view_decorate([(0,o.SB)()],C.prototype,"search",void 0),C=w3m_deposit_from_exchange_select_asset_view_decorate([(0,p.Mo)("w3m-deposit-from-exchange-select-asset-view")],C)},87809:function(e,t,i){i(31059)},27058:function(e,t,i){var n=i(19064),o=i(59662),a=i(38192),r=i(95636),s=i(24134),u=i(1512),c=i(25729),d=r.iv`
  :host {
    position: relative;
    display: inline-block;
  }

  :host([data-error='true']) > input {
    color: ${({tokens:e})=>e.core.textError};
  }

  :host([data-error='false']) > input {
    color: ${({tokens:e})=>e.theme.textSecondary};
  }

  input {
    background: transparent;
    height: auto;
    box-sizing: border-box;
    color: ${({tokens:e})=>e.theme.textPrimary};
    font-feature-settings: 'case' on;
    font-size: ${({textSize:e})=>e.h4};
    caret-color: ${({tokens:e})=>e.core.backgroundAccentPrimary};
    line-height: ${({typography:e})=>e["h4-regular-mono"].lineHeight};
    letter-spacing: ${({typography:e})=>e["h4-regular-mono"].letterSpacing};
    -webkit-appearance: none;
    -moz-appearance: textfield;
    padding: 0px;
    font-family: ${({fontFamily:e})=>e.mono};
  }

  :host([data-width-variant='auto']) input {
    width: 100%;
  }

  :host([data-width-variant='fit']) input {
    width: 1ch;
  }

  .wui-input-amount-fit-mirror {
    position: absolute;
    visibility: hidden;
    white-space: pre;
    font-size: var(--local-font-size);
    line-height: 130%;
    letter-spacing: -1.28px;
    font-family: ${({fontFamily:e})=>e.mono};
  }

  .wui-input-amount-fit-width {
    display: inline-block;
    position: relative;
  }

  input::-webkit-outer-spin-button,
  input::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }

  input::placeholder {
    color: ${({tokens:e})=>e.theme.textSecondary};
  }
`,__decorate=function(e,t,i,n){var o,a=arguments.length,r=a<3?t:null===n?n=Object.getOwnPropertyDescriptor(t,i):n;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)r=Reflect.decorate(e,t,i,n);else for(var s=e.length-1;s>=0;s--)(o=e[s])&&(r=(a<3?o(r):a>3?o(t,i,r):o(t,i))||r);return a>3&&r&&Object.defineProperty(t,i,r),r};let l=class extends n.oi{constructor(){super(...arguments),this.inputElementRef=(0,a.V)(),this.disabled=!1,this.value="",this.placeholder="0",this.widthVariant="auto",this.maxDecimals=void 0,this.maxIntegers=void 0,this.fontSize="h4",this.error=!1}firstUpdated(){this.resizeInput()}updated(){this.style.setProperty("--local-font-size",r.gR.textSize[this.fontSize]),this.resizeInput()}render(){return(this.dataset.widthVariant=this.widthVariant,this.dataset.error=String(this.error),this.inputElementRef?.value&&this.value&&(this.inputElementRef.value.value=this.value),"auto"===this.widthVariant)?this.inputTemplate():n.dy`
      <div class="wui-input-amount-fit-width">
        <span class="wui-input-amount-fit-mirror"></span>
        ${this.inputTemplate()}
      </div>
    `}inputTemplate(){return n.dy`<input
      ${(0,a.i)(this.inputElementRef)}
      type="text"
      inputmode="decimal"
      pattern="[0-9,.]*"
      placeholder=${this.placeholder}
      ?disabled=${this.disabled}
      autofocus
      value=${this.value??""}
      @input=${this.dispatchInputChangeEvent.bind(this)}
    />`}dispatchInputChangeEvent(){this.inputElementRef.value&&(this.inputElementRef.value.value=u.H.maskInput({value:this.inputElementRef.value.value,decimals:this.maxDecimals,integers:this.maxIntegers}),this.dispatchEvent(new CustomEvent("inputChange",{detail:this.inputElementRef.value.value,bubbles:!0,composed:!0})),this.resizeInput())}resizeInput(){if("fit"===this.widthVariant){let e=this.inputElementRef.value;if(e){let t=e.previousElementSibling;t&&(t.textContent=e.value||"0",e.style.width=`${t.offsetWidth}px`)}}}};l.styles=[s.ET,s.ZM,d],__decorate([(0,o.Cb)({type:Boolean})],l.prototype,"disabled",void 0),__decorate([(0,o.Cb)({type:String})],l.prototype,"value",void 0),__decorate([(0,o.Cb)({type:String})],l.prototype,"placeholder",void 0),__decorate([(0,o.Cb)({type:String})],l.prototype,"widthVariant",void 0),__decorate([(0,o.Cb)({type:Number})],l.prototype,"maxDecimals",void 0),__decorate([(0,o.Cb)({type:Number})],l.prototype,"maxIntegers",void 0),__decorate([(0,o.Cb)({type:String})],l.prototype,"fontSize",void 0),__decorate([(0,o.Cb)({type:Boolean})],l.prototype,"error",void 0),__decorate([(0,c.M)("wui-input-amount")],l)}}]);