"use strict";(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[330],{93963:function(e,r,l){l.d(r,{Z:function(){return c}});var d=l(19521);let s={xl:90,lg:60.0625,md:44.6875},m=d.ZP.div.withConfig({displayName:"styles__StyledContainer",componentId:"sc-1bpjbi2-0"})(["",""],e=>{let{$variant:r="lg"}=e;return(0,d.iv)([""," max-width:","rem;"],{marginLeft:"auto",marginRight:"auto",width:"100%",paddingLeft:"1.5rem",paddingRight:"1.5rem","@media (min-width: 62rem)":{paddingLeft:"4rem",paddingRight:"4rem"}},s[r])});var c=m},49531:function(e,r,l){l.d(r,{N:function(){return c}});var d=l(85893),s=l(67294),m=l(72771);let SectionTitle=e=>(0,d.jsx)(m.NP,{as:"h2",color:"main0",numberColor:"main0",...e});SectionTitle.displayName="SectionTitle";var c=(0,s.memo)(SectionTitle)},63715:function(e,r,l){l.d(r,{Z:function(){return h}});var d=l(85893),s=l(19521),m=l(67294),c=l(72771);let p=s.ZP.input.withConfig({displayName:"styles__StyledHiddenFileInput",componentId:"sc-vome1k-0"})(["display:none;"]);var u=l(69060);let f=(0,m.forwardRef)((e,r)=>{let{onChange:l,accept:s,value:f,children:h,error:v,label:x,required:g}=e,_=(0,m.useRef)(null),w=(0,m.useCallback)(()=>{_.current&&_.current.click()},[]),j=(0,m.useCallback)(()=>{_.current&&(_.current.value="",l(void 0))},[l]),S=(0,m.useCallback)(e=>{let r=e.target,{files:d}=r;if(d){let e=d[0];l(e)}},[l]);return(0,d.jsxs)("div",{tabIndex:-1,ref:r,children:[x&&(0,d.jsx)(c.lX,{label:x,error:v,required:!0}),f?(0,d.jsxs)(c.zx,{type:"button",kind:"functional",variant:"warning",size:"md",onClick:j,children:[(0,u.zN)(f.name)," ",(0,d.jsx)(y,{name:"trash"})]}):(0,d.jsx)(c.zx,{onClick:w,type:"button",color:"main0",kind:"default",size:"md",variant:"primary",children:h}),v&&(0,d.jsx)(c.Xq,{error:v}),(0,d.jsx)(p,{type:"file",ref:_,onChange:S,accept:s})]})});f.displayName="HiddenFileInput";var h=(0,m.memo)(f),y=(0,s.ZP)(c.JO).withConfig({displayName:"cmp___StyledIcon",componentId:"sc-1pig7lr-0"})({marginLeft:"1.25rem"})},39492:function(e,r,l){l.d(r,{Z:function(){return u}});var d=l(85893),s=l(19521),m=l(67294),c=l(72771);let p=(0,s.ZP)(c.zx).attrs(e=>({...e,forwardedAs:"span",onClick:e=>e.preventDefault(),kind:"default",size:"md",variant:"textOnly",color:"main0"})).withConfig({displayName:"styles__StyledInfoTooltipButton",componentId:"sc-15cvlnj-0"})(()=>[{cursor:"help !important"}]),InfoTooltipButton=e=>{let{children:r,tooltipContent:l,plain:s,align:p="right",vAlign:u="center",...x}=e,[g,_]=(0,m.useState)(!1);(0,m.useEffect)(()=>{_(!0)},[]);let w=(0,m.useRef)(null),j=(0,c._K)("md"),S=(0,d.jsx)(f,{name:"info-circle",size:"1em",$_css:["left"===p?{order:"-1"}:"","top"===u?{marginBottom:"0.5rem"}:""]});return(0,d.jsxs)(d.Fragment,{children:[s?(0,d.jsxs)(h,{ref:w,children:[r,S]}):(0,d.jsxs)(y,{ref:w,children:[r,S]}),g&&(0,d.jsx)(v,{...x,targetRef:w,content:l,$_css2:j?{position:"fixed !important",left:"0px !important",top:"0px !important",zIndex:"20 !important",margin:"1.5rem",height:"calc(100% - 3rem) !important",width:"calc(100% - 3rem) !important",maxWidth:"100% !important",transform:"none !important"}:{}})]})};InfoTooltipButton.displayName="InfoTooltipButton";var u=(0,m.memo)(InfoTooltipButton),f=(0,s.ZP)(c.JO).withConfig({displayName:"cmp___StyledIcon",componentId:"sc-1jqd2c1-0"})(["",""],e=>e.$_css),h=(0,s.ZP)("span").withConfig({displayName:"cmp___StyledSpan",componentId:"sc-1jqd2c1-1"})({display:"inline-flex",cursor:"help",alignItems:"center",gap:"0.625rem"}),y=(0,s.ZP)(p).withConfig({displayName:"cmp___StyledStyledInfoTooltipButton",componentId:"sc-1jqd2c1-2"})({display:"inline-flex",alignItems:"center",gap:"0.625rem"}),v=(0,s.ZP)(c.u).withConfig({displayName:"cmp___StyledTooltip",componentId:"sc-1jqd2c1-3"})(["",""],e=>e.$_css2)},22887:function(e,r,l){l.d(r,{Z:function(){return f}});var d=l(85893),s=l(67294),m=l(19521);let c=m.ZP.span.withConfig({displayName:"styles__StyledPrice",componentId:"sc-tdptuh-0"})(["",""],{display:"inline-flex",alignItems:"center",gap:"0.25rem",whiteSpace:"nowrap"});var p=l(72771),u=l(69060);let Price=e=>{let{value:r,duration:l,iconSize:s="0.75em",...m}=e;return(0,d.jsxs)(c,{...m,children:[(0,u.RK)(r),(0,d.jsx)(p.TR,{color:"currentColor",img:"aleph",size:s}),l&&(0,d.jsxs)("span",{children:["/ ",l]})]})};Price.displayName="Price";var f=(0,s.memo)(Price)},36846:function(e,r,l){l.d(r,{LY:function(){return _},nx:function(){return v}});var d=l(85893),s=l(19521),m=l(72771),c=l(67294),p=l(93396),u=l(65148),f=l(63715),h=l(69060);let y=(0,c.memo)(e=>{let{onRemove:r}=e;return(0,d.jsx)(S,{children:(0,d.jsx)(m.zx,{type:"button",kind:"functional",variant:"warning",size:"md",onClick:r,children:"Remove"})})});y.displayName="RemoveVolume";let v=(0,c.memo)(e=>{let{isStandAlone:r,fileCtrl:l,mountPathCtrl:s,useLatestCtrl:c,volumeSize:u,handleRemove:h}=(0,p.Yl)(e);return(0,d.jsxs)(d.Fragment,{children:[(0,d.jsx)(b,{children:"Create and configure new volumes for your web3 function by either uploading a dependency file or a squashfs volume. Volumes play a crucial role in managing dependencies and providing a volume within your application."}),(0,d.jsxs)("div",{children:[(0,d.jsx)(C,{children:(0,d.jsxs)(f.Z,{...l.field,...l.fieldState,children:["Upload squashfs volume ",(0,d.jsx)(N,{name:"arrow-up"})]})}),!r&&(0,d.jsx)(P,{children:(0,d.jsx)(m.oi,{...s.field,...s.fieldState,required:!0,label:"Mount",placeholder:"/mount/opt"})}),l.field.value&&(0,d.jsx)(I,{children:(0,d.jsx)(m.oi,{label:"Size",name:"size",value:u,disabled:!0})}),!r&&(0,d.jsxs)(d.Fragment,{children:[(0,d.jsx)(k,{children:(0,d.jsx)(m.XZ,{...c.field,...c.fieldState,label:"Always update to the latest version"})}),h&&(0,d.jsx)(y,{onRemove:h})]})]})]})});v.displayName="AddNewVolume";let x=(0,c.memo)(e=>{let{refHashCtrl:r,mountPathCtrl:l,useLatestCtrl:s,volumeSize:c,handleRemove:u}=(0,p.Ox)(e);return(0,d.jsxs)(d.Fragment,{children:[(0,d.jsx)(Z,{children:"Link existing volumes to your web3 function by pasting the reference hash associated with each volume. Volumes are an essential component for managing dependencies within your application."}),(0,d.jsxs)("div",{children:[(0,d.jsx)("div",{children:(0,d.jsx)(m.oi,{...l.field,...l.fieldState,required:!0,label:"Mount",placeholder:"/mount/opt"})}),(0,d.jsx)(T,{children:(0,d.jsx)(m.oi,{...r.field,...r.fieldState,required:!0,label:"Item hash",placeholder:"3335ad270a571b..."})}),r.field.value&&c&&(0,d.jsx)(B,{children:(0,d.jsx)(m.oi,{label:"Size",name:"size",value:c,disabled:!0})}),(0,d.jsx)(V,{children:(0,d.jsx)(m.XZ,{...s.field,...s.fieldState,checked:!!s.field.value,label:"Always update to the latest version"})}),u&&(0,d.jsx)(y,{onRemove:u})]})]})});x.displayName="AddExistingVolume";let g=(0,c.memo)(e=>{let{nameCtrl:r,mountPathCtrl:l,sizeCtrl:s,sizeValue:c,sizeHandleChange:u,handleRemove:f}=(0,p.BB)(e);return(0,d.jsxs)(d.Fragment,{children:[(0,d.jsx)(D,{children:"Create and configure persistent storage for your web3 functions, enabling your application to maintain data across multiple invocations or sessions. You can set up a customized storage solution tailored to your application's requirements."}),(0,d.jsxs)("div",{children:[(0,d.jsx)("div",{children:(0,d.jsx)(m.oi,{...r.field,...r.fieldState,required:!0,label:"Volume name",placeholder:"Redis volume"})}),(0,d.jsx)(L,{children:(0,d.jsx)(m.oi,{...l.field,...l.fieldState,required:!0,label:"Mount",placeholder:"/mount/opt"})}),(0,d.jsx)(z,{children:(0,d.jsx)(m.oi,{...s.field,...s.fieldState,value:c,onChange:u,required:!0,type:"number",label:"Size (GB)",placeholder:"0"})}),f&&(0,d.jsx)(y,{onRemove:f})]})]})});g.displayName="AddPersistentVolume";let _=(0,c.memo)(e=>{let{size:r}=e,l=(0,h.Fx)(r,{from:"MiB",to:"GiB",displayUnit:!1});return(0,d.jsxs)(d.Fragment,{children:[(0,d.jsx)(E,{children:"This system volume is included with your setup. You can easily expand your storage capacity to meet your application's requirements by adding additional volumes below."}),(0,d.jsxs)("div",{children:[(0,d.jsx)("div",{children:(0,d.jsx)(m.oi,{name:"system_volume_name",required:!0,label:"Volume name",placeholder:"Redis volume",value:"System Volume",dataView:!0})}),(0,d.jsx)(q,{children:(0,d.jsx)(m.oi,{name:"system_volume_mount",required:!0,label:"Mount",placeholder:"/mount/opt",value:"/",dataView:!0})}),(0,d.jsx)(R,{children:(0,d.jsx)(m.oi,{name:"system_volume_size",required:!0,type:"number",label:"Size (GB)",placeholder:"0",value:l,dataView:!0})})]})]})});_.displayName="InstanceSystemVolume";let w={[u.z.New]:v,[u.z.Existing]:x,[u.z.Persistent]:g},j=(0,c.memo)(e=>{let{volumeTypeCtrl:r,defaultValue:l,...s}=(0,p.Kn)(e),f=r.field.value,h=(0,c.useMemo)(()=>w[f],[f]),y=(0,c.useMemo)(()=>[{id:u.z.New,name:"New volume"},{id:u.z.Existing,name:"Existing volume"},{id:u.z.Persistent,name:"Persistent Storage"}],[]);return(0,d.jsxs)(A,{className:"bg-base1",children:[(0,d.jsx)(F,{children:(0,d.jsx)(m.mQ,{selected:f,align:"left",onTabChange:r.field.onChange,tabs:y})}),(0,d.jsx)("div",{role:"tabpanel",children:(0,d.jsx)(h,{...s,defaultValue:l})})]})});j.displayName="AddVolume",r.ZP=j;var S=(0,s.ZP)("div").withConfig({displayName:"cmp___StyledDiv",componentId:"sc-de6qwa-0"})({marginTop:"1rem",paddingTop:"1.5rem",textAlign:"right"}),b=(0,s.ZP)("p").withConfig({displayName:"cmp___StyledP",componentId:"sc-de6qwa-1"})({marginBottom:"1.5rem",marginTop:"0.25rem"}),C=(0,s.ZP)("div").withConfig({displayName:"cmp___StyledDiv2",componentId:"sc-de6qwa-2"})({paddingTop:"1rem",paddingBottom:"1rem"}),N=(0,s.ZP)(m.JO).withConfig({displayName:"cmp___StyledIcon",componentId:"sc-de6qwa-3"})({marginLeft:"1rem"}),P=(0,s.ZP)("div").withConfig({displayName:"cmp___StyledDiv3",componentId:"sc-de6qwa-4"})({marginTop:"1rem"}),I=(0,s.ZP)("div").withConfig({displayName:"cmp___StyledDiv4",componentId:"sc-de6qwa-5"})({marginTop:"1rem"}),k=(0,s.ZP)("div").withConfig({displayName:"cmp___StyledDiv5",componentId:"sc-de6qwa-6"})({marginTop:"1rem",paddingTop:"1rem",paddingBottom:"1rem"}),Z=(0,s.ZP)("p").withConfig({displayName:"cmp___StyledP2",componentId:"sc-de6qwa-7"})({marginBottom:"1.5rem",marginTop:"0.25rem"}),T=(0,s.ZP)("div").withConfig({displayName:"cmp___StyledDiv6",componentId:"sc-de6qwa-8"})({marginTop:"1rem"}),B=(0,s.ZP)("div").withConfig({displayName:"cmp___StyledDiv7",componentId:"sc-de6qwa-9"})({marginTop:"1rem"}),V=(0,s.ZP)("div").withConfig({displayName:"cmp___StyledDiv8",componentId:"sc-de6qwa-10"})({marginTop:"1rem",paddingTop:"1rem",paddingBottom:"1rem"}),D=(0,s.ZP)("p").withConfig({displayName:"cmp___StyledP3",componentId:"sc-de6qwa-11"})({marginBottom:"1.5rem"}),L=(0,s.ZP)("div").withConfig({displayName:"cmp___StyledDiv9",componentId:"sc-de6qwa-12"})({marginTop:"1rem"}),z=(0,s.ZP)("div").withConfig({displayName:"cmp___StyledDiv10",componentId:"sc-de6qwa-13"})({marginTop:"1rem"}),E=(0,s.ZP)("p").withConfig({displayName:"cmp___StyledP4",componentId:"sc-de6qwa-14"})({marginBottom:"1.5rem"}),q=(0,s.ZP)("div").withConfig({displayName:"cmp___StyledDiv11",componentId:"sc-de6qwa-15"})({marginTop:"1rem"}),R=(0,s.ZP)("div").withConfig({displayName:"cmp___StyledDiv12",componentId:"sc-de6qwa-16"})({marginTop:"1rem"}),A=(0,s.ZP)("div").withConfig({displayName:"cmp___StyledDiv13",componentId:"sc-de6qwa-17"})({padding:"1.5rem"}),F=(0,s.ZP)("div").withConfig({displayName:"cmp___StyledDiv14",componentId:"sc-de6qwa-18"})({paddingLeft:"0px",paddingRight:"0px",paddingBottom:"0.75rem"})},34747:function(e,r,l){l.d(r,{Z:function(){return d.ZP},n:function(){return d.nx}});var d=l(36846)},31626:function(e,r,l){l.d(r,{Z:function(){return T}});var d=l(85893),s=l(19521),m=l(69060),c=l(72771);let p=s.ZP.div.withConfig({displayName:"styles__StyledHoldingSummaryLine",componentId:"sc-kiwuro-0"})(["",""],e=>{let{theme:r,$isHeader:l}=e;return(0,s.iv)([""," grid-template-columns:1fr 2fr 1fr;grid-auto-rows:max-content;align-items:stretch;> *{"," width:100%;border-bottom:0.0625rem solid ",";&{","}&:first-child{"," font-size:","rem;}&:last-child{font-weight:700;border-bottom-style:dashed;}","}"],{display:"grid",padding:"0px"},{paddingLeft:"1rem",paddingRight:"1rem",paddingTop:"0.75rem",paddingBottom:"0.75rem"},r.color.purple2,{display:"flex",flexDirection:"column",alignItems:"flex-end",justifyContent:"center"},{alignItems:"flex-start"},r.font.size[12],l&&(0,s.iv)(["font-weight:700;font-size:","rem;border-bottom:none !important;"],r.font.size[12]))}),u=s.ZP.span.attrs((0,c.PT)("tp-info")).withConfig({displayName:"styles__Label",componentId:"sc-kiwuro-1"})(["color:",";"],e=>{let{theme:r}=e;return r.color.base2});s.ZP.span.attrs((0,c.PT)("tp-info text-main0")).withConfig({displayName:"styles__BlueLabel",componentId:"sc-kiwuro-2"})([""]);let f=(0,s.F4)(["  0%{opacity:0;transform:translate3d(-100%,0,0);}50%{opacity:1;transform:translate3d(0,0,0);}100%{opacity:0;transform:translate3d(100%,0,0);}"]),h=(0,s.ZP)(c.JO).attrs(e=>({...e,name:"angle-double-right",size:"1.5rem",color:"main0"})).withConfig({displayName:"styles__StyledArrowIcon",componentId:"sc-kiwuro-3"})([""," animation:1000ms linear 0ms infinite ",";"],{transformOrigin:"center",padding:"0.25rem"},f);s.ZP.div.withConfig({displayName:"styles__StyledSeparator",componentId:"sc-kiwuro-4"})([""," flex:0 0 1px;background-color:",";"],{display:"none","@media (min-width: 48rem)":{display:"block"}},e=>{let{theme:r}=e;return r.color.purple2});var y=l(67294),v=l(9911),x=l(65148),g=l(39492),_=l(93963),w=l(37419),j=l(87536);let S=s.ZP.label.withConfig({displayName:"styles__StyledLabel",componentId:"sc-18069ft-0"})(["",""],e=>{let{$disabled:r=!1}=e;return(0,s.iv)([""," ",""],{cursor:"not-allowed"},r&&(0,s.iv)(["",""],{cursor:"not-allowed",opacity:"0.4"}))});var b=(0,y.memo)(e=>{let{disabledHold:r,disabledStream:l,paymentMethodCtrl:s,handleClickHold:m,handleClickStream:p}=function(e){let{name:r="paymentMethod",control:l,defaultValue:d,disabledHold:s,...m}=e,c=(0,j.bc)({control:l,name:r,defaultValue:d}),{value:p,onChange:u}=c.field,f=(0,y.useCallback)(e=>{let r=e.currentTarget.checked;u(r?v.XL.Stream:v.XL.Hold)},[u]);c.field.onChange=f,c.field.checked=p===v.XL.Stream;let h=(0,y.useCallback)(()=>{u(v.XL.Stream)},[u]),x=(0,y.useCallback)(()=>{s||u(v.XL.Hold)},[s,u]);return{paymentMethodCtrl:c,handleClickStream:h,handleClickHold:x,disabledHold:s,...m}}(e);return(0,d.jsxs)(C,{className:"tp-body3",children:[(0,d.jsx)(S,{onClick:m,$disabled:r,children:"Hold tokens"}),(0,d.jsx)(c.rs,{...s.field,...s.fieldState,disabled:r||l}),(0,d.jsx)(S,{onClick:p,$disabled:l,children:"Pay-as-you-go"})]})}),C=(0,s.ZP)("div").withConfig({displayName:"cmp___StyledDiv",componentId:"sc-18gl5js-0"})({display:"flex",alignItems:"center",justifyContent:"center",gap:"1rem"}),N=l(22887),P=l(59682);let CheckoutSummarySpecsLine=e=>{let{type:r,specs:l,cost:s,priceDuration:c}=e,{cpu:u,ram:f,storage:h}=l,x=(0,y.useMemo)(()=>"".concat(u,"x86-64bit"),[u]),g=(0,y.useMemo)(()=>"".concat((0,m.Fx)(f,{from:"MiB",to:"GiB",displayUnit:!1}),"GB-RAM"),[f]),_=(0,y.useMemo)(()=>"".concat((0,m.Fx)(h,{from:"MiB",to:"GiB",displayUnit:!1}),"GB-HDD"),[h]),w=(0,y.useMemo)(()=>"".concat(x,".").concat(g).concat(r===v.py.Instance?".".concat(_):""),[x,g,_,r]);return(0,d.jsxs)(p,{children:[(0,d.jsx)("div",{children:(0,d.jsx)("div",{children:v.K_[r].toUpperCase()})}),(0,d.jsx)("div",{children:(0,d.jsx)("div",{children:w})}),(0,d.jsx)("div",{children:(0,d.jsx)("div",{children:(0,d.jsx)(N.Z,{value:s,duration:c})})})]})};CheckoutSummarySpecsLine.displayName="CheckoutSummarySpecsLine";let CheckoutSummaryVolumeLine=e=>{let{volume:r,cost:l,specs:s,priceDuration:c}=e,[u,f]=(0,y.useState)(0);if((0,y.useEffect)(()=>{(async function(){let e=await x.l.getVolumeSize(r);f(e)})()},[r]),!l)return(0,d.jsx)(d.Fragment,{});let h=!!l.discount,v=!l.cost;return(0,d.jsxs)(p,{children:[(0,d.jsx)("div",{children:(0,d.jsxs)("div",{children:["STORAGE",(0,d.jsx)(B,{children:r.volumeType===x.z.Persistent?"PERSISTENT":"VOLUME"})]})}),(0,d.jsx)("div",{children:(0,d.jsx)("div",{children:(0,m.eB)(u,"MiB")})}),(0,d.jsx)("div",{children:(0,d.jsx)("div",{children:h?(0,d.jsx)(g.Z,{plain:!0,align:"left",my:"bottom-left",at:"bottom-right",tooltipContent:(0,d.jsx)(V,{children:(0,d.jsx)("div",{className:"tp-body1 fs-18",children:v?(0,d.jsxs)(d.Fragment,{children:["The cost displayed for the added storage is"," ",(0,d.jsx)("span",{className:"text-main0",children:(0,d.jsx)(N.Z,{value:l.cost,duration:c})})," ","as this resource is already included in your selected package at no additional charge."]}):(0,d.jsxs)(d.Fragment,{children:["Good news! The displayed price is lower than usual due to a discount of"," ",(0,d.jsx)("span",{className:"text-main0",children:(0,d.jsx)(N.Z,{value:l.price-l.cost,duration:c})}),s&&(0,d.jsxs)(d.Fragment,{children:[" for ",(0,d.jsx)("span",{className:"text-main0",children:(0,m.Fx)(s.storage,{from:"MiB",to:"GiB",displayUnit:!0})})," ","included in your package."]})]})})}),children:(0,d.jsx)(N.Z,{value:l.cost,duration:c})}):(0,d.jsx)(d.Fragment,{children:(0,d.jsx)(N.Z,{value:l.cost,duration:c})})})})]})};CheckoutSummaryVolumeLine.displayName="CheckoutSummaryVolumeLine";let CheckoutSummaryDomainLine=e=>{let{domain:r}=e;return(0,d.jsxs)(p,{children:[(0,d.jsx)("div",{children:"CUSTOM DOMAIN"}),(0,d.jsx)("div",{children:r.name}),(0,d.jsx)("div",{children:"-"})]})};CheckoutSummaryDomainLine.displayName="CheckoutSummaryDomainLine";let I=(0,y.memo)(CheckoutSummarySpecsLine),k=(0,y.memo)(CheckoutSummaryVolumeLine),Z=(0,y.memo)(CheckoutSummaryDomainLine);var T=(0,y.memo)(e=>{let{address:r,unlockedAmount:l,type:s,specs:u,volumes:f,domains:y,description:x,button:g,control:j,receiverAddress:S,paymentMethod:C,isPersistent:T=s===v.py.Instance,mainRef:B}=e,{cost:V}=(0,w.F)({entityType:s,props:{specs:u,volumes:f,isPersistent:T,paymentMethod:C}}),Q=C===v.XL.Stream?"h":void 0,ee=C!==v.XL.Hold,et=C!==v.XL.Stream,en=j&&(0,d.jsx)(b,{name:"paymentMethod",control:j,disabledHold:ee,disabledStream:et});return(0,d.jsxs)(d.Fragment,{children:[(0,d.jsx)(D,{}),(0,d.jsx)(P.Z,{paymentMethod:C,submitButton:g,paymentMethodSwitch:en,mainRef:B,totalCost:null==V?void 0:V.totalCost}),(0,d.jsx)(L,{className:"fx-noise-light fx-grain-4",children:(0,d.jsx)(_.Z,{children:(0,d.jsxs)(z,{className:"bg-base1",children:[(0,d.jsx)(E,{forwardedAs:"h2",type:"h5",children:"Checkout summary"}),x&&(0,d.jsx)(q,{children:(0,d.jsx)("p",{className:"text-main2",children:x})}),j&&(0,d.jsx)(d.Fragment,{children:(0,d.jsx)(R,{children:(0,d.jsxs)(A,{className:"bg-purple0",children:[(0,d.jsx)(F,{forwardedAs:"h3",type:"h7",children:"Payment Method"}),(0,d.jsx)(M,{children:en})]})})}),(0,d.jsx)(O,{children:(0,d.jsxs)(U,{children:[(0,d.jsxs)(p,{$isHeader:!0,className:"tp-body3 fs-12",children:[(0,d.jsx)("div",{children:"UNLOCKED"}),(0,d.jsxs)("div",{children:["CURRENT WALLET ",(0,m.zN)(r)]}),(0,d.jsx)("div",{children:(0,d.jsx)(N.Z,{value:l})})]}),u&&(0,d.jsx)(I,{type:s,specs:u,cost:null==V?void 0:V.computeTotalCost,priceDuration:Q}),f&&f.map((e,r)=>(0,d.jsx)(k,{volume:e,specs:u,cost:null==V?void 0:V.perVolumeCost[r],priceDuration:Q},e.volumeType+r)),s===v.py.Program&&(0,d.jsxs)(p,{children:[(0,d.jsx)("div",{children:"TYPE"}),(0,d.jsx)("div",{children:T?"persistent":"on-demand"}),(0,d.jsx)("div",{children:"-"})]}),y&&y.map(e=>(0,d.jsx)(Z,{domain:e},e.name)),(0,d.jsxs)(p,{children:[(0,d.jsx)("div",{}),(0,d.jsx)("div",{className:"text-main0 tp-body2",children:C===v.XL.Hold?"Total":"Total / h"}),(0,d.jsx)("div",{children:(0,d.jsx)("span",{className:"text-main0 tp-body3",children:(0,d.jsx)(N.Z,{value:null==V?void 0:V.totalCost})})})]}),C===v.XL.Stream&&(null==V?void 0:V.totalStreamCost)&&(0,d.jsxs)(p,{children:[(0,d.jsx)("div",{}),(0,d.jsx)("div",{className:"text-main0 tp-body2",children:"Min. required"}),(0,d.jsx)("div",{children:(0,d.jsx)("span",{className:"text-main0 tp-body3",children:(0,d.jsx)(N.Z,{value:(null==V?void 0:V.totalCost)*4})})})]})]})}),C===v.XL.Stream&&S&&(0,d.jsxs)(X,{className:"bg-purple0",children:[(0,d.jsx)(G,{forwardedAs:"h3",type:"h7",children:"Review the transaction"}),(0,d.jsxs)(H,{children:[(0,d.jsx)(Y,{children:(0,d.jsx)(c.oi,{tabIndex:-1,name:"sender",label:"Sender",value:(0,m.bs)(r,12,10),dataView:!0})}),(0,d.jsx)($,{children:(0,d.jsx)(h,{})}),(0,d.jsx)(K,{children:(0,d.jsx)(c.oi,{tabIndex:-1,name:"receiver",label:"Receiver",value:(0,m.bs)(S,12,10),dataView:!0})})]}),(0,d.jsxs)(W,{className:"text-main0 tp-body2 fs-12",children:["Balance: ",(0,d.jsx)(N.Z,{value:null==V?void 0:V.totalCost})," per hour"]})]}),g&&(0,d.jsx)(J,{children:g})]})})})]})}),B=(0,s.ZP)(u).withConfig({displayName:"cmp___StyledLabel",componentId:"sc-1rnh9xk-0"})({marginLeft:"0.5rem"}),V=(0,s.ZP)("div").withConfig({displayName:"cmp___StyledDiv",componentId:"sc-1rnh9xk-1"})({textAlign:"left"}),D=(0,s.ZP)("div").withConfig({displayName:"cmp___StyledDiv2",componentId:"sc-1rnh9xk-2"})({"@media (min-width: 48rem)":{marginTop:"8rem"}}),L=(0,s.ZP)("section").withConfig({displayName:"cmp___StyledSection",componentId:"sc-1rnh9xk-3"})({paddingLeft:"0px",paddingRight:"0px",paddingBottom:"6rem",paddingTop:"1.5rem","@media (min-width: 48rem)":{marginTop:"auto",paddingBottom:"8rem",paddingTop:"4rem"}}),z=(0,s.ZP)("div").withConfig({displayName:"cmp___StyledDiv3",componentId:"sc-1rnh9xk-4"})({padding:"1.5rem"}),E=(0,s.ZP)(c.DU).withConfig({displayName:"cmp___StyledTextGradient",componentId:"sc-1rnh9xk-5"})({marginBottom:"0.25rem"}),q=(0,s.ZP)("div").withConfig({displayName:"cmp___StyledDiv4",componentId:"sc-1rnh9xk-6"})({marginBottom:"1.5rem",marginTop:"0.25rem"}),R=(0,s.ZP)("div").withConfig({displayName:"cmp___StyledDiv5",componentId:"sc-1rnh9xk-7"})({marginTop:"2.5rem",marginBottom:"1.5rem",width:"100%"}),A=(0,s.ZP)("div").withConfig({displayName:"cmp___StyledDiv6",componentId:"sc-1rnh9xk-8"})({padding:"1.5rem"}),F=(0,s.ZP)(c.DU).withConfig({displayName:"cmp___StyledTextGradient2",componentId:"sc-1rnh9xk-9"})({marginBottom:"0.75rem"}),M=(0,s.ZP)("div").withConfig({displayName:"cmp___StyledDiv7",componentId:"sc-1rnh9xk-10"})({marginTop:"1rem",marginBottom:"1rem"}),O=(0,s.ZP)("div").withConfig({displayName:"cmp___StyledDiv8",componentId:"sc-1rnh9xk-11"})({marginTop:"1.5rem",marginBottom:"1.5rem",padding:"1.5rem"}),U=(0,s.ZP)("div").withConfig({displayName:"cmp___StyledDiv9",componentId:"sc-1rnh9xk-12"})({maxWidth:"100%",overflow:"auto"}),X=(0,s.ZP)("div").withConfig({displayName:"cmp___StyledDiv10",componentId:"sc-1rnh9xk-13"})({padding:"1.5rem"}),G=(0,s.ZP)(c.DU).withConfig({displayName:"cmp___StyledTextGradient3",componentId:"sc-1rnh9xk-14"})({marginBottom:"1.5rem"}),H=(0,s.ZP)("div").withConfig({displayName:"cmp___StyledDiv11",componentId:"sc-1rnh9xk-15"})({display:"flex",width:"100%",flexDirection:"column",alignItems:"stretch",gap:"0px","@media (min-width: 48rem)":{flexDirection:"row",alignItems:"flex-end",gap:"1.5rem"}}),Y=(0,s.ZP)("div").withConfig({displayName:"cmp___StyledDiv12",componentId:"sc-1rnh9xk-16"})({flex:"1 1 0%"}),$=(0,s.ZP)("div").withConfig({displayName:"cmp___StyledDiv13",componentId:"sc-1rnh9xk-17"})({"--tw-rotate":"90deg",transform:"translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y))",alignSelf:"center",paddingLeft:"2.25rem","@media (min-width: 48rem)":{"--tw-rotate":"0deg",transform:"translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y))",alignSelf:"flex-end",paddingLeft:"0px"}}),K=(0,s.ZP)("div").withConfig({displayName:"cmp___StyledDiv14",componentId:"sc-1rnh9xk-18"})({flex:"1 1 0%"}),W=(0,s.ZP)("div").withConfig({displayName:"cmp___StyledDiv15",componentId:"sc-1rnh9xk-19"})({marginTop:"1.5rem",textAlign:"center"}),J=(0,s.ZP)("div").withConfig({displayName:"cmp___StyledDiv16",componentId:"sc-1rnh9xk-20"})({marginTop:"4rem",textAlign:"center"})},59682:function(e,r,l){l.d(r,{Z:function(){return v}});var d=l(85893),s=l(19521),m=l(67294),c=l(72771);let p=s.ZP.div.withConfig({displayName:"styles__StyledSeparator",componentId:"sc-1dsk0d9-0"})([""," flex:0 0 1px;background-color:",";"],{display:"none","@media (min-width: 48rem)":{display:"block"}},e=>{let{theme:r}=e;return r.component.walletPicker.border.color});var u=l(9911),f=l(22887),h=l(73935);let y=s.ZP.div.withConfig({displayName:"styles__StyledContainer",componentId:"sc-1iblpc-0"})(["",""],e=>{let{theme:r,$sticked:l}=e,{shadow:d}=r.component.walletPicker,{timing:m,duration:c}=r.transition;return(0,s.iv)([""," background:",";box-shadow:",";transition:all "," ","ms 0s;transition-property:opacity,box-shadow;"],{paddingLeft:"1.5rem",paddingRight:"1.5rem",paddingTop:"1rem",paddingBottom:"1rem","@media (min-width: 62rem)":{paddingLeft:"4rem",paddingRight:"4rem"}},r.color.base1,l?d:"none",m,c.fast)});var cmp=e=>{let{children:r,containerRef:l,offset:s=0,thresholdOffset:p=s,shouldHide:u=!0,deps:f=[]}=e,v=(0,m.useRef)(null),x=(0,m.useRef)(null),g=(0,c.iP)(),{scrollY:_}=(0,c.vO)({ref:l,debounceDelay:0}),w=[g,_,...f],{bounds:j}=(0,c.Bq)({ref:x,deps:w}),{bounds:S}=(0,c.Bq)({ref:l,deps:w}),b=((null==j?void 0:j.bottom)||0)+p,C=(null==S?void 0:S.bottom)||0,{shouldMount:N,state:P}=(0,c.Q)({onOff:b>C,ref:v}),I="enter"===P,k=u?I?1:0:1,Z=(null==S?void 0:S.width)||0,T=(null==S?void 0:S.left)||0,B=((null==g?void 0:g.height)||0)-((null==S?void 0:S.bottom)||0)+s,V=(0,d.jsx)(y,{ref:v,$sticked:I,style:{position:u?"fixed":"sticky",bottom:B,left:T,width:Z,opacity:k},children:r});return(0,d.jsxs)(d.Fragment,{children:[u?N&&(0,h.createPortal)(V,window.document.body):V,(0,d.jsx)("div",{ref:x})]})},v=(0,m.memo)(e=>{let{submitButton:r,paymentMethodSwitch:l,paymentMethod:s,mainRef:h,totalCost:y,shouldHide:v=!0,thresholdOffset:j=600,...S}=e,b=r&&((0,m.isValidElement)(r)&&r.type===c.zx?(0,m.cloneElement)(r,{size:"md"}):r);return(0,d.jsx)(d.Fragment,{children:h&&(0,d.jsx)(cmp,{containerRef:h,shouldHide:v,thresholdOffset:j,...S,children:(0,d.jsxs)(x,{children:[(0,d.jsx)("div",{children:l}),(0,d.jsxs)(g,{children:[(0,d.jsxs)(_,{className:"tp-body2",children:[(0,d.jsx)(w,{children:s===u.XL.Stream?"Total per hour":"Total hold"}),(0,d.jsx)(f.Z,{value:y,className:"text-main0 fs-24 tp-body3"})]}),(0,d.jsx)(p,{}),b]})]})})})}),x=(0,s.ZP)("div").withConfig({displayName:"cmp___StyledDiv",componentId:"sc-l66cr-0"})({display:"flex",flexDirection:"column",flexWrap:"wrap",alignItems:"center",justifyContent:"space-between",gap:"1.5rem",paddingTop:"0.5rem",paddingBottom:"0.5rem","@media (min-width: 48rem)":{flexDirection:"row"}}),g=(0,s.ZP)("div").withConfig({displayName:"cmp___StyledDiv2",componentId:"sc-l66cr-1"})({display:"flex",flexDirection:"column",gap:"1rem","@media (min-width: 48rem)":{flexDirection:"row"}}),_=(0,s.ZP)("div").withConfig({displayName:"cmp___StyledDiv3",componentId:"sc-l66cr-2"})({display:"flex",alignItems:"center",justifyContent:"center",gap:"1rem",whiteSpace:"nowrap"}),w=(0,s.ZP)("span").withConfig({displayName:"cmp___StyledSpan",componentId:"sc-l66cr-3"})({marginTop:"0.25rem"})},75650:function(e,r,l){l.d(r,{l:function(){return cmp},Z:function(){return cmp}});var d=l(85893),s=l(19521);let m=s.ZP.form.withConfig({displayName:"styles__StyledForm",componentId:"sc-faebcb-0"})(["",""],{display:"flex",flex:"1 1 0%",flexDirection:"column"});var c=l(72771),p=l(93963),cmp=e=>{let{children:r,onSubmit:l,errors:s}=e;return(0,d.jsxs)(m,{onSubmit:l,noValidate:!0,children:[r,(null==s?void 0:s.root)&&(0,d.jsx)(p.Z,{children:Object.values(s.root).map(e=>(0,d.jsx)(u,{error:e},e+""))})]})},u=(0,s.ZP)(c.Xq).withConfig({displayName:"cmp___StyledFormError",componentId:"sc-tai6p3-0"})({wordBreak:"break-all"})},37419:function(e,r,l){l.d(r,{F:function(){return useEntityCost}});var d=l(67294),s=l(72933),m=l(19643),c=l(65148),p=l(9911),u=l(11118);function useEntityCost(e){let{entityType:r,props:l}=e,[f,h]=(0,d.useState)();return(0,d.useEffect)(()=>{(async function(){let e=await (r===p.py.Volume?c.l.getCost(l):r===p.py.Instance?s.u.getCost(l):r===p.py.Program?m.L.getCost(l):r===p.py.Indexer?u.p.getCost(l):void 0);h(e)})()},[r,...Object.values(l)]),{cost:f}}},24959:function(e,r,l){l.d(r,{c:function(){return useForm}});var d=l(72771),s=l(67294),m=l(87536),c=l(1604);function useForm(e){let{onSubmit:r,onSuccess:l,onError:p,readyDeps:u=[],...f}=e,h=(0,m.cI)(f);(0,s.useEffect)(()=>{"object"==typeof f.defaultValues&&h.reset(f.defaultValues)},[...u]);let[y,v]=(0,s.useState)({data:void 0,error:void 0,loading:!1}),[x,{onLoad:g,onSuccess:_,onError:w}]=(0,d.g7)({flushData:!0,state:y,setState:v,onSuccess:l,onError:p}),j=(0,s.useCallback)(async e=>{try{g();let l=await r(e);_(l)}catch(r){let e=r instanceof c.jm?Error("Validation error, check highlighted form fields"):(null==r?void 0:r.cause)||r;h.setError("root.serverError",{...e,message:null==e?void 0:e.message}),w(e)}},[h,w,g,r,_]),S=(0,s.useCallback)(async e=>{let r;if(console.log(e),!r){let l=function getFirstError(e){let[r]=Object.entries(e);if(!r)return;let[l,d]=r;if(Array.isArray(d)){let e=d[d.length-1];return getFirstError(e)}return[l,d]}(e);if(l){let[e,d]=l,s="string"==typeof d?d:(null==d?void 0:d.message)?": ".concat(d.message):(null==d?void 0:d.type)?': "'.concat(null==d?void 0:d.type,'" validation not satisfied'):"";r=Error('Error on field "'.concat(e,'"').concat(s))}}r||(r=Error("Validation error")),w(r)},[w]),b=(0,s.useMemo)(()=>h.handleSubmit(j,S),[h,j,S]);return{...h,requestState:x,handleSubmit:b}}},93396:function(e,r,l){l.d(r,{BB:function(){return useAddPersistentVolumeProps},Kn:function(){return useAddVolume},Ox:function(){return useAddExistingVolumeProps},Yl:function(){return useAddNewVolumeProps},Yz:function(){return p}});var d=l(67294),s=l(69060),m=l(65148),c=l(87536);let p={volumeType:m.z.New};function useAddNewVolumeProps(e){let{name:r="",index:l,control:p,defaultValue:u,onRemove:f}=e,h=void 0===l,y=h?r:"".concat(r,".").concat(l),v=(0,c.bc)({control:p,name:"".concat(y,".file"),defaultValue:null==u?void 0:u.file}),x=(0,c.bc)({control:p,name:"".concat(y,".mountPath"),defaultValue:null==u?void 0:u.mountPath}),g=(0,c.bc)({control:p,name:"".concat(y,".useLatest"),defaultValue:null==u?void 0:u.useLatest}),{value:_}=v.field,[w,j]=(0,d.useState)("");return(0,d.useEffect)(()=>{(async function(){let e=await m.l.getVolumeSize({volumeType:m.z.New,file:_}),r=(0,s.eB)(e,"MiB");j(r)})()},[_]),{isStandAlone:void 0===l,fileCtrl:v,mountPathCtrl:x,useLatestCtrl:g,volumeSize:w,handleRemove:f}}function useAddExistingVolumeProps(e){let{name:r="",index:l,control:p,defaultValue:u,onRemove:f}=e,h=(0,c.bc)({control:p,name:"".concat(r,".").concat(l,".refHash"),defaultValue:null==u?void 0:u.refHash}),y=(0,c.bc)({control:p,name:"".concat(r,".").concat(l,".mountPath"),defaultValue:null==u?void 0:u.mountPath}),v=(0,c.bc)({control:p,name:"".concat(r,".").concat(l,".useLatest"),defaultValue:null==u?void 0:u.useLatest}),{value:x}=h.field,[g,_]=(0,d.useState)("");return(0,d.useEffect)(()=>{(async function(){let e=await m.l.getVolumeSize({volumeType:m.z.Existing,refHash:x}),r=(0,s.eB)(e,"MiB");_(r)})()},[x]),{refHashCtrl:h,mountPathCtrl:y,useLatestCtrl:v,volumeSize:g,handleRemove:f}}function useAddPersistentVolumeProps(e){let{name:r="",index:l,control:m,defaultValue:p,onRemove:u}=e,f=(0,c.bc)({control:m,name:"".concat(r,".").concat(l,".name"),defaultValue:null==p?void 0:p.name}),h=(0,c.bc)({control:m,name:"".concat(r,".").concat(l,".mountPath"),defaultValue:null==p?void 0:p.mountPath}),y=(0,c.bc)({control:m,name:"".concat(r,".").concat(l,".size"),defaultValue:null==p?void 0:p.size}),v=(0,d.useCallback)(e=>{let r=Number(e.target.value),l=(0,s.Fx)(r,{from:"GiB",to:"MiB",displayUnit:!1});y.field.onChange(l)},[y.field]),x=(0,d.useMemo)(()=>y.field.value?(0,s.Fx)(y.field.value,{from:"MiB",to:"GiB",displayUnit:!1}):void 0,[y.field]);return{nameCtrl:f,mountPathCtrl:h,sizeCtrl:y,sizeValue:x,sizeHandleChange:v,handleRemove:u}}function useAddVolume(e){let{name:r="volumes",index:l,control:s,defaultValue:p,onRemove:u}=e,f=void 0===l,h=f?r:"".concat(r,".").concat(l),y=(0,c.bc)({control:s,name:"".concat(h,".volumeType"),defaultValue:m.z.New}),v=(0,d.useCallback)(()=>{u&&u(l)},[l,u]);return{name:r,index:l,control:s,volumeTypeCtrl:y,defaultValue:p,onRemove:v}}},56312:function(e,r,l){l.d(r,{F:function(){return zod_t}});var d=l(87536),t=function(e,r,l){if(e&&"reportValidity"in e){var s=(0,d.U2)(l,r);e.setCustomValidity(s&&s.message||""),e.reportValidity()}},resolvers_i=function(e,r){var i=function(l){var d=r.fields[l];d&&d.ref&&"reportValidity"in d.ref?t(d.ref,l,e):d.refs&&d.refs.forEach(function(r){return t(r,l,e)})};for(var l in r.fields)i(l)},n=function(e,r){r.shouldUseNativeValidation&&resolvers_i(e,r);var l={};for(var s in e){var m=(0,d.U2)(r.fields,s),c=Object.assign(e[s]||{},{ref:m&&m.ref});if(a(r.names||Object.keys(e),s)){var p=Object.assign({},o((0,d.U2)(l,s)));(0,d.t8)(p,"root",c),(0,d.t8)(l,s,p)}else(0,d.t8)(l,s,c)}return l},o=function(e){return Array.isArray(e)?e.filter(Boolean):[]},a=function(e,r){return e.some(function(e){return e.startsWith(r+".")})},zod_n=function(e,r){for(var l={};e.length;){var s=e[0],m=s.code,c=s.message,p=s.path.join(".");if(!l[p]){if("unionErrors"in s){var u=s.unionErrors[0].errors[0];l[p]={message:u.message,type:u.code}}else l[p]={message:c,type:m}}if("unionErrors"in s&&s.unionErrors.forEach(function(r){return r.errors.forEach(function(r){return e.push(r)})}),r){var f=l[p].types,h=f&&f[s.code];l[p]=(0,d.KN)(p,r,l,m,h?[].concat(h,s.message):s.message)}e.shift()}return l},zod_t=function(e,r,l){return void 0===l&&(l={}),function(d,s,m){try{return Promise.resolve(function(s,c){try{var p=Promise.resolve(e["sync"===l.mode?"parse":"parseAsync"](d,r)).then(function(e){return m.shouldUseNativeValidation&&resolvers_i({},m),{errors:{},values:l.raw?d:e}})}catch(e){return c(e)}return p&&p.then?p.then(void 0,c):p}(0,function(e){if(null!=e.errors)return{values:{},errors:n(zod_n(e.errors,!m.shouldUseNativeValidation&&"all"===m.criteriaMode),m)};throw e}))}catch(e){return Promise.reject(e)}}}}}]);