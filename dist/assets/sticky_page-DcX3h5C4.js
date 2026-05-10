import{r as o,j as s}from"./index-SMLiIMwR.js";import{C as l}from"./Col-CNoyJ9_v.js";import d from"./detail-price-CGFKyHuU.js";import{u as m,g as n}from"./useQuery-DM0uTPbv.js";import"./utils-D8f00ew-.js";import"./NextLinkCompat-B6pDUoE-.js";import"./ModalBody-D0sBAK0O.js";import"./Fade-Dxq_8SEO.js";import"./Transition-DjRsfRz0.js";import"./ModalHeader-GnU9_lqp.js";import"./Input-Bvr01ymB.js";import"./Media-D-l4SfND.js";import"./size-chart-CSk4pPDI.js";import"./useLanguage-gITJRiEG.js";import"./StyleTag-1J5wyURP.js";const p=n`
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
`,I=()=>{const[r,g]=o.useState({nav1:null,nav2:null});var{data:a}=m(p,{variables:{id:1}});const e=i=>{slider2.current.slickGoTo(i)},{nav1:j,nav2:u}=r,t=["../assets/images/pro3/1.jpg","../assets/images/pro3/2.jpg","../assets/images/pro3/1.jpg","../assets/images/pro3/4.jpg","../assets/images/pro3/5.jpg"];return s.jsx("section",{children:s.jsx("div",{className:"collection-wrapper",children:s.jsx("div",{className:"container",children:s.jsx("div",{className:"row data-sticky_parent",children:s.jsx("div",{className:"col-lg-12 col-sm-12 col-xs-12",children:s.jsx("div",{className:"container-fluid",children:s.jsxs("div",{className:"row",children:[s.jsx("div",{className:"col-lg-6",children:s.jsx("div",{className:"row",children:s.jsx("div",{className:"col-12 product_img_scroll image-scroll","data-sticky_column":!0,children:s.jsx("div",{children:t.map((i,c)=>s.jsx("div",{children:s.jsx("img",{src:i,alt:"",className:"img-fluid blur-up lazyload"})},c))})})})}),a?s.jsx(l,{lg:"6",className:"rtl-text",children:s.jsx("div",{className:"sticky-top-cls",children:s.jsx(d,{item:a.product,changeColorVar:e,stickyclassName:"pro_sticky_info"})})}):"false"]})})})})})})})};export{I as default};
