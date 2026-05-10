import{r as o,C,j as r}from"./index-SMLiIMwR.js";import{C as S}from"./Container-BdWfrw1a.js";import{R as c}from"./Row-D4ZfY8NV.js";import{C as a}from"./Col-CNoyJ9_v.js";import{M as N}from"./Media-D-l4SfND.js";import{S as n}from"./index-Ck_5nnyf.js";import d from"./image-zoom-BiAtKaYf.js";import w from"./detail-box-BgnsvCt_.js";import T from"./detailPage-BX4ZoZcE.js";import{u as R,g as y}from"./useQuery-DM0uTPbv.js";import"./utils-D8f00ew-.js";import"./Input-Bvr01ymB.js";import"./countdownComponent-BsoXt5j2.js";import"./index.es-Gx5RFUZ1.js";import"./useLanguage-gITJRiEG.js";import"./master_social-CBY0YeUC.js";const E=y`
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
`,V=()=>{const m=o.useContext(C).state.symbol,[p,u]=o.useState({nav1:null,nav2:null}),l=o.useRef(),i=o.useRef();var{loading:x,data:e}=R(E,{variables:{id:1}}),f={slidesToShow:1,slidesToScroll:1,dots:!1,arrows:!0,fade:!0},g={slidesToShow:3,swipeToSlide:!0,arrows:!1,dots:!1,focusOnSelect:!0};o.useEffect(()=>{u({nav1:l.current,nav2:i.current})},[e]);const h=s=>{i.current.slickGoTo(s)},{nav1:j,nav2:v}=p;return r.jsx("section",{children:r.jsx("div",{className:"collection-wrapper",children:r.jsx(S,{children:!e||!e.product||e.product.length===0||x?"loading":r.jsxs(c,{className:"leftImage",children:[r.jsxs(a,{lg:"4",children:[r.jsx(c,{children:r.jsx(a,{children:r.jsx(n,{...f,asNavFor:v,ref:s=>l.current=s,className:"product-right-slick",children:e.product.variants?e.product.images.map((s,t)=>r.jsx("div",{children:r.jsx(d,{image:s})},t)):e.product.images.map((s,t)=>r.jsx("div",{children:r.jsx(d,{image:s})},t))})})}),r.jsx(c,{children:r.jsx(a,{xs:"12",className:"",children:r.jsx(n,{className:"slider-nav",...g,asNavFor:j,ref:s=>i.current=s,children:e.product.variants?e.product.images.map((s,t)=>r.jsx("div",{children:r.jsx(N,{src:`${s.src}`,alt:s.alt,className:"img-fluid"},t)},t)):""})})})]}),r.jsx(a,{lg:"4",children:r.jsx(T,{item:e.product})}),r.jsx(a,{lg:"4",children:r.jsx(w,{symbol:m,item:e.product,changeColorVar:h})})]})})})})};export{V as default};
