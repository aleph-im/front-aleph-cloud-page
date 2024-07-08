(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[308],{64974:function(e,t,n){(window.__NEXT_P=window.__NEXT_P||[]).push(["/hosting/website",function(){return n(90250)}])},8758:function(e,t,n){"use strict";n.d(t,{e:function(){return useWebsiteManager}});var i=n(55640);function useWebsiteManager(){let[e]=(0,i.mr)(),{websiteManager:t}=e.manager;return t}},30716:function(e,t,n){"use strict";n.d(t,{p:function(){return useRequestWebsites}});var i=n(8758),r=n(77205);function useRequestWebsites(){let e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},t=(0,i.e)();return(0,r.F)({...e,manager:t,name:"website"})}},90250:function(e,t,n){"use strict";n.r(t),n.d(t,{default:function(){return SettingsDashboardPage}});var i=n(85893),r=n(19521),s=n(67294),a=n(79632),o=n(93963),l=n(18585),d=n(34517),c=n(67102);let m=s.memo(e=>{let{data:t}=e;return(0,i.jsx)(i.Fragment,{children:t.length>0?(0,i.jsxs)(i.Fragment,{children:[(0,i.jsx)(a.Jy,{children:(0,i.jsx)(u,{children:(0,i.jsx)(c.Z,{borderType:"none",rowNoise:!0,rowKey:e=>e.id,data:t,rowProps:e=>({css:e.confirmed?"":{opacity:"0.6"}}),columns:[{label:"Name",width:"100%",sortable:!0,render:e=>e.id},{label:"Volume",align:"right",sortable:!0,render:e=>(0,i.jsx)(d.Z,{kind:"functional",variant:"none",size:"sm",href:e.refUrl,children:(0,i.jsx)(a.JO,{name:"database",size:"lg"})})},{label:"Date",align:"right",sortable:!0,render:e=>e.updated_at},{label:"",align:"right",render:e=>(0,i.jsx)(d.Z,{kind:"functional",variant:"secondary",href:"/hosting/website/".concat(e.id),children:(0,i.jsx)(a.JO,{name:"angle-right",size:"lg"})}),cellProps:()=>({css:{paddingLeft:"0.75rem !important"}})}]})})}),(0,i.jsx)(g,{children:(0,i.jsx)(d.Z,{variant:"primary",href:"/hosting/website/new",children:"Create website"})})]}):(0,i.jsx)(h,{children:(0,i.jsx)(d.Z,{variant:"primary",href:"/hosting/website/new",children:"Create your first website"})})})});m.displayName="WebsitesTabContent";var u=(0,r.ZP)("div").withConfig({displayName:"cmp___StyledDiv",componentId:"sc-1mewmo9-0"})({maxWidth:"100%",overflow:"auto"}),g=(0,r.ZP)("div").withConfig({displayName:"cmp___StyledDiv2",componentId:"sc-1mewmo9-1"})({marginTop:"5rem",textAlign:"center"}),h=(0,r.ZP)("div").withConfig({displayName:"cmp___StyledDiv3",componentId:"sc-1mewmo9-2"})({marginTop:"2.5rem",textAlign:"center"}),b=n(78823),p=n(30716),f=n(36924),w=n(55640),x=n(24340);function SettingsDashboardPage(){let{tabs:e,tabId:t,setTabId:n,websites:r,domains:d}=function(){let{entities:e=[]}=(0,p.p)(),{entities:t=[]}=function(){let e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},[t]=(0,w.mr)(),n=t.website.entities,{entities:i}=(0,f.d)(e),r=(0,s.useMemo)(()=>{if(!n||!i)return[];let e=n.reduce((e,t)=>(e[t.id]=t,e),{});return i.filter(t=>!!e[t.ref])},[i,n]);return{entities:r}}(),[n,i]=(0,s.useState)("website"),r=(0,s.useMemo)(()=>[{id:"website",name:"Websites",label:{label:function(e){let t=arguments.length>1&&void 0!==arguments[1]&&arguments[1],n=e.length>0?"(".concat(e.length,")"):"";return"".concat(t?"BETA ":"").concat(n)}(e),position:"bottom"}},{id:"domain",name:"Linked Domains",label:{label:"SOON",position:"top"},disabled:!t.length}],[e,t]);return{websites:e,domains:t,tabs:r,tabId:n,setTabId:i}}();return(0,i.jsxs)(i.Fragment,{children:[e.length?(0,i.jsx)(_,{$variant:"xl",children:(0,i.jsx)(a.mQ,{selected:t,tabs:e,onTabChange:n})}):(0,i.jsx)(i.Fragment,{}),(0,i.jsx)("div",{role:"tabpanel",children:"website"===t?(0,i.jsxs)(i.Fragment,{children:[!!r.length&&(0,i.jsx)(j,{$variant:"xl",children:(0,i.jsx)(m,{data:r})}),(0,i.jsx)(b.Z,{imageSrc:"/img/dashboard/website.svg",imageAlt:"Web3 Hosting illustration",info:"HOW TO...",title:"Create your Website!",description:"Build and deploy your website effortlessly using our web3 hosting solutions. Support for static pages, Next.js, React, and Vue.js ensures you have the flexibility to create the perfect site.",withButton:0===r.length,buttonUrl:"/hosting/website/new",buttonText:"Deploy your website"})]}):"domain"===t?(0,i.jsx)(i.Fragment,{children:!!d.length&&(0,i.jsx)(y,{$variant:"xl",children:(0,i.jsx)(x.Z,{data:d,cta:!1})})}):(0,i.jsx)(i.Fragment,{})}),(0,i.jsx)(o.Z,{$variant:"xl",children:(0,i.jsx)(l.Z,{})})]})}var _=(0,r.ZP)(o.Z).withConfig({displayName:"cmp___StyledContainer",componentId:"sc-lwxi32-0"})({marginTop:"2.5rem",marginBottom:"2.5rem"}),j=(0,r.ZP)(o.Z).withConfig({displayName:"cmp___StyledContainer2",componentId:"sc-lwxi32-1"})({marginTop:"2.5rem",marginBottom:"2.5rem"}),y=(0,r.ZP)(o.Z).withConfig({displayName:"cmp___StyledContainer3",componentId:"sc-lwxi32-2"})({marginTop:"2.5rem",marginBottom:"2.5rem"})}},function(e){e.O(0,[733,774,888,179],function(){return e(e.s=64974)}),_N_E=e.O()}]);