"use strict";(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[3057],{43057:(e,t,o)=>{o.r(t),o.d(t,{W3mSwapPreviewView:()=>G,W3mSwapSelectTokenView:()=>M,W3mSwapView:()=>A});var i=o(1850),n=o(58446),r=o(99400),a=o(933),s=o(51105),l=o(86847),c=o(21159),u=o(24417),d=o(24101),p=o(81805),h=o(44458);o(34556),o(85479),o(80729),o(8285),o(60347);var w=o(36421),g=o(22797);o(79367),o(77416);let m=(0,h.AH)`
  :host {
    width: 100%;
  }

  .details-container > wui-flex {
    background: ${({tokens:e})=>e.theme.foregroundPrimary};
    border-radius: ${({borderRadius:e})=>e["3"]};
    width: 100%;
  }

  .details-container > wui-flex > button {
    border: none;
    background: none;
    padding: ${({spacing:e})=>e["3"]};
    border-radius: ${({borderRadius:e})=>e["3"]};
    cursor: pointer;
  }

  .details-content-container {
    padding: ${({spacing:e})=>e["2"]};
    padding-top: 0px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .details-content-container > wui-flex {
    width: 100%;
  }

  .details-row {
    width: 100%;
    padding: ${({spacing:e})=>e["3"]};
    padding-left: ${({spacing:e})=>e["3"]};
    padding-right: ${({spacing:e})=>e["2"]};
    border-radius: calc(
      ${({borderRadius:e})=>e["1"]} + ${({borderRadius:e})=>e["1"]}
    );
    background: ${({tokens:e})=>e.theme.foregroundPrimary};
  }

  .details-row-title {
    white-space: nowrap;
  }

  .details-row.provider-free-row {
    padding-right: ${({spacing:e})=>e["2"]};
  }
`;var k=function(e,t,o,i){var n,r=arguments.length,a=r<3?t:null===i?i=Object.getOwnPropertyDescriptor(t,o):i;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(e,t,o,i);else for(var s=e.length-1;s>=0;s--)(n=e[s])&&(a=(r<3?n(a):r>3?n(t,o,a):n(t,o))||a);return r>3&&a&&Object.defineProperty(t,o,a),a};let b=g.oU.CONVERT_SLIPPAGE_TOLERANCE,f=class extends i.WF{constructor(){super(),this.unsubscribe=[],this.networkName=a.W.state.activeCaipNetwork?.name,this.detailsOpen=!1,this.sourceToken=l.GN.state.sourceToken,this.toToken=l.GN.state.toToken,this.toTokenAmount=l.GN.state.toTokenAmount,this.sourceTokenPriceInUSD=l.GN.state.sourceTokenPriceInUSD,this.toTokenPriceInUSD=l.GN.state.toTokenPriceInUSD,this.priceImpact=l.GN.state.priceImpact,this.maxSlippage=l.GN.state.maxSlippage,this.networkTokenSymbol=l.GN.state.networkTokenSymbol,this.inputError=l.GN.state.inputError,this.unsubscribe.push(l.GN.subscribe(e=>{this.sourceToken=e.sourceToken,this.toToken=e.toToken,this.toTokenAmount=e.toTokenAmount,this.priceImpact=e.priceImpact,this.maxSlippage=e.maxSlippage,this.sourceTokenPriceInUSD=e.sourceTokenPriceInUSD,this.toTokenPriceInUSD=e.toTokenPriceInUSD,this.inputError=e.inputError}))}render(){let e=this.toTokenAmount&&this.maxSlippage?r.S.bigNumber(this.toTokenAmount).minus(this.maxSlippage).toString():null;if(!this.sourceToken||!this.toToken||this.inputError)return null;let t=this.sourceTokenPriceInUSD&&this.toTokenPriceInUSD?1/this.toTokenPriceInUSD*this.sourceTokenPriceInUSD:0;return(0,i.qy)`
      <wui-flex flexDirection="column" alignItems="center" gap="01" class="details-container">
        <wui-flex flexDirection="column">
          <button @click=${this.toggleDetails.bind(this)}>
            <wui-flex justifyContent="space-between" .padding=${["0","2","0","2"]}>
              <wui-flex justifyContent="flex-start" flexGrow="1" gap="2">
                <wui-text variant="sm-regular" color="primary">
                  1 ${this.sourceToken.symbol} =
                  ${r.S.formatNumberToLocalString(t,3)}
                  ${this.toToken.symbol}
                </wui-text>
                <wui-text variant="sm-regular" color="secondary">
                  $${r.S.formatNumberToLocalString(this.sourceTokenPriceInUSD)}
                </wui-text>
              </wui-flex>
              <wui-icon name="chevronBottom"></wui-icon>
            </wui-flex>
          </button>
          ${this.detailsOpen?(0,i.qy)`
                <wui-flex flexDirection="column" gap="2" class="details-content-container">
                  ${this.priceImpact?(0,i.qy)` <wui-flex flexDirection="column" gap="2">
                        <wui-flex
                          justifyContent="space-between"
                          alignItems="center"
                          class="details-row"
                        >
                          <wui-flex alignItems="center" gap="2">
                            <wui-text
                              class="details-row-title"
                              variant="sm-regular"
                              color="secondary"
                            >
                              Price impact
                            </wui-text>
                            <w3m-tooltip-trigger
                              text="Price impact reflects the change in market price due to your trade"
                            >
                              <wui-icon size="sm" color="default" name="info"></wui-icon>
                            </w3m-tooltip-trigger>
                          </wui-flex>
                          <wui-flex>
                            <wui-text variant="sm-regular" color="secondary">
                              ${r.S.formatNumberToLocalString(this.priceImpact,3)}%
                            </wui-text>
                          </wui-flex>
                        </wui-flex>
                      </wui-flex>`:null}
                  ${this.maxSlippage&&this.sourceToken.symbol?(0,i.qy)`<wui-flex flexDirection="column" gap="2">
                        <wui-flex
                          justifyContent="space-between"
                          alignItems="center"
                          class="details-row"
                        >
                          <wui-flex alignItems="center" gap="2">
                            <wui-text
                              class="details-row-title"
                              variant="sm-regular"
                              color="secondary"
                            >
                              Max. slippage
                            </wui-text>
                            <w3m-tooltip-trigger
                              text=${`Max slippage sets the minimum amount you must receive for the transaction to proceed. ${e?`Transaction will be reversed if you receive less than ${r.S.formatNumberToLocalString(e,6)} ${this.toToken.symbol} due to price changes.`:""}`}
                            >
                              <wui-icon size="sm" color="default" name="info"></wui-icon>
                            </w3m-tooltip-trigger>
                          </wui-flex>
                          <wui-flex>
                            <wui-text variant="sm-regular" color="secondary">
                              ${r.S.formatNumberToLocalString(this.maxSlippage,6)}
                              ${this.toToken.symbol} ${b}%
                            </wui-text>
                          </wui-flex>
                        </wui-flex>
                      </wui-flex>`:null}
                  <wui-flex flexDirection="column" gap="2">
                    <wui-flex
                      justifyContent="space-between"
                      alignItems="center"
                      class="details-row provider-free-row"
                    >
                      <wui-flex alignItems="center" gap="2">
                        <wui-text class="details-row-title" variant="sm-regular" color="secondary">
                          Provider fee
                        </wui-text>
                      </wui-flex>
                      <wui-flex>
                        <wui-text variant="sm-regular" color="secondary">0.85%</wui-text>
                      </wui-flex>
                    </wui-flex>
                  </wui-flex>
                </wui-flex>
              `:null}
        </wui-flex>
      </wui-flex>
    `}toggleDetails(){this.detailsOpen=!this.detailsOpen}};f.styles=[m],k([(0,n.wk)()],f.prototype,"networkName",void 0),k([(0,n.MZ)()],f.prototype,"detailsOpen",void 0),k([(0,n.wk)()],f.prototype,"sourceToken",void 0),k([(0,n.wk)()],f.prototype,"toToken",void 0),k([(0,n.wk)()],f.prototype,"toTokenAmount",void 0),k([(0,n.wk)()],f.prototype,"sourceTokenPriceInUSD",void 0),k([(0,n.wk)()],f.prototype,"toTokenPriceInUSD",void 0),k([(0,n.wk)()],f.prototype,"priceImpact",void 0),k([(0,n.wk)()],f.prototype,"maxSlippage",void 0),k([(0,n.wk)()],f.prototype,"networkTokenSymbol",void 0),k([(0,n.wk)()],f.prototype,"inputError",void 0),f=k([(0,h.EM)("w3m-swap-details")],f),o(41835);let x=(0,h.AH)`
  :host {
    width: 100%;
  }

  :host > wui-flex {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    border-radius: ${({borderRadius:e})=>e["5"]};
    padding: ${({spacing:e})=>e["5"]};
    padding-right: ${({spacing:e})=>e["3"]};
    background-color: ${({tokens:e})=>e.theme.foregroundPrimary};
    box-shadow: inset 0px 0px 0px 1px ${({tokens:e})=>e.theme.foregroundPrimary};
    width: 100%;
    height: 100px;
    box-sizing: border-box;
    position: relative;
  }

  wui-shimmer.market-value {
    opacity: 0;
  }

  :host > wui-flex > svg.input_mask {
    position: absolute;
    inset: 0;
    z-index: 5;
  }

  :host wui-flex .input_mask__border,
  :host wui-flex .input_mask__background {
    transition: fill ${({durations:e})=>e.md}
      ${({easings:e})=>e["ease-out-power-1"]};
    will-change: fill;
  }

  :host wui-flex .input_mask__border {
    fill: ${({tokens:e})=>e.core.glass010};
  }

  :host wui-flex .input_mask__background {
    fill: ${({tokens:e})=>e.theme.foregroundPrimary};
  }
`;var y=function(e,t,o,i){var n,r=arguments.length,a=r<3?t:null===i?i=Object.getOwnPropertyDescriptor(t,o):i;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(e,t,o,i);else for(var s=e.length-1;s>=0;s--)(n=e[s])&&(a=(r<3?n(a):r>3?n(t,o,a):n(t,o))||a);return r>3&&a&&Object.defineProperty(t,o,a),a};let T=class extends i.WF{constructor(){super(...arguments),this.target="sourceToken"}render(){return(0,i.qy)`
      <wui-flex class justifyContent="space-between">
        <wui-flex
          flex="1"
          flexDirection="column"
          alignItems="flex-start"
          justifyContent="center"
          class="swap-input"
          gap="1"
        >
          <wui-shimmer width="80px" height="40px" rounded variant="light"></wui-shimmer>
        </wui-flex>
        ${this.templateTokenSelectButton()}
      </wui-flex>
    `}templateTokenSelectButton(){return(0,i.qy)`
      <wui-flex
        class="swap-token-button"
        flexDirection="column"
        alignItems="flex-end"
        justifyContent="center"
        gap="1"
      >
        <wui-shimmer width="80px" height="40px" rounded variant="light"></wui-shimmer>
      </wui-flex>
    `}};T.styles=[x],y([(0,n.MZ)()],T.prototype,"target",void 0),T=y([(0,h.EM)("w3m-swap-input-skeleton")],T);let v={numericInputKeyDown(e,t,o){let i=e.metaKey||e.ctrlKey,n=e.key,r=n.toLocaleLowerCase(),a=","===n,s="."===n,l=n>="0"&&n<="9";i||"a"!==r&&"c"!==r&&"v"!==r&&"x"!==r||e.preventDefault(),"0"!==t||a||s||"0"!==n||e.preventDefault(),"0"===t&&l&&(o(n),e.preventDefault()),(a||s)&&(t||(o("0."),e.preventDefault()),(t?.includes(".")||t?.includes(","))&&e.preventDefault()),l||["Backspace","Meta","Ctrl","a","A","c","C","x","X","v","V","ArrowLeft","ArrowRight","Tab"].includes(n)||s||a||e.preventDefault()}};o(50136);let $=(0,h.AH)`
  :host > wui-flex {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    border-radius: ${({borderRadius:e})=>e["5"]};
    background-color: ${({tokens:e})=>e.theme.foregroundPrimary};
    padding: ${({spacing:e})=>e["5"]};
    padding-right: ${({spacing:e})=>e["3"]};
    width: 100%;
    height: 100px;
    box-sizing: border-box;
    box-shadow: inset 0px 0px 0px 1px ${({tokens:e})=>e.theme.foregroundPrimary};
    position: relative;
    transition: box-shadow ${({easings:e})=>e["ease-out-power-1"]}
      ${({durations:e})=>e.lg};
    will-change: background-color;
  }

  :host wui-flex.focus {
    box-shadow: inset 0px 0px 0px 1px ${({tokens:e})=>e.core.glass010};
  }

  :host > wui-flex .swap-input,
  :host > wui-flex .swap-token-button {
    z-index: 10;
  }

  :host > wui-flex .swap-input {
    -webkit-mask-image: linear-gradient(
      270deg,
      transparent 0px,
      transparent 8px,
      black 24px,
      black 25px,
      black 32px,
      black 100%
    );
    mask-image: linear-gradient(
      270deg,
      transparent 0px,
      transparent 8px,
      black 24px,
      black 25px,
      black 32px,
      black 100%
    );
  }

  :host > wui-flex .swap-input input {
    background: none;
    border: none;
    height: 42px;
    width: 100%;
    font-size: 32px;
    font-style: normal;
    font-weight: 400;
    line-height: 130%;
    letter-spacing: -1.28px;
    outline: none;
    caret-color: ${({tokens:e})=>e.core.textAccentPrimary};
    color: ${({tokens:e})=>e.theme.textPrimary};
    padding: 0px;
  }

  :host > wui-flex .swap-input input:focus-visible {
    outline: none;
  }

  :host > wui-flex .swap-input input::-webkit-outer-spin-button,
  :host > wui-flex .swap-input input::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }

  .max-value-button {
    background-color: transparent;
    border: none;
    cursor: pointer;
    color: ${({tokens:e})=>e.core.glass010};
    padding-left: 0px;
  }

  .market-value {
    min-height: 18px;
  }
`;var S=function(e,t,o,i){var n,r=arguments.length,a=r<3?t:null===i?i=Object.getOwnPropertyDescriptor(t,o):i;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(e,t,o,i);else for(var s=e.length-1;s>=0;s--)(n=e[s])&&(a=(r<3?n(a):r>3?n(t,o,a):n(t,o))||a);return r>3&&a&&Object.defineProperty(t,o,a),a};let N=class extends i.WF{constructor(){super(...arguments),this.focused=!1,this.price=0,this.target="sourceToken",this.onSetAmount=null,this.onSetMaxValue=null,this.autoFocus=!1}firstUpdated(){this.autoFocus&&requestAnimationFrame(()=>{let e=this.shadowRoot?.querySelector("input");e?.focus()})}render(){let e=this.marketValue||"0",t=r.S.bigNumber(e).gt("0");return(0,i.qy)`
      <wui-flex
        class="${this.focused?"focus":""}"
        justifyContent="space-between"
        alignItems="center"
      >
        <wui-flex
          flex="1"
          flexDirection="column"
          alignItems="flex-start"
          justifyContent="center"
          class="swap-input"
        >
          <input
            data-testid="swap-input-${this.target}"
            @focusin=${()=>this.onFocusChange(!0)}
            @focusout=${()=>this.onFocusChange(!1)}
            ?disabled=${this.disabled}
            value=${this.value||""}
            @input=${this.dispatchInputChangeEvent}
            @keydown=${this.handleKeydown}
            placeholder="0"
            type="text"
            inputmode="decimal"
            pattern="[0-9,.]*"
          />
          <wui-text class="market-value" variant="sm-regular" color="secondary">
            ${t?`$${r.S.formatNumberToLocalString(this.marketValue,2)}`:null}
          </wui-text>
        </wui-flex>
        ${this.templateTokenSelectButton()}
      </wui-flex>
    `}handleKeydown(e){return v.numericInputKeyDown(e,this.value,e=>this.onSetAmount?.(this.target,e))}dispatchInputChangeEvent(e){if(!this.onSetAmount)return;let t=e.target.value.replace(/[^0-9.]/gu,"");","===t||"."===t?this.onSetAmount(this.target,"0."):t.endsWith(",")?this.onSetAmount(this.target,t.replace(",",".")):this.onSetAmount(this.target,t)}setMaxValueToInput(){this.onSetMaxValue?.(this.target,this.balance)}templateTokenSelectButton(){return this.token?(0,i.qy)`
      <wui-flex
        class="swap-token-button"
        flexDirection="column"
        alignItems="flex-end"
        justifyContent="center"
        gap="1"
      >
        <wui-token-button
          data-testid="swap-input-token-${this.target}"
          text=${this.token.symbol}
          imageSrc=${this.token.logoUri}
          @click=${this.onSelectToken.bind(this)}
        >
        </wui-token-button>
        <wui-flex alignItems="center" gap="1"> ${this.tokenBalanceTemplate()} </wui-flex>
      </wui-flex>
    `:(0,i.qy)` <wui-button
        data-testid="swap-select-token-button-${this.target}"
        class="swap-token-button"
        size="md"
        variant="neutral-secondary"
        @click=${this.onSelectToken.bind(this)}
      >
        Select token
      </wui-button>`}tokenBalanceTemplate(){let e=r.S.multiply(this.balance,this.price),t=!!e&&e?.gt(5e-5);return(0,i.qy)`
      ${t?(0,i.qy)`<wui-text variant="sm-regular" color="secondary">
            ${r.S.formatNumberToLocalString(this.balance,2)}
          </wui-text>`:null}
      ${"sourceToken"===this.target?this.tokenActionButtonTemplate(t):null}
    `}tokenActionButtonTemplate(e){return e?(0,i.qy)` <button class="max-value-button" @click=${this.setMaxValueToInput.bind(this)}>
        <wui-text color="accent-primary" variant="sm-medium">Max</wui-text>
      </button>`:(0,i.qy)` <button class="max-value-button" @click=${this.onBuyToken.bind(this)}>
      <wui-text color="accent-primary" variant="sm-medium">Buy</wui-text>
    </button>`}onFocusChange(e){this.focused=e}onSelectToken(){d.E.sendEvent({type:"track",event:"CLICK_SELECT_TOKEN_TO_SWAP"}),s.I.push("SwapSelectToken",{target:this.target})}onBuyToken(){s.I.push("OnRampProviders")}};N.styles=[$],S([(0,n.MZ)()],N.prototype,"focused",void 0),S([(0,n.MZ)()],N.prototype,"balance",void 0),S([(0,n.MZ)()],N.prototype,"value",void 0),S([(0,n.MZ)()],N.prototype,"price",void 0),S([(0,n.MZ)()],N.prototype,"marketValue",void 0),S([(0,n.MZ)()],N.prototype,"disabled",void 0),S([(0,n.MZ)()],N.prototype,"target",void 0),S([(0,n.MZ)()],N.prototype,"token",void 0),S([(0,n.MZ)()],N.prototype,"onSetAmount",void 0),S([(0,n.MZ)()],N.prototype,"onSetMaxValue",void 0),S([(0,n.MZ)({type:Boolean})],N.prototype,"autoFocus",void 0),N=S([(0,h.EM)("w3m-swap-input")],N);let P=(0,h.AH)`
  :host > wui-flex:first-child {
    overflow-y: auto;
    overflow-x: hidden;
    scrollbar-width: none;
  }

  :host > wui-flex:first-child::-webkit-scrollbar {
    display: none;
  }

  wui-loading-hexagon {
    position: absolute;
  }

  .action-button {
    width: 100%;
    border-radius: ${({borderRadius:e})=>e["4"]};
  }

  .action-button:disabled {
    border-color: 1px solid ${({tokens:e})=>e.core.glass010};
  }

  .swap-inputs-container {
    position: relative;
  }

  wui-icon-box {
    width: 32px;
    height: 32px;
    border-radius: ${({borderRadius:e})=>e["10"]} !important;
    border: 4px solid ${({tokens:e})=>e.theme.backgroundPrimary};
    background: ${({tokens:e})=>e.theme.foregroundPrimary};
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 3;
  }

  .replace-tokens-button-container {
    display: flex;
    justify-content: center;
    align-items: center;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    gap: ${({spacing:e})=>e["2"]};
    border-radius: ${({borderRadius:e})=>e["4"]};
    background-color: ${({tokens:e})=>e.theme.backgroundPrimary};
    padding: ${({spacing:e})=>e["2"]};
  }

  .details-container > wui-flex {
    background: ${({tokens:e})=>e.theme.foregroundPrimary};
    border-radius: ${({borderRadius:e})=>e["3"]};
    width: 100%;
  }

  .details-container > wui-flex > button {
    border: none;
    background: none;
    padding: ${({spacing:e})=>e["3"]};
    border-radius: ${({borderRadius:e})=>e["3"]};
    transition: background ${({durations:e})=>e.lg}
      ${({easings:e})=>e["ease-out-power-2"]};
    will-change: background;
  }

  .details-container > wui-flex > button:hover {
    background: ${({tokens:e})=>e.theme.foregroundPrimary};
  }

  .details-content-container {
    padding: ${({spacing:e})=>e["2"]};
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .details-content-container > wui-flex {
    width: 100%;
  }

  .details-row {
    width: 100%;
    padding: ${({spacing:e})=>e["3"]} ${({spacing:e})=>e["5"]};
    border-radius: ${({borderRadius:e})=>e["3"]};
    background: ${({tokens:e})=>e.theme.foregroundPrimary};
  }
`;var I=function(e,t,o,i){var n,r=arguments.length,a=r<3?t:null===i?i=Object.getOwnPropertyDescriptor(t,o):i;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(e,t,o,i);else for(var s=e.length-1;s>=0;s--)(n=e[s])&&(a=(r<3?n(a):r>3?n(t,o,a):n(t,o))||a);return r>3&&a&&Object.defineProperty(t,o,a),a};let A=class extends i.WF{subscribe({resetSwapState:e,initializeSwapState:t}){return()=>{a.W.subscribeKey("activeCaipNetwork",o=>this.onCaipNetworkChange({newCaipNetwork:o,resetSwapState:e,initializeSwapState:t})),a.W.subscribeChainProp("accountState",o=>{this.onCaipAddressChange({newCaipAddress:o?.caipAddress,resetSwapState:e,initializeSwapState:t})})}}constructor(){super(),this.unsubscribe=[],this.initialParams=s.I.state.data?.swap,this.detailsOpen=!1,this.caipAddress=a.W.getAccountData()?.caipAddress,this.caipNetworkId=a.W.state.activeCaipNetwork?.caipNetworkId,this.initialized=l.GN.state.initialized,this.loadingQuote=l.GN.state.loadingQuote,this.loadingPrices=l.GN.state.loadingPrices,this.loadingTransaction=l.GN.state.loadingTransaction,this.sourceToken=l.GN.state.sourceToken,this.sourceTokenAmount=l.GN.state.sourceTokenAmount,this.sourceTokenPriceInUSD=l.GN.state.sourceTokenPriceInUSD,this.toToken=l.GN.state.toToken,this.toTokenAmount=l.GN.state.toTokenAmount,this.toTokenPriceInUSD=l.GN.state.toTokenPriceInUSD,this.inputError=l.GN.state.inputError,this.fetchError=l.GN.state.fetchError,this.lastTokenPriceUpdate=0,this.minTokenPriceUpdateInterval=1e4,this.visibilityChangeHandler=()=>{document?.hidden?(clearInterval(this.interval),this.interval=void 0):this.startTokenPriceInterval()},this.startTokenPriceInterval=()=>{this.interval&&Date.now()-this.lastTokenPriceUpdate<this.minTokenPriceUpdateInterval||(this.lastTokenPriceUpdate&&Date.now()-this.lastTokenPriceUpdate>this.minTokenPriceUpdateInterval&&this.fetchTokensAndValues(),clearInterval(this.interval),this.interval=setInterval(()=>{this.fetchTokensAndValues()},this.minTokenPriceUpdateInterval))},this.watchTokensAndValues=()=>{this.sourceToken&&this.toToken&&(this.subscribeToVisibilityChange(),this.startTokenPriceInterval())},this.onDebouncedGetSwapCalldata=c.w.debounce(async()=>{await l.GN.swapTokens()},200),this.subscribe({resetSwapState:!0,initializeSwapState:!1})(),this.unsubscribe.push(this.subscribe({resetSwapState:!1,initializeSwapState:!0}),u.W.subscribeKey("open",e=>{e||l.GN.resetState()}),s.I.subscribeKey("view",e=>{e.includes("Swap")||l.GN.resetValues()}),l.GN.subscribe(e=>{this.initialized=e.initialized,this.loadingQuote=e.loadingQuote,this.loadingPrices=e.loadingPrices,this.loadingTransaction=e.loadingTransaction,this.sourceToken=e.sourceToken,this.sourceTokenAmount=e.sourceTokenAmount,this.sourceTokenPriceInUSD=e.sourceTokenPriceInUSD,this.toToken=e.toToken,this.toTokenAmount=e.toTokenAmount,this.toTokenPriceInUSD=e.toTokenPriceInUSD,this.inputError=e.inputError,this.fetchError=e.fetchError,e.sourceToken&&e.toToken&&this.watchTokensAndValues()}))}async firstUpdated(){l.GN.initializeState(),this.watchTokensAndValues(),await this.handleSwapParameters()}disconnectedCallback(){this.unsubscribe.forEach(e=>e?.()),clearInterval(this.interval),document?.removeEventListener("visibilitychange",this.visibilityChangeHandler)}render(){return(0,i.qy)`
      <wui-flex flexDirection="column" .padding=${["0","4","4","4"]} gap="3">
        ${this.initialized?this.templateSwap():this.templateLoading()}
      </wui-flex>
    `}subscribeToVisibilityChange(){document?.removeEventListener("visibilitychange",this.visibilityChangeHandler),document?.addEventListener("visibilitychange",this.visibilityChangeHandler)}fetchTokensAndValues(){l.GN.getNetworkTokenPrice(),l.GN.getMyTokensWithBalance(),l.GN.swapTokens(),this.lastTokenPriceUpdate=Date.now()}templateSwap(){return(0,i.qy)`
      <wui-flex flexDirection="column" gap="3">
        <wui-flex flexDirection="column" alignItems="center" gap="2" class="swap-inputs-container">
          ${this.templateTokenInput("sourceToken",this.sourceToken)}
          ${this.templateTokenInput("toToken",this.toToken)} ${this.templateReplaceTokensButton()}
        </wui-flex>
        ${this.templateDetails()} ${this.templateActionButton()}
      </wui-flex>
    `}actionButtonLabel(){let e=!this.sourceTokenAmount||"0"===this.sourceTokenAmount;return this.fetchError?"Swap":this.sourceToken&&this.toToken?e?"Enter amount":this.inputError?this.inputError:"Review swap":"Select token"}templateReplaceTokensButton(){return(0,i.qy)`
      <wui-flex class="replace-tokens-button-container">
        <wui-icon-box
          @click=${this.onSwitchTokens.bind(this)}
          icon="recycleHorizontal"
          size="md"
          variant="default"
        ></wui-icon-box>
      </wui-flex>
    `}templateLoading(){return(0,i.qy)`
      <wui-flex flexDirection="column" gap="4">
        <wui-flex flexDirection="column" alignItems="center" gap="2" class="swap-inputs-container">
          <w3m-swap-input-skeleton target="sourceToken"></w3m-swap-input-skeleton>
          <w3m-swap-input-skeleton target="toToken"></w3m-swap-input-skeleton>
          ${this.templateReplaceTokensButton()}
        </wui-flex>
        ${this.templateActionButton()}
      </wui-flex>
    `}templateTokenInput(e,t){let o=l.GN.state.myTokensWithBalance?.find(e=>e?.address===t?.address),n="toToken"===e?this.toTokenAmount:this.sourceTokenAmount,a="toToken"===e?this.toTokenPriceInUSD:this.sourceTokenPriceInUSD,s=r.S.parseLocalStringToNumber(n)*a;return(0,i.qy)`<w3m-swap-input
      .value=${"toToken"===e?this.toTokenAmount:this.sourceTokenAmount}
      .disabled=${"toToken"===e}
      .onSetAmount=${this.handleChangeAmount.bind(this)}
      target=${e}
      .token=${t}
      .balance=${o?.quantity?.numeric}
      .price=${o?.price}
      .marketValue=${s}
      .onSetMaxValue=${this.onSetMaxValue.bind(this)}
      ?autoFocus=${"sourceToken"===e}
    ></w3m-swap-input>`}onSetMaxValue(e,t){let o=r.S.bigNumber(t||"0");if(!o.gt(0))return void this.handleChangeAmount(e,"0");let i="sourceToken"===e?this.sourceToken:this.toToken,n=i?.decimals??18,{networkAddress:a}=l.GN.getParams(),s=l.GN.state.gasFee;if("sourceToken"===e&&i?.address===a&&s&&"0"!==s){let t=150000n*BigInt(s),i=r.S.bigNumber(t.toString()).div(r.S.bigNumber(10).pow(n)),a=o.minus(i);this.handleChangeAmount(e,a.gt(0)?a.toFixed(n,0):"0")}else this.handleChangeAmount(e,o.toFixed(n,0))}templateDetails(){return this.sourceToken&&this.toToken&&!this.inputError?(0,i.qy)`<w3m-swap-details .detailsOpen=${this.detailsOpen}></w3m-swap-details>`:null}handleChangeAmount(e,t){l.GN.clearError(),"sourceToken"===e?l.GN.setSourceTokenAmount(t):l.GN.setToTokenAmount(t),this.onDebouncedGetSwapCalldata()}templateActionButton(){let e=!this.toToken||!this.sourceToken,t=!this.sourceTokenAmount||"0"===this.sourceTokenAmount,o=this.loadingQuote||this.loadingPrices||this.loadingTransaction,n=o||e||t||this.inputError;return(0,i.qy)` <wui-flex gap="2">
      <wui-button
        data-testid="swap-action-button"
        class="action-button"
        fullWidth
        size="lg"
        borderRadius="xs"
        variant="accent-primary"
        ?loading=${!!o}
        ?disabled=${!!n}
        @click=${this.onSwapPreview.bind(this)}
      >
        ${this.actionButtonLabel()}
      </wui-button>
    </wui-flex>`}async onSwitchTokens(){await l.GN.switchTokens()}async onSwapPreview(){this.fetchError&&await l.GN.swapTokens(),d.E.sendEvent({type:"track",event:"INITIATE_SWAP",properties:{network:this.caipNetworkId||"",swapFromToken:this.sourceToken?.symbol||"",swapToToken:this.toToken?.symbol||"",swapFromAmount:this.sourceTokenAmount||"",swapToAmount:this.toTokenAmount||"",isSmartAccount:(0,p.lj)(a.W.state.activeChain)===w.Vl.ACCOUNT_TYPES.SMART_ACCOUNT}}),s.I.push("SwapPreview")}async handleSwapParameters(){if(this.initialParams){if(!l.GN.state.initialized){let e=new Promise(e=>{let t=l.GN.subscribeKey("initialized",o=>{o&&(t?.(),e())})});await e}await this.setSwapParameters(this.initialParams)}}async setSwapParameters({amount:e,fromToken:t,toToken:o}){if(!l.GN.state.tokens||!l.GN.state.myTokensWithBalance){let e=new Promise(e=>{let t=l.GN.subscribeKey("myTokensWithBalance",o=>{o&&o.length>0&&(t?.(),e())});setTimeout(()=>{t?.(),e()},5e3)});await e}let i=[...l.GN.state.tokens||[],...l.GN.state.myTokensWithBalance||[]];if(t){let e=i.find(e=>e.symbol.toLowerCase()===t.toLowerCase());e&&l.GN.setSourceToken(e)}if(o){let e=i.find(e=>e.symbol.toLowerCase()===o.toLowerCase());e&&l.GN.setToToken(e)}e&&!isNaN(Number(e))&&l.GN.setSourceTokenAmount(e)}onCaipAddressChange({newCaipAddress:e,resetSwapState:t,initializeSwapState:o}){this.caipAddress!==e&&(this.caipAddress=e,t&&l.GN.resetState(),o&&l.GN.initializeState())}onCaipNetworkChange({newCaipNetwork:e,resetSwapState:t,initializeSwapState:o}){this.caipNetworkId!==e?.caipNetworkId&&(this.caipNetworkId=e?.caipNetworkId,t&&l.GN.resetState(),o&&l.GN.initializeState())}};A.styles=P,I([(0,n.MZ)({type:Object})],A.prototype,"initialParams",void 0),I([(0,n.wk)()],A.prototype,"interval",void 0),I([(0,n.wk)()],A.prototype,"detailsOpen",void 0),I([(0,n.wk)()],A.prototype,"caipAddress",void 0),I([(0,n.wk)()],A.prototype,"caipNetworkId",void 0),I([(0,n.wk)()],A.prototype,"initialized",void 0),I([(0,n.wk)()],A.prototype,"loadingQuote",void 0),I([(0,n.wk)()],A.prototype,"loadingPrices",void 0),I([(0,n.wk)()],A.prototype,"loadingTransaction",void 0),I([(0,n.wk)()],A.prototype,"sourceToken",void 0),I([(0,n.wk)()],A.prototype,"sourceTokenAmount",void 0),I([(0,n.wk)()],A.prototype,"sourceTokenPriceInUSD",void 0),I([(0,n.wk)()],A.prototype,"toToken",void 0),I([(0,n.wk)()],A.prototype,"toTokenAmount",void 0),I([(0,n.wk)()],A.prototype,"toTokenPriceInUSD",void 0),I([(0,n.wk)()],A.prototype,"inputError",void 0),I([(0,n.wk)()],A.prototype,"fetchError",void 0),I([(0,n.wk)()],A.prototype,"lastTokenPriceUpdate",void 0),A=I([(0,h.EM)("w3m-swap-view")],A);let D=(0,h.AH)`
  :host > wui-flex:first-child {
    overflow-y: auto;
    overflow-x: hidden;
    scrollbar-width: none;
  }

  :host > wui-flex:first-child::-webkit-scrollbar {
    display: none;
  }

  .preview-container,
  .details-container {
    width: 100%;
  }

  .token-image {
    width: 24px;
    height: 24px;
    box-shadow: 0 0 0 2px ${({tokens:e})=>e.core.glass010};
    border-radius: 12px;
  }

  wui-loading-hexagon {
    position: absolute;
  }

  .token-item {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: ${({spacing:e})=>e["2"]};
    padding: ${({spacing:e})=>e["2"]};
    height: 40px;
    border: none;
    border-radius: 80px;
    background: ${({tokens:e})=>e.theme.foregroundPrimary};
    box-shadow: inset 0 0 0 1px ${({tokens:e})=>e.theme.foregroundPrimary};
    cursor: pointer;
    transition: background ${({durations:e})=>e.lg}
      ${({easings:e})=>e["ease-out-power-2"]};
    will-change: background;
  }

  .token-item:hover {
    background: ${({tokens:e})=>e.core.glass010};
  }

  .preview-token-details-container {
    width: 100%;
  }

  .details-row {
    width: 100%;
    padding: ${({spacing:e})=>e["3"]} ${({spacing:e})=>e["5"]};
    border-radius: ${({borderRadius:e})=>e["3"]};
    background: ${({tokens:e})=>e.theme.foregroundPrimary};
  }

  .action-buttons-container {
    width: 100%;
    gap: ${({spacing:e})=>e["2"]};
  }

  .action-buttons-container > button {
    display: flex;
    align-items: center;
    justify-content: center;
    background: transparent;
    height: 48px;
    border-radius: ${({borderRadius:e})=>e["4"]};
    border: none;
    box-shadow: inset 0 0 0 1px ${({tokens:e})=>e.core.glass010};
  }

  .action-buttons-container > button:disabled {
    opacity: 0.8;
    cursor: not-allowed;
  }

  .action-button > wui-loading-spinner {
    display: inline-block;
  }

  .cancel-button:hover,
  .action-button:hover {
    cursor: pointer;
  }

  .action-buttons-container > wui-button.cancel-button {
    flex: 2;
  }

  .action-buttons-container > wui-button.action-button {
    flex: 4;
  }

  .action-buttons-container > button.action-button > wui-text {
    color: white;
  }

  .details-container > wui-flex {
    background: ${({tokens:e})=>e.theme.foregroundPrimary};
    border-radius: ${({borderRadius:e})=>e["3"]};
    width: 100%;
  }

  .details-container > wui-flex > button {
    border: none;
    background: none;
    padding: ${({spacing:e})=>e["3"]};
    border-radius: ${({borderRadius:e})=>e["3"]};
    transition: background ${({durations:e})=>e.lg}
      ${({easings:e})=>e["ease-out-power-2"]};
    will-change: background;
  }

  .details-container > wui-flex > button:hover {
    background: ${({tokens:e})=>e.theme.foregroundPrimary};
  }

  .details-content-container {
    padding: ${({spacing:e})=>e["2"]};
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .details-content-container > wui-flex {
    width: 100%;
  }

  .details-row {
    width: 100%;
    padding: ${({spacing:e})=>e["3"]} ${({spacing:e})=>e["5"]};
    border-radius: ${({borderRadius:e})=>e["3"]};
    background: ${({tokens:e})=>e.theme.foregroundPrimary};
  }
`;var C=function(e,t,o,i){var n,r=arguments.length,a=r<3?t:null===i?i=Object.getOwnPropertyDescriptor(t,o):i;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(e,t,o,i);else for(var s=e.length-1;s>=0;s--)(n=e[s])&&(a=(r<3?n(a):r>3?n(t,o,a):n(t,o))||a);return r>3&&a&&Object.defineProperty(t,o,a),a};let G=class extends i.WF{constructor(){super(),this.unsubscribe=[],this.detailsOpen=!0,this.approvalTransaction=l.GN.state.approvalTransaction,this.swapTransaction=l.GN.state.swapTransaction,this.sourceToken=l.GN.state.sourceToken,this.sourceTokenAmount=l.GN.state.sourceTokenAmount??"",this.sourceTokenPriceInUSD=l.GN.state.sourceTokenPriceInUSD,this.balanceSymbol=a.W.getAccountData()?.balanceSymbol,this.toToken=l.GN.state.toToken,this.toTokenAmount=l.GN.state.toTokenAmount??"",this.toTokenPriceInUSD=l.GN.state.toTokenPriceInUSD,this.caipNetwork=a.W.state.activeCaipNetwork,this.inputError=l.GN.state.inputError,this.loadingQuote=l.GN.state.loadingQuote,this.loadingApprovalTransaction=l.GN.state.loadingApprovalTransaction,this.loadingBuildTransaction=l.GN.state.loadingBuildTransaction,this.loadingTransaction=l.GN.state.loadingTransaction,this.unsubscribe.push(a.W.subscribeChainProp("accountState",e=>{e?.balanceSymbol!==this.balanceSymbol&&s.I.goBack()}),a.W.subscribeKey("activeCaipNetwork",e=>{this.caipNetwork!==e&&(this.caipNetwork=e)}),l.GN.subscribe(e=>{this.approvalTransaction=e.approvalTransaction,this.swapTransaction=e.swapTransaction,this.sourceToken=e.sourceToken,this.toToken=e.toToken,this.toTokenPriceInUSD=e.toTokenPriceInUSD,this.sourceTokenAmount=e.sourceTokenAmount??"",this.toTokenAmount=e.toTokenAmount??"",this.inputError=e.inputError,e.inputError&&s.I.goBack(),this.loadingQuote=e.loadingQuote,this.loadingApprovalTransaction=e.loadingApprovalTransaction,this.loadingBuildTransaction=e.loadingBuildTransaction,this.loadingTransaction=e.loadingTransaction}))}firstUpdated(){l.GN.getTransaction(),this.refreshTransaction()}disconnectedCallback(){this.unsubscribe.forEach(e=>e?.()),clearInterval(this.interval)}render(){return(0,i.qy)`
      <wui-flex flexDirection="column" .padding=${["0","4","4","4"]} gap="3">
        ${this.templateSwap()}
      </wui-flex>
    `}refreshTransaction(){this.interval=setInterval(()=>{l.GN.getApprovalLoadingState()||l.GN.getTransaction()},1e4)}templateSwap(){let e=`${r.S.formatNumberToLocalString(parseFloat(this.sourceTokenAmount))} ${this.sourceToken?.symbol}`,t=`${r.S.formatNumberToLocalString(parseFloat(this.toTokenAmount))} ${this.toToken?.symbol}`,o=parseFloat(this.sourceTokenAmount)*this.sourceTokenPriceInUSD,n=parseFloat(this.toTokenAmount)*this.toTokenPriceInUSD,a=r.S.formatNumberToLocalString(o),s=r.S.formatNumberToLocalString(n),l=this.loadingQuote||this.loadingBuildTransaction||this.loadingTransaction||this.loadingApprovalTransaction;return(0,i.qy)`
      <wui-flex flexDirection="column" alignItems="center" gap="4">
        <wui-flex class="preview-container" flexDirection="column" alignItems="flex-start" gap="4">
          <wui-flex
            class="preview-token-details-container"
            alignItems="center"
            justifyContent="space-between"
            gap="4"
          >
            <wui-flex flexDirection="column" alignItems="flex-start" gap="01">
              <wui-text variant="sm-regular" color="secondary">Send</wui-text>
              <wui-text variant="md-regular" color="primary">$${a}</wui-text>
            </wui-flex>
            <wui-token-button
              flexDirection="row-reverse"
              text=${e}
              imageSrc=${this.sourceToken?.logoUri}
            >
            </wui-token-button>
          </wui-flex>
          <wui-icon name="recycleHorizontal" color="default" size="md"></wui-icon>
          <wui-flex
            class="preview-token-details-container"
            alignItems="center"
            justifyContent="space-between"
            gap="4"
          >
            <wui-flex flexDirection="column" alignItems="flex-start" gap="01">
              <wui-text variant="sm-regular" color="secondary">Receive</wui-text>
              <wui-text variant="md-regular" color="primary">$${s}</wui-text>
            </wui-flex>
            <wui-token-button
              flexDirection="row-reverse"
              text=${t}
              imageSrc=${this.toToken?.logoUri}
            >
            </wui-token-button>
          </wui-flex>
        </wui-flex>

        ${this.templateDetails()}

        <wui-flex flexDirection="row" alignItems="center" justifyContent="center" gap="2">
          <wui-icon size="sm" color="default" name="info"></wui-icon>
          <wui-text variant="sm-regular" color="secondary">Review transaction carefully</wui-text>
        </wui-flex>

        <wui-flex
          class="action-buttons-container"
          flexDirection="row"
          alignItems="center"
          justifyContent="space-between"
          gap="2"
        >
          <wui-button
            class="cancel-button"
            fullWidth
            size="lg"
            borderRadius="xs"
            variant="neutral-secondary"
            @click=${this.onCancelTransaction.bind(this)}
          >
            <wui-text variant="md-medium" color="secondary">Cancel</wui-text>
          </wui-button>
          <wui-button
            class="action-button"
            fullWidth
            size="lg"
            borderRadius="xs"
            variant="accent-primary"
            ?loading=${l}
            ?disabled=${l}
            @click=${this.onSendTransaction.bind(this)}
          >
            <wui-text variant="md-medium" color="invert"> ${this.actionButtonLabel()} </wui-text>
          </wui-button>
        </wui-flex>
      </wui-flex>
    `}templateDetails(){return this.sourceToken&&this.toToken&&!this.inputError?(0,i.qy)`<w3m-swap-details .detailsOpen=${this.detailsOpen}></w3m-swap-details>`:null}actionButtonLabel(){return this.loadingApprovalTransaction?"Approving...":this.approvalTransaction?"Approve":"Swap"}onCancelTransaction(){s.I.goBack()}onSendTransaction(){this.approvalTransaction?l.GN.sendTransactionForApproval(this.approvalTransaction):l.GN.sendTransactionForSwap(this.swapTransaction)}};G.styles=D,C([(0,n.wk)()],G.prototype,"interval",void 0),C([(0,n.wk)()],G.prototype,"detailsOpen",void 0),C([(0,n.wk)()],G.prototype,"approvalTransaction",void 0),C([(0,n.wk)()],G.prototype,"swapTransaction",void 0),C([(0,n.wk)()],G.prototype,"sourceToken",void 0),C([(0,n.wk)()],G.prototype,"sourceTokenAmount",void 0),C([(0,n.wk)()],G.prototype,"sourceTokenPriceInUSD",void 0),C([(0,n.wk)()],G.prototype,"balanceSymbol",void 0),C([(0,n.wk)()],G.prototype,"toToken",void 0),C([(0,n.wk)()],G.prototype,"toTokenAmount",void 0),C([(0,n.wk)()],G.prototype,"toTokenPriceInUSD",void 0),C([(0,n.wk)()],G.prototype,"caipNetwork",void 0),C([(0,n.wk)()],G.prototype,"inputError",void 0),C([(0,n.wk)()],G.prototype,"loadingQuote",void 0),C([(0,n.wk)()],G.prototype,"loadingApprovalTransaction",void 0),C([(0,n.wk)()],G.prototype,"loadingBuildTransaction",void 0),C([(0,n.wk)()],G.prototype,"loadingTransaction",void 0),G=C([(0,h.EM)("w3m-swap-preview-view")],G),o(39220),o(56349),o(53059),o(18341);var E=o(54684),j=o(51127),L=o(41608);let U=(0,L.AH)`
  :host {
    width: 100%;
    height: 60px;
    min-height: 60px;
  }

  :host > wui-flex {
    cursor: pointer;
    height: 100%;
    display: flex;
    column-gap: ${({spacing:e})=>e["3"]};
    padding: ${({spacing:e})=>e["2"]};
    padding-right: ${({spacing:e})=>e["4"]};
    width: 100%;
    background-color: transparent;
    border-radius: ${({borderRadius:e})=>e["4"]};
    color: ${({tokens:e})=>e.theme.foregroundSecondary};
    transition:
      background-color ${({durations:e})=>e.lg}
        ${({easings:e})=>e["ease-out-power-2"]},
      opacity ${({durations:e})=>e.lg} ${({easings:e})=>e["ease-out-power-2"]};
    will-change: background-color, opacity;
  }

  @media (hover: hover) and (pointer: fine) {
    :host > wui-flex:hover {
      background-color: ${({tokens:e})=>e.theme.foregroundPrimary};
    }

    :host > wui-flex:active {
      background-color: ${({tokens:e})=>e.core.glass010};
    }
  }

  :host([disabled]) > wui-flex {
    opacity: 0.6;
  }

  :host([disabled]) > wui-flex:hover {
    background-color: transparent;
  }

  :host > wui-flex > wui-flex {
    flex: 1;
  }

  :host > wui-flex > wui-image,
  :host > wui-flex > .token-item-image-placeholder {
    width: 40px;
    max-width: 40px;
    height: 40px;
    border-radius: ${({borderRadius:e})=>e["20"]};
    position: relative;
  }

  :host > wui-flex > .token-item-image-placeholder {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  :host > wui-flex > wui-image::after,
  :host > wui-flex > .token-item-image-placeholder::after {
    position: absolute;
    content: '';
    inset: 0;
    box-shadow: inset 0 0 0 1px ${({tokens:e})=>e.core.glass010};
    border-radius: ${({borderRadius:e})=>e["8"]};
  }

  button > wui-icon-box[data-variant='square-blue'] {
    border-radius: ${({borderRadius:e})=>e["2"]};
    position: relative;
    border: none;
    width: 36px;
    height: 36px;
  }
`;var q=function(e,t,o,i){var n,r=arguments.length,a=r<3?t:null===i?i=Object.getOwnPropertyDescriptor(t,o):i;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(e,t,o,i);else for(var s=e.length-1;s>=0;s--)(n=e[s])&&(a=(r<3?n(a):r>3?n(t,o,a):n(t,o))||a);return r>3&&a&&Object.defineProperty(t,o,a),a};let z=class extends i.WF{constructor(){super(),this.observer=new IntersectionObserver(()=>void 0),this.imageSrc=void 0,this.name=void 0,this.symbol=void 0,this.price=void 0,this.amount=void 0,this.visible=!1,this.imageError=!1,this.observer=new IntersectionObserver(e=>{e.forEach(e=>{e.isIntersecting?this.visible=!0:this.visible=!1})},{threshold:.1})}firstUpdated(){this.observer.observe(this)}disconnectedCallback(){this.observer.disconnect()}render(){if(!this.visible)return null;let e=this.amount&&this.price?r.S.multiply(this.price,this.amount)?.toFixed(3):null;return(0,i.qy)`
      <wui-flex alignItems="center">
        ${this.visualTemplate()}
        <wui-flex flexDirection="column" gap="1">
          <wui-flex justifyContent="space-between">
            <wui-text variant="md-medium" color="primary" lineClamp="1">${this.name}</wui-text>
            ${e?(0,i.qy)`
                  <wui-text variant="md-medium" color="primary">
                    $${r.S.formatNumberToLocalString(e,3)}
                  </wui-text>
                `:null}
          </wui-flex>
          <wui-flex justifyContent="space-between">
            <wui-text variant="sm-regular" color="secondary" lineClamp="1">${this.symbol}</wui-text>
            ${this.amount?(0,i.qy)`<wui-text variant="sm-regular" color="secondary">
                  ${r.S.formatNumberToLocalString(this.amount,5)}
                </wui-text>`:null}
          </wui-flex>
        </wui-flex>
      </wui-flex>
    `}visualTemplate(){return this.imageError?(0,i.qy)`<wui-flex class="token-item-image-placeholder">
        <wui-icon name="image" color="inherit"></wui-icon>
      </wui-flex>`:this.imageSrc?(0,i.qy)`<wui-image
        width="40"
        height="40"
        src=${this.imageSrc}
        @onLoadError=${this.imageLoadError}
      ></wui-image>`:null}imageLoadError(){this.imageError=!0}};z.styles=[E.W5,E.fD,U],q([(0,n.MZ)()],z.prototype,"imageSrc",void 0),q([(0,n.MZ)()],z.prototype,"name",void 0),q([(0,n.MZ)()],z.prototype,"symbol",void 0),q([(0,n.MZ)()],z.prototype,"price",void 0),q([(0,n.MZ)()],z.prototype,"amount",void 0),q([(0,n.wk)()],z.prototype,"visible",void 0),q([(0,n.wk)()],z.prototype,"imageError",void 0),z=q([(0,j.E)("wui-token-list-item")],z),o(39251);let O=(0,L.AH)`
  :host {
    width: 100%;
  }

  :host > wui-flex {
    cursor: pointer;
    height: 100%;
    width: 100%;
    display: flex;
    column-gap: ${({spacing:e})=>e["3"]};
    padding: ${({spacing:e})=>e["2"]};
    padding-right: ${({spacing:e})=>e["4"]};
  }

  wui-flex {
    display: flex;
    flex: 1;
  }
`,R=class extends i.WF{render(){return(0,i.qy)`
      <wui-flex alignItems="center">
        <wui-shimmer width="40px" height="40px"></wui-shimmer>
        <wui-flex flexDirection="column" gap="1">
          <wui-shimmer width="72px" height="16px" borderRadius="4xs"></wui-shimmer>
          <wui-shimmer width="148px" height="14px" borderRadius="4xs"></wui-shimmer>
        </wui-flex>
        <wui-flex flexDirection="column" gap="1" alignItems="flex-end">
          <wui-shimmer width="24px" height="12px" borderRadius="4xs"></wui-shimmer>
          <wui-shimmer width="32px" height="12px" borderRadius="4xs"></wui-shimmer>
        </wui-flex>
      </wui-flex>
    `}};R.styles=[E.W5,O],R=function(e,t,o,i){var n,r=arguments.length,a=r<3?t:null===i?i=Object.getOwnPropertyDescriptor(t,o):i;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(e,t,o,i);else for(var s=e.length-1;s>=0;s--)(n=e[s])&&(a=(r<3?n(a):r>3?n(t,o,a):n(t,o))||a);return r>3&&a&&Object.defineProperty(t,o,a),a}([(0,j.E)("wui-token-list-item-loader")],R);let B=(0,h.AH)`
  :host {
    --tokens-scroll--top-opacity: 0;
    --tokens-scroll--bottom-opacity: 1;
    --suggested-tokens-scroll--left-opacity: 0;
    --suggested-tokens-scroll--right-opacity: 1;
  }

  :host > wui-flex:first-child {
    overflow-y: hidden;
    overflow-x: hidden;
    scrollbar-width: none;
    scrollbar-height: none;
  }

  :host > wui-flex:first-child::-webkit-scrollbar {
    display: none;
  }

  wui-loading-hexagon {
    position: absolute;
  }

  .suggested-tokens-container {
    overflow-x: auto;
    mask-image: linear-gradient(
      to right,
      rgba(0, 0, 0, calc(1 - var(--suggested-tokens-scroll--left-opacity))) 0px,
      rgba(200, 200, 200, calc(1 - var(--suggested-tokens-scroll--left-opacity))) 1px,
      black 50px,
      black 90px,
      black calc(100% - 90px),
      black calc(100% - 50px),
      rgba(155, 155, 155, calc(1 - var(--suggested-tokens-scroll--right-opacity))) calc(100% - 1px),
      rgba(0, 0, 0, calc(1 - var(--suggested-tokens-scroll--right-opacity))) 100%
    );
  }

  .suggested-tokens-container::-webkit-scrollbar {
    display: none;
  }

  .tokens-container {
    border-top: 1px solid ${({tokens:e})=>e.core.glass010};
    height: 100%;
    max-height: 390px;
  }

  .tokens {
    width: 100%;
    overflow-y: auto;
    mask-image: linear-gradient(
      to bottom,
      rgba(0, 0, 0, calc(1 - var(--tokens-scroll--top-opacity))) 0px,
      rgba(200, 200, 200, calc(1 - var(--tokens-scroll--top-opacity))) 1px,
      black 50px,
      black 90px,
      black calc(100% - 90px),
      black calc(100% - 50px),
      rgba(155, 155, 155, calc(1 - var(--tokens-scroll--bottom-opacity))) calc(100% - 1px),
      rgba(0, 0, 0, calc(1 - var(--tokens-scroll--bottom-opacity))) 100%
    );
  }

  .network-search-input,
  .select-network-button {
    height: 40px;
  }

  .select-network-button {
    border: none;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    gap: ${({spacing:e})=>e["2"]};
    box-shadow: inset 0 0 0 1px ${({tokens:e})=>e.core.glass010};
    background-color: transparent;
    border-radius: ${({borderRadius:e})=>e["3"]};
    padding: ${({spacing:e})=>e["2"]};
    align-items: center;
    transition: background-color ${({durations:e})=>e.lg}
      ${({easings:e})=>e["ease-out-power-2"]};
    will-change: background-color;
  }

  .select-network-button:hover {
    background-color: ${({tokens:e})=>e.theme.foregroundPrimary};
  }

  .select-network-button > wui-image {
    width: 26px;
    height: 26px;
    border-radius: ${({borderRadius:e})=>e["4"]};
    box-shadow: inset 0 0 0 1px ${({tokens:e})=>e.core.glass010};
  }
`;var W=function(e,t,o,i){var n,r=arguments.length,a=r<3?t:null===i?i=Object.getOwnPropertyDescriptor(t,o):i;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(e,t,o,i);else for(var s=e.length-1;s>=0;s--)(n=e[s])&&(a=(r<3?n(a):r>3?n(t,o,a):n(t,o))||a);return r>3&&a&&Object.defineProperty(t,o,a),a};let M=class extends i.WF{constructor(){super(),this.unsubscribe=[],this.targetToken=s.I.state.data?.target,this.sourceToken=l.GN.state.sourceToken,this.sourceTokenAmount=l.GN.state.sourceTokenAmount,this.toToken=l.GN.state.toToken,this.myTokensWithBalance=l.GN.state.myTokensWithBalance,this.popularTokens=l.GN.state.popularTokens,this.suggestedTokens=l.GN.state.suggestedTokens,this.tokensLoading=l.GN.state.tokensLoading,this.searchValue="",this.unsubscribe.push(l.GN.subscribe(e=>{this.sourceToken=e.sourceToken,this.toToken=e.toToken,this.myTokensWithBalance=e.myTokensWithBalance,this.popularTokens=e.popularTokens,this.suggestedTokens=e.suggestedTokens,this.tokensLoading=e.tokensLoading}))}async firstUpdated(){await l.GN.getTokenList()}updated(){let e=this.renderRoot?.querySelector(".suggested-tokens-container");e?.addEventListener("scroll",this.handleSuggestedTokensScroll.bind(this));let t=this.renderRoot?.querySelector(".tokens");t?.addEventListener("scroll",this.handleTokenListScroll.bind(this))}disconnectedCallback(){super.disconnectedCallback();let e=this.renderRoot?.querySelector(".suggested-tokens-container"),t=this.renderRoot?.querySelector(".tokens");e?.removeEventListener("scroll",this.handleSuggestedTokensScroll.bind(this)),t?.removeEventListener("scroll",this.handleTokenListScroll.bind(this)),clearInterval(this.interval)}render(){return(0,i.qy)`
      <wui-flex flexDirection="column" gap="3">
        ${this.templateSearchInput()} ${this.templateSuggestedTokens()} ${this.templateTokens()}
      </wui-flex>
    `}onSelectToken(e){"sourceToken"===this.targetToken?l.GN.setSourceToken(e):(l.GN.setToToken(e),this.sourceToken&&this.sourceTokenAmount&&l.GN.swapTokens()),s.I.goBack()}templateSearchInput(){return(0,i.qy)`
      <wui-flex .padding=${["1","3","0","3"]} gap="2">
        <wui-input-text
          data-testid="swap-select-token-search-input"
          class="network-search-input"
          size="sm"
          placeholder="Search token"
          icon="search"
          .value=${this.searchValue}
          @inputChange=${this.onSearchInputChange.bind(this)}
        ></wui-input-text>
      </wui-flex>
    `}templateMyTokens(){let e=this.myTokensWithBalance?Object.values(this.myTokensWithBalance):[],t=this.filterTokensWithText(e,this.searchValue);return t?.length>0?(0,i.qy)`<wui-flex justifyContent="flex-start" padding="2">
          <wui-text variant="md-medium" color="secondary">Your tokens</wui-text>
        </wui-flex>
        ${t.map(e=>{let t=e.symbol===this.sourceToken?.symbol||e.symbol===this.toToken?.symbol;return(0,i.qy)`
            <wui-token-list-item
              data-testid="swap-select-token-item-${e.symbol}"
              name=${e.name}
              ?disabled=${t}
              symbol=${e.symbol}
              price=${e?.price}
              amount=${e?.quantity?.numeric}
              imageSrc=${e.logoUri}
              @click=${()=>{t||this.onSelectToken(e)}}
            >
            </wui-token-list-item>
          `})}`:null}templateAllTokens(){let e=this.popularTokens?this.popularTokens:[],t=this.filterTokensWithText(e,this.searchValue);return this.tokensLoading?(0,i.qy)`
        <wui-token-list-item-loader></wui-token-list-item-loader>
        <wui-token-list-item-loader></wui-token-list-item-loader>
        <wui-token-list-item-loader></wui-token-list-item-loader>
        <wui-token-list-item-loader></wui-token-list-item-loader>
        <wui-token-list-item-loader></wui-token-list-item-loader>
      `:t?.length>0?(0,i.qy)`
        ${t.map(e=>(0,i.qy)`
            <wui-token-list-item
              data-testid="swap-select-token-item-${e.symbol}"
              name=${e.name}
              symbol=${e.symbol}
              imageSrc=${e.logoUri}
              @click=${()=>this.onSelectToken(e)}
            >
            </wui-token-list-item>
          `)}
      `:null}templateTokens(){return(0,i.qy)`
      <wui-flex class="tokens-container">
        <wui-flex class="tokens" .padding=${["0","2","2","2"]} flexDirection="column">
          ${this.templateMyTokens()}
          <wui-flex justifyContent="flex-start" padding="3">
            <wui-text variant="md-medium" color="secondary">Tokens</wui-text>
          </wui-flex>
          ${this.templateAllTokens()}
        </wui-flex>
      </wui-flex>
    `}templateSuggestedTokens(){let e=this.suggestedTokens?this.suggestedTokens.slice(0,8):null;return this.tokensLoading?(0,i.qy)`
        <wui-flex
          class="suggested-tokens-container"
          .padding=${["0","3","0","3"]}
          gap="2"
        >
          <wui-token-button loading></wui-token-button>
          <wui-token-button loading></wui-token-button>
          <wui-token-button loading></wui-token-button>
          <wui-token-button loading></wui-token-button>
          <wui-token-button loading></wui-token-button>
        </wui-flex>
      `:e?(0,i.qy)`
      <wui-flex
        class="suggested-tokens-container"
        .padding=${["0","3","0","3"]}
        gap="2"
      >
        ${e.map(e=>(0,i.qy)`
            <wui-token-button
              text=${e.symbol}
              imageSrc=${e.logoUri}
              @click=${()=>this.onSelectToken(e)}
            >
            </wui-token-button>
          `)}
      </wui-flex>
    `:null}onSearchInputChange(e){this.searchValue=e.detail}handleSuggestedTokensScroll(){let e=this.renderRoot?.querySelector(".suggested-tokens-container");e&&(e.style.setProperty("--suggested-tokens-scroll--left-opacity",h.z8.interpolate([0,100],[0,1],e.scrollLeft).toString()),e.style.setProperty("--suggested-tokens-scroll--right-opacity",h.z8.interpolate([0,100],[0,1],e.scrollWidth-e.scrollLeft-e.offsetWidth).toString()))}handleTokenListScroll(){let e=this.renderRoot?.querySelector(".tokens");e&&(e.style.setProperty("--tokens-scroll--top-opacity",h.z8.interpolate([0,100],[0,1],e.scrollTop).toString()),e.style.setProperty("--tokens-scroll--bottom-opacity",h.z8.interpolate([0,100],[0,1],e.scrollHeight-e.scrollTop-e.offsetHeight).toString()))}filterTokensWithText(e,t){return e.filter(e=>`${e.symbol} ${e.name} ${e.address}`.toLowerCase().includes(t.toLowerCase())).sort((e,o)=>{let i=`${e.symbol} ${e.name} ${e.address}`.toLowerCase(),n=`${o.symbol} ${o.name} ${o.address}`.toLowerCase();return i.indexOf(t.toLowerCase())-n.indexOf(t.toLowerCase())})}};M.styles=B,W([(0,n.wk)()],M.prototype,"interval",void 0),W([(0,n.wk)()],M.prototype,"targetToken",void 0),W([(0,n.wk)()],M.prototype,"sourceToken",void 0),W([(0,n.wk)()],M.prototype,"sourceTokenAmount",void 0),W([(0,n.wk)()],M.prototype,"toToken",void 0),W([(0,n.wk)()],M.prototype,"myTokensWithBalance",void 0),W([(0,n.wk)()],M.prototype,"popularTokens",void 0),W([(0,n.wk)()],M.prototype,"suggestedTokens",void 0),W([(0,n.wk)()],M.prototype,"tokensLoading",void 0),W([(0,n.wk)()],M.prototype,"searchValue",void 0),M=W([(0,h.EM)("w3m-swap-select-token-view")],M)},50136:(e,t,o)=>{var i=o(1850),n=o(58446);o(13496),o(56349),o(39251),o(53059),o(18341);var r=o(54684),a=o(51127),s=o(41608);let l=(0,s.AH)`
  button {
    display: block;
    display: flex;
    align-items: center;
    padding: ${({spacing:e})=>e[1]};
    transition: background-color ${({durations:e})=>e.lg}
      ${({easings:e})=>e["ease-out-power-2"]};
    will-change: background-color;
    background-color: ${({tokens:e})=>e.theme.foregroundPrimary};
    border-radius: ${({borderRadius:e})=>e[32]};
  }

  wui-image {
    border-radius: ${({borderRadius:e})=>e[32]};
  }

  wui-text {
    padding-left: ${({spacing:e})=>e[1]};
    padding-right: ${({spacing:e})=>e[1]};
  }

  .left-icon-container {
    width: 24px;
    height: 24px;
    justify-content: center;
    align-items: center;
  }

  .left-image-container {
    position: relative;
    justify-content: center;
    align-items: center;
  }

  .chain-image {
    position: absolute;
    border: 1px solid ${({tokens:e})=>e.theme.foregroundPrimary};
  }

  /* -- Sizes --------------------------------------------------- */
  button[data-size='lg'] {
    height: 32px;
  }

  button[data-size='md'] {
    height: 28px;
  }

  button[data-size='sm'] {
    height: 24px;
  }

  button[data-size='lg'] .token-image {
    width: 24px;
    height: 24px;
  }

  button[data-size='md'] .token-image {
    width: 20px;
    height: 20px;
  }

  button[data-size='sm'] .token-image {
    width: 16px;
    height: 16px;
  }

  button[data-size='lg'] .left-icon-container {
    width: 24px;
    height: 24px;
  }

  button[data-size='md'] .left-icon-container {
    width: 20px;
    height: 20px;
  }

  button[data-size='sm'] .left-icon-container {
    width: 16px;
    height: 16px;
  }

  button[data-size='lg'] .chain-image {
    width: 12px;
    height: 12px;
    bottom: 2px;
    right: -4px;
  }

  button[data-size='md'] .chain-image {
    width: 10px;
    height: 10px;
    bottom: 2px;
    right: -4px;
  }

  button[data-size='sm'] .chain-image {
    width: 8px;
    height: 8px;
    bottom: 2px;
    right: -3px;
  }

  /* -- Focus states --------------------------------------------------- */
  button:focus-visible:enabled {
    background-color: ${({tokens:e})=>e.theme.foregroundSecondary};
    box-shadow: 0 0 0 4px ${({tokens:e})=>e.core.foregroundAccent040};
  }

  /* -- Hover & Active states ----------------------------------------------------------- */
  @media (hover: hover) {
    button:hover:enabled,
    button:active:enabled {
      background-color: ${({tokens:e})=>e.theme.foregroundSecondary};
    }
  }

  /* -- Disabled states --------------------------------------------------- */
  button:disabled {
    background-color: ${({tokens:e})=>e.theme.foregroundSecondary};
    opacity: 0.5;
  }
`;var c=function(e,t,o,i){var n,r=arguments.length,a=r<3?t:null===i?i=Object.getOwnPropertyDescriptor(t,o):i;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(e,t,o,i);else for(var s=e.length-1;s>=0;s--)(n=e[s])&&(a=(r<3?n(a):r>3?n(t,o,a):n(t,o))||a);return r>3&&a&&Object.defineProperty(t,o,a),a};let u={lg:"lg-regular",md:"lg-regular",sm:"md-regular"},d={lg:"lg",md:"md",sm:"sm"},p=class extends i.WF{constructor(){super(...arguments),this.size="md",this.disabled=!1,this.text="",this.loading=!1}render(){return this.loading?(0,i.qy)` <wui-flex alignItems="center" gap="01" padding="01">
        <wui-shimmer width="20px" height="20px"></wui-shimmer>
        <wui-shimmer width="32px" height="18px" borderRadius="4xs"></wui-shimmer>
      </wui-flex>`:(0,i.qy)`
      <button ?disabled=${this.disabled} data-size=${this.size}>
        ${this.imageTemplate()} ${this.textTemplate()}
      </button>
    `}imageTemplate(){if(this.imageSrc&&this.chainImageSrc)return(0,i.qy)`<wui-flex class="left-image-container">
        <wui-image src=${this.imageSrc} class="token-image"></wui-image>
        <wui-image src=${this.chainImageSrc} class="chain-image"></wui-image>
      </wui-flex>`;if(this.imageSrc)return(0,i.qy)`<wui-image src=${this.imageSrc} class="token-image"></wui-image>`;let e=d[this.size];return(0,i.qy)`<wui-flex class="left-icon-container">
      <wui-icon size=${e} name="networkPlaceholder"></wui-icon>
    </wui-flex>`}textTemplate(){let e=u[this.size];return(0,i.qy)`<wui-text color="primary" variant=${e}
      >${this.text}</wui-text
    >`}};p.styles=[r.W5,r.fD,l],c([(0,n.MZ)()],p.prototype,"size",void 0),c([(0,n.MZ)()],p.prototype,"imageSrc",void 0),c([(0,n.MZ)()],p.prototype,"chainImageSrc",void 0),c([(0,n.MZ)({type:Boolean})],p.prototype,"disabled",void 0),c([(0,n.MZ)()],p.prototype,"text",void 0),c([(0,n.MZ)({type:Boolean})],p.prototype,"loading",void 0),p=c([(0,a.E)("wui-token-button")],p)}}]);