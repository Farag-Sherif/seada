import{r as a,b as N,C as S,j as r}from"./index-SMLiIMwR.js";import{C as T}from"./Container-BdWfrw1a.js";import{R as d}from"./Row-D4ZfY8NV.js";import{C as i}from"./Col-CNoyJ9_v.js";import{M as w}from"./Media-D-l4SfND.js";import y from"./detail-price-CGFKyHuU.js";import{S as l}from"./index-Ck_5nnyf.js";import m from"./image-zoom-BiAtKaYf.js";import{u as R,g as b}from"./useQuery-DM0uTPbv.js";import"./utils-D8f00ew-.js";import"./NextLinkCompat-B6pDUoE-.js";import"./ModalBody-D0sBAK0O.js";import"./Fade-Dxq_8SEO.js";import"./Transition-DjRsfRz0.js";import"./ModalHeader-GnU9_lqp.js";import"./Input-Bvr01ymB.js";import"./size-chart-CSk4pPDI.js";import"./useLanguage-gITJRiEG.js";import"./StyleTag-1J5wyURP.js";const E=b`
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
`,J=()=>{const p=a.useContext(N).addToCart,u=a.useContext(S).state.symbol,[c,x]=a.useState({nav1:null,nav2:null}),n=a.useRef(),o=a.useRef();var{loading:f,data:s}=R(E,{variables:{id:1}}),g={slidesToShow:1,slidesToScroll:1,dots:!1,arrows:!0,fade:!0,infinite:!1},v={slidesToShow:3,swipeToSlide:!0,arrows:!1,dots:!1,vertical:!0,focusOnSelect:!0,infinite:!1};a.useEffect(()=>{x({nav1:n.current,nav2:o.current})},[s]);const h=t=>{o.current.slickGoTo(t)},{nav1:j,nav2:C}=c;return r.jsx("section",{children:r.jsx("div",{className:"collection-wrapper",children:r.jsx(T,{children:!s||!s.product||s.product.length===0||f?"loading":r.jsxs(d,{className:"leftImage",children:[r.jsx(i,{lg:"1",sm:"2",xs:"12",className:"order-down",children:r.jsx(d,{children:r.jsx(l,{className:"slider-nav",...v,asNavFor:j,ref:t=>o.current=t,children:s.product.variants?s.product.images.map((t,e)=>r.jsx("div",{children:r.jsx(w,{src:`${t.src}`,alt:t.alt,className:"img-fluid"},e)},e)):""})})}),r.jsx(i,{lg:"5",sm:"10",xs:"12",className:"order-up",children:r.jsx(l,{...g,asNavFor:C,ref:t=>n.current=t,className:"product-right-slick",children:s.product.variants?s.product.images.map((t,e)=>r.jsx("div",{children:r.jsx(m,{image:t})},e)):s.product.images.map((t,e)=>r.jsxs("div",{children:[r.jsx("h1",{children:"dhdhd"}),r.jsx(m,{image:t})]},e))})}),r.jsx(i,{lg:"6",className:"rtl-text",children:r.jsx(y,{symbol:u,item:s.product,changeColorVar:h,navOne:c.nav1,addToCartClicked:p})})]})})})})};export{J as default};
