import{r as i,j as r}from"./index-SMLiIMwR.js";import{C as h}from"./Container-BdWfrw1a.js";import{R as l}from"./Row-D4ZfY8NV.js";import{C as o}from"./Col-CNoyJ9_v.js";import{M as j}from"./Media-D-l4SfND.js";import S from"./detail-price-CGFKyHuU.js";import{S as d}from"./index-Ck_5nnyf.js";import N from"./image-zoom-BiAtKaYf.js";import{u as w,g as R}from"./useQuery-DM0uTPbv.js";import"./utils-D8f00ew-.js";import"./NextLinkCompat-B6pDUoE-.js";import"./ModalBody-D0sBAK0O.js";import"./Fade-Dxq_8SEO.js";import"./Transition-DjRsfRz0.js";import"./ModalHeader-GnU9_lqp.js";import"./Input-Bvr01ymB.js";import"./size-chart-CSk4pPDI.js";import"./useLanguage-gITJRiEG.js";import"./StyleTag-1J5wyURP.js";const T=R`
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
        color
        image_id
        variant_id
        size
      }
      images {
        image_id
        src
      }
    }
  }
`,V=()=>{const[n,m]=i.useState({nav1:null,nav2:null}),c=i.useRef(),a=i.useRef();var{loading:p,data:e}=w(T,{variables:{id:1}}),u={slidesToShow:1,slidesToScroll:1,dots:!1,arrows:!0,fade:!0},g={slidesToShow:3,swipeToSlide:!0,arrows:!1,vertical:!0,dots:!1,focusOnSelect:!0,responsive:[{breakpoint:576,settings:{vertical:!1}}]};i.useEffect(()=>{m({nav1:c.current,nav2:a.current})},[e]);const f=s=>{a.current.slickGoTo(s)},{nav1:v,nav2:x}=n;return r.jsx("section",{children:r.jsx("div",{className:"collection-wrapper",children:r.jsx(h,{children:!e||!e.product||e.product.length===0||p?"loading":r.jsxs(l,{className:"rightImage",children:[r.jsx(o,{lg:"5",sm:"10",xs:"12",children:r.jsx(d,{...u,asNavFor:x,ref:s=>c.current=s,className:"product-right-slick",children:e.product.images.map((s,t)=>r.jsx("div",{children:r.jsx(N,{image:s})},t))})}),r.jsx(o,{lg:"1",sm:"2",xs:"12",className:"order-down",children:r.jsx(l,{children:r.jsx(d,{className:"slider-nav",...g,asNavFor:v,ref:s=>a.current=s,children:e.product.variants?e.product.images.map((s,t)=>r.jsx("div",{children:r.jsx(j,{src:`${s.src}`,alt:s.alt,className:"img-fluid"},t)},t)):""})})}),r.jsx(o,{lg:"6",className:"rtl-text",children:r.jsx(S,{changeColorVar:f,item:e.product})})]})})})})};export{V as default};
