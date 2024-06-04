(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[574],{52684:function(e,r,s){(window.__NEXT_P=window.__NEXT_P||[]).push(["/configure/domain/new",function(){return s(99817)}])},34517:function(e,r,s){"use strict";s.d(r,{Z:function(){return f}});var l=s(85893),c=s(67294),d=s(41664),u=s.n(d),m=s(79632);let ButtonLink=e=>{let{href:r,variant:s="secondary",color:c="main0",kind:d="default",size:f="md",disabled:p,children:y,...g}=e,h=(0,l.jsx)(m.zx,{as:p?void 0:"a",variant:s,color:c,kind:d,size:f,disabled:p,...g,children:y});return p?h:(0,l.jsx)(u(),{href:r,passHref:!0,legacyBehavior:!0,children:h})};ButtonLink.displayName="ButtonLink";var f=(0,c.memo)(ButtonLink)},93963:function(e,r,s){"use strict";s.d(r,{Z:function(){return u}});var l=s(19521);let c={xl:90,lg:60.0625,md:44.6875},d=l.ZP.div.withConfig({displayName:"styles__StyledContainer",componentId:"sc-1bpjbi2-0"})(["",""],e=>{let{$variant:r="lg"}=e;return(0,l.iv)([""," max-width:","rem;"],{marginLeft:"auto",marginRight:"auto",width:"100%",paddingLeft:"1.5rem",paddingRight:"1.5rem","@media (min-width: 62rem)":{paddingLeft:"4rem",paddingRight:"4rem"}},c[r])});var u=d},49531:function(e,r,s){"use strict";s.d(r,{N:function(){return u}});var l=s(85893),c=s(67294),d=s(79632);let SectionTitle=e=>(0,l.jsx)(d.NP,{as:"h2",color:"main0",numberColor:"main0",...e});SectionTitle.displayName="SectionTitle";var u=(0,c.memo)(SectionTitle)},87699:function(e,r,s){"use strict";s.d(r,{Z:function(){return f}});var l=s(85893),c=s(19521),d=s(67294),u=s(79632);let m=(0,c.ZP)(u.zx).attrs(e=>({...e,forwardedAs:"a",kind:"default",variant:"textOnly",color:"main0",size:"md"})).withConfig({displayName:"styles__StyledExternalLinkButton",componentId:"sc-1fpmkx0-0"})([""]),ExternalLinkButton=e=>{let{children:r,href:s,...c}=e;return(0,l.jsx)(l.Fragment,{children:(0,l.jsxs)(p,{href:s,target:"_blank",...c,children:[r||s,(0,l.jsx)(u.JO,{name:"square-up-right"})]})})};ExternalLinkButton.displayName="ExternalLinkButton";var f=(0,d.memo)(ExternalLinkButton),p=(0,c.ZP)(m).withConfig({displayName:"cmp___StyledStyledExternalLinkButton",componentId:"sc-7jgrdd-0"})({display:"inline-flex",alignItems:"center",gap:"0.625rem"})},75650:function(e,r,s){"use strict";s.d(r,{l:function(){return cmp},Z:function(){return cmp}});var l=s(85893),c=s(19521);let d=c.ZP.form.withConfig({displayName:"styles__StyledForm",componentId:"sc-faebcb-0"})(["",""],{display:"flex",flex:"1 1 0%",flexDirection:"column"});var u=s(79632),m=s(93963),cmp=e=>{let{children:r,onSubmit:s,errors:c}=e;return(0,l.jsxs)(d,{onSubmit:s,noValidate:!0,children:[r,(null==c?void 0:c.root)&&(0,l.jsx)(m.Z,{children:Object.values(c.root).map(e=>(0,l.jsx)(f,{error:e},e+""))})]})},f=(0,c.ZP)(u.Xq).withConfig({displayName:"cmp___StyledFormError",componentId:"sc-tai6p3-0"})({wordBreak:"break-all"})},24959:function(e,r,s){"use strict";s.d(r,{c:function(){return useForm}});var l=s(79632),c=s(67294),d=s(87536),u=s(1604),m=s(50586);function useForm(e){let{onSubmit:r,onSuccess:s,onError:f,readyDeps:p=[],...y}=e,g=(0,d.cI)(y);(0,c.useEffect)(()=>{"object"==typeof y.defaultValues&&g.reset(y.defaultValues)},[...p]);let[h,v]=(0,c.useState)({data:void 0,error:void 0,loading:!1}),[x,{onLoad:w,onSuccess:b,onError:S}]=(0,l.g7)({flushData:!0,state:h,setState:v,onSuccess:s,onError:f}),_=(0,c.useCallback)(async e=>{try{w();let s=await r(e);b(s)}catch(r){let e=r instanceof u.jm?m.Z.ValidationError:(null==r?void 0:r.cause)||r;g.setError("root.serverError",{...e,message:null==e?void 0:e.message}),S(e)}},[g,S,w,r,b]),j=(0,c.useCallback)(async e=>{let r;if(console.log(e),!r){let s=function getFirstError(e){let[r]=Object.entries(e);if(!r)return;let[s,l]=r;if(Array.isArray(l)){let e=l[l.length-1];return getFirstError(e)}return[s,l]}(e);if(s){let[e,l]=s,c="string"==typeof l?l:(null==l?void 0:l.message)?": ".concat(l.message):(null==l?void 0:l.type)?': "'.concat(null==l?void 0:l.type,'" validation not satisfied'):"";r=m.Z.FieldError(e,c)}}r||(r=m.Z.ValidationError),S(r)},[S]),C=(0,c.useMemo)(()=>g.handleSubmit(_,j),[g,_,j]);return{...g,requestState:x,handleSubmit:C}}},80380:function(e,r,s){"use strict";s.d(r,{A:function(){return useDomainManager}});var l=s(55640);function useDomainManager(){let[e]=(0,l.mr)(),{domainManager:r}=e.manager;return r}},53424:function(e,r,s){"use strict";s.d(r,{Pg:function(){return u},Q1:function(){return useDomainItem},Qd:function(){return useAddDomains}});var l=s(9911),c=s(67294),d=s(87536);let u={name:"",ref:"",target:l.sY.IPFS};function useDomainItem(e){let{name:r="domains",index:s,control:l,defaultValue:u,onRemove:m}=e,f=(0,d.bc)({control:l,name:"".concat(r,".").concat(s,".name"),defaultValue:null==u?void 0:u.name}),p=(0,c.useCallback)(()=>{m(s)},[s,m]);return{nameCtrl:f,handleRemove:p}}function useAddDomains(e){let{name:r="domains",control:s,entityType:l}=e,m=(0,d.Dq)({control:s,name:r,shouldUnregister:!0}),{fields:f,remove:p,append:y}=m,g=(0,c.useCallback)(()=>{y({...u,target:l})},[y,l]);return{name:r,control:s,fields:f,handleAdd:g,handleRemove:p}}},86780:function(e,r,s){"use strict";s.d(r,{n:function(){return b},A:function(){return useCheckoutNotification}});var l=s(85893),c=s(19521),d=s(67294),u=s(79632);let m=(0,d.memo)(e=>{let{isActive:r,step:s,total:c,title:d,content:u}=e;return(0,l.jsxs)(p,{$_css:[!r&&{opacity:"0.3"}],children:[(0,l.jsxs)(y,{className:"tp-h7",children:[(0,l.jsxs)(g,{children:[d,r&&(0,l.jsx)(h,{name:"arrows-rotate",size:"0.8em"})]}),(0,l.jsxs)("div",{className:"tp-body2 fs-18",children:[s+1,"/",c]})]}),(0,l.jsx)("div",{className:"tp-body1",children:u})]})});var f=(0,d.memo)(e=>{let{steps:r,activeStep:s}=e;return(0,l.jsx)(v,{children:r.map((e,c)=>(0,l.jsx)(m,{step:c,total:r.length,isActive:c===s,...e},c))})}),p=(0,c.ZP)("div").withConfig({displayName:"cmp___StyledDiv",componentId:"sc-1ydaly9-0"})(["",""],e=>e.$_css),y=(0,c.ZP)("div").withConfig({displayName:"cmp___StyledDiv2",componentId:"sc-1ydaly9-1"})({marginBottom:"0.5rem",display:"flex",alignItems:"center",justifyContent:"space-between"}),g=(0,c.ZP)("div").withConfig({displayName:"cmp___StyledDiv3",componentId:"sc-1ydaly9-2"})({display:"flex",alignItems:"center",gap:"1rem"}),h=(0,c.ZP)(u.JO).withConfig({displayName:"cmp___StyledIcon",componentId:"sc-1ydaly9-3"})({"@keyframes spin":{to:{transform:"rotate(360deg)"}},animation:"spin 1s linear infinite"}),v=(0,c.ZP)("div").withConfig({displayName:"cmp___StyledDiv4",componentId:"sc-1ydaly9-4"})({display:"flex",flexDirection:"column",gap:"2rem"}),x=s(49107),w=s(50586);function useCheckoutNotification(e){let{steps:r}=e,s=(0,u.lm)(),c=(0,d.useRef)(0),m="CHECKOUT-NOTI",p=(0,d.useCallback)(async e=>{if(!s)throw w.Z.NotificationsNotReady;let d=e||r||[];s.del(m),await (0,x._v)(200),s.set(m,{id:m,timeout:0,variant:"warning",content:(0,l.jsx)(f,{activeStep:c.current,steps:d})}),c.current+=1},[s,r]),y=(0,d.useCallback)(async()=>{if(!s)throw w.Z.NotificationsNotReady;c.current=0,s.del(m),await (0,x._v)(2e3)},[s]);return{next:p,stop:y}}let b={stream:{title:"Sign PAYG Activation",content:"By signing this, you authorise the initiation of a token stream for billing, ensuring a seamless and efficient payment process aligning costs directly with your usage."},streamDel:{title:"Sign PAYG Cancellation",content:"By signing this, you confirm the cancellation of your stream."},volume:{title:"Sign Volume(s) Creation",content:"By signing this, you confirm the creation of new volume(s). This is required if you are creating/updating a website, or if you have set up additional storage volume(s) for your instance or function."},volumeDel:{title:"Sign Volume(s) Deletion",content:"By signing this, you confirm the deletion of your volume(s)."},volumeUp:{title:"Sign Volume(s) Update",content:"By signing this, you confirm the update of your volume(s)."},ssh:{title:"Sign SSH Key(s) Configuration",content:"By signing this, you confirm the SSH key(s) configuration, enabling encrypted communication with your instance. This is crucial for securing remote access."},sshDel:{title:"Sign SSH Key(s) Deletion",content:"By signing this, you confirm the deletion of your SSH Key(s)."},sshUp:{title:"Sign SSH Key(s) Update",content:"By signing this, you confirm the update of your SSH Key(s)."},instance:{title:"Sign Instance Creation",content:"By signing this, you confirm the creation of your new instance on Twentysix.cloud. This step finalises the setup options you've chosen, including resources, configurations, and any additional features."},instanceDel:{title:"Sign Instance Deletion",content:"By signing this, you confirm the deletion of your instance."},instanceUp:{title:"Sign Instance Update",content:"By signing this, you confirm the update of your instance."},program:{title:"Sign Function Creation",content:"By signing this, you confirm the creation of your new function on Twentysix.cloud. This step finalises the setup options you've chosen, including the codebase volume, resources, configurations, and any additional features."},programDel:{title:"Sign Function Deletion",content:"By signing this, you confirm the deletion of your function."},programUp:{title:"Sign Function Update",content:"By signing this, you confirm the update of your function."},domain:{title:"Sign Custom Domain(s) Creation",content:"By signing this, you confirm the custom domain(s) settings for your website, instance or function."},domainDel:{title:"Sign Custom Domain(s) Deletion",content:"By signing this, you confirm the deletion of your custom domain(s)."},domainUp:{title:"Sign Custom Domain(s) Update",content:"By signing this, you confirm the update of your custom domain(s)."},website:{title:"Sign Website Creation",content:"By signing this, you confirm the deployment of your new website on Twentysix.cloud."},websiteDel:{title:"Sign Website Deletion",content:"By signing this, you confirm the deletion of your website."},websiteUp:{title:"Sign Website Update",content:"By signing this, you confirm the update of your website."},indexer:{title:"Sign Indexer Creation",content:"By signing this, you confirm the creation of your new indexer on Twentysix.cloud."},indexerDel:{title:"Sign Indexer Deletion",content:"By signing this, you confirm the deletion of your indexer."},indexerUp:{title:"Sign Indexer Update",content:"By signing this, you confirm the update of your indexer."}}},99817:function(e,r,s){"use strict";s.r(r),s.d(r,{default:function(){return NewDomain}});var l=s(85893),c=s(19521),d=s(67294),u=s(79632),m=s(34517),f=s(93963),p=s(87699),y=s(75650),g=s(9911),h=s(11163),v=s(24959),x=s(80380),w=s(55640),b=s(11525),S=s(87536),_=s(56312),j=s(53424),C=s(86780),I=s(9324),N=s(50586);let k={...j.Pg};var P=s(49531);function NewDomain(){let{entities:e,nameCtrl:r,targetCtrl:s,refCtrl:c,errors:j,handleSubmit:O,setTarget:R,setRef:M}=function(){let e=(0,h.useRouter)(),[{instance:{entities:r},program:{entities:s},website:{entities:l}},c]=(0,w.mr)(),u=(0,x.A)(),{next:m,stop:f}=(0,C.A)({}),p=(0,d.useCallback)(async r=>{if(!u)throw N.Z.ConnectYourWallet;let s=await u.getAddSteps(r),l=s.map(e=>C.n[e]),d=u.addSteps(r);try{let r;for(;!r;){let{value:e,done:s}=await d.next();if(s){r=e[0];break}await m(l)}c(new I.Wy({name:"domain",entities:r})),await e.replace("/")}finally{await f()}},[c,u,m,e,f]),{control:y,handleSubmit:j,setValue:P,formState:{errors:B}}=(0,v.c)({defaultValues:k,onSubmit:p,resolver:(0,_.F)(b.Y.addSchema)}),D=(0,S.bc)({control:y,name:"name"}),Z=(0,S.bc)({control:y,name:"target",rules:{onChange(e){P("ref","")}}}),E=(0,S.bc)({control:y,name:"ref"}),T=Z.field.value,z=(0,d.useMemo)(()=>{if(!T)return[];if(T!==g.sY.IPFS){let e=T===g.sY.Instance?r:s;return(e||[]).map(e=>{let{id:r,metadata:s}=e;return{label:(null==s?void 0:s.name)||r,value:r,type:T}})}return(l||[]).map(e=>{let{id:r,volume_id:s}=e;return{label:r,value:s,type:T}})},[T,r,s,l]),Y=(0,d.useMemo)(()=>!!(null==r?void 0:r.length),[r]),A=(0,d.useMemo)(()=>!!(null==s?void 0:s.length),[s]),F=(0,d.useMemo)(()=>!!(null==l?void 0:l.length),[l]);return(0,d.useEffect)(()=>{T===g.sY.Instance&&Y?P("target",g.sY.Instance):T===g.sY.Program&&A?P("target",g.sY.Program):T===g.sY.IPFS&&P("target",g.sY.IPFS)},[T,A,Y,F,P]),{entities:z,nameCtrl:D,targetCtrl:Z,refCtrl:E,errors:B,handleSubmit:j,setTarget:e=>{P("target",e)},setRef:e=>{P("ref",e)}}}(),[q,H]=(0,d.useState)("website"),K=s.field.value==g.sY.Instance?"instance":"function";return(0,l.jsx)(l.Fragment,{children:(0,l.jsxs)(y.Z,{onSubmit:O,errors:j,children:[(0,l.jsx)(B,{children:(0,l.jsxs)(f.Z,{children:[(0,l.jsx)(P.N,{number:"1",children:"Custom domain"}),(0,l.jsx)(D,{children:"Assign a user-friendly domain to your website, instance or function to not only simplify access to your web3 application but also enhance its professional appearance. This is an effective way to elevate user experience, establish brand identity or streamline the navigation process within your application."}),(0,l.jsx)(u.Jy,{children:(0,l.jsx)(u.oi,{...r.field,...r.fieldState,required:!0,label:"Enter your desired custom domain in the field below",placeholder:"yourdomain.io"})}),(0,l.jsx)(Z,{children:(0,l.jsx)(p.Z,{href:"https://docs.aleph.im/computing/custom_domain/setup/",children:"Learn more"})})]})}),(0,l.jsx)(E,{children:(0,l.jsxs)(f.Z,{children:[(0,l.jsx)(P.N,{number:"2",children:"Select Resource"}),(0,l.jsx)(T,{children:"You'll need to specify the resource your custom domain will be associated with. This could either be a wesbite, an instance or a function, depending on what you want your custom domain to point to."}),(0,l.jsx)(z,{children:(0,l.jsx)(u.mQ,{align:"left",selected:q,onTabChange:e=>{M(""),H(e),["website","ipfs"].includes(e)?R(g.sY.IPFS):R(g.sY.Instance)},tabs:[{id:"website",name:"Website"},{id:"compute",name:"Compute"},{id:"ipfs",name:"IPFS"}]})}),(0,l.jsx)("div",{role:"tabpanel",children:"website"===q?(0,l.jsx)(Y,{children:e.length>0?(0,l.jsx)(u.Lt,{...c.field,...c.fieldState,required:!0,label:"Link your custom domain to a specific website",children:e.map(e=>{let{label:r,value:s}=e;return(0,l.jsx)(u.Qr,{value:s,children:r},s)})}):(0,l.jsxs)("div",{children:[(0,l.jsx)(A,{children:"If you want to link a domain to a website, you need to deploy one first *"}),(0,l.jsx)(m.Z,{type:"button",kind:"functional",size:"md",variant:"warning",href:"/hosting/website/new",children:"Create your first website"})]})}):"compute"===q?(0,l.jsxs)(F,{children:[(0,l.jsxs)(u.Ee,{...s.field,...s.fieldState,required:!0,label:"Choose resource type",direction:"row",children:[(0,l.jsx)(u.Y8,{label:g.Ni[g.sY.Instance],value:g.sY.Instance}),(0,l.jsx)(u.Y8,{label:g.Ni[g.sY.Program],value:g.sY.Program})]}),e.length>0?(0,l.jsx)(U,{children:(0,l.jsx)(u.Lt,{...c.field,...c.fieldState,required:!0,label:"Select the specific resource",children:e.map(e=>{let{label:r,value:s}=e;return(0,l.jsx)(u.Qr,{value:s,children:r},s)})})}):(0,l.jsxs)("div",{children:[(0,l.jsxs)(L,{children:["If you want to link a domain to a ",K,", you need to deploy one first *"]}),(0,l.jsx)(m.Z,{type:"button",kind:"functional",size:"md",variant:"warning",href:"/computing/".concat(K,"/new"),children:"Create your first ".concat(K)})]})]}):"ipfs"===q?(0,l.jsx)(u.Jy,{children:(0,l.jsx)(u.oi,{...c.field,...c.fieldState,required:!0,label:"Link your custom domain to an Aleph Message ID",placeholder:"Paste your IPFS Aleph Message ID"})}):(0,l.jsx)(l.Fragment,{})}),(0,l.jsx)(V,{children:(0,l.jsx)(u.zx,{type:"submit",color:"main0",kind:"default",size:"md",variant:"primary",children:"Create domain"})})]})})]})})}var B=(0,c.ZP)("section").withConfig({displayName:"cmp___StyledSection",componentId:"sc-1s90kzb-0"})({paddingLeft:"0px",paddingRight:"0px",paddingBottom:"1.5rem",paddingTop:"5rem","@media (min-width: 48rem)":{paddingTop:"2.5rem",paddingBottom:"2.5rem"}}),D=(0,c.ZP)("p").withConfig({displayName:"cmp___StyledP",componentId:"sc-1s90kzb-1"})({marginBottom:"1.5rem"}),Z=(0,c.ZP)("div").withConfig({displayName:"cmp___StyledDiv",componentId:"sc-1s90kzb-2"})({marginTop:"1.5rem",textAlign:"right"}),E=(0,c.ZP)("section").withConfig({displayName:"cmp___StyledSection2",componentId:"sc-1s90kzb-3"})({paddingLeft:"0px",paddingRight:"0px",paddingBottom:"1.5rem",paddingTop:"5rem","@media (min-width: 48rem)":{paddingTop:"2.5rem",paddingBottom:"2.5rem"}}),T=(0,c.ZP)("p").withConfig({displayName:"cmp___StyledP2",componentId:"sc-1s90kzb-4"})({marginBottom:"1.5rem"}),z=(0,c.ZP)("div").withConfig({displayName:"cmp___StyledDiv2",componentId:"sc-1s90kzb-5"})({marginTop:"2.5rem",marginBottom:"2.5rem"}),Y=(0,c.ZP)(u.Jy).withConfig({displayName:"cmp___StyledNoisyContainer",componentId:"sc-1s90kzb-6"})({zIndex:"10 !important"}),A=(0,c.ZP)("p").withConfig({displayName:"cmp___StyledP3",componentId:"sc-1s90kzb-7"})({marginBottom:"0.75rem",marginTop:"0.125rem","--tw-text-opacity":"1",color:"rgb(0 0 0 / var(--tw-text-opacity))"}),F=(0,c.ZP)(u.Jy).withConfig({displayName:"cmp___StyledNoisyContainer2",componentId:"sc-1s90kzb-8"})({zIndex:"10 !important"}),U=(0,c.ZP)("div").withConfig({displayName:"cmp___StyledDiv3",componentId:"sc-1s90kzb-9"})({marginTop:"2.5rem"}),L=(0,c.ZP)("p").withConfig({displayName:"cmp___StyledP4",componentId:"sc-1s90kzb-10"})({marginBottom:"0.75rem",marginTop:"1.5rem","--tw-text-opacity":"1",color:"rgb(0 0 0 / var(--tw-text-opacity))"}),V=(0,c.ZP)("div").withConfig({displayName:"cmp___StyledDiv4",componentId:"sc-1s90kzb-11"})({zIndex:"0",marginTop:"2.5rem",textAlign:"center"})},56312:function(e,r,s){"use strict";s.d(r,{F:function(){return zod_t}});var l=s(87536),t=function(e,r,s){if(e&&"reportValidity"in e){var c=(0,l.U2)(s,r);e.setCustomValidity(c&&c.message||""),e.reportValidity()}},resolvers_i=function(e,r){var i=function(s){var l=r.fields[s];l&&l.ref&&"reportValidity"in l.ref?t(l.ref,s,e):l.refs&&l.refs.forEach(function(r){return t(r,s,e)})};for(var s in r.fields)i(s)},n=function(e,r){r.shouldUseNativeValidation&&resolvers_i(e,r);var s={};for(var c in e){var d=(0,l.U2)(r.fields,c),u=Object.assign(e[c]||{},{ref:d&&d.ref});if(a(r.names||Object.keys(e),c)){var m=Object.assign({},o((0,l.U2)(s,c)));(0,l.t8)(m,"root",u),(0,l.t8)(s,c,m)}else(0,l.t8)(s,c,u)}return s},o=function(e){return Array.isArray(e)?e.filter(Boolean):[]},a=function(e,r){return e.some(function(e){return e.startsWith(r+".")})},zod_n=function(e,r){for(var s={};e.length;){var c=e[0],d=c.code,u=c.message,m=c.path.join(".");if(!s[m]){if("unionErrors"in c){var f=c.unionErrors[0].errors[0];s[m]={message:f.message,type:f.code}}else s[m]={message:u,type:d}}if("unionErrors"in c&&c.unionErrors.forEach(function(r){return r.errors.forEach(function(r){return e.push(r)})}),r){var p=s[m].types,y=p&&p[c.code];s[m]=(0,l.KN)(m,r,s,d,y?[].concat(y,c.message):c.message)}e.shift()}return s},zod_t=function(e,r,s){return void 0===s&&(s={}),function(l,c,d){try{return Promise.resolve(function(c,u){try{var m=Promise.resolve(e["sync"===s.mode?"parse":"parseAsync"](l,r)).then(function(e){return d.shouldUseNativeValidation&&resolvers_i({},d),{errors:{},values:s.raw?l:e}})}catch(e){return u(e)}return m&&m.then?m.then(void 0,u):m}(0,function(e){if(null!=e.errors)return{values:{},errors:n(zod_n(e.errors,!d.shouldUseNativeValidation&&"all"===d.criteriaMode),d)};throw e}))}catch(e){return Promise.reject(e)}}}}},function(e){e.O(0,[774,888,179],function(){return e(e.s=52684)}),_N_E=e.O()}]);