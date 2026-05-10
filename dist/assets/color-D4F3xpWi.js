import{r as t,a0 as s,j as o}from"./index-SMLiIMwR.js";import{u as a,g as r}from"./useQuery-DM0uTPbv.js";const l=r`
    query getColors($type:String)  {
        getColors(type: $type){
            colors
        }
    }
`,g=()=>{const e=t.useContext(s),[n,p]=t.useState(!1);var{loading:c,data:i}=a(l,{variables:{type:e.state}});return o.jsx("div",{className:"collection-collapse-block open"})};export{g as default};
