import{r as e,b as v,C as g,j as r}from"./index-SMLiIMwR.js";import C from"./vertical-product-tab-DIl7_W9l.js";import{S as l}from"./index-Ck_5nnyf.js";import N from"./image-zoom-BiAtKaYf.js";import S from"./detail-price-CGFKyHuU.js";import{C as T}from"./Container-BdWfrw1a.js";import{R as n}from"./Row-D4ZfY8NV.js";import{C as i}from"./Col-CNoyJ9_v.js";import{M as w}from"./Media-D-l4SfND.js";import{u as b,g as R}from"./useQuery-DM0uTPbv.js";import"./TabPane-CXZ8u8gX.js";import"./utils-D8f00ew-.js";import"./NextLinkCompat-B6pDUoE-.js";import"./ModalBody-D0sBAK0O.js";import"./Fade-Dxq_8SEO.js";import"./Transition-DjRsfRz0.js";import"./ModalHeader-GnU9_lqp.js";import"./Input-Bvr01ymB.js";import"./size-chart-CSk4pPDI.js";import"./useLanguage-gITJRiEG.js";import"./StyleTag-1J5wyURP.js";const y=R`
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
`,X=({pathId:E})=>{e.useContext(v).addToCart,e.useContext(g).state.symbol;const[d,m]=e.useState({nav1:null,nav2:null}),c=e.useRef(),a=e.useRef();var{loading:p,data:s}=b(y,{variables:{id:1}}),u={slidesToShow:1,slidesToScroll:1,dots:!1,arrows:!0,fade:!0},x={slidesToShow:3,swipeToSlide:!0,arrows:!1,dots:!1,focusOnSelect:!0};const f=t=>{a.current.slickGoTo(t)};e.useEffect(()=>{m({nav1:c.current,nav2:a.current})},[s]);const{nav1:h,nav2:j}=d;return r.jsx("section",{className:"",children:r.jsx("div",{className:"collection-wrapper",children:r.jsx(T,{children:r.jsx(n,{children:r.jsxs(i,{sm:"12",xs:"12",children:[r.jsx("div",{className:"",children:!s||!s.product||s.product.length===0||p?"loading":r.jsxs(n,{children:[r.jsxs(i,{lg:"6",className:"product-thumbnail m-0-cls",children:[r.jsx(l,{...u,asNavFor:j,ref:t=>c.current=t,className:"product-slick",children:s.product.images.map((t,o)=>r.jsx("div",{children:r.jsx(N,{image:t})},o))}),r.jsx(l,{className:"slider-nav",...x,asNavFor:h,ref:t=>a.current=t,children:s.product.variants?s.product.images.map((t,o)=>r.jsx("div",{children:r.jsx(w,{src:`${t.src}`,alt:t.alt,className:"img-fluid"},o)},o)):""})]}),r.jsx(i,{lg:"6",className:"rtl-text",children:r.jsx(S,{item:s.product,changeColorVar:f})})]})}),r.jsx(C,{})]})})})})})};export{X as default};
