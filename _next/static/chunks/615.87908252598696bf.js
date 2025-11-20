"use strict";(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[615],{20615:function(e,t,o){o.r(t),o.d(t,{W3mConnectSocialsView:function(){return y},W3mConnectingFarcasterView:function(){return A},W3mConnectingSocialView:function(){return L}});var i=o(19064),r=o(59662),n=o(35162),a=o(88686),s=o(35428),c=o(28740);o(82100),o(27912);var l=o(9793),d=o(48113),u=o(4511),h=o(47205),p=o(56008),w=o(1181),m=o(83241);o(75022);var g=o(61749),v=c.iv`
  :host {
    margin-top: ${({spacing:e})=>e["1"]};
  }
  wui-separator {
    margin: ${({spacing:e})=>e["3"]} calc(${({spacing:e})=>e["3"]} * -1)
      ${({spacing:e})=>e["2"]} calc(${({spacing:e})=>e["3"]} * -1);
    width: calc(100% + ${({spacing:e})=>e["3"]} * 2);
  }
`,__decorate=function(e,t,o,i){var r,n=arguments.length,a=n<3?t:null===i?i=Object.getOwnPropertyDescriptor(t,o):i;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(e,t,o,i);else for(var s=e.length-1;s>=0;s--)(r=e[s])&&(a=(n<3?r(a):n>3?r(t,o,a):r(t,o))||a);return n>3&&a&&Object.defineProperty(t,o,a),a};let f=class extends i.oi{constructor(){super(),this.unsubscribe=[],this.tabIdx=void 0,this.connectors=l.ConnectorController.state.connectors,this.authConnector=this.connectors.find(e=>"AUTH"===e.type),this.remoteFeatures=s.OptionsController.state.remoteFeatures,this.isPwaLoading=!1,this.hasExceededUsageLimit=d.ApiController.state.plan.hasExceededUsageLimit,this.unsubscribe.push(l.ConnectorController.subscribeKey("connectors",e=>{this.connectors=e,this.authConnector=this.connectors.find(e=>"AUTH"===e.type)}),s.OptionsController.subscribeKey("remoteFeatures",e=>this.remoteFeatures=e))}connectedCallback(){super.connectedCallback(),this.handlePwaFrameLoad()}disconnectedCallback(){this.unsubscribe.forEach(e=>e())}render(){let e=this.remoteFeatures?.socials||[],t=!!this.authConnector,o=e?.length,r="ConnectSocials"===u.RouterController.state.view;return t&&o||r?(r&&!o&&(e=h.bq.DEFAULT_SOCIALS),i.dy` <wui-flex flexDirection="column" gap="2">
      ${e.map(e=>i.dy`<wui-list-social
            @click=${()=>{this.onSocialClick(e)}}
            data-testid=${`social-selector-${e}`}
            name=${e}
            logo=${e}
            ?disabled=${this.isPwaLoading}
          ></wui-list-social>`)}
    </wui-flex>`):null}async onSocialClick(e){if(this.hasExceededUsageLimit){u.RouterController.push("UsageExceeded");return}e&&await (0,w.y0)(e)}async handlePwaFrameLoad(){if(m.j.isPWA()){this.isPwaLoading=!0;try{this.authConnector?.provider instanceof g.S&&await this.authConnector.provider.init()}catch(e){p.AlertController.open({displayMessage:"Error loading embedded wallet in PWA",debugMessage:e.message},"error")}finally{this.isPwaLoading=!1}}}};f.styles=v,__decorate([(0,r.Cb)()],f.prototype,"tabIdx",void 0),__decorate([(0,r.SB)()],f.prototype,"connectors",void 0),__decorate([(0,r.SB)()],f.prototype,"authConnector",void 0),__decorate([(0,r.SB)()],f.prototype,"remoteFeatures",void 0),__decorate([(0,r.SB)()],f.prototype,"isPwaLoading",void 0),__decorate([(0,r.SB)()],f.prototype,"hasExceededUsageLimit",void 0),f=__decorate([(0,c.Mo)("w3m-social-login-list")],f);var C=c.iv`
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
`,w3m_connect_socials_view_decorate=function(e,t,o,i){var r,n=arguments.length,a=n<3?t:null===i?i=Object.getOwnPropertyDescriptor(t,o):i;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(e,t,o,i);else for(var s=e.length-1;s>=0;s--)(r=e[s])&&(a=(n<3?r(a):n>3?r(t,o,a):r(t,o))||a);return n>3&&a&&Object.defineProperty(t,o,a),a};let y=class extends i.oi{constructor(){super(),this.unsubscribe=[],this.checked=a.M.state.isLegalCheckboxChecked,this.unsubscribe.push(a.M.subscribeKey("isLegalCheckboxChecked",e=>{this.checked=e}))}disconnectedCallback(){this.unsubscribe.forEach(e=>e())}render(){let{termsConditionsUrl:e,privacyPolicyUrl:t}=s.OptionsController.state,o=s.OptionsController.state.features?.legalCheckbox,r=!!(e||t)&&!!o&&!this.checked,a=r?-1:void 0;return i.dy`
      <w3m-legal-checkbox></w3m-legal-checkbox>
      <wui-flex
        flexDirection="column"
        .padding=${["0","3","3","3"]}
        gap="01"
        class=${(0,n.o)(r?"disabled":void 0)}
      >
        <w3m-social-login-list tabIdx=${(0,n.o)(a)}></w3m-social-login-list>
      </wui-flex>
    `}};y.styles=C,w3m_connect_socials_view_decorate([(0,r.SB)()],y.prototype,"checked",void 0),y=w3m_connect_socials_view_decorate([(0,c.Mo)("w3m-connect-socials-view")],y);var b=o(59757),_=o(29460),x=o(51440),S=o(64125),$=o(82879),P=o(83662),E=o(12858);o(12441),o(7013),o(51880),o(68390);var k=o(9681),R=o(72134),O=c.iv`
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
`,w3m_connecting_social_view_decorate=function(e,t,o,i){var r,n=arguments.length,a=n<3?t:null===i?i=Object.getOwnPropertyDescriptor(t,o):i;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(e,t,o,i);else for(var s=e.length-1;s>=0;s--)(r=e[s])&&(a=(n<3?r(a):n>3?r(t,o,a):r(t,o))||a);return n>3&&a&&Object.defineProperty(t,o,a),a};let L=class extends i.oi{constructor(){super(),this.unsubscribe=[],this.socialProvider=b.R.getAccountData()?.socialProvider,this.socialWindow=b.R.getAccountData()?.socialWindow,this.error=!1,this.connecting=!1,this.message="Connect in the provider window",this.remoteFeatures=s.OptionsController.state.remoteFeatures,this.address=b.R.getAccountData()?.address,this.connectionsByNamespace=_.ConnectionController.getConnections(b.R.state.activeChain),this.hasMultipleConnections=this.connectionsByNamespace.length>0,this.authConnector=l.ConnectorController.getAuthConnector(),this.handleSocialConnection=async e=>{if(e.data?.resultUri){if(e.origin===R.b.SECURE_SITE_ORIGIN){window.removeEventListener("message",this.handleSocialConnection,!1);try{if(this.authConnector&&!this.connecting){this.connecting=!0;let t=this.parseURLError(e.data.resultUri);if(t){this.handleSocialError(t);return}this.closeSocialWindow(),this.updateMessage();let o=e.data.resultUri;this.socialProvider&&x.X.sendEvent({type:"track",event:"SOCIAL_LOGIN_REQUEST_USER_DATA",properties:{provider:this.socialProvider}}),await _.ConnectionController.connectExternal({id:this.authConnector.id,type:this.authConnector.type,socialUri:o},this.authConnector.chain),this.socialProvider&&(S.M.setConnectedSocialProvider(this.socialProvider),x.X.sendEvent({type:"track",event:"SOCIAL_LOGIN_SUCCESS",properties:{provider:this.socialProvider}}))}}catch(e){this.error=!0,this.updateMessage(),this.socialProvider&&x.X.sendEvent({type:"track",event:"SOCIAL_LOGIN_ERROR",properties:{provider:this.socialProvider,message:m.j.parseError(e)}})}}else u.RouterController.goBack(),$.SnackController.showError("Untrusted Origin"),this.socialProvider&&x.X.sendEvent({type:"track",event:"SOCIAL_LOGIN_ERROR",properties:{provider:this.socialProvider,message:"Untrusted Origin"}})}};let e=k.j.EmbeddedWalletAbortController;e.signal.addEventListener("abort",()=>{this.closeSocialWindow()}),this.unsubscribe.push(...[b.R.subscribeChainProp("accountState",e=>{if(e&&(this.socialProvider=e.socialProvider,e.socialWindow&&(this.socialWindow=e.socialWindow),e.address)){let t=this.remoteFeatures?.multiWallet;e.address!==this.address&&(this.hasMultipleConnections&&t?(u.RouterController.replace("ProfileWallets"),$.SnackController.showSuccess("New Wallet Added"),this.address=e.address):(P.I.state.open||s.OptionsController.state.enableEmbedded)&&P.I.close())}}),s.OptionsController.subscribeKey("remoteFeatures",e=>{this.remoteFeatures=e})]),this.authConnector&&this.connectSocial()}disconnectedCallback(){this.unsubscribe.forEach(e=>e()),window.removeEventListener("message",this.handleSocialConnection,!1);let e=b.R.state.activeCaipAddress;e||!this.socialProvider||this.connecting||x.X.sendEvent({type:"track",event:"SOCIAL_LOGIN_CANCELED",properties:{provider:this.socialProvider}}),this.closeSocialWindow()}render(){return i.dy`
      <wui-flex
        data-error=${(0,n.o)(this.error)}
        flexDirection="column"
        alignItems="center"
        .padding=${["10","5","5","5"]}
        gap="6"
      >
        <wui-flex justifyContent="center" alignItems="center">
          <wui-logo logo=${(0,n.o)(this.socialProvider)}></wui-logo>
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
    `}loaderTemplate(){let e=E.ThemeController.state.themeVariables["--w3m-border-radius-master"],t=e?parseInt(e.replace("px",""),10):4;return i.dy`<wui-loading-thumbnail radius=${9*t}></wui-loading-thumbnail>`}parseURLError(e){try{let t="error=",o=e.indexOf(t);if(-1===o)return null;let i=e.substring(o+t.length);return i}catch{return null}}connectSocial(){let e=setInterval(()=>{this.socialWindow?.closed&&(this.connecting||"ConnectingSocial"!==u.RouterController.state.view||u.RouterController.goBack(),clearInterval(e))},1e3);window.addEventListener("message",this.handleSocialConnection,!1)}updateMessage(){this.error?this.message="Something went wrong":this.connecting?this.message="Retrieving user data":this.message="Connect in the provider window"}handleSocialError(e){this.error=!0,this.updateMessage(),this.socialProvider&&x.X.sendEvent({type:"track",event:"SOCIAL_LOGIN_ERROR",properties:{provider:this.socialProvider,message:e}}),this.closeSocialWindow()}closeSocialWindow(){this.socialWindow&&(this.socialWindow.close(),b.R.setAccountProp("socialWindow",void 0,b.R.state.activeChain))}};L.styles=O,w3m_connecting_social_view_decorate([(0,r.SB)()],L.prototype,"socialProvider",void 0),w3m_connecting_social_view_decorate([(0,r.SB)()],L.prototype,"socialWindow",void 0),w3m_connecting_social_view_decorate([(0,r.SB)()],L.prototype,"error",void 0),w3m_connecting_social_view_decorate([(0,r.SB)()],L.prototype,"connecting",void 0),w3m_connecting_social_view_decorate([(0,r.SB)()],L.prototype,"message",void 0),w3m_connecting_social_view_decorate([(0,r.SB)()],L.prototype,"remoteFeatures",void 0),L=w3m_connecting_social_view_decorate([(0,c.Mo)("w3m-connecting-social-view")],L),o(37826),o(85642),o(18370),o(91833);var I=c.iv`
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
`,w3m_connecting_farcaster_view_decorate=function(e,t,o,i){var r,n=arguments.length,a=n<3?t:null===i?i=Object.getOwnPropertyDescriptor(t,o):i;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(e,t,o,i);else for(var s=e.length-1;s>=0;s--)(r=e[s])&&(a=(n<3?r(a):n>3?r(t,o,a):r(t,o))||a);return n>3&&a&&Object.defineProperty(t,o,a),a};let A=class extends i.oi{constructor(){super(),this.unsubscribe=[],this.timeout=void 0,this.socialProvider=b.R.getAccountData()?.socialProvider,this.uri=b.R.getAccountData()?.farcasterUrl,this.ready=!1,this.loading=!1,this.remoteFeatures=s.OptionsController.state.remoteFeatures,this.authConnector=l.ConnectorController.getAuthConnector(),this.forceUpdate=()=>{this.requestUpdate()},this.unsubscribe.push(...[b.R.subscribeChainProp("accountState",e=>{this.socialProvider=e?.socialProvider,this.uri=e?.farcasterUrl,this.connectFarcaster()}),s.OptionsController.subscribeKey("remoteFeatures",e=>{this.remoteFeatures=e})]),window.addEventListener("resize",this.forceUpdate)}disconnectedCallback(){super.disconnectedCallback(),clearTimeout(this.timeout),window.removeEventListener("resize",this.forceUpdate);let e=b.R.state.activeCaipAddress;!e&&this.socialProvider&&(this.uri||this.loading)&&x.X.sendEvent({type:"track",event:"SOCIAL_LOGIN_CANCELED",properties:{provider:this.socialProvider}})}render(){return this.onRenderProxy(),i.dy`${this.platformTemplate()}`}platformTemplate(){return m.j.isMobile()?i.dy`${this.mobileTemplate()}`:i.dy`${this.desktopTemplate()}`}desktopTemplate(){return this.loading?i.dy`${this.loadingTemplate()}`:i.dy`${this.qrTemplate()}`}qrTemplate(){return i.dy` <wui-flex
      flexDirection="column"
      alignItems="center"
      .padding=${["0","5","5","5"]}
      gap="5"
    >
      <wui-shimmer width="100%"> ${this.qrCodeTemplate()} </wui-shimmer>

      <wui-text variant="lg-medium" color="primary"> Scan this QR Code with your phone </wui-text>
      ${this.copyTemplate()}
    </wui-flex>`}loadingTemplate(){return i.dy`
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
    `}mobileTemplate(){return i.dy` <wui-flex
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
    </wui-flex>`}loaderTemplate(){let e=E.ThemeController.state.themeVariables["--w3m-border-radius-master"],t=e?parseInt(e.replace("px",""),10):4;return i.dy`<wui-loading-thumbnail radius=${9*t}></wui-loading-thumbnail>`}async connectFarcaster(){if(this.authConnector)try{await this.authConnector?.provider.connectFarcaster(),this.socialProvider&&(S.M.setConnectedSocialProvider(this.socialProvider),x.X.sendEvent({type:"track",event:"SOCIAL_LOGIN_REQUEST_USER_DATA",properties:{provider:this.socialProvider}})),this.loading=!0;let e=_.ConnectionController.getConnections(this.authConnector.chain),t=e.length>0;await _.ConnectionController.connectExternal(this.authConnector,this.authConnector.chain);let o=this.remoteFeatures?.multiWallet;this.socialProvider&&x.X.sendEvent({type:"track",event:"SOCIAL_LOGIN_SUCCESS",properties:{provider:this.socialProvider}}),this.loading=!1,t&&o?(u.RouterController.replace("ProfileWallets"),$.SnackController.showSuccess("New Wallet Added")):P.I.close()}catch(e){this.socialProvider&&x.X.sendEvent({type:"track",event:"SOCIAL_LOGIN_ERROR",properties:{provider:this.socialProvider,message:m.j.parseError(e)}}),u.RouterController.goBack(),$.SnackController.showError(e)}}mobileLinkTemplate(){return i.dy`<wui-button
      size="md"
      ?loading=${this.loading}
      ?disabled=${!this.uri||this.loading}
      @click=${()=>{this.uri&&m.j.openHref(this.uri,"_blank")}}
    >
      Open farcaster</wui-button
    >`}onRenderProxy(){!this.ready&&this.uri&&(this.timeout=setTimeout(()=>{this.ready=!0},200))}qrCodeTemplate(){if(!this.uri||!this.ready)return null;let e=this.getBoundingClientRect().width-40,t=E.ThemeController.state.themeVariables["--apkt-qr-color"]??E.ThemeController.state.themeVariables["--w3m-qr-color"];return i.dy` <wui-qr-code
      size=${e}
      theme=${E.ThemeController.state.themeMode}
      uri=${this.uri}
      ?farcaster=${!0}
      data-testid="wui-qr-code"
      color=${(0,n.o)(t)}
    ></wui-qr-code>`}copyTemplate(){let e=!this.uri||!this.ready;return i.dy`<wui-button
      .disabled=${e}
      @click=${this.onCopyUri}
      variant="neutral-secondary"
      size="sm"
      data-testid="copy-wc2-uri"
    >
      <wui-icon size="sm" color="default" slot="iconRight" name="copy"></wui-icon>
      Copy link
    </wui-button>`}onCopyUri(){try{this.uri&&(m.j.copyToClopboard(this.uri),$.SnackController.showSuccess("Link copied"))}catch{$.SnackController.showError("Failed to copy")}}};A.styles=I,w3m_connecting_farcaster_view_decorate([(0,r.SB)()],A.prototype,"socialProvider",void 0),w3m_connecting_farcaster_view_decorate([(0,r.SB)()],A.prototype,"uri",void 0),w3m_connecting_farcaster_view_decorate([(0,r.SB)()],A.prototype,"ready",void 0),w3m_connecting_farcaster_view_decorate([(0,r.SB)()],A.prototype,"loading",void 0),w3m_connecting_farcaster_view_decorate([(0,r.SB)()],A.prototype,"remoteFeatures",void 0),A=w3m_connecting_farcaster_view_decorate([(0,c.Mo)("w3m-connecting-farcaster-view")],A)}}]);