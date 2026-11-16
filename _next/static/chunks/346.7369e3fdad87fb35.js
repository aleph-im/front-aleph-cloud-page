"use strict";(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[346],{41473:(t,e,i)=>{i(56349)},80346:(t,e,i)=>{i.r(e),i.d(e,{W3mDepositFromExchangeSelectAssetView:()=>z,W3mDepositFromExchangeView:()=>P});var n=i(1850),a=i(58446),o=i(12689),s=i(933),r=i(75329),u=i(51105),c=i(11464),l=i(82570),d=i(26064),h=i(44458);i(13496),i(56349),i(53059);var p=i(54684),m=i(51127),g=i(41608);let y=(0,g.AH)`
  button {
    border: none;
    border-radius: ${({borderRadius:t})=>t["20"]};
    display: flex;
    flex-direction: row;
    align-items: center;
    padding: ${({spacing:t})=>t[1]};
    transition:
      background-color ${({durations:t})=>t.lg}
        ${({easings:t})=>t["ease-out-power-2"]},
      box-shadow ${({durations:t})=>t.lg}
        ${({easings:t})=>t["ease-out-power-2"]};
    will-change: background-color, box-shadow;
  }

  /* -- Variants --------------------------------------------------------------- */
  button[data-type='accent'] {
    background-color: ${({tokens:t})=>t.core.backgroundAccentPrimary};
    color: ${({tokens:t})=>t.theme.textPrimary};
  }

  button[data-type='neutral'] {
    background-color: ${({tokens:t})=>t.theme.foregroundSecondary};
    color: ${({tokens:t})=>t.theme.textPrimary};
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
    padding-left: ${({spacing:t})=>t[1]};
    padding-right: ${({spacing:t})=>t[1]};
  }

  wui-image {
    border-radius: ${({borderRadius:t})=>t[3]};
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
      background-color: ${({tokens:t})=>t.core.foregroundAccent060};
    }

    button[data-type='neutral']:not(:disabled):hover {
      background-color: ${({tokens:t})=>t.theme.foregroundTertiary};
    }
  }

  button[data-type='accent']:not(:disabled):focus-visible,
  button[data-type='accent']:not(:disabled):active {
    box-shadow: 0 0 0 4px ${({tokens:t})=>t.core.foregroundAccent020};
  }

  button[data-type='neutral']:not(:disabled):focus-visible,
  button[data-type='neutral']:not(:disabled):active {
    box-shadow: 0 0 0 4px ${({tokens:t})=>t.core.foregroundAccent020};
  }

  button:disabled {
    opacity: 0.5;
  }
`;var w=function(t,e,i,n){var a,o=arguments.length,s=o<3?e:null===n?n=Object.getOwnPropertyDescriptor(e,i):n;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)s=Reflect.decorate(t,e,i,n);else for(var r=t.length-1;r>=0;r--)(a=t[r])&&(s=(o<3?a(s):o>3?a(e,i,s):a(e,i))||s);return o>3&&s&&Object.defineProperty(e,i,s),s};let f={sm:"sm-regular",md:"md-regular",lg:"lg-regular"},x=class extends n.WF{constructor(){super(...arguments),this.type="accent",this.size="md",this.imageSrc="",this.disabled=!1,this.leftIcon=void 0,this.rightIcon=void 0,this.text=""}render(){return(0,n.qy)`
      <button ?disabled=${this.disabled} data-type=${this.type} data-size=${this.size}>
        ${this.imageSrc?(0,n.qy)`<wui-image src=${this.imageSrc}></wui-image>`:null}
        ${this.leftIcon?(0,n.qy)`<wui-icon name=${this.leftIcon} color="inherit" size="inherit"></wui-icon>`:null}
        <wui-text variant=${f[this.size]} color="inherit">${this.text}</wui-text>
        ${this.rightIcon?(0,n.qy)`<wui-icon name=${this.rightIcon} color="inherit" size="inherit"></wui-icon>`:null}
      </button>
    `}};x.styles=[p.W5,p.fD,y],w([(0,a.MZ)()],x.prototype,"type",void 0),w([(0,a.MZ)()],x.prototype,"size",void 0),w([(0,a.MZ)()],x.prototype,"imageSrc",void 0),w([(0,a.MZ)({type:Boolean})],x.prototype,"disabled",void 0),w([(0,a.MZ)()],x.prototype,"leftIcon",void 0),w([(0,a.MZ)()],x.prototype,"rightIcon",void 0),w([(0,a.MZ)()],x.prototype,"text",void 0),x=w([(0,m.E)("wui-chip-button")],x),i(85479),i(28824),i(41473),i(15241),i(41835),i(60347),i(34556),i(81398),i(83416);var b=function(t,e,i,n){var a,o=arguments.length,s=o<3?e:null===n?n=Object.getOwnPropertyDescriptor(e,i):n;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)s=Reflect.decorate(t,e,i,n);else for(var r=t.length-1;r>=0;r--)(a=t[r])&&(s=(o<3?a(s):o>3?a(e,i,s):a(e,i))||s);return o>3&&s&&Object.defineProperty(e,i,s),s};let v=class extends n.WF{constructor(){super(...arguments),this.maxDecimals=void 0,this.maxIntegers=void 0}render(){return(0,n.qy)`
      <wui-flex alignItems="center" gap="1">
        <wui-input-amount
          widthVariant="fit"
          fontSize="h2"
          .maxDecimals=${(0,o.J)(this.maxDecimals)}
          .maxIntegers=${(0,o.J)(this.maxIntegers)}
          .value=${this.amount?String(this.amount):""}
        ></wui-input-amount>
        <wui-text variant="md-regular" color="secondary">USD</wui-text>
      </wui-flex>
    `}};b([(0,a.MZ)({type:Number})],v.prototype,"amount",void 0),b([(0,a.MZ)({type:Number})],v.prototype,"maxDecimals",void 0),b([(0,a.MZ)({type:Number})],v.prototype,"maxIntegers",void 0),v=b([(0,h.EM)("w3m-fund-input")],v);let $=(0,h.AH)`
  .amount-input-container {
    border-radius: ${({borderRadius:t})=>t["6"]};
    border-top-right-radius: 0;
    border-top-left-radius: 0;
    background-color: ${({tokens:t})=>t.theme.foregroundPrimary};
    padding: ${({spacing:t})=>t[1]};
  }

  .container {
    border-radius: 30px;
  }
`;var k=function(t,e,i,n){var a,o=arguments.length,s=o<3?e:null===n?n=Object.getOwnPropertyDescriptor(e,i):n;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)s=Reflect.decorate(t,e,i,n);else for(var r=t.length-1;r>=0;r--)(a=t[r])&&(s=(o<3?a(s):o>3?a(e,i,s):a(e,i))||s);return o>3&&s&&Object.defineProperty(e,i,s),s};let I=[10,50,100],P=class extends n.WF{constructor(){super(),this.unsubscribe=[],this.network=s.W.state.activeCaipNetwork,this.exchanges=r.g.state.exchanges,this.isLoading=r.g.state.isLoading,this.amount=r.g.state.amount,this.tokenAmount=r.g.state.tokenAmount,this.priceLoading=r.g.state.priceLoading,this.isPaymentInProgress=r.g.state.isPaymentInProgress,this.currentPayment=r.g.state.currentPayment,this.paymentId=r.g.state.paymentId,this.paymentAsset=r.g.state.paymentAsset,this.unsubscribe.push(s.W.subscribeKey("activeCaipNetwork",t=>{this.network=t,this.setDefaultPaymentAsset()}),r.g.subscribe(t=>{this.exchanges=t.exchanges,this.isLoading=t.isLoading,this.amount=t.amount,this.tokenAmount=t.tokenAmount,this.priceLoading=t.priceLoading,this.paymentId=t.paymentId,this.isPaymentInProgress=t.isPaymentInProgress,this.currentPayment=t.currentPayment,this.paymentAsset=t.paymentAsset,t.isPaymentInProgress&&t.currentPayment?.exchangeId&&t.currentPayment?.sessionId&&t.paymentId&&this.handlePaymentInProgress()}))}disconnectedCallback(){this.unsubscribe.forEach(t=>t()),r.g.state.isPaymentInProgress||r.g.reset()}async firstUpdated(){await this.getPaymentAssets(),this.paymentAsset||await this.setDefaultPaymentAsset(),r.g.setAmount(I[0]),await r.g.fetchExchanges()}render(){return(0,n.qy)`
      <wui-flex flexDirection="column" class="container">
        ${this.amountInputTemplate()} ${this.exchangesTemplate()}
      </wui-flex>
    `}exchangesLoadingTemplate(){return Array.from({length:2}).map(()=>(0,n.qy)`<wui-shimmer width="100%" height="65px" borderRadius="xxs"></wui-shimmer>`)}_exchangesTemplate(){return this.exchanges.length>0?this.exchanges.map(t=>(0,n.qy)`<wui-list-item
              @click=${()=>this.onExchangeClick(t)}
              chevron
              variant="image"
              imageSrc=${t.imageUrl}
              ?loading=${this.isLoading}
            >
              <wui-text variant="md-regular" color="primary">
                Deposit from ${t.name}
              </wui-text>
            </wui-list-item>`):(0,n.qy)`<wui-flex flexDirection="column" alignItems="center" gap="4" padding="4">
          <wui-text variant="lg-medium" align="center" color="primary">
            No exchanges support this asset on this network
          </wui-text>
        </wui-flex>`}exchangesTemplate(){return(0,n.qy)`<wui-flex
      flexDirection="column"
      gap="2"
      .padding=${["3","3","3","3"]}
      class="exchanges-container"
    >
      ${this.isLoading?this.exchangesLoadingTemplate():this._exchangesTemplate()}
    </wui-flex>`}amountInputTemplate(){return(0,n.qy)`
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
            @click=${()=>u.I.push("PayWithExchangeSelectAsset")}
            size="lg"
            .chainImageSrc=${(0,o.J)(c.$.getNetworkImage(this.network))}
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
          ${I.map(t=>(0,n.qy)`<wui-chip-button
                @click=${()=>r.g.setAmount(t)}
                type="neutral"
                size="lg"
                text=${`$${t}`}
              ></wui-chip-button>`)}
        </wui-flex>
      </wui-flex>
    `}tokenAmountTemplate(){return this.priceLoading?(0,n.qy)`<wui-shimmer
        width="65px"
        height="20px"
        borderRadius="xxs"
        variant="light"
      ></wui-shimmer>`:(0,n.qy)`
      <wui-text variant="md-regular" color="secondary">
        ${this.tokenAmount.toFixed(4)} ${this.paymentAsset?.metadata.symbol}
      </wui-text>
    `}async onExchangeClick(t){this.amount?await r.g.handlePayWithExchange(t.id):l.P.showError("Please enter an amount")}handlePaymentInProgress(){let t=s.W.state.activeChain,{redirectView:e="Account"}=u.I.state.data??{};this.isPaymentInProgress&&this.currentPayment?.exchangeId&&this.currentPayment?.sessionId&&this.paymentId&&(r.g.waitUntilComplete({exchangeId:this.currentPayment.exchangeId,sessionId:this.currentPayment.sessionId,paymentId:this.paymentId}).then(e=>{"SUCCESS"===e.status?(l.P.showSuccess("Deposit completed"),r.g.reset(),t&&(s.W.fetchTokenBalance(),d.x.updateBalance(t)),u.I.replace("Transactions")):"FAILED"===e.status&&l.P.showError("Deposit failed")}),l.P.showLoading("Deposit in progress..."),u.I.replace(e))}onAmountChange({detail:t}){r.g.setAmount(t?Number(t):null)}async getPaymentAssets(){this.network&&await r.g.getAssetsForNetwork(this.network.caipNetworkId)}async setDefaultPaymentAsset(){if(this.network){let t=await r.g.getAssetsForNetwork(this.network.caipNetworkId);t[0]&&r.g.setPaymentAsset(t[0])}}};P.styles=$,k([(0,a.wk)()],P.prototype,"network",void 0),k([(0,a.wk)()],P.prototype,"exchanges",void 0),k([(0,a.wk)()],P.prototype,"isLoading",void 0),k([(0,a.wk)()],P.prototype,"amount",void 0),k([(0,a.wk)()],P.prototype,"tokenAmount",void 0),k([(0,a.wk)()],P.prototype,"priceLoading",void 0),k([(0,a.wk)()],P.prototype,"isPaymentInProgress",void 0),k([(0,a.wk)()],P.prototype,"currentPayment",void 0),k([(0,a.wk)()],P.prototype,"paymentId",void 0),k([(0,a.wk)()],P.prototype,"paymentAsset",void 0),P=k([(0,h.EM)("w3m-deposit-from-exchange-view")],P);var A=i(21159);i(80729),i(8285),i(39220),i(53658),i(38885);let D=(0,h.AH)`
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
    border-radius: ${({borderRadius:t})=>t["3"]};
  }
`;var C=function(t,e,i,n){var a,o=arguments.length,s=o<3?e:null===n?n=Object.getOwnPropertyDescriptor(e,i):n;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)s=Reflect.decorate(t,e,i,n);else for(var r=t.length-1;r>=0;r--)(a=t[r])&&(s=(o<3?a(s):o>3?a(e,i,s):a(e,i))||s);return o>3&&s&&Object.defineProperty(e,i,s),s};let z=class extends n.WF{constructor(){super(),this.unsubscribe=[],this.assets=r.g.state.assets,this.search="",this.onDebouncedSearch=A.w.debounce(t=>{this.search=t}),this.unsubscribe.push(r.g.subscribe(t=>{this.assets=t.assets}))}disconnectedCallback(){this.unsubscribe.forEach(t=>t())}render(){return(0,n.qy)`
      <wui-flex flexDirection="column">
        ${this.templateSearchInput()} <wui-separator></wui-separator> ${this.templateTokens()}
      </wui-flex>
    `}templateSearchInput(){return(0,n.qy)`
      <wui-flex gap="2" padding="3">
        <wui-input-text
          @inputChange=${this.onInputChange.bind(this)}
          class="network-search-input"
          size="sm"
          placeholder="Search token"
          icon="search"
        ></wui-input-text>
      </wui-flex>
    `}templateTokens(){let t=this.assets.filter(t=>t.metadata.name.toLowerCase().includes(this.search.toLowerCase())),e=t.length>0;return(0,n.qy)`
      <wui-flex
        class="contentContainer"
        flexDirection="column"
        .padding=${["0","3","0","3"]}
      >
        <wui-flex justifyContent="flex-start" .padding=${["4","3","3","3"]}>
          <wui-text variant="md-medium" color="secondary">Available tokens</wui-text>
        </wui-flex>
        <wui-flex flexDirection="column" gap="2">
          ${e?t.map(t=>(0,n.qy)`<wui-list-item
                    .imageSrc=${t.metadata.iconUrl}
                    ?clickable=${!0}
                    @click=${this.handleTokenClick.bind(this,t)}
                  >
                    <wui-text variant="md-medium" color="primary">${t.metadata.name}</wui-text>
                    <wui-text variant="md-regular" color="secondary"
                      >${t.metadata.symbol}</wui-text
                    >
                  </wui-list-item>`):(0,n.qy)`<wui-flex
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
    `}onBuyClick(){u.I.push("OnRampProviders")}onInputChange(t){this.onDebouncedSearch(t.detail)}handleTokenClick(t){r.g.setPaymentAsset(t),u.I.goBack()}};z.styles=D,C([(0,a.wk)()],z.prototype,"assets",void 0),C([(0,a.wk)()],z.prototype,"search",void 0),z=C([(0,h.EM)("w3m-deposit-from-exchange-select-asset-view")],z)},81398:(t,e,i)=>{var n=i(1850),a=i(58446),o=i(40438),s=i(41608),r=i(54684),u=i(86833),c=i(51127);let l=(0,s.AH)`
  :host {
    position: relative;
    display: inline-block;
  }

  :host([data-error='true']) > input {
    color: ${({tokens:t})=>t.core.textError};
  }

  :host([data-error='false']) > input {
    color: ${({tokens:t})=>t.theme.textPrimary};
  }

  input {
    background: transparent;
    height: auto;
    box-sizing: border-box;
    color: ${({tokens:t})=>t.theme.textPrimary};
    font-feature-settings: 'case' on;
    font-size: ${({textSize:t})=>t.h4};
    caret-color: ${({tokens:t})=>t.core.backgroundAccentPrimary};
    line-height: ${({typography:t})=>t["h4-regular-mono"].lineHeight};
    letter-spacing: ${({typography:t})=>t["h4-regular-mono"].letterSpacing};
    -webkit-appearance: none;
    -moz-appearance: textfield;
    padding: 0px;
    font-family: ${({fontFamily:t})=>t.mono};
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
    font-family: ${({fontFamily:t})=>t.mono};
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
    color: ${({tokens:t})=>t.theme.textSecondary};
  }
`;var d=function(t,e,i,n){var a,o=arguments.length,s=o<3?e:null===n?n=Object.getOwnPropertyDescriptor(e,i):n;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)s=Reflect.decorate(t,e,i,n);else for(var r=t.length-1;r>=0;r--)(a=t[r])&&(s=(o<3?a(s):o>3?a(e,i,s):a(e,i))||s);return o>3&&s&&Object.defineProperty(e,i,s),s};let h=class extends n.WF{constructor(){super(...arguments),this.inputElementRef=(0,o._)(),this.disabled=!1,this.value="",this.placeholder="0",this.widthVariant="auto",this.maxDecimals=void 0,this.maxIntegers=void 0,this.fontSize="h4",this.error=!1}firstUpdated(){this.resizeInput()}updated(){this.style.setProperty("--local-font-size",s.f.textSize[this.fontSize]),this.resizeInput()}render(){return(this.dataset.widthVariant=this.widthVariant,this.dataset.error=String(this.error),this.inputElementRef?.value&&this.value&&(this.inputElementRef.value.value=this.value),"auto"===this.widthVariant)?this.inputTemplate():(0,n.qy)`
      <div class="wui-input-amount-fit-width">
        <span class="wui-input-amount-fit-mirror"></span>
        ${this.inputTemplate()}
      </div>
    `}inputTemplate(){return(0,n.qy)`<input
      ${(0,o.K)(this.inputElementRef)}
      type="text"
      inputmode="decimal"
      pattern="[0-9,.]*"
      placeholder=${this.placeholder}
      ?disabled=${this.disabled}
      autofocus
      value=${this.value??""}
      @input=${this.dispatchInputChangeEvent.bind(this)}
    />`}dispatchInputChangeEvent(){this.inputElementRef.value&&(this.inputElementRef.value.value=u.Z.maskInput({value:this.inputElementRef.value.value,decimals:this.maxDecimals,integers:this.maxIntegers}),this.dispatchEvent(new CustomEvent("inputChange",{detail:this.inputElementRef.value.value,bubbles:!0,composed:!0})),this.resizeInput())}resizeInput(){if("fit"===this.widthVariant){let t=this.inputElementRef.value;if(t){let e=t.previousElementSibling;e&&(e.textContent=t.value||"0",t.style.width=`${e.offsetWidth}px`)}}}};h.styles=[r.W5,r.fD,l],d([(0,a.MZ)({type:Boolean})],h.prototype,"disabled",void 0),d([(0,a.MZ)({type:String})],h.prototype,"value",void 0),d([(0,a.MZ)({type:String})],h.prototype,"placeholder",void 0),d([(0,a.MZ)({type:String})],h.prototype,"widthVariant",void 0),d([(0,a.MZ)({type:Number})],h.prototype,"maxDecimals",void 0),d([(0,a.MZ)({type:Number})],h.prototype,"maxIntegers",void 0),d([(0,a.MZ)({type:String})],h.prototype,"fontSize",void 0),d([(0,a.MZ)({type:Boolean})],h.prototype,"error",void 0),h=d([(0,c.E)("wui-input-amount")],h)}}]);