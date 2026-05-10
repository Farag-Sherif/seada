import{r as i,j as r}from"./index-SMLiIMwR.js";import{C as v}from"./Container-BdWfrw1a.js";import{R as l}from"./Row-D4ZfY8NV.js";import{C as a}from"./Col-CNoyJ9_v.js";import{M as S}from"./Media-D-l4SfND.js";import{S as d}from"./index-Ck_5nnyf.js";import n from"./image-zoom-BiAtKaYf.js";import N from"./detail-box-BgnsvCt_.js";import w from"./detailPage-BX4ZoZcE.js";import{u as T,g as C}from"./useQuery-DM0uTPbv.js";import"./utils-D8f00ew-.js";import"./Input-Bvr01ymB.js";import"./countdownComponent-BsoXt5j2.js";import"./index.es-Gx5RFUZ1.js";import"./useLanguage-gITJRiEG.js";import"./master_social-CBY0YeUC.js";const R=C`
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
`,B=()=>{const[m,p]=i.useState({nav1:null,nav2:null}),c=i.useRef(),o=i.useRef();var{loading:u,data:e}=T(R,{variables:{id:1}}),x={slidesToShow:1,slidesToScroll:1,dots:!1,arrows:!0,fade:!0},f={slidesToShow:3,swipeToSlide:!0,arrows:!1,dots:!1,vertical:!0,focusOnSelect:!0};const g=s=>{o.current.slickGoTo(s)};i.useEffect(()=>{p({nav1:c.current,nav2:o.current})},[e]);const{nav1:h,nav2:j}=m;return r.jsx("section",{children:r.jsx("div",{className:"collection-wrapper",children:r.jsx(v,{children:!e||!e.product||e.product.length===0||u?"loading":r.jsxs(l,{className:"thumbnail-col",children:[r.jsx(a,{lg:"1",sm:"2",xs:"12",className:"p-0 pb-cls-slider",children:r.jsx(d,{className:"slider-nav",...f,asNavFor:h,ref:s=>o.current=s,children:e.product.variants?e.product.images.map((s,t)=>r.jsx("div",{children:r.jsx(S,{src:`${s.src}`,alt:s.alt,className:"img-fluid"},t)},t)):""})}),r.jsx(a,{lg:"3",sm:"10",xs:"12",className:"order-up",children:r.jsx(l,{children:r.jsx(a,{children:r.jsx(d,{...x,asNavFor:j,ref:s=>c.current=s,className:"product-right-slick",children:e.product.variants?e.product.images.map((s,t)=>r.jsx("div",{children:r.jsx(n,{image:s})},t)):e.product.images.map((s,t)=>r.jsx("div",{children:r.jsx(n,{image:s})},t))})})})}),r.jsx(a,{lg:"4",children:r.jsx(w,{item:e.product})}),r.jsx(a,{lg:"4",children:r.jsx(N,{item:e.product,changeColorVar:g})})]})})})})};export{B as default};
