(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[903],{92828:function(e,n,i){(window.__NEXT_P=window.__NEXT_P||[]).push(["/configure/ssh/[hash]",function(){return i(20608)}])},34517:function(e,n,i){"use strict";i.d(n,{Z:function(){return c}});var t=i(85893),r=i(67294),o=i(41664),a=i.n(o),l=i(72771);let ButtonLink=e=>{let{href:n,variant:i="secondary",color:r="main0",kind:o="default",size:c="md",disabled:s,children:d,...m}=e,p=(0,t.jsx)(l.zx,{as:s?void 0:"a",variant:i,color:r,kind:o,size:c,disabled:s,...m,children:d});return s?p:(0,t.jsx)(a(),{href:n,passHref:!0,legacyBehavior:!0,children:p})};ButtonLink.displayName="ButtonLink";var c=(0,r.memo)(ButtonLink)},93963:function(e,n,i){"use strict";i.d(n,{Z:function(){return a}});var t=i(19521);let r={xl:90,lg:60.0625,md:44.6875},o=t.ZP.div.withConfig({displayName:"styles__StyledContainer",componentId:"sc-1bpjbi2-0"})(["",""],e=>{let{$variant:n="lg"}=e;return(0,t.iv)([""," max-width:","rem;"],{marginLeft:"auto",marginRight:"auto",width:"100%",paddingLeft:"1.5rem",paddingRight:"1.5rem","@media (min-width: 62rem)":{paddingLeft:"4rem",paddingRight:"4rem"}},r[n])});var a=o},76696:function(e,n,i){"use strict";i.d(n,{Z:function(){return d}});var t=i(85893),r=i(19521),o=i(67294),a=i(70150),l=i(72771);let c=r.ZP.div.withConfig({displayName:"styles__StyledContainer",componentId:"sc-hdgoyh-0"})(["",""],e=>{let{theme:n}=e;return(0,r.iv)([""," ","{color:",";}&:hover ","{color:",";}"],{display:"flex",cursor:"pointer",alignItems:"center"},s,n.color.purple4,s,n.color.main0)}),s=(0,r.ZP)(l.JO).withConfig({displayName:"styles__StyledIcon",componentId:"sc-hdgoyh-1"})(["",""],e=>{let{theme:n}=e;return(0,r.iv)([""," transition-property:color;transition-duration:","ms;transition-timing-function:",";"],{marginLeft:"0.5rem",cursor:"pointer"},n.transition.duration.fast,n.transition.timing)}),IconText=e=>{let{children:n,onClick:i,iconName:r}=e;return(0,t.jsxs)(c,{onClick:i,children:[(0,t.jsx)(m,{children:n}),(0,t.jsx)(p,{name:r,className:"text-purple4"})]})};IconText.displayName="IconText";var d=(0,o.memo)(IconText),m=(0,r.ZP)(a.xv).withConfig({displayName:"cmp___StyledText",componentId:"sc-3gm8x3-0"})({wordBreak:"break-all"}),p=(0,r.ZP)(s).withConfig({displayName:"cmp___StyledStyledIcon",componentId:"sc-3gm8x3-1"})({marginLeft:"0.5rem",cursor:"pointer"})},70150:function(e,n,i){"use strict";i.d(n,{W2:function(){return c},Z0:function(){return a},xv:function(){return l}});var t=i(19521),r=i(93963),o=i(72771);let a=t.ZP.hr.withConfig({displayName:"common__Separator",componentId:"sc-1mp6l0k-0"})([""," border:0;border-top:1px solid ",";opacity:0.3;"],{marginTop:"1.25rem",marginBottom:"1.25rem"},e=>{let{theme:n}=e;return n.color.main0}),l=t.ZP.span.attrs((0,o.PT)("tp-body1 text-text")).withConfig({displayName:"common__Text",componentId:"sc-1mp6l0k-1"})([""]),c=(0,t.ZP)(r.Z).attrs(e=>({...e,variant:"dashboard"})).withConfig({displayName:"common__Container",componentId:"sc-1mp6l0k-2"})([""])},69368:function(e,n,i){"use strict";i.d(n,{vx:function(){return useCopyToClipboardAndNotify}});var t=i(72771),r=i(67294);function useCopyToClipboardAndNotify(){let[e,n]=function(){let[e,n]=(0,r.useState)(null),copy=async e=>{var i;if(!(null===(i=navigator)||void 0===i?void 0:i.clipboard))return console.warn("Clipboard not supported"),!1;try{return await navigator.clipboard.writeText(e),n(e),!0}catch(e){return console.warn("Copy failed",e),n(null),!1}};return[e,copy]}(),i=(0,t.lm)(),o=(0,r.useCallback)(async e=>{let t=await n(e);t&&i&&i.add({variant:"success",title:"Copied to clipboard"})},[n,i]);return[e,o]}},18395:function(e,n,i){"use strict";i.d(n,{p:function(){return useSSHKeyManager}});var t=i(51079);function useSSHKeyManager(){let[e]=(0,t.mr)(),{sshKeyManager:n}=e;return n}},36949:function(e,n,i){"use strict";i.d(n,{C:function(){return useRetryNotConfirmedEntities}});var t=i(67294);function useRetryNotConfirmedEntities(e){let{entities:n=[],request:i,triggerOnMount:r}=e;(0,t.useEffect)(()=>{if(!r)return;let e=(Array.isArray(n)?n:[n]).filter(e=>!e.confirmed);if(!e.length)return;let t=setInterval(i,1e4);return()=>clearInterval(t)},[n,i,r])}},20608:function(e,n,i){"use strict";i.r(n),i.d(n,{default:function(){return ManageSSHKey}});var t=i(85893),r=i(19521),o=i(34517),a=i(76696),l=i(72771),c=i(9911),s=i(11163),d=i(67294),m=i(51079),p=i(90732),u=i(36949),y=i(18395),f=i(69368),h=i(69060),g=i(70150),x=i(11505);function ManageSSHKey(){let{sshKey:e,handleCopyKey:n,handleCopyLabel:i,handleDelete:L}=function(){let e=(0,s.useRouter)(),{hash:n}=e.query,[i]=function(e){let{id:n,triggerOnMount:i=!0}=e,[t,r]=(0,m.mr)(),o=(0,y.p)(),a=(0,d.useCallback)(async()=>{if(!o)throw Error("Manager not ready");return await o.get(n)},[n,o]),c=(0,d.useCallback)(e=>{r({type:p.MF.addAccountSSHKey,payload:{accountSSHKey:e}})},[r]),s=(0,d.useCallback)((e,n)=>{o&&n(e)},[o]),f=(0,d.useMemo)(()=>(t.accountSSHKeys||[]).find(e=>e.id===n),[t.accountSSHKeys,n]),h=(0,l.GO)({doRequest:a,onSuccess:c,onError:s,triggerOnMount:i});return(0,u.C)({entities:f,request:h.request,triggerOnMount:i}),[f,h]}({id:n}),[,t]=(0,f.vx)(),[,r]=(0,m.mr)(),o=(0,y.p)(),a=(0,d.useCallback)(()=>{t((null==i?void 0:i.label)||"")},[t,i]),c=(0,d.useCallback)(()=>{t((null==i?void 0:i.key)||"")},[t,i]),h=(0,d.useCallback)(async()=>{if(!i)throw Error("Invalid key");if(!o)throw Error("Manager not ready");try{await o.del(i),r({type:p.MF.delAccountSSHKey,payload:{id:i.id}}),await e.replace("/")}catch(e){}},[i,o,r,e]);return{sshKey:i,handleCopyLabel:a,handleCopyKey:c,handleDelete:h}}(),R=(0,r.Fg)();if(!e)return(0,t.jsx)(t.Fragment,{children:(0,t.jsx)(g.W2,{children:(0,t.jsx)(_,{children:"Loading..."})})});let A=e.label||(0,h.zN)(e.id),D=c.K_[e.type];return(0,t.jsx)(t.Fragment,{children:(0,t.jsx)(v,{children:(0,t.jsxs)(g.W2,{children:[(0,t.jsxs)(w,{children:[(0,t.jsxs)(C,{children:[(0,t.jsx)(N,{name:"key",className:"text-main0"}),(0,t.jsx)("div",{className:"tp-body2",children:A}),(0,t.jsx)(j,{variant:e.confirmed?"success":"warning",children:e.confirmed?"READY":(0,t.jsxs)(S,{children:[(0,t.jsx)(I,{children:"CONFIRMING"}),(0,t.jsx)(x.s5,{strokeColor:R.color.base2,width:".8rem"})]})})]}),(0,t.jsx)("div",{children:(0,t.jsx)(l.zx,{kind:"functional",variant:"warning",size:"md",onClick:L,children:"Delete"})})]}),(0,t.jsxs)(l.Jy,{children:[(0,t.jsxs)(b,{children:[(0,t.jsx)(k,{variant:"accent",children:D}),(0,t.jsxs)(Z,{children:[(0,t.jsx)("div",{className:"tp-info text-main0",children:"KEY"}),(0,t.jsx)(a.Z,{iconName:"copy",onClick:n,children:e.key})]})]}),(0,t.jsx)(g.Z0,{}),e.label&&(0,t.jsxs)(P,{children:[(0,t.jsx)("div",{className:"tp-info text-main0",children:"LABEL"}),(0,t.jsx)("div",{children:(0,t.jsx)(a.Z,{iconName:"copy",onClick:i,children:(0,t.jsx)(g.xv,{children:e.label})})})]}),(0,t.jsxs)(T,{children:[(0,t.jsx)("div",{className:"tp-info text-main0",children:"EXPLORER"}),(0,t.jsx)("div",{children:(0,t.jsx)("a",{className:"tp-body1 fs-16",href:e.url,target:"_blank",referrerPolicy:"no-referrer",children:(0,t.jsx)(a.Z,{iconName:"square-up-right",children:(0,t.jsx)(g.xv,{children:(0,h.bs)(e.url,80)})})})})]}),(0,t.jsxs)(q,{children:[(0,t.jsx)("div",{className:"tp-info text-main0",children:"CREATED ON"}),(0,t.jsx)("div",{children:(0,t.jsx)(g.xv,{className:"fs-10 tp-body1",children:e.date})})]})]}),(0,t.jsx)(E,{children:(0,t.jsx)(o.Z,{variant:"primary",href:"/configure/ssh/new",children:"Add new SSH Key"})}),(0,t.jsx)(B,{children:"Acquire aleph.im tokens for versatile access to resources within a defined duration. These tokens remain in your wallet without being locked or consumed, providing you with flexibility in utilizing aleph.im's infrastructure. If you choose to remove the tokens from your wallet, the allocated resources will be efficiently reclaimed. Feel free to use or hold the tokens according to your needs, even when not actively using Aleph.im's resources."})]})})})}var _=(0,r.ZP)(l.Jy).withConfig({displayName:"cmp___StyledNoisyContainer",componentId:"sc-qmmm5l-0"})({marginTop:"1rem",marginBottom:"1rem"}),v=(0,r.ZP)("section").withConfig({displayName:"cmp___StyledSection",componentId:"sc-qmmm5l-1"})({paddingLeft:"0px",paddingRight:"0px",paddingBottom:"1.5rem",paddingTop:"5rem","@media (min-width: 48rem)":{paddingTop:"2.5rem",paddingBottom:"2.5rem"}}),w=(0,r.ZP)("div").withConfig({displayName:"cmp___StyledDiv",componentId:"sc-qmmm5l-2"})({display:"flex",justifyContent:"space-between",paddingBottom:"1.25rem"}),C=(0,r.ZP)("div").withConfig({displayName:"cmp___StyledDiv2",componentId:"sc-qmmm5l-3"})({display:"flex",alignItems:"center"}),N=(0,r.ZP)(l.JO).withConfig({displayName:"cmp___StyledIcon",componentId:"sc-qmmm5l-4"})({marginRight:"1rem"}),j=(0,r.ZP)(l.__).withConfig({displayName:"cmp___StyledLabel",componentId:"sc-qmmm5l-5"})({marginLeft:"1rem"}),S=(0,r.ZP)("div").withConfig({displayName:"cmp___StyledDiv3",componentId:"sc-qmmm5l-6"})({display:"flex",alignItems:"center"}),I=(0,r.ZP)("div").withConfig({displayName:"cmp___StyledDiv4",componentId:"sc-qmmm5l-7"})({marginRight:"0.5rem"}),b=(0,r.ZP)("div").withConfig({displayName:"cmp___StyledDiv5",componentId:"sc-qmmm5l-8"})({display:"flex",alignItems:"center",justifyContent:"flex-start",overflow:"hidden"}),k=(0,r.ZP)(l.Vp).withConfig({displayName:"cmp___StyledTag",componentId:"sc-qmmm5l-9"})({marginRight:"1rem",whiteSpace:"nowrap"}),Z=(0,r.ZP)("div").withConfig({displayName:"cmp___StyledDiv6",componentId:"sc-qmmm5l-10"})({flex:"1 1 auto"}),P=(0,r.ZP)("div").withConfig({displayName:"cmp___StyledDiv7",componentId:"sc-qmmm5l-11"})({marginTop:"1.25rem",marginBottom:"1.25rem"}),T=(0,r.ZP)("div").withConfig({displayName:"cmp___StyledDiv8",componentId:"sc-qmmm5l-12"})({marginTop:"1.25rem",marginBottom:"1.25rem"}),q=(0,r.ZP)("div").withConfig({displayName:"cmp___StyledDiv9",componentId:"sc-qmmm5l-13"})({marginTop:"1.25rem",marginBottom:"1.25rem"}),E=(0,r.ZP)("div").withConfig({displayName:"cmp___StyledDiv10",componentId:"sc-qmmm5l-14"})({marginTop:"5rem",textAlign:"center"}),B=(0,r.ZP)("p").withConfig({displayName:"cmp___StyledP",componentId:"sc-qmmm5l-15"})({marginTop:"6rem",marginBottom:"6rem",textAlign:"center"})}},function(e){e.O(0,[774,888,179],function(){return e(e.s=92828)}),_N_E=e.O()}]);