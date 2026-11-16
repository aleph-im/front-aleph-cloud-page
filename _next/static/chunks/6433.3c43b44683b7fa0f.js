"use strict";(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[6433],{8814:(e,t,i)=>{i.r(t),i.d(t,{W3mConnectSocialsView:()=>C,W3mConnectingFarcasterView:()=>q,W3mConnectingSocialView:()=>U});var o=i(1850),r=i(58446),s=i(12689),a=i(4319),n=i(59390),c=i(44458);i(85479),i(22071);var l=i(70803),d=i(70464),u=i(51105),h=i(22797),p=i(91986),w=i(33632),m=i(21159);i(57402);var g=i(20754);let v=(0,c.AH)`
  :host {
    margin-top: ${({spacing:e})=>e["1"]};
  }
  wui-separator {
    margin: ${({spacing:e})=>e["3"]} calc(${({spacing:e})=>e["3"]} * -1)
      ${({spacing:e})=>e["2"]} calc(${({spacing:e})=>e["3"]} * -1);
    width: calc(100% + ${({spacing:e})=>e["3"]} * 2);
  }
`;var f=function(e,t,i,o){var r,s=arguments.length,a=s<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(e,t,i,o);else for(var n=e.length-1;n>=0;n--)(r=e[n])&&(a=(s<3?r(a):s>3?r(t,i,a):r(t,i))||a);return s>3&&a&&Object.defineProperty(t,i,a),a};let y=class extends o.WF{constructor(){super(),this.unsubscribe=[],this.tabIdx=void 0,this.connectors=l.a.state.connectors,this.authConnector=this.connectors.find(e=>"AUTH"===e.type),this.remoteFeatures=n.H.state.remoteFeatures,this.isPwaLoading=!1,this.hasExceededUsageLimit=d.N.state.plan.hasExceededUsageLimit,this.unsubscribe.push(l.a.subscribeKey("connectors",e=>{this.connectors=e,this.authConnector=this.connectors.find(e=>"AUTH"===e.type)}),n.H.subscribeKey("remoteFeatures",e=>this.remoteFeatures=e))}connectedCallback(){super.connectedCallback(),this.handlePwaFrameLoad()}disconnectedCallback(){this.unsubscribe.forEach(e=>e())}render(){let e=this.remoteFeatures?.socials||[],t=!!this.authConnector,i=e?.length,r="ConnectSocials"===u.I.state.view;return t&&i||r?(r&&!i&&(e=h.oU.DEFAULT_SOCIALS),(0,o.qy)` <wui-flex flexDirection="column" gap="2">
      ${e.map(e=>(0,o.qy)`<wui-list-social
            @click=${()=>{this.onSocialClick(e)}}
            data-testid=${`social-selector-${e}`}
            name=${e}
            logo=${e}
            ?disabled=${this.isPwaLoading}
          ></wui-list-social>`)}
    </wui-flex>`):null}async onSocialClick(e){this.hasExceededUsageLimit?u.I.push("UsageExceeded"):e&&await (0,w.Up)(e)}async handlePwaFrameLoad(){if(m.w.isPWA()){this.isPwaLoading=!0;try{this.authConnector?.provider instanceof g.Y&&await this.authConnector.provider.init()}catch(e){p.h.open({displayMessage:"Error loading embedded wallet in PWA",debugMessage:e.message},"error")}finally{this.isPwaLoading=!1}}}};y.styles=v,f([(0,r.MZ)()],y.prototype,"tabIdx",void 0),f([(0,r.wk)()],y.prototype,"connectors",void 0),f([(0,r.wk)()],y.prototype,"authConnector",void 0),f([(0,r.wk)()],y.prototype,"remoteFeatures",void 0),f([(0,r.wk)()],y.prototype,"isPwaLoading",void 0),f([(0,r.wk)()],y.prototype,"hasExceededUsageLimit",void 0),y=f([(0,c.EM)("w3m-social-login-list")],y);let b=(0,c.AH)`
  wui-flex {
    max-height: clamp(360px, 540px, 80vh);
    overflow: scroll;
    scrollbar-width: none;
    transition: opacity ${({durations:e})=>e.md}
      ${({easings:e})=>e["ease-out-power-1"]};
    will-change: opacity;
  }

  wui-flex::-webkit-scrollbar {
    display: none;
  }

  wui-flex.disabled {
    opacity: 0.3;
    pointer-events: none;
    user-select: none;
  }
`;var x=function(e,t,i,o){var r,s=arguments.length,a=s<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(e,t,i,o);else for(var n=e.length-1;n>=0;n--)(r=e[n])&&(a=(s<3?r(a):s>3?r(t,i,a):r(t,i))||a);return s>3&&a&&Object.defineProperty(t,i,a),a};let C=class extends o.WF{constructor(){super(),this.unsubscribe=[],this.checked=a.o.state.isLegalCheckboxChecked,this.unsubscribe.push(a.o.subscribeKey("isLegalCheckboxChecked",e=>{this.checked=e}))}disconnectedCallback(){this.unsubscribe.forEach(e=>e())}render(){let{termsConditionsUrl:e,privacyPolicyUrl:t}=n.H.state,i=n.H.state.features?.legalCheckbox,r=!!(e||t)&&!!i&&!this.checked;return(0,o.qy)`
      <w3m-legal-checkbox></w3m-legal-checkbox>
      <wui-flex
        flexDirection="column"
        .padding=${["0","3","3","3"]}
        gap="01"
        class=${(0,s.J)(r?"disabled":void 0)}
      >
        <w3m-social-login-list tabIdx=${(0,s.J)(r?-1:void 0)}></w3m-social-login-list>
      </wui-flex>
    `}};C.styles=b,x([(0,r.wk)()],C.prototype,"checked",void 0),C=x([(0,c.EM)("w3m-connect-socials-view")],C);var E=i(933),k=i(26064),P=i(24101),$=i(42521),S=i(82570),W=i(24417),L=i(90889);i(8285),i(74508),i(77943),i(60347);var I=i(72320),O=i(22483);let A=(0,c.AH)`
  wui-logo {
    width: 80px;
    height: 80px;
    border-radius: ${({borderRadius:e})=>e["8"]};
  }
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
  wui-icon-box {
    position: absolute;
    right: calc(${({spacing:e})=>e["1"]} * -1);
    bottom: calc(${({spacing:e})=>e["1"]} * -1);
    opacity: 0;
    transform: scale(0.5);
    transition: all ${({easings:e})=>e["ease-out-power-2"]}
      ${({durations:e})=>e.lg};
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
  .capitalize {
    text-transform: capitalize;
  }
`;var R=function(e,t,i,o){var r,s=arguments.length,a=s<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(e,t,i,o);else for(var n=e.length-1;n>=0;n--)(r=e[n])&&(a=(s<3?r(a):s>3?r(t,i,a):r(t,i))||a);return s>3&&a&&Object.defineProperty(t,i,a),a};let U=class extends o.WF{constructor(){super(),this.unsubscribe=[],this.socialProvider=E.W.getAccountData()?.socialProvider,this.socialWindow=E.W.getAccountData()?.socialWindow,this.error=!1,this.connecting=!1,this.message="Connect in the provider window",this.remoteFeatures=n.H.state.remoteFeatures,this.address=E.W.getAccountData()?.address,this.connectionsByNamespace=k.x.getConnections(E.W.state.activeChain),this.hasMultipleConnections=this.connectionsByNamespace.length>0,this.authConnector=l.a.getAuthConnector(),this.handleSocialConnection=async e=>{if(e.data?.resultUri)if(e.origin===O.o.SECURE_SITE_ORIGIN){window.removeEventListener("message",this.handleSocialConnection,!1);try{if(this.authConnector&&!this.connecting){this.connecting=!0;let t=this.parseURLError(e.data.resultUri);if(t)return void this.handleSocialError(t);this.closeSocialWindow(),this.updateMessage();let i=e.data.resultUri;this.socialProvider&&P.E.sendEvent({type:"track",event:"SOCIAL_LOGIN_REQUEST_USER_DATA",properties:{provider:this.socialProvider}}),await k.x.connectExternal({id:this.authConnector.id,type:this.authConnector.type,socialUri:i},this.authConnector.chain),this.socialProvider&&($.i.setConnectedSocialProvider(this.socialProvider),P.E.sendEvent({type:"track",event:"SOCIAL_LOGIN_SUCCESS",properties:{provider:this.socialProvider}}))}}catch(e){this.error=!0,this.updateMessage(),this.socialProvider&&P.E.sendEvent({type:"track",event:"SOCIAL_LOGIN_ERROR",properties:{provider:this.socialProvider,message:m.w.parseError(e)}})}}else u.I.goBack(),S.P.showError("Untrusted Origin"),this.socialProvider&&P.E.sendEvent({type:"track",event:"SOCIAL_LOGIN_ERROR",properties:{provider:this.socialProvider,message:"Untrusted Origin"}})},I.R.EmbeddedWalletAbortController.signal.addEventListener("abort",()=>{this.closeSocialWindow()}),this.unsubscribe.push(E.W.subscribeChainProp("accountState",e=>{if(e&&(this.socialProvider=e.socialProvider,e.socialWindow&&(this.socialWindow=e.socialWindow),e.address)){let t=this.remoteFeatures?.multiWallet;e.address!==this.address&&(this.hasMultipleConnections&&t?(u.I.replace("ProfileWallets"),S.P.showSuccess("New Wallet Added"),this.address=e.address):(W.W.state.open||n.H.state.enableEmbedded)&&W.W.close())}}),n.H.subscribeKey("remoteFeatures",e=>{this.remoteFeatures=e})),this.authConnector&&this.connectSocial()}disconnectedCallback(){this.unsubscribe.forEach(e=>e()),window.removeEventListener("message",this.handleSocialConnection,!1),E.W.state.activeCaipAddress||!this.socialProvider||this.connecting||P.E.sendEvent({type:"track",event:"SOCIAL_LOGIN_CANCELED",properties:{provider:this.socialProvider}}),this.closeSocialWindow()}render(){return(0,o.qy)`
      <wui-flex
        data-error=${(0,s.J)(this.error)}
        flexDirection="column"
        alignItems="center"
        .padding=${["10","5","5","5"]}
        gap="6"
      >
        <wui-flex justifyContent="center" alignItems="center">
          <wui-logo logo=${(0,s.J)(this.socialProvider)}></wui-logo>
          ${this.error?null:this.loaderTemplate()}
          <wui-icon-box color="error" icon="close" size="sm"></wui-icon-box>
        </wui-flex>
        <wui-flex flexDirection="column" alignItems="center" gap="2">
          <wui-text align="center" variant="lg-medium" color="primary"
            >Log in with
            <span class="capitalize">${this.socialProvider??"Social"}</span></wui-text
          >
          <wui-text align="center" variant="lg-regular" color=${this.error?"error":"secondary"}
            >${this.message}</wui-text
          ></wui-flex
        >
      </wui-flex>
    `}loaderTemplate(){let e=L.W.state.themeVariables["--w3m-border-radius-master"],t=e?parseInt(e.replace("px",""),10):4;return(0,o.qy)`<wui-loading-thumbnail radius=${9*t}></wui-loading-thumbnail>`}parseURLError(e){try{let t="error=",i=e.indexOf(t);if(-1===i)return null;return e.substring(i+t.length)}catch{return null}}connectSocial(){let e=setInterval(()=>{this.socialWindow?.closed&&(this.connecting||"ConnectingSocial"!==u.I.state.view||u.I.goBack(),clearInterval(e))},1e3);window.addEventListener("message",this.handleSocialConnection,!1)}updateMessage(){this.error?this.message="Something went wrong":this.connecting?this.message="Retrieving user data":this.message="Connect in the provider window"}handleSocialError(e){this.error=!0,this.updateMessage(),this.socialProvider&&P.E.sendEvent({type:"track",event:"SOCIAL_LOGIN_ERROR",properties:{provider:this.socialProvider,message:e}}),this.closeSocialWindow()}closeSocialWindow(){this.socialWindow&&(this.socialWindow.close(),E.W.setAccountProp("socialWindow",void 0,E.W.state.activeChain))}};U.styles=A,R([(0,r.wk)()],U.prototype,"socialProvider",void 0),R([(0,r.wk)()],U.prototype,"socialWindow",void 0),R([(0,r.wk)()],U.prototype,"error",void 0),R([(0,r.wk)()],U.prototype,"connecting",void 0),R([(0,r.wk)()],U.prototype,"message",void 0),R([(0,r.wk)()],U.prototype,"remoteFeatures",void 0),U=R([(0,c.EM)("w3m-connecting-social-view")],U);var T=i(84443);i(34556),i(80729),i(82780),i(41835);let _=(0,c.AH)`
  wui-shimmer {
    width: 100%;
    aspect-ratio: 1 / 1;
    border-radius: ${({borderRadius:e})=>e[4]};
  }

  wui-qr-code {
    opacity: 0;
    animation-duration: ${({durations:e})=>e.xl};
    animation-timing-function: ${({easings:e})=>e["ease-out-power-2"]};
    animation-name: fade-in;
    animation-fill-mode: forwards;
  }

  wui-logo {
    width: 80px;
    height: 80px;
    border-radius: ${({borderRadius:e})=>e["8"]};
  }

  wui-flex:first-child:not(:only-child) {
    position: relative;
  }

  wui-loading-thumbnail {
    position: absolute;
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

  @keyframes fade-in {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
`;var F=function(e,t,i,o){var r,s=arguments.length,a=s<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(e,t,i,o);else for(var n=e.length-1;n>=0;n--)(r=e[n])&&(a=(s<3?r(a):s>3?r(t,i,a):r(t,i))||a);return s>3&&a&&Object.defineProperty(t,i,a),a};let q=class extends o.WF{constructor(){super(),this.unsubscribe=[],this.timeout=void 0,this.socialProvider=E.W.getAccountData()?.socialProvider,this.uri=E.W.getAccountData()?.farcasterUrl,this.ready=!1,this.loading=!1,this.remoteFeatures=n.H.state.remoteFeatures,this.authConnector=l.a.getAuthConnector(),this.forceUpdate=()=>{this.requestUpdate()},this.unsubscribe.push(E.W.subscribeChainProp("accountState",e=>{this.socialProvider=e?.socialProvider,this.uri=e?.farcasterUrl,this.connectFarcaster()}),n.H.subscribeKey("remoteFeatures",e=>{this.remoteFeatures=e})),window.addEventListener("resize",this.forceUpdate)}disconnectedCallback(){super.disconnectedCallback(),clearTimeout(this.timeout),window.removeEventListener("resize",this.forceUpdate),!E.W.state.activeCaipAddress&&this.socialProvider&&(this.uri||this.loading)&&P.E.sendEvent({type:"track",event:"SOCIAL_LOGIN_CANCELED",properties:{provider:this.socialProvider}})}render(){return this.onRenderProxy(),(0,o.qy)`${this.platformTemplate()}`}platformTemplate(){return m.w.isMobile()?(0,o.qy)`${this.mobileTemplate()}`:(0,o.qy)`${this.desktopTemplate()}`}desktopTemplate(){return this.loading?(0,o.qy)`${this.loadingTemplate()}`:(0,o.qy)`${this.qrTemplate()}`}qrTemplate(){return(0,o.qy)` <wui-flex
      flexDirection="column"
      alignItems="center"
      .padding=${["0","5","5","5"]}
      gap="5"
    >
      <wui-shimmer width="100%"> ${this.qrCodeTemplate()} </wui-shimmer>

      <wui-text variant="lg-medium" color="primary"> Scan this QR Code with your phone </wui-text>
      ${this.copyTemplate()}
    </wui-flex>`}loadingTemplate(){return(0,o.qy)`
      <wui-flex
        flexDirection="column"
        alignItems="center"
        .padding=${["5","5","5","5"]}
        gap="5"
      >
        <wui-flex justifyContent="center" alignItems="center">
          <wui-logo logo="farcaster"></wui-logo>
          ${this.loaderTemplate()}
          <wui-icon-box color="error" icon="close" size="sm"></wui-icon-box>
        </wui-flex>
        <wui-flex flexDirection="column" alignItems="center" gap="2">
          <wui-text align="center" variant="md-medium" color="primary">
            Loading user data
          </wui-text>
          <wui-text align="center" variant="sm-regular" color="secondary">
            Please wait a moment while we load your data.
          </wui-text>
        </wui-flex>
      </wui-flex>
    `}mobileTemplate(){return(0,o.qy)` <wui-flex
      flexDirection="column"
      alignItems="center"
      .padding=${["10","5","5","5"]}
      gap="5"
    >
      <wui-flex justifyContent="center" alignItems="center">
        <wui-logo logo="farcaster"></wui-logo>
        ${this.loaderTemplate()}
        <wui-icon-box
          color="error"
          icon="close"
          size="sm"
        ></wui-icon-box>
      </wui-flex>
      <wui-flex flexDirection="column" alignItems="center" gap="2">
        <wui-text align="center" variant="md-medium" color="primary"
          >Continue in Farcaster</span></wui-text
        >
        <wui-text align="center" variant="sm-regular" color="secondary"
          >Accept connection request in the app</wui-text
        ></wui-flex
      >
      ${this.mobileLinkTemplate()}
    </wui-flex>`}loaderTemplate(){let e=L.W.state.themeVariables["--w3m-border-radius-master"],t=e?parseInt(e.replace("px",""),10):4;return(0,o.qy)`<wui-loading-thumbnail radius=${9*t}></wui-loading-thumbnail>`}async connectFarcaster(){if(this.authConnector)try{await this.authConnector?.provider.connectFarcaster(),this.socialProvider&&($.i.setConnectedSocialProvider(this.socialProvider),P.E.sendEvent({type:"track",event:"SOCIAL_LOGIN_REQUEST_USER_DATA",properties:{provider:this.socialProvider}})),this.loading=!0;let e=k.x.getConnections(this.authConnector.chain).length>0;await k.x.connectExternal(this.authConnector,this.authConnector.chain);let t=this.remoteFeatures?.multiWallet;this.socialProvider&&P.E.sendEvent({type:"track",event:"SOCIAL_LOGIN_SUCCESS",properties:{provider:this.socialProvider}}),this.loading=!1,(!n.H.state.siwx||await T.U.isAuthenticated())&&(e&&t?(u.I.replace("ProfileWallets"),S.P.showSuccess("New Wallet Added")):W.W.close())}catch(e){this.socialProvider&&P.E.sendEvent({type:"track",event:"SOCIAL_LOGIN_ERROR",properties:{provider:this.socialProvider,message:m.w.parseError(e)}}),u.I.goBack(),S.P.showError(e)}}mobileLinkTemplate(){return(0,o.qy)`<wui-button
      size="md"
      ?loading=${this.loading}
      ?disabled=${!this.uri||this.loading}
      @click=${()=>{this.uri&&m.w.openHref(this.uri,"_blank")}}
    >
      Open farcaster</wui-button
    >`}onRenderProxy(){!this.ready&&this.uri&&(this.timeout=setTimeout(()=>{this.ready=!0},200))}qrCodeTemplate(){if(!this.uri||!this.ready)return null;let e=this.getBoundingClientRect().width-40,t=L.W.state.themeVariables["--apkt-qr-color"]??L.W.state.themeVariables["--w3m-qr-color"];return(0,o.qy)` <wui-qr-code
      size=${e}
      theme=${L.W.state.themeMode}
      uri=${this.uri}
      ?farcaster=${!0}
      data-testid="wui-qr-code"
      color=${(0,s.J)(t)}
    ></wui-qr-code>`}copyTemplate(){let e=!this.uri||!this.ready;return(0,o.qy)`<wui-button
      .disabled=${e}
      @click=${this.onCopyUri}
      variant="neutral-secondary"
      size="sm"
      data-testid="copy-wc2-uri"
    >
      <wui-icon size="sm" color="default" slot="iconRight" name="copy"></wui-icon>
      Copy link
    </wui-button>`}onCopyUri(){try{this.uri&&(m.w.copyToClopboard(this.uri),S.P.showSuccess("Link copied"))}catch{S.P.showError("Failed to copy")}}};q.styles=_,F([(0,r.wk)()],q.prototype,"socialProvider",void 0),F([(0,r.wk)()],q.prototype,"uri",void 0),F([(0,r.wk)()],q.prototype,"ready",void 0),F([(0,r.wk)()],q.prototype,"loading",void 0),F([(0,r.wk)()],q.prototype,"remoteFeatures",void 0),q=F([(0,c.EM)("w3m-connecting-farcaster-view")],q)}}]);