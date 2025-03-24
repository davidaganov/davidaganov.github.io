import{d as $,c as i,n as C,u as g,b as f,f as F,w as I,o as n,a,t as h,g as j,r as k,h as q,i as M,F as b,j as w,_ as H,k as P,v as E,l as K,e as S,T as z,m as G,p as R,q as V}from"./index-DYMRWBS0.js";import{_ as y}from"./_plugin-vue_export-helper-DlAUqK2U.js";import{B as O}from"./BaseDownloadCV-BYWyB0za.js";import{U as J}from"./UIButton-CTc4wMsC.js";import"./locales-D0L5SxwK.js";const N="/davidaganov.github.io/images/avatar.png";var L=(l=>(l.LTR="ltr",l.RTL="rtl",l))(L||{});const Q=$({__name:"UITitle",props:{title:{},className:{default:""},link:{},direction:{default:L.LTR}},setup(l){const t=l,s=async()=>{try{await navigator.clipboard.writeText(window.location.href)}catch(e){console.error("Failed to copy: ",e)}};return(e,u)=>(n(),i("div",{class:C(["title",t.className,{rtl:t.direction===g(L).RTL,ltr:t.direction===g(L).LTR}]),onClick:s},[f(g(F),{class:"link",to:t.link},{default:I(()=>[a("h2",null,h(t.title),1)]),_:1},8,["to"])],2))}}),B=y(Q,[["__scopeId","data-v-bfad5e77"]]),W={class:"about",id:"about"},X={class:"container"},Y={class:"content"},Z={class:"left"},ee=["innerHTML"],te={class:"btn-wrapper"},se=$({__name:"PageHomeAbout",setup(l){return(t,s)=>(n(),i("section",W,[a("div",X,[f(B,{link:"#about",title:t.$t("about.title")},null,8,["title"]),a("div",Y,[a("div",Z,[s[0]||(s[0]=a("img",{class:"picture",src:N,alt:"My avatar",width:"350",height:"350"},null,-1)),a("p",{innerHTML:t.$t("about.description")},null,8,ee),a("div",te,[f(O,{class:"btn"})])]),s[1]||(s[1]=a("div",{class:"right"},[a("img",{class:"picture",src:N,alt:"My avatar",width:"350",height:"350"})],-1))])])]))}}),oe=y(se,[["__scopeId","data-v-5b61c205"]]),ae=(l,t,s)=>{const e=l[t];return e?typeof e=="function"?e():Promise.resolve(e):new Promise((u,p)=>{(typeof queueMicrotask=="function"?queueMicrotask:setTimeout)(p.bind(null,new Error("Unknown variable dynamic import: "+t+(t.split("/").length!==s?". Note that variables only represent file names one level deep.":""))))})},ne={class:"skills",id:"skills"},re={class:"container"},ie={key:0,class:"accordion"},le=["onClick","onKeydown","id","aria-expanded"],ce=["id"],de={class:"list"},ue={class:"title"},_e={class:"listNested"},pe={key:1,class:"empty"},he=$({__name:"PageHomeSkills",setup(l){const{t,locale:s}=j(),e=k([]),u=k([]),p=async()=>{try{const o=await ae(Object.assign({"../locales/en.json":()=>H(()=>import("./locales-D0L5SxwK.js").then(r=>r.a),[]),"../locales/ru.json":()=>H(()=>import("./locales-D0L5SxwK.js").then(r=>r.b),[])}),`../locales/${s.value}.json`,3);u.value=o.default.skills.data}catch(o){console.error(`Failed to load locale data for ${s.value}:`,o),u.value=[]}},c=o=>{e.value.includes(o)?e.value=e.value.filter(r=>r!==o):e.value.push(o)},_=o=>{switch(o){case"HTML":return"mdi-language-html5";case"CSS":return"mdi-language-css3";case"JavaScript":return"mdi-language-javascript";default:return"mdi-dots-horizontal-circle"}};return q(s,()=>{p()}),M(()=>{p()}),(o,r)=>(n(),i("section",ne,[a("div",re,[f(B,{link:"#skills",title:g(t)("skills.title"),direction:g(L).RTL},null,8,["title","direction"]),u.value.length?(n(),i("div",ie,[(n(!0),i(b,null,w(u.value,d=>{var m;return P((n(),i("div",{key:d.id,class:"item"},[a("span",{onClick:v=>c(String(d.id)),onKeydown:K(v=>c(String(d.id)),["enter"]),tabindex:"0",id:`trigger-${d.id}`,role:"button",class:C({"is-open":e.value.includes(String(d.id))}),"aria-expanded":e.value.includes(String(d.id))},[a("h3",null,[S(h(d.title)+" ",1),a("i",{class:C(["mdi",_(d.title)])},null,2)])],42,le),f(z,{name:"collapse",duration:350},{default:I(()=>[P(a("div",{id:`content-${d.id}`},[a("ul",de,[(n(!0),i(b,null,w(d.list,v=>(n(),i("li",{key:v.id,class:"content"},[a("p",ue,h(v.title),1),a("ul",_e,[(n(!0),i(b,null,w(v.tags,T=>(n(),i("li",{key:T,class:"listNestedItem"},h(T),1))),128))])]))),128))])],8,ce),[[E,e.value.includes(String(d.id))]])]),_:2},1024)])),[[E,((m=d.list)==null?void 0:m.length)>0]])}),128))])):(n(),i("p",pe," Not found "))])]))}}),me=y(he,[["__scopeId","data-v-b5ba1d03"]]);function ve(){const l=k(!1),t=k(null);return{loading:l,request:async(u,p="GET",c=null,_={"Content-Type":"application/json"})=>{l.value=!0;try{const o=await fetch(u,{method:p,body:c,headers:_});if(!o.ok)throw new Error(`Could not fetch ${u}, status: ${o.status}`);const r=await o.json();return l.value=!1,r}catch(o){throw l.value=!1,t.value=o.message,o}},error:t,clearError:()=>t.value=null}}function fe(){const{loading:l,request:t,error:s,clearError:e}=ve(),u="https://api.github.com/users/davidaganov",p=async({topics:_,ignoreTopics:o})=>{const r=await t(`${u}/repos`);return c({items:r,topics:_,ignoreTopics:o})},c=({items:_,topics:o,ignoreTopics:r})=>{let d=_.map(m=>{const{id:v,name:T,description:D,html_url:U,topics:A,homepage:x}=m;return{id:v,name:T,description:D,html_url:U,topics:A,homepage:x}}).filter(m=>m.name!=="davidaganov.github.io").filter(m=>m.description);return o&&o.length>0&&(d=d.filter(m=>m.topics.some(v=>o.includes(v)))),r&&r.length>0&&(d=d.filter(m=>!m.topics.some(v=>r.includes(v)))),d};return{loading:l,error:s,clearError:e,getRepos:p}}const ge={class:"card"},ke={class:"title",lang:"en"},$e={class:"description",lang:"en"},be={class:"bottom"},we=["href"],ye={lang:"en",class:"sr-only"},Le=["href","aria-label"],Re={lang:"en",class:"sr-only"},Te={class:"tags"},Ce=$({__name:"BaseCardRepo",props:{card:{},class:{}},setup(l){const t=l,s=G(()=>t.card.name.replace(/[.\-/\\\s]/g," "));return(e,u)=>(n(),i("li",ge,[a("h3",ke,h(s.value),1),a("p",$e,h(e.card.description),1),a("div",be,[a("a",{class:"link inline-link",target:"_blank",rel:"noreferrer",href:e.card.html_url},[S(h(e.$t("repositories.go_repo"))+" ",1),a("span",ye,h(s.value),1)],8,we),e.card.homepage?(n(),i("a",{key:0,class:"link link--live inline-link",target:"_blank",rel:"noreferrer",href:e.card.homepage,"aria-label":`${e.$t("repositories.go_demo")} ${s.value}`},[S(h(e.$t("repositories.go_demo"))+" ",1),a("span",Re,h(s.value),1)],8,Le)):R("",!0),a("ul",Te,[(n(!0),i(b,null,w(e.card.topics,(p,c)=>(n(),i("li",{lang:"en",key:c},h(p),1))),128))])])]))}}),Se=y(Ce,[["__scopeId","data-v-608124d8"]]),Ie={class:"container"},Be={key:0,class:"tags",role:"listbox"},He=["id","aria-selected","aria-labelledby","onClick"],Pe={key:1,class:"repos"},Ee=$({__name:"BaseReposList",props:{repos:{}},setup(l){const t=l,s=k(""),e=k([]),u=()=>t.repos?[...new Set(t.repos.reduce((c,_)=>[...c,..._.topics],[]))]:[],p=c=>{s.value=c===s.value?"":c};return q(s,c=>{t.repos&&(e.value=t.repos.filter(_=>_.topics.some(o=>[c].includes(o))))}),(c,_)=>{var o;return n(),i("div",Ie,[u().length?(n(),i("div",Be,[(n(!0),i(b,null,w(u(),r=>(n(),i("button",{type:"button",lang:"en",role:"option",id:`tag-${r}`,class:C(["tag",{tagActive:r===s.value}]),"aria-selected":r===s.value,"aria-labelledby":`sortLabel tag-${r}`,key:r,onClick:d=>p(r)},h(r),11,He))),128))])):R("",!0),(o=c.repos)!=null&&o.length?(n(),i("ul",Pe,[(n(!0),i(b,null,w((e.value.length===0?c.repos:e.value).slice(0,6),r=>(n(),V(Se,{card:r,key:r.id},null,8,["card"]))),128))])):R("",!0)])}}}),Ne=y(Ee,[["__scopeId","data-v-09140b64"]]),je={class:"work",id:"repositories"},qe={class:"container"},Me={class:"body"},Ve={key:0,class:"error"},De=$({__name:"PageHomeRepos",setup(l){const{error:t,getRepos:s}=fe(),{t:e}=j(),u=k([]),p=k(!1),c=async()=>{const _=await s({ignoreTopics:["site"]});u.value=_,p.value=!1};return M(()=>{c()}),(_,o)=>(n(),i("section",je,[a("div",qe,[f(B,{link:"#repositories",title:g(e)("repositories.title")},null,8,["title"]),a("div",Me,[g(t)?(n(),i("h3",Ve," Repos not found ")):R("",!0),f(Ne,{repos:u.value},null,8,["repos"]),g(t)?R("",!0):(n(),V(J,{key:1,href:"https://github.com/davidaganov?tab=repositories",target:"_blank",rel:"noreferrer",class:"btn"},{default:I(()=>[S(h(g(e)("repositories.go_github")),1)]),_:1}))])])]))}}),Ue=y(De,[["__scopeId","data-v-85f18c3a"]]),Ae={class:"main-wrapper"},Oe=$({__name:"HomeView",setup(l){return(t,s)=>(n(),i("main",null,[a("div",Ae,[f(oe),f(me),f(Ue)])]))}});export{Oe as default};
