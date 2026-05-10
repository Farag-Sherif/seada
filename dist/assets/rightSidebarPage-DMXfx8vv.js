import{r as o,j as r}from"./index-SMLiIMwR.js";import g from"./product-tab-hlIw3TrF.js";import N from"./service-BR4UwD51.js";import S from"./newProduct-p9X2P7hv.js";import{S as m}from"./index-Ck_5nnyf.js";import w from"./image-zoom-BiAtKaYf.js";import b from"./detail-price-CGFKyHuU.js";import C from"./filter-Bs3rjJlD.js";import{C as T}from"./Container-BdWfrw1a.js";import{R as l}from"./Row-D4ZfY8NV.js";import{C as t}from"./Col-CNoyJ9_v.js";import{M as R}from"./Media-D-l4SfND.js";import{u as k,g as y}from"./useQuery-DM0uTPbv.js";import"./TabPane-CXZ8u8gX.js";import"./utils-D8f00ew-.js";import"./useLanguage-gITJRiEG.js";import"./StyleTag-1J5wyURP.js";import"./MasterServiceConternt-BlB4a8BT.js";import"./script-6JDTEumQ.js";import"./NextLinkCompat-B6pDUoE-.js";import"./ModalBody-D0sBAK0O.js";import"./Fade-Dxq_8SEO.js";import"./Transition-DjRsfRz0.js";import"./ModalHeader-GnU9_lqp.js";import"./Input-Bvr01ymB.js";import"./size-chart-CSk4pPDI.js";import"./Collapse-DRKSGe6u.js";const E=y`
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
`,tr=()=>{const[d,n]=o.useState({nav1:null,nav2:null}),c=o.useRef(),a=o.useRef();var{loading:p,data:e}=k(E,{variables:{id:1}}),u={slidesToShow:1,slidesToScroll:1,dots:!1,arrows:!0,fade:!0},f={slidesToShow:3,swipeToSlide:!0,arrows:!1,dots:!1,focusOnSelect:!0};const x=()=>{document.getElementById("filter").style.left="-15px"},j=s=>{a.current.slickGoTo(s)};o.useEffect(()=>{n({nav1:c.current,nav2:a.current})},[e]);const{nav1:h,nav2:v}=d;return r.jsx("section",{className:"",children:r.jsx("div",{className:"collection-wrapper",children:r.jsx(T,{children:r.jsxs(l,{children:[r.jsxs(t,{lg:"9",sm:"12",xs:"12",children:[r.jsxs("div",{className:"container-fluid",children:[r.jsx(l,{children:r.jsx(t,{xl:"12",className:"filter-col",children:r.jsx("div",{className:"filter-main-btn mb-2",children:r.jsxs("span",{onClick:x,className:"filter-btn",children:[r.jsx("i",{className:"fa fa-filter","aria-hidden":"true"})," ","filter"]})})})}),!e||!e.product||e.product.length===0||p?"loading":r.jsxs(l,{children:[r.jsxs(t,{lg:"6",className:"product-thumbnail",children:[r.jsx(m,{...u,asNavFor:v,ref:s=>c.current=s,className:"product-slick",children:e.product.images.map((s,i)=>r.jsx("div",{children:r.jsx(w,{image:s})},i))}),r.jsx(m,{className:"slider-nav",...f,asNavFor:h,ref:s=>a.current=s,children:e.product.variants?e.product.images.map((s,i)=>r.jsx("div",{children:r.jsx(R,{src:`${s.src}`,alt:s.alt,className:"img-fluid"},i)},i)):""})]}),r.jsx(t,{lg:"6",className:"rtl-text",children:r.jsx(b,{changeColorVar:j,item:e.product})})]})]}),r.jsx(g,{})]}),r.jsxs(t,{sm:"3",className:"collection-filter",id:"filter",children:[r.jsx(C,{}),r.jsx(N,{}),r.jsx(S,{})]})]})})})})};export{tr as default};
