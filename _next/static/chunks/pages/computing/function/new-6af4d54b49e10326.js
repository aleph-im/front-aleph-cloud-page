(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[630],{53831:function(e,n,i){(window.__NEXT_P=window.__NEXT_P||[]).push(["/computing/function/new",function(){return i(59633)}])},87699:function(e,n,i){"use strict";i.d(n,{Z:function(){return s}});var t=i(85893),o=i(19521),a=i(67294),d=i(72771);let r=(0,o.ZP)(d.zx).attrs(e=>({...e,forwardedAs:"a",kind:"default",variant:"textOnly",color:"main0",size:"md"})).withConfig({displayName:"styles__StyledExternalLinkButton",componentId:"sc-1fpmkx0-0"})([""]),ExternalLinkButton=e=>{let{children:n,href:i,...o}=e;return(0,t.jsx)(t.Fragment,{children:(0,t.jsxs)(l,{href:i,target:"_blank",...o,children:[n||i,(0,t.jsx)(d.JO,{name:"square-up-right"})]})})};ExternalLinkButton.displayName="ExternalLinkButton";var s=(0,a.memo)(ExternalLinkButton),l=(0,o.ZP)(r).withConfig({displayName:"cmp___StyledStyledExternalLinkButton",componentId:"sc-7jgrdd-0"})({display:"inline-flex",alignItems:"center",gap:"0.625rem"})},33223:function(e,n,i){"use strict";i.d(n,{k:function(){return useProgramManager}});var t=i(51079);function useProgramManager(){let[e]=(0,t.mr)(),{programManager:n}=e;return n}},59633:function(e,n,i){"use strict";i.r(n),i.d(n,{default:function(){return NewFunctionPage}});var t=i(85893),o=i(19521),a=i(72771),d=i(9911),r=i(51079),s=i(67294),l=i(11163),m=i(70007),c=i(18090),p=i(24959),u=i(33223),g=i(90732),h=i(19643),f=i(87536),y=i(13017);let x='from fastapi import FastAPI\n\napp = FastAPI()\n@app.get("/")\nasync def root():\n  return {"message": "Hello World"}\n',_={lang:y.D.Python,type:"file",entrypoint:"main:app"};var j=i(56312),v=i(37419),w=i(86780);let b={...c.y,code:{..._},specs:{...(0,m.Fk)(!1)[0]},isPersistent:!1,paymentMethod:d.XL.Hold};var P=i(31626),k=i(78265),N=i(34865),C=i(4304),S=i(20782),Z=i(52464),B=i(93963),I=i(63715),T=i(39492),D=i(87699);let A=s.memo(e=>{let{langCtrl:n,typeCtrl:i,textCtrl:o,fileCtrl:d,entryPointCtrl:r,radioDirection:s}=function(e){let{name:n="code",control:i,defaultValue:t}=e,o=(0,f.bc)({control:i,name:"".concat(n,".lang"),defaultValue:null==t?void 0:t.lang}),d=(0,f.bc)({control:i,name:"".concat(n,".entrypoint"),defaultValue:null==t?void 0:t.entrypoint}),r=(0,f.bc)({control:i,name:"".concat(n,".type"),defaultValue:null==t?void 0:t.type}),s=(0,f.bc)({control:i,name:"".concat(n,".file"),defaultValue:null==t?void 0:t.file}),l=(0,f.bc)({control:i,name:"".concat(n,".text"),defaultValue:(null==t?void 0:t.text)||x}),m=(0,a._K)("sm");return{langCtrl:o,typeCtrl:r,fileCtrl:s,textCtrl:l,entryPointCtrl:d,radioDirection:m?"column":"row"}}(e);return(0,t.jsxs)(t.Fragment,{children:[(0,t.jsx)(L,{children:(0,t.jsx)(a.mQ,{selected:i.field.value,align:"left",tabs:[{id:"file",name:"Upload code"},{id:"text",name:"Write code"}],onTabChange:i.field.onChange})}),(0,t.jsxs)("div",{role:"tabpanel",children:["text"===i.field.value?(0,t.jsxs)(t.Fragment,{children:[(0,t.jsx)(E,{children:"To get started you can start adding your code in the window below."}),(0,t.jsx)(F,{children:(0,t.jsxs)(a.Jy,{children:[(0,t.jsxs)(q,{...n.field,...n.fieldState,required:!0,direction:s,children:[(0,t.jsx)(a.Y8,{label:"Python 3.9",value:y.D.Python}),(0,t.jsx)(a.Y8,{label:"Node.js 18",value:y.D.Node}),(0,t.jsx)(a.Y8,{label:"Other",value:y.D.Other})]}),(0,t.jsx)(R,{...o.field,...o.fieldState,required:!0,defaultValue:x,defaultLanguage:n.field.value,language:n.field.value})]})})]}):(0,t.jsxs)(t.Fragment,{children:[(0,t.jsx)(O,{children:"To get started, compress your code into a zip or squashfs (.sqsh) file and upload it here."}),(0,t.jsxs)(a.Jy,{children:[(0,t.jsx)(z,{children:(0,t.jsxs)(a.Ee,{...n.field,...n.fieldState,required:!0,label:"Language",direction:s,children:[(0,t.jsx)(a.Y8,{label:"Python 3.9",value:y.D.Python}),(0,t.jsx)(a.Y8,{label:"Node.js 18",value:y.D.Node}),(0,t.jsx)(a.Y8,{label:"Other",value:y.D.Other})]})}),(0,t.jsxs)(M,{children:[(0,t.jsx)(T.Z,{plain:!0,my:"top-left",at:"top-right",vAlign:"top",tooltipContent:(0,t.jsxs)("div",{className:"text-left tp-body1 fs-18",children:[(0,t.jsx)(U,{children:"The entry point is the name of the script or file used to invoke your function. It's essentially the 'doorway' to your code."}),(0,t.jsxs)("div",{children:[(0,t.jsx)("div",{children:"Examples:"}),(0,t.jsxs)(V,{children:[(0,t.jsxs)("li",{children:[(0,t.jsx)("strong",{children:"Python:"})," If you have a function named 'app' in a file called 'main.py', your entry point would be main:app"]}),(0,t.jsxs)("li",{children:[(0,t.jsx)("strong",{children:"Node.js:"})," If your primary file is 'index.js', then your entry point is simply index.js"]})]})]}),(0,t.jsx)(Y,{children:"Different languages and frameworks may have unique conventions. Always refer to your language's documentation or the specific framework's guidance to determine the appropriate entry point for your code."})]}),children:(0,t.jsx)(a.lX,{label:"Define an entry point",required:!0})}),(0,t.jsx)(a.oi,{...r.field,...r.fieldState,required:!0,placeholder:"main:app, index.js, ..."})]}),(0,t.jsx)("div",{children:(0,t.jsxs)(I.Z,{...d.field,...d.fieldState,required:!0,label:"Upload your code",accept:".zip,.sqsh",children:["Upload code ",(0,t.jsx)(J,{name:"arrow-up"})]})})]})]}),(0,t.jsx)(X,{children:(0,t.jsx)(D.Z,{href:"https://docs.aleph.im/tools/webconsole/",children:"Learn more"})})]})]})});A.displayName="AddFunctionCode";var L=(0,o.ZP)("div").withConfig({displayName:"cmp___StyledDiv",componentId:"sc-1lgkru6-0"})({paddingLeft:"0px",paddingRight:"0px",paddingBottom:"0.75rem",paddingTop:"1.5rem"}),E=(0,o.ZP)("p").withConfig({displayName:"cmp___StyledP",componentId:"sc-1lgkru6-1"})({marginBottom:"1.5rem"}),F=(0,o.ZP)("div").withConfig({displayName:"cmp___StyledDiv2",componentId:"sc-1lgkru6-2"})({marginBottom:"1.5rem"}),q=(0,o.ZP)(a.Ee).withConfig({displayName:"cmp___StyledRadioGroup",componentId:"sc-1lgkru6-3"})({marginBottom:"1.5rem"}),R=(0,o.ZP)(a.pq).withConfig({displayName:"cmp___StyledCodeEditor",componentId:"sc-1lgkru6-4"})({minHeight:"415px",borderRadius:"1.5rem",padding:"1.25rem"}),O=(0,o.ZP)("p").withConfig({displayName:"cmp___StyledP2",componentId:"sc-1lgkru6-5"})({marginBottom:"1.5rem"}),z=(0,o.ZP)("div").withConfig({displayName:"cmp___StyledDiv3",componentId:"sc-1lgkru6-6"})({marginBottom:"2.5rem"}),M=(0,o.ZP)("div").withConfig({displayName:"cmp___StyledDiv4",componentId:"sc-1lgkru6-7"})({marginBottom:"2.5rem"}),U=(0,o.ZP)("div").withConfig({displayName:"cmp___StyledDiv5",componentId:"sc-1lgkru6-8"})({marginBottom:"2.5rem"}),V=(0,o.ZP)("ul").withConfig({displayName:"cmp___StyledUl",componentId:"sc-1lgkru6-9"})({listStyleType:"disc",paddingLeft:"1.5rem"}),Y=(0,o.ZP)("div").withConfig({displayName:"cmp___StyledDiv6",componentId:"sc-1lgkru6-10"})({marginTop:"2.5rem"}),J=(0,o.ZP)(a.JO).withConfig({displayName:"cmp___StyledIcon",componentId:"sc-1lgkru6-11"})({marginLeft:"1rem"}),X=(0,o.ZP)("div").withConfig({displayName:"cmp___StyledDiv7",componentId:"sc-1lgkru6-12"})({marginTop:"1.5rem",textAlign:"right"});let G=s.memo(e=>{let{isPersistentValue:n,isPersistentHandleChange:i,isPersistentCtrl:o}=function(e){let{name:n="isPersistent",control:i,defaultValue:t}=e,o=(0,f.bc)({control:i,name:n,defaultValue:t}),a=(0,s.useCallback)(e=>{let n="true"===e.target.value;o.field.onChange(n)},[o.field]),d=(0,s.useMemo)(()=>o.field.value+"",[o.field]);return{isPersistentCtrl:o,isPersistentValue:d,isPersistentHandleChange:a}}(e);return(0,t.jsxs)(t.Fragment,{children:[(0,t.jsx)(a.Jy,{children:(0,t.jsxs)(a.Ee,{...o.field,...o.fieldState,value:n,onChange:i,required:!0,direction:"row",children:[(0,t.jsx)(a.Y8,{label:"Persistent",value:"true"}),(0,t.jsx)(a.Y8,{label:"On-demand",value:"false"})]})}),(0,t.jsx)(H,{children:(0,t.jsx)(D.Z,{href:"https://docs.aleph.im/computing/#persistent-execution",children:"Learn more"})})]})});G.displayName="SelectFunctionPersistence";var H=(0,o.ZP)("div").withConfig({displayName:"cmp___StyledDiv",componentId:"sc-1tb2omg-0"})({marginTop:"1.5rem",textAlign:"right"});let W=o.ZP.div.withConfig({displayName:"styles__BorderBox",componentId:"sc-cvbs9z-0"})(["",""],e=>{var n;let{theme:i,$color:t="main0"}=e,[a,d]=(null===(n=i.gradient[t])||void 0===n?void 0:n.colors)||[t,t];return(0,o.iv)([""," border-radius:1.5rem;backdrop-filter:blur(50px);color:","b3;&::before{content:'';position:absolute;top:0;left:0;height:100%;width:100%;border-radius:1.5rem;z-index:-1;padding:1px;-webkit-mask:linear-gradient(#fff 0 0) content-box,linear-gradient(#fff 0 0);mask:linear-gradient(#fff 0 0) content-box,linear-gradient(#fff 0 0);-webkit-mask-composite:exclude;mask-composite:exclude;-webkit-mask-composite:xor;background-image:linear-gradient(90deg,"," 0%,"," 100%);}"],{padding:"1.5rem"},i.color.text,a,d)});var K=i(69060),Q=i(75650),$=i(12155);let ee=s.memo(e=>{let{runtimeCtrl:n}=function(e){let{name:n="runtime",control:i,defaultValue:t}=e,o=(0,f.bc)({control:i,name:n,defaultValue:t,shouldUnregister:!0});return{runtimeCtrl:o}}(e);return(0,t.jsx)(t.Fragment,{children:(0,t.jsxs)(en,{className:"bg-base1",children:[(0,t.jsx)(a.oi,{...n.field,...n.fieldState,label:"Runtime hash",placeholder:"f6872f58fd38cbc123e9e036861a858...079ff2c123e9e08c123e9e0368fa68e"}),(0,t.jsx)(ei,{children:(0,t.jsx)(D.Z,{href:"https://docs.aleph.im/computing/runtimes",children:"Learn more"})})]})})});ee.displayName="SelectCustomFunctionRuntime";var en=(0,o.ZP)("div").withConfig({displayName:"cmp___StyledDiv",componentId:"sc-ivefrj-0"})({padding:"1.5rem"}),ei=(0,o.ZP)("div").withConfig({displayName:"cmp___StyledDiv2",componentId:"sc-ivefrj-1"})({marginTop:"1.5rem",textAlign:"right"}),et=i(82690),eo=i(49531);function NewFunctionPage(e){let{mainRef:n}=e,{address:i,accountBalance:o,isCreateButtonDisabled:m,values:c,control:y,errors:x,handleSubmit:_}=function(){let e=(0,l.useRouter)(),[n,i]=(0,r.mr)(),{account:t,accountBalance:o}=n,a=(0,u.k)(),{next:m,stop:c}=(0,w.A)({}),y=(0,s.useCallback)(async n=>{if(!a)throw Error("Manager not ready");let t=await a.getSteps(n),o=t.map(e=>w.n[e]),d=a.addSteps(n);try{let n;for(;!n;){let{value:e,done:i}=await d.next();if(i){n=e;break}await m(o)}i({type:g.MF.addAccountFunction,payload:{accountFunction:n}}),await e.replace("/")}finally{await c()}},[i,a,m,e,c]),{control:x,handleSubmit:_,formState:{errors:P}}=(0,p.c)({defaultValues:b,onSubmit:y,resolver:(0,j.F)(h.L.addSchema)}),k=(0,f.qo)({control:x}),{cost:N}=(0,v.F)({entityType:d.py.Program,props:{specs:k.specs,isPersistent:k.isPersistent,volumes:k.volumes}}),C=(o||0)>((null==N?void 0:N.totalCost)||Number.MAX_SAFE_INTEGER);return{address:(null==t?void 0:t.address)||"",accountBalance:o||0,isCreateButtonDisabled:!C,values:k,control:x,errors:P,handleSubmit:_}}();return(0,t.jsxs)(Q.Z,{onSubmit:_,errors:x,children:[(0,t.jsx)(ea,{children:(0,t.jsx)(B.Z,{children:(0,t.jsx)(et.Z,{selected:"function"})})}),(0,t.jsx)(ed,{children:(0,t.jsxs)(B.Z,{children:[(0,t.jsx)(eo.N,{number:"1",children:"Code to execute"}),(0,t.jsx)("p",{children:"If your code has any dependencies, you can upload them separately in the volume section below to ensure a faster creation."}),(0,t.jsx)(A,{name:"code",control:y})]})}),(0,t.jsx)(er,{children:(0,t.jsxs)(B.Z,{children:[(0,t.jsx)(eo.N,{number:"2",children:"Type of scheduling"}),(0,t.jsx)(es,{children:"Configure if this program should be running continuously, persistent, or only on-demand in response to a user request or an event."}),(0,t.jsx)(G,{name:"isPersistent",control:y})]})}),(0,t.jsx)(el,{children:(0,t.jsxs)(B.Z,{children:[(0,t.jsx)(eo.N,{number:"3",children:"Select an instance size"}),(0,t.jsx)(em,{children:"Select the hardware resources allocated to your functions, ensuring optimal performance and efficient resource usage tailored to your specific needs."}),(0,t.jsx)(k.Z,{name:"specs",control:y,type:d.py.Program,isPersistent:c.isPersistent})]})}),(0,t.jsx)(ec,{children:(0,t.jsxs)(B.Z,{children:[(0,t.jsx)(eo.N,{number:"4",children:"Name and tags"}),(0,t.jsx)(ep,{children:"Organize and identify your functions more effectively by assigning a unique name, obtaining a hash reference, and defining multiple tags. This helps streamline your development process and makes it easier to manage your web3 functions."}),(0,t.jsx)(Z.Z,{control:y,entityType:d.py.Program})]})}),(0,t.jsx)(eu,{children:(0,t.jsxs)(B.Z,{children:[(0,t.jsx)(eo.N,{number:"5",children:"Advanced Configuration Options"}),(0,t.jsx)(eg,{children:"Customize your function with our Advanced Configuration Options. Add volumes, environment variables, and custom domains to meet your specific needs."}),(0,t.jsxs)(eh,{children:[(0,t.jsx)(ef,{children:(0,t.jsx)($.Z,{label:"Use Custom Runtime",children:(0,t.jsx)(ee,{name:"runtime",control:y})})}),(0,t.jsx)(ey,{children:(0,t.jsxs)($.Z,{label:"Add Volume",children:[(0,t.jsx)(a.DU,{forwardedAs:"h2",type:"h6",color:"main0",children:"Add volumes"}),c.specs&&(0,t.jsxs)(ex,{$color:"main2",className:"tp-body1",children:["Good news! Your selected package already includes"," ",(0,t.jsx)("span",{className:"text-main0",children:(0,K.Fx)(c.specs.storage,{from:"MiB",to:"GiB",displayUnit:!0})})," ","of storage at no additional cost. Feel free to add it here."]}),(0,t.jsx)(N.Z,{name:"volumes",control:y})]})}),(0,t.jsx)(e_,{children:(0,t.jsxs)($.Z,{label:"Add Environmental Variables",children:[(0,t.jsx)(a.DU,{forwardedAs:"h2",type:"h6",color:"main0",children:"Add environment variables"}),(0,t.jsx)(ej,{children:"Define key-value pairs that act as configuration settings for your web3 function. Environment variables offer a convenient way to store information, manage configurations, and modify your application's behaviour without altering the source code."}),(0,t.jsx)(C.Z,{name:"envVars",control:y})]})}),(0,t.jsx)(ev,{children:(0,t.jsxs)($.Z,{label:"Add Custom Domain",children:[(0,t.jsx)(a.DU,{forwardedAs:"h2",type:"h6",color:"main0",children:"Custom domain"}),(0,t.jsx)(ew,{children:"Configure a user-friendly domain name for your web3 function, providing a more accessible and professional way for users to interact with your application."}),(0,t.jsx)(S.Z,{name:"domains",control:y,entityType:d.py.Program})]})})]})]})}),(0,t.jsx)(P.Z,{control:y,address:i,type:d.py.Program,isPersistent:c.isPersistent,specs:c.specs,volumes:c.volumes,domains:c.domains,unlockedAmount:o,paymentMethod:c.paymentMethod,mainRef:n,description:(0,t.jsx)(t.Fragment,{children:"This amount needs to be present in your wallet until the function is removed. Tokens won't be locked nor consumed. The function will be garbage collected once funds are removed from the wallet."}),button:(0,t.jsx)(a.zx,{type:"submit",color:"main0",kind:"default",size:"lg",variant:"primary",disabled:m,onClick:_,children:"Create function"})})]})}var ea=(0,o.ZP)("section").withConfig({displayName:"cmp___StyledSection",componentId:"sc-5neuko-0"})({paddingLeft:"0px",paddingRight:"0px",paddingTop:"0px",paddingBottom:"0px","@media (min-width: 48rem)":{paddingTop:"2rem",paddingBottom:"2rem"}}),ed=(0,o.ZP)("section").withConfig({displayName:"cmp___StyledSection2",componentId:"sc-5neuko-1"})({paddingLeft:"0px",paddingRight:"0px",paddingBottom:"1.5rem",paddingTop:"5rem","@media (min-width: 48rem)":{paddingTop:"2.5rem",paddingBottom:"2.5rem"}}),er=(0,o.ZP)("section").withConfig({displayName:"cmp___StyledSection3",componentId:"sc-5neuko-2"})({paddingLeft:"0px",paddingRight:"0px",paddingTop:"1.5rem",paddingBottom:"1.5rem","@media (min-width: 48rem)":{paddingTop:"2.5rem",paddingBottom:"2.5rem"}}),es=(0,o.ZP)("p").withConfig({displayName:"cmp___StyledP",componentId:"sc-5neuko-3"})({marginBottom:"1.5rem"}),el=(0,o.ZP)("section").withConfig({displayName:"cmp___StyledSection4",componentId:"sc-5neuko-4"})({paddingLeft:"0px",paddingRight:"0px",paddingTop:"1.5rem",paddingBottom:"1.5rem","@media (min-width: 48rem)":{paddingTop:"2.5rem",paddingBottom:"2.5rem"}}),em=(0,o.ZP)("p").withConfig({displayName:"cmp___StyledP2",componentId:"sc-5neuko-5"})({marginBottom:"1.5rem"}),ec=(0,o.ZP)("section").withConfig({displayName:"cmp___StyledSection5",componentId:"sc-5neuko-6"})({paddingLeft:"0px",paddingRight:"0px",paddingTop:"1.5rem",paddingBottom:"1.5rem","@media (min-width: 48rem)":{paddingTop:"2.5rem",paddingBottom:"2.5rem"}}),ep=(0,o.ZP)("p").withConfig({displayName:"cmp___StyledP3",componentId:"sc-5neuko-7"})({marginBottom:"1.5rem"}),eu=(0,o.ZP)("section").withConfig({displayName:"cmp___StyledSection6",componentId:"sc-5neuko-8"})({paddingLeft:"0px",paddingRight:"0px",paddingBottom:"1.5rem",paddingTop:"5rem","@media (min-width: 48rem)":{paddingTop:"2.5rem",paddingBottom:"2.5rem"}}),eg=(0,o.ZP)("p").withConfig({displayName:"cmp___StyledP4",componentId:"sc-5neuko-9"})({marginBottom:"1.5rem"}),eh=(0,o.ZP)("div").withConfig({displayName:"cmp___StyledDiv",componentId:"sc-5neuko-10"})({marginTop:"1.5rem",marginBottom:"1.5rem",paddingLeft:"0px",paddingRight:"0px"}),ef=(0,o.ZP)("div").withConfig({displayName:"cmp___StyledDiv2",componentId:"sc-5neuko-11"})({marginBottom:"1rem"}),ey=(0,o.ZP)("div").withConfig({displayName:"cmp___StyledDiv3",componentId:"sc-5neuko-12"})({marginBottom:"1rem"}),ex=(0,o.ZP)(W).withConfig({displayName:"cmp___StyledBorderBox",componentId:"sc-5neuko-13"})({marginTop:"1rem",marginBottom:"1rem"}),e_=(0,o.ZP)("div").withConfig({displayName:"cmp___StyledDiv4",componentId:"sc-5neuko-14"})({marginBottom:"1rem"}),ej=(0,o.ZP)("p").withConfig({displayName:"cmp___StyledP5",componentId:"sc-5neuko-15"})({marginBottom:"1.5rem"}),ev=(0,o.ZP)("div").withConfig({displayName:"cmp___StyledDiv5",componentId:"sc-5neuko-16"})({marginBottom:"1rem"}),ew=(0,o.ZP)("p").withConfig({displayName:"cmp___StyledP6",componentId:"sc-5neuko-17"})({marginBottom:"1.5rem"})}},function(e){e.O(0,[834,122,774,888,179],function(){return e(e.s=53831)}),_N_E=e.O()}]);