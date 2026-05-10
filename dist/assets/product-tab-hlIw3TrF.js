import{a as z,j as i}from"./index-SMLiIMwR.js";import{N as S,a as C,b as R,T as D,c as d}from"./TabPane-CXZ8u8gX.js";import{c as _}from"./utils-D8f00ew-.js";import{u as I}from"./useLanguage-gITJRiEG.js";import{S as E}from"./StyleTag-1J5wyURP.js";const H=({descriptionHtml:A="",details:a={},showVideo:c=!1,showReview:g=!1,labels:t})=>{var m,f,h,b,j,k,y,w,T;const{t:u,isRTL:r}=I(),o=(e,s)=>{try{const p=u==null?void 0:u(e);return p&&p!==e?p:s}catch{return s}},n={tabs:{details:((m=t==null?void 0:t.tabs)==null?void 0:m.details)??o("product.tabs.details",r?"التفاصيل":"Details"),description:((f=t==null?void 0:t.tabs)==null?void 0:f.description)??o("product.tabs.description",r?"الوصف":"Description"),video:((h=t==null?void 0:t.tabs)==null?void 0:h.video)??o("product.tabs.video",r?"فيديو":"Video"),review:((b=t==null?void 0:t.tabs)==null?void 0:b.review)??o("product.tabs.review",r?"اكتب مراجعة":"Write Review")},fields:{serial:((j=t==null?void 0:t.fields)==null?void 0:j.serial)??o("product.details.serial",r?"الرقم التسلسلي":"Serial"),stock:((k=t==null?void 0:t.fields)==null?void 0:k.stock)??o("product.details.stock",r?"رقم المخزون":"Stock #"),weight:((y=t==null?void 0:t.fields)==null?void 0:y.weight)??o("product.details.weight",r?"الوزن":"Weight"),category:((w=t==null?void 0:t.fields)==null?void 0:w.category)??o("product.details.category",r?"القسم":"Category")}},l=Object.values(a||{}).some(Boolean),x=[...g?[{key:"review",label:n.tabs.review}]:[],...c?[{key:"video",label:n.tabs.video}]:[],...l?[{key:"details",label:n.tabs.details}]:[],{key:"description",label:n.tabs.description}],[v,N]=z.useState(((T=x[0])==null?void 0:T.key)||"description"),L=[["serial_number",n.fields.serial],["stock_number",n.fields.stock],["weight",n.fields.weight],["category",n.fields.category]];return i.jsxs("div",{className:"product-tab mt-5",dir:r?"rtl":"ltr",children:[i.jsx(S,{tabs:!0,className:"justify-content-end justify-content-lg-start px-3 px-lg-0",children:x.map(e=>i.jsx(C,{children:i.jsx(R,{className:_({active:v===e.key}),onClick:()=>N(e.key),role:"button",children:e.label})},e.key))}),i.jsxs(D,{activeTab:v,className:"pt-4 px-3 px-lg-0",children:[g&&i.jsx(d,{tabId:"review",children:i.jsx("div",{})}),c&&i.jsx(d,{tabId:"video",children:i.jsx("div",{})}),l&&i.jsx(d,{tabId:"details",children:i.jsx("ul",{className:"prod-details",children:L.map(([e,s])=>a!=null&&a[e]?i.jsxs("li",{children:[i.jsx("strong",{children:s}),i.jsx("span",{children:a[e]})]},e):null)})}),i.jsx(d,{tabId:"description",children:i.jsx("div",{className:"prod-description",dangerouslySetInnerHTML:{__html:A}})})]}),i.jsx(E,{global:!0,css:`
        /* Tabs */
        .product-tab .nav-tabs {
          border-bottom: 0;
          gap: 22px;
        }
        .product-tab .nav-tabs .nav-link {
          border: 0 !important;
          background: transparent !important;
          color: #1f2937;
          font-weight: 700;
          letter-spacing: 0.2px;
          padding: 0 0 14px;
          position: relative;
          font-size: 1.125rem;
          line-height: 1.2;
        }
        .product-tab .nav-tabs .nav-link:hover,
        .product-tab .nav-tabs .nav-link.active {
          color: #0b7d4e;
        }
        .product-tab .nav-tabs .nav-link.active::after {
          content: "";
          position: absolute;
          height: 3px;
          background: #0b7d4e;
          inline-size: 90px; /* يعمل LTR/RTL */
          inset-inline-start: 0;
          inset-block-end: 0;
          border-radius: 3px;
        }
        [dir="rtl"] .product-tab .nav-tabs .nav-link.active::after {
          inset-inline-start: auto;
          inset-inline-end: 0;
        }

        /* Content */
        .product-tab .tab-content {
          border-top: 1px solid #eaeaea;
          padding-top: 28px;
        }

        .prod-description,
        .prod-details {
          font-size: 1.0625rem; /* ~17px */
        }
        .prod-description p,
        .prod-description li {
          line-height: 1.95;
          color: #374151;
          margin-bottom: 12px;
        }
        .prod-description ul {
          padding-inline-start: 22px;
          margin-top: 6px;
        }
        .prod-description p {
          font-size: 1.0625rem;
        }

        /* Details list */
        .prod-details {
          list-style: none;
          padding: 0;
          margin: 0;
        }
        .prod-details li {
          display: flex;
          gap: 10px;
          padding: 10px 0;
          border-bottom: 1px dashed #eee;
          align-items: baseline;
        }
        .prod-details li strong {
          min-inline-size: 140px; /* يتوافق مع RTL */
          color: #111827;
          font-weight: 700;
        }
        [dir="rtl"] .prod-details li {
          flex-direction: row;
          text-align: right;
        }
        [dir="rtl"] .prod-details li strong {
          text-align: start;
        }

        /* Larger on lg+ */
        @media (min-width: 992px) {
          .product-tab .nav-tabs .nav-link {
            font-size: 1.3rem;
            padding-bottom: 16px;
          }
          .prod-description,
          .prod-details {
            font-size: 1.125rem; /* 18px */
          }
        }
      `})]})};export{H as default};
