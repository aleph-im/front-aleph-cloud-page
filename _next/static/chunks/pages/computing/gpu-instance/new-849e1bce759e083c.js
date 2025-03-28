(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[582],{76891:function(e,t,n){(window.__NEXT_P=window.__NEXT_P||[]).push(["/computing/gpu-instance/new",function(){return n(27079)}])},27079:function(e,t,n){"use strict";n.r(t),n.d(t,{default:function(){return NewGpuInstancePage}});var i=n(85893),o=n(19521),s=n(67294),d=n(25675),a=n.n(d),r=n(79632),m=n(72882),l=n(53054),c=n(50219),p=n(34865),u=n(48998),h=n(20782),g=n(52464),y=n(68805),x=n(9911),f=n(93963),v=n(75650),C=n(24607),w=n(82690),_=n(39674),j=n(45866),b=n(49531),S=n(7053),Z=n(48310),P=n(93788),N=n(85661),I=n(93161),M=n(55032),T=n(11163),k=n.n(T),A=n(72036),B=n(24959),R=n(18090),D=n(31776),G=n(87536),L=n(56312),z=n(37419),E=n(60539),F=n(68885),H=n(13450),U=n(86780),O=n(9324),X=n(93503),Y=n(50586),q=n(25819),V=n(19061);function tooltipContent(e){let{title:t,description:n}=e;return(0,i.jsxs)("div",{children:[(0,i.jsx)("p",{className:"tp-body3 fs-18 text-base2",children:t}),(0,i.jsx)("p",{className:"tp-body1 fs-14 text-base2",children:n})]})}var K=n(65426),W=n(29206),J=n(78474),Q=n(67100),$=n(41698),ee=n(28565);let et=s.memo(e=>{let{disabled:t,title:n="Create instance",tooltipContent:o,isFooter:d,shouldRequestTermsAndConditions:a,handleRequestTermsAndConditionsAgreement:r,handleSubmit:l}=e,c=(0,s.useRef)(null);return(0,i.jsx)(m.ZP,{ref:c,type:a?"button":"submit",color:"main0",kind:"default",size:"lg",variant:"primary",disabled:t,tooltipContent:o,tooltipPosition:{my:d?"bottom-right":"bottom-center",at:d?"top-right":"top-center"},onClick:a?r:l,children:n})});function NewGpuInstancePage(e){var t;let{mainRef:n}=e,{address:o,accountBalance:d,blockchainName:eP,streamDisabled:eN,disabledStreamDisabledMessage:eI,createInstanceDisabled:eM,createInstanceDisabledMessage:eT,createInstanceButtonTitle:ek,values:eA,control:eB,errors:eR,cost:eD,node:eG,nodeSpecs:eL,selectedModal:ez,setSelectedModal:eE,selectedNode:eF,setSelectedNode:eH,termsAndConditions:eU,shouldRequestTermsAndConditions:eO,modalOpen:eX,modalClose:eY,handleManuallySelectCRN:eq,handleSelectNode:eV,handleSubmit:eK,handleCloseModal:eW,handleBack:eJ,handleRequestTermsAndConditionsAgreement:eQ,handleAcceptTermsAndConditions:e$,handleCheckTermsAndConditions:e0}=function(){var e;let[,t]=(0,M.mr)(),{blockchain:n,account:o,balance:d=0,handleConnect:a}=(0,X.R)({triggerOnMount:!1}),m=(0,r.dd)(),l=null==m?void 0:m.open,c=null==m?void 0:m.close,p=(0,T.useRouter)(),{crn:u,gpu:h}=p.query,g=(0,s.useRef)(void 0),[y,f]=(0,s.useState)(),[v,C]=(0,s.useState)(),{specs:w}=(0,E.O)(),_=(0,s.useMemo)(()=>{if(w){if(!u||!h||"string"!=typeof u||"string"!=typeof h)return g.current;if(y)g.current=y;else{var e,t;let n=null===(t=w[u])||void 0===t?void 0:null===(e=t.compatible_available_gpus)||void 0===e?void 0:e.find(e=>e.model===h);n&&(g.current={...w[u],selectedGpu:n})}return g.current}},[u,h,y,w]),j=(0,s.useMemo)(()=>{if(_&&w)return w[_.hash]},[w,_]),{termsAndConditions:b}=(0,K.Z)({termsAndConditionsMessageHash:null==_?void 0:_.terms_and_conditions}),{defaultTiers:S}=(0,W.g)({type:x.py.GpuInstance,gpuModel:null==y?void 0:null===(e=y.selectedGpu)||void 0===e?void 0:e.model}),Z=(0,J.c)(),{next:P,stop:N}=(0,U.A)({}),I=(0,s.useCallback)(async e=>{if(!Z)throw Y.Z.ConnectYourWallet;if(!o)throw Y.Z.InvalidAccount;if(!_||!_.stream_reward)throw Y.Z.InvalidNode;if(!j)throw Y.Z.InvalidCRNSpecs;if(!(null==e?void 0:e.streamCost))throw Y.Z.InvalidStreamCost;let[i]=S,s=F.B.validateMinNodeSpecs(i,j);if(!s)throw Y.Z.InvalidCRNSpecs;if(!n||!(0,A.SH)(n)||!(0,A.bz)(o))throw a({blockchain:q.Ek.BASE}),Y.Z.InvalidNetwork;let d=await (0,A.OH)(o),r={chain:n,type:x.XL.Stream,sender:o.address,receiver:_.stream_reward,streamCost:e.streamCost,streamDuration:e.streamDuration},m={...e,payment:r,node:e.paymentMethod===x.XL.Stream?_:void 0},l=await Z.getAddSteps(m),c=l.map(e=>U.n[e]),p=Z.addSteps(m,d);try{let e;for(;!e;){let{value:t,done:n}=await p.next();if(n){e=t;break}await P(c)}t(new O.Wy({name:"instance",entities:e})),await k().replace("/")}finally{await N()}},[Z,o,_,j,S,n,a,t,P,N]),et=(0,s.useMemo)(()=>{var e;return{...R.y,image:D.iJ,specs:void 0,systemVolume:{size:null===(e=S[0])||void 0===e?void 0:e.storage},paymentMethod:x.XL.Stream,streamDuration:H.xe,streamCost:Number.POSITIVE_INFINITY,termsAndConditions:void 0}},[S]),{control:en,handleSubmit:ei,formState:{errors:eo},setValue:es}=(0,B.c)({defaultValues:et,onSubmit:I,resolver:(0,L.F)(Q.Q.addStreamSchema),readyDeps:[et]}),ed=(0,G.qo)({control:en}),{storage:ea}=ed.specs||{},{size:er}=ed.systemVolume,em=(0,s.useMemo)(()=>({chain:n,type:x.XL.Stream,sender:null==o?void 0:o.address,receiver:null==_?void 0:_.stream_reward,streamCost:(null==ed?void 0:ed.streamCost)||1,streamDuration:null==ed?void 0:ed.streamDuration}),[ed,n,o,_]),el=(0,s.useMemo)(()=>({entityType:x.py.GpuInstance,props:{node:_,specs:ed.specs,volumes:ed.volumes,domains:ed.domains,streamDuration:ed.streamDuration,paymentMethod:ed.paymentMethod,payment:em,isPersistent:!0,image:ed.image,systemVolume:ed.systemVolume,name:ed.name||"MOCK",sshKeys:ed.sshKeys||[{key:"MOCK",isNew:!0,isSelected:!0}]}}),[_,em,ed]),ec=(0,z.F)(el),ep=(0,s.useMemo)(()=>!!(null==_?void 0:_.terms_and_conditions)&&ed.paymentMethod===x.XL.Stream,[_,ed.paymentMethod]),eu=(0,s.useMemo)(()=>{var e;return n?null===(e=q.DR[n])||void 0===e?void 0:e.name:"Current network"},[n]),eh=tooltipContent({title:"Holder Tier not supported",description:"GPU Instances only support Pay-as-you-go."}),eg=(0,s.useMemo)(()=>(null==o?void 0:o.address)||"",[o]),{canAfford:ey,isCreateButtonDisabled:ex}=(0,ee.U)({cost:ec,accountBalance:d}),ef=(0,s.useMemo)(()=>!!o&&(!ex||ey),[o,ey,ex]),ev=(0,s.useMemo)(()=>ed.paymentMethod!==x.XL.Stream||(0,A.SH)(n)?ed.paymentMethod!==x.XL.Hold||(0,V.e)(n)?void 0:tooltipContent({title:"Payment Method not supported",description:(0,i.jsxs)(i.Fragment,{children:[eu," doesn't support Holder tier payment method. Please switch the chain using the dropdown at the top of the page."]})}):tooltipContent({title:"Selected chain not supported",description:(0,i.jsxs)(i.Fragment,{children:[eu," supports only the Holder tier payment method. To use the Pay-As-You-Go tier, please switch to the ",(0,i.jsx)("strong",{children:"Base"})," or"," ",(0,i.jsx)("strong",{children:"Avalanche"})," chain using the dropdown at the top of the page."]})}),[n,eu,ed.paymentMethod]),eC=(0,s.useMemo)(()=>o?ef?"Create instance":"Insufficient ALEPH":"Connect",[o,ef]),ew=(0,s.useMemo)(()=>"Create instance"!==eC||!!ev,[eC,ev]),e_=(0,s.useCallback)(async()=>{var e,t;if(C(void 0),!y)return;let{crn:n,gpu:i,...o}=p.query;(n!==y.hash||i!==(null===(e=y.selectedGpu)||void 0===e?void 0:e.model))&&k().replace({query:y?{...o,crn:y.hash,gpu:null===(t=y.selectedGpu)||void 0===t?void 0:t.model}:o})},[p.query,y]),ej=(0,s.useCallback)(()=>{C("node-list")},[]),eb=(0,s.useCallback)(()=>{C(void 0)},[]),eS=(0,s.useCallback)(()=>{C("terms-and-conditions")},[]),eZ=(0,s.useCallback)(()=>{ed.termsAndConditions?es("termsAndConditions",void 0):es("termsAndConditions",null==_?void 0:_.terms_and_conditions)},[ed.termsAndConditions,_,es]),eP=(0,s.useCallback)(e=>{eb(),ei(e)},[eb,ei]),eN=(0,$.Z)(ea);return(0,s.useEffect)(()=>{if(!ea||ea===eN)return;let e=er===eN?ea:Math.max(ea,er);es("systemVolume.size",e)},[ea,eN,es,er]),(0,s.useEffect)(()=>{es("nodeSpecs",j)},[j,es]),(0,s.useEffect)(()=>{ec&&ed.streamCost!==ec.cost&&es("streamCost",ec.cost)},[ec,es,ed]),{address:eg,accountBalance:d,blockchainName:eu,createInstanceDisabled:ew,createInstanceDisabledMessage:ev,createInstanceButtonTitle:eC,values:ed,control:en,errors:eo,cost:ec,node:_,nodeSpecs:j,streamDisabled:!0,disabledStreamDisabledMessage:eh,selectedModal:v,setSelectedModal:C,selectedNode:y,setSelectedNode:f,termsAndConditions:b,shouldRequestTermsAndConditions:ep,modalOpen:l,modalClose:c,handleManuallySelectCRN:ej,handleSelectNode:e_,handleSubmit:ei,handleCloseModal:eb,handleBack:()=>{p.push(".")},handleRequestTermsAndConditionsAgreement:eS,handleCheckTermsAndConditions:eZ,handleAcceptTermsAndConditions:eP}}(),e1=(0,s.useCallback)(e=>(eA.paymentMethod===x.XL.Stream?1:0)+e,[eA.paymentMethod]);(0,s.useEffect)(()=>{if(eX&&eY)switch(ez){case"node-list":return eX({header:"",width:"80rem",onClose:eW,content:(0,i.jsx)(Z.Z,{enableGpu:!0,selected:eF,onSelectedChange:eH}),footer:(0,i.jsx)(i.Fragment,{children:(0,i.jsx)(en,{children:(0,i.jsx)(ei,{type:"button",variant:"primary",size:"md",onClick:eV,disabled:!eF,children:"Continue"})})})});case"terms-and-conditions":if(!eU)return eY();return eX({header:(0,i.jsx)(r.DU,{type:"h6",children:"Accept Terms & Conditions"}),width:"34rem",onClose:eW,content:(0,i.jsx)(i.Fragment,{children:(0,i.jsxs)(eo,{children:[(0,i.jsx)(r.XZ,{onChange:e0,checked:eA.termsAndConditions}),(0,i.jsxs)("div",{className:"tp-body",children:["I have read, understood, and agree to the"," ",(0,i.jsx)(I.Z,{text:"Terms & Conditions",href:eU.url,color:"main0",typo:"body3",underline:!0})," ","of this Core Resouce Node."]})]})}),footer:(0,i.jsx)(i.Fragment,{children:(0,i.jsxs)(es,{children:[(0,i.jsx)(r.zx,{type:"button",variant:"secondary",size:"md",onClick:eW,children:"Cancel"}),(0,i.jsx)(r.zx,{type:"submit",variant:"primary",size:"md",onClick:e$,disabled:!eA.termsAndConditions,children:"Confirm & Proceed"})]})})});default:return eY()}},[eG,ez,eF,eA.termsAndConditions,eH,eV,eW,e0,e$]);let e5=(0,s.useMemo)(()=>[{label:"NAME",render:e=>(0,i.jsx)(r.tJ,{hash:e.hash,name:e.name,picture:e.picture,ImageCmp:a(),apiServer:x.pf})},{label:"SCORE",render:e=>(0,i.jsx)(r.WG,{score:e.score})},{label:"GPU",render:e=>{var t;return null==e?void 0:null===(t=e.selectedGpu)||void 0===t?void 0:t.model}},{label:"",align:"right",render:()=>(0,i.jsx)(ed,{children:(0,i.jsx)(r.zx,{type:"button",kind:"functional",size:"md",variant:"warning",onClick:()=>eE("node-list"),children:"Change GPU"})})}],[eE]),e4=(0,s.useMemo)(()=>eG?[eG]:[],[eG]),e2=(0,s.useRef)(null);return(0,i.jsxs)(i.Fragment,{children:[(0,i.jsx)(P.Z,{handleBack:eJ}),(0,i.jsxs)(v.Z,{onSubmit:eK,errors:eR,children:[(0,i.jsx)(ea,{children:(0,i.jsx)(f.Z,{children:(0,i.jsx)(w.Z,{selected:"gpu-instance"})})}),eT&&(0,i.jsx)(er,{children:(0,i.jsx)(f.Z,{children:(0,i.jsx)(N.Z,{$color:"warning",children:eT})})}),(0,i.jsx)(em,{children:(0,i.jsxs)(f.Z,{children:[(0,i.jsx)(b.N,{number:1,children:"Selected GPU"}),(0,i.jsxs)("p",{children:["Your instance is configured with your manually selected GPU, operating under the ",(0,i.jsx)(S.Z,{children:"Pay-as-you-go"})," payment method on ",(0,i.jsx)(S.Z,{children:eP}),". This setup provides direct control over your resource allocation and costs, requiring active management of your instance. To adjust your GPU or explore different payment options, modify your selection below."]}),(0,i.jsx)(el,{children:(0,i.jsxs)(r.Jy,{children:[(0,i.jsx)(_.Z,{columns:e5,data:e4,rowProps:()=>({className:"_active"})}),(0,i.jsx)(ec,{children:!eG&&(0,i.jsx)(i.Fragment,{children:(0,i.jsx)(m.ZP,{ref:e2,type:"button",kind:"functional",variant:"warning",size:"md",onClick:eq,children:"Manually select GPU"})})})]})})]})}),(0,i.jsx)(ep,{children:(0,i.jsxs)(f.Z,{children:[(0,i.jsx)(b.N,{number:e1(1),children:"Select your tier"}),eA.paymentMethod===x.XL.Hold?(0,i.jsxs)("p",{children:["Your instance is ready to be configured using our"," ",(0,i.jsx)(S.Z,{children:"automated CRN selection"}),", set to run on"," ",(0,i.jsx)(S.Z,{children:eP})," with the"," ",(0,i.jsx)(S.Z,{children:"Holder-tier payment"})," method, allowing you seamless access while you hold ALEPH tokens. If you wish to customize your Compute Resource Node (CRN) or use a different payment approach, you can change your selection below."]}):(0,i.jsx)("p",{children:"Please select one of the available instance tiers as a base for your VM. You will be able to customize the volumes further below in the form."}),(0,i.jsxs)(eu,{children:[(0,i.jsx)(j.Z,{show:!!eG&&!eL}),(0,i.jsx)(c.Z,{name:"specs",control:eB,type:x.py.GpuInstance,gpuModel:null==eG?void 0:null===(t=eG.selectedGpu)||void 0===t?void 0:t.model,isPersistent:!0,paymentMethod:eA.paymentMethod,nodeSpecs:eL,children:!eG&&(0,i.jsx)(eh,{children:"First select your node in the previous step"})})]})]})}),(0,i.jsx)(eg,{children:(0,i.jsxs)(f.Z,{children:[(0,i.jsx)(b.N,{number:e1(2),children:"Choose an image"}),(0,i.jsx)("p",{children:"Chose a base image for your GPU Instance. It's the base system that you will be able to customize."}),(0,i.jsx)(ey,{children:(0,i.jsx)(l.Z,{name:"image",control:eB})})]})}),(0,i.jsx)(ex,{children:(0,i.jsxs)(f.Z,{children:[(0,i.jsx)(b.N,{number:e1(3),children:"Configure SSH Key"}),(0,i.jsx)("p",{children:"Access your cloud instances securely. Give existing key's below access to this instance or add new keys. Remember, storing private keys safely is crucial for security. If you need help, our support team is always ready to assist."}),(0,i.jsx)(ef,{children:(0,i.jsx)(u.Z,{name:"sshKeys",control:eB})})]})}),(0,i.jsx)(ev,{children:(0,i.jsxs)(f.Z,{children:[(0,i.jsx)(b.N,{number:e1(4),children:"Name and tags"}),(0,i.jsx)(eC,{children:"Organize and identify your instances more effectively by assigning a unique name, obtaining a hash reference, and defining multiple tags. This helps streamline your development process and makes it easier to manage your web3 instances."}),(0,i.jsx)(g.Z,{control:eB,entityType:x.py.Instance})]})}),(0,i.jsx)(ew,{children:(0,i.jsxs)(f.Z,{children:[(0,i.jsx)(b.N,{number:e1(5),children:"Advanced Configuration Options"}),(0,i.jsx)(e_,{children:"Customize your GPU Instance with our Advanced Configuration Options. Add volumes and custom domains to meet your specific needs."}),(0,i.jsxs)(ej,{children:[(0,i.jsx)(eb,{children:(0,i.jsxs)(C.Z,{label:"Add Volume",children:[(0,i.jsx)(r.DU,{forwardedAs:"h2",type:"h6",color:"main0",children:"Add volumes"}),(0,i.jsx)(p.Z,{name:"volumes",control:eB,systemVolume:eA.systemVolume})]})}),(0,i.jsx)(eS,{children:(0,i.jsxs)(C.Z,{label:"Add Custom Domain",children:[(0,i.jsx)(r.DU,{forwardedAs:"h2",type:"h6",color:"main0",children:"Custom domain"}),(0,i.jsx)(eZ,{children:"You have the ability to configure a domain name to access your cloud instances. By setting up a user-friendly custom domain, accessing your instances becomes easier and more intuitive. It&s another way we&re making web3 cloud management as straightforward as possible."}),(0,i.jsx)(h.Z,{name:"domains",control:eB,entityType:x.sY.Instance})]})})]})]})}),(0,i.jsx)(y.Z,{control:eB,address:o,cost:eD,receiverAddress:null==eG?void 0:eG.reward,unlockedAmount:d,paymentMethod:eA.paymentMethod,streamDuration:eA.streamDuration,disablePaymentMethod:eN,disabledStreamTooltip:eI,mainRef:n,description:(0,i.jsx)(i.Fragment,{children:"You can either leverage the traditional method of holding tokens in your wallet for resource access, or opt for the Pay-As-You-Go (PAYG) system, which allows you to pay precisely for what you use, for the duration you need. The PAYG option includes a token stream feature, enabling real-time payment for resources as you use them."}),button:(0,i.jsx)(et,{disabled:eM,title:ek,tooltipContent:eT,isFooter:!1,shouldRequestTermsAndConditions:eO,handleRequestTermsAndConditionsAgreement:eQ,handleSubmit:eK}),footerButton:(0,i.jsx)(et,{disabled:eM,title:ek,tooltipContent:eT,isFooter:!0,shouldRequestTermsAndConditions:eO,handleRequestTermsAndConditionsAgreement:eQ,handleSubmit:eK})})]})]})}et.displayName="CheckoutButton";var en=(0,o.ZP)("div").withConfig({displayName:"cmp___StyledDiv",componentId:"sc-1x0px4g-0"})({display:"flex",width:"100%",justifyContent:"flex-end"}),ei=(0,o.ZP)(r.zx).withConfig({displayName:"cmp___StyledButton",componentId:"sc-1x0px4g-1"})({marginLeft:"auto !important"}),eo=(0,o.ZP)("div").withConfig({displayName:"cmp___StyledDiv2",componentId:"sc-1x0px4g-2"})({marginBottom:"2rem",display:"flex",maxWidth:"28rem",alignItems:"center",gap:"1rem"}),es=(0,o.ZP)("div").withConfig({displayName:"cmp___StyledDiv3",componentId:"sc-1x0px4g-3"})({display:"flex",width:"100%",justifyContent:"space-between"}),ed=(0,o.ZP)("div").withConfig({displayName:"cmp___StyledDiv4",componentId:"sc-1x0px4g-4"})({display:"flex",justifyContent:"flex-end",gap:"0.75rem"}),ea=(0,o.ZP)("section").withConfig({displayName:"cmp___StyledSection",componentId:"sc-1x0px4g-5"})({paddingLeft:"0px",paddingRight:"0px",paddingTop:"0px",paddingBottom:"0px","@media (min-width: 48rem)":{paddingTop:"2rem",paddingBottom:"2rem"}}),er=(0,o.ZP)("section").withConfig({displayName:"cmp___StyledSection2",componentId:"sc-1x0px4g-6"})({paddingLeft:"0px",paddingRight:"0px",paddingBottom:"1.5rem",paddingTop:"5rem","@media (min-width: 48rem)":{paddingTop:"2.5rem",paddingBottom:"2.5rem"}}),em=(0,o.ZP)("section").withConfig({displayName:"cmp___StyledSection3",componentId:"sc-1x0px4g-7"})({paddingLeft:"0px",paddingRight:"0px",paddingBottom:"1.5rem",paddingTop:"5rem","@media (min-width: 48rem)":{paddingTop:"2.5rem",paddingBottom:"2.5rem"}}),el=(0,o.ZP)("div").withConfig({displayName:"cmp___StyledDiv5",componentId:"sc-1x0px4g-8"})({position:"relative",marginBottom:"1.5rem",marginTop:"3rem",minHeight:"6rem",paddingLeft:"0px",paddingRight:"0px"}),ec=(0,o.ZP)("div").withConfig({displayName:"cmp___StyledDiv6",componentId:"sc-1x0px4g-9"})({marginTop:"1.5rem"}),ep=(0,o.ZP)("section").withConfig({displayName:"cmp___StyledSection4",componentId:"sc-1x0px4g-10"})({paddingLeft:"0px",paddingRight:"0px",paddingBottom:"1.5rem",paddingTop:"5rem","@media (min-width: 48rem)":{paddingTop:"2.5rem",paddingBottom:"2.5rem"}}),eu=(0,o.ZP)("div").withConfig({displayName:"cmp___StyledDiv7",componentId:"sc-1x0px4g-11"})({position:"relative",marginTop:"1.5rem",marginBottom:"1.5rem",paddingLeft:"0px",paddingRight:"0px"}),eh=(0,o.ZP)("div").withConfig({displayName:"cmp___StyledDiv8",componentId:"sc-1x0px4g-12"})({marginTop:"1.5rem",textAlign:"center"}),eg=(0,o.ZP)("section").withConfig({displayName:"cmp___StyledSection5",componentId:"sc-1x0px4g-13"})({paddingLeft:"0px",paddingRight:"0px",paddingBottom:"1.5rem",paddingTop:"5rem","@media (min-width: 48rem)":{paddingTop:"2.5rem",paddingBottom:"2.5rem"}}),ey=(0,o.ZP)("div").withConfig({displayName:"cmp___StyledDiv9",componentId:"sc-1x0px4g-14"})({marginBottom:"1.5rem",marginTop:"3rem",paddingLeft:"0px",paddingRight:"0px"}),ex=(0,o.ZP)("section").withConfig({displayName:"cmp___StyledSection6",componentId:"sc-1x0px4g-15"})({paddingLeft:"0px",paddingRight:"0px",paddingBottom:"1.5rem",paddingTop:"5rem","@media (min-width: 48rem)":{paddingTop:"2.5rem",paddingBottom:"2.5rem"}}),ef=(0,o.ZP)("div").withConfig({displayName:"cmp___StyledDiv10",componentId:"sc-1x0px4g-16"})({marginTop:"1.5rem",marginBottom:"1.5rem",paddingLeft:"0px",paddingRight:"0px"}),ev=(0,o.ZP)("section").withConfig({displayName:"cmp___StyledSection7",componentId:"sc-1x0px4g-17"})({paddingLeft:"0px",paddingRight:"0px",paddingBottom:"1.5rem",paddingTop:"5rem","@media (min-width: 48rem)":{paddingTop:"2.5rem",paddingBottom:"2.5rem"}}),eC=(0,o.ZP)("p").withConfig({displayName:"cmp___StyledP",componentId:"sc-1x0px4g-18"})({marginBottom:"1.5rem"}),ew=(0,o.ZP)("section").withConfig({displayName:"cmp___StyledSection8",componentId:"sc-1x0px4g-19"})({paddingLeft:"0px",paddingRight:"0px",paddingBottom:"1.5rem",paddingTop:"5rem","@media (min-width: 48rem)":{paddingTop:"2.5rem",paddingBottom:"2.5rem"}}),e_=(0,o.ZP)("p").withConfig({displayName:"cmp___StyledP2",componentId:"sc-1x0px4g-20"})({marginBottom:"1.5rem"}),ej=(0,o.ZP)("div").withConfig({displayName:"cmp___StyledDiv11",componentId:"sc-1x0px4g-21"})({marginTop:"1.5rem",marginBottom:"1.5rem",paddingLeft:"0px",paddingRight:"0px"}),eb=(0,o.ZP)("div").withConfig({displayName:"cmp___StyledDiv12",componentId:"sc-1x0px4g-22"})({marginBottom:"1rem"}),eS=(0,o.ZP)("div").withConfig({displayName:"cmp___StyledDiv13",componentId:"sc-1x0px4g-23"})({marginBottom:"1rem"}),eZ=(0,o.ZP)("p").withConfig({displayName:"cmp___StyledP3",componentId:"sc-1x0px4g-24"})({marginBottom:"1.5rem"})}},function(e){e.O(0,[536,161,855,747,51,777,774,888,179],function(){return e(e.s=76891)}),_N_E=e.O()}]);