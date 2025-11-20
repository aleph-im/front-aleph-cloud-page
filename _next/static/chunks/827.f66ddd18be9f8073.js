"use strict";(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[827],{30827:function(e,t,a){a.r(t),a.d(t,{W3mPayLoadingView:function(){return D},W3mPayView:function(){return v},arbitrumUSDC:function(){return G},arbitrumUSDT:function(){return F},baseETH:function(){return O},baseSepoliaETH:function(){return M},baseUSDC:function(){return L},ethereumUSDC:function(){return $},ethereumUSDT:function(){return V},getExchanges:function(){return client_getExchanges},getIsPaymentInProgress:function(){return getIsPaymentInProgress},getPayError:function(){return getPayError},getPayResult:function(){return getPayResult},openPay:function(){return openPay},optimismUSDC:function(){return K},optimismUSDT:function(){return W},pay:function(){return pay},polygonUSDC:function(){return Y},polygonUSDT:function(){return z},solanaSOL:function(){return j},solanaUSDC:function(){return B},solanaUSDT:function(){return H}});var n=a(19064),r=a(59662),i=a(35162),o=a(59757),s=a(83662),c=a(83241),l=a(82879),u=a(29460),d=a(28740);a(37826),a(82100),a(85642),a(54530),a(8035),a(87809),a(84350),a(73049),a(48808),a(82002),a(68390),a(73783);var p=a(86949),y=a(73932),m=a(68314),h=a(50738),g=a(51440),w=a(4104),E=a(4511);let A={INVALID_PAYMENT_CONFIG:"INVALID_PAYMENT_CONFIG",INVALID_RECIPIENT:"INVALID_RECIPIENT",INVALID_ASSET:"INVALID_ASSET",INVALID_AMOUNT:"INVALID_AMOUNT",UNKNOWN_ERROR:"UNKNOWN_ERROR",UNABLE_TO_INITIATE_PAYMENT:"UNABLE_TO_INITIATE_PAYMENT",INVALID_CHAIN_NAMESPACE:"INVALID_CHAIN_NAMESPACE",GENERIC_PAYMENT_ERROR:"GENERIC_PAYMENT_ERROR",UNABLE_TO_GET_EXCHANGES:"UNABLE_TO_GET_EXCHANGES",ASSET_NOT_SUPPORTED:"ASSET_NOT_SUPPORTED",UNABLE_TO_GET_PAY_URL:"UNABLE_TO_GET_PAY_URL",UNABLE_TO_GET_BUY_STATUS:"UNABLE_TO_GET_BUY_STATUS"},f={[A.INVALID_PAYMENT_CONFIG]:"Invalid payment configuration",[A.INVALID_RECIPIENT]:"Invalid recipient address",[A.INVALID_ASSET]:"Invalid asset specified",[A.INVALID_AMOUNT]:"Invalid payment amount",[A.UNKNOWN_ERROR]:"Unknown payment error occurred",[A.UNABLE_TO_INITIATE_PAYMENT]:"Unable to initiate payment",[A.INVALID_CHAIN_NAMESPACE]:"Invalid chain namespace",[A.GENERIC_PAYMENT_ERROR]:"Unable to process payment",[A.UNABLE_TO_GET_EXCHANGES]:"Unable to get exchanges",[A.ASSET_NOT_SUPPORTED]:"Asset not supported by the selected exchange",[A.UNABLE_TO_GET_PAY_URL]:"Unable to get payment URL",[A.UNABLE_TO_GET_BUY_STATUS]:"Unable to get buy status"};let AppKitPayError=class AppKitPayError extends Error{get message(){return f[this.code]}constructor(e,t){super(f[e]),this.name="AppKitPayError",this.code=e,this.details=t,Error.captureStackTrace&&Error.captureStackTrace(this,AppKitPayError)}};var P=a(35428);let JsonRpcError=class JsonRpcError extends Error{};async function sendRequest(e,t){let a=function(){let e=P.OptionsController.getSnapshot().projectId;return`https://rpc.walletconnect.org/v1/json-rpc?projectId=${e}`}(),{sdkType:n,sdkVersion:r,projectId:i}=P.OptionsController.getSnapshot(),o={jsonrpc:"2.0",id:1,method:e,params:{...t||{},st:n,sv:r,projectId:i}},s=await fetch(a,{method:"POST",body:JSON.stringify(o),headers:{"Content-Type":"application/json"}}),c=await s.json();if(c.error)throw new JsonRpcError(c.error.message);return c}async function getExchanges(e){let t=await sendRequest("reown_getExchanges",e);return t.result}async function getPayUrl(e){let t=await sendRequest("reown_getExchangePayUrl",e);return t.result}async function getBuyStatus(e){let t=await sendRequest("reown_getExchangeBuyStatus",e);return t.result}let I=["eip155","solana"],_={eip155:{native:{assetNamespace:"slip44",assetReference:"60"},defaultTokenNamespace:"erc20"},solana:{native:{assetNamespace:"slip44",assetReference:"501"},defaultTokenNamespace:"token"}};function formatCaip19Asset(e,t){let{chainNamespace:a,chainId:n}=h.u.parseCaipNetworkId(e),r=_[a];if(!r)throw Error(`Unsupported chain namespace for CAIP-19 formatting: ${a}`);let i=r.native.assetNamespace,o=r.native.assetReference;"native"!==t&&(i=r.defaultTokenNamespace,o=t);let s=`${a}:${n}`;return`${s}/${i}:${o}`}var N=a(30508);async function ensureCorrectNetwork(e){let{paymentAssetNetwork:t,activeCaipNetwork:a,approvedCaipNetworkIds:n,requestedCaipNetworks:r}=e,i=c.j.sortRequestedNetworks(n,r),s=i.find(e=>e.caipNetworkId===t);if(!s)throw new AppKitPayError(A.INVALID_PAYMENT_CONFIG);if(s.caipNetworkId===a.caipNetworkId)return;let l=o.R.getNetworkProp("supportsAllNetworks",s.chainNamespace),u=n?.includes(s.caipNetworkId)||l;if(!u)throw new AppKitPayError(A.INVALID_PAYMENT_CONFIG);try{await o.R.switchActiveNetwork(s)}catch(e){throw new AppKitPayError(A.GENERIC_PAYMENT_ERROR,e)}}async function processEvmNativePayment(e,t,a){if(t!==m.b.CHAIN.EVM)throw new AppKitPayError(A.INVALID_CHAIN_NAMESPACE);if(!a.fromAddress)throw new AppKitPayError(A.INVALID_PAYMENT_CONFIG,"fromAddress is required for native EVM payments.");let n="string"==typeof a.amount?parseFloat(a.amount):a.amount;if(isNaN(n))throw new AppKitPayError(A.INVALID_PAYMENT_CONFIG);let r=e.metadata?.decimals??18,i=u.ConnectionController.parseUnits(n.toString(),r);if("bigint"!=typeof i)throw new AppKitPayError(A.GENERIC_PAYMENT_ERROR);let o=await u.ConnectionController.sendTransaction({chainNamespace:t,to:a.recipient,address:a.fromAddress,value:i,data:"0x"});return o??void 0}async function processEvmErc20Payment(e,t){if(!t.fromAddress)throw new AppKitPayError(A.INVALID_PAYMENT_CONFIG,"fromAddress is required for ERC20 EVM payments.");let a=e.asset,n=t.recipient,r=Number(e.metadata.decimals),i=u.ConnectionController.parseUnits(t.amount.toString(),r);if(void 0===i)throw new AppKitPayError(A.GENERIC_PAYMENT_ERROR);let o=await u.ConnectionController.writeContract({fromAddress:t.fromAddress,tokenAddress:a,args:[n,i],method:"transfer",abi:N.g.getERC20Abi(a),chainNamespace:m.b.CHAIN.EVM});return o??void 0}async function processSolanaPayment(e,t){if(e!==m.b.CHAIN.SOLANA)throw new AppKitPayError(A.INVALID_CHAIN_NAMESPACE);if(!t.fromAddress)throw new AppKitPayError(A.INVALID_PAYMENT_CONFIG,"fromAddress is required for Solana payments.");let a="string"==typeof t.amount?parseFloat(t.amount):t.amount;if(isNaN(a)||a<=0)throw new AppKitPayError(A.INVALID_PAYMENT_CONFIG,"Invalid payment amount.");try{let n=w.O.getProvider(e);if(!n)throw new AppKitPayError(A.GENERIC_PAYMENT_ERROR,"No Solana provider available.");let r=await u.ConnectionController.sendTransaction({chainNamespace:m.b.CHAIN.SOLANA,to:t.recipient,value:a,tokenMint:t.tokenMint});if(!r)throw new AppKitPayError(A.GENERIC_PAYMENT_ERROR,"Transaction failed.");return r}catch(e){if(e instanceof AppKitPayError)throw e;throw new AppKitPayError(A.GENERIC_PAYMENT_ERROR,`Solana payment failed: ${e}`)}}let b="unknown",C=(0,p.sj)({paymentAsset:{network:"eip155:1",asset:"0x0",metadata:{name:"0x0",symbol:"0x0",decimals:0}},recipient:"0x0",amount:0,isConfigured:!1,error:null,isPaymentInProgress:!1,exchanges:[],isLoading:!1,openInNewTab:!0,redirectUrl:void 0,payWithExchange:void 0,currentPayment:void 0,analyticsSet:!1,paymentId:void 0}),S={state:C,subscribe:e=>(0,p.Ld)(C,()=>e(C)),subscribeKey:(e,t)=>(0,y.VW)(C,e,t),async handleOpenPay(e){this.resetState(),this.setPaymentConfig(e),this.subscribeEvents(),this.initializeAnalytics(),C.isConfigured=!0,g.X.sendEvent({type:"track",event:"PAY_MODAL_OPEN",properties:{exchanges:C.exchanges,configuration:{network:C.paymentAsset.network,asset:C.paymentAsset.asset,recipient:C.recipient,amount:C.amount}}}),await s.I.open({view:"Pay"})},resetState(){C.paymentAsset={network:"eip155:1",asset:"0x0",metadata:{name:"0x0",symbol:"0x0",decimals:0}},C.recipient="0x0",C.amount=0,C.isConfigured=!1,C.error=null,C.isPaymentInProgress=!1,C.isLoading=!1,C.currentPayment=void 0},setPaymentConfig(e){if(!e.paymentAsset)throw new AppKitPayError(A.INVALID_PAYMENT_CONFIG);try{C.paymentAsset=e.paymentAsset,C.recipient=e.recipient,C.amount=e.amount,C.openInNewTab=e.openInNewTab??!0,C.redirectUrl=e.redirectUrl,C.payWithExchange=e.payWithExchange,C.error=null}catch(e){throw new AppKitPayError(A.INVALID_PAYMENT_CONFIG,e.message)}},getPaymentAsset:()=>C.paymentAsset,getExchanges:()=>C.exchanges,async fetchExchanges(){try{C.isLoading=!0;let e=await getExchanges({page:0,asset:formatCaip19Asset(C.paymentAsset.network,C.paymentAsset.asset),amount:C.amount.toString()});C.exchanges=e.exchanges.slice(0,2)}catch(e){throw l.SnackController.showError(f.UNABLE_TO_GET_EXCHANGES),new AppKitPayError(A.UNABLE_TO_GET_EXCHANGES)}finally{C.isLoading=!1}},async getAvailableExchanges(e){try{let t=e?.asset&&e?.network?formatCaip19Asset(e.network,e.asset):void 0,a=await getExchanges({page:e?.page??0,asset:t,amount:e?.amount?.toString()});return a}catch(e){throw new AppKitPayError(A.UNABLE_TO_GET_EXCHANGES)}},async getPayUrl(e,t,a=!1){try{let n=Number(t.amount),r=await getPayUrl({exchangeId:e,asset:formatCaip19Asset(t.network,t.asset),amount:n.toString(),recipient:`${t.network}:${t.recipient}`});return g.X.sendEvent({type:"track",event:"PAY_EXCHANGE_SELECTED",properties:{source:"pay",exchange:{id:e},configuration:{network:t.network,asset:t.asset,recipient:t.recipient,amount:n},currentPayment:{type:"exchange",exchangeId:e},headless:a}}),a&&(this.initiatePayment(),g.X.sendEvent({type:"track",event:"PAY_INITIATED",properties:{source:"pay",paymentId:C.paymentId||b,configuration:{network:t.network,asset:t.asset,recipient:t.recipient,amount:n},currentPayment:{type:"exchange",exchangeId:e}}})),r}catch(e){if(e instanceof Error&&e.message.includes("is not supported"))throw new AppKitPayError(A.ASSET_NOT_SUPPORTED);throw Error(e.message)}},async openPayUrl(e,t,a=!1){try{let n=await this.getPayUrl(e.exchangeId,t,a);if(!n)throw new AppKitPayError(A.UNABLE_TO_GET_PAY_URL);let r=e.openInNewTab??!0;return c.j.openHref(n.url,r?"_blank":"_self"),n}catch(e){throw e instanceof AppKitPayError?C.error=e.message:C.error=f.GENERIC_PAYMENT_ERROR,new AppKitPayError(A.UNABLE_TO_GET_PAY_URL)}},subscribeEvents(){C.isConfigured||(u.ConnectionController.subscribeKey("connections",e=>{e.size>0&&this.handlePayment()}),o.R.subscribeChainProp("accountState",e=>{let t=u.ConnectionController.hasAnyConnection(m.b.CONNECTOR_ID.WALLET_CONNECT);e?.caipAddress&&(t?setTimeout(()=>{this.handlePayment()},100):this.handlePayment())}))},async handlePayment(){C.currentPayment={type:"wallet",status:"IN_PROGRESS"};let e=o.R.getActiveCaipAddress();if(!e)return;let{chainId:t,address:a}=h.u.parseCaipAddress(e),n=o.R.state.activeChain;if(!a||!t||!n)return;let r=w.O.getProvider(n);if(!r)return;let i=o.R.state.activeCaipNetwork;if(i&&!C.isPaymentInProgress)try{this.initiatePayment();let e=o.R.getAllRequestedCaipNetworks(),t=o.R.getAllApprovedCaipNetworkIds();switch(await ensureCorrectNetwork({paymentAssetNetwork:C.paymentAsset.network,activeCaipNetwork:i,approvedCaipNetworkIds:t,requestedCaipNetworks:e}),await s.I.open({view:"PayLoading"}),n){case m.b.CHAIN.EVM:"native"===C.paymentAsset.asset&&(C.currentPayment.result=await processEvmNativePayment(C.paymentAsset,n,{recipient:C.recipient,amount:C.amount,fromAddress:a})),C.paymentAsset.asset.startsWith("0x")&&(C.currentPayment.result=await processEvmErc20Payment(C.paymentAsset,{recipient:C.recipient,amount:C.amount,fromAddress:a})),C.currentPayment.status="SUCCESS";break;case m.b.CHAIN.SOLANA:C.currentPayment.result=await processSolanaPayment(n,{recipient:C.recipient,amount:C.amount,fromAddress:a,tokenMint:"native"===C.paymentAsset.asset?void 0:C.paymentAsset.asset}),C.currentPayment.status="SUCCESS";break;default:throw new AppKitPayError(A.INVALID_CHAIN_NAMESPACE)}}catch(e){e instanceof AppKitPayError?C.error=e.message:C.error=f.GENERIC_PAYMENT_ERROR,C.currentPayment.status="FAILED",l.SnackController.showError(C.error)}finally{C.isPaymentInProgress=!1}},getExchangeById:e=>C.exchanges.find(t=>t.id===e),validatePayConfig(e){let{paymentAsset:t,recipient:a,amount:n}=e;if(!t)throw new AppKitPayError(A.INVALID_PAYMENT_CONFIG);if(!a)throw new AppKitPayError(A.INVALID_RECIPIENT);if(!t.asset)throw new AppKitPayError(A.INVALID_ASSET);if(null==n||n<=0)throw new AppKitPayError(A.INVALID_AMOUNT)},handlePayWithWallet(){let e=o.R.getActiveCaipAddress();if(!e){E.RouterController.push("Connect");return}let{chainId:t,address:a}=h.u.parseCaipAddress(e),n=o.R.state.activeChain;if(!a||!t||!n){E.RouterController.push("Connect");return}this.handlePayment()},async handlePayWithExchange(e){try{C.currentPayment={type:"exchange",exchangeId:e};let{network:t,asset:a}=C.paymentAsset,n={network:t,asset:a,amount:C.amount,recipient:C.recipient},r=await this.getPayUrl(e,n);if(!r)throw new AppKitPayError(A.UNABLE_TO_INITIATE_PAYMENT);return C.currentPayment.sessionId=r.sessionId,C.currentPayment.status="IN_PROGRESS",C.currentPayment.exchangeId=e,this.initiatePayment(),{url:r.url,openInNewTab:C.openInNewTab}}catch(e){return e instanceof AppKitPayError?C.error=e.message:C.error=f.GENERIC_PAYMENT_ERROR,C.isPaymentInProgress=!1,l.SnackController.showError(C.error),null}},async getBuyStatus(e,t){try{let a=await getBuyStatus({sessionId:t,exchangeId:e});return("SUCCESS"===a.status||"FAILED"===a.status)&&g.X.sendEvent({type:"track",event:"SUCCESS"===a.status?"PAY_SUCCESS":"PAY_ERROR",properties:{message:"FAILED"===a.status?c.j.parseError(C.error):void 0,source:"pay",paymentId:C.paymentId||b,configuration:{network:C.paymentAsset.network,asset:C.paymentAsset.asset,recipient:C.recipient,amount:C.amount},currentPayment:{type:"exchange",exchangeId:C.currentPayment?.exchangeId,sessionId:C.currentPayment?.sessionId,result:a.txHash}}}),a}catch(e){throw new AppKitPayError(A.UNABLE_TO_GET_BUY_STATUS)}},async updateBuyStatus(e,t){try{let a=await this.getBuyStatus(e,t);C.currentPayment&&(C.currentPayment.status=a.status,C.currentPayment.result=a.txHash),("SUCCESS"===a.status||"FAILED"===a.status)&&(C.isPaymentInProgress=!1)}catch(e){throw new AppKitPayError(A.UNABLE_TO_GET_BUY_STATUS)}},initiatePayment(){C.isPaymentInProgress=!0,C.paymentId=crypto.randomUUID()},initializeAnalytics(){C.analyticsSet||(C.analyticsSet=!0,this.subscribeKey("isPaymentInProgress",e=>{if(C.currentPayment?.status&&"UNKNOWN"!==C.currentPayment.status){let e={IN_PROGRESS:"PAY_INITIATED",SUCCESS:"PAY_SUCCESS",FAILED:"PAY_ERROR"}[C.currentPayment.status];g.X.sendEvent({type:"track",event:e,properties:{message:"FAILED"===C.currentPayment.status?c.j.parseError(C.error):void 0,source:"pay",paymentId:C.paymentId||b,configuration:{network:C.paymentAsset.network,asset:C.paymentAsset.asset,recipient:C.recipient,amount:C.amount},currentPayment:{type:C.currentPayment.type,exchangeId:C.currentPayment.exchangeId,sessionId:C.currentPayment.sessionId,result:C.currentPayment.result}}})}}))}};var x=n.iv`
  wui-separator {
    margin: var(--apkt-spacing-3) calc(var(--apkt-spacing-3) * -1) var(--apkt-spacing-2)
      calc(var(--apkt-spacing-3) * -1);
    width: calc(100% + var(--apkt-spacing-3) * 2);
  }

  .token-display {
    padding: var(--apkt-spacing-3) var(--apkt-spacing-3);
    border-radius: var(--apkt-borderRadius-5);
    background-color: var(--apkt-tokens-theme-backgroundPrimary);
    margin-top: var(--apkt-spacing-3);
    margin-bottom: var(--apkt-spacing-3);
  }

  .token-display wui-text {
    text-transform: none;
  }

  wui-loading-spinner {
    padding: var(--apkt-spacing-2);
  }
`,__decorate=function(e,t,a,n){var r,i=arguments.length,o=i<3?t:null===n?n=Object.getOwnPropertyDescriptor(t,a):n;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)o=Reflect.decorate(e,t,a,n);else for(var s=e.length-1;s>=0;s--)(r=e[s])&&(o=(i<3?r(o):i>3?r(t,a,o):r(t,a))||o);return i>3&&o&&Object.defineProperty(t,a,o),o};let v=class extends n.oi{constructor(){super(),this.unsubscribe=[],this.amount="",this.tokenSymbol="",this.networkName="",this.exchanges=S.state.exchanges,this.isLoading=S.state.isLoading,this.loadingExchangeId=null,this.connectedWalletInfo=o.R.getAccountData()?.connectedWalletInfo,this.initializePaymentDetails(),this.unsubscribe.push(S.subscribeKey("exchanges",e=>this.exchanges=e)),this.unsubscribe.push(S.subscribeKey("isLoading",e=>this.isLoading=e)),this.unsubscribe.push(o.R.subscribeChainProp("accountState",e=>{this.connectedWalletInfo=e?.connectedWalletInfo})),S.fetchExchanges()}get isWalletConnected(){let e=o.R.getAccountData();return e?.status==="connected"}render(){return n.dy`
      <wui-flex flexDirection="column">
        <wui-flex flexDirection="column" .padding=${["0","4","4","4"]} gap="3">
          ${this.renderPaymentHeader()}

          <wui-flex flexDirection="column" gap="3">
            ${this.renderPayWithWallet()} ${this.renderExchangeOptions()}
          </wui-flex>
        </wui-flex>
      </wui-flex>
    `}initializePaymentDetails(){let e=S.getPaymentAsset();this.networkName=e.network,this.tokenSymbol=e.metadata.symbol,this.amount=S.state.amount.toString()}renderPayWithWallet(){return!function(e){let{chainNamespace:t}=h.u.parseCaipNetworkId(e);return I.includes(t)}(this.networkName)?n.dy``:n.dy`<wui-flex flexDirection="column" gap="3">
        ${this.isWalletConnected?this.renderConnectedView():this.renderDisconnectedView()}
      </wui-flex>
      <wui-separator text="or"></wui-separator>`}renderPaymentHeader(){let e=this.networkName;if(this.networkName){let t=o.R.getAllRequestedCaipNetworks(),a=t.find(e=>e.caipNetworkId===this.networkName);a&&(e=a.name)}return n.dy`
      <wui-flex flexDirection="column" alignItems="center">
        <wui-flex alignItems="center" gap="2">
          <wui-text variant="h1-regular" color="primary">${this.amount||"0.0000"}</wui-text>
          <wui-flex class="token-display" alignItems="center" gap="1">
            <wui-text variant="md-medium" color="primary">
              ${this.tokenSymbol||"Unknown Asset"}
            </wui-text>
            ${e?n.dy`
                  <wui-text variant="sm-medium" color="secondary">
                    on ${e}
                  </wui-text>
                `:""}
          </wui-flex>
        </wui-flex>
      </wui-flex>
    `}renderConnectedView(){let e=this.connectedWalletInfo?.name||"connected wallet";return n.dy`
      <wui-list-item
        @click=${this.onWalletPayment}
        ?chevron=${!0}
        ?fullSize=${!0}
        ?rounded=${!0}
        data-testid="wallet-payment-option"
        imageSrc=${(0,i.o)(this.connectedWalletInfo?.icon)}
      >
        <wui-text variant="lg-regular" color="primary">Pay with ${e}</wui-text>
      </wui-list-item>

      <wui-list-item
        icon="power"
        ?rounded=${!0}
        iconColor="error"
        @click=${this.onDisconnect}
        data-testid="disconnect-button"
        ?chevron=${!1}
      >
        <wui-text variant="lg-regular" color="secondary">Disconnect</wui-text>
      </wui-list-item>
    `}renderDisconnectedView(){return n.dy`<wui-list-item
      variant="icon"
      iconVariant="overlay"
      icon="wallet"
      ?rounded=${!0}
      @click=${this.onWalletPayment}
      ?chevron=${!0}
      data-testid="wallet-payment-option"
    >
      <wui-text variant="lg-regular" color="primary">Pay from wallet</wui-text>
    </wui-list-item>`}renderExchangeOptions(){return this.isLoading?n.dy`<wui-flex justifyContent="center" alignItems="center">
        <wui-spinner size="md"></wui-spinner>
      </wui-flex>`:0===this.exchanges.length?n.dy`<wui-flex justifyContent="center" alignItems="center">
        <wui-text variant="md-medium" color="primary">No exchanges available</wui-text>
      </wui-flex>`:this.exchanges.map(e=>n.dy`
        <wui-list-item
          @click=${()=>this.onExchangePayment(e.id)}
          data-testid="exchange-option-${e.id}"
          ?chevron=${!0}
          ?disabled=${null!==this.loadingExchangeId}
          ?loading=${this.loadingExchangeId===e.id}
          imageSrc=${(0,i.o)(e.imageUrl)}
        >
          <wui-flex alignItems="center" gap="3">
            <wui-text flexGrow="1" variant="md-medium" color="primary"
              >Pay with ${e.name} <wui-spinner size="sm" color="secondary"></wui-spinner
            ></wui-text>
          </wui-flex>
        </wui-list-item>
      `)}onWalletPayment(){S.handlePayWithWallet()}async onExchangePayment(e){try{this.loadingExchangeId=e;let t=await S.handlePayWithExchange(e);t&&(await s.I.open({view:"PayLoading"}),c.j.openHref(t.url,t.openInNewTab?"_blank":"_self"))}catch(e){console.error("Failed to pay with exchange",e),l.SnackController.showError("Failed to pay with exchange")}finally{this.loadingExchangeId=null}}async onDisconnect(e){e.stopPropagation();try{await u.ConnectionController.disconnect()}catch{console.error("Failed to disconnect"),l.SnackController.showError("Failed to disconnect")}}disconnectedCallback(){this.unsubscribe.forEach(e=>e())}};v.styles=x,__decorate([(0,r.SB)()],v.prototype,"amount",void 0),__decorate([(0,r.SB)()],v.prototype,"tokenSymbol",void 0),__decorate([(0,r.SB)()],v.prototype,"networkName",void 0),__decorate([(0,r.SB)()],v.prototype,"exchanges",void 0),__decorate([(0,r.SB)()],v.prototype,"isLoading",void 0),__decorate([(0,r.SB)()],v.prototype,"loadingExchangeId",void 0),__decorate([(0,r.SB)()],v.prototype,"connectedWalletInfo",void 0),v=__decorate([(0,d.Mo)("w3m-pay-view")],v);var T=a(12858),k=a(9793),R=a(44639);a(7013);var U=n.iv`
  :host {
    display: block;
    height: 100%;
    width: 100%;
  }

  wui-flex:first-child:not(:only-child) {
    position: relative;
  }

  wui-loading-thumbnail {
    position: absolute;
  }
`,w3m_pay_loading_view_decorate=function(e,t,a,n){var r,i=arguments.length,o=i<3?t:null===n?n=Object.getOwnPropertyDescriptor(t,a):n;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)o=Reflect.decorate(e,t,a,n);else for(var s=e.length-1;s>=0;s--)(r=e[s])&&(o=(i<3?r(o):i>3?r(t,a,o):r(t,a))||o);return i>3&&o&&Object.defineProperty(t,a,o),o};let D=class extends n.oi{constructor(){super(),this.loadingMessage="",this.subMessage="",this.paymentState="in-progress",this.paymentState=S.state.isPaymentInProgress?"in-progress":"completed",this.updateMessages(),this.setupSubscription(),this.setupExchangeSubscription()}disconnectedCallback(){clearInterval(this.exchangeSubscription)}render(){return n.dy`
      <wui-flex
        flexDirection="column"
        alignItems="center"
        .padding=${["7","5","5","5"]}
        gap="9"
      >
        <wui-flex justifyContent="center" alignItems="center"> ${this.getStateIcon()} </wui-flex>
        <wui-flex flexDirection="column" alignItems="center" gap="2">
          <wui-text align="center" variant="lg-medium" color="primary">
            ${this.loadingMessage}
          </wui-text>
          <wui-text align="center" variant="lg-regular" color="secondary">
            ${this.subMessage}
          </wui-text>
        </wui-flex>
      </wui-flex>
    `}updateMessages(){switch(this.paymentState){case"completed":this.loadingMessage="Payment completed",this.subMessage="Your transaction has been successfully processed";break;case"error":this.loadingMessage="Payment failed",this.subMessage="There was an error processing your transaction";break;default:S.state.currentPayment?.type==="exchange"?(this.loadingMessage="Payment initiated",this.subMessage="Please complete the payment on the exchange"):(this.loadingMessage="Awaiting payment confirmation",this.subMessage="Please confirm the payment transaction in your wallet")}}getStateIcon(){switch(this.paymentState){case"completed":return this.successTemplate();case"error":return this.errorTemplate();default:return this.loaderTemplate()}}setupExchangeSubscription(){S.state.currentPayment?.type==="exchange"&&(this.exchangeSubscription=setInterval(async()=>{let e=S.state.currentPayment?.exchangeId,t=S.state.currentPayment?.sessionId;e&&t&&(await S.updateBuyStatus(e,t),S.state.currentPayment?.status==="SUCCESS"&&clearInterval(this.exchangeSubscription))},4e3))}setupSubscription(){S.subscribeKey("isPaymentInProgress",e=>{e||"in-progress"!==this.paymentState||(S.state.error||!S.state.currentPayment?.result?this.paymentState="error":this.paymentState="completed",this.updateMessages(),setTimeout(()=>{"disconnected"!==u.ConnectionController.state.status&&s.I.close()},3e3))}),S.subscribeKey("error",e=>{e&&"in-progress"===this.paymentState&&(this.paymentState="error",this.updateMessages())})}loaderTemplate(){let e=T.ThemeController.state.themeVariables["--w3m-border-radius-master"],t=e?parseInt(e.replace("px",""),10):4,a=this.getPaymentIcon();return n.dy`
      <wui-flex justifyContent="center" alignItems="center" style="position: relative;">
        ${a?n.dy`<wui-wallet-image size="lg" imageSrc=${a}></wui-wallet-image>`:null}
        <wui-loading-thumbnail radius=${9*t}></wui-loading-thumbnail>
      </wui-flex>
    `}getPaymentIcon(){let e=S.state.currentPayment;if(e){if("exchange"===e.type){let t=e.exchangeId;if(t){let e=S.getExchangeById(t);return e?.imageUrl}}if("wallet"===e.type){let e=o.R.getAccountData()?.connectedWalletInfo?.icon;if(e)return e;let t=o.R.state.activeChain;if(!t)return;let a=k.ConnectorController.getConnectorId(t);if(!a)return;let n=k.ConnectorController.getConnectorById(a);if(!n)return;return R.f.getConnectorImage(n)}}}successTemplate(){return n.dy`<wui-icon size="xl" color="success" name="checkmark"></wui-icon>`}errorTemplate(){return n.dy`<wui-icon size="xl" color="error" name="close"></wui-icon>`}};async function openPay(e){return S.handleOpenPay(e)}async function pay(e,t=3e5){if(t<=0)throw new AppKitPayError(A.INVALID_PAYMENT_CONFIG,"Timeout must be greater than 0");try{await openPay(e)}catch(e){if(e instanceof AppKitPayError)throw e;throw new AppKitPayError(A.UNABLE_TO_INITIATE_PAYMENT,e.message)}return new Promise((e,a)=>{var n;let r=!1,i=setTimeout(()=>{r||(r=!0,l(),a(new AppKitPayError(A.GENERIC_PAYMENT_ERROR,"Payment timeout")))},t);function checkAndResolve(){if(r)return;let t=S.state.currentPayment,a=S.state.error,n=S.state.isPaymentInProgress;if(t?.status==="SUCCESS"){r=!0,l(),clearTimeout(i),e({success:!0,result:t.result});return}if(t?.status==="FAILED"){r=!0,l(),clearTimeout(i),e({success:!1,error:a||"Payment failed"});return}!a||n||t||(r=!0,l(),clearTimeout(i),e({success:!1,error:a}))}let o=subscribeStateKey("currentPayment",checkAndResolve),s=subscribeStateKey("error",checkAndResolve),c=subscribeStateKey("isPaymentInProgress",checkAndResolve),l=(n=[o,s,c],()=>{n.forEach(e=>{try{e()}catch{}})});checkAndResolve()})}function client_getExchanges(){return S.getExchanges()}function getPayResult(){return S.state.currentPayment?.result}function getPayError(){return S.state.error}function getIsPaymentInProgress(){return S.state.isPaymentInProgress}function subscribeStateKey(e,t){return S.subscribeKey(e,t)}D.styles=U,w3m_pay_loading_view_decorate([(0,r.SB)()],D.prototype,"loadingMessage",void 0),w3m_pay_loading_view_decorate([(0,r.SB)()],D.prototype,"subMessage",void 0),w3m_pay_loading_view_decorate([(0,r.SB)()],D.prototype,"paymentState",void 0),D=w3m_pay_loading_view_decorate([(0,d.Mo)("w3m-pay-loading-view")],D);let O={network:"eip155:8453",asset:"native",metadata:{name:"Ethereum",symbol:"ETH",decimals:18}},L={network:"eip155:8453",asset:"0x833589fcd6edb6e08f4c7c32d4f71b54bda02913",metadata:{name:"USD Coin",symbol:"USDC",decimals:6}},M={network:"eip155:84532",asset:"native",metadata:{name:"Ethereum",symbol:"ETH",decimals:18}},$={network:"eip155:1",asset:"0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",metadata:{name:"USD Coin",symbol:"USDC",decimals:6}},K={network:"eip155:10",asset:"0x0b2c639c533813f4aa9d7837caf62653d097ff85",metadata:{name:"USD Coin",symbol:"USDC",decimals:6}},G={network:"eip155:42161",asset:"0xaf88d065e77c8cC2239327C5EDb3A432268e5831",metadata:{name:"USD Coin",symbol:"USDC",decimals:6}},Y={network:"eip155:137",asset:"0x3c499c542cef5e3811e1192ce70d8cc03d5c3359",metadata:{name:"USD Coin",symbol:"USDC",decimals:6}},B={network:"solana:5eykt4UsFv8P8NJdTREpY1vzqKqZKvdp",asset:"EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",metadata:{name:"USD Coin",symbol:"USDC",decimals:6}},V={network:"eip155:1",asset:"0xdAC17F958D2ee523a2206206994597C13D831ec7",metadata:{name:"Tether USD",symbol:"USDT",decimals:6}},W={network:"eip155:10",asset:"0x94b008aA00579c1307B0EF2c499aD98a8ce58e58",metadata:{name:"Tether USD",symbol:"USDT",decimals:6}},F={network:"eip155:42161",asset:"0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9",metadata:{name:"Tether USD",symbol:"USDT",decimals:6}},z={network:"eip155:137",asset:"0xc2132d05d31c914a87c6611c10748aeb04b58e8f",metadata:{name:"Tether USD",symbol:"USDT",decimals:6}},H={network:"solana:5eykt4UsFv8P8NJdTREpY1vzqKqZKvdp",asset:"Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB",metadata:{name:"Tether USD",symbol:"USDT",decimals:6}},j={network:"solana:5eykt4UsFv8P8NJdTREpY1vzqKqZKvdp",asset:"native",metadata:{name:"Solana",symbol:"SOL",decimals:9}}},54530:function(e,t,a){var n=a(19064),r=a(59662),i=a(35162);a(21927);var o=a(24134),s=a(25729),c=a(95636),l=c.iv`
  :host {
    position: relative;
  }

  button {
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: transparent;
    padding: ${({spacing:e})=>e[1]};
  }

  /* -- Colors --------------------------------------------------- */
  button[data-type='accent'] wui-icon {
    color: ${({tokens:e})=>e.core.iconAccentPrimary};
  }

  button[data-type='neutral'][data-variant='primary'] wui-icon {
    color: ${({tokens:e})=>e.theme.iconInverse};
  }

  button[data-type='neutral'][data-variant='secondary'] wui-icon {
    color: ${({tokens:e})=>e.theme.iconDefault};
  }

  button[data-type='success'] wui-icon {
    color: ${({tokens:e})=>e.core.iconSuccess};
  }

  button[data-type='error'] wui-icon {
    color: ${({tokens:e})=>e.core.iconError};
  }

  /* -- Sizes --------------------------------------------------- */
  button[data-size='xs'] {
    width: 16px;
    height: 16px;

    border-radius: ${({borderRadius:e})=>e[1]};
  }

  button[data-size='sm'] {
    width: 20px;
    height: 20px;
    border-radius: ${({borderRadius:e})=>e[1]};
  }

  button[data-size='md'] {
    width: 24px;
    height: 24px;
    border-radius: ${({borderRadius:e})=>e[2]};
  }

  button[data-size='lg'] {
    width: 28px;
    height: 28px;
    border-radius: ${({borderRadius:e})=>e[2]};
  }

  button[data-size='xs'] wui-icon {
    width: 8px;
    height: 8px;
  }

  button[data-size='sm'] wui-icon {
    width: 12px;
    height: 12px;
  }

  button[data-size='md'] wui-icon {
    width: 16px;
    height: 16px;
  }

  button[data-size='lg'] wui-icon {
    width: 20px;
    height: 20px;
  }

  /* -- Hover --------------------------------------------------- */
  @media (hover: hover) {
    button[data-type='accent']:hover:enabled {
      background-color: ${({tokens:e})=>e.core.foregroundAccent010};
    }

    button[data-variant='primary'][data-type='neutral']:hover:enabled {
      background-color: ${({tokens:e})=>e.theme.foregroundSecondary};
    }

    button[data-variant='secondary'][data-type='neutral']:hover:enabled {
      background-color: ${({tokens:e})=>e.theme.foregroundSecondary};
    }

    button[data-type='success']:hover:enabled {
      background-color: ${({tokens:e})=>e.core.backgroundSuccess};
    }

    button[data-type='error']:hover:enabled {
      background-color: ${({tokens:e})=>e.core.backgroundError};
    }
  }

  /* -- Focus --------------------------------------------------- */
  button:focus-visible {
    box-shadow: 0 0 0 4px ${({tokens:e})=>e.core.foregroundAccent020};
  }

  /* -- Properties --------------------------------------------------- */
  button[data-full-width='true'] {
    width: 100%;
  }

  :host([fullWidth]) {
    width: 100%;
  }

  button[disabled] {
    opacity: 0.5;
    cursor: not-allowed;
  }
`,__decorate=function(e,t,a,n){var r,i=arguments.length,o=i<3?t:null===n?n=Object.getOwnPropertyDescriptor(t,a):n;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)o=Reflect.decorate(e,t,a,n);else for(var s=e.length-1;s>=0;s--)(r=e[s])&&(o=(i<3?r(o):i>3?r(t,a,o):r(t,a))||o);return i>3&&o&&Object.defineProperty(t,a,o),o};let u=class extends n.oi{constructor(){super(...arguments),this.icon="card",this.variant="primary",this.type="accent",this.size="md",this.iconSize=void 0,this.fullWidth=!1,this.disabled=!1}render(){return n.dy`<button
      data-variant=${this.variant}
      data-type=${this.type}
      data-size=${this.size}
      data-full-width=${this.fullWidth}
      ?disabled=${this.disabled}
    >
      <wui-icon color="inherit" name=${this.icon} size=${(0,i.o)(this.iconSize)}></wui-icon>
    </button>`}};u.styles=[o.ET,o.ZM,l],__decorate([(0,r.Cb)()],u.prototype,"icon",void 0),__decorate([(0,r.Cb)()],u.prototype,"variant",void 0),__decorate([(0,r.Cb)()],u.prototype,"type",void 0),__decorate([(0,r.Cb)()],u.prototype,"size",void 0),__decorate([(0,r.Cb)()],u.prototype,"iconSize",void 0),__decorate([(0,r.Cb)({type:Boolean})],u.prototype,"fullWidth",void 0),__decorate([(0,r.Cb)({type:Boolean})],u.prototype,"disabled",void 0),__decorate([(0,s.M)("wui-icon-button")],u)},87809:function(e,t,a){a(31059)}}]);