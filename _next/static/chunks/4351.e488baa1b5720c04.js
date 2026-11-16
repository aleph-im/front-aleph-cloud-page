"use strict";(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[4351],{41473:(e,t,i)=>{i(56349)},71377:(e,t,i)=>{var a=i(1850),n=i(58446),s=i(12689);i(13496);var r=i(54684),o=i(51127),c=i(41608);let l=(0,c.AH)`
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
`;var u=function(e,t,i,a){var n,s=arguments.length,r=s<3?t:null===a?a=Object.getOwnPropertyDescriptor(t,i):a;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)r=Reflect.decorate(e,t,i,a);else for(var o=e.length-1;o>=0;o--)(n=e[o])&&(r=(s<3?n(r):s>3?n(t,i,r):n(t,i))||r);return s>3&&r&&Object.defineProperty(t,i,r),r};let d=class extends a.WF{constructor(){super(...arguments),this.icon="card",this.variant="primary",this.type="accent",this.size="md",this.iconSize=void 0,this.fullWidth=!1,this.disabled=!1}render(){return(0,a.qy)`<button
      data-variant=${this.variant}
      data-type=${this.type}
      data-size=${this.size}
      data-full-width=${this.fullWidth}
      ?disabled=${this.disabled}
    >
      <wui-icon color="inherit" name=${this.icon} size=${(0,s.J)(this.iconSize)}></wui-icon>
    </button>`}};d.styles=[r.W5,r.fD,l],u([(0,n.MZ)()],d.prototype,"icon",void 0),u([(0,n.MZ)()],d.prototype,"variant",void 0),u([(0,n.MZ)()],d.prototype,"type",void 0),u([(0,n.MZ)()],d.prototype,"size",void 0),u([(0,n.MZ)()],d.prototype,"iconSize",void 0),u([(0,n.MZ)({type:Boolean})],d.prototype,"fullWidth",void 0),u([(0,n.MZ)({type:Boolean})],d.prototype,"disabled",void 0),d=u([(0,o.E)("wui-icon-button")],d)},94351:(e,t,i)=>{i.r(t),i.d(t,{PayController:()=>ef,W3mPayLoadingView:()=>eO,W3mPayQuoteView:()=>eV,W3mPayView:()=>ev,arbitrumUSDC:()=>tt,arbitrumUSDT:()=>tr,baseETH:()=>e8,baseSepoliaETH:()=>e9,baseUSDC:()=>e6,ethereumUSDC:()=>e7,ethereumUSDT:()=>tn,getExchanges:()=>e1,getIsPaymentInProgress:()=>e2,getPayError:()=>e5,getPayResult:()=>e3,openPay:()=>eX,optimismUSDC:()=>te,optimismUSDT:()=>ts,pay:()=>e0,polygonUSDC:()=>ti,polygonUSDT:()=>to,solanaSOL:()=>tl,solanaUSDC:()=>ta,solanaUSDT:()=>tc});var a=i(1850),n=i(58446),s=i(12689),r=i(70803),o=i(933),c=i(11464),l=i(51105),u=i(24417),d=i(26064),p=i(82570),m=i(44458);i(34556),i(85479),i(80729),i(71377),i(28824),i(41473),i(15241),i(17244),i(75260),i(38885),i(60347),i(85497);var h=i(25828),y=i(81334),g=i(96853),w=i(65687),f=i(99400),b=i(24101),x=i(21159),v=i(78226),k=i(1235);let P="INVALID_PAYMENT_CONFIG",S="INVALID_RECIPIENT",A="INVALID_ASSET",I="INVALID_AMOUNT",E="UNABLE_TO_INITIATE_PAYMENT",C="INVALID_CHAIN_NAMESPACE",$="GENERIC_PAYMENT_ERROR",N="UNABLE_TO_GET_EXCHANGES",T="ASSET_NOT_SUPPORTED",q="UNABLE_TO_GET_PAY_URL",U="UNABLE_TO_GET_BUY_STATUS",R="UNABLE_TO_GET_QUOTE",O="UNABLE_TO_GET_QUOTE_STATUS",D="INVALID_RECIPIENT_ADDRESS_FOR_ASSET",W={[P]:"Invalid payment configuration",[S]:"Invalid recipient address",[A]:"Invalid asset specified",[I]:"Invalid payment amount",[D]:"Invalid recipient address for the asset selected",UNKNOWN_ERROR:"Unknown payment error occurred",[E]:"Unable to initiate payment",[C]:"Invalid chain namespace",[$]:"Unable to process payment",[N]:"Unable to get exchanges",[T]:"Asset not supported by the selected exchange",[q]:"Unable to get payment URL",[U]:"Unable to get buy status",UNABLE_TO_GET_TOKEN_BALANCES:"Unable to get token balances",[R]:"Unable to get quote. Please choose a different token",[O]:"Unable to get quote status"};class F extends Error{get message(){return W[this.code]}constructor(e,t){super(W[e]),this.name="AppKitPayError",this.code=e,this.details=t,Error.captureStackTrace&&Error.captureStackTrace(this,F)}}var j=i(27112),_=i(59390),z=i(81805);let L="reown_test";var M=i(43175),B=i(15093);async function Q(e,t,i){if(t!==g.o.CHAIN.EVM)throw new F(C);if(!i.fromAddress)throw new F(P,"fromAddress is required for native EVM payments.");let a="string"==typeof i.amount?parseFloat(i.amount):i.amount;if(isNaN(a))throw new F(P);let n=e.metadata?.decimals??18,s=d.x.parseUnits(a.toString(),n);if("bigint"!=typeof s)throw new F($);return await d.x.sendTransaction({chainNamespace:t,to:i.recipient,address:i.fromAddress,value:s,data:"0x"})??void 0}async function H(e,t){if(!t.fromAddress)throw new F(P,"fromAddress is required for ERC20 EVM payments.");let i=e.asset,a=t.recipient,n=Number(e.metadata.decimals),s=d.x.parseUnits(t.amount.toString(),n);if(void 0===s)throw new F($);return await d.x.writeContract({fromAddress:t.fromAddress,tokenAddress:i,args:[a,s],method:"transfer",abi:M.v.getERC20Abi(i),chainNamespace:g.o.CHAIN.EVM})??void 0}async function K(e,t){if(e!==g.o.CHAIN.SOLANA)throw new F(C);if(!t.fromAddress)throw new F(P,"fromAddress is required for Solana payments.");let i="string"==typeof t.amount?parseFloat(t.amount):t.amount;if(isNaN(i)||i<=0)throw new F(P,"Invalid payment amount.");try{if(!B.G.getProvider(e))throw new F($,"No Solana provider available.");let a=await d.x.sendTransaction({chainNamespace:g.o.CHAIN.SOLANA,to:t.recipient,value:i,tokenMint:t.tokenMint});if(!a)throw new F($,"Transaction failed.");return a}catch(e){if(e instanceof F)throw e;throw new F($,`Solana payment failed: ${e}`)}}async function G({sourceToken:e,toToken:t,amount:i,recipient:a}){let n=d.x.parseUnits(i,e.metadata.decimals),s=d.x.parseUnits(i,t.metadata.decimals);return Promise.resolve({type:eh,origin:{amount:n?.toString()??"0",currency:e},destination:{amount:s?.toString()??"0",currency:t},fees:[{id:"service",label:"Service Fee",amount:"0",currency:t}],steps:[{requestId:eh,type:"deposit",deposit:{amount:n?.toString()??"0",currency:e.asset,receiver:a}}],timeInSeconds:6})}function Y(e){if(!e)return null;let t=e.steps[0];return t&&t.type===ey?t:null}function J(e,t=0){if(!e)return[];let i=e.steps.filter(e=>e.type===eg),a=i.filter((e,i)=>i+1>t);return i.length>0&&i.length<3?a:[]}let Z=new j.Z({baseUrl:x.w.getApiUrl(),clientId:null});class V extends Error{}function X(){let{projectId:e,sdkType:t,sdkVersion:i}=_.H.state;return{projectId:e,st:t||"appkit",sv:i||"html-wagmi-4.2.2"}}async function ee(e,t){let i,a=(i=_.H.getSnapshot().projectId,`https://rpc.walletconnect.org/v1/json-rpc?projectId=${i}`),{sdkType:n,sdkVersion:s,projectId:r}=_.H.getSnapshot(),o={jsonrpc:"2.0",id:1,method:e,params:{...t||{},st:n,sv:s,projectId:r}},c=await fetch(a,{method:"POST",body:JSON.stringify(o),headers:{"Content-Type":"application/json"}}),l=await c.json();if(l.error)throw new V(l.error.message);return l}async function et(e){return(await ee("reown_getExchanges",e)).result}async function ei(e){return(await ee("reown_getExchangePayUrl",e)).result}async function ea(e){return(await ee("reown_getExchangeBuyStatus",e)).result}async function en(e){let t=f.S.bigNumber(e.amount).times(10**e.toToken.metadata.decimals).toString(),{chainId:i,chainNamespace:a}=w.C.parseCaipNetworkId(e.sourceToken.network),{chainId:n,chainNamespace:s}=w.C.parseCaipNetworkId(e.toToken.network),r="native"===e.sourceToken.asset?(0,z.NH)(a):e.sourceToken.asset,o="native"===e.toToken.asset?(0,z.NH)(s):e.toToken.asset;return await Z.post({path:"/appkit/v1/transfers/quote",body:{user:e.address,originChainId:i.toString(),originCurrency:r,destinationChainId:n.toString(),destinationCurrency:o,recipient:e.recipient,amount:t},params:X()})}async function es(e){let t=k.y.isLowerCaseMatch(e.sourceToken.network,e.toToken.network),i=k.y.isLowerCaseMatch(e.sourceToken.asset,e.toToken.asset);return t&&i?G(e):en(e)}async function er(e){return await Z.get({path:"/appkit/v1/transfers/status",params:{requestId:e.requestId,...X()}})}async function eo(e){return await Z.get({path:`/appkit/v1/transfers/assets/exchanges/${e}`,params:X()})}let ec=["eip155","solana"],el={eip155:{native:{assetNamespace:"slip44",assetReference:"60"},defaultTokenNamespace:"erc20"},solana:{native:{assetNamespace:"slip44",assetReference:"501"},defaultTokenNamespace:"token"}},eu={56:"714",204:"714"};function ed(e,t){let{chainNamespace:i,chainId:a}=w.C.parseCaipNetworkId(e),n=el[i];if(!n)throw Error(`Unsupported chain namespace for CAIP-19 formatting: ${i}`);let s=n.native.assetNamespace,r=n.native.assetReference;"native"!==t?(s=n.defaultTokenNamespace,r=t):"eip155"===i&&eu[a]&&(r=eu[a]);let o=`${i}:${a}`;return`${o}/${s}:${r}`}function ep(e){let t=f.S.bigNumber(e,{safe:!0});return t.lt(.001)?"<0.001":t.round(4).toString()}let em="unknown",eh="direct-transfer",ey="deposit",eg="transaction",ew=(0,h.BX)({paymentAsset:{network:"eip155:1",asset:"0x0",metadata:{name:"0x0",symbol:"0x0",decimals:0}},recipient:"0x0",amount:0,isConfigured:!1,error:null,isPaymentInProgress:!1,exchanges:[],isLoading:!1,openInNewTab:!0,redirectUrl:void 0,payWithExchange:void 0,currentPayment:void 0,analyticsSet:!1,paymentId:void 0,choice:"pay",tokenBalances:{[g.o.CHAIN.EVM]:[],[g.o.CHAIN.SOLANA]:[]},isFetchingTokenBalances:!1,selectedPaymentAsset:null,quote:void 0,quoteStatus:"waiting",quoteError:null,isFetchingQuote:!1,selectedExchange:void 0,exchangeUrlForQuote:void 0,requestId:void 0}),ef={state:ew,subscribe:e=>(0,h.B1)(ew,()=>e(ew)),subscribeKey:(e,t)=>(0,y.u$)(ew,e,t),async handleOpenPay(e){this.resetState(),this.setPaymentConfig(e),this.initializeAnalytics(),function(){let{chainNamespace:e}=w.C.parseCaipNetworkId(ef.state.paymentAsset.network);if(!x.w.isAddress(ef.state.recipient,e))throw new F(D,`Provide valid recipient address for namespace "${e}"`)}(),await this.prepareTokenLogo(),ew.isConfigured=!0,b.E.sendEvent({type:"track",event:"PAY_MODAL_OPEN",properties:{exchanges:ew.exchanges,configuration:{network:ew.paymentAsset.network,asset:ew.paymentAsset.asset,recipient:ew.recipient,amount:ew.amount}}}),await u.W.open({view:"Pay"})},resetState(){ew.paymentAsset={network:"eip155:1",asset:"0x0",metadata:{name:"0x0",symbol:"0x0",decimals:0}},ew.recipient="0x0",ew.amount=0,ew.isConfigured=!1,ew.error=null,ew.isPaymentInProgress=!1,ew.isLoading=!1,ew.currentPayment=void 0,ew.selectedExchange=void 0,ew.exchangeUrlForQuote=void 0,ew.requestId=void 0},resetQuoteState(){ew.quote=void 0,ew.quoteStatus="waiting",ew.quoteError=null,ew.isFetchingQuote=!1,ew.requestId=void 0},setPaymentConfig(e){if(!e.paymentAsset)throw new F(P);try{ew.choice=e.choice??"pay",ew.paymentAsset=e.paymentAsset,ew.recipient=e.recipient,ew.amount=e.amount,ew.openInNewTab=e.openInNewTab??!0,ew.redirectUrl=e.redirectUrl,ew.payWithExchange=e.payWithExchange,ew.error=null}catch(e){throw new F(P,e.message)}},setSelectedPaymentAsset(e){ew.selectedPaymentAsset=e},setSelectedExchange(e){ew.selectedExchange=e},setRequestId(e){ew.requestId=e},setPaymentInProgress(e){ew.isPaymentInProgress=e},getPaymentAsset:()=>ew.paymentAsset,getExchanges:()=>ew.exchanges,async fetchExchanges(){try{ew.isLoading=!0,ew.exchanges=(await et({page:0})).exchanges.slice(0,2)}catch(e){throw p.P.showError(W.UNABLE_TO_GET_EXCHANGES),new F(N)}finally{ew.isLoading=!1}},async getAvailableExchanges(e){try{let t=e?.asset&&e?.network?ed(e.network,e.asset):void 0;return await et({page:e?.page??0,asset:t,amount:e?.amount?.toString()})}catch(e){throw new F(N)}},async getPayUrl(e,t,i=!1){try{let a=Number(t.amount),n=await ei({exchangeId:e,asset:ed(t.network,t.asset),amount:a.toString(),recipient:`${t.network}:${t.recipient}`});return b.E.sendEvent({type:"track",event:"PAY_EXCHANGE_SELECTED",properties:{source:"pay",exchange:{id:e},configuration:{network:t.network,asset:t.asset,recipient:t.recipient,amount:a},currentPayment:{type:"exchange",exchangeId:e},headless:i}}),i&&(this.initiatePayment(),b.E.sendEvent({type:"track",event:"PAY_INITIATED",properties:{source:"pay",paymentId:ew.paymentId||em,configuration:{network:t.network,asset:t.asset,recipient:t.recipient,amount:a},currentPayment:{type:"exchange",exchangeId:e}}})),n}catch(e){if(e instanceof Error&&e.message.includes("is not supported"))throw new F(T);throw Error(e.message)}},async generateExchangeUrlForQuote({exchangeId:e,paymentAsset:t,amount:i,recipient:a}){let n=await ei({exchangeId:e,asset:ed(t.network,t.asset),amount:i.toString(),recipient:a});ew.exchangeSessionId=n.sessionId,ew.exchangeUrlForQuote=n.url},async openPayUrl(e,t,i=!1){try{let a=await this.getPayUrl(e.exchangeId,t,i);if(!a)throw new F(q);let n=e.openInNewTab??!0;return x.w.openHref(a.url,n?"_blank":"_self"),a}catch(e){throw e instanceof F?ew.error=e.message:ew.error=W.GENERIC_PAYMENT_ERROR,new F(q)}},async onTransfer({chainNamespace:e,fromAddress:t,toAddress:i,amount:a,paymentAsset:n}){if(ew.currentPayment={type:"wallet",status:"IN_PROGRESS"},!ew.isPaymentInProgress)try{this.initiatePayment();let s=o.W.getAllRequestedCaipNetworks().find(e=>e.caipNetworkId===n.network);if(!s)throw Error("Target network not found");let r=o.W.state.activeCaipNetwork;switch(!k.y.isLowerCaseMatch(r?.caipNetworkId,s.caipNetworkId)&&await o.W.switchActiveNetwork(s),e){case g.o.CHAIN.EVM:"native"===n.asset&&(ew.currentPayment.result=await Q(n,e,{recipient:i,amount:a,fromAddress:t})),n.asset.startsWith("0x")&&(ew.currentPayment.result=await H(n,{recipient:i,amount:a,fromAddress:t})),ew.currentPayment.status="SUCCESS";break;case g.o.CHAIN.SOLANA:ew.currentPayment.result=await K(e,{recipient:i,amount:a,fromAddress:t,tokenMint:"native"===n.asset?void 0:n.asset}),ew.currentPayment.status="SUCCESS";break;default:throw new F(C)}}catch(e){throw e instanceof F?ew.error=e.message:ew.error=W.GENERIC_PAYMENT_ERROR,ew.currentPayment.status="FAILED",p.P.showError(ew.error),e}finally{ew.isPaymentInProgress=!1}},async onSendTransaction(e){try{let{namespace:t,transactionStep:i}=e;ef.initiatePayment();let a=o.W.getAllRequestedCaipNetworks().find(e=>e.caipNetworkId===ew.paymentAsset?.network);if(!a)throw Error("Target network not found");let n=o.W.state.activeCaipNetwork;if(k.y.isLowerCaseMatch(n?.caipNetworkId,a.caipNetworkId)||await o.W.switchActiveNetwork(a),t===g.o.CHAIN.EVM){let{from:e,to:a,data:n,value:s}=i.transaction;await d.x.sendTransaction({address:e,to:a,data:n,value:BigInt(s),chainNamespace:t})}else if(t===g.o.CHAIN.SOLANA){let{instructions:e}=i.transaction;await d.x.writeSolanaTransaction({instructions:e})}}catch(e){throw e instanceof F?ew.error=e.message:ew.error=W.GENERIC_PAYMENT_ERROR,p.P.showError(ew.error),e}finally{ew.isPaymentInProgress=!1}},getExchangeById:e=>ew.exchanges.find(t=>t.id===e),validatePayConfig(e){let{paymentAsset:t,recipient:i,amount:a}=e;if(!t)throw new F(P);if(!i)throw new F(S);if(!t.asset)throw new F(A);if(null==a||a<=0)throw new F(I)},async handlePayWithExchange(e){try{ew.currentPayment={type:"exchange",exchangeId:e};let{network:t,asset:i}=ew.paymentAsset,a={network:t,asset:i,amount:ew.amount,recipient:ew.recipient},n=await this.getPayUrl(e,a);if(!n)throw new F(E);return ew.currentPayment.sessionId=n.sessionId,ew.currentPayment.status="IN_PROGRESS",ew.currentPayment.exchangeId=e,this.initiatePayment(),{url:n.url,openInNewTab:ew.openInNewTab}}catch(e){return e instanceof F?ew.error=e.message:ew.error=W.GENERIC_PAYMENT_ERROR,ew.isPaymentInProgress=!1,p.P.showError(ew.error),null}},async getBuyStatus(e,t){try{let i=await ea({sessionId:t,exchangeId:e});return("SUCCESS"===i.status||"FAILED"===i.status)&&b.E.sendEvent({type:"track",event:"SUCCESS"===i.status?"PAY_SUCCESS":"PAY_ERROR",properties:{message:"FAILED"===i.status?x.w.parseError(ew.error):void 0,source:"pay",paymentId:ew.paymentId||em,configuration:{network:ew.paymentAsset.network,asset:ew.paymentAsset.asset,recipient:ew.recipient,amount:ew.amount},currentPayment:{type:"exchange",exchangeId:ew.currentPayment?.exchangeId,sessionId:ew.currentPayment?.sessionId,result:i.txHash}}}),i}catch(e){throw new F(U)}},async fetchTokensFromEOA({caipAddress:e,caipNetwork:t,namespace:i}){if(!e)return[];let{address:a}=w.C.parseCaipAddress(e),n=t;return i===g.o.CHAIN.EVM&&(n=void 0),await v.Z.getMyTokensWithBalance({address:a,caipNetwork:n})},async fetchTokensFromExchange(){if(!ew.selectedExchange)return[];let e=Object.values((await eo(ew.selectedExchange.id)).assets).flat();return await Promise.all(e.map(async e=>{let t={chainId:e.network,address:`${e.network}:${e.asset}`,symbol:e.metadata.symbol,name:e.metadata.name,iconUrl:e.metadata.logoURI||"",price:0,quantity:{numeric:"0",decimals:e.metadata.decimals.toString()}},{chainNamespace:i}=w.C.parseCaipNetworkId(t.chainId),a=t.address;if(x.w.isCaipAddress(a)){let{address:e}=w.C.parseCaipAddress(a);a=e}return t.iconUrl=await c.$.getImageByToken(a??"",i).catch(()=>void 0)??"",t}))},async fetchTokens({caipAddress:e,caipNetwork:t,namespace:i}){try{ew.isFetchingTokenBalances=!0;let a=ew.selectedExchange?this.fetchTokensFromExchange():this.fetchTokensFromEOA({caipAddress:e,caipNetwork:t,namespace:i}),n=await a;ew.tokenBalances={...ew.tokenBalances,[i]:n}}catch(t){let e=t instanceof Error?t.message:"Unable to get token balances";p.P.showError(e)}finally{ew.isFetchingTokenBalances=!1}},async fetchQuote({amount:e,address:t,sourceToken:i,toToken:a,recipient:n}){try{ef.resetQuoteState(),ew.isFetchingQuote=!0;let s=await es({amount:e,address:ew.selectedExchange?void 0:t,sourceToken:i,toToken:a,recipient:n});if(ew.selectedExchange){let e=Y(s);if(e){let t=`${i.network}:${e.deposit.receiver}`,a=f.S.formatNumber(e.deposit.amount,{decimals:i.metadata.decimals??0,round:8});await ef.generateExchangeUrlForQuote({exchangeId:ew.selectedExchange.id,paymentAsset:i,amount:a.toString(),recipient:t})}}ew.quote=s}catch(t){let e=W.UNABLE_TO_GET_QUOTE;if(t instanceof Error&&t.cause&&t.cause instanceof Response)try{let i=await t.cause.json();i.error&&"string"==typeof i.error&&(e=i.error)}catch{}throw ew.quoteError=e,p.P.showError(e),new F(R)}finally{ew.isFetchingQuote=!1}},async fetchQuoteStatus({requestId:e}){try{if(e===eh){let e=ew.selectedExchange,t=ew.exchangeSessionId;if(e&&t){switch((await this.getBuyStatus(e.id,t)).status){case"IN_PROGRESS":case"UNKNOWN":default:ew.quoteStatus="waiting";break;case"SUCCESS":ew.quoteStatus="success",ew.isPaymentInProgress=!1;break;case"FAILED":ew.quoteStatus="failure",ew.isPaymentInProgress=!1}return}ew.quoteStatus="success";return}let{status:t}=await er({requestId:e});ew.quoteStatus=t}catch{throw ew.quoteStatus="failure",new F(O)}},initiatePayment(){ew.isPaymentInProgress=!0,ew.paymentId=crypto.randomUUID()},initializeAnalytics(){ew.analyticsSet||(ew.analyticsSet=!0,this.subscribeKey("isPaymentInProgress",e=>{if(ew.currentPayment?.status&&"UNKNOWN"!==ew.currentPayment.status){let e={IN_PROGRESS:"PAY_INITIATED",SUCCESS:"PAY_SUCCESS",FAILED:"PAY_ERROR"}[ew.currentPayment.status];b.E.sendEvent({type:"track",event:e,properties:{message:"FAILED"===ew.currentPayment.status?x.w.parseError(ew.error):void 0,source:"pay",paymentId:ew.paymentId||em,configuration:{network:ew.paymentAsset.network,asset:ew.paymentAsset.asset,recipient:ew.recipient,amount:ew.amount},currentPayment:{type:ew.currentPayment.type,exchangeId:ew.currentPayment.exchangeId,sessionId:ew.currentPayment.sessionId,result:ew.currentPayment.result}}})}}))},async prepareTokenLogo(){if(!ew.paymentAsset.metadata.logoURI)try{let{chainNamespace:e}=w.C.parseCaipNetworkId(ew.paymentAsset.network),t=await c.$.getImageByToken(ew.paymentAsset.asset,e);ew.paymentAsset.metadata.logoURI=t}catch{}}},eb=(0,m.AH)`
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

  .left-image-container {
    position: relative;
    justify-content: center;
    align-items: center;
  }

  .token-image {
    border-radius: ${({borderRadius:e})=>e.round};
    width: 40px;
    height: 40px;
  }

  .chain-image {
    position: absolute;
    width: 20px;
    height: 20px;
    bottom: -3px;
    right: -5px;
    border-radius: ${({borderRadius:e})=>e.round};
    border: 2px solid ${({tokens:e})=>e.theme.backgroundPrimary};
  }

  .payment-methods-container {
    background-color: ${({tokens:e})=>e.theme.foregroundPrimary};
    border-top-right-radius: ${({borderRadius:e})=>e[8]};
    border-top-left-radius: ${({borderRadius:e})=>e[8]};
  }
`;var ex=function(e,t,i,a){var n,s=arguments.length,r=s<3?t:null===a?a=Object.getOwnPropertyDescriptor(t,i):a;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)r=Reflect.decorate(e,t,i,a);else for(var o=e.length-1;o>=0;o--)(n=e[o])&&(r=(s<3?n(r):s>3?n(t,i,r):n(t,i))||r);return s>3&&r&&Object.defineProperty(t,i,r),r};let ev=class extends a.WF{constructor(){super(),this.unsubscribe=[],this.amount=ef.state.amount,this.namespace=void 0,this.paymentAsset=ef.state.paymentAsset,this.activeConnectorIds=r.a.state.activeConnectorIds,this.caipAddress=void 0,this.exchanges=ef.state.exchanges,this.isLoading=ef.state.isLoading,this.initializeNamespace(),this.unsubscribe.push(ef.subscribeKey("amount",e=>this.amount=e)),this.unsubscribe.push(r.a.subscribeKey("activeConnectorIds",e=>this.activeConnectorIds=e)),this.unsubscribe.push(ef.subscribeKey("exchanges",e=>this.exchanges=e)),this.unsubscribe.push(ef.subscribeKey("isLoading",e=>this.isLoading=e)),ef.fetchExchanges(),ef.setSelectedExchange(void 0)}disconnectedCallback(){this.unsubscribe.forEach(e=>e())}render(){return(0,a.qy)`
      <wui-flex flexDirection="column">
        ${this.paymentDetailsTemplate()} ${this.paymentMethodsTemplate()}
      </wui-flex>
    `}paymentMethodsTemplate(){return(0,a.qy)`
      <wui-flex flexDirection="column" padding="3" gap="2" class="payment-methods-container">
        ${this.payWithWalletTemplate()} ${this.templateSeparator()}
        ${this.templateExchangeOptions()}
      </wui-flex>
    `}initializeNamespace(){let e=o.W.state.activeChain;this.namespace=e,this.caipAddress=o.W.getAccountData(e)?.caipAddress,this.unsubscribe.push(o.W.subscribeChainProp("accountState",e=>{this.caipAddress=e?.caipAddress},e))}paymentDetailsTemplate(){let e=o.W.getAllRequestedCaipNetworks().find(e=>e.caipNetworkId===this.paymentAsset.network);return(0,a.qy)`
      <wui-flex
        alignItems="center"
        justifyContent="space-between"
        .padding=${["6","8","6","8"]}
        gap="2"
      >
        <wui-flex alignItems="center" gap="1">
          <wui-text variant="h1-regular" color="primary">
            ${ep(this.amount||"0")}
          </wui-text>

          <wui-flex flexDirection="column">
            <wui-text variant="h6-regular" color="secondary">
              ${this.paymentAsset.metadata.symbol||"Unknown"}
            </wui-text>
            <wui-text variant="md-medium" color="secondary"
              >on ${e?.name||"Unknown"}</wui-text
            >
          </wui-flex>
        </wui-flex>

        <wui-flex class="left-image-container">
          <wui-image
            src=${(0,s.J)(this.paymentAsset.metadata.logoURI)}
            class="token-image"
          ></wui-image>
          <wui-image
            src=${(0,s.J)(c.$.getNetworkImage(e))}
            class="chain-image"
          ></wui-image>
        </wui-flex>
      </wui-flex>
    `}payWithWalletTemplate(){return!function(e){let{chainNamespace:t}=w.C.parseCaipNetworkId(e);return ec.includes(t)}(this.paymentAsset.network)?(0,a.qy)``:this.caipAddress?this.connectedWalletTemplate():this.disconnectedWalletTemplate()}connectedWalletTemplate(){let{name:e,image:t}=this.getWalletProperties({namespace:this.namespace});return(0,a.qy)`
      <wui-flex flexDirection="column" gap="3">
        <wui-list-item
          type="secondary"
          boxColor="foregroundSecondary"
          @click=${this.onWalletPayment}
          .boxed=${!1}
          ?chevron=${!0}
          ?fullSize=${!1}
          ?rounded=${!0}
          data-testid="wallet-payment-option"
          imageSrc=${(0,s.J)(t)}
          imageSize="3xl"
        >
          <wui-text variant="lg-regular" color="primary">Pay with ${e}</wui-text>
        </wui-list-item>

        <wui-list-item
          type="secondary"
          icon="power"
          iconColor="error"
          @click=${this.onDisconnect}
          data-testid="disconnect-button"
          ?chevron=${!1}
          boxColor="foregroundSecondary"
        >
          <wui-text variant="lg-regular" color="secondary">Disconnect</wui-text>
        </wui-list-item>
      </wui-flex>
    `}disconnectedWalletTemplate(){return(0,a.qy)`<wui-list-item
      type="secondary"
      boxColor="foregroundSecondary"
      variant="icon"
      iconColor="default"
      iconVariant="overlay"
      icon="wallet"
      @click=${this.onWalletPayment}
      ?chevron=${!0}
      data-testid="wallet-payment-option"
    >
      <wui-text variant="lg-regular" color="primary">Pay with wallet</wui-text>
    </wui-list-item>`}templateExchangeOptions(){if(this.isLoading)return(0,a.qy)`<wui-flex justifyContent="center" alignItems="center">
        <wui-loading-spinner size="md"></wui-loading-spinner>
      </wui-flex>`;let e=this.exchanges.filter(e=>{var t;let i;return(t=this.paymentAsset,(i=o.W.getAllRequestedCaipNetworks().find(e=>e.caipNetworkId===t.network))&&i.testnet)?e.id===L:e.id!==L});return 0===e.length?(0,a.qy)`<wui-flex justifyContent="center" alignItems="center">
        <wui-text variant="md-medium" color="primary">No exchanges available</wui-text>
      </wui-flex>`:e.map(e=>(0,a.qy)`
        <wui-list-item
          type="secondary"
          boxColor="foregroundSecondary"
          @click=${()=>this.onExchangePayment(e)}
          data-testid="exchange-option-${e.id}"
          ?chevron=${!0}
          imageSrc=${(0,s.J)(e.imageUrl)}
        >
          <wui-text flexGrow="1" variant="lg-regular" color="primary">
            Pay with ${e.name}
          </wui-text>
        </wui-list-item>
      `)}templateSeparator(){return(0,a.qy)`<wui-separator text="or" bgColor="secondary"></wui-separator>`}async onWalletPayment(){if(!this.namespace)throw Error("Namespace not found");this.caipAddress?l.I.push("PayQuote"):(await r.a.connect(),await u.W.open({view:"PayQuote"}))}onExchangePayment(e){ef.setSelectedExchange(e),l.I.push("PayQuote")}async onDisconnect(){try{await d.x.disconnect(),await u.W.open({view:"Pay"})}catch{console.error("Failed to disconnect"),p.P.showError("Failed to disconnect")}}getWalletProperties({namespace:e}){if(!e)return{name:void 0,image:void 0};let t=this.activeConnectorIds[e];if(!t)return{name:void 0,image:void 0};let i=r.a.getConnector({id:t,namespace:e});if(!i)return{name:void 0,image:void 0};let a=c.$.getConnectorImage(i);return{name:i.name,image:a}}};ev.styles=eb,ex([(0,n.wk)()],ev.prototype,"amount",void 0),ex([(0,n.wk)()],ev.prototype,"namespace",void 0),ex([(0,n.wk)()],ev.prototype,"paymentAsset",void 0),ex([(0,n.wk)()],ev.prototype,"activeConnectorIds",void 0),ex([(0,n.wk)()],ev.prototype,"caipAddress",void 0),ex([(0,n.wk)()],ev.prototype,"exchanges",void 0),ex([(0,n.wk)()],ev.prototype,"isLoading",void 0),ev=ex([(0,m.EM)("w3m-pay-view")],ev);var ek=i(23906),eP=i(41608),eS=i(54684),eA=i(51127);let eI=(0,eP.AH)`
  :host {
    display: inline-flex;
    align-items: center;
    justify-content: center;
  }

  .pulse-container {
    position: relative;
    width: var(--pulse-size);
    height: var(--pulse-size);
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .pulse-rings {
    position: absolute;
    inset: 0;
    pointer-events: none;
  }

  .pulse-ring {
    position: absolute;
    inset: 0;
    border-radius: 50%;
    border: 2px solid var(--pulse-color);
    opacity: 0;
    animation: pulse var(--pulse-duration, 2s) ease-out infinite;
  }

  .pulse-content {
    position: relative;
    z-index: 1;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  @keyframes pulse {
    0% {
      transform: scale(0.5);
      opacity: var(--pulse-opacity, 0.3);
    }
    50% {
      opacity: calc(var(--pulse-opacity, 0.3) * 0.5);
    }
    100% {
      transform: scale(1.2);
      opacity: 0;
    }
  }
`;var eE=function(e,t,i,a){var n,s=arguments.length,r=s<3?t:null===a?a=Object.getOwnPropertyDescriptor(t,i):a;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)r=Reflect.decorate(e,t,i,a);else for(var o=e.length-1;o>=0;o--)(n=e[o])&&(r=(s<3?n(r):s>3?n(t,i,r):n(t,i))||r);return s>3&&r&&Object.defineProperty(t,i,r),r};let eC={"accent-primary":eP.f.tokens.core.backgroundAccentPrimary},e$=class extends a.WF{constructor(){super(...arguments),this.rings=3,this.duration=2,this.opacity=.3,this.size="200px",this.variant="accent-primary"}render(){let e=eC[this.variant];this.style.cssText=`
      --pulse-size: ${this.size};
      --pulse-duration: ${this.duration}s;
      --pulse-color: ${e};
      --pulse-opacity: ${this.opacity};
    `;let t=Array.from({length:this.rings},(e,t)=>this.renderRing(t,this.rings));return(0,a.qy)`
      <div class="pulse-container">
        <div class="pulse-rings">${t}</div>
        <div class="pulse-content">
          <slot></slot>
        </div>
      </div>
    `}renderRing(e,t){let i=e/t*this.duration,n=`animation-delay: ${i}s;`;return(0,a.qy)`<div class="pulse-ring" style=${n}></div>`}};e$.styles=[eS.W5,eI],eE([(0,n.MZ)({type:Number})],e$.prototype,"rings",void 0),eE([(0,n.MZ)({type:Number})],e$.prototype,"duration",void 0),eE([(0,n.MZ)({type:Number})],e$.prototype,"opacity",void 0),eE([(0,n.MZ)()],e$.prototype,"size",void 0),eE([(0,n.MZ)()],e$.prototype,"variant",void 0),e$=eE([(0,eA.E)("wui-pulse")],e$);let eN=[{id:"received",title:"Receiving funds",icon:"dollar"},{id:"processing",title:"Swapping asset",icon:"recycleHorizontal"},{id:"sending",title:"Sending asset to the recipient address",icon:"send"}],eT=["success","submitted","failure","timeout","refund"],eq=(0,m.AH)`
  :host {
    display: block;
    height: 100%;
    width: 100%;
  }

  wui-image {
    border-radius: ${({borderRadius:e})=>e.round};
  }

  .token-badge-container {
    position: absolute;
    bottom: 6px;
    left: 50%;
    transform: translateX(-50%);
    border-radius: ${({borderRadius:e})=>e[4]};
    z-index: 3;
    min-width: 105px;
  }

  .token-badge-container.loading {
    background-color: ${({tokens:e})=>e.theme.backgroundPrimary};
    border: 3px solid ${({tokens:e})=>e.theme.backgroundPrimary};
  }

  .token-badge-container.success {
    background-color: ${({tokens:e})=>e.theme.backgroundPrimary};
    border: 3px solid ${({tokens:e})=>e.theme.backgroundPrimary};
  }

  .token-image-container {
    position: relative;
  }

  .token-image {
    border-radius: ${({borderRadius:e})=>e.round};
    width: 64px;
    height: 64px;
  }

  .token-image.success {
    background-color: ${({tokens:e})=>e.theme.foregroundPrimary};
  }

  .token-image.error {
    background-color: ${({tokens:e})=>e.theme.foregroundPrimary};
  }

  .token-image.loading {
    background: ${({colors:e})=>e.accent010};
  }

  .token-image wui-icon {
    width: 32px;
    height: 32px;
  }

  .token-badge {
    background-color: ${({tokens:e})=>e.theme.foregroundPrimary};
    border: 1px solid ${({tokens:e})=>e.theme.foregroundSecondary};
    border-radius: ${({borderRadius:e})=>e[4]};
  }

  .token-badge wui-text {
    white-space: nowrap;
  }

  .payment-lifecycle-container {
    background-color: ${({tokens:e})=>e.theme.foregroundPrimary};
    border-top-right-radius: ${({borderRadius:e})=>e[6]};
    border-top-left-radius: ${({borderRadius:e})=>e[6]};
  }

  .payment-step-badge {
    padding: ${({spacing:e})=>e[1]} ${({spacing:e})=>e[2]};
    border-radius: ${({borderRadius:e})=>e[1]};
  }

  .payment-step-badge.loading {
    background-color: ${({tokens:e})=>e.theme.foregroundSecondary};
  }

  .payment-step-badge.error {
    background-color: ${({tokens:e})=>e.core.backgroundError};
  }

  .payment-step-badge.success {
    background-color: ${({tokens:e})=>e.core.backgroundSuccess};
  }

  .step-icon-container {
    position: relative;
    height: 40px;
    width: 40px;
    border-radius: ${({borderRadius:e})=>e.round};
    background-color: ${({tokens:e})=>e.theme.foregroundSecondary};
  }

  .step-icon-box {
    position: absolute;
    right: -4px;
    bottom: -1px;
    padding: 2px;
    border-radius: ${({borderRadius:e})=>e.round};
    border: 2px solid ${({tokens:e})=>e.theme.backgroundPrimary};
    background-color: ${({tokens:e})=>e.theme.foregroundPrimary};
  }

  .step-icon-box.success {
    background-color: ${({tokens:e})=>e.core.backgroundSuccess};
  }
`;var eU=function(e,t,i,a){var n,s=arguments.length,r=s<3?t:null===a?a=Object.getOwnPropertyDescriptor(t,i):a;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)r=Reflect.decorate(e,t,i,a);else for(var o=e.length-1;o>=0;o--)(n=e[o])&&(r=(s<3?n(r):s>3?n(t,i,r):n(t,i))||r);return s>3&&r&&Object.defineProperty(t,i,r),r};let eR={received:["pending","success","submitted"],processing:["success","submitted"],sending:["success","submitted"]},eO=class extends a.WF{constructor(){super(),this.unsubscribe=[],this.pollingInterval=null,this.paymentAsset=ef.state.paymentAsset,this.quoteStatus=ef.state.quoteStatus,this.quote=ef.state.quote,this.amount=ef.state.amount,this.namespace=void 0,this.caipAddress=void 0,this.profileName=null,this.activeConnectorIds=r.a.state.activeConnectorIds,this.selectedExchange=ef.state.selectedExchange,this.initializeNamespace(),this.unsubscribe.push(ef.subscribeKey("quoteStatus",e=>this.quoteStatus=e),ef.subscribeKey("quote",e=>this.quote=e),r.a.subscribeKey("activeConnectorIds",e=>this.activeConnectorIds=e),ef.subscribeKey("selectedExchange",e=>this.selectedExchange=e))}connectedCallback(){super.connectedCallback(),this.startPolling()}disconnectedCallback(){super.disconnectedCallback(),this.stopPolling(),this.unsubscribe.forEach(e=>e())}render(){return(0,a.qy)`
      <wui-flex flexDirection="column" .padding=${["3","0","0","0"]} gap="2">
        ${this.tokenTemplate()} ${this.paymentTemplate()} ${this.paymentLifecycleTemplate()}
      </wui-flex>
    `}tokenTemplate(){let e=ep(this.amount||"0"),t=this.paymentAsset.metadata.symbol??"Unknown",i=o.W.getAllRequestedCaipNetworks().find(e=>e.caipNetworkId===this.paymentAsset.network),n="failure"===this.quoteStatus||"timeout"===this.quoteStatus||"refund"===this.quoteStatus;return"success"===this.quoteStatus||"submitted"===this.quoteStatus?(0,a.qy)`<wui-flex alignItems="center" justifyContent="center">
        <wui-flex justifyContent="center" alignItems="center" class="token-image success">
          <wui-icon name="checkmark" color="success" size="inherit"></wui-icon>
        </wui-flex>
      </wui-flex>`:n?(0,a.qy)`<wui-flex alignItems="center" justifyContent="center">
        <wui-flex justifyContent="center" alignItems="center" class="token-image error">
          <wui-icon name="close" color="error" size="inherit"></wui-icon>
        </wui-flex>
      </wui-flex>`:(0,a.qy)`
      <wui-flex alignItems="center" justifyContent="center">
        <wui-flex class="token-image-container">
          <wui-pulse size="125px" rings="3" duration="4" opacity="0.5" variant="accent-primary">
            <wui-flex justifyContent="center" alignItems="center" class="token-image loading">
              <wui-icon name="paperPlaneTitle" color="accent-primary" size="inherit"></wui-icon>
            </wui-flex>
          </wui-pulse>

          <wui-flex
            justifyContent="center"
            alignItems="center"
            class="token-badge-container loading"
          >
            <wui-flex
              alignItems="center"
              justifyContent="center"
              gap="01"
              padding="1"
              class="token-badge"
            >
              <wui-image
                src=${(0,s.J)(c.$.getNetworkImage(i))}
                class="chain-image"
                size="mdl"
              ></wui-image>

              <wui-text variant="lg-regular" color="primary">${e} ${t}</wui-text>
            </wui-flex>
          </wui-flex>
        </wui-flex>
      </wui-flex>
    `}paymentTemplate(){return(0,a.qy)`
      <wui-flex flexDirection="column" gap="2" .padding=${["0","6","0","6"]}>
        ${this.renderPayment()}
        <wui-separator></wui-separator>
        ${this.renderWallet()}
      </wui-flex>
    `}paymentLifecycleTemplate(){let e=this.getStepsWithStatus();return(0,a.qy)`
      <wui-flex flexDirection="column" padding="4" gap="2" class="payment-lifecycle-container">
        <wui-flex alignItems="center" justifyContent="space-between">
          <wui-text variant="md-regular" color="secondary">PAYMENT CYCLE</wui-text>

          ${this.renderPaymentCycleBadge()}
        </wui-flex>

        <wui-flex flexDirection="column" gap="5" .padding=${["2","0","2","0"]}>
          ${e.map(e=>this.renderStep(e))}
        </wui-flex>
      </wui-flex>
    `}renderPaymentCycleBadge(){let e="failure"===this.quoteStatus||"timeout"===this.quoteStatus||"refund"===this.quoteStatus,t="success"===this.quoteStatus||"submitted"===this.quoteStatus;if(e)return(0,a.qy)`
        <wui-flex
          justifyContent="center"
          alignItems="center"
          class="payment-step-badge error"
          gap="1"
        >
          <wui-icon name="close" color="error" size="xs"></wui-icon>
          <wui-text variant="sm-regular" color="error">Failed</wui-text>
        </wui-flex>
      `;if(t)return(0,a.qy)`
        <wui-flex
          justifyContent="center"
          alignItems="center"
          class="payment-step-badge success"
          gap="1"
        >
          <wui-icon name="checkmark" color="success" size="xs"></wui-icon>
          <wui-text variant="sm-regular" color="success">Completed</wui-text>
        </wui-flex>
      `;let i=this.quote?.timeInSeconds??0;return(0,a.qy)`
      <wui-flex alignItems="center" justifyContent="space-between" gap="3">
        <wui-flex
          justifyContent="center"
          alignItems="center"
          class="payment-step-badge loading"
          gap="1"
        >
          <wui-icon name="clock" color="default" size="xs"></wui-icon>
          <wui-text variant="sm-regular" color="primary">Est. ${i} sec</wui-text>
        </wui-flex>

        <wui-icon name="chevronBottom" color="default" size="xxs"></wui-icon>
      </wui-flex>
    `}renderPayment(){let e=o.W.getAllRequestedCaipNetworks().find(e=>{let t=this.quote?.origin.currency.network;if(!t)return!1;let{chainId:i}=w.C.parseCaipNetworkId(t);return k.y.isLowerCaseMatch(e.id.toString(),i.toString())}),t=ep(f.S.formatNumber(this.quote?.origin.amount||"0",{decimals:this.quote?.origin.currency.metadata.decimals??0}).toString()),i=this.quote?.origin.currency.metadata.symbol??"Unknown";return(0,a.qy)`
      <wui-flex
        alignItems="flex-start"
        justifyContent="space-between"
        .padding=${["3","0","3","0"]}
      >
        <wui-text variant="lg-regular" color="secondary">Payment Method</wui-text>

        <wui-flex flexDirection="column" alignItems="flex-end" gap="1">
          <wui-flex alignItems="center" gap="01">
            <wui-text variant="lg-regular" color="primary">${t}</wui-text>
            <wui-text variant="lg-regular" color="secondary">${i}</wui-text>
          </wui-flex>

          <wui-flex alignItems="center" gap="1">
            <wui-text variant="md-regular" color="secondary">on</wui-text>
            <wui-image
              src=${(0,s.J)(c.$.getNetworkImage(e))}
              size="xs"
            ></wui-image>
            <wui-text variant="md-regular" color="secondary">${e?.name}</wui-text>
          </wui-flex>
        </wui-flex>
      </wui-flex>
    `}renderWallet(){return(0,a.qy)`
      <wui-flex
        alignItems="flex-start"
        justifyContent="space-between"
        .padding=${["3","0","3","0"]}
      >
        <wui-text variant="lg-regular" color="secondary"
          >${this.selectedExchange?"Exchange":"Wallet"}</wui-text
        >

        ${this.renderWalletText()}
      </wui-flex>
    `}renderWalletText(){let{image:e}=this.getWalletProperties({namespace:this.namespace}),{address:t}=this.caipAddress?w.C.parseCaipAddress(this.caipAddress):{},i=this.selectedExchange?.name;return this.selectedExchange?(0,a.qy)`
        <wui-flex alignItems="center" justifyContent="flex-end" gap="1">
          <wui-text variant="lg-regular" color="primary">${i}</wui-text>
          <wui-image src=${(0,s.J)(this.selectedExchange.imageUrl)} size="mdl"></wui-image>
        </wui-flex>
      `:(0,a.qy)`
      <wui-flex alignItems="center" justifyContent="flex-end" gap="1">
        <wui-text variant="lg-regular" color="primary">
          ${m.Zv.getTruncateString({string:this.profileName||t||i||"",charsStart:this.profileName?16:4,charsEnd:6*!this.profileName,truncate:this.profileName?"end":"middle"})}
        </wui-text>

        <wui-image src=${(0,s.J)(e)} size="mdl"></wui-image>
      </wui-flex>
    `}getStepsWithStatus(){return"failure"===this.quoteStatus||"timeout"===this.quoteStatus||"refund"===this.quoteStatus?eN.map(e=>({...e,status:"failed"})):eN.map(e=>{let t=(eR[e.id]??[]).includes(this.quoteStatus)?"completed":"pending";return{...e,status:t}})}renderStep({title:e,icon:t,status:i}){return(0,a.qy)`
      <wui-flex alignItems="center" gap="3">
        <wui-flex justifyContent="center" alignItems="center" class="step-icon-container">
          <wui-icon name=${t} color="default" size="mdl"></wui-icon>

          <wui-flex alignItems="center" justifyContent="center" class=${(0,ek.H)({"step-icon-box":!0,success:"completed"===i})}>
            ${this.renderStatusIndicator(i)}
          </wui-flex>
        </wui-flex>

        <wui-text variant="md-regular" color="primary">${e}</wui-text>
      </wui-flex>
    `}renderStatusIndicator(e){return"completed"===e?(0,a.qy)`<wui-icon size="sm" color="success" name="checkmark"></wui-icon>`:"failed"===e?(0,a.qy)`<wui-icon size="sm" color="error" name="close"></wui-icon>`:"pending"===e?(0,a.qy)`<wui-loading-spinner color="accent-primary" size="sm"></wui-loading-spinner>`:null}startPolling(){this.pollingInterval||(this.fetchQuoteStatus(),this.pollingInterval=setInterval(()=>{this.fetchQuoteStatus()},3e3))}stopPolling(){this.pollingInterval&&(clearInterval(this.pollingInterval),this.pollingInterval=null)}async fetchQuoteStatus(){let e=ef.state.requestId;if(!e||eT.includes(this.quoteStatus))this.stopPolling();else try{await ef.fetchQuoteStatus({requestId:e}),eT.includes(this.quoteStatus)&&this.stopPolling()}catch{this.stopPolling()}}initializeNamespace(){let e=o.W.state.activeChain;this.namespace=e,this.caipAddress=o.W.getAccountData(e)?.caipAddress,this.profileName=o.W.getAccountData(e)?.profileName??null,this.unsubscribe.push(o.W.subscribeChainProp("accountState",e=>{this.caipAddress=e?.caipAddress,this.profileName=e?.profileName??null},e))}getWalletProperties({namespace:e}){if(!e)return{name:void 0,image:void 0};let t=this.activeConnectorIds[e];if(!t)return{name:void 0,image:void 0};let i=r.a.getConnector({id:t,namespace:e});if(!i)return{name:void 0,image:void 0};let a=c.$.getConnectorImage(i);return{name:i.name,image:a}}};eO.styles=eq,eU([(0,n.wk)()],eO.prototype,"paymentAsset",void 0),eU([(0,n.wk)()],eO.prototype,"quoteStatus",void 0),eU([(0,n.wk)()],eO.prototype,"quote",void 0),eU([(0,n.wk)()],eO.prototype,"amount",void 0),eU([(0,n.wk)()],eO.prototype,"namespace",void 0),eU([(0,n.wk)()],eO.prototype,"caipAddress",void 0),eU([(0,n.wk)()],eO.prototype,"profileName",void 0),eU([(0,n.wk)()],eO.prototype,"activeConnectorIds",void 0),eU([(0,n.wk)()],eO.prototype,"selectedExchange",void 0),eO=eU([(0,m.EM)("w3m-pay-loading-view")],eO),i(32039),i(41835);let eD=(0,a.AH)`
  :host {
    display: block;
  }
`,eW=class extends a.WF{render(){return(0,a.qy)`
      <wui-flex flexDirection="column" gap="4">
        <wui-flex alignItems="center" justifyContent="space-between">
          <wui-text variant="md-regular" color="secondary">Pay</wui-text>
          <wui-shimmer width="60px" height="16px" borderRadius="4xs" variant="light"></wui-shimmer>
        </wui-flex>

        <wui-flex alignItems="center" justifyContent="space-between">
          <wui-text variant="md-regular" color="secondary">Network Fee</wui-text>

          <wui-flex flexDirection="column" alignItems="flex-end" gap="2">
            <wui-shimmer
              width="75px"
              height="16px"
              borderRadius="4xs"
              variant="light"
            ></wui-shimmer>

            <wui-flex alignItems="center" gap="01">
              <wui-shimmer width="14px" height="14px" rounded variant="light"></wui-shimmer>
              <wui-shimmer
                width="49px"
                height="14px"
                borderRadius="4xs"
                variant="light"
              ></wui-shimmer>
            </wui-flex>
          </wui-flex>
        </wui-flex>

        <wui-flex alignItems="center" justifyContent="space-between">
          <wui-text variant="md-regular" color="secondary">Service Fee</wui-text>
          <wui-shimmer width="75px" height="16px" borderRadius="4xs" variant="light"></wui-shimmer>
        </wui-flex>
      </wui-flex>
    `}};eW.styles=[eD],eW=function(e,t,i,a){var n,s=arguments.length,r=s<3?t:null===a?a=Object.getOwnPropertyDescriptor(t,i):a;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)r=Reflect.decorate(e,t,i,a);else for(var o=e.length-1;o>=0;o--)(n=e[o])&&(r=(s<3?n(r):s>3?n(t,i,r):n(t,i))||r);return s>3&&r&&Object.defineProperty(t,i,r),r}([(0,m.EM)("w3m-pay-fees-skeleton")],eW);let eF=(0,m.AH)`
  :host {
    display: block;
  }

  wui-image {
    border-radius: ${({borderRadius:e})=>e.round};
  }
`;var ej=function(e,t,i,a){var n,s=arguments.length,r=s<3?t:null===a?a=Object.getOwnPropertyDescriptor(t,i):a;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)r=Reflect.decorate(e,t,i,a);else for(var o=e.length-1;o>=0;o--)(n=e[o])&&(r=(s<3?n(r):s>3?n(t,i,r):n(t,i))||r);return s>3&&r&&Object.defineProperty(t,i,r),r};let e_=class extends a.WF{constructor(){super(),this.unsubscribe=[],this.quote=ef.state.quote,this.unsubscribe.push(ef.subscribeKey("quote",e=>this.quote=e))}disconnectedCallback(){this.unsubscribe.forEach(e=>e())}render(){let e=f.S.formatNumber(this.quote?.origin.amount||"0",{decimals:this.quote?.origin.currency.metadata.decimals??0,round:6}).toString();return(0,a.qy)`
      <wui-flex flexDirection="column" gap="4">
        <wui-flex alignItems="center" justifyContent="space-between">
          <wui-text variant="md-regular" color="secondary">Pay</wui-text>
          <wui-text variant="md-regular" color="primary">
            ${e} ${this.quote?.origin.currency.metadata.symbol||"Unknown"}
          </wui-text>
        </wui-flex>

        ${this.quote&&this.quote.fees.length>0?this.quote.fees.map(e=>this.renderFee(e)):null}
      </wui-flex>
    `}renderFee(e){let t="network"===e.id,i=f.S.formatNumber(e.amount||"0",{decimals:e.currency.metadata.decimals??0,round:6}).toString();if(t){let t=o.W.getAllRequestedCaipNetworks().find(t=>k.y.isLowerCaseMatch(t.caipNetworkId,e.currency.network));return(0,a.qy)`
        <wui-flex alignItems="center" justifyContent="space-between">
          <wui-text variant="md-regular" color="secondary">${e.label}</wui-text>

          <wui-flex flexDirection="column" alignItems="flex-end" gap="2">
            <wui-text variant="md-regular" color="primary">
              ${i} ${e.currency.metadata.symbol||"Unknown"}
            </wui-text>

            <wui-flex alignItems="center" gap="01">
              <wui-image
                src=${(0,s.J)(c.$.getNetworkImage(t))}
                size="xs"
              ></wui-image>
              <wui-text variant="sm-regular" color="secondary">
                ${t?.name||"Unknown"}
              </wui-text>
            </wui-flex>
          </wui-flex>
        </wui-flex>
      `}return(0,a.qy)`
      <wui-flex alignItems="center" justifyContent="space-between">
        <wui-text variant="md-regular" color="secondary">${e.label}</wui-text>
        <wui-text variant="md-regular" color="primary">
          ${i} ${e.currency.metadata.symbol||"Unknown"}
        </wui-text>
      </wui-flex>
    `}};e_.styles=[eF],ej([(0,n.wk)()],e_.prototype,"quote",void 0),e_=ej([(0,m.EM)("w3m-pay-fees")],e_);let ez=(0,m.AH)`
  :host {
    display: block;
    width: 100%;
  }

  .disabled-container {
    padding: ${({spacing:e})=>e[2]};
    min-height: 168px;
  }

  wui-icon {
    width: ${({spacing:e})=>e[8]};
    height: ${({spacing:e})=>e[8]};
  }

  wui-flex > wui-text {
    max-width: 273px;
  }
`;var eL=function(e,t,i,a){var n,s=arguments.length,r=s<3?t:null===a?a=Object.getOwnPropertyDescriptor(t,i):a;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)r=Reflect.decorate(e,t,i,a);else for(var o=e.length-1;o>=0;o--)(n=e[o])&&(r=(s<3?n(r):s>3?n(t,i,r):n(t,i))||r);return s>3&&r&&Object.defineProperty(t,i,r),r};let eM=class extends a.WF{constructor(){super(),this.unsubscribe=[],this.selectedExchange=ef.state.selectedExchange,this.unsubscribe.push(ef.subscribeKey("selectedExchange",e=>this.selectedExchange=e))}disconnectedCallback(){this.unsubscribe.forEach(e=>e())}render(){let e=!!this.selectedExchange;return(0,a.qy)`
      <wui-flex
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        gap="3"
        class="disabled-container"
      >
        <wui-icon name="coins" color="default" size="inherit"></wui-icon>

        <wui-text variant="md-regular" color="primary" align="center">
          You don't have enough funds to complete this transaction
        </wui-text>

        ${e?null:(0,a.qy)`<wui-button
              size="md"
              variant="neutral-secondary"
              @click=${this.dispatchConnectOtherWalletEvent.bind(this)}
              >Connect other wallet</wui-button
            >`}
      </wui-flex>
    `}dispatchConnectOtherWalletEvent(){this.dispatchEvent(new CustomEvent("connectOtherWallet",{detail:!0,bubbles:!0,composed:!0}))}};eM.styles=[ez],eL([(0,n.MZ)({type:Array})],eM.prototype,"selectedExchange",void 0),eM=eL([(0,m.EM)("w3m-pay-options-empty")],eM);let eB=(0,m.AH)`
  :host {
    display: block;
    width: 100%;
  }

  .pay-options-container {
    max-height: 196px;
    overflow-y: auto;
    overflow-x: hidden;
    scrollbar-width: none;
  }

  .pay-options-container::-webkit-scrollbar {
    display: none;
  }

  .pay-option-container {
    border-radius: ${({borderRadius:e})=>e[4]};
    padding: ${({spacing:e})=>e[3]};
    min-height: 60px;
  }

  .token-images-container {
    position: relative;
    justify-content: center;
    align-items: center;
  }

  .chain-image {
    position: absolute;
    bottom: -3px;
    right: -5px;
    border: 2px solid ${({tokens:e})=>e.theme.foregroundSecondary};
  }
`,eQ=class extends a.WF{render(){return(0,a.qy)`
      <wui-flex flexDirection="column" gap="2" class="pay-options-container">
        ${this.renderOptionEntry()} ${this.renderOptionEntry()} ${this.renderOptionEntry()}
      </wui-flex>
    `}renderOptionEntry(){return(0,a.qy)`
      <wui-flex
        alignItems="center"
        justifyContent="space-between"
        gap="2"
        class="pay-option-container"
      >
        <wui-flex alignItems="center" gap="2">
          <wui-flex class="token-images-container">
            <wui-shimmer
              width="32px"
              height="32px"
              rounded
              variant="light"
              class="token-image"
            ></wui-shimmer>
            <wui-shimmer
              width="16px"
              height="16px"
              rounded
              variant="light"
              class="chain-image"
            ></wui-shimmer>
          </wui-flex>

          <wui-flex flexDirection="column" gap="1">
            <wui-shimmer
              width="74px"
              height="16px"
              borderRadius="4xs"
              variant="light"
            ></wui-shimmer>
            <wui-shimmer
              width="46px"
              height="14px"
              borderRadius="4xs"
              variant="light"
            ></wui-shimmer>
          </wui-flex>
        </wui-flex>
      </wui-flex>
    `}};eQ.styles=[eB],eQ=function(e,t,i,a){var n,s=arguments.length,r=s<3?t:null===a?a=Object.getOwnPropertyDescriptor(t,i):a;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)r=Reflect.decorate(e,t,i,a);else for(var o=e.length-1;o>=0;o--)(n=e[o])&&(r=(s<3?n(r):s>3?n(t,i,r):n(t,i))||r);return s>3&&r&&Object.defineProperty(t,i,r),r}([(0,m.EM)("w3m-pay-options-skeleton")],eQ);let eH=(0,m.AH)`
  :host {
    display: block;
    width: 100%;
  }

  .pay-options-container {
    max-height: 196px;
    overflow-y: auto;
    overflow-x: hidden;
    scrollbar-width: none;
    mask-image: var(--options-mask-image);
    -webkit-mask-image: var(--options-mask-image);
  }

  .pay-options-container::-webkit-scrollbar {
    display: none;
  }

  .pay-option-container {
    cursor: pointer;
    border-radius: ${({borderRadius:e})=>e[4]};
    padding: ${({spacing:e})=>e[3]};
    transition: background-color ${({durations:e})=>e.lg}
      ${({easings:e})=>e["ease-out-power-1"]};
    will-change: background-color;
  }

  .token-images-container {
    position: relative;
    justify-content: center;
    align-items: center;
  }

  .token-image {
    border-radius: ${({borderRadius:e})=>e.round};
    width: 32px;
    height: 32px;
  }

  .chain-image {
    position: absolute;
    width: 16px;
    height: 16px;
    bottom: -3px;
    right: -5px;
    border-radius: ${({borderRadius:e})=>e.round};
    border: 2px solid ${({tokens:e})=>e.theme.backgroundPrimary};
  }

  @media (hover: hover) and (pointer: fine) {
    .pay-option-container:hover {
      background-color: ${({tokens:e})=>e.theme.foregroundPrimary};
    }
  }
`;var eK=function(e,t,i,a){var n,s=arguments.length,r=s<3?t:null===a?a=Object.getOwnPropertyDescriptor(t,i):a;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)r=Reflect.decorate(e,t,i,a);else for(var o=e.length-1;o>=0;o--)(n=e[o])&&(r=(s<3?n(r):s>3?n(t,i,r):n(t,i))||r);return s>3&&r&&Object.defineProperty(t,i,r),r};let eG=class extends a.WF{constructor(){super(),this.unsubscribe=[],this.options=[],this.selectedPaymentAsset=null}disconnectedCallback(){this.unsubscribe.forEach(e=>e()),this.resizeObserver?.disconnect();let e=this.shadowRoot?.querySelector(".pay-options-container");e?.removeEventListener("scroll",this.handleOptionsListScroll.bind(this))}firstUpdated(){let e=this.shadowRoot?.querySelector(".pay-options-container");e&&(requestAnimationFrame(this.handleOptionsListScroll.bind(this)),e?.addEventListener("scroll",this.handleOptionsListScroll.bind(this)),this.resizeObserver=new ResizeObserver(()=>{this.handleOptionsListScroll()}),this.resizeObserver?.observe(e),this.handleOptionsListScroll())}render(){return(0,a.qy)`
      <wui-flex flexDirection="column" gap="2" class="pay-options-container">
        ${this.options.map(e=>this.payOptionTemplate(e))}
      </wui-flex>
    `}payOptionTemplate(e){let{network:t,metadata:i,asset:n,amount:r="0"}=e,l=o.W.getAllRequestedCaipNetworks().find(e=>e.caipNetworkId===t),u=`${t}:${n}`,d=`${this.selectedPaymentAsset?.network}:${this.selectedPaymentAsset?.asset}`,p=f.S.bigNumber(r,{safe:!0}),m=p.gt(0);return(0,a.qy)`
      <wui-flex
        alignItems="center"
        justifyContent="space-between"
        gap="2"
        @click=${()=>this.onSelect?.(e)}
        class="pay-option-container"
      >
        <wui-flex alignItems="center" gap="2">
          <wui-flex class="token-images-container">
            <wui-image
              src=${(0,s.J)(i.logoURI)}
              class="token-image"
              size="3xl"
            ></wui-image>
            <wui-image
              src=${(0,s.J)(c.$.getNetworkImage(l))}
              class="chain-image"
              size="md"
            ></wui-image>
          </wui-flex>

          <wui-flex flexDirection="column" gap="1">
            <wui-text variant="lg-regular" color="primary">${i.symbol}</wui-text>
            ${m?(0,a.qy)`<wui-text variant="sm-regular" color="secondary">
                  ${p.round(6).toString()} ${i.symbol}
                </wui-text>`:null}
          </wui-flex>
        </wui-flex>

        ${u===d?(0,a.qy)`<wui-icon name="checkmark" size="md" color="success"></wui-icon>`:null}
      </wui-flex>
    `}handleOptionsListScroll(){let e=this.shadowRoot?.querySelector(".pay-options-container");e&&(e.scrollHeight>300?(e.style.setProperty("--options-mask-image",`linear-gradient(
          to bottom,
          rgba(0, 0, 0, calc(1 - var(--options-scroll--top-opacity))) 0px,
          rgba(200, 200, 200, calc(1 - var(--options-scroll--top-opacity))) 1px,
          black 50px,
          black calc(100% - 50px),
          rgba(155, 155, 155, calc(1 - var(--options-scroll--bottom-opacity))) calc(100% - 1px),
          rgba(0, 0, 0, calc(1 - var(--options-scroll--bottom-opacity))) 100%
        )`),e.style.setProperty("--options-scroll--top-opacity",m.z8.interpolate([0,50],[0,1],e.scrollTop).toString()),e.style.setProperty("--options-scroll--bottom-opacity",m.z8.interpolate([0,50],[0,1],e.scrollHeight-e.scrollTop-e.offsetHeight).toString())):(e.style.setProperty("--options-mask-image","none"),e.style.setProperty("--options-scroll--top-opacity","0"),e.style.setProperty("--options-scroll--bottom-opacity","0")))}};eG.styles=[eH],eK([(0,n.MZ)({type:Array})],eG.prototype,"options",void 0),eK([(0,n.MZ)()],eG.prototype,"selectedPaymentAsset",void 0),eK([(0,n.MZ)()],eG.prototype,"onSelect",void 0),eG=eK([(0,m.EM)("w3m-pay-options")],eG);let eY=(0,m.AH)`
  .payment-methods-container {
    background-color: ${({tokens:e})=>e.theme.foregroundPrimary};
    border-top-right-radius: ${({borderRadius:e})=>e[5]};
    border-top-left-radius: ${({borderRadius:e})=>e[5]};
  }

  .pay-options-container {
    background-color: ${({tokens:e})=>e.theme.foregroundSecondary};
    border-radius: ${({borderRadius:e})=>e[5]};
    padding: ${({spacing:e})=>e[1]};
  }

  w3m-tooltip-trigger {
    display: flex;
    align-items: center;
    justify-content: center;
    max-width: fit-content;
  }

  wui-image {
    border-radius: ${({borderRadius:e})=>e.round};
  }

  w3m-pay-options.disabled {
    opacity: 0.5;
    pointer-events: none;
  }
`;var eJ=function(e,t,i,a){var n,s=arguments.length,r=s<3?t:null===a?a=Object.getOwnPropertyDescriptor(t,i):a;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)r=Reflect.decorate(e,t,i,a);else for(var o=e.length-1;o>=0;o--)(n=e[o])&&(r=(s<3?n(r):s>3?n(t,i,r):n(t,i))||r);return s>3&&r&&Object.defineProperty(t,i,r),r};let eZ={eip155:{icon:"ethereum",label:"EVM"},solana:{icon:"solana",label:"Solana"},bip122:{icon:"bitcoin",label:"Bitcoin"},ton:{icon:"ton",label:"Ton"}},eV=class extends a.WF{constructor(){super(),this.unsubscribe=[],this.profileName=null,this.paymentAsset=ef.state.paymentAsset,this.namespace=void 0,this.caipAddress=void 0,this.amount=ef.state.amount,this.recipient=ef.state.recipient,this.activeConnectorIds=r.a.state.activeConnectorIds,this.selectedPaymentAsset=ef.state.selectedPaymentAsset,this.selectedExchange=ef.state.selectedExchange,this.isFetchingQuote=ef.state.isFetchingQuote,this.quoteError=ef.state.quoteError,this.quote=ef.state.quote,this.isFetchingTokenBalances=ef.state.isFetchingTokenBalances,this.tokenBalances=ef.state.tokenBalances,this.isPaymentInProgress=ef.state.isPaymentInProgress,this.exchangeUrlForQuote=ef.state.exchangeUrlForQuote,this.completedTransactionsCount=0,this.unsubscribe.push(ef.subscribeKey("paymentAsset",e=>this.paymentAsset=e)),this.unsubscribe.push(ef.subscribeKey("tokenBalances",e=>this.onTokenBalancesChanged(e))),this.unsubscribe.push(ef.subscribeKey("isFetchingTokenBalances",e=>this.isFetchingTokenBalances=e)),this.unsubscribe.push(r.a.subscribeKey("activeConnectorIds",e=>this.activeConnectorIds=e)),this.unsubscribe.push(ef.subscribeKey("selectedPaymentAsset",e=>this.selectedPaymentAsset=e)),this.unsubscribe.push(ef.subscribeKey("isFetchingQuote",e=>this.isFetchingQuote=e)),this.unsubscribe.push(ef.subscribeKey("quoteError",e=>this.quoteError=e)),this.unsubscribe.push(ef.subscribeKey("quote",e=>this.quote=e)),this.unsubscribe.push(ef.subscribeKey("amount",e=>this.amount=e)),this.unsubscribe.push(ef.subscribeKey("recipient",e=>this.recipient=e)),this.unsubscribe.push(ef.subscribeKey("isPaymentInProgress",e=>this.isPaymentInProgress=e)),this.unsubscribe.push(ef.subscribeKey("selectedExchange",e=>this.selectedExchange=e)),this.unsubscribe.push(ef.subscribeKey("exchangeUrlForQuote",e=>this.exchangeUrlForQuote=e)),this.resetQuoteState(),this.initializeNamespace(),this.fetchTokens()}disconnectedCallback(){super.disconnectedCallback(),this.resetAssetsState(),this.unsubscribe.forEach(e=>e())}updated(e){super.updated(e),e.has("selectedPaymentAsset")&&this.fetchQuote()}render(){return(0,a.qy)`
      <wui-flex flexDirection="column">
        ${this.profileTemplate()}

        <wui-flex
          flexDirection="column"
          gap="4"
          class="payment-methods-container"
          .padding=${["4","4","5","4"]}
        >
          ${this.paymentOptionsViewTemplate()} ${this.amountWithFeeTemplate()}

          <wui-flex
            alignItems="center"
            justifyContent="space-between"
            .padding=${["1","0","1","0"]}
          >
            <wui-separator></wui-separator>
          </wui-flex>

          ${this.paymentActionsTemplate()}
        </wui-flex>
      </wui-flex>
    `}profileTemplate(){if(this.selectedExchange){let e=f.S.formatNumber(this.quote?.origin.amount,{decimals:this.quote?.origin.currency.metadata.decimals??0}).toString();return(0,a.qy)`
        <wui-flex
          .padding=${["4","3","4","3"]}
          alignItems="center"
          justifyContent="space-between"
          gap="2"
        >
          <wui-text variant="lg-regular" color="secondary">Paying with</wui-text>

          ${this.quote?(0,a.qy)`<wui-text variant="lg-regular" color="primary">
                ${f.S.bigNumber(e,{safe:!0}).round(6).toString()}
                ${this.quote.origin.currency.metadata.symbol}
              </wui-text>`:(0,a.qy)`<wui-shimmer width="80px" height="18px" variant="light"></wui-shimmer>`}
        </wui-flex>
      `}let e=x.w.getPlainAddress(this.caipAddress)??"",{name:t,image:i}=this.getWalletProperties({namespace:this.namespace}),{icon:n,label:r}=eZ[this.namespace]??{};return(0,a.qy)`
      <wui-flex
        .padding=${["4","3","4","3"]}
        alignItems="center"
        justifyContent="space-between"
        gap="2"
      >
        <wui-wallet-switch
          profileName=${(0,s.J)(this.profileName)}
          address=${(0,s.J)(e)}
          imageSrc=${(0,s.J)(i)}
          alt=${(0,s.J)(t)}
          @click=${this.onConnectOtherWallet.bind(this)}
          data-testid="wui-wallet-switch"
        ></wui-wallet-switch>

        <wui-wallet-switch
          profileName=${(0,s.J)(r)}
          address=${(0,s.J)(e)}
          icon=${(0,s.J)(n)}
          iconSize="xs"
          .enableGreenCircle=${!1}
          alt=${(0,s.J)(r)}
          @click=${this.onConnectOtherWallet.bind(this)}
          data-testid="wui-wallet-switch"
        ></wui-wallet-switch>
      </wui-flex>
    `}initializeNamespace(){let e=o.W.state.activeChain;this.namespace=e,this.caipAddress=o.W.getAccountData(e)?.caipAddress,this.profileName=o.W.getAccountData(e)?.profileName??null,this.unsubscribe.push(o.W.subscribeChainProp("accountState",e=>this.onAccountStateChanged(e),e))}async fetchTokens(){if(this.namespace){let e;if(this.caipAddress){let{chainId:t,chainNamespace:i}=w.C.parseCaipAddress(this.caipAddress),a=`${i}:${t}`;e=o.W.getAllRequestedCaipNetworks().find(e=>e.caipNetworkId===a)}await ef.fetchTokens({caipAddress:this.caipAddress,caipNetwork:e,namespace:this.namespace})}}fetchQuote(){if(this.amount&&this.recipient&&this.selectedPaymentAsset&&this.paymentAsset){let{address:e}=this.caipAddress?w.C.parseCaipAddress(this.caipAddress):{};ef.fetchQuote({amount:this.amount.toString(),address:e,sourceToken:this.selectedPaymentAsset,toToken:this.paymentAsset,recipient:this.recipient})}}getWalletProperties({namespace:e}){if(!e)return{name:void 0,image:void 0};let t=this.activeConnectorIds[e];if(!t)return{name:void 0,image:void 0};let i=r.a.getConnector({id:t,namespace:e});if(!i)return{name:void 0,image:void 0};let a=c.$.getConnectorImage(i);return{name:i.name,image:a}}paymentOptionsViewTemplate(){return(0,a.qy)`
      <wui-flex flexDirection="column" gap="2">
        <wui-text variant="sm-regular" color="secondary">CHOOSE PAYMENT OPTION</wui-text>
        <wui-flex class="pay-options-container">${this.paymentOptionsTemplate()}</wui-flex>
      </wui-flex>
    `}paymentOptionsTemplate(){let e=this.getPaymentAssetFromTokenBalances();if(this.isFetchingTokenBalances)return(0,a.qy)`<w3m-pay-options-skeleton></w3m-pay-options-skeleton>`;if(0===e.length)return(0,a.qy)`<w3m-pay-options-empty
        @connectOtherWallet=${this.onConnectOtherWallet.bind(this)}
      ></w3m-pay-options-empty>`;let t={disabled:this.isFetchingQuote};return(0,a.qy)`<w3m-pay-options
      class=${(0,ek.H)(t)}
      .options=${e}
      .selectedPaymentAsset=${(0,s.J)(this.selectedPaymentAsset)}
      .onSelect=${this.onSelectedPaymentAssetChanged.bind(this)}
    ></w3m-pay-options>`}amountWithFeeTemplate(){return this.isFetchingQuote||!this.selectedPaymentAsset||this.quoteError?(0,a.qy)`<w3m-pay-fees-skeleton></w3m-pay-fees-skeleton>`:(0,a.qy)`<w3m-pay-fees></w3m-pay-fees>`}paymentActionsTemplate(){let e=this.isFetchingQuote||this.isFetchingTokenBalances,t=this.isFetchingQuote||this.isFetchingTokenBalances||!this.selectedPaymentAsset||!!this.quoteError,i=f.S.formatNumber(this.quote?.origin.amount??0,{decimals:this.quote?.origin.currency.metadata.decimals??0}).toString();return this.selectedExchange?e||t?(0,a.qy)`
          <wui-shimmer width="100%" height="48px" variant="light" ?rounded=${!0}></wui-shimmer>
        `:(0,a.qy)`<wui-button
        size="lg"
        fullWidth
        variant="accent-secondary"
        @click=${this.onPayWithExchange.bind(this)}
      >
        ${`Continue in ${this.selectedExchange.name}`}

        <wui-icon name="arrowRight" color="inherit" size="sm" slot="iconRight"></wui-icon>
      </wui-button>`:(0,a.qy)`
      <wui-flex alignItems="center" justifyContent="space-between">
        <wui-flex flexDirection="column" gap="1">
          <wui-text variant="md-regular" color="secondary">Order Total</wui-text>

          ${e||t?(0,a.qy)`<wui-shimmer width="58px" height="32px" variant="light"></wui-shimmer>`:(0,a.qy)`<wui-flex alignItems="center" gap="01">
                <wui-text variant="h4-regular" color="primary">${ep(i)}</wui-text>

                <wui-text variant="lg-regular" color="secondary">
                  ${this.quote?.origin.currency.metadata.symbol||"Unknown"}
                </wui-text>
              </wui-flex>`}
        </wui-flex>

        ${this.actionButtonTemplate({isLoading:e,isDisabled:t})}
      </wui-flex>
    `}actionButtonTemplate(e){let t=J(this.quote),{isLoading:i,isDisabled:n}=e,s="Pay";return t.length>1&&0===this.completedTransactionsCount&&(s="Approve"),(0,a.qy)`
      <wui-button
        size="lg"
        variant="accent-primary"
        ?loading=${i||this.isPaymentInProgress}
        ?disabled=${n||this.isPaymentInProgress}
        @click=${()=>{t.length>0?this.onSendTransactions():this.onTransfer()}}
      >
        ${s}
        ${i?null:(0,a.qy)`<wui-icon
              name="arrowRight"
              color="inherit"
              size="sm"
              slot="iconRight"
            ></wui-icon>`}
      </wui-button>
    `}getPaymentAssetFromTokenBalances(){return this.namespace?(this.tokenBalances[this.namespace]??[]).map(e=>{try{return function(e){let t=o.W.getAllRequestedCaipNetworks().find(t=>t.caipNetworkId===e.chainId),i=e.address;if(!t)throw Error(`Target network not found for balance chainId "${e.chainId}"`);if(k.y.isLowerCaseMatch(e.symbol,t.nativeCurrency.symbol))i="native";else if(x.w.isCaipAddress(i)){let{address:e}=w.C.parseCaipAddress(i);i=e}else if(!i)throw Error(`Balance address not found for balance symbol "${e.symbol}"`);return{network:t.caipNetworkId,asset:i,metadata:{name:e.name,symbol:e.symbol,decimals:Number(e.quantity.decimals),logoURI:e.iconUrl},amount:e.quantity.numeric}}(e)}catch(e){return null}}).filter(e=>!!e).filter(e=>{let{chainId:t}=w.C.parseCaipNetworkId(e.network),{chainId:i}=w.C.parseCaipNetworkId(this.paymentAsset.network);return!!k.y.isLowerCaseMatch(e.asset,this.paymentAsset.asset)||!this.selectedExchange||!k.y.isLowerCaseMatch(t.toString(),i.toString())}):[]}onTokenBalancesChanged(e){this.tokenBalances=e;let[t]=this.getPaymentAssetFromTokenBalances();t&&ef.setSelectedPaymentAsset(t)}async onConnectOtherWallet(){await r.a.connect(),await u.W.open({view:"PayQuote"})}onAccountStateChanged(e){let{address:t}=this.caipAddress?w.C.parseCaipAddress(this.caipAddress):{};if(this.caipAddress=e?.caipAddress,this.profileName=e?.profileName??null,t){let{address:e}=this.caipAddress?w.C.parseCaipAddress(this.caipAddress):{};e?k.y.isLowerCaseMatch(e,t)||(this.resetAssetsState(),this.resetQuoteState(),this.fetchTokens()):u.W.close()}}onSelectedPaymentAssetChanged(e){this.isFetchingQuote||ef.setSelectedPaymentAsset(e)}async onTransfer(){let e=Y(this.quote);if(e){if(!k.y.isLowerCaseMatch(this.selectedPaymentAsset?.asset,e.deposit.currency))throw Error("Quote asset is not the same as the selected payment asset");let t=this.selectedPaymentAsset?.amount??"0",i=f.S.formatNumber(e.deposit.amount,{decimals:this.selectedPaymentAsset?.metadata.decimals??0}).toString();if(!f.S.bigNumber(t).gte(i))return void p.P.showError("Insufficient funds");if(this.quote&&this.selectedPaymentAsset&&this.caipAddress&&this.namespace){let{address:t}=w.C.parseCaipAddress(this.caipAddress);await ef.onTransfer({chainNamespace:this.namespace,fromAddress:t,toAddress:e.deposit.receiver,amount:i,paymentAsset:this.selectedPaymentAsset}),ef.setRequestId(e.requestId),l.I.push("PayLoading")}}}async onSendTransactions(){let e=this.selectedPaymentAsset?.amount??"0",t=f.S.formatNumber(this.quote?.origin.amount??0,{decimals:this.selectedPaymentAsset?.metadata.decimals??0}).toString();if(!f.S.bigNumber(e).gte(t))return void p.P.showError("Insufficient funds");let i=J(this.quote),[a]=J(this.quote,this.completedTransactionsCount);a&&this.namespace&&(await ef.onSendTransaction({namespace:this.namespace,transactionStep:a}),this.completedTransactionsCount+=1,this.completedTransactionsCount===i.length&&(ef.setRequestId(a.requestId),l.I.push("PayLoading")))}onPayWithExchange(){if(this.exchangeUrlForQuote){let e=x.w.returnOpenHref("","popupWindow","scrollbar=yes,width=480,height=720");if(!e)throw Error("Could not create popup window");e.location.href=this.exchangeUrlForQuote;let t=Y(this.quote);t&&ef.setRequestId(t.requestId),ef.initiatePayment(),l.I.push("PayLoading")}}resetAssetsState(){ef.setSelectedPaymentAsset(null)}resetQuoteState(){ef.resetQuoteState()}};async function eX(e){return ef.handleOpenPay(e)}async function e0(e,t=3e5){if(t<=0)throw new F(P,"Timeout must be greater than 0");try{await eX(e)}catch(e){if(e instanceof F)throw e;throw new F(E,e.message)}return new Promise((e,i)=>{var a;let n=!1,s=setTimeout(()=>{n||(n=!0,o(),i(new F($,"Payment timeout")))},t);function r(){if(n)return;let t=ef.state.currentPayment,i=ef.state.error,a=ef.state.isPaymentInProgress;if(t?.status==="SUCCESS"){n=!0,o(),clearTimeout(s),e({success:!0,result:t.result});return}if(t?.status==="FAILED"){n=!0,o(),clearTimeout(s),e({success:!1,error:i||"Payment failed"});return}!i||a||t||(n=!0,o(),clearTimeout(s),e({success:!1,error:i}))}let o=(a=[e4("currentPayment",r),e4("error",r),e4("isPaymentInProgress",r)],()=>{a.forEach(e=>{try{e()}catch{}})});r()})}function e1(){return ef.getExchanges()}function e3(){return ef.state.currentPayment?.result}function e5(){return ef.state.error}function e2(){return ef.state.isPaymentInProgress}function e4(e,t){return ef.subscribeKey(e,t)}eV.styles=eY,eJ([(0,n.wk)()],eV.prototype,"profileName",void 0),eJ([(0,n.wk)()],eV.prototype,"paymentAsset",void 0),eJ([(0,n.wk)()],eV.prototype,"namespace",void 0),eJ([(0,n.wk)()],eV.prototype,"caipAddress",void 0),eJ([(0,n.wk)()],eV.prototype,"amount",void 0),eJ([(0,n.wk)()],eV.prototype,"recipient",void 0),eJ([(0,n.wk)()],eV.prototype,"activeConnectorIds",void 0),eJ([(0,n.wk)()],eV.prototype,"selectedPaymentAsset",void 0),eJ([(0,n.wk)()],eV.prototype,"selectedExchange",void 0),eJ([(0,n.wk)()],eV.prototype,"isFetchingQuote",void 0),eJ([(0,n.wk)()],eV.prototype,"quoteError",void 0),eJ([(0,n.wk)()],eV.prototype,"quote",void 0),eJ([(0,n.wk)()],eV.prototype,"isFetchingTokenBalances",void 0),eJ([(0,n.wk)()],eV.prototype,"tokenBalances",void 0),eJ([(0,n.wk)()],eV.prototype,"isPaymentInProgress",void 0),eJ([(0,n.wk)()],eV.prototype,"exchangeUrlForQuote",void 0),eJ([(0,n.wk)()],eV.prototype,"completedTransactionsCount",void 0),eV=eJ([(0,m.EM)("w3m-pay-quote-view")],eV);let e8={network:"eip155:8453",asset:"native",metadata:{name:"Ethereum",symbol:"ETH",decimals:18}},e6={network:"eip155:8453",asset:"0x833589fcd6edb6e08f4c7c32d4f71b54bda02913",metadata:{name:"USD Coin",symbol:"USDC",decimals:6}},e9={network:"eip155:84532",asset:"native",metadata:{name:"Ethereum",symbol:"ETH",decimals:18}},e7={network:"eip155:1",asset:"0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",metadata:{name:"USD Coin",symbol:"USDC",decimals:6}},te={network:"eip155:10",asset:"0x0b2c639c533813f4aa9d7837caf62653d097ff85",metadata:{name:"USD Coin",symbol:"USDC",decimals:6}},tt={network:"eip155:42161",asset:"0xaf88d065e77c8cC2239327C5EDb3A432268e5831",metadata:{name:"USD Coin",symbol:"USDC",decimals:6}},ti={network:"eip155:137",asset:"0x3c499c542cef5e3811e1192ce70d8cc03d5c3359",metadata:{name:"USD Coin",symbol:"USDC",decimals:6}},ta={network:"solana:5eykt4UsFv8P8NJdTREpY1vzqKqZKvdp",asset:"EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",metadata:{name:"USD Coin",symbol:"USDC",decimals:6}},tn={network:"eip155:1",asset:"0xdAC17F958D2ee523a2206206994597C13D831ec7",metadata:{name:"Tether USD",symbol:"USDT",decimals:6}},ts={network:"eip155:10",asset:"0x94b008aA00579c1307B0EF2c499aD98a8ce58e58",metadata:{name:"Tether USD",symbol:"USDT",decimals:6}},tr={network:"eip155:42161",asset:"0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9",metadata:{name:"Tether USD",symbol:"USDT",decimals:6}},to={network:"eip155:137",asset:"0xc2132d05d31c914a87c6611c10748aeb04b58e8f",metadata:{name:"Tether USD",symbol:"USDT",decimals:6}},tc={network:"solana:5eykt4UsFv8P8NJdTREpY1vzqKqZKvdp",asset:"Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB",metadata:{name:"Tether USD",symbol:"USDT",decimals:6}},tl={network:"solana:5eykt4UsFv8P8NJdTREpY1vzqKqZKvdp",asset:"native",metadata:{name:"Solana",symbol:"SOL",decimals:9}}}}]);