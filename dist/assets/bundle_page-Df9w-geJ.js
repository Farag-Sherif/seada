import{r as c,j as s}from"./index-SMLiIMwR.js";import{C as b}from"./Container-BdWfrw1a.js";import{R as n}from"./Row-D4ZfY8NV.js";import{C as t}from"./Col-CNoyJ9_v.js";import{I as o}from"./Input-Bvr01ymB.js";import{M as l}from"./Media-D-l4SfND.js";import v from"./detail-price-CGFKyHuU.js";import{S as m}from"./index-Ck_5nnyf.js";import{s as k,a as y}from"./skirt-D2Unx1x8.js";import{o as S}from"./001-Dt6CMOxs.js";import _ from"./image-zoom-BiAtKaYf.js";import{u as w,g as T}from"./useQuery-DM0uTPbv.js";import"./utils-D8f00ew-.js";import"./NextLinkCompat-B6pDUoE-.js";import"./ModalBody-D0sBAK0O.js";import"./Fade-Dxq_8SEO.js";import"./Transition-DjRsfRz0.js";import"./ModalHeader-GnU9_lqp.js";import"./size-chart-CSk4pPDI.js";import"./useLanguage-gITJRiEG.js";import"./StyleTag-1J5wyURP.js";const C=T`
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
`,Z=()=>{const[p,u]=c.useState({nav1:null,nav2:null}),d=c.useRef(),i=c.useRef();var{loading:h,data:r}=w(C,{variables:{id:1}}),x={slidesToShow:1,slidesToScroll:1,dots:!1,arrows:!0,fade:!0},j={slidesToShow:3,swipeToSlide:!0,arrows:!1,dots:!1,focusOnSelect:!0};c.useEffect(()=>{u({nav1:d.current,nav2:i.current})},[r]);const f=e=>{i.current.slickGoTo(e)},{nav1:N,nav2:g}=p;return s.jsx("section",{children:s.jsx("div",{className:"collection-wrapper",children:s.jsx(b,{children:!r||!r.product||r.product.length===0||h?"loading":s.jsxs(n,{className:"leftImage",children:[s.jsxs(t,{lg:"6",children:[s.jsx(m,{...x,asNavFor:g,ref:e=>d.current=e,className:"product-right-slick",children:r.product.images.map((e,a)=>s.jsx("div",{children:s.jsx(_,{image:e})},a))}),s.jsx(n,{children:s.jsx(t,{sm:"12",children:s.jsx(m,{className:"slider-nav",...j,asNavFor:N,ref:e=>i.current=e,children:r.product.variants?r.product.images.map((e,a)=>s.jsx("div",{children:s.jsx(l,{src:`${e.src}`,alt:e.alt,className:"img-fluid"},a)},a)):""})})})]}),s.jsxs(t,{lg:"6",className:"rtl-text",children:[s.jsx(v,{changeColorVar:f,item:r.product}),s.jsx("div",{className:"product-right",children:s.jsxs("div",{className:"border-product",children:[s.jsx("h6",{className:"product-title mb-1",children:"Frequently bought together"}),s.jsxs("div",{className:"bundle",children:[s.jsxs("div",{className:"bundle_img",children:[s.jsx("div",{className:"img-box",children:s.jsx("a",{href:"#",children:s.jsx(l,{src:S.src,alt:"",className:"img-fluid blur-up lazyload"})})}),s.jsx("span",{className:"plus",children:"+"}),s.jsx("div",{className:"img-box",children:s.jsx("a",{href:"#",children:s.jsx(l,{src:k.src,alt:"",className:"img-fluid blur-up lazyload"})})}),s.jsx("span",{className:"plus",children:"+"}),s.jsx("div",{className:"img-box",children:s.jsx("a",{href:"#",children:s.jsx(l,{src:y.src,alt:"",className:"img-fluid blur-up lazyload"})})})]}),s.jsx("div",{className:"bundle_detail",children:s.jsxs("div",{className:"theme_checkbox",children:[s.jsxs("label",{children:["this product: WOMEN BLACK SHIRT"," ",s.jsx("span",{className:"price_product",children:"$55"}),s.jsx(o,{type:"checkbox"}),s.jsx("span",{className:"checkmark"})]}),s.jsxs("label",{children:["black long skirt"," ",s.jsx("span",{className:"price_product",children:"$20"}),s.jsx(o,{type:"checkbox"}),s.jsx("span",{className:"checkmark"})]}),s.jsxs("label",{children:["women heeled boots"," ",s.jsx("span",{className:"price_product",children:"$15"}),s.jsx(o,{type:"checkbox"}),s.jsx("span",{className:"checkmark"})]}),s.jsx("a",{href:"#",className:"btn btn-solid btn-xs",children:"buy this bundle"})]})})]})]})})]})]})})})})};export{Z as default};
