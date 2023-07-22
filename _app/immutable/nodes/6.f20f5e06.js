import{S as Jt,i as Kt,s as Nt,U as mt,y as Qt,z as Yt,A as el,V as tl,W as Bt,g as ll,d as al,B as ol,X as Rt,k as r,q as a,a as u,a6 as rl,l as d,m as s,r as o,h as t,c as h,a7 as dl,n as p,b as _,D as e,E as sl}from"../chunks/index.c6e7a313.js";import{P as il}from"../chunks/post_layout.be2402e1.js";function fl(S){let c,E,F,b,i,f,j,D,be,De,Z,Oe,Ae,B,Le,ye,R,Ie,we,V,Pe,$e,G,ge,ke,Te,P,He,J,Me,Se,ce,$,U,je,ne,m,O,Ue,K,We,qe,A,ze,Xe,g,Ze,N,Be,Re,Ve,L,Ge,Q,Je,Ke,y,Ne,Qe,Y,Ye,pe,ee,Gt=`<pre class="shiki material-default" style="background-color: #263238; color: #EEFFFF" shell="true"><div class="language-id">shell</div><div class='code-container'><code><div class='line'><span style="color: #EEFFFF">adb shell  </span></div><div class='line'><span style="color: #82AAFF">cd</span><span style="color: #EEFFFF"> /data/local/tmp/  </span></div><div class='line'><span style="color: #EEFFFF">su  </span></div><div class='line'><span style="color: #EEFFFF">./frida-server-android...  </span></div></code></div></pre>`,te,k,W,et,_e,I,T,tt,le,lt,at,ot,C,rt,ae,dt,st,oe,it,ft,ue,H,q,ct,he,x,M,nt,re,pt,_t,ut,de,ht,vt,se,Et;return{c(){c=r("h2"),E=r("a"),F=a("Android 端的准备"),b=u(),i=r("ol"),f=r("li"),j=a("在 "),D=r("a"),be=a("frida"),De=a(" 仓库中下载"),Z=r("code"),Oe=a("frida-server"),Ae=a("文件，需要与手机架构和 PC 端 frida 版本相对应，解压后可以使用"),B=r("code"),Le=a("adb push"),ye=a(" 到手机，也可以使用 "),R=r("code"),Ie=a("MT文件管理器"),we=a("，将其移动到 "),V=r("code"),Pe=a("/data/local/tmp"),$e=a(" 目录内，赋予 "),G=r("code"),ge=a("777"),ke=a(" 权限"),Te=u(),P=r("li"),He=a("将手机与电脑连接，使用 "),J=r("code"),Me=a("adb devices"),Se=a(" 查看连接的设备，确保 adb 正确连接"),ce=u(),$=r("h2"),U=r("a"),je=a("PC 端的准备"),ne=u(),m=r("ol"),O=r("li"),Ue=a("使用 "),K=r("code"),We=a("pip install frida"),qe=a(" 命令安装 "),A=r("a"),ze=a("frida"),Xe=u(),g=r("li"),Ze=a("使用 "),N=r("code"),Be=a("pip install frida-tools"),Re=a(" 命令安装 frida-tools"),Ve=u(),L=r("li"),Ge=a("使用"),Q=r("code"),Je=a("pip3 install frida-dexdump"),Ke=a(" 安装 "),y=r("a"),Ne=a("dexdump"),Qe=u(),Y=r("li"),Ye=a("在 cmd 中执行以下命令"),pe=u(),ee=new rl(!1),te=u(),k=r("h2"),W=r("a"),et=a("开始脱壳"),_e=u(),I=r("ol"),T=r("li"),tt=a("打开新的 cmd 执行以下命令 "),le=r("code"),lt=a("frida-dexdump -U -f com.app.pkgname"),at=a(" 即可开始脱壳"),ot=u(),C=r("li"),rt=a("推荐加上 "),ae=r("code"),dt=a("-d"),st=a(" 即深度搜索，结果更加完整，注意 "),oe=r("code"),it=a("-f"),ft=a(" 后必须直接跟包名"),ue=u(),H=r("h2"),q=r("a"),ct=a("修复和查看"),he=u(),x=r("ol"),M=r("li"),nt=a("生成的项目文件存放在"),re=r("code"),pt=a("C:\\\\Windows\\\\System32"),_t=a("目录下"),ut=u(),de=r("li"),ht=a("使用 MT 管理器进行 dex 修复"),vt=u(),se=r("li"),Et=a("使用 jadx 查看修复后的 dex 文件"),this.h()},l(l){c=d(l,"H2",{id:!0});var n=s(c);E=d(n,"A",{href:!0});var xt=s(E);F=o(xt,"Android 端的准备"),xt.forEach(t),n.forEach(t),b=h(l),i=d(l,"OL",{});var ve=s(i);f=d(ve,"LI",{});var v=s(f);j=o(v,"在 "),D=d(v,"A",{href:!0,rel:!0,target:!0});var Ft=s(D);be=o(Ft,"frida"),Ft.forEach(t),De=o(v," 仓库中下载"),Z=d(v,"CODE",{});var Ct=s(Z);Oe=o(Ct,"frida-server"),Ct.forEach(t),Ae=o(v,"文件，需要与手机架构和 PC 端 frida 版本相对应，解压后可以使用"),B=d(v,"CODE",{});var bt=s(B);Le=o(bt,"adb push"),bt.forEach(t),ye=o(v," 到手机，也可以使用 "),R=d(v,"CODE",{});var Dt=s(R);Ie=o(Dt,"MT文件管理器"),Dt.forEach(t),we=o(v,"，将其移动到 "),V=d(v,"CODE",{});var Ot=s(V);Pe=o(Ot,"/data/local/tmp"),Ot.forEach(t),$e=o(v," 目录内，赋予 "),G=d(v,"CODE",{});var At=s(G);ge=o(At,"777"),At.forEach(t),ke=o(v," 权限"),v.forEach(t),Te=h(ve),P=d(ve,"LI",{});var Ee=s(P);He=o(Ee,"将手机与电脑连接，使用 "),J=d(Ee,"CODE",{});var Lt=s(J);Me=o(Lt,"adb devices"),Lt.forEach(t),Se=o(Ee," 查看连接的设备，确保 adb 正确连接"),Ee.forEach(t),ve.forEach(t),ce=h(l),$=d(l,"H2",{id:!0});var yt=s($);U=d(yt,"A",{href:!0});var It=s(U);je=o(It,"PC 端的准备"),It.forEach(t),yt.forEach(t),ne=h(l),m=d(l,"OL",{});var w=s(m);O=d(w,"LI",{});var ie=s(O);Ue=o(ie,"使用 "),K=d(ie,"CODE",{});var wt=s(K);We=o(wt,"pip install frida"),wt.forEach(t),qe=o(ie," 命令安装 "),A=d(ie,"A",{href:!0,rel:!0,target:!0});var Pt=s(A);ze=o(Pt,"frida"),Pt.forEach(t),ie.forEach(t),Xe=h(w),g=d(w,"LI",{});var me=s(g);Ze=o(me,"使用 "),N=d(me,"CODE",{});var $t=s(N);Be=o($t,"pip install frida-tools"),$t.forEach(t),Re=o(me," 命令安装 frida-tools"),me.forEach(t),Ve=h(w),L=d(w,"LI",{});var fe=s(L);Ge=o(fe,"使用"),Q=d(fe,"CODE",{});var gt=s(Q);Je=o(gt,"pip3 install frida-dexdump"),gt.forEach(t),Ke=o(fe," 安装 "),y=d(fe,"A",{href:!0,rel:!0,target:!0});var kt=s(y);Ne=o(kt,"dexdump"),kt.forEach(t),fe.forEach(t),Qe=h(w),Y=d(w,"LI",{});var Tt=s(Y);Ye=o(Tt,"在 cmd 中执行以下命令"),Tt.forEach(t),w.forEach(t),pe=h(l),ee=dl(l,!1),te=h(l),k=d(l,"H2",{id:!0});var Ht=s(k);W=d(Ht,"A",{href:!0});var Mt=s(W);et=o(Mt,"开始脱壳"),Mt.forEach(t),Ht.forEach(t),_e=h(l),I=d(l,"OL",{});var xe=s(I);T=d(xe,"LI",{});var Fe=s(T);tt=o(Fe,"打开新的 cmd 执行以下命令 "),le=d(Fe,"CODE",{});var St=s(le);lt=o(St,"frida-dexdump -U -f com.app.pkgname"),St.forEach(t),at=o(Fe," 即可开始脱壳"),Fe.forEach(t),ot=h(xe),C=d(xe,"LI",{});var z=s(C);rt=o(z,"推荐加上 "),ae=d(z,"CODE",{});var jt=s(ae);dt=o(jt,"-d"),jt.forEach(t),st=o(z," 即深度搜索，结果更加完整，注意 "),oe=d(z,"CODE",{});var Ut=s(oe);it=o(Ut,"-f"),Ut.forEach(t),ft=o(z," 后必须直接跟包名"),z.forEach(t),xe.forEach(t),ue=h(l),H=d(l,"H2",{id:!0});var Wt=s(H);q=d(Wt,"A",{href:!0});var qt=s(q);ct=o(qt,"修复和查看"),qt.forEach(t),Wt.forEach(t),he=h(l),x=d(l,"OL",{});var X=s(x);M=d(X,"LI",{});var Ce=s(M);nt=o(Ce,"生成的项目文件存放在"),re=d(Ce,"CODE",{});var zt=s(re);pt=o(zt,"C:\\\\Windows\\\\System32"),zt.forEach(t),_t=o(Ce,"目录下"),Ce.forEach(t),ut=h(X),de=d(X,"LI",{});var Xt=s(de);ht=o(Xt,"使用 MT 管理器进行 dex 修复"),Xt.forEach(t),vt=h(X),se=d(X,"LI",{});var Zt=s(se);Et=o(Zt,"使用 jadx 查看修复后的 dex 文件"),Zt.forEach(t),X.forEach(t),this.h()},h(){p(E,"href","#android-端的准备"),p(c,"id","android-端的准备"),p(D,"href","https://github.com/frida/frida"),p(D,"rel","nofollow noopener noreferrer external"),p(D,"target","_blank"),p(U,"href","#pc-端的准备"),p($,"id","pc-端的准备"),p(A,"href","https://github.com/frida/frida"),p(A,"rel","nofollow noopener noreferrer external"),p(A,"target","_blank"),p(y,"href","https://github.com/hluwa/FRIDA-DEXDump"),p(y,"rel","nofollow noopener noreferrer external"),p(y,"target","_blank"),ee.a=te,p(W,"href","#开始脱壳"),p(k,"id","开始脱壳"),p(q,"href","#修复和查看"),p(H,"id","修复和查看")},m(l,n){_(l,c,n),e(c,E),e(E,F),_(l,b,n),_(l,i,n),e(i,f),e(f,j),e(f,D),e(D,be),e(f,De),e(f,Z),e(Z,Oe),e(f,Ae),e(f,B),e(B,Le),e(f,ye),e(f,R),e(R,Ie),e(f,we),e(f,V),e(V,Pe),e(f,$e),e(f,G),e(G,ge),e(f,ke),e(i,Te),e(i,P),e(P,He),e(P,J),e(J,Me),e(P,Se),_(l,ce,n),_(l,$,n),e($,U),e(U,je),_(l,ne,n),_(l,m,n),e(m,O),e(O,Ue),e(O,K),e(K,We),e(O,qe),e(O,A),e(A,ze),e(m,Xe),e(m,g),e(g,Ze),e(g,N),e(N,Be),e(g,Re),e(m,Ve),e(m,L),e(L,Ge),e(L,Q),e(Q,Je),e(L,Ke),e(L,y),e(y,Ne),e(m,Qe),e(m,Y),e(Y,Ye),_(l,pe,n),ee.m(Gt,l,n),_(l,te,n),_(l,k,n),e(k,W),e(W,et),_(l,_e,n),_(l,I,n),e(I,T),e(T,tt),e(T,le),e(le,lt),e(T,at),e(I,ot),e(I,C),e(C,rt),e(C,ae),e(ae,dt),e(C,st),e(C,oe),e(oe,it),e(C,ft),_(l,ue,n),_(l,H,n),e(H,q),e(q,ct),_(l,he,n),_(l,x,n),e(x,M),e(M,nt),e(M,re),e(re,pt),e(M,_t),e(x,ut),e(x,de),e(de,ht),e(x,vt),e(x,se),e(se,Et)},p:sl,d(l){l&&t(c),l&&t(b),l&&t(i),l&&t(ce),l&&t($),l&&t(ne),l&&t(m),l&&t(pe),l&&ee.d(),l&&t(te),l&&t(k),l&&t(_e),l&&t(I),l&&t(ue),l&&t(H),l&&t(he),l&&t(x)}}}function cl(S){let c,E;const F=[S[0],Vt];let b={$$slots:{default:[fl]},$$scope:{ctx:S}};for(let i=0;i<F.length;i+=1)b=mt(b,F[i]);return c=new il({props:b}),{c(){Qt(c.$$.fragment)},l(i){Yt(c.$$.fragment,i)},m(i,f){el(c,i,f),E=!0},p(i,[f]){const j=f&1?tl(F,[f&1&&Bt(i[0]),f&0&&Bt(Vt)]):{};f&2&&(j.$$scope={dirty:f,ctx:i}),c.$set(j)},i(i){E||(ll(c.$$.fragment,i),E=!0)},o(i){al(c.$$.fragment,i),E=!1},d(i){ol(c,i)}}}const Vt={title:"使用 frida 对 APP 进行脱壳",image:"/about/urara.webp",alt:"Az",created:"2022-11-01T00:00:00.000Z",updated:"2023-12-12T00:00:00.000Z",tags:["frida"],images:[],slug:"/page2/+page.svelte.md",path:"/page2",toc:[{depth:2,title:"Android 端的准备",slug:"android-端的准备"},{depth:2,title:"PC 端的准备",slug:"pc-端的准备"},{depth:2,title:"开始脱壳",slug:"开始脱壳"},{depth:2,title:"修复和查看",slug:"修复和查看"}]};function nl(S,c,E){return S.$$set=F=>{E(0,c=mt(mt({},c),Rt(F)))},c=Rt(c),[c]}class ul extends Jt{constructor(c){super(),Kt(this,c,nl,cl,Nt,{})}}export{ul as component};
