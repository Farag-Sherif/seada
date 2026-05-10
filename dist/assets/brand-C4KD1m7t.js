import{r as o,a0 as m,j as e}from"./index-SMLiIMwR.js";import{I as p}from"./Input-Bvr01ymB.js";import{C as h}from"./Collapse-DRKSGe6u.js";import{u as x,g as u}from"./useQuery-DM0uTPbv.js";import"./utils-D8f00ew-.js";import"./Transition-DjRsfRz0.js";const g=u`
  query getBrands($type: String) {
    getBrands(type: $type) {
      brand
    }
  }
`,N=()=>{const s=o.useContext(m),a=s.isChecked;s.filterChecked;const[l,n]=o.useState(!1),r=()=>n(!l);var{loading:i,data:t}=x(g,{variables:{type:s.state}});return e.jsxs("div",{className:"collection-collapse-block open",children:[e.jsx("h3",{className:"collapse-block-title",onClick:r,children:"brand"}),e.jsx(h,{isOpen:l,children:e.jsx("div",{className:"collection-collapse-block-content",children:e.jsx("div",{className:"collection-brand-filter",children:!t||!t.getBrands||t.getBrands.length===0||i?"loading":t&&t.getBrands.brand.map((c,d)=>e.jsxs("div",{className:"form-check custom-checkbox collection-filter-checkbox",children:[e.jsx(p,{checked:s.selectedBrands.includes(c),onChange:()=>{s.handleBrands(c,a)},type:"checkbox",className:"custom-control-input",id:c}),e.jsx("label",{className:"custom-control-label",htmlFor:c,children:c})]},d))})})})]})};export{N as default};
