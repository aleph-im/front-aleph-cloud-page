(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[481],{16249:function(e,r,s){(window.__NEXT_P=window.__NEXT_P||[]).push(["/hosting/website/[hash]",function(){return s(27167)}])},28565:function(e,r,s){"use strict";function useCanAfford(e){let{accountBalance:r,cost:s}=e,c=r>=(s?s.cost:Number.MAX_SAFE_INTEGER);return{canAfford:c,isCreateButtonDisabled:!c}}s.d(r,{U:function(){return useCanAfford}})},37419:function(e,r,s){"use strict";s.d(r,{F:function(){return useEntityCost}});var c=s(67294),l=s(9911),d=s(90805),m=s(33223),p=s(99978),u=s(8758),f=s(78474),h=s(79632);function useEntityCost(e){let{entityType:r,props:s}=e,g=(0,c.useMemo)(()=>({paymentMethod:l.XL.Hold,cost:Number.POSITIVE_INFINITY,lines:[]}),[]),[y,x]=(0,c.useState)(g),v=(0,d.B)(),j=(0,p.U)(),_=(0,f.c)(),w=(0,m.k)(),N=(0,u.e)(),b=(0,c.useMemo)(()=>JSON.stringify(s),[s]),C=(0,h.$P)(b,1e3),S=(0,c.useMemo)(()=>{try{return JSON.parse(C)}catch(e){return{}}},[C]);return(0,c.useEffect)(()=>{S&&0!==Object.keys(S).length&&load();async function load(){let e=g;switch(r){case l.py.Volume:v&&(e=await v.getCost(S));break;case l.py.Instance:j&&(e=await j.getCost(S));break;case l.py.GpuInstance:_&&(e=await _.getCost(S));break;case l.py.Program:w&&(e=await w.getCost(S));break;case l.py.Website:N&&(e=await N.getCost(S))}x(e)}},[r,S,g,v,j,_,w,N]),y}},24959:function(e,r,s){"use strict";s.d(r,{c:function(){return useForm}});var c=s(79632),l=s(67294),d=s(87536),m=s(1604),p=s(50586);function useForm(e){let{onSubmit:r,onSuccess:s,onError:u,readyDeps:f=[],...h}=e,g=(0,d.cI)(h);(0,l.useEffect)(()=>{"object"==typeof h.defaultValues&&g.reset(h.defaultValues)},[...f]);let[y,x]=(0,l.useState)({data:void 0,error:void 0,loading:!1}),[v,{onLoad:j,onSuccess:_,onError:w}]=(0,c.g7)({flushData:!0,state:y,setState:x,onSuccess:s,onError:u}),N=(0,l.useCallback)(async e=>{try{j();let s=await r(e);_(s)}catch(r){let e=r instanceof m.jm?p.Z.ValidationError:(null==r?void 0:r.cause)||r;g.setError("root.serverError",{...e,message:null==e?void 0:e.message}),w(e)}},[g,w,j,r,_]),b=(0,l.useCallback)(async e=>{let r;if(console.log(e),!r){let s=function getFirstError(e){let[r]=Object.entries(e);if(!r)return;let[s,c]=r;if(Array.isArray(c)){let e=c[c.length-1];return getFirstError(e)}return[s,c]}(e);if(s){let[e,c]=s,l="string"==typeof c?c:(null==c?void 0:c.message)?": ".concat(c.message):(null==c?void 0:c.type)?': "'.concat(null==c?void 0:c.type,'" validation not satisfied'):"";r=p.Z.FieldError(e,l)}}r||(r=p.Z.ValidationError),w(r)},[w]),C=(0,l.useMemo)(()=>g.handleSubmit(N,b),[g,N,b]);return{...g,requestState:v,handleSubmit:C}}},78474:function(e,r,s){"use strict";s.d(r,{c:function(){return useGpuInstanceManager}});var c=s(55032);function useGpuInstanceManager(){let[e]=(0,c.mr)(),{gpuInstanceManager:r}=e.manager;return r}},99978:function(e,r,s){"use strict";s.d(r,{U:function(){return useInstanceManager}});var c=s(55032);function useInstanceManager(){let[e]=(0,c.mr)(),{instanceManager:r}=e.manager;return r}},33223:function(e,r,s){"use strict";s.d(r,{k:function(){return useProgramManager}});var c=s(55032);function useProgramManager(){let[e]=(0,c.mr)(),{programManager:r}=e.manager;return r}},90805:function(e,r,s){"use strict";s.d(r,{B:function(){return useVolumeManager}});var c=s(55032);function useVolumeManager(){let[e]=(0,c.mr)(),{volumeManager:r}=e.manager;return r}},8758:function(e,r,s){"use strict";s.d(r,{e:function(){return useWebsiteManager}});var c=s(55032);function useWebsiteManager(){let[e]=(0,c.mr)(),{websiteManager:r}=e.manager;return r}},30716:function(e,r,s){"use strict";s.d(r,{p:function(){return useRequestWebsites}});var c=s(8758),l=s(77205);function useRequestWebsites(){let e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},r=(0,c.e)();return(0,l.F)({...e,manager:r,name:"website"})}},18090:function(e,r,s){"use strict";s.d(r,{o:function(){return useAddNameAndTags},y:function(){return m}});var c=s(9911),l=s(67294),d=s(87536);let m={name:""};function useAddNameAndTags(e){let{name:r="",control:s,defaultValue:m,entityType:p}=e,u=(0,d.bc)({control:s,name:"".concat(r,".name"),defaultValue:null==m?void 0:m.name}),f=(0,d.bc)({control:s,name:"".concat(r,".tags"),defaultValue:null==m?void 0:m.tags}),h=(0,l.useMemo)(()=>c.K_[p],[p]);return{entityName:h,nameCtrl:u,tagsCtrl:f}}},19048:function(e,r,s){"use strict";s.d(r,{m:function(){return useAddWebsiteFolderProps}});var c=s(67294),l=s(56979),d=s(87536),m=s(80074),p=s(79632);let isCidFile=e=>{e=Array.isArray(e)?e:[e];let[r]=e;if(r)try{return m.eB.parse(r.name),r.name}catch(e){}};function useAddWebsiteFolderProps(e){let{name:r="website",index:s,control:m,defaultValue:u,onRemove:f}=e,h=void 0===s,g=h?r:"".concat(r,".").concat(s),y=(0,d.bc)({control:m,name:"".concat(g,".folder"),defaultValue:null==u?void 0:u.folder}),x=(0,d.bc)({control:m,name:"".concat(g,".cid"),defaultValue:null==u?void 0:u.cid}),{value:v}=y.field,{onChange:j}=x.field;(0,c.useEffect)(()=>{!async function(){if(!v)return;let e=isCidFile(v)||await l.p.uploadFolder(v);e&&j(e)}()},[j,v]);let _=(0,p.vx)(x.field.value);return{folderCtrl:y,cidCtrl:x,handleRemove:f,handleCopyCID:_}}},43682:function(e,r,s){"use strict";s.d(r,{c:function(){return useNewWebsitePage}});var c=s(67294),l=s(11163),d=s(24959),m=s(8758),p=s(55032),u=s(95282),f=s(9911),h=s(87536),g=s(56312),y=s(37419),x=s(18090),v=s(86780),j=s(9324),_=s(50586),w=s(25819),N=s(28565);let b={...x.y,payment:{chain:w.Ek.ETH,type:f.XL.Hold}};function useNewWebsitePage(){let e=(0,l.useRouter)(),[r,s]=(0,p.mr)(),{account:x,balance:w=0}=r.connection,C=(0,m.e)(),{next:S,stop:Z}=(0,v.A)({}),I=(0,c.useCallback)(async r=>{if(!C)throw _.Z.ConnectYourWallet;let c=await C.getAddSteps(r),l=c.map(e=>v.n[e]),d=C.addSteps(r);try{let r;for(;!r;){let{value:e,done:s}=await d.next();if(s){r=e;break}await S(l)}s(new j.Wy({name:"website",entities:r})),await e.replace("/")}finally{await Z()}},[s,C,S,e,Z]),{control:E,handleSubmit:P,formState:{errors:k}}=(0,d.c)({defaultValues:b,onSubmit:I,resolver:(0,g.F)(u.y6.addSchema)}),q=(0,h.qo)({control:E}),D=(0,c.useMemo)(()=>({entityType:f.py.Website,props:{website:q.website,payment:q.payment,domains:q.domains}}),[q]),A=(0,y.F)(D),{isCreateButtonDisabled:W}=(0,N.U)({cost:A,accountBalance:w});return{address:(null==x?void 0:x.address)||"",accountBalance:w,isCreateButtonDisabled:W,values:q,control:E,errors:k,cost:A,handleSubmit:P,handleBack:()=>{e.push(".")}}}},27167:function(e,r,s){"use strict";s.r(r),s.d(r,{default:function(){return W}});var c=s(85893),l=s(19521),d=s(67294),m=s(41664),p=s.n(m),u=s(79632),f=s(9911),h=s(11163),g=s(8758),y=s(55032),x=s(15594),v=s(30716),j=s(9324),_=s(86780),w=s(50586),N=s(43682),b=s(49107),C=s(70150),S=s(11505),Z=s(95282),I=s(19048);let E=(0,d.memo)(e=>{let{folderCtrl:r}=(0,I.m)(e);return(0,c.jsx)(u.S2,{...r.field,...r.fieldState,required:!0,directory:!0})});E.displayName="UpdateWebsiteFolder";var P=s(34517),k=s(76696),q=s(93788);function WebsiteVolume(e){let{version:r,volume:s,onClick:l}=e,d="https://".concat((0,b.wB)(s.item_hash),".ipfs.aleph.sh"),m=(0,u.vx)(d);return(0,c.jsxs)(T,{children:[(0,c.jsx)(C.Z0,{}),(0,c.jsxs)(V,{children:[(0,c.jsxs)("div",{children:[(0,c.jsx)("div",{className:"tp-info text-main0",children:"Version ".concat(r)}),(0,c.jsx)(p(),{className:"tp-body1 fs-16",href:"/storage/volume/".concat(s.id),children:(0,c.jsx)(k.Z,{iconName:"square-up-right",children:"Volume details"})})]}),(0,c.jsxs)("div",{children:[(0,c.jsx)("div",{className:"tp-info text-main0",children:"CREATED ON"}),(0,c.jsx)("div",{children:(0,c.jsx)(C.xv,{className:"fs-10 tp-body1",children:s.date})})]}),(0,c.jsx)("div",{}),(0,c.jsx)("div",{}),(0,c.jsx)(u.zx,{kind:"functional",variant:"warning",size:"md",onClick:l,children:"Redeploy"})]}),(0,c.jsx)("div",{className:"tp-info text-main0",children:"LEGACY GATEWAY"}),(0,c.jsxs)(F,{children:[(0,c.jsx)("a",{className:"tp-body1 fs-16",href:d,target:"_blank",referrerPolicy:"no-referrer",children:(0,c.jsx)(k.Z,{iconName:"square-up-right",children:(0,c.jsx)(C.xv,{children:d})})}),(0,c.jsx)(k.Z,{iconName:"copy",onClick:m})]})]})}function WebsiteENS(e){let{ens:r}=e,s="https://".concat(r,".limo"),l=(0,u.vx)(s);return(0,c.jsxs)(M,{children:[(0,c.jsx)("a",{className:"tp-body1 fs-16",href:s,target:"_blank",referrerPolicy:"no-referrer",children:(0,c.jsx)(k.Z,{iconName:"square-up-right",children:(0,c.jsx)(C.xv,{children:s})})}),(0,c.jsx)(k.Z,{iconName:"copy",onClick:l})]})}function ManageWebsite(){let{cidV1:e,defaultUrl:r,website:s,refVolume:m,historyVolumes:I,theme:W,state:T,handleDelete:V,handleUpdate:F,handleCopyCIDv0:M,handleCopyCIDv1:eh,handleCopyHash:eg,handleCopyIpfsUrl:ey,handleCopyUrl:ex,handleCopyVolumeHash:ev,handleBack:ej}=function(){var e;let[,r]=(0,y.mr)(),s=(0,h.useRouter)(),{hash:c}=s.query,{entities:m}=(0,v.p)({ids:c}),[p]=m||[],f=(0,x.S)(null==p?void 0:p.volume_id),C=(0,g.e)(),[S,Z]=(0,d.useState)(),{next:I,stop:E,noti:P}=(0,_.A)({}),k=(0,d.useCallback)(async()=>{if(!C)throw w.Z.ConnectYourWallet;if(!p)throw w.Z.WebsiteNotFound;let e=await C.getDelSteps(p),c=e.map(e=>_.n[e]),l=C.delSteps(p);try{for(;;){let{done:e}=await l.next();if(e)break;await I(c)}r(new j.gg({name:"website",keys:[p.id]})),await s.replace("/")}catch(c){console.error(c);let e=c.message,r=null==c?void 0:c.cause,s="string"==typeof r?r:null==r?void 0:r.message;null==P||P.add({variant:"error",title:"Error",text:e,detail:s})}finally{await E()}},[r,C,p,I,s,E,P]),q=(0,d.useCallback)(async(e,c)=>{if(!C)throw w.Z.ConnectYourWallet;if(!p)throw w.Z.WebsiteNotFound;let l=await C.getDomains(p),d=await C.getUpdateSteps(e,c,l),m=d.map(e=>_.n[e]),u=C.updateSteps(p,e,c,l,S);try{let e;for(;!e;){let{value:r,done:s}=await u.next();if(s){e=r;break}await I(m)}r(new j.Wy({name:"website",entities:e})),await s.replace("/")}catch(e){}finally{await E()}},[C,p,S,r,s,I,E]);(0,d.useEffect)(()=>{C&&p&&(null==C||C.getHistoryVolumes(p).then(Z))},[C,p]);let D=(null==f?void 0:f.item_hash)&&(0,b.wB)(f.item_hash),A="https://".concat(D,".ipfs.aleph.sh"),W=(0,u.vx)((null==p?void 0:p.id)||""),T=(0,u.vx)(A),V=(0,u.vx)("ipfs://".concat(D)||0),F=(0,u.vx)((null==f?void 0:f.id)||""),M=(0,u.vx)((null==f?void 0:f.item_hash)||""),B=(0,u.vx)(null!=D?D:""),O=(0,N.c)(),R=(0,l.Fg)(),U=null===(e=O.values.website)||void 0===e?void 0:e.cid;return(0,d.useEffect)(()=>{U&&q(U)},[U]),{website:p,refVolume:f,historyVolumes:S,cidV1:D,defaultUrl:A,theme:R,state:O,handleDelete:k,handleUpdate:q,handleCopyHash:W,handleCopyUrl:T,handleCopyIpfsUrl:V,handleCopyVolumeHash:F,handleCopyCIDv0:M,handleCopyCIDv1:B,handleBack:()=>{s.push(".")}}}();return s&&e?(0,c.jsxs)(c.Fragment,{children:[(0,c.jsx)(q.Z,{handleBack:ej}),(0,c.jsx)(O,{children:(0,c.jsxs)(C.W2,{children:[(0,c.jsxs)(R,{children:[(0,c.jsxs)(U,{children:[(0,c.jsx)(L,{name:"floppy-disk",className:"text-main0"}),(0,c.jsx)("div",{className:"tp-body2",children:s.metadata.name}),(0,c.jsx)(G,{kind:"secondary",variant:s.confirmed?"success":"warning",children:s.confirmed?"READY":(0,c.jsxs)(Y,{children:[(0,c.jsx)(z,{children:"CONFIRMING"}),(0,c.jsx)(S.s5,{strokeColor:W.color.base2,width:".8rem"})]})})]}),(0,c.jsx)(H,{children:(0,c.jsx)(u.zx,{kind:"functional",variant:"error",size:"md",onClick:V,children:(0,c.jsx)(u.JO,{name:"trash"})})})]}),(0,c.jsxs)(u.Jy,{children:[(0,c.jsxs)(J,{children:[(0,c.jsx)(X,{variant:"accent",children:f.K_[s.type]}),(0,c.jsxs)(K,{children:[(0,c.jsx)("div",{className:"tp-info text-main0",children:"NAME"}),(0,c.jsx)(k.Z,{iconName:"copy",onClick:eg,children:s.id})]})]}),(0,c.jsx)(C.Z0,{}),(0,c.jsxs)($,{children:[(0,c.jsxs)("div",{children:[(0,c.jsx)("div",{className:"tp-info text-main0",children:"FRAMEWORK"}),(0,c.jsx)("div",{children:(0,c.jsx)(C.xv,{children:Z.by[s.metadata.framework].name})})]}),(0,c.jsxs)("div",{children:[(0,c.jsx)("div",{className:"tp-info text-main0",children:"VERSION"}),(0,c.jsx)("div",{children:(0,c.jsx)(C.xv,{children:s.version})})]}),(0,c.jsxs)("div",{children:[(0,c.jsx)("div",{className:"tp-info text-main0",children:"SIZE"}),(0,c.jsx)("div",{children:(0,c.jsx)(C.xv,{className:"fs-10 tp-body1",children:(0,b.eB)(null==m?void 0:m.size,"MiB")})})]}),(0,c.jsxs)("div",{children:[(0,c.jsx)("div",{className:"tp-info text-main0",children:"CREATED ON"}),(0,c.jsx)("div",{children:(0,c.jsx)(C.xv,{className:"fs-10 tp-body1",children:(0,b._3)(s.created_at)})})]}),(0,c.jsxs)("div",{children:[(0,c.jsx)("div",{className:"tp-info text-main0",children:"UPDATED ON"}),(0,c.jsx)("div",{children:(0,c.jsx)(C.xv,{className:"fs-10 tp-body1",children:s.updated_at})})]})]}),(0,c.jsxs)(Q,{children:[(0,c.jsx)("div",{className:"tp-info text-main0",children:"DEFAULT GATEWAY"}),(0,c.jsxs)(ee,{children:[(0,c.jsx)("a",{className:"tp-body1 fs-16",href:r,target:"_blank",referrerPolicy:"no-referrer",children:(0,c.jsx)(k.Z,{iconName:"square-up-right",children:(0,c.jsx)(C.xv,{children:r})})}),(0,c.jsx)(k.Z,{iconName:"copy",onClick:ex})]})]}),(0,c.jsxs)(et,{children:[(0,c.jsx)("a",{className:"tp-body1 fs-16",href:"https://ipfs.github.io/public-gateway-checker/",target:"_blank",referrerPolicy:"no-referrer",children:(0,c.jsx)(k.Z,{iconName:"square-up-right",children:(0,c.jsx)("div",{className:"tp-info text-main0",children:"ALTERNATIVE GATEWAYS"})})}),(0,c.jsxs)(ei,{children:["https://".concat(e,".ipfs."),(0,c.jsx)(en,{children:"<gateway-hostname>"})]})]}),(0,c.jsxs)(er,{children:[(0,c.jsx)("a",{className:"tp-body1 fs-16",href:"https://app.ens.domains/",target:"_blank",referrerPolicy:"no-referrer",children:(0,c.jsx)(k.Z,{iconName:"square-up-right",children:(0,c.jsx)("div",{className:"tp-info text-main0",children:"ENS GATEWAYS"})})}),s.ens&&s.ens.length>0?Array.from(s.ens).map((e,r)=>(0,c.jsx)(A,{ens:e},r)):(0,c.jsxs)(es,{children:[(0,c.jsx)(C.xv,{children:"Access your ENS and setup the content hash to this current version:"}),(0,c.jsx)(k.Z,{iconName:"copy",onClick:ey,children:(0,c.jsxs)(ea,{children:["ipfs://",e]})}),(0,c.jsxs)(eo,{children:["Then, your website will be accessible via:",(0,c.jsxs)(ec,{children:["https://",(0,c.jsx)(el,{children:"<your-ens-name>"}),".eth.limo"]})]})]})]}),(0,c.jsx)(C.Z0,{}),(0,c.jsx)(u.DU,{type:"h7",as:"h2",color:"main0",children:"Current Version"}),(0,c.jsxs)(ed,{children:[(0,c.jsx)("div",{className:"tp-info text-main0",children:"Version ".concat(s.version)}),(0,c.jsx)(p(),{className:"tp-body1 fs-16",href:"/storage/volume/".concat(null==m?void 0:m.id),children:(0,c.jsx)(k.Z,{iconName:"square-up-right",children:"Volume details"})})]}),(0,c.jsxs)(em,{children:[(0,c.jsx)("div",{className:"tp-info text-main0",children:"ITEM HASH"}),(0,c.jsx)(k.Z,{iconName:"copy",onClick:ev,children:null==m?void 0:m.id})]}),(0,c.jsx)("div",{className:"tp-info text-main0",children:"IPFS CID v0"}),(0,c.jsx)(ep,{children:(0,c.jsx)(k.Z,{iconName:"copy",onClick:M,children:null==m?void 0:m.item_hash})}),(0,c.jsx)("div",{className:"tp-info text-main0",children:"IPFS CID v1"}),(0,c.jsx)(eu,{children:(0,c.jsx)(k.Z,{iconName:"copy",onClick:eh,children:e})}),(0,c.jsx)(C.Z0,{}),(0,c.jsx)(u.DU,{type:"h7",as:"h2",color:"main0",children:"Previous Versions"}),I&&Object.keys(I).length>0?(0,c.jsx)(c.Fragment,{children:Object.entries(I).sort((e,r)=>{let[s]=e,[c]=r;return parseInt(c)-parseInt(s)}).map(e=>{let[r,s]=e;return(0,c.jsx)(D,{version:r,volume:s,onClick:()=>F(void 0,r)},"".concat(s.id,"-v").concat(r))})}):(0,c.jsx)(C.xv,{children:"No previous version"}),(0,c.jsx)(C.Z0,{}),(0,c.jsx)(u.DU,{type:"h7",as:"h2",color:"main0",children:"Update your website"}),(0,c.jsx)(E,{control:T.control})]}),(0,c.jsx)(ef,{children:(0,c.jsx)(P.Z,{variant:"primary",href:"/hosting/website/new",children:"Create new website"})})]})})]}):(0,c.jsxs)(c.Fragment,{children:[(0,c.jsx)(q.Z,{handleBack:ej}),(0,c.jsx)(C.W2,{children:(0,c.jsx)(B,{children:"Loading..."})})]})}WebsiteVolume.displayName="WebsiteVolume",WebsiteENS.displayName="WebsiteENS",ManageWebsite.displayName="ManageWebsite";let D=(0,d.memo)(WebsiteVolume),A=(0,d.memo)(WebsiteENS);var W=(0,d.memo)(ManageWebsite),T=(0,l.ZP)("div").withConfig({displayName:"cmp___StyledDiv",componentId:"sc-7pqfmg-0"})({marginTop:"1.25rem",marginBottom:"1.25rem"}),V=(0,l.ZP)("div").withConfig({displayName:"cmp___StyledDiv2",componentId:"sc-7pqfmg-1"})({marginTop:"1.25rem",marginBottom:"1.25rem",display:"flex",flexWrap:"wrap",justifyContent:"space-between",gap:"1rem"}),F=(0,l.ZP)("div").withConfig({displayName:"cmp___StyledDiv3",componentId:"sc-7pqfmg-2"})({marginBottom:"1.25rem",display:"flex",flexDirection:"row"}),M=(0,l.ZP)("div").withConfig({displayName:"cmp___StyledDiv4",componentId:"sc-7pqfmg-3"})({display:"flex",flexDirection:"row"}),B=(0,l.ZP)(u.Jy).withConfig({displayName:"cmp___StyledNoisyContainer",componentId:"sc-7pqfmg-4"})({marginTop:"1rem",marginBottom:"1rem"}),O=(0,l.ZP)("section").withConfig({displayName:"cmp___StyledSection",componentId:"sc-7pqfmg-5"})({paddingLeft:"0px",paddingRight:"0px",paddingBottom:"1.5rem",paddingTop:"5rem","@media (min-width: 48rem)":{paddingTop:"2.5rem",paddingBottom:"2.5rem"}}),R=(0,l.ZP)("div").withConfig({displayName:"cmp___StyledDiv5",componentId:"sc-7pqfmg-6"})({display:"flex",justifyContent:"space-between",paddingBottom:"1.25rem"}),U=(0,l.ZP)("div").withConfig({displayName:"cmp___StyledDiv6",componentId:"sc-7pqfmg-7"})({display:"flex",alignItems:"center"}),L=(0,l.ZP)(u.JO).withConfig({displayName:"cmp___StyledIcon",componentId:"sc-7pqfmg-8"})({marginRight:"1rem"}),G=(0,l.ZP)(u.__).withConfig({displayName:"cmp___StyledLabel",componentId:"sc-7pqfmg-9"})({marginLeft:"1rem"}),Y=(0,l.ZP)("div").withConfig({displayName:"cmp___StyledDiv7",componentId:"sc-7pqfmg-10"})({display:"flex",alignItems:"center"}),z=(0,l.ZP)("div").withConfig({displayName:"cmp___StyledDiv8",componentId:"sc-7pqfmg-11"})({marginRight:"0.5rem"}),H=(0,l.ZP)("div").withConfig({displayName:"cmp___StyledDiv9",componentId:"sc-7pqfmg-12"})({marginLeft:"0.5rem",display:"flex",flexWrap:"wrap",justifyContent:"flex-end",gap:"0.5rem","@media (min-width: 36rem)":{gap:"1rem"}}),J=(0,l.ZP)("div").withConfig({displayName:"cmp___StyledDiv10",componentId:"sc-7pqfmg-13"})({display:"flex",alignItems:"center",justifyContent:"flex-start",overflow:"hidden"}),X=(0,l.ZP)(u.Vp).withConfig({displayName:"cmp___StyledTag",componentId:"sc-7pqfmg-14"})({marginRight:"1rem",whiteSpace:"nowrap"}),K=(0,l.ZP)("div").withConfig({displayName:"cmp___StyledDiv11",componentId:"sc-7pqfmg-15"})({flex:"1 1 auto"}),$=(0,l.ZP)("div").withConfig({displayName:"cmp___StyledDiv12",componentId:"sc-7pqfmg-16"})({display:"flex",flexWrap:"wrap",justifyContent:"space-between",gap:"0.5rem"}),Q=(0,l.ZP)("div").withConfig({displayName:"cmp___StyledDiv13",componentId:"sc-7pqfmg-17"})({marginTop:"1.25rem",marginBottom:"1.25rem"}),ee=(0,l.ZP)("div").withConfig({displayName:"cmp___StyledDiv14",componentId:"sc-7pqfmg-18"})({display:"flex",flexDirection:"row"}),et=(0,l.ZP)("div").withConfig({displayName:"cmp___StyledDiv15",componentId:"sc-7pqfmg-19"})({marginBottom:"1.25rem"}),ei=(0,l.ZP)(C.xv).withConfig({displayName:"cmp___StyledText",componentId:"sc-7pqfmg-20"})({overflowWrap:"break-word"}),en=(0,l.ZP)(C.xv).withConfig({displayName:"cmp___StyledText2",componentId:"sc-7pqfmg-21"})({"--tw-text-opacity":"1",color:"rgb(168 85 247 / var(--tw-text-opacity))"}),er=(0,l.ZP)("div").withConfig({displayName:"cmp___StyledDiv16",componentId:"sc-7pqfmg-22"})({marginBottom:"1.25rem"}),es=(0,l.ZP)("div").withConfig({displayName:"cmp___StyledDiv17",componentId:"sc-7pqfmg-23"})({display:"flex",flexDirection:"column"}),ea=(0,l.ZP)("span").withConfig({displayName:"cmp___StyledSpan",componentId:"sc-7pqfmg-24"})({marginLeft:"0.5rem",fontStyle:"normal","--tw-text-opacity":"1",color:"rgb(126 34 206 / var(--tw-text-opacity))"}),eo=(0,l.ZP)(C.xv).withConfig({displayName:"cmp___StyledText3",componentId:"sc-7pqfmg-25"})({marginTop:"0.25rem"}),ec=(0,l.ZP)("span").withConfig({displayName:"cmp___StyledSpan2",componentId:"sc-7pqfmg-26"})({marginLeft:"0.5rem",fontStyle:"normal","--tw-text-opacity":"1",color:"rgb(126 34 206 / var(--tw-text-opacity))"}),el=(0,l.ZP)("span").withConfig({displayName:"cmp___StyledSpan3",componentId:"sc-7pqfmg-27"})({"--tw-text-opacity":"1",color:"rgb(168 85 247 / var(--tw-text-opacity))"}),ed=(0,l.ZP)("div").withConfig({displayName:"cmp___StyledDiv18",componentId:"sc-7pqfmg-28"})({marginTop:"1.25rem",marginBottom:"1.25rem"}),em=(0,l.ZP)("div").withConfig({displayName:"cmp___StyledDiv19",componentId:"sc-7pqfmg-29"})({marginBottom:"1.25rem"}),ep=(0,l.ZP)("div").withConfig({displayName:"cmp___StyledDiv20",componentId:"sc-7pqfmg-30"})({marginBottom:"1.25rem",display:"flex",flexDirection:"row"}),eu=(0,l.ZP)("div").withConfig({displayName:"cmp___StyledDiv21",componentId:"sc-7pqfmg-31"})({marginBottom:"1.25rem",display:"flex",flexDirection:"row"}),ef=(0,l.ZP)("div").withConfig({displayName:"cmp___StyledDiv22",componentId:"sc-7pqfmg-32"})({marginTop:"5rem",textAlign:"center"})},56312:function(e,r,s){"use strict";s.d(r,{F:function(){return zod_t}});var c=s(87536),t=function(e,r,s){if(e&&"reportValidity"in e){var l=(0,c.U2)(s,r);e.setCustomValidity(l&&l.message||""),e.reportValidity()}},resolvers_i=function(e,r){var i=function(s){var c=r.fields[s];c&&c.ref&&"reportValidity"in c.ref?t(c.ref,s,e):c.refs&&c.refs.forEach(function(r){return t(r,s,e)})};for(var s in r.fields)i(s)},n=function(e,r){r.shouldUseNativeValidation&&resolvers_i(e,r);var s={};for(var l in e){var d=(0,c.U2)(r.fields,l),m=Object.assign(e[l]||{},{ref:d&&d.ref});if(a(r.names||Object.keys(e),l)){var p=Object.assign({},o((0,c.U2)(s,l)));(0,c.t8)(p,"root",m),(0,c.t8)(s,l,p)}else(0,c.t8)(s,l,m)}return s},o=function(e){return Array.isArray(e)?e.filter(Boolean):[]},a=function(e,r){return e.some(function(e){return e.startsWith(r+".")})},zod_n=function(e,r){for(var s={};e.length;){var l=e[0],d=l.code,m=l.message,p=l.path.join(".");if(!s[p]){if("unionErrors"in l){var u=l.unionErrors[0].errors[0];s[p]={message:u.message,type:u.code}}else s[p]={message:m,type:d}}if("unionErrors"in l&&l.unionErrors.forEach(function(r){return r.errors.forEach(function(r){return e.push(r)})}),r){var f=s[p].types,h=f&&f[l.code];s[p]=(0,c.KN)(p,r,s,d,h?[].concat(h,l.message):l.message)}e.shift()}return s},zod_t=function(e,r,s){return void 0===s&&(s={}),function(c,l,d){try{return Promise.resolve(function(l,m){try{var p=Promise.resolve(e["sync"===s.mode?"parse":"parseAsync"](c,r)).then(function(e){return d.shouldUseNativeValidation&&resolvers_i({},d),{errors:{},values:s.raw?c:e}})}catch(e){return m(e)}return p&&p.then?p.then(void 0,m):p}(0,function(e){if(null!=e.errors)return{values:{},errors:n(zod_n(e.errors,!d.shouldUseNativeValidation&&"all"===d.criteriaMode),d)};throw e}))}catch(e){return Promise.reject(e)}}}}},function(e){e.O(0,[536,29,774,888,179],function(){return e(e.s=16249)}),_N_E=e.O()}]);