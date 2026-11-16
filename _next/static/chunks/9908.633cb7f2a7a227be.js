"use strict";(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[9908],{9908:(e,t,i)=>{i.r(t),i.d(t,{W3mWalletReceiveView:()=>$});var r=i(1850),o=i(58446),a=i(12689),n=i(933),s=i(82570),c=i(11464),l=i(90889),u=i(81805),d=i(51105),w=i(21159),p=i(44458);i(13496),i(56349),i(53059),i(18341);var h=i(54684),m=i(51127),f=i(41608);let g=(0,f.AH)`
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
`;var k=function(e,t,i,r){var o,a=arguments.length,n=a<3?t:null===r?r=Object.getOwnPropertyDescriptor(t,i):r;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)n=Reflect.decorate(e,t,i,r);else for(var s=e.length-1;s>=0;s--)(o=e[s])&&(n=(a<3?o(n):a>3?o(t,i,n):o(t,i))||n);return a>3&&n&&Object.defineProperty(t,i,n),n};let b=class extends r.WF{constructor(){super(...arguments),this.networkImages=[""],this.text=""}render(){return(0,r.qy)`
      <button>
        <wui-text variant="md-regular" color="inherit">${this.text}</wui-text>
        <wui-flex>
          ${this.networksTemplate()}
          <wui-icon name="chevronRight" size="sm" color="inherit"></wui-icon>
        </wui-flex>
      </button>
    `}networksTemplate(){let e=this.networkImages.slice(0,5);return(0,r.qy)` <wui-flex class="networks">
      ${e?.map(e=>(0,r.qy)` <wui-flex class="network-icon"> <wui-image src=${e}></wui-image> </wui-flex>`)}
    </wui-flex>`}};b.styles=[h.W5,h.fD,g],k([(0,o.MZ)({type:Array})],b.prototype,"networkImages",void 0),k([(0,o.MZ)()],b.prototype,"text",void 0),b=k([(0,m.E)("wui-compatible-network")],b),i(85479),i(82780),i(60347);var y=i(36421);let v=(0,p.AH)`
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
`;var x=function(e,t,i,r){var o,a=arguments.length,n=a<3?t:null===r?r=Object.getOwnPropertyDescriptor(t,i):r;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)n=Reflect.decorate(e,t,i,r);else for(var s=e.length-1;s>=0;s--)(o=e[s])&&(n=(a<3?o(n):a>3?o(t,i,n):o(t,i))||n);return a>3&&n&&Object.defineProperty(t,i,n),n};let $=class extends r.WF{constructor(){super(),this.unsubscribe=[],this.address=n.W.getAccountData()?.address,this.profileName=n.W.getAccountData()?.profileName,this.network=n.W.state.activeCaipNetwork,this.unsubscribe.push(n.W.subscribeChainProp("accountState",e=>{e?(this.address=e.address,this.profileName=e.profileName):s.P.showError("Account not found")}),n.W.subscribeKey("activeCaipNetwork",e=>{e?.id&&(this.network=e)}))}disconnectedCallback(){this.unsubscribe.forEach(e=>e())}render(){if(!this.address)throw Error("w3m-wallet-receive-view: No account provided");let e=c.$.getNetworkImage(this.network);return(0,r.qy)` <wui-flex
      flexDirection="column"
      .padding=${["0","4","4","4"]}
      alignItems="center"
    >
      <wui-chip-button
        data-testid="receive-address-copy-button"
        @click=${this.onCopyClick.bind(this)}
        text=${p.Zv.getTruncateString({string:this.profileName||this.address||"",charsStart:this.profileName?18:4,charsEnd:4*!this.profileName,truncate:this.profileName?"end":"middle"})}
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
          theme=${l.W.state.themeMode}
          uri=${this.address}
          ?arenaClear=${!0}
          color=${(0,a.J)(l.W.state.themeVariables["--apkt-qr-color"]??l.W.state.themeVariables["--w3m-qr-color"])}
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
    </wui-flex>`}networkTemplate(){let e=n.W.getAllRequestedCaipNetworks(),t=n.W.checkIfSmartAccountEnabled(),i=n.W.state.activeCaipNetwork,o=e.filter(e=>e?.chainNamespace===i?.chainNamespace);if((0,u.lj)(i?.chainNamespace)===y.Vl.ACCOUNT_TYPES.SMART_ACCOUNT&&t)return i?(0,r.qy)`<wui-compatible-network
        @click=${this.onReceiveClick.bind(this)}
        text="Only receive assets on this network"
        .networkImages=${[c.$.getNetworkImage(i)??""]}
      ></wui-compatible-network>`:null;let a=(o?.filter(e=>e?.assets?.imageId)?.slice(0,5)).map(c.$.getNetworkImage).filter(Boolean);return(0,r.qy)`<wui-compatible-network
      @click=${this.onReceiveClick.bind(this)}
      text="Only receive assets on these networks"
      .networkImages=${a}
    ></wui-compatible-network>`}onReceiveClick(){d.I.push("WalletCompatibleNetworks")}onCopyClick(){try{this.address&&(w.w.copyToClopboard(this.address),s.P.showSuccess("Address copied"))}catch{s.P.showError("Failed to copy")}}};$.styles=v,x([(0,o.wk)()],$.prototype,"address",void 0),x([(0,o.wk)()],$.prototype,"profileName",void 0),x([(0,o.wk)()],$.prototype,"network",void 0),$=x([(0,p.EM)("w3m-wallet-receive-view")],$)}}]);