import{r as n,j as e}from"./index-SMLiIMwR.js";import{C as w}from"./Container-BdWfrw1a.js";import{R as j}from"./Row-D4ZfY8NV.js";import{C as h}from"./Col-CNoyJ9_v.js";import{S as N}from"./index-Ck_5nnyf.js";import _ from"./product-tab-hlIw3TrF.js";import A from"./image-zoom-BiAtKaYf.js";import S from"./detail-price-CGFKyHuU.js";import{u as z}from"./useLanguage-gITJRiEG.js";import{a as C}from"./products-ijfk4fJI.js";import{S as M}from"./StyleTag-1J5wyURP.js";import"./utils-D8f00ew-.js";import"./TabPane-CXZ8u8gX.js";import"./Media-D-l4SfND.js";import"./NextLinkCompat-B6pDUoE-.js";import"./ModalBody-D0sBAK0O.js";import"./Fade-Dxq_8SEO.js";import"./Transition-DjRsfRz0.js";import"./ModalHeader-GnU9_lqp.js";import"./Input-Bvr01ymB.js";import"./size-chart-CSk4pPDI.js";import"./api-DM-tDIGU.js";const x=(t,o,r)=>{try{const i=t?t(o):"";return!i||i===o?r:i}catch{return r}},y=(t,o)=>{var m,g,p,b;if(!t)return null;const r=Array.isArray(t.translations)?t.translations.find(s=>s.locale===(o?"ar":"en"))||t.translations.find(s=>s.locale===(o?"en":"ar")):null,i=(r==null?void 0:r.name)||t.name||"",a=(r==null?void 0:r.description)||t.description||"",c=(r==null?void 0:r.weight)||t.weight||"",d=[];t.image_path&&d.push({alt:i,src:t.image_path}),Array.isArray(t.media)&&t.media.forEach(s=>d.push({alt:i,src:s.image_path,id:s.id}));const u=((p=(g=(m=t.category)==null?void 0:m.translations)==null?void 0:g.find(s=>s.locale===(o?"ar":"en")))==null?void 0:p.name)||((b=t.category)==null?void 0:b.name)||"";return{id:t.id,title:i,descriptionHtml:a,weight:c,price:Number(t.total??t.price??0),discount:Number(t.discount??0),stock:t.is_available?99:0,serial_number:t.serial_number||"",stock_number:t.stock_number||"",categoryName:u,images:d,raw:t}},v=({dir:t="left"})=>e.jsx("svg",{width:"22",height:"22",viewBox:"0 0 24 24","aria-hidden":"true",children:t==="left"?e.jsx("path",{d:"M15.41 7.41 14 6l-6 6 6 6 1.41-1.41L10.83 12z"}):e.jsx("path",{d:"M8.59 16.59 10 18l6-6-6-6-1.41 1.41L13.17 12z"})}),R=({onClick:t,className:o,style:r,isRTL:i})=>e.jsx("button",{type:"button","aria-label":"previous",className:`slick-arrow slick-prev ${o||""}`,onClick:t,style:{...r},children:e.jsx(v,{dir:i?"right":"left"})}),T=({onClick:t,className:o,style:r,isRTL:i})=>e.jsx("button",{type:"button","aria-label":"next",className:`slick-arrow slick-next ${o||""}`,onClick:t,style:{...r},children:e.jsx(v,{dir:i?"left":"right"})}),et=({pathId:t,prefetched:o=null})=>{const{t:r,isRTL:i}=z(),[a,c]=n.useState(null),[d,u]=n.useState(!o),m=n.useRef(null),g=n.useMemo(()=>({slidesToShow:1,slidesToScroll:1,dots:!1,arrows:!0,fade:!1,rtl:!!i,adaptiveHeight:!1,infinite:!0,speed:400,swipe:!0,swipeToSlide:!0,lazyLoad:"ondemand",prevArrow:e.jsx(R,{isRTL:i}),nextArrow:e.jsx(T,{isRTL:i}),responsive:[{breakpoint:992,settings:{arrows:!0}},{breakpoint:576,settings:{arrows:!0}}]}),[i]),p=s=>{var l,f;(f=(l=m.current)==null?void 0:l.slickGoTo)==null||f.call(l,s)},b=n.useMemo(()=>({tabs:{details:x(r,"product.tabs.details",i?"التفاصيل":"Details"),description:x(r,"product.tabs.description",i?"الوصف":"Description")},fields:{weight:x(r,"product.details.weight",i?"الوزن":"Weight"),category:x(r,"product.details.category",i?"القسم":"Category")}}),[r,i]);return n.useEffect(()=>{let s=!0;return o?(c(y(o,i)),u(!1)):t&&(async f=>{try{u(!0);const k=await C(Number(f||1));if(!s)return;c(y(k==null?void 0:k.item,i))}catch{s&&c(null)}finally{s&&u(!1)}})(t),()=>{s=!1}},[t,o,i]),e.jsxs("section",{dir:i?"rtl":"ltr",children:[e.jsx("div",{className:"collection-wrapper",children:e.jsx(w,{children:e.jsx(j,{children:e.jsx(h,{sm:"12",xs:"12",children:e.jsx("div",{className:"container-fluid",children:d?"loading":a?e.jsxs(j,{className:"g-4",style:{justifyContent:"space-between"},children:[e.jsx(h,{lg:"5",className:"product-thumbnail",children:e.jsx("div",{className:"zoom-frame",children:e.jsx(N,{...g,ref:m,className:"product-slick",children:(a.images||[]).map((s,l)=>e.jsx("div",{className:"slide-inner",children:e.jsx(A,{image:s})},l))},`gallery-${i?"rtl":"ltr"}-${a.id}`)})}),e.jsxs(h,{lg:"6",className:"rtl-text",children:[e.jsx(S,{item:a,changeColorVar:p}),(a.images||[]).length>0&&e.jsx("div",{className:"detail-thumbs mt-4",children:e.jsx(j,{className:"g-2",children:(a.images||[]).slice(0,6).map((s,l)=>e.jsx(h,{xs:"4",sm:"3",md:"2",children:e.jsx("button",{type:"button",className:"thumb-btn",onClick:()=>p(l),"aria-label":`thumb-${l+1}`,children:e.jsx("img",{src:s.src,alt:s.alt||"thumb",style:{width:"100%",height:86,objectFit:"cover",display:"block",background:"#fafafa",borderRadius:8,border:"1px solid #eee",direction:"ltr"}})})},`thumb-${l}`))})})]}),e.jsx(h,{xs:"12",className:"mt-4",style:{marginBottom:"70px"},children:e.jsx(_,{descriptionHtml:a.descriptionHtml,details:{serial_number:a.serial_number,stock_number:a.stock_number,weight:a.weight,category:a.categoryName},labels:b,showVideo:!1,showReview:!1})})]}):"Not found"})})})})}),e.jsx(M,{global:!0,css:`
        .product-thumbnail {
          position: relative;
          z-index: 1;
        }
        .zoom-frame {
          /* Make the main image BIG and responsive */
          width: 100%;
          height: 65vh;
          min-height: 420px;
          max-height: 760px;
          background: #fff;
          border-radius: 12px;
          box-shadow: 0 1px 2px rgba(16, 24, 40, 0.06);
          overflow: hidden;
        }
        @media (max-width: 992px) {
          .zoom-frame {
            height: 54vh;
            min-height: 360px;
          }
        }
        @media (max-width: 576px) {
          .zoom-frame {
            height: 48vh;
            min-height: 300px;
          }
        }

        .product-thumbnail .product-slick,
        .product-thumbnail .product-slick .slick-list,
        .product-thumbnail .product-slick .slick-track,
        .product-thumbnail .product-slick .slick-slide,
        .product-thumbnail .product-slick .slick-slide > div,
        .product-thumbnail .product-slick .slide-inner {
          height: 100%;
        }

        .product-thumbnail .product-slick .slide-inner {
          display: grid;
          place-items: center;
          padding: 8px;
          direction: ltr; /* keep slide content LTR so images never flip */
        }

        /* If ImageZoom renders an img inside, this keeps it nicely contained */
        .product-thumbnail .product-slick img {
          width: 100%;
          height: 100%;
          max-height: 100%;
          object-fit: contain; /* show full image nicely */
          background: #fafafa;
          border-radius: 8px;
        }

        .product-thumbnail .slick-list {
          overflow: hidden !important;
        }

        /* Arrows */
        .product-thumbnail .slick-prev,
        .product-thumbnail .slick-next {
          width: 40px;
          height: 40px;
          z-index: 3;
          top: 50%;
          transform: translateY(-50%);
          display: flex !important;
          align-items: center;
          justify-content: center;
          background: rgba(255, 255, 255, 0.98);
          border: 1px solid #e5e5e5;
          border-radius: 50%;
        }
        .product-thumbnail .slick-prev {
          left: 10px;
          right: auto;
        }
        .product-thumbnail .slick-next {
          right: 10px;
          left: auto;
        }
        .product-thumbnail .slick-prev:before,
        .product-thumbnail .slick-next:before {
          display: none;
        }
        .product-thumbnail .slick-prev svg,
        .product-thumbnail .slick-next svg {
          fill: #333;
        }

        /* Mirror arrow positions for RTL pages */
        [dir="rtl"] .product-thumbnail .slick-prev {
          right: 10px;
          left: auto;
        }
        [dir="rtl"] .product-thumbnail .slick-next {
          left: 10px;
          right: auto;
        }
        [dir="rtl"] .product-thumbnail .slick-slide {
          float: right;
        }

        .thumb-btn {
          padding: 0;
          border: none;
          background: transparent;
          display: block;
          width: 100%;
          cursor: pointer;
        }
      `})]})};export{et as default};
