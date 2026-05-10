import{r as c,C as n,j as s}from"./index-SMLiIMwR.js";import{M as t}from"./Media-D-l4SfND.js";import{S as d}from"./index-Ck_5nnyf.js";import{u as m,g as x}from"./useQuery-DM0uTPbv.js";import"./utils-D8f00ew-.js";const f=x`
  query newProducts($type: String!) {
    newProducts(type: $type) {
      title
      price
      images {
        alt
        src
      }
    }
  }
`,p=()=>{const i=c.useContext(n).state.symbol;var{loading:l,data:a}=m(f,{variables:{type:"fashion"}});return s.jsxs("div",{className:"theme-card",children:[s.jsx("h5",{className:"title-border",children:"new product"}),s.jsxs(d,{className:"offer-slider slide-1",children:[s.jsx("div",{children:!a||!a.newProducts||a.newProducts.length===0||l?"loading":s.jsx(s.Fragment,{children:a&&a.newProducts.slice(0,3).map((e,r)=>s.jsxs("div",{className:"media",children:[s.jsx("a",{href:"",children:s.jsx(t,{className:"img-fluid blur-up lazyload",src:e.images[0].src,alt:e.images[0].alt})}),s.jsxs("div",{className:"media-body align-self-center",children:[s.jsxs("div",{className:"rating",children:[s.jsx("i",{className:"fa fa-star"})," ",s.jsx("i",{className:"fa fa-star"})," ",s.jsx("i",{className:"fa fa-star"})," ",s.jsx("i",{className:"fa fa-star"})," ",s.jsx("i",{className:"fa fa-star"})]}),s.jsx("a",{href:null,children:s.jsx("h6",{children:e.title})}),s.jsxs("h4",{children:[i,e.price]})]})]},r))})}),s.jsx("div",{children:!a||!a.newProducts||a.newProducts.length===0||l?"loading":s.jsx(s.Fragment,{children:a&&a.newProducts.slice(4,7).map((e,r)=>s.jsxs("div",{className:"media",children:[s.jsx("a",{href:"",children:s.jsx(t,{className:"img-fluid blur-up lazyload",src:e.images[0].src,alt:e.images[0].alt})}),s.jsxs("div",{className:"media-body align-self-center",children:[s.jsxs("div",{className:"rating",children:[s.jsx("i",{className:"fa fa-star"})," ",s.jsx("i",{className:"fa fa-star"})," ",s.jsx("i",{className:"fa fa-star"})," ",s.jsx("i",{className:"fa fa-star"})," ",s.jsx("i",{className:"fa fa-star"})]}),s.jsx("a",{href:null,children:s.jsx("h6",{children:e.title})}),s.jsxs("h4",{children:[i,e.price]})]})]},r))})})]})]})};export{p as default};
