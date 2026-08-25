"use strict";(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[3026],{63026:function(e,t,r){r.r(t),r.d(t,{W3mWalletReceiveView:function(){return C}});var i=r(33834),o=r(80489),a=r(77513),n=r(59757),c=r(82879),s=r(44639),l=r(12858),d=r(18462),u=r(4511),w=r(83241),p=r(28740),h=r(34615),m=r(38895);r(98088),r(31059),r(85625),r(76630);var f=r(48113),g=r(25729),b=r(95636),k=b.iv`
  button {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: ${({spacing:e})=>e[4]};
    background-color: ${({tokens:e})=>e.theme.foregroundPrimary};
    border-radius: ${({borderRadius:e})=>e[3]};
    border: none;
    padding: ${({spacing:e})=>e[3]};
    transition: background-color ${({durations:e})=>e.lg}
      ${({easings:e})=>e["ease-out-power-2"]};
    will-change: background-color;
  }

  /* -- Hover & Active states ----------------------------------------------------------- */
  button:hover:enabled,
  button:active:enabled {
    background-color: ${({tokens:e})=>e.theme.foregroundSecondary};
  }

  wui-text {
    flex: 1;
    color: ${({tokens:e})=>e.theme.textSecondary};
  }

  wui-flex {
    width: auto;
    display: flex;
    align-items: center;
    gap: ${({spacing:e})=>e["01"]};
  }

  wui-icon {
    color: ${({tokens:e})=>e.theme.iconDefault};
  }

  .network-icon {
    position: relative;
    width: 20px;
    height: 20px;
    border-radius: ${({borderRadius:e})=>e[4]};
    overflow: hidden;
    margin-left: -8px;
  }

  .network-icon:first-child {
    margin-left: 0px;
  }

  .network-icon:after {
    position: absolute;
    inset: 0;
    content: '';
    display: block;
    height: 100%;
    width: 100%;
    border-radius: ${({borderRadius:e})=>e[4]};
    box-shadow: inset 0 0 0 1px ${({tokens:e})=>e.core.glass010};
  }
`,__decorate=function(e,t,r,i){var o,a=arguments.length,n=a<3?t:null===i?i=Object.getOwnPropertyDescriptor(t,r):i;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)n=Reflect.decorate(e,t,r,i);else for(var c=e.length-1;c>=0;c--)(o=e[c])&&(n=(a<3?o(n):a>3?o(t,r,n):o(t,r))||n);return a>3&&n&&Object.defineProperty(t,r,n),n};let v=class extends h.oi{constructor(){super(...arguments),this.networkImages=[""],this.text=""}render(){return h.dy`
      <button>
        <wui-text variant="md-regular" color="inherit">${this.text}</wui-text>
        <wui-flex>
          ${this.networksTemplate()}
          <wui-icon name="chevronRight" size="sm" color="inherit"></wui-icon>
        </wui-flex>
      </button>
    `}networksTemplate(){let e=this.networkImages.slice(0,5);return h.dy` <wui-flex class="networks">
      ${e?.map(e=>h.dy` <wui-flex class="network-icon"> <wui-image src=${e}></wui-image> </wui-flex>`)}
    </wui-flex>`}};v.styles=[f.ET,f.ZM,k],__decorate([(0,m.Cb)({type:Array})],v.prototype,"networkImages",void 0),__decorate([(0,m.Cb)()],v.prototype,"text",void 0),v=__decorate([(0,g.M)("wui-compatible-network")],v),r(82100),r(18370),r(68390);var y=r(22192),x=p.iv`
  wui-compatible-network {
    margin-top: ${({spacing:e})=>e["4"]};
    width: 100%;
  }

  wui-qr-code {
    width: unset !important;
    height: unset !important;
  }

  wui-icon {
    align-items: normal;
  }
`,w3m_wallet_receive_view_decorate=function(e,t,r,i){var o,a=arguments.length,n=a<3?t:null===i?i=Object.getOwnPropertyDescriptor(t,r):i;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)n=Reflect.decorate(e,t,r,i);else for(var c=e.length-1;c>=0;c--)(o=e[c])&&(n=(a<3?o(n):a>3?o(t,r,n):o(t,r))||n);return a>3&&n&&Object.defineProperty(t,r,n),n};let C=class extends i.oi{constructor(){super(),this.unsubscribe=[],this.address=n.R.getAccountData()?.address,this.profileName=n.R.getAccountData()?.profileName,this.network=n.R.state.activeCaipNetwork,this.unsubscribe.push(...[n.R.subscribeChainProp("accountState",e=>{e?(this.address=e.address,this.profileName=e.profileName):c.SnackController.showError("Account not found")})],n.R.subscribeKey("activeCaipNetwork",e=>{e?.id&&(this.network=e)}))}disconnectedCallback(){this.unsubscribe.forEach(e=>e())}render(){if(!this.address)throw Error("w3m-wallet-receive-view: No account provided");let e=s.f.getNetworkImage(this.network);return i.dy` <wui-flex
      flexDirection="column"
      .padding=${["0","4","4","4"]}
      alignItems="center"
    >
      <wui-chip-button
        data-testid="receive-address-copy-button"
        @click=${this.onCopyClick.bind(this)}
        text=${p.Hg.getTruncateString({string:this.profileName||this.address||"",charsStart:this.profileName?18:4,charsEnd:this.profileName?0:4,truncate:this.profileName?"end":"middle"})}
        icon="copy"
        size="sm"
        imageSrc=${e||""}
        variant="gray"
      ></wui-chip-button>
      <wui-flex
        flexDirection="column"
        .padding=${["4","0","0","0"]}
        alignItems="center"
        gap="4"
      >
        <wui-qr-code
          size=${232}
          theme=${l.ThemeController.state.themeMode}
          uri=${this.address}
          ?arenaClear=${!0}
          color=${(0,a.o)(l.ThemeController.state.themeVariables["--apkt-qr-color"]??l.ThemeController.state.themeVariables["--w3m-qr-color"])}
          data-testid="wui-qr-code"
        ></wui-qr-code>
        <wui-text variant="lg-regular" color="primary" align="center">
          Copy your address or scan this QR code
        </wui-text>
        <wui-button @click=${this.onCopyClick.bind(this)} size="sm" variant="neutral-secondary">
          <wui-icon slot="iconLeft" size="sm" color="inherit" name="copy"></wui-icon>
          <wui-text variant="md-regular" color="inherit">Copy address</wui-text>
        </wui-button>
      </wui-flex>
      ${this.networkTemplate()}
    </wui-flex>`}networkTemplate(){let e=n.R.getAllRequestedCaipNetworks(),t=n.R.checkIfSmartAccountEnabled(),r=n.R.state.activeCaipNetwork,o=e.filter(e=>e?.chainNamespace===r?.chainNamespace);if((0,d.r9)(r?.chainNamespace)===y.y_.ACCOUNT_TYPES.SMART_ACCOUNT&&t)return r?i.dy`<wui-compatible-network
        @click=${this.onReceiveClick.bind(this)}
        text="Only receive assets on this network"
        .networkImages=${[s.f.getNetworkImage(r)??""]}
      ></wui-compatible-network>`:null;let a=o?.filter(e=>e?.assets?.imageId)?.slice(0,5),c=a.map(s.f.getNetworkImage).filter(Boolean);return i.dy`<wui-compatible-network
      @click=${this.onReceiveClick.bind(this)}
      text="Only receive assets on these networks"
      .networkImages=${c}
    ></wui-compatible-network>`}onReceiveClick(){u.RouterController.push("WalletCompatibleNetworks")}onCopyClick(){try{this.address&&(w.j.copyToClopboard(this.address),c.SnackController.showSuccess("Address copied"))}catch{c.SnackController.showError("Failed to copy")}}};C.styles=x,w3m_wallet_receive_view_decorate([(0,o.SB)()],C.prototype,"address",void 0),w3m_wallet_receive_view_decorate([(0,o.SB)()],C.prototype,"profileName",void 0),w3m_wallet_receive_view_decorate([(0,o.SB)()],C.prototype,"network",void 0),C=w3m_wallet_receive_view_decorate([(0,p.Mo)("w3m-wallet-receive-view")],C)}}]);