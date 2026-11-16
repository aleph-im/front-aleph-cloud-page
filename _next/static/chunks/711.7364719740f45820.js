"use strict";(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[711],{90711:(e,t,o)=>{o.r(t),o.d(t,{AppKitModal:()=>eh,W3mListWallet:()=>eb,W3mModal:()=>ed,W3mModalBase:()=>ec,W3mRouterContainer:()=>ev,W3mUsageExceededView:()=>eu});var i=o(1850),r=o(58446),a=o(12689),n=o(59390),s=o(24417),l=o(933),c=o(70803),d=o(70464),h=o(51105),p=o(26064),u=o(84443);let m={isUnsupportedChainView:()=>"UnsupportedChain"===h.I.state.view||"SwitchNetwork"===h.I.state.view&&h.I.state.history.includes("UnsupportedChain"),async safeClose(){this.isUnsupportedChainView()||await u.U.isSIWXCloseDisabled()?s.W.shake():(("DataCapture"===h.I.state.view||"DataCaptureOtpConfirm"===h.I.state.view)&&p.x.disconnect(),s.W.close())}};var w=o(90889),g=o(82570),b=o(86847),y=o(44458),f=o(54684),v=o(51127),x=o(41608);let k=(0,x.AH)`
  :host {
    display: block;
    border-radius: clamp(0px, ${({borderRadius:e})=>e["8"]}, 44px);
    box-shadow: 0 0 0 1px ${({tokens:e})=>e.theme.foregroundPrimary};
    overflow: hidden;
  }
`,$=class extends i.WF{render(){return(0,i.qy)`<slot></slot>`}};$.styles=[f.W5,k],$=function(e,t,o,i){var r,a=arguments.length,n=a<3?t:null===i?i=Object.getOwnPropertyDescriptor(t,o):i;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)n=Reflect.decorate(e,t,o,i);else for(var s=e.length-1;s>=0;s--)(r=e[s])&&(n=(a<3?r(n):a>3?r(t,o,n):r(t,o))||n);return a>3&&n&&Object.defineProperty(t,o,n),n}([(0,v.E)("wui-card")],$),o(85479);var C=o(91986);o(13496),o(53059),o(18341);let S=(0,x.AH)`
  :host {
    width: 100%;
  }

  :host > wui-flex {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: ${({spacing:e})=>e[2]};
    padding: ${({spacing:e})=>e[3]};
    border-radius: ${({borderRadius:e})=>e[6]};
    border: 1px solid ${({tokens:e})=>e.theme.borderPrimary};
    box-sizing: border-box;
    background-color: ${({tokens:e})=>e.theme.foregroundPrimary};
    box-shadow: 0px 0px 16px 0px rgba(0, 0, 0, 0.25);
    color: ${({tokens:e})=>e.theme.textPrimary};
  }

  :host > wui-flex[data-type='info'] {
    .icon-box {
      background-color: ${({tokens:e})=>e.theme.foregroundSecondary};

      wui-icon {
        color: ${({tokens:e})=>e.theme.iconDefault};
      }
    }
  }
  :host > wui-flex[data-type='success'] {
    .icon-box {
      background-color: ${({tokens:e})=>e.core.backgroundSuccess};

      wui-icon {
        color: ${({tokens:e})=>e.core.borderSuccess};
      }
    }
  }
  :host > wui-flex[data-type='warning'] {
    .icon-box {
      background-color: ${({tokens:e})=>e.core.backgroundWarning};

      wui-icon {
        color: ${({tokens:e})=>e.core.borderWarning};
      }
    }
  }
  :host > wui-flex[data-type='error'] {
    .icon-box {
      background-color: ${({tokens:e})=>e.core.backgroundError};

      wui-icon {
        color: ${({tokens:e})=>e.core.borderError};
      }
    }
  }

  wui-flex {
    width: 100%;
  }

  wui-text {
    word-break: break-word;
    flex: 1;
  }

  .close {
    cursor: pointer;
    color: ${({tokens:e})=>e.theme.iconDefault};
  }

  .icon-box {
    height: 40px;
    width: 40px;
    border-radius: ${({borderRadius:e})=>e["2"]};
    background-color: var(--local-icon-bg-value);
  }
`;var W=function(e,t,o,i){var r,a=arguments.length,n=a<3?t:null===i?i=Object.getOwnPropertyDescriptor(t,o):i;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)n=Reflect.decorate(e,t,o,i);else for(var s=e.length-1;s>=0;s--)(r=e[s])&&(n=(a<3?r(n):a>3?r(t,o,n):r(t,o))||n);return a>3&&n&&Object.defineProperty(t,o,n),n};let I={info:"info",success:"checkmark",warning:"warningCircle",error:"warning"},P=class extends i.WF{constructor(){super(...arguments),this.message="",this.type="info"}render(){return(0,i.qy)`
      <wui-flex
        data-type=${(0,a.J)(this.type)}
        flexDirection="row"
        justifyContent="space-between"
        alignItems="center"
        gap="2"
      >
        <wui-flex columnGap="2" flexDirection="row" alignItems="center">
          <wui-flex
            flexDirection="row"
            alignItems="center"
            justifyContent="center"
            class="icon-box"
          >
            <wui-icon color="inherit" size="md" name=${I[this.type]}></wui-icon>
          </wui-flex>
          <wui-text variant="md-medium" color="inherit" data-testid="wui-alertbar-text"
            >${this.message}</wui-text
          >
        </wui-flex>
        <wui-icon
          class="close"
          color="inherit"
          size="sm"
          name="close"
          @click=${this.onClose}
        ></wui-icon>
      </wui-flex>
    `}onClose(){C.h.close()}};P.styles=[f.W5,S],W([(0,r.MZ)()],P.prototype,"message",void 0),W([(0,r.MZ)()],P.prototype,"type",void 0),P=W([(0,v.E)("wui-alertbar")],P);let A=(0,y.AH)`
  :host {
    display: block;
    position: absolute;
    top: ${({spacing:e})=>e["3"]};
    left: ${({spacing:e})=>e["4"]};
    right: ${({spacing:e})=>e["4"]};
    opacity: 0;
    pointer-events: none;
  }
`;var E=function(e,t,o,i){var r,a=arguments.length,n=a<3?t:null===i?i=Object.getOwnPropertyDescriptor(t,o):i;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)n=Reflect.decorate(e,t,o,i);else for(var s=e.length-1;s>=0;s--)(r=e[s])&&(n=(a<3?r(n):a>3?r(t,o,n):r(t,o))||n);return a>3&&n&&Object.defineProperty(t,o,n),n};let R={info:{backgroundColor:"fg-350",iconColor:"fg-325",icon:"info"},success:{backgroundColor:"success-glass-reown-020",iconColor:"success-125",icon:"checkmark"},warning:{backgroundColor:"warning-glass-reown-020",iconColor:"warning-100",icon:"warningCircle"},error:{backgroundColor:"error-glass-reown-020",iconColor:"error-125",icon:"warning"}},O=class extends i.WF{constructor(){super(),this.unsubscribe=[],this.open=C.h.state.open,this.onOpen(!0),this.unsubscribe.push(C.h.subscribeKey("open",e=>{this.open=e,this.onOpen(!1)}))}disconnectedCallback(){this.unsubscribe.forEach(e=>e())}render(){let{message:e,variant:t}=C.h.state,o=R[t];return(0,i.qy)`
      <wui-alertbar
        message=${e}
        backgroundColor=${o?.backgroundColor}
        iconColor=${o?.iconColor}
        icon=${o?.icon}
        type=${t}
      ></wui-alertbar>
    `}onOpen(e){this.open?(this.animate([{opacity:0,transform:"scale(0.85)"},{opacity:1,transform:"scale(1)"}],{duration:150,fill:"forwards",easing:"ease"}),this.style.cssText="pointer-events: auto"):e||(this.animate([{opacity:1,transform:"scale(1)"},{opacity:0,transform:"scale(0.85)"}],{duration:150,fill:"forwards",easing:"ease"}),this.style.cssText="pointer-events: none")}};O.styles=A,E([(0,r.wk)()],O.prototype,"open",void 0),O=E([(0,y.EM)("w3m-alertbar")],O);var N=o(11464),z=o(96320),D=o(24101);o(71377),o(56349);let T=(0,x.AH)`
  button {
    display: block;
    display: flex;
    align-items: center;
    padding: ${({spacing:e})=>e[1]};
    transition: background-color ${({durations:e})=>e.lg}
      ${({easings:e})=>e["ease-out-power-2"]};
    will-change: background-color;
    border-radius: ${({borderRadius:e})=>e[32]};
  }

  wui-image {
    border-radius: 100%;
  }

  wui-text {
    padding-left: ${({spacing:e})=>e[1]};
  }

  .left-icon-container,
  .right-icon-container {
    width: 24px;
    height: 24px;
    justify-content: center;
    align-items: center;
  }

  wui-icon {
    color: ${({tokens:e})=>e.theme.iconDefault};
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

  button[data-size='lg'] wui-image {
    width: 24px;
    height: 24px;
  }

  button[data-size='md'] wui-image {
    width: 20px;
    height: 20px;
  }

  button[data-size='sm'] wui-image {
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

  /* -- Variants --------------------------------------------------------- */
  button[data-type='filled-dropdown'] {
    background-color: ${({tokens:e})=>e.theme.foregroundPrimary};
  }

  button[data-type='text-dropdown'] {
    background-color: transparent;
  }

  /* -- Focus states --------------------------------------------------- */
  button:focus-visible:enabled {
    background-color: ${({tokens:e})=>e.theme.foregroundSecondary};
    box-shadow: 0 0 0 4px ${({tokens:e})=>e.core.foregroundAccent040};
  }

  /* -- Hover & Active states ----------------------------------------------------------- */
  @media (hover: hover) and (pointer: fine) {
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
`;var M=function(e,t,o,i){var r,a=arguments.length,n=a<3?t:null===i?i=Object.getOwnPropertyDescriptor(t,o):i;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)n=Reflect.decorate(e,t,o,i);else for(var s=e.length-1;s>=0;s--)(r=e[s])&&(n=(a<3?r(n):a>3?r(t,o,n):r(t,o))||n);return a>3&&n&&Object.defineProperty(t,o,n),n};let H={lg:"lg-regular",md:"md-regular",sm:"sm-regular"},j={lg:"lg",md:"md",sm:"sm"},F=class extends i.WF{constructor(){super(...arguments),this.imageSrc="",this.text="",this.size="lg",this.type="text-dropdown",this.disabled=!1}render(){return(0,i.qy)`<button ?disabled=${this.disabled} data-size=${this.size} data-type=${this.type}>
      ${this.imageTemplate()} ${this.textTemplate()}
      <wui-flex class="right-icon-container">
        <wui-icon name="chevronBottom"></wui-icon>
      </wui-flex>
    </button>`}textTemplate(){let e=H[this.size];return this.text?(0,i.qy)`<wui-text color="primary" variant=${e}>${this.text}</wui-text>`:null}imageTemplate(){if(this.imageSrc)return(0,i.qy)`<wui-image src=${this.imageSrc} alt="select visual"></wui-image>`;let e=j[this.size];return(0,i.qy)` <wui-flex class="left-icon-container">
      <wui-icon size=${e} name="networkPlaceholder"></wui-icon>
    </wui-flex>`}};F.styles=[f.W5,f.fD,T],M([(0,r.MZ)()],F.prototype,"imageSrc",void 0),M([(0,r.MZ)()],F.prototype,"text",void 0),M([(0,r.MZ)()],F.prototype,"size",void 0),M([(0,r.MZ)()],F.prototype,"type",void 0),M([(0,r.MZ)({type:Boolean})],F.prototype,"disabled",void 0),F=M([(0,v.E)("wui-select")],F),o(99084),o(60347);var B=o(22483),L=o(94351);let q=(0,y.AH)`
  wui-image {
    border-radius: ${({borderRadius:e})=>e.round};
  }

  .transfers-badge {
    background-color: ${({tokens:e})=>e.theme.foregroundPrimary};
    border: 1px solid ${({tokens:e})=>e.theme.foregroundSecondary};
    border-radius: ${({borderRadius:e})=>e[4]};
  }
`;var Z=function(e,t,o,i){var r,a=arguments.length,n=a<3?t:null===i?i=Object.getOwnPropertyDescriptor(t,o):i;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)n=Reflect.decorate(e,t,o,i);else for(var s=e.length-1;s>=0;s--)(r=e[s])&&(n=(a<3?r(n):a>3?r(t,o,n):r(t,o))||n);return a>3&&n&&Object.defineProperty(t,o,n),n};let V=class extends i.WF{constructor(){super(),this.unsubscribe=[],this.paymentAsset=L.PayController.state.paymentAsset,this.amount=L.PayController.state.amount,this.unsubscribe.push(L.PayController.subscribeKey("paymentAsset",e=>{this.paymentAsset=e}),L.PayController.subscribeKey("amount",e=>{this.amount=e}))}disconnectedCallback(){this.unsubscribe.forEach(e=>e())}render(){let e=l.W.getAllRequestedCaipNetworks().find(e=>e.caipNetworkId===this.paymentAsset.network);return(0,i.qy)`<wui-flex
      alignItems="center"
      gap="1"
      .padding=${["1","2","1","1"]}
      class="transfers-badge"
    >
      <wui-image src=${(0,a.J)(this.paymentAsset.metadata.logoURI)} size="xl"></wui-image>
      <wui-text variant="lg-regular" color="primary">
        ${this.amount} ${this.paymentAsset.metadata.symbol}
      </wui-text>
      <wui-text variant="sm-regular" color="secondary">
        on ${e?.name??"Unknown"}
      </wui-text>
    </wui-flex>`}};V.styles=[q],Z([(0,r.MZ)()],V.prototype,"paymentAsset",void 0),Z([(0,r.MZ)()],V.prototype,"amount",void 0),V=Z([(0,y.EM)("w3m-pay-header")],V);let U=(0,y.AH)`
  :host {
    height: 60px;
  }

  :host > wui-flex {
    box-sizing: border-box;
    background-color: var(--local-header-background-color);
  }

  wui-text {
    background-color: var(--local-header-background-color);
  }

  wui-flex.w3m-header-title {
    transform: translateY(0);
    opacity: 1;
  }

  wui-flex.w3m-header-title[view-direction='prev'] {
    animation:
      slide-down-out 120ms forwards ${({easings:e})=>e["ease-out-power-2"]},
      slide-down-in 120ms forwards ${({easings:e})=>e["ease-out-power-2"]};
    animation-delay: 0ms, 200ms;
  }

  wui-flex.w3m-header-title[view-direction='next'] {
    animation:
      slide-up-out 120ms forwards ${({easings:e})=>e["ease-out-power-2"]},
      slide-up-in 120ms forwards ${({easings:e})=>e["ease-out-power-2"]};
    animation-delay: 0ms, 200ms;
  }

  wui-icon-button[data-hidden='true'] {
    opacity: 0 !important;
    pointer-events: none;
  }

  @keyframes slide-up-out {
    from {
      transform: translateY(0px);
      opacity: 1;
    }
    to {
      transform: translateY(3px);
      opacity: 0;
    }
  }

  @keyframes slide-up-in {
    from {
      transform: translateY(-3px);
      opacity: 0;
    }
    to {
      transform: translateY(0);
      opacity: 1;
    }
  }

  @keyframes slide-down-out {
    from {
      transform: translateY(0px);
      opacity: 1;
    }
    to {
      transform: translateY(-3px);
      opacity: 0;
    }
  }

  @keyframes slide-down-in {
    from {
      transform: translateY(3px);
      opacity: 0;
    }
    to {
      transform: translateY(0);
      opacity: 1;
    }
  }
`;var K=function(e,t,o,i){var r,a=arguments.length,n=a<3?t:null===i?i=Object.getOwnPropertyDescriptor(t,o):i;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)n=Reflect.decorate(e,t,o,i);else for(var s=e.length-1;s>=0;s--)(r=e[s])&&(n=(a<3?r(n):a>3?r(t,o,n):r(t,o))||n);return a>3&&n&&Object.defineProperty(t,o,n),n};let Y=["SmartSessionList"],X={PayWithExchange:y.f.tokens.theme.foregroundPrimary};function J(){let e=h.I.state.data?.connector?.name,t=h.I.state.data?.wallet?.name,o=h.I.state.data?.network?.name,i=t??e,r=c.a.getConnectors(),a=1===r.length&&r[0]?.id==="w3m-email",n=l.W.getAccountData()?.socialProvider;return{Connect:`Connect ${a?"Email":""} Wallet`,Create:"Create Wallet",ChooseAccountName:void 0,Account:void 0,AccountSettings:void 0,AllWallets:"All Wallets",ApproveTransaction:"Approve Transaction",BuyInProgress:"Buy",UsageExceeded:"Usage Exceeded",ConnectingExternal:i??"Connect Wallet",ConnectingWalletConnect:i??"WalletConnect",ConnectingWalletConnectBasic:"WalletConnect",ConnectingSiwe:"Sign In",Convert:"Convert",ConvertSelectToken:"Select token",ConvertPreview:"Preview Convert",Downloads:i?`Get ${i}`:"Downloads",EmailLogin:"Email Login",EmailVerifyOtp:"Confirm Email",EmailVerifyDevice:"Register Device",GetWallet:"Get a Wallet",Networks:"Choose Network",OnRampProviders:"Choose Provider",OnRampActivity:"Activity",OnRampTokenSelect:"Select Token",OnRampFiatSelect:"Select Currency",Pay:"How you pay",ProfileWallets:"Wallets",SwitchNetwork:o??"Switch Network",Transactions:"Activity",UnsupportedChain:"Switch Network",UpgradeEmailWallet:"Upgrade Your Wallet",UpdateEmailWallet:"Edit Email",UpdateEmailPrimaryOtp:"Confirm Current Email",UpdateEmailSecondaryOtp:"Confirm New Email",WhatIsABuy:"What is Buy?",RegisterAccountName:"Choose Name",RegisterAccountNameSuccess:"",WalletReceive:"Receive",WalletCompatibleNetworks:"Compatible Networks",Swap:"Swap",SwapSelectToken:"Select Token",SwapPreview:"Preview Swap",WalletSend:"Send",WalletSendPreview:"Review Send",WalletSendSelectToken:"Select Token",WalletSendConfirmed:"Confirmed",WhatIsANetwork:"What is a network?",WhatIsAWallet:"What is a Wallet?",ConnectWallets:"Connect Wallet",ConnectSocials:"All Socials",ConnectingSocial:n?n.charAt(0).toUpperCase()+n.slice(1):"Connect Social",ConnectingMultiChain:"Select Chain",ConnectingFarcaster:"Farcaster",SwitchActiveChain:"Switch Chain",SmartSessionCreated:void 0,SmartSessionList:"Smart Sessions",SIWXSignMessage:"Sign In",PayLoading:"Processing payment...",PayQuote:"Payment Quote",DataCapture:"Profile",DataCaptureOtpConfirm:"Confirm Email",FundWallet:"Fund Wallet",PayWithExchange:"Deposit from Exchange",PayWithExchangeSelectAsset:"Select Asset",SmartAccountSettings:"Smart Account Settings"}}let _=class extends i.WF{constructor(){super(),this.unsubscribe=[],this.heading=J()[h.I.state.view],this.network=l.W.state.activeCaipNetwork,this.networkImage=N.$.getNetworkImage(this.network),this.showBack=!1,this.prevHistoryLength=1,this.view=h.I.state.view,this.viewDirection="",this.unsubscribe.push(z.j.subscribeNetworkImages(()=>{this.networkImage=N.$.getNetworkImage(this.network)}),h.I.subscribeKey("view",e=>{setTimeout(()=>{this.view=e,this.heading=J()[e]},B.o.ANIMATION_DURATIONS.HeaderText),this.onViewChange(),this.onHistoryChange()}),l.W.subscribeKey("activeCaipNetwork",e=>{this.network=e,this.networkImage=N.$.getNetworkImage(this.network)}))}disconnectCallback(){this.unsubscribe.forEach(e=>e())}render(){let e=X[h.I.state.view]??y.f.tokens.theme.backgroundPrimary;return this.style.setProperty("--local-header-background-color",e),(0,i.qy)`
      <wui-flex
        .padding=${["0","4","0","4"]}
        justifyContent="space-between"
        alignItems="center"
      >
        ${this.leftHeaderTemplate()} ${this.titleTemplate()} ${this.rightHeaderTemplate()}
      </wui-flex>
    `}onWalletHelp(){D.E.sendEvent({type:"track",event:"CLICK_WALLET_HELP"}),h.I.push("WhatIsAWallet")}async onClose(){await m.safeClose()}rightHeaderTemplate(){let e=n.H?.state?.features?.smartSessions;return"Account"===h.I.state.view&&e?(0,i.qy)`<wui-flex>
      <wui-icon-button
        icon="clock"
        size="lg"
        iconSize="lg"
        type="neutral"
        variant="primary"
        @click=${()=>h.I.push("SmartSessionList")}
        data-testid="w3m-header-smart-sessions"
      ></wui-icon-button>
      ${this.closeButtonTemplate()}
    </wui-flex> `:this.closeButtonTemplate()}closeButtonTemplate(){return(0,i.qy)`
      <wui-icon-button
        icon="close"
        size="lg"
        type="neutral"
        variant="primary"
        iconSize="lg"
        @click=${this.onClose.bind(this)}
        data-testid="w3m-header-close"
      ></wui-icon-button>
    `}titleTemplate(){if("PayQuote"===this.view)return(0,i.qy)`<w3m-pay-header></w3m-pay-header>`;let e=Y.includes(this.view);return(0,i.qy)`
      <wui-flex
        view-direction="${this.viewDirection}"
        class="w3m-header-title"
        alignItems="center"
        gap="2"
      >
        <wui-text
          display="inline"
          variant="lg-regular"
          color="primary"
          data-testid="w3m-header-text"
        >
          ${this.heading}
        </wui-text>
        ${e?(0,i.qy)`<wui-tag variant="accent" size="md">Beta</wui-tag>`:null}
      </wui-flex>
    `}leftHeaderTemplate(){let{view:e}=h.I.state,t="Connect"===e,o=n.H.state.enableEmbedded,r=n.H.state.enableNetworkSwitch;return"Account"===e&&r?(0,i.qy)`<wui-select
        id="dynamic"
        data-testid="w3m-account-select-network"
        active-network=${(0,a.J)(this.network?.name)}
        @click=${this.onNetworks.bind(this)}
        imageSrc=${(0,a.J)(this.networkImage)}
      ></wui-select>`:this.showBack&&!("ApproveTransaction"===e||"ConnectingSiwe"===e||t&&o)?(0,i.qy)`<wui-icon-button
        data-testid="header-back"
        id="dynamic"
        icon="chevronLeft"
        size="lg"
        iconSize="lg"
        type="neutral"
        variant="primary"
        @click=${this.onGoBack.bind(this)}
      ></wui-icon-button>`:(0,i.qy)`<wui-icon-button
      data-hidden=${!t}
      id="dynamic"
      icon="helpCircle"
      size="lg"
      iconSize="lg"
      type="neutral"
      variant="primary"
      @click=${this.onWalletHelp.bind(this)}
    ></wui-icon-button>`}onNetworks(){this.isAllowedNetworkSwitch()&&(D.E.sendEvent({type:"track",event:"CLICK_NETWORKS"}),h.I.push("Networks"))}isAllowedNetworkSwitch(){let e=l.W.getAllRequestedCaipNetworks(),t=!!e&&e.length>1,o=e?.find(({id:e})=>e===this.network?.id);return t||!o}onViewChange(){let{history:e}=h.I.state,t=B.o.VIEW_DIRECTION.Next;e.length<this.prevHistoryLength&&(t=B.o.VIEW_DIRECTION.Prev),this.prevHistoryLength=e.length,this.viewDirection=t}async onHistoryChange(){let{history:e}=h.I.state,t=this.shadowRoot?.querySelector("#dynamic");e.length>1&&!this.showBack&&t?(await t.animate([{opacity:1},{opacity:0}],{duration:200,fill:"forwards",easing:"ease"}).finished,this.showBack=!0,t.animate([{opacity:0},{opacity:1}],{duration:200,fill:"forwards",easing:"ease"})):e.length<=1&&this.showBack&&t&&(await t.animate([{opacity:1},{opacity:0}],{duration:200,fill:"forwards",easing:"ease"}).finished,this.showBack=!1,t.animate([{opacity:0},{opacity:1}],{duration:200,fill:"forwards",easing:"ease"}))}onGoBack(){h.I.goBack()}};_.styles=U,K([(0,r.wk)()],_.prototype,"heading",void 0),K([(0,r.wk)()],_.prototype,"network",void 0),K([(0,r.wk)()],_.prototype,"networkImage",void 0),K([(0,r.wk)()],_.prototype,"showBack",void 0),K([(0,r.wk)()],_.prototype,"prevHistoryLength",void 0),K([(0,r.wk)()],_.prototype,"view",void 0),K([(0,r.wk)()],_.prototype,"viewDirection",void 0),_=K([(0,y.EM)("w3m-header")],_),o(57074),o(49145);let G=(0,x.AH)`
  :host {
    display: flex;
    align-items: center;
    gap: ${({spacing:e})=>e[1]};
    padding: ${({spacing:e})=>e[2]} ${({spacing:e})=>e[3]}
      ${({spacing:e})=>e[2]} ${({spacing:e})=>e[2]};
    border-radius: ${({borderRadius:e})=>e[20]};
    background-color: ${({tokens:e})=>e.theme.foregroundPrimary};
    box-shadow:
      0px 0px 8px 0px rgba(0, 0, 0, 0.1),
      inset 0 0 0 1px ${({tokens:e})=>e.theme.borderPrimary};
    max-width: 320px;
  }

  wui-icon-box {
    border-radius: ${({borderRadius:e})=>e.round} !important;
    overflow: hidden;
  }

  wui-loading-spinner {
    padding: ${({spacing:e})=>e[1]};
    background-color: ${({tokens:e})=>e.core.foregroundAccent010};
    border-radius: ${({borderRadius:e})=>e.round} !important;
  }
`;var Q=function(e,t,o,i){var r,a=arguments.length,n=a<3?t:null===i?i=Object.getOwnPropertyDescriptor(t,o):i;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)n=Reflect.decorate(e,t,o,i);else for(var s=e.length-1;s>=0;s--)(r=e[s])&&(n=(a<3?r(n):a>3?r(t,o,n):r(t,o))||n);return a>3&&n&&Object.defineProperty(t,o,n),n};let ee=class extends i.WF{constructor(){super(...arguments),this.message="",this.variant="success"}render(){return(0,i.qy)`
      ${this.templateIcon()}
      <wui-text variant="lg-regular" color="primary" data-testid="wui-snackbar-message"
        >${this.message}</wui-text
      >
    `}templateIcon(){return"loading"===this.variant?(0,i.qy)`<wui-loading-spinner size="md" color="accent-primary"></wui-loading-spinner>`:(0,i.qy)`<wui-icon-box
      size="md"
      color=${({success:"success",error:"error",warning:"warning",info:"default"})[this.variant]}
      icon=${({success:"checkmark",error:"warning",warning:"warningCircle",info:"info"})[this.variant]}
    ></wui-icon-box>`}};ee.styles=[f.W5,G],Q([(0,r.MZ)()],ee.prototype,"message",void 0),Q([(0,r.MZ)()],ee.prototype,"variant",void 0),ee=Q([(0,v.E)("wui-snackbar")],ee);let et=(0,i.AH)`
  :host {
    display: block;
    position: absolute;
    opacity: 0;
    pointer-events: none;
    top: 11px;
    left: 50%;
    width: max-content;
  }
`;var eo=function(e,t,o,i){var r,a=arguments.length,n=a<3?t:null===i?i=Object.getOwnPropertyDescriptor(t,o):i;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)n=Reflect.decorate(e,t,o,i);else for(var s=e.length-1;s>=0;s--)(r=e[s])&&(n=(a<3?r(n):a>3?r(t,o,n):r(t,o))||n);return a>3&&n&&Object.defineProperty(t,o,n),n};let ei=class extends i.WF{constructor(){super(),this.unsubscribe=[],this.timeout=void 0,this.open=g.P.state.open,this.unsubscribe.push(g.P.subscribeKey("open",e=>{this.open=e,this.onOpen()}))}disconnectedCallback(){clearTimeout(this.timeout),this.unsubscribe.forEach(e=>e())}render(){let{message:e,variant:t}=g.P.state;return(0,i.qy)` <wui-snackbar message=${e} variant=${t}></wui-snackbar> `}onOpen(){clearTimeout(this.timeout),this.open?(this.animate([{opacity:0,transform:"translateX(-50%) scale(0.85)"},{opacity:1,transform:"translateX(-50%) scale(1)"}],{duration:150,fill:"forwards",easing:"ease"}),this.timeout&&clearTimeout(this.timeout),g.P.state.autoClose&&(this.timeout=setTimeout(()=>g.P.hide(),2500))):this.animate([{opacity:1,transform:"translateX(-50%) scale(1)"},{opacity:0,transform:"translateX(-50%) scale(0.85)"}],{duration:150,fill:"forwards",easing:"ease"})}};ei.styles=et,eo([(0,r.wk)()],ei.prototype,"open",void 0),ei=eo([(0,y.EM)("w3m-snackbar")],ei),o(79367),o(77416);var er=o(91135);o(47525),o(2139);let ea=(0,y.AH)`
  :host {
    z-index: ${({tokens:e})=>e.core.zIndex};
    display: block;
    backface-visibility: hidden;
    will-change: opacity;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    pointer-events: none;
    opacity: 0;
    background-color: ${({tokens:e})=>e.theme.overlay};
    backdrop-filter: blur(0px);
    transition:
      opacity ${({durations:e})=>e.lg} ${({easings:e})=>e["ease-out-power-2"]},
      backdrop-filter ${({durations:e})=>e.lg}
        ${({easings:e})=>e["ease-out-power-2"]};
    will-change: opacity;
  }

  :host(.open) {
    opacity: 1;
    backdrop-filter: blur(8px);
  }

  :host(.appkit-modal) {
    position: relative;
    pointer-events: unset;
    background: none;
    width: 100%;
    opacity: 1;
  }

  wui-card {
    max-width: var(--apkt-modal-width);
    width: 100%;
    position: relative;
    outline: none;
    transform: translateY(4px);
    box-shadow: 0 2px 8px 0 rgba(0, 0, 0, 0.05);
    transition:
      transform ${({durations:e})=>e.lg}
        ${({easings:e})=>e["ease-out-power-2"]},
      border-radius ${({durations:e})=>e.lg}
        ${({easings:e})=>e["ease-out-power-1"]},
      background-color ${({durations:e})=>e.lg}
        ${({easings:e})=>e["ease-out-power-1"]},
      box-shadow ${({durations:e})=>e.lg}
        ${({easings:e})=>e["ease-out-power-1"]};
    will-change: border-radius, background-color, transform, box-shadow;
    background-color: ${({tokens:e})=>e.theme.backgroundPrimary};
    padding: var(--local-modal-padding);
    box-sizing: border-box;
  }

  :host(.open) wui-card {
    transform: translateY(0px);
  }

  wui-card::before {
    z-index: 1;
    pointer-events: none;
    content: '';
    position: absolute;
    inset: 0;
    border-radius: clamp(0px, var(--apkt-borderRadius-8), 44px);
    transition: box-shadow ${({durations:e})=>e.lg}
      ${({easings:e})=>e["ease-out-power-2"]};
    transition-delay: ${({durations:e})=>e.md};
    will-change: box-shadow;
  }

  :host([data-mobile-fullscreen='true']) wui-card::before {
    border-radius: 0px;
  }

  :host([data-border='true']) wui-card::before {
    box-shadow: inset 0px 0px 0px 4px ${({tokens:e})=>e.theme.foregroundSecondary};
  }

  :host([data-border='false']) wui-card::before {
    box-shadow: inset 0px 0px 0px 1px ${({tokens:e})=>e.theme.borderPrimaryDark};
  }

  :host([data-border='true']) wui-card {
    animation:
      fade-in ${({durations:e})=>e.lg} ${({easings:e})=>e["ease-out-power-2"]},
      card-background-border var(--apkt-duration-dynamic)
        ${({easings:e})=>e["ease-out-power-2"]};
    animation-fill-mode: backwards, both;
    animation-delay: var(--apkt-duration-dynamic);
  }

  :host([data-border='false']) wui-card {
    animation:
      fade-in ${({durations:e})=>e.lg} ${({easings:e})=>e["ease-out-power-2"]},
      card-background-default var(--apkt-duration-dynamic)
        ${({easings:e})=>e["ease-out-power-2"]};
    animation-fill-mode: backwards, both;
    animation-delay: 0s;
  }

  :host(.appkit-modal) wui-card {
    max-width: var(--apkt-modal-width);
  }

  wui-card[shake='true'] {
    animation:
      fade-in ${({durations:e})=>e.lg} ${({easings:e})=>e["ease-out-power-2"]},
      w3m-shake ${({durations:e})=>e.xl}
        ${({easings:e})=>e["ease-out-power-2"]};
  }

  wui-flex {
    overflow-x: hidden;
    overflow-y: auto;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
  }

  @media (max-height: 700px) and (min-width: 431px) {
    wui-flex {
      align-items: flex-start;
    }

    wui-card {
      margin: var(--apkt-spacing-6) 0px;
    }
  }

  @media (max-width: 430px) {
    :host([data-mobile-fullscreen='true']) {
      height: 100dvh;
    }
    :host([data-mobile-fullscreen='true']) wui-flex {
      align-items: stretch;
    }
    :host([data-mobile-fullscreen='true']) wui-card {
      max-width: 100%;
      height: 100%;
      border-radius: 0;
      border: none;
    }
    :host(:not([data-mobile-fullscreen='true'])) wui-flex {
      align-items: flex-end;
    }

    :host(:not([data-mobile-fullscreen='true'])) wui-card {
      max-width: 100%;
      border-bottom: none;
    }

    :host(:not([data-mobile-fullscreen='true'])) wui-card[data-embedded='true'] {
      border-bottom-left-radius: clamp(0px, var(--apkt-borderRadius-8), 44px);
      border-bottom-right-radius: clamp(0px, var(--apkt-borderRadius-8), 44px);
    }

    :host(:not([data-mobile-fullscreen='true'])) wui-card:not([data-embedded='true']) {
      border-bottom-left-radius: 0px;
      border-bottom-right-radius: 0px;
    }

    wui-card[shake='true'] {
      animation: w3m-shake 0.5s ${({easings:e})=>e["ease-out-power-2"]};
    }
  }

  @keyframes fade-in {
    0% {
      transform: scale(0.99) translateY(4px);
    }
    100% {
      transform: scale(1) translateY(0);
    }
  }

  @keyframes w3m-shake {
    0% {
      transform: scale(1) rotate(0deg);
    }
    20% {
      transform: scale(1) rotate(-1deg);
    }
    40% {
      transform: scale(1) rotate(1.5deg);
    }
    60% {
      transform: scale(1) rotate(-1.5deg);
    }
    80% {
      transform: scale(1) rotate(1deg);
    }
    100% {
      transform: scale(1) rotate(0deg);
    }
  }

  @keyframes card-background-border {
    from {
      background-color: ${({tokens:e})=>e.theme.backgroundPrimary};
    }
    to {
      background-color: ${({tokens:e})=>e.theme.foregroundSecondary};
    }
  }

  @keyframes card-background-default {
    from {
      background-color: ${({tokens:e})=>e.theme.foregroundSecondary};
    }
    to {
      background-color: ${({tokens:e})=>e.theme.backgroundPrimary};
    }
  }
`;var en=function(e,t,o,i){var r,a=arguments.length,n=a<3?t:null===i?i=Object.getOwnPropertyDescriptor(t,o):i;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)n=Reflect.decorate(e,t,o,i);else for(var s=e.length-1;s>=0;s--)(r=e[s])&&(n=(a<3?r(n):a>3?r(t,o,n):r(t,o))||n);return a>3&&n&&Object.defineProperty(t,o,n),n};let es="scroll-lock",el={PayWithExchange:"0",PayWithExchangeSelectAsset:"0",Pay:"0",PayQuote:"0",PayLoading:"0"};class ec extends i.WF{constructor(){super(),this.unsubscribe=[],this.abortController=void 0,this.hasPrefetched=!1,this.enableEmbedded=n.H.state.enableEmbedded,this.open=s.W.state.open,this.caipAddress=l.W.state.activeCaipAddress,this.caipNetwork=l.W.state.activeCaipNetwork,this.shake=s.W.state.shake,this.filterByNamespace=c.a.state.filterByNamespace,this.padding=y.f.spacing[1],this.mobileFullScreen=n.H.state.enableMobileFullScreen,this.initializeTheming(),d.N.prefetchAnalyticsConfig(),this.unsubscribe.push(s.W.subscribeKey("open",e=>e?this.onOpen():this.onClose()),s.W.subscribeKey("shake",e=>this.shake=e),l.W.subscribeKey("activeCaipNetwork",e=>this.onNewNetwork(e)),l.W.subscribeKey("activeCaipAddress",e=>this.onNewAddress(e)),n.H.subscribeKey("enableEmbedded",e=>this.enableEmbedded=e),c.a.subscribeKey("filterByNamespace",e=>{this.filterByNamespace===e||l.W.getAccountData(e)?.caipAddress||(d.N.fetchRecommendedWallets(),this.filterByNamespace=e)}),h.I.subscribeKey("view",()=>{this.dataset.border=er.y.hasFooter()?"true":"false",this.padding=el[h.I.state.view]??y.f.spacing[1]}))}firstUpdated(){if(this.dataset.border=er.y.hasFooter()?"true":"false",this.mobileFullScreen&&this.setAttribute("data-mobile-fullscreen","true"),this.caipAddress){if(this.enableEmbedded){s.W.close(),this.prefetch();return}this.onNewAddress(this.caipAddress)}this.open&&this.onOpen(),this.enableEmbedded&&this.prefetch()}disconnectedCallback(){this.unsubscribe.forEach(e=>e()),this.onRemoveKeyboardListener()}render(){return(this.style.setProperty("--local-modal-padding",this.padding),this.enableEmbedded)?(0,i.qy)`${this.contentTemplate()}
        <w3m-tooltip></w3m-tooltip> `:this.open?(0,i.qy)`
          <wui-flex @click=${this.onOverlayClick.bind(this)} data-testid="w3m-modal-overlay">
            ${this.contentTemplate()}
          </wui-flex>
          <w3m-tooltip></w3m-tooltip>
        `:null}contentTemplate(){return(0,i.qy)` <wui-card
      shake="${this.shake}"
      data-embedded="${(0,a.J)(this.enableEmbedded)}"
      role="alertdialog"
      aria-modal="true"
      tabindex="0"
      data-testid="w3m-modal-card"
    >
      <w3m-header></w3m-header>
      <w3m-router></w3m-router>
      <w3m-footer></w3m-footer>
      <w3m-snackbar></w3m-snackbar>
      <w3m-alertbar></w3m-alertbar>
    </wui-card>`}async onOverlayClick(e){e.target===e.currentTarget&&(this.mobileFullScreen||await this.handleClose())}async handleClose(){await m.safeClose()}initializeTheming(){let{themeVariables:e,themeMode:t}=w.W.state,o=y.Zv.getColorTheme(t);(0,y.RF)(e,o)}onClose(){this.open=!1,this.classList.remove("open"),this.onScrollUnlock(),g.P.hide(),this.onRemoveKeyboardListener()}onOpen(){this.open=!0,this.classList.add("open"),this.onScrollLock(),this.onAddKeyboardListener()}onScrollLock(){let e=document.createElement("style");e.dataset.w3m=es,e.textContent=`
      body {
        touch-action: none;
        overflow: hidden;
        overscroll-behavior: contain;
      }
      w3m-modal {
        pointer-events: auto;
      }
    `,document.head.appendChild(e)}onScrollUnlock(){let e=document.head.querySelector(`style[data-w3m="${es}"]`);e&&e.remove()}onAddKeyboardListener(){this.abortController=new AbortController;let e=this.shadowRoot?.querySelector("wui-card");e?.focus(),window.addEventListener("keydown",t=>{if("Escape"===t.key)this.handleClose();else if("Tab"===t.key){let{tagName:o}=t.target;!o||o.includes("W3M-")||o.includes("WUI-")||e?.focus()}},this.abortController)}onRemoveKeyboardListener(){this.abortController?.abort(),this.abortController=void 0}async onNewAddress(e){let t=l.W.state.isSwitchingNamespace,o="ProfileWallets"===h.I.state.view;e||t||o||s.W.close(),await u.U.initializeIfEnabled(e),this.caipAddress=e,l.W.setIsSwitchingNamespace(!1)}onNewNetwork(e){let t=this.caipNetwork,o=t?.caipNetworkId?.toString(),i=e?.caipNetworkId?.toString(),r="UnsupportedChain"===h.I.state.view,a=s.W.state.open,n=!1;this.enableEmbedded&&"SwitchNetwork"===h.I.state.view&&(n=!0),o!==i&&b.GN.resetState(),a&&r&&(n=!0),n&&"SIWXSignMessage"!==h.I.state.view&&h.I.goBack(),this.caipNetwork=e}prefetch(){this.hasPrefetched||(d.N.prefetch(),d.N.fetchWalletsByPage({page:1}),this.hasPrefetched=!0)}}ec.styles=ea,en([(0,r.MZ)({type:Boolean})],ec.prototype,"enableEmbedded",void 0),en([(0,r.wk)()],ec.prototype,"open",void 0),en([(0,r.wk)()],ec.prototype,"caipAddress",void 0),en([(0,r.wk)()],ec.prototype,"caipNetwork",void 0),en([(0,r.wk)()],ec.prototype,"shake",void 0),en([(0,r.wk)()],ec.prototype,"filterByNamespace",void 0),en([(0,r.wk)()],ec.prototype,"padding",void 0),en([(0,r.wk)()],ec.prototype,"mobileFullScreen",void 0);let ed=class extends ec{};ed=en([(0,y.EM)("w3m-modal")],ed);let eh=class extends ec{};eh=en([(0,y.EM)("appkit-modal")],eh),o(34556),o(80729);let ep=(0,y.AH)`
  .icon-box {
    width: 64px;
    height: 64px;
    border-radius: ${({borderRadius:e})=>e[5]};
    background-color: ${({colors:e})=>e.semanticError010};
  }
`,eu=class extends i.WF{constructor(){super()}render(){return(0,i.qy)`
      <wui-flex
        flexDirection="column"
        alignItems="center"
        gap="4"
        .padding="${["1","3","4","3"]}"
      >
        <wui-flex justifyContent="center" alignItems="center" class="icon-box">
          <wui-icon size="xxl" color="error" name="warningCircle"></wui-icon>
        </wui-flex>

        <wui-text variant="lg-medium" color="primary" align="center">
          The app isn't responding as expected
        </wui-text>
        <wui-text variant="md-regular" color="secondary" align="center">
          Try again or reach out to the app team for help.
        </wui-text>

        <wui-button
          variant="neutral-secondary"
          size="md"
          @click=${this.onTryAgainClick.bind(this)}
          data-testid="w3m-usage-exceeded-button"
        >
          <wui-icon color="inherit" slot="iconLeft" name="refresh"></wui-icon>
          Try Again
        </wui-button>
      </wui-flex>
    `}onTryAgainClick(){h.I.goBack()}};eu.styles=ep,eu=function(e,t,o,i){var r,a=arguments.length,n=a<3?t:null===i?i=Object.getOwnPropertyDescriptor(t,o):i;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)n=Reflect.decorate(e,t,o,i);else for(var s=e.length-1;s>=0;s--)(r=e[s])&&(n=(a<3?r(n):a>3?r(t,o,n):r(t,o))||n);return a>3&&n&&Object.defineProperty(t,o,n),n}([(0,y.EM)("w3m-usage-exceeded-view")],eu);var em=o(76452);o(12026);let ew=(0,y.AH)`
  :host {
    width: 100%;
  }
`;var eg=function(e,t,o,i){var r,a=arguments.length,n=a<3?t:null===i?i=Object.getOwnPropertyDescriptor(t,o):i;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)n=Reflect.decorate(e,t,o,i);else for(var s=e.length-1;s>=0;s--)(r=e[s])&&(n=(a<3?r(n):a>3?r(t,o,n):r(t,o))||n);return a>3&&n&&Object.defineProperty(t,o,n),n};let eb=class extends i.WF{constructor(){super(...arguments),this.hasImpressionSent=!1,this.walletImages=[],this.imageSrc="",this.name="",this.size="md",this.tabIdx=void 0,this.disabled=!1,this.showAllWallets=!1,this.loading=!1,this.loadingSpinnerColor="accent-100",this.rdnsId="",this.displayIndex=void 0,this.walletRank=void 0,this.namespaces=[]}connectedCallback(){super.connectedCallback()}disconnectedCallback(){super.disconnectedCallback(),this.cleanupIntersectionObserver()}updated(e){super.updated(e),(e.has("name")||e.has("imageSrc")||e.has("walletRank"))&&(this.hasImpressionSent=!1),e.has("walletRank")&&this.walletRank&&!this.intersectionObserver&&this.setupIntersectionObserver()}setupIntersectionObserver(){this.intersectionObserver=new IntersectionObserver(e=>{e.forEach(e=>{!e.isIntersecting||this.loading||this.hasImpressionSent||this.sendImpressionEvent()})},{threshold:.1}),this.intersectionObserver.observe(this)}cleanupIntersectionObserver(){this.intersectionObserver&&(this.intersectionObserver.disconnect(),this.intersectionObserver=void 0)}sendImpressionEvent(){this.name&&!this.hasImpressionSent&&this.walletRank&&(this.hasImpressionSent=!0,(this.rdnsId||this.name)&&D.E.sendWalletImpressionEvent({name:this.name,walletRank:this.walletRank,rdnsId:this.rdnsId,view:h.I.state.view,displayIndex:this.displayIndex}))}handleGetWalletNamespaces(){return Object.keys(em.q.state.adapters).length>1?this.namespaces:[]}render(){return(0,i.qy)`
      <wui-list-wallet
        .walletImages=${this.walletImages}
        imageSrc=${(0,a.J)(this.imageSrc)}
        name=${this.name}
        size=${(0,a.J)(this.size)}
        tagLabel=${(0,a.J)(this.tagLabel)}
        .tagVariant=${this.tagVariant}
        .walletIcon=${this.walletIcon}
        .tabIdx=${this.tabIdx}
        .disabled=${this.disabled}
        .showAllWallets=${this.showAllWallets}
        .loading=${this.loading}
        loadingSpinnerColor=${this.loadingSpinnerColor}
        .namespaces=${this.handleGetWalletNamespaces()}
      ></wui-list-wallet>
    `}};eb.styles=ew,eg([(0,r.MZ)({type:Array})],eb.prototype,"walletImages",void 0),eg([(0,r.MZ)()],eb.prototype,"imageSrc",void 0),eg([(0,r.MZ)()],eb.prototype,"name",void 0),eg([(0,r.MZ)()],eb.prototype,"size",void 0),eg([(0,r.MZ)()],eb.prototype,"tagLabel",void 0),eg([(0,r.MZ)()],eb.prototype,"tagVariant",void 0),eg([(0,r.MZ)()],eb.prototype,"walletIcon",void 0),eg([(0,r.MZ)()],eb.prototype,"tabIdx",void 0),eg([(0,r.MZ)({type:Boolean})],eb.prototype,"disabled",void 0),eg([(0,r.MZ)({type:Boolean})],eb.prototype,"showAllWallets",void 0),eg([(0,r.MZ)({type:Boolean})],eb.prototype,"loading",void 0),eg([(0,r.MZ)({type:String})],eb.prototype,"loadingSpinnerColor",void 0),eg([(0,r.MZ)()],eb.prototype,"rdnsId",void 0),eg([(0,r.MZ)()],eb.prototype,"displayIndex",void 0),eg([(0,r.MZ)()],eb.prototype,"walletRank",void 0),eg([(0,r.MZ)({type:Array})],eb.prototype,"namespaces",void 0),eb=eg([(0,y.EM)("w3m-list-wallet")],eb);let ey=(0,y.AH)`
  :host {
    --local-duration-height: 0s;
    --local-duration: ${({durations:e})=>e.lg};
    --local-transition: ${({easings:e})=>e["ease-out-power-2"]};
  }

  .container {
    display: block;
    overflow: hidden;
    overflow: hidden;
    position: relative;
    height: var(--local-container-height);
    transition: height var(--local-duration-height) var(--local-transition);
    will-change: height, padding-bottom;
  }

  .container[data-mobile-fullscreen='true'] {
    overflow: scroll;
  }

  .page {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    width: 100%;
    height: auto;
    width: inherit;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    background-color: ${({tokens:e})=>e.theme.backgroundPrimary};
    border-bottom-left-radius: var(--local-border-bottom-radius);
    border-bottom-right-radius: var(--local-border-bottom-radius);
    transition: border-bottom-left-radius var(--local-duration) var(--local-transition);
  }

  .page[data-mobile-fullscreen='true'] {
    height: 100%;
  }

  .page-content {
    display: flex;
    flex-direction: column;
    min-height: 100%;
  }

  .footer {
    height: var(--apkt-footer-height);
  }

  div.page[view-direction^='prev-'] .page-content {
    animation:
      slide-left-out var(--local-duration) forwards var(--local-transition),
      slide-left-in var(--local-duration) forwards var(--local-transition);
    animation-delay: 0ms, var(--local-duration, ${({durations:e})=>e.lg});
  }

  div.page[view-direction^='next-'] .page-content {
    animation:
      slide-right-out var(--local-duration) forwards var(--local-transition),
      slide-right-in var(--local-duration) forwards var(--local-transition);
    animation-delay: 0ms, var(--local-duration, ${({durations:e})=>e.lg});
  }

  @keyframes slide-left-out {
    from {
      transform: translateX(0px) scale(1);
      opacity: 1;
      filter: blur(0px);
    }
    to {
      transform: translateX(8px) scale(0.99);
      opacity: 0;
      filter: blur(4px);
    }
  }

  @keyframes slide-left-in {
    from {
      transform: translateX(-8px) scale(0.99);
      opacity: 0;
      filter: blur(4px);
    }
    to {
      transform: translateX(0) translateY(0) scale(1);
      opacity: 1;
      filter: blur(0px);
    }
  }

  @keyframes slide-right-out {
    from {
      transform: translateX(0px) scale(1);
      opacity: 1;
      filter: blur(0px);
    }
    to {
      transform: translateX(-8px) scale(0.99);
      opacity: 0;
      filter: blur(4px);
    }
  }

  @keyframes slide-right-in {
    from {
      transform: translateX(8px) scale(0.99);
      opacity: 0;
      filter: blur(4px);
    }
    to {
      transform: translateX(0) translateY(0) scale(1);
      opacity: 1;
      filter: blur(0px);
    }
  }
`;var ef=function(e,t,o,i){var r,a=arguments.length,n=a<3?t:null===i?i=Object.getOwnPropertyDescriptor(t,o):i;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)n=Reflect.decorate(e,t,o,i);else for(var s=e.length-1;s>=0;s--)(r=e[s])&&(n=(a<3?r(n):a>3?r(t,o,n):r(t,o))||n);return a>3&&n&&Object.defineProperty(t,o,n),n};let ev=class extends i.WF{constructor(){super(...arguments),this.resizeObserver=void 0,this.transitionDuration="0.15s",this.transitionFunction="",this.history="",this.view="",this.setView=void 0,this.viewDirection="",this.historyState="",this.previousHeight="0px",this.mobileFullScreen=n.H.state.enableMobileFullScreen,this.onViewportResize=()=>{this.updateContainerHeight()}}updated(e){if(e.has("history")){let e=this.history;""!==this.historyState&&this.historyState!==e&&this.onViewChange(e)}e.has("transitionDuration")&&this.style.setProperty("--local-duration",this.transitionDuration),e.has("transitionFunction")&&this.style.setProperty("--local-transition",this.transitionFunction)}firstUpdated(){this.transitionFunction&&this.style.setProperty("--local-transition",this.transitionFunction),this.style.setProperty("--local-duration",this.transitionDuration),this.historyState=this.history,this.resizeObserver=new ResizeObserver(e=>{for(let t of e)if(t.target===this.getWrapper()){let e=t.contentRect.height,o=parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--apkt-footer-height")||"0");this.mobileFullScreen?(e=(window.visualViewport?.height||window.innerHeight)-this.getHeaderHeight()-o,this.style.setProperty("--local-border-bottom-radius","0px")):(e+=o,this.style.setProperty("--local-border-bottom-radius",o?"var(--apkt-borderRadius-5)":"0px")),this.style.setProperty("--local-container-height",`${e}px`),"0px"!==this.previousHeight&&this.style.setProperty("--local-duration-height",this.transitionDuration),this.previousHeight=`${e}px`}}),this.resizeObserver.observe(this.getWrapper()),this.updateContainerHeight(),window.addEventListener("resize",this.onViewportResize),window.visualViewport?.addEventListener("resize",this.onViewportResize)}disconnectedCallback(){let e=this.getWrapper();e&&this.resizeObserver&&this.resizeObserver.unobserve(e),window.removeEventListener("resize",this.onViewportResize),window.visualViewport?.removeEventListener("resize",this.onViewportResize)}render(){return(0,i.qy)`
      <div class="container" data-mobile-fullscreen="${(0,a.J)(this.mobileFullScreen)}">
        <div
          class="page"
          data-mobile-fullscreen="${(0,a.J)(this.mobileFullScreen)}"
          view-direction="${this.viewDirection}"
        >
          <div class="page-content">
            <slot></slot>
          </div>
        </div>
      </div>
    `}onViewChange(e){let t=e.split(",").filter(Boolean),o=this.historyState.split(",").filter(Boolean),i=o.length,r=t.length,a=t[t.length-1]||"",n=y.Zv.cssDurationToNumber(this.transitionDuration),s="";r>i?s="next":r<i?s="prev":r===i&&t[r-1]!==o[i-1]&&(s="next"),queueMicrotask(()=>{this.viewDirection=`${s}-${a}`}),setTimeout(()=>{this.historyState=e,this.setView?.(a)},n),setTimeout(()=>{this.viewDirection=""},2*n)}getWrapper(){return this.shadowRoot?.querySelector("div.page")}updateContainerHeight(){let e=this.getWrapper();if(!e)return;let t=parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--apkt-footer-height")||"0"),o=0;this.mobileFullScreen?(o=(window.visualViewport?.height||window.innerHeight)-this.getHeaderHeight()-t,this.style.setProperty("--local-border-bottom-radius","0px")):(o=e.getBoundingClientRect().height+t,this.style.setProperty("--local-border-bottom-radius",t?"var(--apkt-borderRadius-5)":"0px")),this.style.setProperty("--local-container-height",`${o}px`),"0px"!==this.previousHeight&&this.style.setProperty("--local-duration-height",this.transitionDuration),this.previousHeight=`${o}px`}getHeaderHeight(){return 60}};ev.styles=[ey],ef([(0,r.MZ)({type:String})],ev.prototype,"transitionDuration",void 0),ef([(0,r.MZ)({type:String})],ev.prototype,"transitionFunction",void 0),ef([(0,r.MZ)({type:String})],ev.prototype,"history",void 0),ef([(0,r.MZ)({type:String})],ev.prototype,"view",void 0),ef([(0,r.MZ)({attribute:!1})],ev.prototype,"setView",void 0),ef([(0,r.wk)()],ev.prototype,"viewDirection",void 0),ef([(0,r.wk)()],ev.prototype,"historyState",void 0),ef([(0,r.wk)()],ev.prototype,"previousHeight",void 0),ef([(0,r.wk)()],ev.prototype,"mobileFullScreen",void 0),ev=ef([(0,y.EM)("w3m-router-container")],ev)}}]);