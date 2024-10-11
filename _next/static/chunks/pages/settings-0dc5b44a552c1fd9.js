(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[662],{98217:function(e,n,t){(window.__NEXT_P=window.__NEXT_P||[]).push(["/settings",function(){return t(14561)}])},18395:function(e,n,t){"use strict";t.d(n,{p:function(){return useSSHKeyManager}});var i=t(55032);function useSSHKeyManager(){let[e]=(0,i.mr)(),{sshKeyManager:n}=e.manager;return n}},68091:function(e,n,t){"use strict";t.d(n,{X:function(){return useRequestSSHKeys}});var i=t(18395),s=t(77205);function useRequestSSHKeys(){let e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},n=(0,i.p)();return(0,s.F)({...e,manager:n,name:"ssh"})}},14561:function(e,n,t){"use strict";t.r(n),t.d(n,{default:function(){return SettingsDashboardPage}});var i=t(85893),s=t(19521),a=t(67294),o=t(79632),r=t(93963),l=t(68091),m=t(36924);function getLabel(e){let n=arguments.length>1&&void 0!==arguments[1]&&arguments[1],t=e.length>0?"(".concat(e.length,")"):"";return"".concat(n?"BETA ":"").concat(t)}var c=t(34517),d=t(67102),u=t(49107);let SSHKeysTabContent=e=>{let{data:n}=e;return(0,i.jsxs)(i.Fragment,{children:[(0,i.jsx)(o.Jy,{children:(0,i.jsx)(h,{children:(0,i.jsx)(d.Z,{borderType:"none",rowNoise:!0,rowKey:e=>e.key,data:n,rowProps:e=>({css:e.confirmed?"":{opacity:"0.6"}}),columns:[{label:"Label",sortable:!0,render:e=>e.label||"-"},{label:"SSH Key",sortable:!0,width:"100%",render:e=>(0,u.bs)(e.key,32,32),cellProps:()=>({css:{maxWidth:"0rem",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",paddingRight:"0.75rem !important"}})},{label:"",align:"right",render:e=>(0,i.jsx)(c.Z,{kind:"functional",variant:"secondary",href:"/settings/ssh/".concat(e.id),children:(0,i.jsx)(o.JO,{name:"angle-right",size:"lg"})}),cellProps:()=>({css:{paddingLeft:"0.75rem !important"}})}]})})}),(0,i.jsx)(p,{children:(0,i.jsxs)(c.Z,{variant:"primary",href:"/settings/ssh/new",children:[(0,i.jsx)(S,{name:"plus-circle",size:"lg"})," Create new SSH key"]})})]})};SSHKeysTabContent.displayName="SSHKeysTabContent";var g=(0,a.memo)(SSHKeysTabContent),h=(0,s.ZP)("div").withConfig({displayName:"cmp___StyledDiv",componentId:"sc-1em1xho-0"})({maxWidth:"100%",overflow:"auto"}),p=(0,s.ZP)("div").withConfig({displayName:"cmp___StyledDiv2",componentId:"sc-1em1xho-1"})({marginTop:"2.5rem",textAlign:"center"}),S=(0,s.ZP)(o.JO).withConfig({displayName:"cmp___StyledIcon",componentId:"sc-1em1xho-2"})({marginRight:"0.25rem"}),f=t(24340),x=t(18585),y=t(78823);function SettingsDashboardPage(){let{tabs:e,tabId:n,setTabId:t,domains:s,sshKeys:c}=function(){let{entities:e=[]}=(0,l.X)(),{entities:n=[]}=(0,m.d)(),[t,i]=(0,a.useState)("ssh"),s=(0,a.useMemo)(()=>[{id:"ssh",name:"SSH Keys",label:{label:getLabel(e),position:"bottom"}},{id:"domain",name:"Domains",label:{label:getLabel(n),position:"bottom"}}],[n,e]);return{sshKeys:e,domains:n,tabs:s,tabId:t,setTabId:i}}();return(0,i.jsxs)(i.Fragment,{children:[(0,i.jsx)(b,{$variant:"xl",children:(0,i.jsx)(o.mQ,{selected:n,tabs:e,onTabChange:t})}),(0,i.jsx)("div",{role:"tabpanel",children:"ssh"===n?(0,i.jsxs)(i.Fragment,{children:[!!c.length&&(0,i.jsx)(w,{$variant:"xl",children:(0,i.jsx)(g,{data:c})}),(0,i.jsx)(y.Z,{info:"WHAT ARE...",title:"SSH Keys",description:"Securely manage your instances with SSH access. Use our SSH feature to establish secure connections, ensuring safe and efficient administration of your instances.",imageSrc:"/img/dashboard/ssh.svg",imageAlt:"SSH Key illustration",withButton:0===c.length,buttonUrl:"/settings/ssh/new",buttonText:"Add SSH key"})]}):"domain"===n?(0,i.jsxs)(i.Fragment,{children:[!!s.length&&(0,i.jsx)(_,{$variant:"xl",children:(0,i.jsx)(f.Z,{data:s})}),(0,i.jsx)(y.Z,{info:"WHAT ARE...",title:"Custom domains",description:"Link your custom domains effortlessly to functions, instances, volumes, or websites. Simplify your web3 hosting experience with streamlined domain management.",imageSrc:"/img/dashboard/domain.svg",imageAlt:"Domain illustration",withButton:0===s.length,buttonUrl:"/settings/domain/new",buttonText:"Create custom domain",externalLinkUrl:"https://docs.aleph.im/computing/custom_domain/setup/"})]}):(0,i.jsx)(i.Fragment,{})}),(0,i.jsx)(r.Z,{$variant:"xl",children:(0,i.jsx)(x.Z,{})})]})}var b=(0,s.ZP)(r.Z).withConfig({displayName:"cmp___StyledContainer",componentId:"sc-1omwoix-0"})({marginTop:"2.5rem",marginBottom:"2.5rem"}),w=(0,s.ZP)(r.Z).withConfig({displayName:"cmp___StyledContainer2",componentId:"sc-1omwoix-1"})({marginTop:"2.5rem",marginBottom:"2.5rem"}),_=(0,s.ZP)(r.Z).withConfig({displayName:"cmp___StyledContainer3",componentId:"sc-1omwoix-2"})({marginTop:"2.5rem",marginBottom:"2.5rem"})}},function(e){e.O(0,[733,774,888,179],function(){return e(e.s=98217)}),_N_E=e.O()}]);