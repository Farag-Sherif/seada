import{r as n,j as e,C as Q,u as V}from"./index-SMLiIMwR.js";import X from"./Banner-DhuVbZOc.js";import Z from"./Category-CWwShsh6.js";import ee from"./About-us-BXFqI5xj.js";import se from"./Collections-ptS3aYuD.js";import{S as z}from"./index-Ck_5nnyf.js";import{C}from"./Container-BdWfrw1a.js";import{R as T}from"./Row-D4ZfY8NV.js";import{C as k}from"./Col-CNoyJ9_v.js";import{P as B}from"./PostLoader-FhiNthUe.js";import{g as H}from"./products-ijfk4fJI.js";import{u as _}from"./useLanguage-gITJRiEG.js";import{u as te,P as le}from"./useProductAdapter-URhyJivi.js";import{M as O}from"./Media-D-l4SfND.js";import{N as D}from"./NextLinkCompat-B6pDUoE-.js";import{S as re,a as ae,P as ie}from"./script-6JDTEumQ.js";import{a as oe,b as ne}from"./main-phMepZS4.js";import{S as ue}from"./StyleTag-1J5wyURP.js";import{S as ce}from"./service1-3GAq1nuS.js";import"./MasterBanner-DOQGyDM-.js";import"./api-DM-tDIGU.js";import"./categories-BIl1eGPJ.js";import"./utils-D8f00ew-.js";import"./ModalBody-D0sBAK0O.js";import"./Fade-Dxq_8SEO.js";import"./Transition-DjRsfRz0.js";import"./cart-CACDPqq8.js";import"./MasterServiceConternt-BlB4a8BT.js";const I=(s,t,l)=>{try{const r=s?s(t):"";return!r||r===t?l:r}catch{return l}},$=s=>{var a,i;const t=(s==null?void 0:s.raw)||s,l=(t==null?void 0:t.id)??(t==null?void 0:t.sku)??(t==null?void 0:t.code)??(t==null?void 0:t.slug)??(t==null?void 0:t.uuid),r=(t==null?void 0:t.image_path)||((i=(a=s==null?void 0:s.images)==null?void 0:a[0])==null?void 0:i.src)||"";return String(l??"")+"|"+String(r??"")},de=s=>{const t=new Set,l=[];for(const r of s||[]){const a=$(r);!a||t.has(a)||(t.add(a),l.push(r))}return l},me=({type:s,title:t,subtitle:l,designClass:r,noSlider:a,cartClass:i,productSlider:o,titleClass:h,noTitle:c,innerClass:d,inner:u,backImage:b})=>{const{t:N,isRTL:x}=_(),[A,m]=n.useState(!0),[f,v]=n.useState([]),{adapt:g}=te(x);n.useEffect(()=>{let j=!0;return(async()=>{try{m(!0);const y=await H({page:1,per_page:50}),K=(Array.isArray(y==null?void 0:y.data)&&y.data||Array.isArray(y)&&y||[]).map(J=>g(J)),Y=de(K);j&&v(Y)}catch{j&&v([])}finally{j&&m(!1)}})(),()=>{j=!1}},[g,x]);const p=n.useMemo(()=>f.slice(0,9),[f]),L={dots:!1,arrows:!1,infinite:!1,speed:400,slidesToShow:1,slidesToScroll:1,rows:1,slidesPerRow:1,rtl:!!x,variableWidth:!1,adaptiveHeight:!0,centerMode:!1,responsive:[{breakpoint:1200,settings:{slidesToShow:1,slidesToScroll:1}},{breakpoint:992,settings:{slidesToShow:1,slidesToScroll:1}},{breakpoint:576,settings:{slidesToShow:1,slidesToScroll:1}}],...o||{}},F=`topcol-${x?"rtl":"ltr"}-${p.length}`,w=j=>e.jsx(le,{product:j,isRTL:x},$(j)),U=I(N,"collection.no_products_found",x?"لا توجد منتجات.":"No products found."),q=I(N,"collection.no_products_available",x?"لا توجد منتجات متاحة.":"No products available.");return e.jsx("section",{className:r,children:a?e.jsx(C,{children:e.jsx(T,{children:e.jsxs(k,{children:[c==="null"?"":e.jsxs("div",{className:d,children:[l?e.jsx("h4",{children:l}):"",e.jsx("h2",{className:u,children:t}),h?e.jsx("hr",{role:"tournament6"}):e.jsx("div",{className:"line",children:e.jsx("span",{})})]}),A?e.jsx("div",{className:"row mx-0 margin-default",children:e.jsx("div",{className:"col-xl-12",children:e.jsx(B,{})})}):p.length===0?e.jsx("div",{className:"text-center py-4",children:U}):e.jsx(z,{...L,className:"topcollection-slider no-arrow",children:p.map(j=>e.jsx("div",{children:w(j)},$(j)))},F)]})})}):e.jsxs(e.Fragment,{children:[t?e.jsxs("div",{className:"title1 title-gradient section-t-space",children:[e.jsx("h4",{children:l}),e.jsx("h2",{className:"title-inner1",children:t}),e.jsx("hr",{role:"tournament6"})]}):"",e.jsx(C,{children:e.jsx(T,{className:"margin-default",children:A?e.jsx("div",{className:"row margin-default",style:{width:"100%"},children:e.jsx("div",{className:"col-xl-12",children:e.jsx(B,{})})}):p.length===0?e.jsx("div",{className:"text-center py-4 w-100",children:q}):p.map(j=>e.jsx(k,{xl:"12",lg:"12",md:"12",sm:"12",children:w(j)},$(j)))})})]})})},E=(s,t,l)=>{try{const r=s?s(t):"";return!r||r===t?l:r}catch{return l}},ge=(s,t)=>{const l=Array.isArray(s==null?void 0:s.translations)&&(s.translations.find(c=>c.locale===(t?"ar":"en"))||s.translations[0])||null,r=(l==null?void 0:l.name)||(s==null?void 0:s.name)||"",a=[];s!=null&&s.image_path&&a.push({src:s.image_path}),((s==null?void 0:s.media)||[]).forEach(c=>(c==null?void 0:c.image_path)&&a.push({src:c.image_path}));const i=Number((s==null?void 0:s.price)??(s==null?void 0:s.total)??0),o=Number((s==null?void 0:s.discount)??0),h=o>0?i-i*o/100:i;return{id:s==null?void 0:s.id,title:r,images:a,price:i,discount:o,sale:h,created_at:s==null?void 0:s.created_at,is_featured:Number(s==null?void 0:s.is_featured)===1}},he=s=>{const t=[];for(let l=0;l<s.length;l+=3)t.push(s.slice(l,l+3));return t.slice(0,2)},M=(s,t,l)=>{const r=Number(s||0)*Number((t==null?void 0:t.value)||1),a=Number.isFinite(r)?new Intl.NumberFormat(l?"ar-EG":"en-GB",{minimumFractionDigits:2,maximumFractionDigits:2}).format(r):String(s),i=(t==null?void 0:t.symbol)||"£";return l?`${a} ${i}`:`${i}${a}`},P=({title:s,items:t,currency:l,onClick:r,isRTL:a})=>{const i=n.useMemo(()=>he(t),[t]),o=n.useRef(null);return n.useEffect(()=>{var h,c,d,u;(c=(h=o.current)==null?void 0:h.innerSlider)!=null&&c.onWindowResized&&o.current.innerSlider.onWindowResized(),(u=(d=o.current)==null?void 0:d.slickGoTo)==null||u.call(d,0,!0)},[i.length,a]),e.jsx(k,{lg:"3",sm:"6",style:{cursor:"pointer"},children:e.jsxs("div",{className:"theme-card",dir:a?"rtl":"ltr",children:[e.jsx("h5",{className:"title-border",style:{textTransform:"capitalize"},children:s}),e.jsx(z,{className:"offer-slider slide-1",ref:o,rtl:a,arrows:!0,dots:!1,infinite:!1,slidesToShow:1,slidesToScroll:1,adaptiveHeight:!0,lazyLoad:"progressive",initialSlide:0,children:i.map((h,c)=>e.jsx("div",{children:h.map((d,u)=>{var N,x;const b=((x=(N=d.images)==null?void 0:N[0])==null?void 0:x.src)||"/assets/images/placeholder.png";return e.jsxs("div",{className:"media",style:{minHeight:110},children:[e.jsx("a",{onClick:()=>r(d),children:e.jsx(O,{className:"img-fluid blur-up lazyload",src:b,alt:d.title,style:{objectFit:"contain"}})}),e.jsxs("div",{className:"media-body align-self-center",children:[e.jsxs("div",{className:"rating","aria-label":a?"تقييم المنتج":"Product rating",children:[e.jsx("i",{className:"fa fa-star"})," ",e.jsx("i",{className:"fa fa-star"})," ",e.jsx("i",{className:"fa fa-star"})," ",e.jsx("i",{className:"fa fa-star"})," ",e.jsx("i",{className:"fa fa-star"})]}),e.jsx("a",{onClick:()=>r(d),children:e.jsx("h6",{style:{whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"},children:d.title})}),e.jsxs("h4",{style:{marginTop:4},children:[M(d.sale,l,a)," ",e.jsx("del",{children:e.jsx("span",{className:"money",children:M(d.price,l,a)})})]})]})]},d.id??u)})},c))},`${a}-${i.length}`)]})})},xe=()=>{const{t:s,isRTL:t}=_(),{state:l}=n.useContext(Q),r=V(),[a,i]=n.useState([]);n.useEffect(()=>{let m=!0;return(async()=>{const f=await H({page:1,per_page:50}).catch(()=>null),g=(Array.isArray(f==null?void 0:f.data)?f.data:Array.isArray(f)?f:[]).map(p=>ge(p,t));m&&i(g)})(),()=>{m=!1}},[t]);const o=m=>{r.push(`/product-details/${m.id}`)},h=n.useMemo(()=>[...a].sort((m,f)=>new Date(f.created_at)-new Date(m.created_at)).slice(0,6),[a]),c=n.useMemo(()=>{const m=a.filter(f=>f.is_featured);return(m.length?m:a).slice(0,6)},[a]),d=n.useMemo(()=>[...a].sort((m,f)=>f.sale-m.sale).slice(0,6),[a]),u=n.useMemo(()=>a.filter(m=>m.discount>0).slice(0,6),[a]),b=E(s,"home.products.new",t?"منتجات جديدة":"new products"),N=E(s,"home.products.featured",t?"منتجات مميزة":"feature product"),x=E(s,"home.products.bestSeller",t?"الأكثر مبيعًا":"best seller"),A=E(s,"home.products.onSale",t?"عروض":"on sale");return e.jsx(n.Fragment,{children:e.jsx("section",{className:"section-b-space",style:{direction:t?"rtl":"ltr"},children:e.jsx(C,{children:e.jsxs(T,{className:"multiple-slider",children:[e.jsx(P,{title:b,items:h,currency:l,onClick:o,isRTL:t}),e.jsx(P,{title:N,items:c,currency:l,onClick:o,isRTL:t}),e.jsx(P,{title:x,items:d,currency:l,onClick:o,isRTL:t}),e.jsx(P,{title:A,items:u.length?u:a.slice(0,6),currency:l,onClick:o,isRTL:t})]})})})})},S=(s,t,l)=>{try{const r=s?s(t):"";return!r||r===t?l:r}catch{return l}};function fe(s,t){var r;const l=((r=s.translations)==null?void 0:r.find(a=>{var i;return((i=a.locale)==null?void 0:i.toLowerCase())===t.toLowerCase()}))||null;return{title:(l==null?void 0:l.title)??s.title,content:(l==null?void 0:l.content)??s.content}}function be(s,t=180){const l=(s||"").replace(/\r?\n+/g," ").trim();return l.length<=t?l:l.slice(0,t).trim()+"…"}function pe(s,t="en-US"){try{return new Date(s).toLocaleDateString(t,{year:"numeric",month:"long",day:"2-digit"})}catch{return s}}const R=s=>s!=null&&s.slug?`/blogs/${s.slug}`:s!=null&&s.id?`/blogs/${s.id}`:"#",je=({type:s,sectionClass:t,title:l,inner:r,hrClass:a})=>{const{t:i,currentLanguage:o,isRTL:h}=_(),[c,d]=n.useState(null),[u,b]=n.useState(!0),[N,x]=n.useState(null);n.useEffect(()=>{let g=!0;return(async()=>{b(!0),x(null);try{const p=await oe({page:1,per_page:12,type:s});console.log(p),g&&d(p)}catch{g&&x(S(i,"blog.error",o==="ar"?"حدث خطأ أثناء تحميل المقالات":"Failed to load blogs"))}finally{g&&b(!1)}})(),()=>{g=!1}},[s,i,o]);const A=(c==null?void 0:c.data)??[],m=A.length,f=n.useMemo(()=>({...{...re,rtl:!!h,vertical:!1,adaptiveHeight:!0},slidesToShow:2,slidesToScroll:1,infinite:m>2,arrows:m>1,dots:!1,centerMode:!1,variableWidth:!1,responsive:[{breakpoint:1200,settings:{slidesToShow:2,slidesToScroll:1}},{breakpoint:992,settings:{slidesToShow:1,slidesToScroll:1}},{breakpoint:576,settings:{slidesToShow:1,slidesToScroll:1}}]}),[h,m]),v=S(i,"blog.created",o==="ar"?"تاريخ النشر:":"Created:");return e.jsxs(n.Fragment,{children:[e.jsx("section",{className:t,children:e.jsx(C,{children:e.jsx(T,{children:e.jsxs(k,{md:"12",children:[e.jsxs("div",{className:l,dir:h?"rtl":"ltr",children:[e.jsx("h4",{className:"blog-suptitle",children:S(i,"blog.sectionSup",o==="ar"?"أخبارنا":"Our News")}),e.jsx("h2",{className:`blog-title ${r}`,children:S(i,"blog.sectionTitle",o==="ar"?"اقرأ المدونة":"Check Blogs")}),a?e.jsx("hr",{role:"tournament6"}):e.jsx("div",{className:"line",children:e.jsx("span",{})})]}),u?e.jsx("p",{className:"text-center my-4 blog-muted",children:S(i,"blog.loading",o==="ar"?"جارٍ التحميل…":"Loading…")}):N?e.jsx("p",{className:"text-center text-danger my-4",children:N}):m===0?e.jsx("p",{className:"text-center my-4 blog-muted",children:S(i,"blog.empty",o==="ar"?"لا توجد مقالات":"No blog posts.")}):e.jsx(z,{...f,className:"slide-3 no-arrow slick-default-margin blog-slider",children:A.map(g=>{const{title:p,content:L}=fe(g,o),F=be(L,150),w=g.created_at?pe(g.created_at,o==="ar"?"ar-EG":"en-US"):"";return e.jsx("div",{children:e.jsxs("div",{className:`blog-card ${h?"rtl":"ltr"}`,children:[e.jsx(D,{href:R(g),className:"blog-card-media",children:e.jsxs("div",{className:"classic-effect",children:[e.jsx(O,{src:g.image_path||g.image||g.img,className:"img-fluid",alt:p}),e.jsx("span",{})]})}),e.jsxs("div",{className:"blog-details",children:[e.jsx("h4",{className:"blog-item-title",title:p,children:p}),e.jsx(D,{href:R(g),className:"blog-desc-link",children:e.jsx("p",{className:"blog-desc",title:F,children:F})}),e.jsx("hr",{className:"style1"}),w?e.jsxs("h6",{className:"blog-date",children:[e.jsx("span",{className:"label",children:v})," ",w]}):null]})]})},g.id)})})]})})})}),e.jsx(ue,{css:`
  /* --- NEW: slide gap --- */
  :global(.blog-slider .slick-list){
    margin: 0 -12px;               /* يعادل نصف الـ gap يمين ويسار */
  }
  :global(.blog-slider .slick-slide > div){
    padding: 0 12px;               /* هذا هو الـ gap بين العناصر */
    height: 100%;
    box-sizing: border-box;
  }
  :global(.blog-slider .slick-track){
    display: flex !important;
    align-items: stretch;
  }
  :global(.blog-slider .slick-slide){
    display: flex !important;
  }

  /* Card container */
  .blog-card{
    /* كان: width: 33.333vw; max-width: 33.333vw; */
    width: 100%;
    max-width: 100%;
    background: #fff;
    border-radius: 14px;
    overflow: hidden;
    box-shadow: 0 2px 10px rgba(16, 24, 40, 0.06);
    transition: transform 160ms ease, box-shadow 160ms ease;
    display: flex;                 /* يضمن تساوي الارتفاعات */
    flex-direction: column;
  }
  .blog-card:hover{
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(16, 24, 40, 0.12);
  }

  .blog-card.ltr{ direction:ltr; text-align:left; }
  .blog-card.rtl{ direction:rtl; text-align:right; }

  /* Image */
  .blog-card-media{ display:block; }
  .blog-card-media :global(img){
    width: 100%;
    height: auto;
    aspect-ratio: 16 / 9;
    object-fit: cover;
    display: block;
  }

  /* Details */
  .blog-details{
    padding: 20px;
    flex: 1;                       /* يشد التفاصيل لملء الكارد */
    display: flex;
    flex-direction: column;
  }

  .blog-item-title{
    font-size: 1.05rem;
    line-height: 1.35;
    margin: 4px 0 6px;
    font-weight: 700;
    color: #111827;
  }

  .blog-desc{
    color: #4b5563;
    font-size: 0.92rem;
    line-height: 2;
    margin: 0 0 16px;              /* إزالة margin الكبيرة السابقة */
    flex: 1;                        /* تخلي الملخص يتمدد */
  }
  .blog-desc-link{ text-decoration:none; }

  .blog-date{
    margin: 0;
    font-size: 0.85rem;
    color: #6b7280;
    display: flex;
    gap: 6px;
    align-items: baseline;
    padding-bottom: 12px;
  }
  .blog-date .label{
    color: #374151;
    font-weight: 600;
  }

  .blog-suptitle{
    color: #0b6b37;
    letter-spacing: .02em;
    margin-bottom: 4px;
    font-weight: 700;
    text-transform: uppercase;
    font-size: .9rem;
  }
  .blog-title{ margin: 2px 0 8px; }

  @media (max-width: 576px){
    :global(.blog-slider .slick-list){ margin: 0 -8px; }
    :global(.blog-slider .slick-slide > div){ padding: 0 8px; }
    .blog-details{ padding: 12px; }
    .blog-item-title{ font-size: 1rem; }
    .blog-desc{ font-size: .9rem; }
  }

  .blog-muted{ color: #6b7280; }
`})]})},G=(s,t,l)=>{try{const r=s?s(t):"";return!r||r===t?l:r}catch{return l}},Ne=({type:s})=>{const{t,isRTL:l}=_(),[r,a]=n.useState([]),[i,o]=n.useState(!0),h=G(t,"gallery.title",l?"المعرض":"Gallery"),c=G(t,"gallery.imageAlt",l?"صورة من المعرض":"Gallery image");n.useEffect(()=>{let u=!0;return(async()=>{try{const b=await ne();console.log(b),u&&Array.isArray(b)&&a(b)}finally{u&&o(!1)}})(),()=>{u=!1}},[s]);const d=n.useMemo(()=>({...ae,rtl:!!l}),[l]);return e.jsx(C,{children:e.jsx(T,{children:e.jsxs(k,{md:"12",children:[e.jsx("h2",{className:"title-borderless",style:{textAlign:"center",marginBottom:"50px"},"aria-label":h,children:h}),e.jsx(z,{...d,className:"slide-5 no-arrow slick-instagram",children:i?Array.from({length:5}).map((u,b)=>e.jsx("div",{children:e.jsx("div",{className:"instagram-box",style:{width:"100%",paddingTop:"100%",background:"rgba(0,0,0,0.05)"},"aria-hidden":"true"})},`ph-${b}`)):r.map((u,b)=>{const N=u.url||"#",x=!!u.url,A=u.alt||`${c} ${b+1}`;return e.jsx("div",{children:e.jsx("a",{href:N,target:x?"_blank":void 0,rel:x?"noreferrer":void 0,"aria-label":h,children:e.jsxs("div",{className:"instagram-box",children:[e.jsx("img",{src:u.image_path,className:"bg-img",alt:A,style:{width:"100%"},loading:"lazy"}),e.jsx("div",{className:"overlay",children:e.jsx("i",{className:"fa fa-image","aria-hidden":"true"})})]})})},u.id||b)})})]})})})},W=(s,t,l)=>{try{const r=s?s(t):"";return!r||r===t?l:r}catch{return l}},Qe=()=>{const{t:s,isRTL:t}=_();n.useEffect(()=>{document.documentElement.style.setProperty("--theme-deafult","#0b6b37"),document.documentElement.setAttribute("dir",t?"rtl":"ltr")},[t]);const l=W(s,"home.collections.subtitle",t?"عرض خاص":"Special Offer"),r=W(s,"home.collections.title",t?"مجموعاتنا":"Our Collections");return e.jsxs(e.Fragment,{children:[e.jsx(X,{}),e.jsx(ee,{}),e.jsx(se,{}),e.jsx(me,{type:"shoes",line:!0,innerClass:"title3",inner:"title-inner3",title:r,subtitle:l,designClass:"section-b-space p-t-0 ratio_asos",productSlider:ie,noSlider:"true",cartClass:"cart-info"}),e.jsx(Z,{}),e.jsx(xe,{type:"shoes"}),e.jsx(je,{type:"shoes",sectionClass:"blog blog-bg section-b-space ratio2_3",inner:"title-inner3",title:"title3"}),e.jsx(ce,{sectionClass:"service border-section small-section border-top-0"}),e.jsx("section",{className:"instagram ratio_square section-b-space",children:e.jsx(Ne,{type:"shoes"})})]})};export{Qe as default};
