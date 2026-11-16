"use strict";(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[1742],{50136:(e,t,i)=>{var n=i(1850),r=i(58446);i(13496),i(56349),i(39251),i(53059),i(18341);var o=i(54684),a=i(51127),s=i(41608);let l=(0,s.AH)`
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
`;var c=function(e,t,i,n){var r,o=arguments.length,a=o<3?t:null===n?n=Object.getOwnPropertyDescriptor(t,i):n;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(e,t,i,n);else for(var s=e.length-1;s>=0;s--)(r=e[s])&&(a=(o<3?r(a):o>3?r(t,i,a):r(t,i))||a);return o>3&&a&&Object.defineProperty(t,i,a),a};let u={lg:"lg-regular",md:"lg-regular",sm:"md-regular"},d={lg:"lg",md:"md",sm:"sm"},h=class extends n.WF{constructor(){super(...arguments),this.size="md",this.disabled=!1,this.text="",this.loading=!1}render(){return this.loading?(0,n.qy)` <wui-flex alignItems="center" gap="01" padding="01">
        <wui-shimmer width="20px" height="20px"></wui-shimmer>
        <wui-shimmer width="32px" height="18px" borderRadius="4xs"></wui-shimmer>
      </wui-flex>`:(0,n.qy)`
      <button ?disabled=${this.disabled} data-size=${this.size}>
        ${this.imageTemplate()} ${this.textTemplate()}
      </button>
    `}imageTemplate(){if(this.imageSrc&&this.chainImageSrc)return(0,n.qy)`<wui-flex class="left-image-container">
        <wui-image src=${this.imageSrc} class="token-image"></wui-image>
        <wui-image src=${this.chainImageSrc} class="chain-image"></wui-image>
      </wui-flex>`;if(this.imageSrc)return(0,n.qy)`<wui-image src=${this.imageSrc} class="token-image"></wui-image>`;let e=d[this.size];return(0,n.qy)`<wui-flex class="left-icon-container">
      <wui-icon size=${e} name="networkPlaceholder"></wui-icon>
    </wui-flex>`}textTemplate(){let e=u[this.size];return(0,n.qy)`<wui-text color="primary" variant=${e}
      >${this.text}</wui-text
    >`}};h.styles=[o.W5,o.fD,l],c([(0,r.MZ)()],h.prototype,"size",void 0),c([(0,r.MZ)()],h.prototype,"imageSrc",void 0),c([(0,r.MZ)()],h.prototype,"chainImageSrc",void 0),c([(0,r.MZ)({type:Boolean})],h.prototype,"disabled",void 0),c([(0,r.MZ)()],h.prototype,"text",void 0),c([(0,r.MZ)({type:Boolean})],h.prototype,"loading",void 0),h=c([(0,a.E)("wui-token-button")],h)},81398:(e,t,i)=>{var n=i(1850),r=i(58446),o=i(40438),a=i(41608),s=i(54684),l=i(86833),c=i(51127);let u=(0,a.AH)`
  :host {
    position: relative;
    display: inline-block;
  }

  :host([data-error='true']) > input {
    color: ${({tokens:e})=>e.core.textError};
  }

  :host([data-error='false']) > input {
    color: ${({tokens:e})=>e.theme.textPrimary};
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
`;var d=function(e,t,i,n){var r,o=arguments.length,a=o<3?t:null===n?n=Object.getOwnPropertyDescriptor(t,i):n;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(e,t,i,n);else for(var s=e.length-1;s>=0;s--)(r=e[s])&&(a=(o<3?r(a):o>3?r(t,i,a):r(t,i))||a);return o>3&&a&&Object.defineProperty(t,i,a),a};let h=class extends n.WF{constructor(){super(...arguments),this.inputElementRef=(0,o._)(),this.disabled=!1,this.value="",this.placeholder="0",this.widthVariant="auto",this.maxDecimals=void 0,this.maxIntegers=void 0,this.fontSize="h4",this.error=!1}firstUpdated(){this.resizeInput()}updated(){this.style.setProperty("--local-font-size",a.f.textSize[this.fontSize]),this.resizeInput()}render(){return(this.dataset.widthVariant=this.widthVariant,this.dataset.error=String(this.error),this.inputElementRef?.value&&this.value&&(this.inputElementRef.value.value=this.value),"auto"===this.widthVariant)?this.inputTemplate():(0,n.qy)`
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
    />`}dispatchInputChangeEvent(){this.inputElementRef.value&&(this.inputElementRef.value.value=l.Z.maskInput({value:this.inputElementRef.value.value,decimals:this.maxDecimals,integers:this.maxIntegers}),this.dispatchEvent(new CustomEvent("inputChange",{detail:this.inputElementRef.value.value,bubbles:!0,composed:!0})),this.resizeInput())}resizeInput(){if("fit"===this.widthVariant){let e=this.inputElementRef.value;if(e){let t=e.previousElementSibling;t&&(t.textContent=e.value||"0",e.style.width=`${t.offsetWidth}px`)}}}};h.styles=[s.W5,s.fD,u],d([(0,r.MZ)({type:Boolean})],h.prototype,"disabled",void 0),d([(0,r.MZ)({type:String})],h.prototype,"value",void 0),d([(0,r.MZ)({type:String})],h.prototype,"placeholder",void 0),d([(0,r.MZ)({type:String})],h.prototype,"widthVariant",void 0),d([(0,r.MZ)({type:Number})],h.prototype,"maxDecimals",void 0),d([(0,r.MZ)({type:Number})],h.prototype,"maxIntegers",void 0),d([(0,r.MZ)({type:String})],h.prototype,"fontSize",void 0),d([(0,r.MZ)({type:Boolean})],h.prototype,"error",void 0),h=d([(0,c.E)("wui-input-amount")],h)},91742:(e,t,i)=>{i.r(t),i.d(t,{W3mSendConfirmedView:()=>X,W3mSendSelectTokenView:()=>I,W3mWalletSendPreviewView:()=>J,W3mWalletSendView:()=>C});var n=i(1850),r=i(58446),o=i(99400),a=i(33306),s=i(51105),l=i(933),c=i(86847),u=i(24417),d=i(26064),h=i(21159),p=i(82570),f=i(22797),m=i(11464),g=i(78226),w=i(44458);i(34556),i(85479),i(8285),i(38885);var y=i(40438);i(80729),i(60347);let v=(0,w.AH)`
  :host {
    width: 100%;
    height: 100px;
    border-radius: ${({borderRadius:e})=>e["5"]};
    border: 1px solid ${({tokens:e})=>e.theme.foregroundPrimary};
    background-color: ${({tokens:e})=>e.theme.foregroundPrimary};
    transition: background-color ${({durations:e})=>e.lg}
      ${({easings:e})=>e["ease-out-power-1"]};
    will-change: background-color;
    position: relative;
  }

  :host(:hover) {
    background-color: ${({tokens:e})=>e.theme.foregroundSecondary};
  }

  wui-flex {
    width: 100%;
    height: fit-content;
  }

  wui-button {
    display: ruby;
    color: ${({tokens:e})=>e.theme.textPrimary};
    margin: 0 ${({spacing:e})=>e["2"]};
  }

  .instruction {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    z-index: 2;
  }

  .paste {
    display: inline-flex;
  }

  textarea {
    background: transparent;
    width: 100%;
    font-family: ${({fontFamily:e})=>e.regular};
    font-style: normal;
    font-size: ${({textSize:e})=>e.large};
    font-weight: ${({fontWeight:e})=>e.regular};
    line-height: ${({typography:e})=>e["lg-regular"].lineHeight};
    letter-spacing: ${({typography:e})=>e["lg-regular"].letterSpacing};
    color: ${({tokens:e})=>e.theme.textPrimary};
    caret-color: ${({tokens:e})=>e.core.backgroundAccentPrimary};
    box-sizing: border-box;
    -webkit-appearance: none;
    -moz-appearance: textfield;
    padding: 0px;
    border: none;
    outline: none;
    appearance: none;
    resize: none;
    overflow: hidden;
  }
`;var x=function(e,t,i,n){var r,o=arguments.length,a=o<3?t:null===n?n=Object.getOwnPropertyDescriptor(t,i):n;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(e,t,i,n);else for(var s=e.length-1;s>=0;s--)(r=e[s])&&(a=(o<3?r(a):o>3?r(t,i,a):r(t,i))||a);return o>3&&a&&Object.defineProperty(t,i,a),a};let b=class extends n.WF{constructor(){super(...arguments),this.inputElementRef=(0,y._)(),this.instructionElementRef=(0,y._)(),this.readOnly=!1,this.instructionHidden=!!this.value,this.pasting=!1,this.onDebouncedSearch=h.w.debounce(async e=>{if(!e.length)return void this.setReceiverAddress("");let t=l.W.state.activeChain;if(h.w.isAddress(e,t))return void this.setReceiverAddress(e);try{let t=await d.x.getEnsAddress(e);if(t){a.R.setReceiverProfileName(e),a.R.setReceiverAddress(t);let i=await d.x.getEnsAvatar(e);a.R.setReceiverProfileImageUrl(i||void 0)}}catch(t){this.setReceiverAddress(e)}finally{a.R.setLoading(!1)}})}firstUpdated(){this.value&&(this.instructionHidden=!0),this.checkHidden()}render(){return this.readOnly?(0,n.qy)` <wui-flex
        flexDirection="column"
        justifyContent="center"
        gap="01"
        .padding=${["8","4","5","4"]}
      >
        <textarea
          spellcheck="false"
          ?disabled=${!0}
          autocomplete="off"
          .value=${this.value??""}
        ></textarea>
      </wui-flex>`:(0,n.qy)` <wui-flex
      @click=${this.onBoxClick.bind(this)}
      flexDirection="column"
      justifyContent="center"
      gap="01"
      .padding=${["8","4","5","4"]}
    >
      <wui-text
        ${(0,y.K)(this.instructionElementRef)}
        class="instruction"
        color="secondary"
        variant="md-medium"
      >
        Type or
        <wui-button
          class="paste"
          size="md"
          variant="neutral-secondary"
          iconLeft="copy"
          @click=${this.onPasteClick.bind(this)}
        >
          <wui-icon size="sm" color="inherit" slot="iconLeft" name="copy"></wui-icon>
          Paste
        </wui-button>
        address
      </wui-text>
      <textarea
        spellcheck="false"
        ?disabled=${!this.instructionHidden}
        ${(0,y.K)(this.inputElementRef)}
        @input=${this.onInputChange.bind(this)}
        @blur=${this.onBlur.bind(this)}
        .value=${this.value??""}
        autocomplete="off"
      ></textarea>
    </wui-flex>`}async focusInput(){this.instructionElementRef.value&&(this.instructionHidden=!0,await this.toggleInstructionFocus(!1),this.instructionElementRef.value.style.pointerEvents="none",this.inputElementRef.value?.focus(),this.inputElementRef.value&&(this.inputElementRef.value.selectionStart=this.inputElementRef.value.selectionEnd=this.inputElementRef.value.value.length))}async focusInstruction(){this.instructionElementRef.value&&(this.instructionHidden=!1,await this.toggleInstructionFocus(!0),this.instructionElementRef.value.style.pointerEvents="auto",this.inputElementRef.value?.blur())}async toggleInstructionFocus(e){this.instructionElementRef.value&&await this.instructionElementRef.value.animate([{opacity:+!e},{opacity:+!!e}],{duration:100,easing:"ease",fill:"forwards"}).finished}onBoxClick(){this.value||this.instructionHidden||this.focusInput()}onBlur(){this.value||!this.instructionHidden||this.pasting||this.focusInstruction()}checkHidden(){this.instructionHidden&&this.focusInput()}async onPasteClick(){this.pasting=!0;let e=await navigator.clipboard.readText();a.R.setReceiverAddress(e),this.focusInput()}onInputChange(e){let t=e.target;this.pasting=!1,this.value=e.target?.value,t.value&&!this.instructionHidden&&this.focusInput(),a.R.setLoading(!0),this.onDebouncedSearch(t.value)}setReceiverAddress(e){a.R.setReceiverAddress(e),a.R.setReceiverProfileName(void 0),a.R.setReceiverProfileImageUrl(void 0),a.R.setLoading(!1)}};b.styles=v,x([(0,r.MZ)()],b.prototype,"value",void 0),x([(0,r.MZ)({type:Boolean})],b.prototype,"readOnly",void 0),x([(0,r.wk)()],b.prototype,"instructionHidden",void 0),x([(0,r.wk)()],b.prototype,"pasting",void 0),b=x([(0,w.EM)("w3m-input-address")],b),i(81398),i(83416),i(50136);let k=(0,w.AH)`
  :host {
    width: 100%;
    height: 100px;
    border-radius: ${({borderRadius:e})=>e["5"]};
    border: 1px solid ${({tokens:e})=>e.theme.foregroundPrimary};
    background-color: ${({tokens:e})=>e.theme.foregroundPrimary};
    transition: background-color ${({durations:e})=>e.lg}
      ${({easings:e})=>e["ease-out-power-1"]};
    will-change: background-color;
    transition: all ${({easings:e})=>e["ease-out-power-1"]}
      ${({durations:e})=>e.lg};
  }

  :host(:hover) {
    background-color: ${({tokens:e})=>e.theme.foregroundSecondary};
  }

  wui-flex {
    width: 100%;
    height: fit-content;
  }

  wui-button {
    width: 100%;
    display: flex;
    justify-content: flex-end;
  }

  wui-input-amount {
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

  .totalValue {
    width: 100%;
  }
`;var $=function(e,t,i,n){var r,o=arguments.length,a=o<3?t:null===n?n=Object.getOwnPropertyDescriptor(t,i):n;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(e,t,i,n);else for(var s=e.length-1;s>=0;s--)(r=e[s])&&(a=(o<3?r(a):o>3?r(t,i,a):r(t,i))||a);return o>3&&a&&Object.defineProperty(t,i,a),a};let R=class extends n.WF{constructor(){super(...arguments),this.readOnly=!1,this.isInsufficientBalance=!1}render(){let e=this.readOnly||!this.token;return(0,n.qy)` <wui-flex
      flexDirection="column"
      gap="01"
      .padding=${["5","3","4","3"]}
    >
      <wui-flex alignItems="center">
        <wui-input-amount
          @inputChange=${this.onInputChange.bind(this)}
          ?disabled=${e}
          .value=${this.sendTokenAmount??""}
          ?error=${!!this.isInsufficientBalance}
        ></wui-input-amount>
        ${this.buttonTemplate()}
      </wui-flex>
      ${this.bottomTemplate()}
    </wui-flex>`}buttonTemplate(){return this.token?(0,n.qy)`<wui-token-button
        text=${this.token.symbol}
        imageSrc=${this.token.iconUrl}
        @click=${this.handleSelectButtonClick.bind(this)}
      >
      </wui-token-button>`:(0,n.qy)`<wui-button
      size="md"
      variant="neutral-secondary"
      @click=${this.handleSelectButtonClick.bind(this)}
      >Select token</wui-button
    >`}handleSelectButtonClick(){this.readOnly||s.I.push("WalletSendSelectToken")}sendValueTemplate(){if(!this.readOnly&&this.token&&this.sendTokenAmount){let e=this.token.price*Number(this.sendTokenAmount);return(0,n.qy)`<wui-text class="totalValue" variant="sm-regular" color="secondary"
        >${e?`$${o.S.formatNumberToLocalString(e,2)}`:"Incorrect value"}</wui-text
      >`}return null}maxAmountTemplate(){return this.token?(0,n.qy)` <wui-text variant="sm-regular" color="secondary">
        ${w.Zv.roundNumber(Number(this.token.quantity.numeric),6,5)}
      </wui-text>`:null}actionTemplate(){return this.token?(0,n.qy)`<wui-link @click=${this.onMaxClick.bind(this)}>Max</wui-link>`:null}bottomTemplate(){return this.readOnly?null:(0,n.qy)`<wui-flex alignItems="center" justifyContent="space-between">
      ${this.sendValueTemplate()}
      <wui-flex alignItems="center" gap="01" justifyContent="flex-end">
        ${this.maxAmountTemplate()} ${this.actionTemplate()}
      </wui-flex>
    </wui-flex>`}onInputChange(e){a.R.setTokenAmount(String(e.detail))}onMaxClick(){if(this.token){let e=Number(this.token.quantity.decimals),t=o.S.bigNumber(this.token.quantity.numeric);if(!this.token.address&&this.gasPrice){let i=65000n*BigInt(this.gasPrice),n=o.S.bigNumber(i.toString()).div(o.S.bigNumber(10).pow(e)),r=t.minus(n);a.R.setTokenAmount(r.gt(0)?r.toFixed(e,0):"0")}else a.R.setTokenAmount(t.toFixed(e,0))}}};R.styles=k,$([(0,r.MZ)({type:Object})],R.prototype,"token",void 0),$([(0,r.MZ)({type:Boolean})],R.prototype,"readOnly",void 0),$([(0,r.MZ)({type:String})],R.prototype,"sendTokenAmount",void 0),$([(0,r.MZ)({type:Boolean})],R.prototype,"isInsufficientBalance",void 0),$([(0,r.MZ)({type:String})],R.prototype,"gasPrice",void 0),R=$([(0,w.EM)("w3m-input-token")],R);let A=(0,w.AH)`
  :host {
    display: block;
  }

  wui-flex {
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

  wui-button {
    --local-border-radius: ${({borderRadius:e})=>e["4"]} !important;
  }

  .inputContainer {
    height: fit-content;
  }
`;var P=function(e,t,i,n){var r,o=arguments.length,a=o<3?t:null===n?n=Object.getOwnPropertyDescriptor(t,i):n;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(e,t,i,n);else for(var s=e.length-1;s>=0;s--)(r=e[s])&&(a=(o<3?r(a):o>3?r(t,i,a):r(t,i))||a);return o>3&&a&&Object.defineProperty(t,i,a),a};let S="Insufficient Funds",T="Preview Send",C=class extends n.WF{constructor(){super(),this.unsubscribe=[],this.isTryingToChooseDifferentWallet=!1,this.token=a.R.state.token,this.sendTokenAmount=a.R.state.sendTokenAmount,this.receiverAddress=a.R.state.receiverAddress,this.receiverProfileName=a.R.state.receiverProfileName,this.loading=a.R.state.loading,this.params=s.I.state.data?.send,this.caipAddress=l.W.getAccountData()?.caipAddress,this.disconnecting=!1,this.gasFee=c.GN.state.gasFee,this.token&&!this.params&&(this.fetchBalances(),this.fetchNetworkPrice());let e=l.W.subscribeKey("activeCaipAddress",t=>{!t&&this.isTryingToChooseDifferentWallet&&(this.isTryingToChooseDifferentWallet=!1,u.W.open({view:"Connect",data:{redirectView:"WalletSend"}}).catch(()=>null),e())});this.unsubscribe.push(l.W.subscribeAccountStateProp("caipAddress",e=>{this.caipAddress=e}),a.R.subscribe(e=>{this.token=e.token,this.sendTokenAmount=e.sendTokenAmount,this.receiverAddress=e.receiverAddress,this.receiverProfileName=e.receiverProfileName,this.loading=e.loading}),c.GN.subscribeKey("gasFee",e=>{this.gasFee=e}))}disconnectedCallback(){this.unsubscribe.forEach(e=>e())}async firstUpdated(){await this.handleSendParameters()}render(){let e=this.getMessage(),t=!!this.params;return(0,n.qy)` <wui-flex flexDirection="column" .padding=${["0","4","4","4"]}>
      <wui-flex class="inputContainer" gap="2" flexDirection="column">
        <w3m-input-token
          .token=${this.token}
          .sendTokenAmount=${this.sendTokenAmount}
          .gasPrice=${this.gasFee}
          ?readOnly=${t}
          ?isInsufficientBalance=${e===S}
        ></w3m-input-token>
        <wui-icon-box size="md" variant="secondary" icon="arrowBottom"></wui-icon-box>
        <w3m-input-address
          ?readOnly=${t}
          .value=${this.receiverProfileName?this.receiverProfileName:this.receiverAddress}
        ></w3m-input-address>
      </wui-flex>
      ${this.buttonTemplate(e)}
    </wui-flex>`}async fetchBalances(){await a.R.fetchTokenBalance(),a.R.fetchNetworkBalance()}async fetchNetworkPrice(){await c.GN.getNetworkTokenPrice(),await c.GN.getInitialGasPrice()}onButtonClick(){s.I.push("WalletSendPreview",{send:this.params})}onFundWalletClick(){s.I.push("FundWallet",{redirectView:"WalletSend"})}async onConnectDifferentWalletClick(){try{this.isTryingToChooseDifferentWallet=!0,this.disconnecting=!0,await d.x.disconnect()}finally{this.disconnecting=!1}}getMessage(){return this.token?this.sendTokenAmount?this.token.price&&!(Number(this.sendTokenAmount)*this.token.price)?"Incorrect Value":o.S.bigNumber(this.sendTokenAmount).gt(this.token.quantity.numeric)?S:this.receiverAddress?h.w.isAddress(this.receiverAddress,l.W.state.activeChain)?T:"Invalid Address":"Add Address":"Add Amount":"Select Token"}buttonTemplate(e){let t=!e.startsWith(T),i=e===S,r=!!this.params;return i&&!r?(0,n.qy)`
        <wui-flex .margin=${["4","0","0","0"]} flexDirection="column" gap="4">
          <wui-button
            @click=${this.onFundWalletClick.bind(this)}
            size="lg"
            variant="accent-secondary"
            fullWidth
          >
            Fund Wallet
          </wui-button>

          <wui-separator data-testid="wui-separator" text="or"></wui-separator>

          <wui-button
            @click=${this.onConnectDifferentWalletClick.bind(this)}
            size="lg"
            variant="neutral-secondary"
            fullWidth
            ?loading=${this.disconnecting}
          >
            Connect a different wallet
          </wui-button>
        </wui-flex>
      `:(0,n.qy)`<wui-flex .margin=${["4","0","0","0"]}>
      <wui-button
        @click=${this.onButtonClick.bind(this)}
        ?disabled=${t}
        size="lg"
        variant="accent-primary"
        ?loading=${this.loading}
        fullWidth
      >
        ${e}
      </wui-button>
    </wui-flex>`}async handleSendParameters(){if(this.loading=!0,!this.params){this.loading=!1;return}let e=Number(this.params.amount);if(isNaN(e)){p.P.showError("Invalid amount"),this.loading=!1;return}let{namespace:t,chainId:i,assetAddress:n}=this.params;if(!f.oU.SEND_PARAMS_SUPPORTED_CHAINS.includes(t)){p.P.showError(`Chain "${t}" is not supported for send parameters`),this.loading=!1;return}let r=l.W.getCaipNetworkById(i,t);if(!r){p.P.showError(`Network with id "${i}" not found`),this.loading=!1;return}try{let{balance:t,name:i,symbol:o,decimals:s}=await g.Z.fetchERC20Balance({caipAddress:this.caipAddress,assetAddress:n,caipNetwork:r});if(!i||!o||!s||!t)return void p.P.showError("Token not found");a.R.setToken({name:i,symbol:o,chainId:r.id.toString(),address:`${r.chainNamespace}:${r.id}:${n}`,value:0,price:0,quantity:{decimals:s.toString(),numeric:t.toString()},iconUrl:m.$.getTokenImage(o)??""}),a.R.setTokenAmount(String(e)),a.R.setReceiverAddress(this.params.to)}catch(e){console.error("Failed to load token information:",e),p.P.showError("Failed to load token information")}finally{this.loading=!1}}};C.styles=A,P([(0,r.wk)()],C.prototype,"token",void 0),P([(0,r.wk)()],C.prototype,"sendTokenAmount",void 0),P([(0,r.wk)()],C.prototype,"receiverAddress",void 0),P([(0,r.wk)()],C.prototype,"receiverProfileName",void 0),P([(0,r.wk)()],C.prototype,"loading",void 0),P([(0,r.wk)()],C.prototype,"params",void 0),P([(0,r.wk)()],C.prototype,"caipAddress",void 0),P([(0,r.wk)()],C.prototype,"disconnecting",void 0),P([(0,r.wk)()],C.prototype,"gasFee",void 0),C=P([(0,w.EM)("w3m-wallet-send-view")],C),i(39220),i(53658);let E=(0,w.AH)`
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
`;var N=function(e,t,i,n){var r,o=arguments.length,a=o<3?t:null===n?n=Object.getOwnPropertyDescriptor(t,i):n;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(e,t,i,n);else for(var s=e.length-1;s>=0;s--)(r=e[s])&&(a=(o<3?r(a):o>3?r(t,i,a):r(t,i))||a);return o>3&&a&&Object.defineProperty(t,i,a),a};let I=class extends n.WF{constructor(){super(),this.unsubscribe=[],this.tokenBalances=a.R.state.tokenBalances,this.search="",this.onDebouncedSearch=h.w.debounce(e=>{this.search=e}),this.fetchBalancesAndNetworkPrice(),this.unsubscribe.push(a.R.subscribe(e=>{this.tokenBalances=e.tokenBalances}))}disconnectedCallback(){this.unsubscribe.forEach(e=>e())}render(){return(0,n.qy)`
      <wui-flex flexDirection="column">
        ${this.templateSearchInput()} <wui-separator></wui-separator> ${this.templateTokens()}
      </wui-flex>
    `}async fetchBalancesAndNetworkPrice(){this.tokenBalances&&this.tokenBalances?.length!==0||(await this.fetchBalances(),await this.fetchNetworkPrice())}async fetchBalances(){await a.R.fetchTokenBalance(),a.R.fetchNetworkBalance()}async fetchNetworkPrice(){await c.GN.getNetworkTokenPrice()}templateSearchInput(){return(0,n.qy)`
      <wui-flex gap="2" padding="3">
        <wui-input-text
          @inputChange=${this.onInputChange.bind(this)}
          class="network-search-input"
          size="sm"
          placeholder="Search token"
          icon="search"
        ></wui-input-text>
      </wui-flex>
    `}templateTokens(){return this.tokens=this.tokenBalances?.filter(e=>e.chainId===l.W.state.activeCaipNetwork?.caipNetworkId),this.search?this.filteredTokens=this.tokenBalances?.filter(e=>e.name.toLowerCase().includes(this.search.toLowerCase())):this.filteredTokens=this.tokens,(0,n.qy)`
      <wui-flex
        class="contentContainer"
        flexDirection="column"
        .padding=${["0","3","0","3"]}
      >
        <wui-flex justifyContent="flex-start" .padding=${["4","3","3","3"]}>
          <wui-text variant="md-medium" color="secondary">Your tokens</wui-text>
        </wui-flex>
        <wui-flex flexDirection="column" gap="2">
          ${this.filteredTokens&&this.filteredTokens.length>0?this.filteredTokens.map(e=>(0,n.qy)`<wui-list-token
                    @click=${this.handleTokenClick.bind(this,e)}
                    ?clickable=${!0}
                    tokenName=${e.name}
                    tokenImageUrl=${e.iconUrl}
                    tokenAmount=${e.quantity.numeric}
                    tokenValue=${e.value}
                    tokenCurrency=${e.symbol}
                  ></wui-list-token>`):(0,n.qy)`<wui-flex
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
                  flexDirection="column"
                >
                  <wui-text variant="lg-medium" align="center" color="primary">
                    No tokens found
                  </wui-text>
                  <wui-text variant="lg-regular" align="center" color="secondary">
                    Your tokens will appear here
                  </wui-text>
                </wui-flex>
                <wui-link @click=${this.onBuyClick.bind(this)}>Buy</wui-link>
              </wui-flex>`}
        </wui-flex>
      </wui-flex>
    `}onBuyClick(){s.I.push("OnRampProviders")}onInputChange(e){this.onDebouncedSearch(e.detail)}handleTokenClick(e){a.R.setToken(e),a.R.setTokenAmount(void 0),s.I.goBack()}};I.styles=E,N([(0,r.wk)()],I.prototype,"tokenBalances",void 0),N([(0,r.wk)()],I.prototype,"tokens",void 0),N([(0,r.wk)()],I.prototype,"filteredTokens",void 0),N([(0,r.wk)()],I.prototype,"search",void 0),I=N([(0,w.EM)("w3m-wallet-send-select-token-view")],I);var z=i(15982),D=i(41228),O=i(24101);i(13496),i(56349),i(53059),i(18341);var B=i(54684),W=i(51127);i(35305);var j=i(41608);let q=(0,j.AH)`
  :host {
    height: 32px;
    display: flex;
    align-items: center;
    gap: ${({spacing:e})=>e[1]};
    border-radius: ${({borderRadius:e})=>e[32]};
    background-color: ${({tokens:e})=>e.theme.foregroundPrimary};
    padding: ${({spacing:e})=>e[1]};
    padding-left: ${({spacing:e})=>e[2]};
  }

  wui-avatar,
  wui-image {
    width: 24px;
    height: 24px;
    border-radius: ${({borderRadius:e})=>e[16]};
  }

  wui-icon {
    border-radius: ${({borderRadius:e})=>e[16]};
  }
`;var M=function(e,t,i,n){var r,o=arguments.length,a=o<3?t:null===n?n=Object.getOwnPropertyDescriptor(t,i):n;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(e,t,i,n);else for(var s=e.length-1;s>=0;s--)(r=e[s])&&(a=(o<3?r(a):o>3?r(t,i,a):r(t,i))||a);return o>3&&a&&Object.defineProperty(t,i,a),a};let Z=class extends n.WF{constructor(){super(...arguments),this.text=""}render(){return(0,n.qy)`<wui-text variant="lg-regular" color="primary">${this.text}</wui-text>
      ${this.imageTemplate()}`}imageTemplate(){return this.address?(0,n.qy)`<wui-avatar address=${this.address} .imageSrc=${this.imageSrc}></wui-avatar>`:this.imageSrc?(0,n.qy)`<wui-image src=${this.imageSrc}></wui-image>`:(0,n.qy)`<wui-icon size="lg" color="inverse" name="networkPlaceholder"></wui-icon>`}};Z.styles=[B.W5,B.fD,q],M([(0,r.MZ)({type:String})],Z.prototype,"text",void 0),M([(0,r.MZ)({type:String})],Z.prototype,"address",void 0),M([(0,r.MZ)({type:String})],Z.prototype,"imageSrc",void 0),Z=M([(0,W.E)("wui-preview-item")],Z);var F=i(12689);let H=(0,j.AH)`
  :host {
    display: flex;
    padding: ${({spacing:e})=>e[4]} ${({spacing:e})=>e[3]};
    width: 100%;
    background-color: ${({tokens:e})=>e.theme.foregroundPrimary};
    border-radius: ${({borderRadius:e})=>e[4]};
  }

  wui-image {
    width: 20px;
    height: 20px;
    border-radius: ${({borderRadius:e})=>e[16]};
  }

  wui-icon {
    width: 20px;
    height: 20px;
  }
`;var V=function(e,t,i,n){var r,o=arguments.length,a=o<3?t:null===n?n=Object.getOwnPropertyDescriptor(t,i):n;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(e,t,i,n);else for(var s=e.length-1;s>=0;s--)(r=e[s])&&(a=(o<3?r(a):o>3?r(t,i,a):r(t,i))||a);return o>3&&a&&Object.defineProperty(t,i,a),a};let _=class extends n.WF{constructor(){super(...arguments),this.imageSrc=void 0,this.textTitle="",this.textValue=void 0}render(){return(0,n.qy)`
      <wui-flex justifyContent="space-between" alignItems="center">
        <wui-text variant="lg-regular" color="primary"> ${this.textTitle} </wui-text>
        ${this.templateContent()}
      </wui-flex>
    `}templateContent(){return this.imageSrc?(0,n.qy)`<wui-image src=${this.imageSrc} alt=${this.textTitle}></wui-image>`:this.textValue?(0,n.qy)` <wui-text variant="md-regular" color="secondary"> ${this.textValue} </wui-text>`:(0,n.qy)`<wui-icon size="inherit" color="default" name="networkPlaceholder"></wui-icon>`}};_.styles=[B.W5,B.fD,H],V([(0,r.MZ)()],_.prototype,"imageSrc",void 0),V([(0,r.MZ)()],_.prototype,"textTitle",void 0),V([(0,r.MZ)()],_.prototype,"textValue",void 0),_=V([(0,W.E)("wui-list-content")],_);let U=(0,w.AH)`
  :host {
    display: flex;
    width: auto;
    flex-direction: column;
    gap: ${({spacing:e})=>e["1"]};
    border-radius: ${({borderRadius:e})=>e["5"]};
    background: ${({tokens:e})=>e.theme.foregroundPrimary};
    padding: ${({spacing:e})=>e["3"]} ${({spacing:e})=>e["2"]}
      ${({spacing:e})=>e["2"]} ${({spacing:e})=>e["2"]};
  }

  wui-list-content {
    width: -webkit-fill-available !important;
  }

  wui-text {
    padding: 0 ${({spacing:e})=>e["2"]};
  }

  wui-flex {
    margin-top: ${({spacing:e})=>e["2"]};
  }

  .network {
    cursor: pointer;
    transition: background-color ${({durations:e})=>e.lg}
      ${({easings:e})=>e["ease-out-power-1"]};
    will-change: background-color;
  }

  .network:focus-visible {
    border: 1px solid ${({tokens:e})=>e.core.textAccentPrimary};
    background-color: ${({tokens:e})=>e.core.glass010};
    -webkit-box-shadow: 0px 0px 0px 4px ${({tokens:e})=>e.core.foregroundAccent010};
    -moz-box-shadow: 0px 0px 0px 4px ${({tokens:e})=>e.core.foregroundAccent010};
    box-shadow: 0px 0px 0px 4px ${({tokens:e})=>e.core.foregroundAccent010};
  }

  .network:hover {
    background-color: ${({tokens:e})=>e.core.glass010};
  }

  .network:active {
    background-color: ${({tokens:e})=>e.core.glass010};
  }
`;var L=function(e,t,i,n){var r,o=arguments.length,a=o<3?t:null===n?n=Object.getOwnPropertyDescriptor(t,i):n;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(e,t,i,n);else for(var s=e.length-1;s>=0;s--)(r=e[s])&&(a=(o<3?r(a):o>3?r(t,i,a):r(t,i))||a);return o>3&&a&&Object.defineProperty(t,i,a),a};let G=class extends n.WF{constructor(){super(...arguments),this.params=s.I.state.data?.send}render(){return(0,n.qy)` <wui-text variant="sm-regular" color="secondary">Details</wui-text>
      <wui-flex flexDirection="column" gap="1">
        <wui-list-content
          textTitle="Address"
          textValue=${w.Zv.getTruncateString({string:this.receiverAddress??"",charsStart:4,charsEnd:4,truncate:"middle"})}
        >
        </wui-list-content>
        ${this.networkTemplate()}
      </wui-flex>`}networkTemplate(){return this.caipNetwork?.name?(0,n.qy)` <wui-list-content
        @click=${()=>this.onNetworkClick(this.caipNetwork)}
        class="network"
        textTitle="Network"
        imageSrc=${(0,F.J)(m.$.getNetworkImage(this.caipNetwork))}
      ></wui-list-content>`:null}onNetworkClick(e){e&&!this.params&&s.I.push("Networks",{network:e})}};G.styles=U,L([(0,r.MZ)()],G.prototype,"receiverAddress",void 0),L([(0,r.MZ)({type:Object})],G.prototype,"caipNetwork",void 0),L([(0,r.wk)()],G.prototype,"params",void 0),G=L([(0,w.EM)("w3m-wallet-send-details")],G);let K=(0,w.AH)`
  wui-avatar,
  wui-image {
    display: ruby;
    width: 32px;
    height: 32px;
    border-radius: ${({borderRadius:e})=>e["20"]};
  }

  .sendButton {
    width: 70%;
    --local-width: 100% !important;
    --local-border-radius: ${({borderRadius:e})=>e["4"]} !important;
  }

  .cancelButton {
    width: 30%;
    --local-width: 100% !important;
    --local-border-radius: ${({borderRadius:e})=>e["4"]} !important;
  }
`;var Y=function(e,t,i,n){var r,o=arguments.length,a=o<3?t:null===n?n=Object.getOwnPropertyDescriptor(t,i):n;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(e,t,i,n);else for(var s=e.length-1;s>=0;s--)(r=e[s])&&(a=(o<3?r(a):o>3?r(t,i,a):r(t,i))||a);return o>3&&a&&Object.defineProperty(t,i,a),a};let J=class extends n.WF{constructor(){super(),this.unsubscribe=[],this.token=a.R.state.token,this.sendTokenAmount=a.R.state.sendTokenAmount,this.receiverAddress=a.R.state.receiverAddress,this.receiverProfileName=a.R.state.receiverProfileName,this.receiverProfileImageUrl=a.R.state.receiverProfileImageUrl,this.caipNetwork=l.W.state.activeCaipNetwork,this.loading=a.R.state.loading,this.params=s.I.state.data?.send,this.unsubscribe.push(a.R.subscribe(e=>{this.token=e.token,this.sendTokenAmount=e.sendTokenAmount,this.receiverAddress=e.receiverAddress,this.receiverProfileName=e.receiverProfileName,this.receiverProfileImageUrl=e.receiverProfileImageUrl,this.loading=e.loading}),l.W.subscribeKey("activeCaipNetwork",e=>this.caipNetwork=e))}disconnectedCallback(){this.unsubscribe.forEach(e=>e())}render(){return(0,n.qy)` <wui-flex flexDirection="column" .padding=${["0","4","4","4"]}>
      <wui-flex gap="2" flexDirection="column" .padding=${["0","2","0","2"]}>
        <wui-flex alignItems="center" justifyContent="space-between">
          <wui-flex flexDirection="column" gap="01">
            <wui-text variant="sm-regular" color="secondary">Send</wui-text>
            ${this.sendValueTemplate()}
          </wui-flex>
          <wui-preview-item
            text="${this.sendTokenAmount?w.Zv.roundNumber(Number(this.sendTokenAmount),6,5):"unknown"} ${this.token?.symbol}"
            .imageSrc=${this.token?.iconUrl}
          ></wui-preview-item>
        </wui-flex>
        <wui-flex>
          <wui-icon color="default" size="md" name="arrowBottom"></wui-icon>
        </wui-flex>
        <wui-flex alignItems="center" justifyContent="space-between">
          <wui-text variant="sm-regular" color="secondary">To</wui-text>
          <wui-preview-item
            text="${this.receiverProfileName?w.Zv.getTruncateString({string:this.receiverProfileName,charsStart:20,charsEnd:0,truncate:"end"}):w.Zv.getTruncateString({string:this.receiverAddress?this.receiverAddress:"",charsStart:4,charsEnd:4,truncate:"middle"})}"
            address=${this.receiverAddress??""}
            .imageSrc=${this.receiverProfileImageUrl??void 0}
            .isAddress=${!0}
          ></wui-preview-item>
        </wui-flex>
      </wui-flex>
      <wui-flex flexDirection="column" .padding=${["6","0","0","0"]}>
        <w3m-wallet-send-details
          .caipNetwork=${this.caipNetwork}
          .receiverAddress=${this.receiverAddress}
        ></w3m-wallet-send-details>
        <wui-flex justifyContent="center" gap="1" .padding=${["3","0","0","0"]}>
          <wui-icon size="sm" color="default" name="warningCircle"></wui-icon>
          <wui-text variant="sm-regular" color="secondary">Review transaction carefully</wui-text>
        </wui-flex>
        <wui-flex justifyContent="center" gap="3" .padding=${["4","0","0","0"]}>
          <wui-button
            class="cancelButton"
            @click=${this.onCancelClick.bind(this)}
            size="lg"
            variant="neutral-secondary"
          >
            Cancel
          </wui-button>
          <wui-button
            class="sendButton"
            @click=${this.onSendClick.bind(this)}
            size="lg"
            variant="accent-primary"
            .loading=${this.loading}
          >
            Send
          </wui-button>
        </wui-flex>
      </wui-flex></wui-flex
    >`}sendValueTemplate(){if(!this.params&&this.token&&this.sendTokenAmount){let e=this.token.price*Number(this.sendTokenAmount);return(0,n.qy)`<wui-text variant="md-regular" color="primary"
        >$${e.toFixed(2)}</wui-text
      >`}return null}async onSendClick(){if(!this.sendTokenAmount||!this.receiverAddress)return void p.P.showError("Please enter a valid amount and receiver address");try{await a.R.sendToken(),this.params?s.I.reset("WalletSendConfirmed"):(p.P.showSuccess("Transaction started"),s.I.replace("Account"))}catch(n){let e="Failed to send transaction",t=n instanceof D.A&&n.originalName===z.RQ.PROVIDER_RPC_ERROR_NAME.USER_REJECTED_REQUEST,i=n instanceof D.A&&n.originalName===z.RQ.PROVIDER_RPC_ERROR_NAME.SEND_TRANSACTION_ERROR;(t||i)&&(e=n.message),O.E.sendEvent({type:"track",event:t?"SEND_REJECTED":"SEND_ERROR",properties:a.R.getSdkEventProperties(n)}),p.P.showError(e)}}onCancelClick(){s.I.goBack()}};J.styles=K,Y([(0,r.wk)()],J.prototype,"token",void 0),Y([(0,r.wk)()],J.prototype,"sendTokenAmount",void 0),Y([(0,r.wk)()],J.prototype,"receiverAddress",void 0),Y([(0,r.wk)()],J.prototype,"receiverProfileName",void 0),Y([(0,r.wk)()],J.prototype,"receiverProfileImageUrl",void 0),Y([(0,r.wk)()],J.prototype,"caipNetwork",void 0),Y([(0,r.wk)()],J.prototype,"loading",void 0),Y([(0,r.wk)()],J.prototype,"params",void 0),J=Y([(0,w.EM)("w3m-wallet-send-preview-view")],J);let Q=(0,w.AH)`
  .icon-box {
    width: 64px;
    height: 64px;
    border-radius: 16px;
    background-color: ${({spacing:e})=>e[16]};
    border: 8px solid ${({tokens:e})=>e.theme.borderPrimary};
    border-radius: ${({borderRadius:e})=>e.round};
  }
`,X=class extends n.WF{constructor(){super(),this.unsubscribe=[],this.unsubscribe.push()}render(){return(0,n.qy)`
      <wui-flex
        flexDirection="column"
        alignItems="center"
        gap="4"
        .padding="${["1","3","4","3"]}"
      >
        <wui-flex justifyContent="center" alignItems="center" class="icon-box">
          <wui-icon size="xxl" color="success" name="checkmark"></wui-icon>
        </wui-flex>

        <wui-text variant="h6-medium" color="primary">You successfully sent asset</wui-text>

        <wui-button
          fullWidth
          @click=${this.onCloseClick.bind(this)}
          size="lg"
          variant="neutral-secondary"
        >
          Close
        </wui-button>
      </wui-flex>
    `}onCloseClick(){u.W.close()}};X.styles=Q,X=function(e,t,i,n){var r,o=arguments.length,a=o<3?t:null===n?n=Object.getOwnPropertyDescriptor(t,i):n;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(e,t,i,n);else for(var s=e.length-1;s>=0;s--)(r=e[s])&&(a=(o<3?r(a):o>3?r(t,i,a):r(t,i))||a);return o>3&&a&&Object.defineProperty(t,i,a),a}([(0,w.EM)("w3m-send-confirmed-view")],X)}}]);