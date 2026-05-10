import{r as o,j as r}from"./index-SMLiIMwR.js";import v from"./product-tab-hlIw3TrF.js";import{S as l}from"./index-Ck_5nnyf.js";import g from"./image-zoom-BiAtKaYf.js";import N from"./detail-price-CGFKyHuU.js";import{C as S}from"./Container-BdWfrw1a.js";import{R as d}from"./Row-D4ZfY8NV.js";import{C as i}from"./Col-CNoyJ9_v.js";import{M as w}from"./Media-D-l4SfND.js";import{u as T,g as C}from"./useQuery-DM0uTPbv.js";import"./TabPane-CXZ8u8gX.js";import"./utils-D8f00ew-.js";import"./useLanguage-gITJRiEG.js";import"./StyleTag-1J5wyURP.js";import"./NextLinkCompat-B6pDUoE-.js";import"./ModalBody-D0sBAK0O.js";import"./Fade-Dxq_8SEO.js";import"./Transition-DjRsfRz0.js";import"./ModalHeader-GnU9_lqp.js";import"./Input-Bvr01ymB.js";import"./size-chart-CSk4pPDI.js";const R=C`
  query product($id: Int!) {
    product(id: $id) {
      id
      title
      description
      type
      brand
      category
      price
      new
      sale
      discount
      stock
      variants {
        id
        sku
        size
        color
        image_id
      }
      images {
        alt
        src
      }
    }
  }
`,B=({pathId:b})=>{const[n,m]=o.useState({nav1:null,nav2:null}),c=o.useRef(),a=o.useRef();var{loading:p,data:t}=T(R,{variables:{id:1}}),u={slidesToShow:1,slidesToScroll:1,dots:!1,arrows:!0,fade:!0},f={slidesToShow:3,swipeToSlide:!0,arrows:!1,dots:!1,focusOnSelect:!0};const x=s=>{a.current.slickGoTo(s)};o.useEffect(()=>{m({nav1:c.current,nav2:a.current})},[t]);const{nav1:h,nav2:j}=n;return r.jsx("section",{className:"",children:r.jsx("div",{className:"collection-wrapper",children:r.jsx(S,{children:r.jsx(d,{children:r.jsxs(i,{sm:"12",xs:"12",children:[r.jsx("div",{className:"container-fluid",children:!t||!t.product||t.product.length===0||p?"loading":r.jsxs(d,{children:[r.jsxs(i,{lg:"6",className:"product-thumbnail",children:[r.jsx(l,{...u,asNavFor:j,ref:s=>c.current=s,className:"product-slick",children:t.product.images.map((s,e)=>r.jsx("div",{children:r.jsx(g,{image:s})},e))}),r.jsx(l,{className:"slider-nav",...f,asNavFor:h,ref:s=>a.current=s,children:t.product.variants?t.product.images.map((s,e)=>r.jsx("div",{children:r.jsx(w,{src:`${s.src}`,alt:s.alt,className:"img-fluid"},e)},e)):""})]}),r.jsx(i,{lg:"6",className:"rtl-text",children:r.jsx(N,{changeColorVar:x,item:t.product})})]})}),r.jsx(v,{})]})})})})})};export{B as default};
