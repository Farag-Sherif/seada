import{r as o,j as r}from"./index-SMLiIMwR.js";import{C as v}from"./Container-BdWfrw1a.js";import{R as a}from"./Row-D4ZfY8NV.js";import{C as t}from"./Col-CNoyJ9_v.js";import{M as h}from"./Media-D-l4SfND.js";import{S as l}from"./index-Ck_5nnyf.js";import n from"./image-zoom-BiAtKaYf.js";import S from"./detail-box-BgnsvCt_.js";import w from"./accordian_exple-D5KVlWLG.js";import{u as N,g as E}from"./useQuery-DM0uTPbv.js";import"./utils-D8f00ew-.js";import"./Input-Bvr01ymB.js";import"./countdownComponent-BsoXt5j2.js";import"./index.es-Gx5RFUZ1.js";import"./useLanguage-gITJRiEG.js";import"./Card-D_TF7DFj.js";import"./CardBody-BfCd8RLE.js";import"./CardHeader-MqMQQlOZ.js";import"./Collapse-DRKSGe6u.js";import"./Transition-DjRsfRz0.js";import"./master_social-CBY0YeUC.js";const R=E`
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
`,Z=()=>{const[m,p]=o.useState({nav1:null,nav2:null}),c=o.useRef(),d=o.useRef();var{loading:u,data:s}=N(R,{variables:{id:1}}),x={slidesToShow:1,slidesToScroll:1,dots:!1,arrows:!0,fade:!0},f={slidesToShow:3,swipeToSlide:!0,arrows:!1,dots:!1,focusOnSelect:!0};o.useEffect(()=>{p({nav1:c.current,nav2:d.current})},[s]);const{nav1:j,nav2:g}=m;return r.jsx("section",{children:r.jsx("div",{className:"collection-wrapper",children:r.jsx(v,{children:!s||!s.product||s.product.length===0||u?"loading":r.jsxs(a,{className:"leftImage",children:[r.jsxs(t,{lg:"4",children:[r.jsx(a,{children:r.jsx(t,{children:r.jsx(l,{...x,asNavFor:g,ref:e=>c.current=e,className:"product-right-slick",children:s.product.variants?s.product.images.map((e,i)=>r.jsx("div",{children:r.jsx(n,{image:e})},i)):s.product.images.map((e,i)=>r.jsx("div",{children:r.jsx(n,{image:e})},i))})})}),r.jsx(a,{children:r.jsx(t,{xs:"12",children:r.jsx(l,{className:"slider-nav",...f,asNavFor:j,ref:e=>d.current=e,children:s.product.variants?s.product.images.map((e,i)=>r.jsx("div",{children:r.jsx(h,{src:`${e.src}`,alt:e.alt,className:"img-fluid"},i)},i)):""})})})]}),r.jsx(t,{lg:"4",children:r.jsx(w,{})}),r.jsx(t,{lg:"4",children:r.jsx(S,{item:s.product})})]})})})})};export{Z as default};
