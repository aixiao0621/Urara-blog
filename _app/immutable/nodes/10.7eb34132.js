import{a0 as Ce,S as x,i as $,s as ee,k as b,l as p,m as y,h as d,n as m,I as ge,b as k,a1 as Ee,g as w,v as Y,f as Z,d as C,F as Ie,a as H,c as j,p as G,D as v,e as q,a2 as ve,N as be,O as pe,P as ye,Q as ke,a3 as We,a4 as De,a5 as Me,L as Se,M as Ve,a6 as Ae,a7 as Ne,q as P,r as F,u as we,E as S,y as Q,z as J,A as U,B as X,T as He,w as ae,a8 as ne,a9 as ie}from"../chunks/index.cb04554d.js";import{g as je,i as re,t as Pe}from"../chunks/icon.91a6a625.js";import{F as Fe,H as qe}from"../chunks/footer.5e75ecdd.js";const Re=[{id:" StevenRCE0",name:"StevenRCE0",title:"StevenRCE0",avatar:"https://avatars.githubusercontent.com/u/40051361",link:"https://rcex.live/",descr:"Wind rises... We shall try to live!"},{id:"trdthg",name:"trdthg",avatar:"https://avatars.githubusercontent.com/u/69898423",title:"trdthg",link:"https://trdthg.github.io/",descr:"🕊 (￣︶￣*))🐕"}];function ze(n,{from:e,to:t},l={}){const o=getComputedStyle(n),r=o.transform==="none"?"":o.transform,[f,s]=o.transformOrigin.split(" ").map(parseFloat),a=e.left+e.width*f/t.width-(t.left+f),c=e.top+e.height*s/t.height-(t.top+s),{delay:i=0,duration:u=g=>Math.sqrt(g)*120,easing:_=je}=l;return{delay:i,duration:Ce(u)?u(Math.sqrt(a*a+c*c)):u,easing:_,css:(g,E)=>{const W=E*a,A=E*c,I=g+E*e.width/t.width,R=g+E*e.height/t.height;return`transform: ${r} translate(${W}px, ${A}px) scale(${I}, ${R});`}}}function oe(n,e,t){const l=n.slice();return l[18]=e[t],l}function ce(n,e,t){const l=n.slice();return l[21]=e[t][0],l[22]=e[t][1],l}const Be=n=>({idx:n&1024,item:n&1024}),fe=n=>({idx:n[22],item:n[21]});function ue(n,e,t){const l=n.slice();return l[21]=e[t][0],l[22]=e[t][1],l}const Ke=n=>({idx:n&1024,item:n&1024}),_e=n=>({idx:n[22],item:n[21]});function Oe(n){let e=[],t=new Map,l,o,r=n[18];const f=s=>s[6](s[21]);for(let s=0;s<r.length;s+=1){let a=ce(n,r,s),c=f(a);t.set(c,e[s]=he(c,a))}return{c(){for(let s=0;s<e.length;s+=1)e[s].c();l=q()},l(s){for(let a=0;a<e.length;a+=1)e[a].l(s);l=q()},m(s,a){for(let c=0;c<e.length;c+=1)e[c]&&e[c].m(s,a);k(s,l,a),o=!0},p(s,a){a&33856&&(r=s[18],Y(),e=ve(e,a,f,1,s,r,t,l.parentNode,Ae,he,l,ce),Z())},i(s){if(!o){for(let a=0;a<r.length;a+=1)w(e[a]);o=!0}},o(s){for(let a=0;a<e.length;a+=1)C(e[a]);o=!1},d(s){for(let a=0;a<e.length;a+=1)e[a].d(s);s&&d(l)}}}function Te(n){let e=[],t=new Map,l,o,r=n[18];const f=s=>s[6](s[21]);for(let s=0;s<r.length;s+=1){let a=ue(n,r,s),c=f(a);t.set(c,e[s]=de(c,a))}return{c(){for(let s=0;s<e.length;s+=1)e[s].c();l=q()},l(s){for(let a=0;a<e.length;a+=1)e[a].l(s);l=q()},m(s,a){for(let c=0;c<e.length;c+=1)e[c]&&e[c].m(s,a);k(s,l,a),o=!0},p(s,a){if(a&33872){r=s[18],Y();for(let c=0;c<e.length;c+=1)e[c].r();e=ve(e,a,f,1,s,r,t,l.parentNode,Ne,de,l,ue);for(let c=0;c<e.length;c+=1)e[c].a();Z()}},i(s){if(!o){for(let a=0;a<r.length;a+=1)w(e[a]);o=!0}},o(s){for(let a=0;a<e.length;a+=1)C(e[a]);o=!1},d(s){for(let a=0;a<e.length;a+=1)e[a].d(s);s&&d(l)}}}function Le(n){let e,t=n[21]+"",l,o;return{c(){e=b("span"),l=P(t),o=H(),this.h()},l(r){e=p(r,"SPAN",{class:!0});var f=y(e);l=F(f,t),f.forEach(d),o=j(r),this.h()},h(){m(e,"class","svelte-b2jtby")},m(r,f){k(r,e,f),v(e,l),k(r,o,f)},p(r,f){f&1024&&t!==(t=r[21]+"")&&we(l,t)},d(r){r&&d(e),r&&d(o)}}}function he(n,e){let t,l;const o=e[16].default,r=be(o,e,e[15],fe),f=r||Le(e);return{key:n,first:null,c(){t=q(),f&&f.c(),this.h()},l(s){t=q(),f&&f.l(s),this.h()},h(){this.first=t},m(s,a){k(s,t,a),f&&f.m(s,a),l=!0},p(s,a){e=s,r?r.p&&(!l||a&33792)&&pe(r,o,e,e[15],l?ke(o,e[15],a,Be):ye(e[15]),fe):f&&f.p&&(!l||a&1024)&&f.p(e,l?a:-1)},i(s){l||(w(f,s),l=!0)},o(s){C(f,s),l=!1},d(s){s&&d(t),f&&f.d(s)}}}function Ge(n){let e,t=n[21]+"",l;return{c(){e=b("span"),l=P(t),this.h()},l(o){e=p(o,"SPAN",{class:!0});var r=y(e);l=F(r,t),r.forEach(d),this.h()},h(){m(e,"class","svelte-b2jtby")},m(o,r){k(o,e,r),v(e,l)},p(o,r){r&1024&&t!==(t=o[21]+"")&&we(l,t)},d(o){o&&d(e)}}}function de(n,e){let t,l,o,r,f,s=S,a;const c=e[16].default,i=be(c,e,e[15],_e),u=i||Ge(e);return{key:n,first:null,c(){t=b("div"),u&&u.c(),l=H(),this.h()},l(_){t=p(_,"DIV",{class:!0});var g=y(t);u&&u.l(g),l=j(g),g.forEach(d),this.h()},h(){m(t,"class","svelte-b2jtby"),this.first=t},m(_,g){k(_,t,g),u&&u.m(t,null),v(t,l),a=!0},p(_,g){e=_,i?i.p&&(!a||g&33792)&&pe(i,c,e,e[15],a?ke(c,e[15],g,Ke):ye(e[15]),_e):u&&u.p&&(!a||g&1024)&&u.p(e,a?g:-1)},r(){f=t.getBoundingClientRect()},f(){We(t),s(),De(t,f)},a(){s(),s=Me(t,f,ze,{duration:e[4]})},i(_){a||(w(u,_),_&&ge(()=>{a&&(r&&r.end(1),o=Se(t,re,{delay:100,duration:e[4]}),o.start())}),a=!0)},o(_){C(u,_),o&&o.invalidate(),_&&(r=Ve(t,re,{delay:0,duration:e[4]})),a=!1},d(_){_&&d(t),u&&u.d(_),_&&r&&r.end()}}}function me(n){let e,t,l,o,r,f;const s=[Te,Oe],a=[];function c(i,u){return i[2]?0:1}return t=c(n),l=a[t]=s[t](n),{c(){e=b("div"),l.c(),o=H(),this.h()},l(i){e=p(i,"DIV",{class:!0,style:!0});var u=y(e);l.l(u),o=j(u),u.forEach(d),this.h()},h(){m(e,"class",r="col "+n[3]+" svelte-b2jtby"),G(e,"gap",n[5]+"px"),G(e,"max-width",n[7]+"px")},m(i,u){k(i,e,u),a[t].m(e,null),v(e,o),f=!0},p(i,u){let _=t;t=c(i),t===_?a[t].p(i,u):(Y(),C(a[_],1,1,()=>{a[_]=null}),Z(),l=a[t],l?l.p(i,u):(l=a[t]=s[t](i),l.c()),w(l,1),l.m(e,o)),(!f||u&8&&r!==(r="col "+i[3]+" svelte-b2jtby"))&&m(e,"class",r),(!f||u&32)&&G(e,"gap",i[5]+"px"),(!f||u&128)&&G(e,"max-width",i[7]+"px")},i(i){f||(w(l),f=!0)},o(i){C(l),f=!1},d(i){i&&d(e),a[t].d()}}}function Qe(n){let e,t,l,o,r,f=n[10],s=[];for(let c=0;c<f.length;c+=1)s[c]=me(oe(n,f,c));const a=c=>C(s[c],1,1,()=>{s[c]=null});return{c(){e=b("div");for(let c=0;c<s.length;c+=1)s[c].c();this.h()},l(c){e=p(c,"DIV",{class:!0,style:!0});var i=y(e);for(let u=0;u<s.length;u+=1)s[u].l(i);i.forEach(d),this.h()},h(){m(e,"class",t="masonry "+n[9]+" svelte-b2jtby"),m(e,"style",l="gap: "+n[5]+"px; "+n[8]),ge(()=>n[17].call(e))},m(c,i){k(c,e,i);for(let u=0;u<s.length;u+=1)s[u]&&s[u].m(e,null);o=Ee(e,n[17].bind(e)),r=!0},p(c,[i]){if(i&33980){f=c[10];let u;for(u=0;u<f.length;u+=1){const _=oe(c,f,u);s[u]?(s[u].p(_,i),w(s[u],1)):(s[u]=me(_),s[u].c(),w(s[u],1),s[u].m(e,null))}for(Y(),u=f.length;u<s.length;u+=1)a(u);Z()}(!r||i&512&&t!==(t="masonry "+c[9]+" svelte-b2jtby"))&&m(e,"class",t),(!r||i&288&&l!==(l="gap: "+c[5]+"px; "+c[8]))&&m(e,"style",l)},i(c){if(!r){for(let i=0;i<f.length;i+=1)w(s[i]);r=!0}},o(c){s=s.filter(Boolean);for(let i=0;i<s.length;i+=1)C(s[i]);r=!1},d(c){c&&d(e),Ie(s,c),o()}}}function Je(n,e,t){let l,o,{$$slots:r={},$$scope:f}=e,{animate:s=!0}=e,{columnClass:a=""}=e,{duration:c=200}=e,{gap:i=20}=e,{getId:u=h=>typeof h=="number"||typeof h=="string"?h:h[_]}=e,{idKey:_="id"}=e,{items:g}=e,{masonryHeight:E=0}=e,{masonryWidth:W=0}=e,{maxColWidth:A=500}=e,{minColWidth:I=330}=e,{style:R=""}=e,{class:z=""}=e;function B(){W=this.clientWidth,E=this.clientHeight,t(0,W),t(1,E)}return n.$$set=h=>{"animate"in h&&t(2,s=h.animate),"columnClass"in h&&t(3,a=h.columnClass),"duration"in h&&t(4,c=h.duration),"gap"in h&&t(5,i=h.gap),"getId"in h&&t(6,u=h.getId),"idKey"in h&&t(11,_=h.idKey),"items"in h&&t(12,g=h.items),"masonryHeight"in h&&t(1,E=h.masonryHeight),"masonryWidth"in h&&t(0,W=h.masonryWidth),"maxColWidth"in h&&t(7,A=h.maxColWidth),"minColWidth"in h&&t(13,I=h.minColWidth),"style"in h&&t(8,R=h.style),"class"in h&&t(9,z=h.class),"$$scope"in h&&t(15,f=h.$$scope)},n.$$.update=()=>{n.$$.dirty&12321&&t(14,l=Math.min(g.length,Math.floor(W/(I+i))||1)),n.$$.dirty&20480&&t(10,o=g.reduce((h,te,N)=>(h[N%h.length].push([te,N]),h),Array(l).fill(null).map(()=>[])))},[W,E,s,a,c,i,u,A,R,z,o,_,g,I,l,f,r,B]}class Ue extends x{constructor(e){super(),$(this,e,Je,Qe,ee,{animate:2,columnClass:3,duration:4,gap:5,getId:6,idKey:11,items:12,masonryHeight:1,masonryWidth:0,maxColWidth:7,minColWidth:13,style:8,class:9})}}function Xe(n){let e,t,l=(n[0].name??"")+"",o,r,f=(n[0].title??"")+"",s,a,c,i,u,_,g,E=(n[0].name??"")+"",W,A,I,R=n[0].title+"",z,B;function h(D,M){return D[0].avatar?$e:xe}let N=h(n)(n),V=n[0].descr&&et(n);return{c(){e=b("a"),t=b("div"),o=P(l),r=b("br"),s=P(f),a=H(),c=b("div"),i=b("div"),N.c(),u=H(),_=b("div"),g=b("span"),W=P(E),A=H(),I=b("span"),z=P(R),B=H(),V&&V.c(),this.h()},l(D){e=p(D,"A",{id:!0,rel:!0,href:!0,class:!0});var M=y(e);t=p(M,"DIV",{class:!0});var K=y(t);o=F(K,l),r=p(K,"BR",{}),s=F(K,f),K.forEach(d),a=j(M),c=p(M,"DIV",{class:!0});var O=y(c);i=p(O,"DIV",{class:!0});var T=y(i);N.l(T),u=j(T),_=p(T,"DIV",{class:!0});var L=y(_);g=p(L,"SPAN",{class:!0});var le=y(g);W=F(le,E),le.forEach(d),A=j(L),I=p(L,"SPAN",{class:!0});var se=y(I);z=F(se,R),se.forEach(d),L.forEach(d),T.forEach(d),B=j(O),V&&V.l(O),O.forEach(d),M.forEach(d),this.h()},h(){m(t,"class","absolute text-4xl font-bold opacity-5 rotate-6 leading-tight top-4"),m(g,"class","text-right p-name"),m(I,"class","opacity-50 text-right"),m(_,"class","card-title flex-col gap-0 flex-1 items-end"),m(i,"class","flex items-center gap-4"),m(c,"class","card-body p-4"),m(e,"id",n[0].id),m(e,"rel",n[0].rel),m(e,"href",n[0].link),m(e,"class","card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow h-card u-url")},m(D,M){k(D,e,M),v(e,t),v(t,o),v(t,r),v(t,s),v(e,a),v(e,c),v(c,i),N.m(i,null),v(i,u),v(i,_),v(_,g),v(g,W),v(_,A),v(_,I),v(I,z),v(c,B),V&&V.m(c,null)},p(D,M){N.p(D,M),D[0].descr&&V.p(D,M)},i:S,o:S,d(D){D&&d(e),N.d(),V&&V.d()}}}function Ye(n){let e,t=n[0].html+"";return{c(){e=b("a"),this.h()},l(l){e=p(l,"A",{id:!0,rel:!0,href:!0,class:!0});var o=y(e);o.forEach(d),this.h()},h(){m(e,"id",n[0].id),m(e,"rel",n[0].rel),m(e,"href",n[0].link),m(e,"class","h-card u-url")},m(l,o){k(l,e,o),e.innerHTML=t},p:S,i:S,o:S,d(l){l&&d(e)}}}function Ze(n){let e,t;return e=new Fe({props:{rounded:!0,class:"p-4 md:p-8"}}),{c(){Q(e.$$.fragment)},l(l){J(e.$$.fragment,l)},m(l,o){U(e,l,o),t=!0},p:S,i(l){t||(w(e.$$.fragment,l),t=!0)},o(l){C(e.$$.fragment,l),t=!1},d(l){X(e,l)}}}function xe(n){let e,t,l,o=(n[0].name??n[0].title).charAt(0)+"",r;return{c(){e=b("div"),t=b("div"),l=b("span"),r=P(o),this.h()},l(f){e=p(f,"DIV",{class:!0});var s=y(e);t=p(s,"DIV",{class:!0});var a=y(t);l=p(a,"SPAN",{class:!0});var c=y(l);r=F(c,o),c.forEach(d),a.forEach(d),s.forEach(d),this.h()},h(){var f,s;m(l,"class","text-3xl"),m(t,"class",(((f=n[0].class)==null?void 0:f.img)??"bg-neutral-focus text-neutral-content shadow-inner rounded-xl")+" w-16"),m(e,"class","avatar "+((s=n[0].class)==null?void 0:s.avatar)+" placeholder mb-auto")},m(f,s){k(f,e,s),v(e,t),v(t,l),v(l,r)},p:S,d(f){f&&d(e)}}}function $e(n){let e,t,l;return{c(){e=b("div"),t=b("img"),this.h()},l(o){e=p(o,"DIV",{class:!0});var r=y(e);t=p(r,"IMG",{class:!0,src:!0,alt:!0}),r.forEach(d),this.h()},h(){var o,r;m(t,"class",(((o=n[0].class)==null?void 0:o.img)??"rounded-xl")+" u-photo"),He(t.src,l=n[0].avatar)||m(t,"src",l),m(t,"alt",n[0].title),m(e,"class","avatar "+((r=n[0].class)==null?void 0:r.avatar)+" shrink-0 w-16 mb-auto")},m(o,r){k(o,e,r),v(e,t)},p:S,d(o){o&&d(e)}}}function et(n){let e,t=n[0].descr+"",l;return{c(){e=b("div"),l=P(t),this.h()},l(o){e=p(o,"DIV",{class:!0});var r=y(e);l=F(r,t),r.forEach(d),this.h()},h(){m(e,"class","prose opacity-70 p-note")},m(o,r){k(o,e,r),v(e,l)},p:S,d(o){o&&d(e)}}}function tt(n){let e,t,l,o;const r=[Ze,Ye,Xe],f=[];function s(a,c){return a[0].id==="footer"?0:a[0].html?1:2}return e=s(n),t=f[e]=r[e](n),{c(){t.c(),l=q()},l(a){t.l(a),l=q()},m(a,c){f[e].m(a,c),k(a,l,c),o=!0},p(a,[c]){t.p(a,c)},i(a){o||(w(t),o=!0)},o(a){C(t),o=!1},d(a){f[e].d(a),a&&d(l)}}}function lt(n,e,t){let{item:l}=e,o=l;return n.$$set=r=>{"item"in r&&t(1,l=r.item)},[o,l]}class st extends x{constructor(e){super(),$(this,e,lt,tt,ee,{item:1})}}function at(n){let e,t;return e=new st({props:{item:n[7]}}),{c(){Q(e.$$.fragment)},l(l){J(e.$$.fragment,l)},m(l,o){U(e,l,o),t=!0},p(l,o){const r={};o&128&&(r.item=l[7]),e.$set(r)},i(l){t||(w(e.$$.fragment,l),t=!0)},o(l){C(e.$$.fragment,l),t=!1},d(l){X(e,l)}}}function nt(n){let e,t,l,o,r,f;e=new qe({props:{page:{title:"Friends",path:"/friends"}}});function s(i){n[3](i)}function a(i){n[4](i)}let c={items:n[2],minColWidth:384,maxColWidth:384,gap:32,class:"mx-4 sm:mx-8 md:my-4 lg:mx-16 lg:my-8 xl:mx-32 xl:my-16",$$slots:{default:[at,({item:i})=>({7:i}),({item:i})=>i?128:0]},$$scope:{ctx:n}};return n[0]!==void 0&&(c.width=n[0]),n[1]!==void 0&&(c.height=n[1]),l=new Ue({props:c}),ae.push(()=>ne(l,"width",s)),ae.push(()=>ne(l,"height",a)),{c(){Q(e.$$.fragment),t=H(),Q(l.$$.fragment)},l(i){J(e.$$.fragment,i),t=j(i),J(l.$$.fragment,i)},m(i,u){U(e,i,u),k(i,t,u),U(l,i,u),f=!0},p(i,[u]){const _={};u&384&&(_.$$scope={dirty:u,ctx:i}),!o&&u&1&&(o=!0,_.width=i[0],ie(()=>o=!1)),!r&&u&2&&(r=!0,_.height=i[1],ie(()=>r=!1)),l.$set(_)},i(i){f||(w(e.$$.fragment,i),w(l.$$.fragment,i),f=!0)},o(i){C(e.$$.fragment,i),C(l.$$.fragment,i),f=!1},d(i){X(e,i),i&&d(t),X(l,i)}}}function it(n,e,t){const l=Math.random();let r=[...((i,u=0,_=i.length)=>{for(;_;)u=l*_--|0,[i[_],i[u]]=[i[u],i[_]];return i})(Re),{id:"footer"}],f,s;Pe.set("");function a(i){f=i,t(0,f)}function c(i){s=i,t(1,s)}return[f,s,r,a,c]}class ft extends x{constructor(e){super(),$(this,e,it,nt,ee,{})}}export{ft as component};
