(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[79],{15497:function(e,t,n){(window.__NEXT_P=window.__NEXT_P||[]).push(["/computing/instance/new",function(){return n(68884)}])},68884:function(e,t,n){"use strict";n.r(t),n.d(t,{default:function(){return NewInstancePage}});var i=n(85893),o=n(19521),s=n(67294),a=n(25675),d=n.n(a),r=n(79632),m=n(72882),l=n(53054),c=n(72086),p=n(34865),u=n(48998),h=n(20782),y=n(52464),g=n(68805),x=n(9911),f=n(93963),v=n(55032),j=n(11163),C=n.n(j),w=n(72036),_=n(24959),b=n(18090),S=n(31776),N=n(99978),k=n(96393),Z=n(87536),M=n(56312),P=n(37419),I=n(60539),R=n(68885),T=n(13450),A=n(86780),B=n(9324),L=n(93503),D=n(50586),X=n(25819),z=n(19061);function tooltipContent(e){let{title:t,description:n}=e;return(0,i.jsxs)("div",{children:[(0,i.jsx)("p",{className:"tp-body3 fs-18 text-base2",children:t}),(0,i.jsx)("p",{className:"tp-body1 fs-14 text-base2",children:n})]})}function accountConnectionRequiredDisabledMessage(e){return tooltipContent({title:"Account connection required",description:"Please connect your account to ".concat(e,".\n                  Connect your wallet using the top-right button to access all features.")})}function unsupportedStreamDisabledMessage(e){return tooltipContent({title:"Selected chain not supported",description:(0,i.jsxs)(i.Fragment,{children:[e," supports only the Holder tier payment method. To use the Pay-As-You-Go tier, please switch to the ",(0,i.jsx)("strong",{children:"Base"})," or"," ",(0,i.jsx)("strong",{children:"Avalanche"})," chain using the dropdown at the top of the page."]})})}var H=n(65426),E=n(3468),q=n(67656),F=n(41698),O=n(28565),V=n(75650),Y=n(24607),G=n(82690),U=n(39674),K=n(45866),W=n(49531),J=n(7053),$=n(48310),Q=n(93788),ee=n(85661),et=n(93161);let en=s.memo(e=>{let{disabled:t,title:n="Create instance",tooltipContent:o,isFooter:a,shouldRequestTermsAndConditions:d,handleRequestTermsAndConditionsAgreement:r,handleSubmit:l}=e,c=(0,s.useRef)(null);return(0,i.jsx)(m.ZP,{ref:c,type:d?"button":"submit",color:"main0",kind:"default",size:"lg",variant:"primary",disabled:t,tooltipContent:o,tooltipPosition:{my:a?"bottom-right":"bottom-center",at:a?"top-right":"top-center"},onClick:d?r:l,children:n})});function NewInstancePage(e){let{mainRef:t}=e,{address:n,accountBalance:o,blockchainName:a,streamDisabled:eM,disabledStreamDisabledMessage:eP,manuallySelectCRNDisabled:eI,manuallySelectCRNDisabledMessage:eR,createInstanceDisabled:eT,createInstanceDisabledMessage:eA,createInstanceButtonTitle:eB,values:eL,control:eD,errors:eX,cost:ez,node:eH,nodeSpecs:eE,lastVersion:eq,selectedModal:eF,setSelectedModal:eO,selectedNode:eV,setSelectedNode:eY,termsAndConditions:eG,shouldRequestTermsAndConditions:eU,modalOpen:eK,modalClose:eW,handleManuallySelectCRN:eJ,handleSelectNode:e$,handleSubmit:eQ,handleCloseModal:e0,handleBack:e1,handleRequestTermsAndConditionsAgreement:e5,handleAcceptTermsAndConditions:e2,handleCheckTermsAndConditions:e8}=function(){var e;let[,t]=(0,v.mr)(),{blockchain:n,account:o,balance:a=0,handleConnect:d}=(0,L.R)({triggerOnMount:!1}),m=(0,r.dd)(),l=null==m?void 0:m.open,c=null==m?void 0:m.close,p=(0,j.useRouter)(),{crn:u}=p.query,h=(0,s.useRef)(!1),y=(0,s.useRef)(void 0),[g,f]=(0,s.useState)(),[V,Y]=(0,s.useState)(),{specs:G}=(0,I.O)(),{lastVersion:U}=(0,q.W)(),K=(0,s.useMemo)(()=>{if(G)return u&&"string"==typeof u&&(y.current=G[u]),y.current},[G,u]),W=(0,s.useMemo)(()=>{if(K&&G)return G[K.hash]},[G,K]),{termsAndConditions:J}=(0,H.Z)({termsAndConditionsMessageHash:null==K?void 0:K.terms_and_conditions}),{defaultTiers:$}=(0,E.g)({type:x.py.Instance}),Q=(0,N.U)(),{next:ee,stop:et}=(0,A.A)({}),en=(0,s.useCallback)(async e=>{let i;if(!Q)throw D.Z.ConnectYourWallet;if(!o)throw D.Z.InvalidAccount;let s={chain:X.Ek.ETH,type:x.XL.Hold};if(e.paymentMethod===x.XL.Stream){if(!K||!K.stream_reward)throw D.Z.InvalidNode;if(!W)throw D.Z.InvalidCRNSpecs;if(!(null==e?void 0:e.streamCost))throw D.Z.InvalidStreamCost;let[t]=$,a=R.B.validateMinNodeSpecs(t,W);if(!a)throw D.Z.InvalidCRNSpecs;if(!n||!(0,w.SH)(n)||!(0,w.bz)(o))throw d({blockchain:X.Ek.BASE}),D.Z.InvalidNetwork;i=await (0,w.OH)(o),s={chain:n,type:x.XL.Stream,sender:o.address,receiver:K.stream_reward,streamCost:e.streamCost,streamDuration:e.streamDuration}}let a={...e,payment:s,node:e.paymentMethod===x.XL.Stream?K:void 0},r=await Q.getAddSteps(a),m=r.map(e=>A.n[e]),l=Q.addSteps(a,i);try{let e;for(;!e;){let{value:t,done:n}=await l.next();if(n){e=t;break}await ee(m)}t(new B.Wy({name:"instance",entities:e})),await C().replace("/")}finally{await et()}},[Q,o,K,W,$,n,d,t,ee,et]),ei={...b.y,image:S.iJ,specs:$[0],systemVolume:{size:null===(e=$[0])||void 0===e?void 0:e.storage},paymentMethod:x.XL.Hold,streamDuration:T.xe,streamCost:Number.POSITIVE_INFINITY,termsAndConditions:void 0},{control:eo,handleSubmit:es,formState:{errors:ea},setValue:ed}=(0,_.c)({defaultValues:ei,onSubmit:en,resolver:(0,M.F)(K?k.u.addStreamSchema:k.u.addSchema),readyDeps:[]}),er=(0,Z.qo)({control:eo}),{storage:em}=er.specs,{size:el}=er.systemVolume,ec=(0,s.useMemo)(()=>er.paymentMethod===x.XL.Stream?{chain:n,type:x.XL.Stream,sender:null==o?void 0:o.address,receiver:null==K?void 0:K.stream_reward,streamCost:(null==er?void 0:er.streamCost)||1,streamDuration:null==er?void 0:er.streamDuration}:{chain:n,type:x.XL.Hold},[er,n,o,K]),ep=(0,s.useMemo)(()=>({entityType:x.py.Instance,props:{node:K,specs:er.specs,volumes:er.volumes,domains:er.domains,streamDuration:er.streamDuration,paymentMethod:er.paymentMethod,payment:ec,isPersistent:!0,image:er.image,systemVolume:er.systemVolume,name:er.name||"MOCK",sshKeys:er.sshKeys||[{key:"MOCK",isNew:!0,isSelected:!0}]}}),[K,ec,er]),eu=(0,P.F)(ep),eh=(0,s.useMemo)(()=>!!(null==K?void 0:K.terms_and_conditions)&&er.paymentMethod===x.XL.Stream,[K,er.paymentMethod]),ey=(0,s.useMemo)(()=>{var e;return n?null===(e=X.DR[n])||void 0===e?void 0:e.name:"Current network"},[n]),eg=(0,s.useMemo)(()=>o?(0,w.bz)(o)||er.paymentMethod!==x.XL.Hold?void 0:unsupportedStreamDisabledMessage(ey):accountConnectionRequiredDisabledMessage("enable switching payment methods"),[o,ey,er.paymentMethod]),ex=(0,s.useMemo)(()=>!!eg,[eg]),ef=(0,s.useMemo)(()=>(null==o?void 0:o.address)||"",[o]),ev=(0,s.useMemo)(()=>o?(0,w.bz)(o)?er.paymentMethod===x.XL.Hold?tooltipContent({title:"Feature Unavailable in Holder Tier",description:(0,i.jsxs)(i.Fragment,{children:["Manual CRN selection is disabled in the Holder tier. Switch to the"," ",(0,i.jsx)("strong",{children:"Pay-As-You-Go"})," tier to enable manual selection of CRNs."]})}):void 0:tooltipContent({title:"Manual CRN Selection Unavailable",description:(0,i.jsxs)(i.Fragment,{children:["Manual selection of CRN is not supported on ",ey,". To access manual CRN selection, please switch to the ",(0,i.jsx)("strong",{children:"Base"})," or"," ",(0,i.jsx)("strong",{children:"Avalanche"})," chain using the dropdown at the top of the page."]})}):accountConnectionRequiredDisabledMessage("manually selecting CRNs"),[o,ey,er.paymentMethod]),ej=(0,s.useMemo)(()=>!!ev,[ev]),{canAfford:eC,isCreateButtonDisabled:ew}=(0,O.U)({cost:eu,accountBalance:a}),e_=(0,s.useMemo)(()=>!!o&&(!ew||eC),[o,eC,ew]),eb=(0,s.useMemo)(()=>er.paymentMethod!==x.XL.Stream||(0,w.SH)(n)?er.paymentMethod!==x.XL.Hold||(0,z.e)(n)?void 0:tooltipContent({title:"Payment Method not supported",description:(0,i.jsxs)(i.Fragment,{children:[ey," doesn't support Holder tier payment method. Please switch the chain using the dropdown at the top of the page."]})}):unsupportedStreamDisabledMessage(ey),[n,ey,er.paymentMethod]),eS=(0,s.useMemo)(()=>o?e_?"Create instance":"Insufficient ALEPH":"Connect",[o,e_]),eN=(0,s.useMemo)(()=>"Create instance"!==eS||!!eb,[eS,eb]),ek=(0,s.useCallback)(async()=>{if(Y(void 0),!g)return;let{hash:e}=g,{crn:t,...n}=p.query;t!==e&&C().replace({query:g?{...n,crn:e}:n})},[p.query,g]),eZ=(0,s.useCallback)(()=>{Y("node-list")},[]),eM=(0,s.useCallback)(()=>{Y(void 0)},[]),eP=(0,s.useCallback)(()=>{Y("terms-and-conditions")},[]),eI=(0,s.useCallback)(()=>{er.termsAndConditions?ed("termsAndConditions",void 0):ed("termsAndConditions",null==K?void 0:K.terms_and_conditions)},[er.termsAndConditions,K,ed]),eR=(0,s.useCallback)(e=>{eM(),es(e)},[eM,es]);(0,s.useEffect)(()=>{!h.current&&p.isReady&&(h.current=!0,u&&ed("paymentMethod",x.XL.Stream))},[u,p.isReady,ed]),(0,s.useEffect)(()=>{if(!K)return;let{crn:e,...t}=C().query;C().replace({query:er.paymentMethod===x.XL.Hold?{...t}:{...t,crn:K.hash}})},[K,er.paymentMethod]);let eT=(0,F.Z)(em);return(0,s.useEffect)(()=>{if(!em||em===eT)return;let e=el===eT?em:Math.max(em,el);ed("systemVolume.size",e)},[em,eT,ed,el]),(0,s.useEffect)(()=>{ed("nodeSpecs",W)},[W,ed]),(0,s.useEffect)(()=>{eu&&eu.paymentMethod===x.XL.Stream&&er.streamCost!==eu.cost&&ed("streamCost",eu.cost)},[eu,ed,er]),{address:ef,accountBalance:a,blockchainName:ey,createInstanceDisabled:eN,createInstanceDisabledMessage:eb,createInstanceButtonTitle:eS,manuallySelectCRNDisabled:ej,manuallySelectCRNDisabledMessage:ev,values:er,control:eo,errors:ea,cost:eu,node:K,lastVersion:U,nodeSpecs:W,streamDisabled:ex,disabledStreamDisabledMessage:eg,selectedModal:V,setSelectedModal:Y,selectedNode:g,setSelectedNode:f,termsAndConditions:J,shouldRequestTermsAndConditions:eh,modalOpen:l,modalClose:c,handleManuallySelectCRN:eZ,handleSelectNode:ek,handleSubmit:es,handleCloseModal:eM,handleBack:()=>{p.push(".")},handleRequestTermsAndConditionsAgreement:eP,handleCheckTermsAndConditions:eI,handleAcceptTermsAndConditions:eR}}(),e6=(0,s.useCallback)(e=>(eL.paymentMethod===x.XL.Stream?1:0)+e,[eL.paymentMethod]);(0,s.useEffect)(()=>{if(eK&&eW)switch(eF){case"node-list":return eK({header:"",width:"80rem",onClose:e0,content:(0,i.jsx)($.Z,{selected:eV,onSelectedChange:eY}),footer:(0,i.jsx)(i.Fragment,{children:(0,i.jsx)(ei,{children:(0,i.jsx)(eo,{type:"button",variant:"primary",size:"md",onClick:e$,disabled:!eV,children:"Continue"})})})});case"terms-and-conditions":if(!eG)return eW();return eK({header:(0,i.jsx)(r.DU,{type:"h6",children:"Accept Terms & Conditions"}),width:"34rem",onClose:e0,content:(0,i.jsx)(i.Fragment,{children:(0,i.jsxs)(es,{children:[(0,i.jsx)(r.XZ,{onChange:e8,checked:eL.termsAndConditions}),(0,i.jsxs)("div",{className:"tp-body",children:["I have read, understood, and agree to the"," ",(0,i.jsx)(et.Z,{text:"Terms & Conditions",href:eG.url,color:"main0",typo:"body3",underline:!0})," ","of this Core Resouce Node."]})]})}),footer:(0,i.jsx)(i.Fragment,{children:(0,i.jsxs)(ea,{children:[(0,i.jsx)(r.zx,{type:"button",variant:"secondary",size:"md",onClick:e0,children:"Cancel"}),(0,i.jsx)(r.zx,{type:"submit",variant:"primary",size:"md",onClick:e2,disabled:!eL.termsAndConditions,children:"Confirm & Proceed"})]})})});default:return eW()}},[eH,eF,eV,eL.termsAndConditions,eY,e$,e0,e8,e2]);let e3=(0,s.useMemo)(()=>[{label:"NAME",render:e=>(0,i.jsx)(r.tJ,{hash:e.hash,name:e.name,picture:e.picture,ImageCmp:d(),apiServer:x.pf})},{label:"SCORE",render:e=>(0,i.jsx)(r.WG,{score:e.score})},{label:"VERSION",render:e=>(0,i.jsx)(r.pJ,{version:(null==e?void 0:e.version)||"",lastVersion:eq})},{label:"",align:"right",render:()=>(0,i.jsx)(ed,{children:(0,i.jsx)(r.zx,{type:"button",kind:"functional",size:"md",variant:"warning",onClick:()=>eO("node-list"),children:"Change CRN"})})}],[eq,eO]),e4=(0,s.useMemo)(()=>eH?[eH]:[],[eH]),e9=(0,s.useRef)(null),e7=(0,s.useRef)(null);return(0,i.jsxs)(i.Fragment,{children:[(0,i.jsx)(Q.Z,{handleBack:e1}),(0,i.jsxs)(V.Z,{onSubmit:eQ,errors:eX,children:[(0,i.jsx)(er,{children:(0,i.jsx)(f.Z,{children:(0,i.jsx)(G.Z,{selected:"instance"})})}),eA&&(0,i.jsx)(em,{children:(0,i.jsx)(f.Z,{children:(0,i.jsx)(ee.Z,{$color:"warning",children:eA})})}),eL.paymentMethod===x.XL.Stream&&(0,i.jsx)(el,{children:(0,i.jsxs)(f.Z,{children:[(0,i.jsx)(W.N,{number:1,children:"Select your node"}),(0,i.jsxs)("p",{children:["Your instance is set up with your manually selected Compute Resource Node (CRN), operating under the"," ",(0,i.jsx)(J.Z,{children:"Pay-as-you-go"})," payment method on"," ",(0,i.jsx)(J.Z,{children:a}),". This setup gives you direct control over your resource allocation and costs, requiring active management of your instance. To adjust your CRN or explore different payment options, you can modify your selection below."]}),(0,i.jsx)(ec,{children:(0,i.jsxs)(r.Jy,{children:[(0,i.jsx)(U.Z,{columns:e3,data:e4,rowProps:()=>({className:"_active"})}),(0,i.jsx)(ep,{children:!eH&&(0,i.jsx)(i.Fragment,{children:(0,i.jsx)(m.ZP,{ref:e9,type:"button",kind:"functional",variant:"warning",size:"md",onClick:eJ,disabled:eI,tooltipContent:eR,tooltipPosition:{my:"bottom-left",at:"center-center"},children:"Manually select CRN"})})})]})})]})}),(0,i.jsx)(eu,{children:(0,i.jsxs)(f.Z,{children:[(0,i.jsx)(W.N,{number:e6(1),children:"Select your tier"}),eL.paymentMethod===x.XL.Hold?(0,i.jsxs)("p",{children:["Your instance is ready to be configured using our"," ",(0,i.jsx)(J.Z,{children:"automated CRN selection"}),", set to run on"," ",(0,i.jsx)(J.Z,{children:a})," with the"," ",(0,i.jsx)(J.Z,{children:"Holder-tier payment"})," method, allowing you seamless access while you hold ALEPH tokens. If you wish to customize your Compute Resource Node (CRN) or use a different payment approach, you can change your selection below."]}):(0,i.jsx)("p",{children:"Please select one of the available instance tiers as a base for your VM. You will be able to customize the volumes further below in the form."}),(0,i.jsxs)(eh,{children:[(0,i.jsx)(K.Z,{show:!!eH&&!eE}),(0,i.jsx)(c.Z,{name:"specs",control:eD,type:x.py.Instance,isPersistent:!0,paymentMethod:eL.paymentMethod,nodeSpecs:eE,children:eL.paymentMethod!==x.XL.Stream?(0,i.jsx)(ey,{children:(0,i.jsx)(m.ZP,{ref:e7,type:"button",kind:"functional",variant:"warning",size:"md",disabled:eI,onClick:eJ,tooltipContent:eR,tooltipPosition:{my:"bottom-left",at:"center-center"},children:"Manually select CRN"})}):!eH&&(0,i.jsx)(eg,{children:"First select your node in the previous step"})})]})]})}),(0,i.jsx)(ex,{children:(0,i.jsxs)(f.Z,{children:[(0,i.jsx)(W.N,{number:e6(2),children:"Choose an image"}),(0,i.jsx)("p",{children:"Chose a base image for your VM. It's the base system that you will be able to customize."}),(0,i.jsx)(ef,{children:(0,i.jsx)(l.Z,{name:"image",control:eD})})]})}),(0,i.jsx)(ev,{children:(0,i.jsxs)(f.Z,{children:[(0,i.jsx)(W.N,{number:e6(3),children:"Configure SSH Key"}),(0,i.jsx)("p",{children:"Access your cloud instances securely. Give existing key's below access to this instance or add new keys. Remember, storing private keys safely is crucial for security. If you need help, our support team is always ready to assist."}),(0,i.jsx)(ej,{children:(0,i.jsx)(u.Z,{name:"sshKeys",control:eD})})]})}),(0,i.jsx)(eC,{children:(0,i.jsxs)(f.Z,{children:[(0,i.jsx)(W.N,{number:e6(4),children:"Name and tags"}),(0,i.jsx)(ew,{children:"Organize and identify your instances more effectively by assigning a unique name, obtaining a hash reference, and defining multiple tags. This helps streamline your development process and makes it easier to manage your web3 instances."}),(0,i.jsx)(y.Z,{control:eD,entityType:x.py.Instance})]})}),(0,i.jsx)(e_,{children:(0,i.jsxs)(f.Z,{children:[(0,i.jsx)(W.N,{number:e6(5),children:"Advanced Configuration Options"}),(0,i.jsx)(eb,{children:"Customize your instance with our Advanced Configuration Options. Add volumes and custom domains to meet your specific needs."}),(0,i.jsxs)(eS,{children:[(0,i.jsx)(eN,{children:(0,i.jsxs)(Y.Z,{label:"Add Volume",children:[(0,i.jsx)(r.DU,{forwardedAs:"h2",type:"h6",color:"main0",children:"Add volumes"}),(0,i.jsx)(p.Z,{name:"volumes",control:eD,systemVolume:eL.systemVolume})]})}),(0,i.jsx)(ek,{children:(0,i.jsxs)(Y.Z,{label:"Add Custom Domain",children:[(0,i.jsx)(r.DU,{forwardedAs:"h2",type:"h6",color:"main0",children:"Custom domain"}),(0,i.jsx)(eZ,{children:"You have the ability to configure a domain name to access your cloud instances. By setting up a user-friendly custom domain, accessing your instances becomes easier and more intuitive. It&s another way we&re making web3 cloud management as straightforward as possible."}),(0,i.jsx)(h.Z,{name:"domains",control:eD,entityType:x.sY.Instance})]})})]})]})}),(0,i.jsx)(g.Z,{control:eD,address:n,cost:ez,receiverAddress:null==eH?void 0:eH.reward,unlockedAmount:o,paymentMethod:eL.paymentMethod,streamDuration:eL.streamDuration,disablePaymentMethod:eM,disabledStreamTooltip:eP,mainRef:t,description:(0,i.jsx)(i.Fragment,{children:"You can either leverage the traditional method of holding tokens in your wallet for resource access, or opt for the Pay-As-You-Go (PAYG) system, which allows you to pay precisely for what you use, for the duration you need. The PAYG option includes a token stream feature, enabling real-time payment for resources as you use them."}),button:(0,i.jsx)(en,{disabled:eT,title:eB,tooltipContent:eA,isFooter:!1,shouldRequestTermsAndConditions:eU,handleRequestTermsAndConditionsAgreement:e5,handleSubmit:eQ}),footerButton:(0,i.jsx)(en,{disabled:eT,title:eB,tooltipContent:eA,isFooter:!0,shouldRequestTermsAndConditions:eU,handleRequestTermsAndConditionsAgreement:e5,handleSubmit:eQ})})]})]})}en.displayName="CheckoutButton";var ei=(0,o.ZP)("div").withConfig({displayName:"cmp___StyledDiv",componentId:"sc-1kuxjv2-0"})({display:"flex",width:"100%",justifyContent:"flex-end"}),eo=(0,o.ZP)(r.zx).withConfig({displayName:"cmp___StyledButton",componentId:"sc-1kuxjv2-1"})({marginLeft:"auto !important"}),es=(0,o.ZP)("div").withConfig({displayName:"cmp___StyledDiv2",componentId:"sc-1kuxjv2-2"})({marginBottom:"2rem",display:"flex",maxWidth:"28rem",alignItems:"center",gap:"1rem"}),ea=(0,o.ZP)("div").withConfig({displayName:"cmp___StyledDiv3",componentId:"sc-1kuxjv2-3"})({display:"flex",width:"100%",justifyContent:"space-between"}),ed=(0,o.ZP)("div").withConfig({displayName:"cmp___StyledDiv4",componentId:"sc-1kuxjv2-4"})({display:"flex",justifyContent:"flex-end",gap:"0.75rem"}),er=(0,o.ZP)("section").withConfig({displayName:"cmp___StyledSection",componentId:"sc-1kuxjv2-5"})({paddingLeft:"0px",paddingRight:"0px",paddingTop:"0px",paddingBottom:"0px","@media (min-width: 48rem)":{paddingTop:"2rem",paddingBottom:"2rem"}}),em=(0,o.ZP)("section").withConfig({displayName:"cmp___StyledSection2",componentId:"sc-1kuxjv2-6"})({paddingLeft:"0px",paddingRight:"0px",paddingBottom:"1.5rem",paddingTop:"5rem","@media (min-width: 48rem)":{paddingTop:"2.5rem",paddingBottom:"2.5rem"}}),el=(0,o.ZP)("section").withConfig({displayName:"cmp___StyledSection3",componentId:"sc-1kuxjv2-7"})({paddingLeft:"0px",paddingRight:"0px",paddingBottom:"1.5rem",paddingTop:"5rem","@media (min-width: 48rem)":{paddingTop:"2.5rem",paddingBottom:"2.5rem"}}),ec=(0,o.ZP)("div").withConfig({displayName:"cmp___StyledDiv5",componentId:"sc-1kuxjv2-8"})({position:"relative",marginBottom:"1.5rem",marginTop:"3rem",minHeight:"6rem",paddingLeft:"0px",paddingRight:"0px"}),ep=(0,o.ZP)("div").withConfig({displayName:"cmp___StyledDiv6",componentId:"sc-1kuxjv2-9"})({marginTop:"1.5rem"}),eu=(0,o.ZP)("section").withConfig({displayName:"cmp___StyledSection4",componentId:"sc-1kuxjv2-10"})({paddingLeft:"0px",paddingRight:"0px",paddingBottom:"1.5rem",paddingTop:"5rem","@media (min-width: 48rem)":{paddingTop:"2.5rem",paddingBottom:"2.5rem"}}),eh=(0,o.ZP)("div").withConfig({displayName:"cmp___StyledDiv7",componentId:"sc-1kuxjv2-11"})({position:"relative",marginTop:"1.5rem",marginBottom:"1.5rem",paddingLeft:"0px",paddingRight:"0px"}),ey=(0,o.ZP)("div").withConfig({displayName:"cmp___StyledDiv8",componentId:"sc-1kuxjv2-12"})({marginTop:"1.5rem"}),eg=(0,o.ZP)("div").withConfig({displayName:"cmp___StyledDiv9",componentId:"sc-1kuxjv2-13"})({marginTop:"1.5rem",textAlign:"center"}),ex=(0,o.ZP)("section").withConfig({displayName:"cmp___StyledSection5",componentId:"sc-1kuxjv2-14"})({paddingLeft:"0px",paddingRight:"0px",paddingBottom:"1.5rem",paddingTop:"5rem","@media (min-width: 48rem)":{paddingTop:"2.5rem",paddingBottom:"2.5rem"}}),ef=(0,o.ZP)("div").withConfig({displayName:"cmp___StyledDiv10",componentId:"sc-1kuxjv2-15"})({marginBottom:"1.5rem",marginTop:"3rem",paddingLeft:"0px",paddingRight:"0px"}),ev=(0,o.ZP)("section").withConfig({displayName:"cmp___StyledSection6",componentId:"sc-1kuxjv2-16"})({paddingLeft:"0px",paddingRight:"0px",paddingBottom:"1.5rem",paddingTop:"5rem","@media (min-width: 48rem)":{paddingTop:"2.5rem",paddingBottom:"2.5rem"}}),ej=(0,o.ZP)("div").withConfig({displayName:"cmp___StyledDiv11",componentId:"sc-1kuxjv2-17"})({marginTop:"1.5rem",marginBottom:"1.5rem",paddingLeft:"0px",paddingRight:"0px"}),eC=(0,o.ZP)("section").withConfig({displayName:"cmp___StyledSection7",componentId:"sc-1kuxjv2-18"})({paddingLeft:"0px",paddingRight:"0px",paddingBottom:"1.5rem",paddingTop:"5rem","@media (min-width: 48rem)":{paddingTop:"2.5rem",paddingBottom:"2.5rem"}}),ew=(0,o.ZP)("p").withConfig({displayName:"cmp___StyledP",componentId:"sc-1kuxjv2-19"})({marginBottom:"1.5rem"}),e_=(0,o.ZP)("section").withConfig({displayName:"cmp___StyledSection8",componentId:"sc-1kuxjv2-20"})({paddingLeft:"0px",paddingRight:"0px",paddingBottom:"1.5rem",paddingTop:"5rem","@media (min-width: 48rem)":{paddingTop:"2.5rem",paddingBottom:"2.5rem"}}),eb=(0,o.ZP)("p").withConfig({displayName:"cmp___StyledP2",componentId:"sc-1kuxjv2-21"})({marginBottom:"1.5rem"}),eS=(0,o.ZP)("div").withConfig({displayName:"cmp___StyledDiv12",componentId:"sc-1kuxjv2-22"})({marginTop:"1.5rem",marginBottom:"1.5rem",paddingLeft:"0px",paddingRight:"0px"}),eN=(0,o.ZP)("div").withConfig({displayName:"cmp___StyledDiv13",componentId:"sc-1kuxjv2-23"})({marginBottom:"1rem"}),ek=(0,o.ZP)("div").withConfig({displayName:"cmp___StyledDiv14",componentId:"sc-1kuxjv2-24"})({marginBottom:"1rem"}),eZ=(0,o.ZP)("p").withConfig({displayName:"cmp___StyledP3",componentId:"sc-1kuxjv2-25"})({marginBottom:"1.5rem"})}},function(e){e.O(0,[536,161,855,747,939,777,774,888,179],function(){return e(e.s=15497)}),_N_E=e.O()}]);