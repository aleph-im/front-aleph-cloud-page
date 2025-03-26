"use strict";(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[777],{72882:function(e,t,i){i.d(t,{ZP:function(){return c}});var n=i(85893),a=i(67294),l=i(79632),r=i(43251),o=i(19521);let d=(0,o.ZP)(l.JO).attrs(e=>{let{buttonSize:t}=e;return{size:(()=>{switch(t){case"xs":return"xs";case"sm":return"sm";case"lg":return"md-lg";case"xl":return"lg";default:return"md"}})()}}).withConfig({displayName:"styles__InfoIcon",componentId:"sc-15zds0b-0"})(["opacity:0.8;"]),s=(0,a.forwardRef)((e,t)=>{let{tooltipContent:i,tooltipPosition:o,children:s,disabled:c,size:u,...m}=e,[f,p]=(0,a.useState)(!1);(0,a.useEffect)(()=>{p(!0)},[]);let h=(0,a.useRef)(null),v=t||h;return(0,n.jsxs)("div",{className:"inline-flex relative",children:[(0,n.jsx)(l.zx,{ref:v,disabled:c,size:u,...m,children:(0,n.jsxs)(n.Fragment,{children:[s,c&&i&&(0,n.jsx)(d,{name:"info-circle",buttonSize:u})]})}),f&&c&&i&&(0,n.jsx)(r.Z,{my:(null==o?void 0:o.my)||"bottom-center",at:(null==o?void 0:o.at)||"top-center",targetRef:v,content:i})]})});s.displayName="ButtonWithInfoTooltip";var c=s},48310:function(e,t,i){i.d(t,{Z:function(){return CRNList}});var n=i(85893),a=i(19521),l=i(67294),r=i(25675),o=i.n(r),d=i(79632),s=i(9911),c=i(60539),u=i(93787),m=i(68885),f=i(3468),p=i(67656),h=i(39674),v=i(49107),y=i(45866),g=i(11505);function CRNList(e){let{enableGpu:t=!1,selected:i,lastVersion:r,specs:A,nodesIssues:M,filteredNodes:E,filterOptions:L,loading:z,loadItemsDisabled:T,handleLoadItems:q,handleSortItems:G,nameFilter:K,handleNameFilterChange:V,gpuFilter:U,handleGpuFilterChange:F,cpuFilter:H,handleCpuFilterChange:J,ramFilter:O,handleRamFilterChange:W,hddFilter:X,handleHddFilterChange:$,onSelectedChange:Q}=function(e){let{enableGpu:t}=e,i=(0,u.z)(),{specs:n,loading:a}=(0,c.O)(),{lastVersion:r,loading:o}=(0,p.W)(),[h,v]=(0,l.useState)(!0),y=(0,l.useMemo)(()=>a||o||h,[o,h,a]),[g,b]=(0,l.useState)(""),x=(0,d.$P)(g,200),_=(0,l.useCallback)(e=>{let t=e.target.value;b(t)},[]),[w,S]=(0,l.useState)(),C=(0,l.useCallback)(e=>{if(!e)return S(void 0);"string"==typeof e&&S(e)},[]),[j,N]=(0,l.useState)(),k=(0,l.useCallback)(e=>{if(!e)return N(void 0);"string"==typeof e&&N(e)},[]),[I,P]=(0,l.useState)(),D=(0,l.useCallback)(e=>{if(!e)return P(void 0);"string"==typeof e&&P(e)},[]),[Z,B]=(0,l.useState)(),R=(0,l.useCallback)(e=>{if(!e)return B(void 0);"string"==typeof e&&B(e)},[]),A=(0,l.useMemo)(()=>{let e=Object.values(n);if(!t)return e;let i=e.filter(e=>e.gpu_support).flatMap(e=>{var t;return null===(t=e.compatible_available_gpus)||void 0===t?void 0:t.flatMap(t=>({...e,selectedGpu:t}))});return i},[t,n]),M=(0,l.useCallback)((e,t)=>{if(t)return e?t.filter(t=>{var i;return null===(i=t.name)||void 0===i?void 0:i.toLowerCase().includes(e.toLowerCase())}):t},[]),E=(0,l.useMemo)(()=>M(x,A),[M,x,A]),{defaultTiers:L}=(0,f.g)({type:s.py.Instance}),z=(0,l.useMemo)(()=>{let[e]=L;return e},[L]),T=(0,l.useMemo)(()=>{if(E)return E.reduce((e,t)=>{var l;let r=i.isStreamPaymentNotSupported(t);if(r)return e[t.hash]=r,e;if(a)return e;let o=n[t.hash];if(!a){let n=o&&i.validateMinNodeSpecs(z,o);if(!n)return e[t.hash]=m.r.MinSpecs,e}return(null===(l=o.ipv6_check)||void 0===l?void 0:l.vm)?o&&o.ipv6_check&&(e[t.hash]=m.r.Valid):e[t.hash]=m.r.IPV6,e},{})},[E,i,a,n,z]),q=(0,l.useMemo)(()=>{if(E)return T?E.filter(e=>!T[e.hash]):E},[E,T]),G=(0,l.useMemo)(()=>{try{return null==q?void 0:q.filter(e=>{var t,i,n,a;return(!w||(null===(t=e.selectedGpu)||void 0===t?void 0:t.model)===w)&&(!j||(null===(i=e.cpu)||void 0===i?void 0:i.count.toString())===j)&&(!I||(null===(n=e.mem)||void 0===n?void 0:n.available_kB.toString())===I)&&(!Z||(null===(a=e.disk)||void 0===a?void 0:a.available_kB.toString())===Z)})}catch(e){console.error(e)}finally{v(!1)}},[w,j,Z,I,q]),K=(0,l.useMemo)(()=>{if(G)return G.sort((e,t)=>e.score>t.score?-1:e.score<t.score?1:0)},[G]),{list:V,handleSortItems:U}=function(e){let{list:t}=e,[i,n]=(0,l.useState)(),a=(0,l.useMemo)(()=>t&&i?i(t):t,[t,i]),r=(0,l.useCallback)(e=>n(()=>e),[]);return{list:a,handleSortItems:r}}({list:K}),F=(0,l.useMemo)(()=>{let e={gpu:[],cpu:[],ram:[],hdd:[]};return V?(V.forEach(t=>{var i,n,a,l;let r=null===(i=t.selectedGpu)||void 0===i?void 0:i.model,o=null===(n=t.cpu)||void 0===n?void 0:n.count.toString(),d=null===(a=t.mem)||void 0===a?void 0:a.available_kB.toString(),s=null===(l=t.disk)||void 0===l?void 0:l.available_kB.toString();r&&!e.gpu.includes(r)&&e.gpu.push(r),o&&!e.cpu.includes(o)&&e.cpu.push(o),d&&!e.ram.includes(d)&&e.ram.push(d),s&&!e.hdd.includes(s)&&e.hdd.push(s)}),{gpu:e.gpu.sort(),cpu:e.cpu.sort((e,t)=>+e-+t),ram:e.ram.sort((e,t)=>+e-+t),hdd:e.hdd.sort((e,t)=>+e-+t)}):e},[V]),{list:H,loadItemsDisabled:J,handleLoadItems:O}=(0,d.fw)({list:V,itemsPerPage:20,resetDeps:[E]});return{...e,lastVersion:r,specs:n,loading:y,nodesIssues:T,filteredNodes:H,filterOptions:F,loadItemsDisabled:J,handleLoadItems:O,handleSortItems:U,nameFilter:g,handleNameFilterChange:_,gpuFilter:w,handleGpuFilterChange:C,cpuFilter:j,handleCpuFilterChange:k,ramFilter:I,handleRamFilterChange:D,hddFilter:Z,handleHddFilterChange:R}}(e),Y=(0,a.Fg)(),ee=(0,l.useMemo)(()=>{let e=t?{label:"GPU",width:"10%",sortable:!0,sortBy:e=>{var t;return null===(t=e.selectedGpu)||void 0===t?void 0:t.model},render:e=>{var t;return(0,n.jsx)(b,{children:null===(t=e.selectedGpu)||void 0===t?void 0:t.model})}}:void 0;return[{label:"SCORE",width:"10%",sortable:!0,sortBy:e=>e.score,render:e=>(0,n.jsx)(d.WG,{score:e.score})},{label:"NAME",width:"20%",sortable:!0,sortBy:e=>e.name,render:e=>(0,n.jsx)(d.tJ,{hash:e.hash,name:e.name,picture:e.picture,ImageCmp:o(),apiServer:s.pf})},e,{label:"CPU",width:"10%",sortable:!0,sortBy:e=>{var t,i;return(null===(i=A[e.hash])||void 0===i?void 0:null===(t=i.cpu)||void 0===t?void 0:t.count)||0},render:e=>{var t,i;return(0,n.jsx)(x,{children:A[e.hash]?"".concat(null===(i=A[e.hash])||void 0===i?void 0:null===(t=i.cpu)||void 0===t?void 0:t.count," x86 64bit"):"n/a"})}},{label:"RAM",width:"10%",sortable:!0,sortBy:e=>{var t,i;return(null===(i=A[e.hash])||void 0===i?void 0:null===(t=i.mem)||void 0===t?void 0:t.available_kB)||0},render:e=>{var t,i;return(0,n.jsx)(_,{children:(0,v.eB)(null===(i=A[e.hash])||void 0===i?void 0:null===(t=i.mem)||void 0===t?void 0:t.available_kB,"KiB")})}},{label:"HDD",width:"10%",sortable:!0,sortBy:e=>{var t,i;return(null===(i=A[e.hash])||void 0===i?void 0:null===(t=i.disk)||void 0===t?void 0:t.available_kB)||0},render:e=>{var t,i;return(0,n.jsx)(w,{children:(0,v.eB)(null===(i=A[e.hash])||void 0===i?void 0:null===(t=i.disk)||void 0===t?void 0:t.available_kB,"KiB")})}},{label:"VERSION",width:"20%",sortable:!0,sortBy:e=>null==e?void 0:e.version,render:e=>(0,n.jsx)(d.pJ,{version:(null==e?void 0:e.version)||"",lastVersion:r})},{label:"",align:"right",width:"100%",cellProps:()=>({css:{opacity:"1 !important"}}),render:e=>(0,n.jsx)(S,{children:(0,n.jsx)(d.zx,{color:"main0",variant:"tertiary",kind:"default",size:"md",type:"button",onClick:e=>e.preventDefault(),tabIndex:-1,className:"check-button",style:{visibility:e.isActive?"visible":"hidden",opacity:e.isActive?"1":"0",transition:"all ease-in-out 500ms 0ms",transitionProperty:"opacity visibility"},children:(0,n.jsx)(d.JO,{name:"check",size:"lg"})})})}].filter(e=>void 0!==e)},[t,A,r]),et=(0,l.useMemo)(()=>E?E.map(e=>{var t,n;let{hash:a,selectedGpu:l}=e,r="".concat(a,"-").concat(null==l?void 0:l.device_id,"-").concat(null==l?void 0:l.pci_host)==="".concat(null==i?void 0:i.hash,"-").concat(null==i?void 0:null===(t=i.selectedGpu)||void 0===t?void 0:t.device_id,"-").concat(null==i?void 0:null===(n=i.selectedGpu)||void 0===n?void 0:n.pci_host),o=null==M?void 0:M[a],d=void 0===o;return{...e,isActive:r,isLoading:d,disabled:!d&&!!o,issue:o}}):[],[E,M,i]),ei=(0,l.useCallback)(e=>({tabIndex:e.disabled?-1:0,className:"".concat(e.disabled?"_disabled":""," ").concat(e.isActive?"_active":""," ").concat(e.isLoading?"_loading":""),onClick:()=>{!e.disabled&&(e.isLoading||Q(e))},onKeyDown:t=>{("Space"===t.code||"Enter"===t.code)&&!e.disabled&&(e.isLoading||(t.preventDefault(),Q(e)))}}),[Q]),en=(0,l.useMemo)(()=>(0,n.jsx)(C,{children:(0,n.jsx)(g.s5,{strokeColor:Y.color.main0,width:"4rem"})}),[Y]),ea=(0,l.useRef)(null);return(0,n.jsxs)(j,{children:[(0,n.jsx)(y.Z,{show:z}),(0,n.jsx)(N,{children:(0,n.jsx)(k,{children:(0,n.jsx)(d.oi,{value:K,label:"Search CRN",name:"filter-crn",placeholder:"Search CRN",onChange:V,icon:(0,n.jsx)(d.JO,{name:"search"})})})}),(0,n.jsxs)(I,{children:[t&&(0,n.jsx)(P,{children:(0,n.jsx)(d.Lt,{placeholder:"GPU",label:"GPU",value:U,onChange:F,children:L.gpu.map(e=>(0,n.jsx)(d.Qr,{value:e,children:e},e))})}),(0,n.jsx)(D,{children:(0,n.jsx)(d.Lt,{placeholder:"CPU",label:"CPU",value:H,onChange:J,children:L.cpu.map(e=>(0,n.jsx)(d.Qr,{value:e,children:e},e))})}),(0,n.jsx)(Z,{children:(0,n.jsx)(d.Lt,{placeholder:"RAM",label:"RAM",value:O,onChange:W,children:L.ram.map(e=>(0,n.jsx)(d.Qr,{value:e,children:(0,v.eB)(+e,"KiB")},e))})}),(0,n.jsx)(B,{children:(0,n.jsx)(d.Lt,{placeholder:"HDD",label:"HDD",value:X,onChange:$,children:L.hdd.map(e=>(0,n.jsx)(d.Qr,{value:e,children:(0,v.eB)(+e,"KiB")},e))})})]}),(0,n.jsx)(R,{ref:ea,children:(0,n.jsx)(h.Z,{columns:ee,data:et,infiniteScroll:!T,infiniteScrollContainerRef:ea,onLoadMore:q,onSort:G,rowProps:ei,loadingPlaceholder:en})})]})}var b=(0,a.ZP)("div").withConfig({displayName:"cmp___StyledDiv",componentId:"sc-1a1kn0-0"})({whiteSpace:"nowrap"}),x=(0,a.ZP)("div").withConfig({displayName:"cmp___StyledDiv2",componentId:"sc-1a1kn0-1"})({whiteSpace:"nowrap"}),_=(0,a.ZP)("div").withConfig({displayName:"cmp___StyledDiv3",componentId:"sc-1a1kn0-2"})({whiteSpace:"nowrap"}),w=(0,a.ZP)("div").withConfig({displayName:"cmp___StyledDiv4",componentId:"sc-1a1kn0-3"})({whiteSpace:"nowrap"}),S=(0,a.ZP)("div").withConfig({displayName:"cmp___StyledDiv5",componentId:"sc-1a1kn0-4"})({display:"flex",justifyContent:"flex-end",gap:"0.75rem"}),C=(0,a.ZP)("div").withConfig({displayName:"cmp___StyledDiv6",componentId:"sc-1a1kn0-5"})({display:"flex",justifyContent:"center"}),j=(0,a.ZP)(d.Jy).withConfig({displayName:"cmp___StyledNoisyContainer",componentId:"sc-1a1kn0-6"})({height:"100%",width:"100%"}),N=(0,a.ZP)("div").withConfig({displayName:"cmp___StyledDiv7",componentId:"sc-1a1kn0-7"})({marginBottom:"2rem",display:"flex",flexDirection:"column",flexWrap:"wrap",alignItems:"stretch",justifyContent:"space-between",gap:"2.5rem","@media (min-width: 48rem)":{flexDirection:"row",alignItems:"center"}}),k=(0,a.ZP)("div").withConfig({displayName:"cmp___StyledDiv8",componentId:"sc-1a1kn0-8"})({flex:"1 1 0%"}),I=(0,a.ZP)("div").withConfig({displayName:"cmp___StyledDiv9",componentId:"sc-1a1kn0-9"})({marginBottom:"1.5rem",display:"flex",width:"100%",flexWrap:"wrap",columnGap:"1.5rem",rowGap:"1rem"}),P=(0,a.ZP)("div").withConfig({displayName:"cmp___StyledDiv10",componentId:"sc-1a1kn0-10"})({flex:"1 1 0%"}),D=(0,a.ZP)("div").withConfig({displayName:"cmp___StyledDiv11",componentId:"sc-1a1kn0-11"})({flex:"1 1 0%"}),Z=(0,a.ZP)("div").withConfig({displayName:"cmp___StyledDiv12",componentId:"sc-1a1kn0-12"})({flex:"1 1 0%"}),B=(0,a.ZP)("div").withConfig({displayName:"cmp___StyledDiv13",componentId:"sc-1a1kn0-13"})({flex:"1 1 0%"}),R=(0,a.ZP)("div").withConfig({displayName:"cmp___StyledDiv14",componentId:"sc-1a1kn0-14"})({height:"100%",minHeight:"20rem",overflow:"auto"})},93161:function(e,t,i){i.d(t,{Z:function(){return d}});var n=i(85893),a=i(19521),l=i(67294),r=i(79632);let o=a.ZP.a.withConfig({displayName:"styles__StyledExternalLink",componentId:"sc-1kmpaq1-0"})(["",""],e=>{let{theme:t,$color:i="white",$typo:n,$underline:l=!1}=e;return(0,a.iv)(["color:",";text-decoration:",";",""],t.color[i],l?"underline":"none",n?(0,r.pX)(n):"")}),ExternalLink=e=>{let{text:t,href:i,color:a,typo:l,underline:r,...d}=e;return(0,n.jsx)(n.Fragment,{children:(0,n.jsxs)(o,{href:i,target:"_blank",$color:a,$typo:l,$underline:r,...d,children:[t||i,(0,n.jsx)(s,{name:"square-up-right"})]})})};ExternalLink.displayName="ExternalLink";var d=(0,l.memo)(ExternalLink),s=(0,a.ZP)(r.JO).withConfig({displayName:"cmp___StyledIcon",componentId:"sc-mxjtpv-0"})({marginLeft:"0.625rem"})},39674:function(e,t,i){i.d(t,{Z:function(){return d}});var n=i(85893),a=i(19521),l=i(67294),r=i(20665);let o=(0,a.ZP)(r.Z).attrs(e=>({borderType:"solid",rowNoise:!0,stickyHeader:!1,...e})).withConfig({displayName:"styles__StyledTable",componentId:"sc-edtxuy-0"})(["thead th{font-size:0.8125rem;","}td,th{padding:0.75rem 1rem;width:0;}tr,td{border:none;}"],{whiteSpace:"nowrap"}),NodesTable=e=>{let{children:t,...i}=e;return(0,n.jsx)(s,{children:(0,n.jsx)(o,{...i,children:t})})};NodesTable.displayName="NodesTable";var d=(0,l.memo)(NodesTable),s=(0,a.ZP)("div").withConfig({displayName:"cmp___StyledDiv",componentId:"sc-c0xaff-0"})({maxWidth:"100%",overflowX:"auto"})},7053:function(e,t,i){i.d(t,{Z:function(){return r}});var n=i(19521),a=i(79632);let l=n.ZP.strong.attrs((0,a.PT)("tp-body4")).withConfig({displayName:"styles__StyledStrong",componentId:"sc-1jpeaxw-0"})(["color:",";"],e=>{let{theme:t}=e;return t.color.main0});var r=l},48998:function(e,t,i){i.d(t,{Z:function(){return m}});var n=i(85893),a=i(19521),l=i(67294),r=i(79632),o=i(87536),d=i(68091);let s={key:"",isSelected:!0,isNew:!0},c=l.memo(e=>{let{keyCtrl:t,labelCtrl:i,isSelectedCtrl:a,allowRemove:d,isNew:s,handleRemove:c}=function(e){let{name:t="sshKeys",index:i,control:n,allowRemove:a,defaultValue:r,onRemove:d}=e,s=(0,o.bc)({control:n,name:"".concat(t,".").concat(i,".isSelected"),defaultValue:null==r?void 0:r.isSelected}),c=(0,o.bc)({control:n,name:"".concat(t,".").concat(i,".key"),defaultValue:null==r?void 0:r.key}),u=(0,o.bc)({control:n,name:"".concat(t,".").concat(i,".label"),defaultValue:null==r?void 0:r.label}),m=(0,o.bc)({control:n,name:"".concat(t,".").concat(i,".isNew"),defaultValue:(null==r?void 0:r.isNew)||!1}),f=m.field.value,p=(0,l.useCallback)(()=>{f&&d(i)},[i,f,d]);return{index:i,isSelectedCtrl:s,keyCtrl:c,labelCtrl:u,allowRemove:a,isNew:f,handleRemove:p}}(e);return(0,n.jsxs)(n.Fragment,{children:[a.fieldState.error&&(0,n.jsx)(r.Xq,{error:a.fieldState.error}),(0,n.jsxs)(f,{children:[(0,n.jsx)(p,{children:(0,n.jsx)(r.XZ,{...a.field,...a.fieldState,checked:!!a.field.value})}),(0,n.jsxs)(h,{children:[(0,n.jsx)(v,{children:(0,n.jsx)(r.oi,{...t.field,...t.fieldState,required:!0,label:"Key",placeholder:"AAAAB3NzaC1yc2EAAAAB ... B3NzaaC1==",dataView:!s})}),(0,n.jsx)(y,{children:(0,n.jsx)(r.oi,{...i.field,...i.fieldState,label:"Label",placeholder:"me@email.com",dataView:!s})}),d&&(0,n.jsx)(g,{children:s&&(0,n.jsx)(r.zx,{type:"button",kind:"functional",variant:"warning",size:"md",onClick:c,children:(0,n.jsx)(r.JO,{name:"trash"})})})]})]})]})});c.displayName="SSHKeyItem";let u=l.memo(e=>{let{name:t,control:i,fields:a,handleAdd:u,handleRemove:m,allowRemove:f}=function(e){let{name:t="sshKeys",control:i}=e,n=(0,o.Dq)({control:i,name:t}),{remove:a,append:r,replace:c,prepend:u}=n,m=n.fields,f=function(){let{entities:e}=(0,d.X)();return(0,l.useMemo)(()=>(e||[]).map((e,t)=>{let{key:i,label:n=""}=e;return{key:i,label:n,isSelected:0===t,isNew:!1}}),[e])}();(0,l.useEffect)(()=>a(),[a,f]),(0,l.useEffect)(()=>{let e=f;if(0===e.length)return;if(0===m.length){c(e);return}let t=new Set(m.map(e=>e.key));0!==(e=f.filter(e=>!t.has(e.key))).length&&u(e)},[f,m,c,u]);let p=(0,l.useMemo)(()=>m.some(e=>e.isNew),[m]),h=(0,l.useCallback)(()=>{r({...s})},[r]);return{name:t,control:i,fields:m,handleAdd:h,handleRemove:a,allowRemove:p}}(e),p=a.map((e,t)=>({...e,index:t})).filter(e=>!e.isNew),h=a.map((e,t)=>({...e,index:t})).filter(e=>!!e.isNew);return(0,n.jsxs)(n.Fragment,{children:[a.length>0&&(0,n.jsx)(r.Jy,{children:(0,n.jsxs)(b,{children:[p.length>0&&(0,n.jsxs)(x,{children:[(0,n.jsx)(_,{forwardedAs:"h3",type:"h7",children:"Existing key list"}),p.map(e=>(0,n.jsx)(c,{name:t,index:e.index,control:i,allowRemove:!0,defaultValue:e,onRemove:m},e.id))]}),h.length>0&&(0,n.jsxs)(w,{children:[(0,n.jsx)(S,{forwardedAs:"h3",type:"h7",children:"New keys"}),h.map(e=>(0,n.jsx)(c,{name:t,index:e.index,control:i,allowRemove:f,defaultValue:e,onRemove:m},e.id))]})]})}),(0,n.jsx)(C,{children:(0,n.jsx)(r.zx,{type:"button",variant:"secondary",color:"main0",size:"md",onClick:u,children:"Add SSH key"})})]})});u.displayName="AddSSHKeys";var m=u,f=(0,a.ZP)("div").withConfig({displayName:"cmp___StyledDiv",componentId:"sc-1uniisg-0"})({display:"flex",gap:"1.5rem"}),p=(0,a.ZP)("div").withConfig({displayName:"cmp___StyledDiv2",componentId:"sc-1uniisg-1"})({display:"flex",alignItems:"flex-start",paddingTop:"2.75rem"}),h=(0,a.ZP)("div").withConfig({displayName:"cmp___StyledDiv3",componentId:"sc-1uniisg-2"})({display:"flex",flex:"1 1 auto",flexDirection:"column",gap:"1.5rem","@media (min-width: 48rem)":{flexDirection:"row"}}),v=(0,a.ZP)("div").withConfig({displayName:"cmp___StyledDiv4",componentId:"sc-1uniisg-3"})({flex:"1 1 auto"}),y=(0,a.ZP)("div").withConfig({displayName:"cmp___StyledDiv5",componentId:"sc-1uniisg-4"})({"@media (min-width: 48rem)":{width:"33.333333%"}}),g=(0,a.ZP)("div").withConfig({displayName:"cmp___StyledDiv6",componentId:"sc-1uniisg-5"})({display:"flex",width:"3.5rem",alignItems:"flex-end",paddingBottom:"0.5rem","@media (min-width: 48rem)":{justifyContent:"center"}}),b=(0,a.ZP)("div").withConfig({displayName:"cmp___StyledDiv7",componentId:"sc-1uniisg-6"})({display:"flex",flexDirection:"column",gap:"2.5rem",paddingBottom:"1.5rem"}),x=(0,a.ZP)("div").withConfig({displayName:"cmp___StyledDiv8",componentId:"sc-1uniisg-7"})({display:"flex",flexDirection:"column",gap:"1.5rem"}),_=(0,a.ZP)(r.DU).withConfig({displayName:"cmp___StyledTextGradient",componentId:"sc-1uniisg-8"})({marginBottom:"0px",alignSelf:"flex-start"}),w=(0,a.ZP)("div").withConfig({displayName:"cmp___StyledDiv9",componentId:"sc-1uniisg-9"})({display:"flex",flexDirection:"column",gap:"1.5rem"}),S=(0,a.ZP)(r.DU).withConfig({displayName:"cmp___StyledTextGradient2",componentId:"sc-1uniisg-10"})({marginBottom:"0px",alignSelf:"flex-start"}),C=(0,a.ZP)("div").withConfig({displayName:"cmp___StyledDiv10",componentId:"sc-1uniisg-11"})({marginLeft:"1.5rem",marginRight:"1.5rem",marginTop:"1.5rem"})},53054:function(e,t,i){i.d(t,{Z:function(){return p}});var n=i(85893),a=i(19521),l=i(67294),r=i(11163),o=i(31776),d=i(79632);let s=a.ZP.div.withConfig({displayName:"styles__StyledFlatCardContainer",componentId:"sc-atft2w-0"})(["",""],{display:"flex",flexWrap:"nowrap",alignItems:"center",justifyContent:"flex-start",gap:"1.5rem","@media (min-width: 48rem)":{flexWrap:"wrap",justifyContent:"space-evenly"}}),c=a.ZP.div.withConfig({displayName:"styles__StyledFlatCard",componentId:"sc-atft2w-1"})(["",""],e=>{let{theme:t,$selected:i,$disabled:n}=e;return(0,a.iv)([""," "," color:",";border:0.1875rem solid transparent;border-radius:1.5rem;background:linear-gradient( 118deg,"," 26.64%,#f4ecff66 118.38% );background-origin:border-box;"," &:hover{border-color:",";border-width:0.1875rem;box-shadow:0px 4px 24px 0px rgba(81,0,205,0.45);backdrop-filter:blur(50px);}",""],{position:"relative",display:"flex",flexShrink:"0",cursor:"pointer",flexDirection:"column",alignItems:"center",justifyContent:"center"},{transitionProperty:"all",transitionTimingFunction:"cubic-bezier(0.4, 0, 0.2, 1)",transitionDuration:"300ms"},t.color.main0,t.color.purple2,i&&(0,a.iv)(["border-color:",";border-width:0.1875rem;"],t.color.main0),t.color.main0,n&&(0,a.iv)(["filter:grayscale(1);"]))}),u=(0,a.ZP)(c).withConfig({displayName:"styles__StyledFlatCardButton",componentId:"sc-17g2frl-0"})(["height:10.125rem;width:13.875rem;",""],(0,d.gn)("md",(0,a.iv)(["width:30%;"]))),m=(0,l.memo)((0,l.forwardRef)((e,t)=>{let{option:i,index:a,value:o,onChange:d}=e,s=o===i.id,c=function(){let{basePath:e}=(0,r.useRouter)();return e}(),m=(0,l.useCallback)(()=>{i.disabled||d(i.id)},[i,d]),f=(0,l.useCallback)(e=>{("Space"===e.code||"Enter"===e.code)&&(e.preventDefault(),d(i.id))},[i,d]);return(0,n.jsxs)(u,{onClick:m,$selected:s,$disabled:i.disabled,ref:0===a?t:void 0,tabIndex:0,onKeyDown:f,children:[(0,n.jsx)(h,{src:"".concat("".concat(c,"/img"),"/image/").concat(i.dist,".svg"),alt:"".concat(i.name," logo")}),(0,n.jsx)("span",{className:"tp-body1 fs-10",children:i.name})]})}));m.displayName="SelectInstanceImageItem";let f=(0,l.memo)(e=>{let{imageCtrl:t,options:i}=(0,o.Bh)(e);return(0,n.jsxs)(v,{children:[(0,n.jsx)(s,{children:i.map((e,i)=>(0,n.jsx)(m,{...t.field,index:i,option:e},e.id))}),t.fieldState.error&&(0,n.jsx)(d.Xq,{error:t.fieldState.error})]})});f.displayName="SelectInstanceImage";var p=f,h=(0,a.ZP)("img").withConfig({displayName:"cmp___StyledImg",componentId:"sc-gz18i0-0"})({marginBottom:"1rem"}),v=(0,a.ZP)("div").withConfig({displayName:"cmp___StyledDiv",componentId:"sc-gz18i0-1"})({width:"100%",overflowX:"auto","@media (min-width: 48rem)":{overflowX:"visible"}})},65426:function(e,t,i){i.d(t,{Z:function(){return useFetchTermsAndConditions}});var n=i(55032),a=i(67294);function useFetchTermsAndConditions(e){let{termsAndConditionsMessageHash:t}=e,[i]=(0,n.mr)(),{manager:{messageManager:l}}=i,[r,o]=(0,a.useState)(!0),[d,s]=(0,a.useState)();return(0,a.useEffect)(()=>{let fetchTermsAndConditions=async()=>{try{var e;let i;if(!l||!t)return s(void 0);o(!0);try{let{content:e}=await l.get(t);i=e}catch(e){console.error(e)}if(!i)return s(void 0);let n=i.item_hash,a=null===(e=i.metadata)||void 0===e?void 0:e.name;s({cid:n,name:a,url:"https://ipfs.aleph.im/ipfs/".concat(n,"?filename=").concat(a)})}catch(e){console.error(e)}finally{o(!1)}};fetchTermsAndConditions()},[l,t]),{loading:r,termsAndConditions:d}}},18395:function(e,t,i){i.d(t,{p:function(){return useSSHKeyManager}});var n=i(55032);function useSSHKeyManager(){let[e]=(0,n.mr)(),{sshKeyManager:t}=e.manager;return t}},41698:function(e,t,i){i.d(t,{Z:function(){return usePrevious}});var n=i(67294);function usePrevious(e){let t=(0,n.useRef)();return(0,n.useEffect)(()=>{t.current=e}),t.current}},67656:function(e,t,i){i.d(t,{W:function(){return useRequestCRNLastVersion}});var n=i(67294),a=i(93787);function useRequestCRNLastVersion(){let e=(0,a.z)(),[t,i]=(0,n.useState)(),[l,r]=(0,n.useState)(!0);return(0,n.useEffect)(()=>{(async function(){let t=await e.getLatestCRNVersion();i(t),r(!1)})()},[e]),{lastVersion:t,loading:l}}},60539:function(e,t,i){i.d(t,{O:function(){return useRequestCRNSpecs}});var n=i(67294),a=i(93787);function useRequestCRNSpecs(){let e=(0,a.z)(),[t,i]=(0,n.useState)({}),[l,r]=(0,n.useState)(!0);return(0,n.useEffect)(()=>{(async function(){let t=await e.getAllCRNsSpecs();t.forEach(e=>{i(t=>({...t,[e.hash]:e}))}),r(!1)})()},[e]),{specs:t,loading:l}}},77205:function(e,t,i){i.d(t,{F:function(){return useRequestEntities}});var n=i(67294),a=i(55032),l=i(9324),r=i(79632);function useRequestEntities(e){let{name:t,manager:i,ids:o,triggerDeps:d=[],triggerOnMount:s=!0}=e,[c]=(0,a.mr)(),{account:u}=c.connection;d=[u,o,...d];let{data:m,request:f}=function(e){let[t,i]=(0,a.mr)();return function(e){let{state:t,dispatch:i,name:a,...o}=e,d=t[a],s=(0,n.useMemo)(()=>{let{entities:e,keys:t,...i}=d;return{data:e,...i}},[d]);return(0,r.QT)({state:s,setState:e=>{i(new l.B9({name:a,state:e}))},...o})}({state:t,dispatch:i,...e})}({name:t,doRequest:async()=>{if(!i)return[];if("string"!=typeof o)return o&&!o.length?[]:i.getAll({ids:o});let e=await i.get(o);return e?[e]:[]},onSuccess:()=>null,flushData:!0,triggerOnMount:s,triggerDeps:d});return!function(e){let{entities:t=[],request:i,triggerOnMount:a}=e;(0,n.useEffect)(()=>{if(!a)return;let e=(Array.isArray(t)?t:[t]).filter(e=>!e.confirmed);if(!e.length)return;let n=setInterval(i,1e4);return()=>clearInterval(n)},[t,i,a])}({entities:m,request:f,triggerOnMount:s}),{entities:m}}},68091:function(e,t,i){i.d(t,{X:function(){return useRequestSSHKeys}});var n=i(18395),a=i(77205);function useRequestSSHKeys(){let e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},t=(0,n.p)();return(0,a.F)({...e,manager:t,name:"ssh"})}},31776:function(e,t,i){i.d(t,{iJ:function(){return o},Bh:function(){return useSelectInstanceImage}}),(a=l||(l={})).Debian12="b6ff5c3a8205d1ca4c7c3369300eeafff498b558f71b851aa2114afd0a532717",a.Ubuntu22="4a0f62da42f4478544616519e6f5d58adb1096e069b392b151d47c3609492d0c",a.Ubuntu24="5330dcefe1857bcd97b7b7f24d1420a7d46232d53f27be280c8a7071d88bd84e";let n={b6ff5c3a8205d1ca4c7c3369300eeafff498b558f71b851aa2114afd0a532717:{id:"b6ff5c3a8205d1ca4c7c3369300eeafff498b558f71b851aa2114afd0a532717",name:"Debian 12 “Bookworm”",dist:"debian"},"4a0f62da42f4478544616519e6f5d58adb1096e069b392b151d47c3609492d0c":{id:"4a0f62da42f4478544616519e6f5d58adb1096e069b392b151d47c3609492d0c",name:"Ubuntu 22.04 LTS",dist:"ubuntu"},"5330dcefe1857bcd97b7b7f24d1420a7d46232d53f27be280c8a7071d88bd84e":{id:"5330dcefe1857bcd97b7b7f24d1420a7d46232d53f27be280c8a7071d88bd84e",name:"Ubuntu 24.04 LTS",dist:"ubuntu"}};var a,l,r=i(87536);let o=l.Debian12,d=[n[l.Debian12],n[l.Ubuntu22],n[l.Ubuntu24]];function useSelectInstanceImage(e){let{name:t="image",control:i,defaultValue:n,options:a}=e,l=(0,r.bc)({control:i,name:t,defaultValue:n});return{imageCtrl:l,options:a||d}}}}]);