(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[936],{30711:function(e,n,i){(window.__NEXT_P=window.__NEXT_P||[]).push(["/storage/volume/[hash]",function(){return i(93637)}])},34517:function(e,n,i){"use strict";i.d(n,{Z:function(){return s}});var t=i(85893),r=i(67294),o=i(41664),a=i.n(o),d=i(72771);let ButtonLink=e=>{let{href:n,variant:i="secondary",color:r="main0",kind:o="default",size:s="md",disabled:c,children:l,...m}=e,p=(0,t.jsx)(d.zx,{as:c?void 0:"a",variant:i,color:r,kind:o,size:s,disabled:c,...m,children:l});return c?p:(0,t.jsx)(a(),{href:n,passHref:!0,legacyBehavior:!0,children:p})};ButtonLink.displayName="ButtonLink";var s=(0,r.memo)(ButtonLink)},93963:function(e,n,i){"use strict";i.d(n,{Z:function(){return a}});var t=i(19521);let r={xl:90,lg:60.0625,md:44.6875},o=t.ZP.div.withConfig({displayName:"styles__StyledContainer",componentId:"sc-1bpjbi2-0"})(["",""],e=>{let{$variant:n="lg"}=e;return(0,t.iv)([""," max-width:","rem;"],{marginLeft:"auto",marginRight:"auto",width:"100%",paddingLeft:"1.5rem",paddingRight:"1.5rem","@media (min-width: 62rem)":{paddingLeft:"4rem",paddingRight:"4rem"}},r[n])});var a=o},76696:function(e,n,i){"use strict";i.d(n,{Z:function(){return l}});var t=i(85893),r=i(19521),o=i(67294),a=i(70150),d=i(72771);let s=r.ZP.div.withConfig({displayName:"styles__StyledContainer",componentId:"sc-hdgoyh-0"})(["",""],e=>{let{theme:n}=e;return(0,r.iv)([""," ","{color:",";}&:hover ","{color:",";}"],{display:"flex",cursor:"pointer",alignItems:"center"},c,n.color.purple4,c,n.color.main0)}),c=(0,r.ZP)(d.JO).withConfig({displayName:"styles__StyledIcon",componentId:"sc-hdgoyh-1"})(["",""],e=>{let{theme:n}=e;return(0,r.iv)([""," transition-property:color;transition-duration:","ms;transition-timing-function:",";"],{marginLeft:"0.5rem",cursor:"pointer"},n.transition.duration.fast,n.transition.timing)}),IconText=e=>{let{children:n,onClick:i,iconName:r}=e;return(0,t.jsxs)(s,{onClick:i,children:[(0,t.jsx)(m,{children:n}),(0,t.jsx)(p,{name:r,className:"text-purple4"})]})};IconText.displayName="IconText";var l=(0,o.memo)(IconText),m=(0,r.ZP)(a.xv).withConfig({displayName:"cmp___StyledText",componentId:"sc-3gm8x3-0"})({wordBreak:"break-all"}),p=(0,r.ZP)(c).withConfig({displayName:"cmp___StyledStyledIcon",componentId:"sc-3gm8x3-1"})({marginLeft:"0.5rem",cursor:"pointer"})},70150:function(e,n,i){"use strict";i.d(n,{W2:function(){return s},Z0:function(){return a},xv:function(){return d}});var t=i(19521),r=i(93963),o=i(72771);let a=t.ZP.hr.withConfig({displayName:"common__Separator",componentId:"sc-1mp6l0k-0"})([""," border:0;border-top:1px solid ",";opacity:0.3;"],{marginTop:"1.25rem",marginBottom:"1.25rem"},e=>{let{theme:n}=e;return n.color.main0}),d=t.ZP.span.attrs((0,o.PT)("tp-body1 text-text")).withConfig({displayName:"common__Text",componentId:"sc-1mp6l0k-1"})([""]),s=(0,t.ZP)(r.Z).attrs(e=>({...e,variant:"dashboard"})).withConfig({displayName:"common__Container",componentId:"sc-1mp6l0k-2"})([""])},69368:function(e,n,i){"use strict";i.d(n,{vx:function(){return useCopyToClipboardAndNotify}});var t=i(72771),r=i(67294);function useCopyToClipboardAndNotify(){let[e,n]=function(){let[e,n]=(0,r.useState)(null),copy=async e=>{var i;if(!(null===(i=navigator)||void 0===i?void 0:i.clipboard))return console.warn("Clipboard not supported"),!1;try{return await navigator.clipboard.writeText(e),n(e),!0}catch(e){return console.warn("Copy failed",e),n(null),!1}};return[e,copy]}(),i=(0,t.lm)(),o=(0,r.useCallback)(async e=>{let t=await n(e);t&&i&&i.add({variant:"success",title:"Copied to clipboard"})},[n,i]);return[e,o]}},90805:function(e,n,i){"use strict";i.d(n,{B:function(){return useVolumeManager}});var t=i(51079);function useVolumeManager(){let[e]=(0,t.mr)(),{volumeManager:n}=e;return n}},36949:function(e,n,i){"use strict";i.d(n,{C:function(){return useRetryNotConfirmedEntities}});var t=i(67294);function useRetryNotConfirmedEntities(e){let{entities:n=[],request:i,triggerOnMount:r}=e;(0,t.useEffect)(()=>{if(!r)return;let e=(Array.isArray(n)?n:[n]).filter(e=>!e.confirmed);if(!e.length)return;let t=setInterval(i,1e4);return()=>clearInterval(t)},[n,i,r])}},93637:function(e,n,i){"use strict";i.r(n),i.d(n,{default:function(){return ManageVolume}});var t=i(85893),r=i(19521),o=i(34517),a=i(76696),d=i(72771),s=i(9911),c=i(11163),l=i(67294),m=i(51079),p=i(90732),u=i(36949),g=i(90805),f=i(69368),h=i(69060),y=i(70150),x=i(11505);function ManageVolume(){let{volume:e,handleCopyHash:n,handleDelete:i,handleDownload:L}=function(){let e=(0,c.useRouter)(),{hash:n}=e.query,[i]=function(e){let{id:n,triggerOnMount:i=!0}=e,[t,r]=(0,m.mr)(),o=(0,g.B)(),a=(0,l.useCallback)(async()=>{if(!o)throw Error("Manager not ready");return await o.get(n)},[o,n]),s=(0,l.useCallback)(e=>{r({type:p.MF.addAccountVolume,payload:{accountVolume:e}})},[r]),c=(0,l.useCallback)((e,n)=>{o&&n(e)},[o]),f=(0,l.useMemo)(()=>(t.accountVolumes||[]).find(e=>e.id===n),[t.accountVolumes,n]),h=(0,d.GO)({doRequest:a,onSuccess:s,onError:c,triggerOnMount:i});return(0,u.C)({entities:f,request:h.request,triggerOnMount:i}),[f,h]}({id:n}),[,t]=(0,f.vx)(),[,r]=(0,m.mr)(),o=(0,g.B)(),a=(0,l.useCallback)(()=>{t((null==i?void 0:i.id)||"")},[t,i]),s=(0,l.useCallback)(async()=>{if(!o)throw Error("Manager not ready");if(!i)throw Error("Invalid volume");try{await o.del(i),r({type:p.MF.delAccountVolume,payload:{id:i.id}}),await e.replace("/")}catch(e){}},[o,i,r,e]),h=(0,l.useCallback)(async()=>{if(!o)throw Error("Manager not ready");if(!i)throw Error("Invalid volume");await o.download(i)},[o,i]);return{volume:i,handleCopyHash:a,handleDelete:s,handleDownload:h}}(),M=(0,r.Fg)();if(!e)return(0,t.jsx)(t.Fragment,{children:(0,t.jsx)(y.W2,{children:(0,t.jsx)(_,{children:"Loading..."})})});let A=(0,h.zN)(e.id),V=s.K_[e.type];return(0,t.jsx)(t.Fragment,{children:(0,t.jsx)(v,{children:(0,t.jsxs)(y.W2,{children:[(0,t.jsxs)(w,{children:[(0,t.jsxs)(j,{children:[(0,t.jsx)(C,{name:"floppy-disk",className:"text-main0"}),(0,t.jsx)("div",{className:"tp-body2",children:A}),(0,t.jsx)(N,{kind:"secondary",variant:e.confirmed?"success":"warning",children:e.confirmed?"READY":(0,t.jsxs)(I,{children:[(0,t.jsx)(Z,{children:"CONFIRMING"}),(0,t.jsx)(x.s5,{strokeColor:M.color.base2,width:".8rem"})]})})]}),(0,t.jsxs)("div",{children:[(0,t.jsx)(b,{size:"md",variant:"tertiary",color:"main0",kind:"default",forwardedAs:"a",onClick:L,children:"Download"}),(0,t.jsx)(d.zx,{kind:"functional",variant:"warning",size:"md",onClick:i,children:"Delete"})]})]}),(0,t.jsxs)(d.Jy,{children:[(0,t.jsxs)(k,{children:[(0,t.jsx)(P,{variant:"accent",children:V}),(0,t.jsxs)(S,{children:[(0,t.jsx)("div",{className:"tp-info text-main0",children:"ITEM HASH"}),(0,t.jsx)(a.Z,{iconName:"copy",onClick:n,children:e.id})]})]}),(0,t.jsx)(y.Z0,{}),(0,t.jsxs)(T,{children:[(0,t.jsx)("div",{className:"tp-info text-main0",children:"EXPLORER"}),(0,t.jsx)("div",{children:(0,t.jsx)("a",{className:"tp-body1 fs-16",href:e.url,target:"_blank",referrerPolicy:"no-referrer",children:(0,t.jsx)(a.Z,{iconName:"square-up-right",children:(0,t.jsx)(y.xv,{children:(0,h.bs)(e.url,80)})})})})]}),(0,t.jsxs)(E,{children:[(0,t.jsxs)(B,{children:[(0,t.jsx)("div",{className:"tp-info text-main0",children:"SIZE"}),(0,t.jsx)("div",{children:(0,t.jsx)(y.xv,{className:"fs-10 tp-body1",children:(0,h.eB)(e.size,"MiB")})})]}),(0,t.jsxs)(R,{children:[(0,t.jsx)("div",{className:"tp-info text-main0",children:"CREATED ON"}),(0,t.jsx)("div",{children:(0,t.jsx)(y.xv,{className:"fs-10 tp-body1",children:e.date})})]})]})]}),(0,t.jsx)(D,{children:(0,t.jsx)(o.Z,{variant:"primary",href:"/storage/volume/new",children:"Create new volume"})})]})})})}var _=(0,r.ZP)(d.Jy).withConfig({displayName:"cmp___StyledNoisyContainer",componentId:"sc-1ow8j9g-0"})({marginTop:"1rem",marginBottom:"1rem"}),v=(0,r.ZP)("section").withConfig({displayName:"cmp___StyledSection",componentId:"sc-1ow8j9g-1"})({paddingLeft:"0px",paddingRight:"0px",paddingBottom:"1.5rem",paddingTop:"5rem","@media (min-width: 48rem)":{paddingTop:"2.5rem",paddingBottom:"2.5rem"}}),w=(0,r.ZP)("div").withConfig({displayName:"cmp___StyledDiv",componentId:"sc-1ow8j9g-2"})({display:"flex",justifyContent:"space-between",paddingBottom:"1.25rem"}),j=(0,r.ZP)("div").withConfig({displayName:"cmp___StyledDiv2",componentId:"sc-1ow8j9g-3"})({display:"flex",alignItems:"center"}),C=(0,r.ZP)(d.JO).withConfig({displayName:"cmp___StyledIcon",componentId:"sc-1ow8j9g-4"})({marginRight:"1rem"}),N=(0,r.ZP)(d.__).withConfig({displayName:"cmp___StyledLabel",componentId:"sc-1ow8j9g-5"})({marginLeft:"1rem"}),I=(0,r.ZP)("div").withConfig({displayName:"cmp___StyledDiv3",componentId:"sc-1ow8j9g-6"})({display:"flex",alignItems:"center"}),Z=(0,r.ZP)("div").withConfig({displayName:"cmp___StyledDiv4",componentId:"sc-1ow8j9g-7"})({marginRight:"0.5rem"}),b=(0,r.ZP)(d.zx).withConfig({displayName:"cmp___StyledButton",componentId:"sc-1ow8j9g-8"})({marginRight:"1rem !important"}),k=(0,r.ZP)("div").withConfig({displayName:"cmp___StyledDiv5",componentId:"sc-1ow8j9g-9"})({display:"flex",alignItems:"center",justifyContent:"flex-start",overflow:"hidden"}),P=(0,r.ZP)(d.Vp).withConfig({displayName:"cmp___StyledTag",componentId:"sc-1ow8j9g-10"})({marginRight:"1rem",whiteSpace:"nowrap"}),S=(0,r.ZP)("div").withConfig({displayName:"cmp___StyledDiv6",componentId:"sc-1ow8j9g-11"})({flex:"1 1 auto"}),T=(0,r.ZP)("div").withConfig({displayName:"cmp___StyledDiv7",componentId:"sc-1ow8j9g-12"})({marginTop:"1.25rem",marginBottom:"1.25rem"}),E=(0,r.ZP)("div").withConfig({displayName:"cmp___StyledDiv8",componentId:"sc-1ow8j9g-13"})({marginTop:"1.25rem",marginBottom:"1.25rem",display:"flex"}),B=(0,r.ZP)("div").withConfig({displayName:"cmp___StyledDiv9",componentId:"sc-1ow8j9g-14"})({marginRight:"1.25rem"}),R=(0,r.ZP)("div").withConfig({displayName:"cmp___StyledDiv10",componentId:"sc-1ow8j9g-15"})({marginRight:"1.25rem"}),D=(0,r.ZP)("div").withConfig({displayName:"cmp___StyledDiv11",componentId:"sc-1ow8j9g-16"})({marginTop:"5rem",textAlign:"center"})}},function(e){e.O(0,[774,888,179],function(){return e(e.s=30711)}),_N_E=e.O()}]);