import{j as i}from"./index-SMLiIMwR.js";import{o as e}from"./001-Dt6CMOxs.js";import{i as m}from"./002-DK0gvknU.js";import c from"./detail-price-CGFKyHuU.js";import{C as p}from"./Container-BdWfrw1a.js";import{R as s}from"./Row-D4ZfY8NV.js";import{C as r}from"./Col-CNoyJ9_v.js";import{u as d,g as l}from"./useQuery-DM0uTPbv.js";import"./NextLinkCompat-B6pDUoE-.js";import"./ModalBody-D0sBAK0O.js";import"./utils-D8f00ew-.js";import"./Fade-Dxq_8SEO.js";import"./Transition-DjRsfRz0.js";import"./ModalHeader-GnU9_lqp.js";import"./Input-Bvr01ymB.js";import"./Media-D-l4SfND.js";import"./size-chart-CSk4pPDI.js";import"./useLanguage-gITJRiEG.js";import"./StyleTag-1J5wyURP.js";const n="/assets/1-R-JtUXUd.jpg",g="/assets/1-R-JtUXUd.jpg",u=l`
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
`,x=[e,m,n,g],F=()=>{var{data:t}=d(u,{variables:{id:1}});return i.jsx("section",{children:i.jsx("div",{className:"collection-wrapper ratio_asos",children:i.jsx(p,{children:i.jsxs(s,{children:[i.jsx(r,{lg:"6",children:i.jsx(s,{className:"product_image_4",children:x.map((o,a)=>i.jsx(r,{xs:"6",children:i.jsx("div",{children:i.jsx("img",{src:o.src,alt:"",className:"img-fluid blur-up lazyload bg-img"})})},a))})}),t?i.jsx(r,{lg:"6",className:"rtl-text",children:i.jsx(c,{item:t.product})}):"false"]})})})})};export{F as default};
