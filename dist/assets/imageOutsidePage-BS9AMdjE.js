import{r,b as K,C as P,j as s}from"./index-SMLiIMwR.js";import{C as B}from"./Container-BdWfrw1a.js";import{R as n}from"./Row-D4ZfY8NV.js";import{C as d}from"./Col-CNoyJ9_v.js";import{M as g,a as N}from"./ModalBody-D0sBAK0O.js";import{M as v}from"./ModalHeader-GnU9_lqp.js";import{I as D}from"./Input-Bvr01ymB.js";import{M as u}from"./Media-D-l4SfND.js";import{N as H}from"./NextLinkCompat-B6pDUoE-.js";import{S as y}from"./index-Ck_5nnyf.js";import{s as b}from"./size-chart-CSk4pPDI.js";import"./index.es-Gx5RFUZ1.js";import C from"./image-zoom-BiAtKaYf.js";import{u as U,g as Z}from"./useQuery-DM0uTPbv.js";import"./utils-D8f00ew-.js";import"./Fade-Dxq_8SEO.js";import"./Transition-DjRsfRz0.js";const A=Z`
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
`,ps=()=>{const i=r.useContext(K),S=i.addToCart,m=r.useContext(P).state.symbol,[z,k]=r.useState({nav1:null,nav2:null}),p=r.useRef(),h=r.useRef(),[x,q]=r.useState(!1),c=()=>q(!x),[I,M]=r.useState(!1),w=i.stock,T=i.plusQty,Q=i.minusQty,j=i.quantity,f=[],o=[],R=()=>{M(!1)},E=t=>{setQuantity(parseInt(t.target.value))};var{loading:O,data:e}=U(A,{variables:{id:1}}),_={slidesToShow:1,slidesToScroll:1,dots:!1,arrows:!0,fade:!0},L={slidesToShow:3,swipeToSlide:!0,arrows:!1,dots:!1,focusOnSelect:!0};r.useEffect(()=>{k({nav1:p.current,nav2:h.current})},[e]);const{nav1:$,nav2:F}=z;return s.jsx("section",{children:s.jsx("div",{className:"collection-wrapper",children:s.jsx(B,{children:!e||!e.product||e.product.length===0||O?"loading":s.jsxs(n,{children:[s.jsx(d,{lg:"6",children:s.jsx(y,{..._,asNavFor:F,ref:t=>p.current=t,className:"product-right-slick",children:e.product.variants?e.product.images.map((t,a)=>s.jsx("div",{children:s.jsx(C,{image:t})},a)):e.product.images.map((t,a)=>s.jsx("div",{children:s.jsx(C,{image:t})},a))})}),s.jsx(d,{lg:"6",className:"rtl-text",children:s.jsx(n,{children:s.jsxs(d,{className:"outsideImage",children:[s.jsxs("div",{className:"product-right",children:[s.jsxs("h2",{children:[" ",e.product.title," "]}),s.jsxs("h4",{children:[s.jsxs("del",{children:[m,e.product.price]}),s.jsxs("span",{children:[e.product.discount,"% off"]})]}),s.jsxs("h3",{children:[m,e.product.price-e.product.price*e.product.discount/100," "]}),e.product.variants.map(t=>{var a=f.find(l=>l.color===t.color);a||f.push(t);var G=o.find(l=>l===t.size);G||o.push(t.size)}),s.jsxs("div",{className:"product-description border-product",children:[e.product.variants?s.jsxs("div",{children:[s.jsxs("h6",{className:"product-title size-text",children:["select size",s.jsx("span",{children:s.jsx("a",{href:null,"data-toggle":"modal","data-target":"#sizemodal",onClick:c,children:"size chart"})})]}),s.jsxs(g,{isOpen:x,toggle:c,centered:!0,children:[s.jsx(v,{toggle:c,children:"Sheer Straight Kurta"}),s.jsx(N,{children:s.jsx(u,{src:b.src,alt:"size",className:"img-fluid"})})]}),s.jsx("div",{className:"size-box",children:s.jsx("ul",{children:o.map((t,a)=>s.jsx("li",{children:s.jsx("a",{href:null,children:t})},a))})})]}):"",s.jsx("span",{className:"instock-cls",children:w}),s.jsx("h6",{className:"product-title",children:"quantity"}),s.jsx("div",{className:"qty-box",children:s.jsxs("div",{className:"input-group",children:[s.jsx("span",{className:"input-group-prepend",children:s.jsx("button",{type:"button",className:"btn quantity-left-minus",onClick:Q,"data-type":"minus","data-field":"",children:s.jsx("i",{className:"fa fa-angle-left"})})}),s.jsx(D,{type:"text",name:"quantity",value:j,onChange:E,className:"form-control input-number"}),s.jsx("span",{className:"input-group-prepend",children:s.jsx("button",{type:"button",className:"btn quantity-right-plus",onClick:()=>T(e.product),"data-type":"plus","data-field":"",children:s.jsx("i",{className:"fa fa-angle-right"})})})]})})]}),s.jsxs("div",{className:"product-buttons",children:[s.jsx("a",{href:null,className:"btn btn-solid",onClick:()=>S(e.product,j),children:"add to cart"}),s.jsx(H,{href:"/page/account/checkout",className:"btn btn-solid",children:"buy now"})]}),s.jsxs("div",{className:"border-product",children:[s.jsx("h6",{className:"product-title",children:"product details"}),s.jsx("p",{children:e.product.description})]})]}),s.jsx(g,{open:I,onClose:R,center:!0,children:s.jsx("div",{className:"modal-dialog modal-dialog-centered",role:"document",children:s.jsxs("div",{className:"modal-content",children:[s.jsx(v,{className:"modal-header",children:s.jsx("h5",{className:"modal-title",id:"exampleModalLabel",children:"Sheer Straight Kurta"})}),s.jsx(N,{className:"modal-body",children:s.jsx(u,{src:b.src,alt:"",className:"img-fluid"})})]})})}),s.jsx(n,{className:"imgae-outside-thumbnail mt-4",children:s.jsx(y,{className:"slider-nav",...L,asNavFor:$,ref:t=>h.current=t,children:e.product.variants?e.product.images.map((t,a)=>s.jsx("div",{children:s.jsx(u,{src:`${t.src}`,alt:t.alt,className:"img-fluid"},a)},a)):""})})]})})})]})})})})};export{ps as default};
