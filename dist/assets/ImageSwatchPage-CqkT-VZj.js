import{r as c,j as s}from"./index-SMLiIMwR.js";import{C as g}from"./Container-BdWfrw1a.js";import{R as d}from"./Row-D4ZfY8NV.js";import{C as t}from"./Col-CNoyJ9_v.js";import{M as i}from"./Media-D-l4SfND.js";import{S as n}from"./index-Ck_5nnyf.js";import b from"./image-zoom-BiAtKaYf.js";import{s as v,a as k}from"./skirt-D2Unx1x8.js";import{o as S}from"./001-Dt6CMOxs.js";import y from"./swatch-detail-price-C74YvbHs.js";import{u as w,g as _}from"./useQuery-DM0uTPbv.js";import"./utils-D8f00ew-.js";import"./NextLinkCompat-B6pDUoE-.js";import"./size-chart-CSk4pPDI.js";import"./ModalBody-D0sBAK0O.js";import"./Fade-Dxq_8SEO.js";import"./Transition-DjRsfRz0.js";import"./ModalHeader-GnU9_lqp.js";import"./Input-Bvr01ymB.js";import"./countdownComponent-BsoXt5j2.js";import"./index.es-Gx5RFUZ1.js";import"./useLanguage-gITJRiEG.js";import"./master_social-CBY0YeUC.js";import"./002-DK0gvknU.js";const C=_`
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
`,X=()=>{const[m,p]=c.useState({nav1:null,nav2:null}),o=c.useRef(),l=c.useRef();var{loading:u,data:r}=w(C,{variables:{id:1}}),h={slidesToShow:1,slidesToScroll:1,dots:!1,arrows:!0,fade:!0},x={slidesToShow:3,swipeToSlide:!0,arrows:!1,dots:!1,focusOnSelect:!0};const j=e=>{l.current.slickGoTo(e)};c.useEffect(()=>{p({nav1:o.current,nav2:l.current})},[r]);const{nav1:f,nav2:N}=m;return s.jsx("section",{className:"section-b-space",children:s.jsx("div",{className:"collection-wrapper",children:s.jsx(g,{children:!r||!r.product||r.product.length===0||u?"loading":s.jsxs(d,{className:"leftImage",children:[s.jsxs(t,{lg:"6",children:[s.jsx(n,{...h,asNavFor:N,ref:e=>o.current=e,className:"product-right-slick",children:r.product.images.map((e,a)=>s.jsx("div",{children:s.jsx(b,{image:e})},a))}),s.jsx(d,{children:s.jsx(t,{sm:"12",children:s.jsx(n,{className:"slider-nav",...x,asNavFor:f,ref:e=>l.current=e,children:r.product.variants?r.product.images.map((e,a)=>s.jsx("div",{children:s.jsx(i,{src:`${e.src}`,alt:e.alt,className:"img-fluid"},a)},a)):""})})})]}),s.jsxs(t,{lg:"6",className:"rtl-text",children:[s.jsx(y,{changeColorVar:j,item:r.product}),s.jsxs("div",{className:"border-product",children:[s.jsx("h6",{className:"product-title",children:"Frequently bought together"}),s.jsxs("div",{className:"bundle",children:[s.jsxs("div",{className:"bundle_img",children:[s.jsx("div",{className:"img-box",children:s.jsx("a",{href:"#",children:s.jsx(i,{src:S.src,alt:"",className:"img-fluid blur-up lazyload"})})}),s.jsx("span",{className:"plus",children:"+"}),s.jsx("div",{className:"img-box",children:s.jsx("a",{href:"#",children:s.jsx(i,{src:v.src,alt:"",className:"img-fluid blur-up lazyload"})})}),s.jsx("span",{className:"plus",children:"+"}),s.jsx("div",{className:"img-box",children:s.jsx("a",{href:"#",children:s.jsx(i,{src:k.src,alt:"",className:"img-fluid blur-up lazyload"})})})]}),s.jsx("div",{className:"bundle_detail",children:s.jsxs("div",{className:"theme_checkbox",children:[s.jsxs("label",{children:["this product: WOMEN PINK SHIRT"," ",s.jsx("span",{className:"price_product",children:"$55"}),s.jsx("input",{type:"checkbox",defaultChecked:!0}),s.jsx("span",{className:"checkmark"})]}),s.jsxs("label",{children:["black long skirt"," ",s.jsx("span",{className:"price_product",children:"$20"}),s.jsx("input",{type:"checkbox",defaultChecked:!0}),s.jsx("span",{className:"checkmark"})]}),s.jsxs("label",{children:["women heeled boots"," ",s.jsx("span",{className:"price_product",children:"$15"}),s.jsx("input",{type:"checkbox",defaultChecked:!0}),s.jsx("span",{className:"checkmark"})]}),s.jsx("a",{href:"#",className:"btn btn-solid btn-xs",children:"buy this bundle"})]})})]})]})]})]})})})})};export{X as default};
