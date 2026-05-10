import{r as o,j as e,a as h}from"./index-SMLiIMwR.js";import{C as u}from"./Container-BdWfrw1a.js";import{R as b}from"./Row-D4ZfY8NV.js";import{C as d}from"./Col-CNoyJ9_v.js";import{M as w}from"./MasterServiceConternt-BlB4a8BT.js";import{u as j}from"./useLanguage-gITJRiEG.js";import{e as k}from"./main-phMepZS4.js";import{s as y,d as N,e as _}from"./script-6JDTEumQ.js";import{S}from"./StyleTag-1J5wyURP.js";const C=s=>[{link:y,title:s("free_shipping"),service:s("free_shipping_worldwide")},{link:N,title:s("24x7_service"),service:s("online_service_24x7")},{link:_,title:s("festival_offer"),service:s("new_online_special_festival_offer")}],z=(s,n)=>{const c=(s==null?void 0:s.translations)||[],a=c.find(t=>t.locale===n)||c.find(t=>t.locale==="en")||{};return{title:a.title||s.title||"",description:a.description||s.description||""}},L=({src:s,alt:n})=>h.isValidElement(s)?e.jsx("span",{className:"svc-icon-wrap",children:s}):typeof s=="string"&&s.trim()?e.jsx("span",{className:"svc-icon-wrap",children:e.jsx("img",{src:s,alt:n||"",width:56,height:56,loading:"lazy",style:{objectFit:"contain",display:"block"}})}):e.jsx("span",{className:"svc-icon-wrap svc-fallback","aria-hidden":"true",children:"★"}),A=()=>e.jsxs("div",{className:"svc-card svc-skeleton",children:[e.jsx("div",{className:"svc-icon-wrap"}),e.jsxs("div",{className:"svc-text",children:[e.jsx("div",{className:"svc-line svc-line-lg"}),e.jsx("div",{className:"svc-line"})]})]}),V=({sectionClass:s=""})=>{const{t:n,isRTL:c,currentLanguage:a}=j(),[t,l]=o.useState(null),[p,m]=o.useState(null);o.useEffect(()=>{let i=!0;return(async()=>{try{const r=await k();if(!i)return;l(Array.isArray(r)?r:[])}catch(r){if(!i)return;m((r==null?void 0:r.message)||"Failed to load choices"),l([])}})(),()=>{i=!1}},[]);const v=t===null,x=o.useMemo(()=>Array.isArray(t)&&t.length?t.map(i=>{const{title:r,description:g}=z(i,a),f=i.icon_path??i.icon??null;return{id:i.id??`${r}-${Math.random()}`,icon:f,title:r,description:g}}):C(n).map((i,r)=>({id:`legacy-${r}`,icon:i.link,title:i.title,description:i.service})),[t,a,n]);return e.jsxs(u,{className:"section-b-space section-t-space",children:[e.jsxs("section",{className:`service-section  ${s}`,style:{direction:c?"rtl":"ltr"},children:[e.jsx(b,{className:"gx-4 gy-4",children:v?Array.from({length:3}).map((i,r)=>e.jsx(d,{md:"4",sm:"6",xs:"12",children:e.jsx(A,{})},`skeleton-${r}`)):x.map(i=>e.jsx(d,{md:"4",sm:"6",xs:"12",children:e.jsxs("div",{className:"svc-card",children:[e.jsx(L,{src:i.icon,alt:i.title}),e.jsx("div",{className:"svc-text",children:e.jsx(w,{link:null,title:e.jsx("span",{className:"svc-title",children:i.title}),service:e.jsx("span",{className:"svc-desc",children:i.description})})})]})},i.id))}),p&&!1]}),e.jsx(S,{global:!0,css:`
        /* Layout container */
        .service-section {
          padding-block: 16px;
        }

        /* Card */
        .svc-card {
          display: grid;
          grid-template-columns: 56px 1fr;
          gap: 14px;
          align-items: center;
          padding: 18px 16px;
          border: 1px solid #ececec;
          border-radius: 14px;
          background: #fff;
          min-height: 110px;
          transition: transform .12s ease, box-shadow .12s ease, border-color .12s ease;
        }
        .svc-card:hover {
          transform: translateY(-1px);
          box-shadow: 0 8px 20px rgba(0,0,0,.05);
          border-color: #e4efe9;
        }
        .svc-card:active {
          transform: translateY(0);
          box-shadow: 0 4px 12px rgba(0,0,0,.04);
        }

        /* Icon (no circle container) */
        .svc-icon-wrap {
          width: 56px;
          height: 56px;
          min-width: 56px;
          display: grid;
          place-items: center;
          /* removed background, border, and rounding to show raw image */
          background: transparent;
          border: none;
          border-radius: 0;
          overflow: visible;
          padding: 0;
        }
        .svc-icon-wrap img {
          display: block;
          width: 56px;
          height: 56px;
          object-fit: contain;
        }
        .svc-icon-wrap.svc-fallback {
          font-size: 20px;
          color: #0b6b37;
          font-weight: 700;
        }

        /* Text */
        .svc-text {
          display: grid;
          align-content: center;
          gap: 4px;
        }
        .svc-title {
          font-size: 1.0625rem;
          font-weight: 700;
          line-height: 1.3;
          margin: 0;
          color: #111827;
        }
        .svc-desc {
          margin: 0;
          color: #4b5563;
          line-height: 1.7;
          font-size: .9375rem;
        }

        /* Skeletons */
        .svc-skeleton {
          pointer-events: none;
          border-color: #f0f0f0;
        }
        .svc-skeleton .svc-icon-wrap,
        .svc-line {
          background: linear-gradient(90deg, #f3f4f6 25%, #e5e7eb 37%, #f3f4f6 63%);
          background-size: 400% 100%;
          animation: svc-shimmer 1.2s ease-in-out infinite;
        }
        .svc-line {
          height: 12px;
          border-radius: 8px;
          width: 100%;
        }
        .svc-line + .svc-line {
          margin-top: 8px;
          width: 80%;
        }
        .svc-line-lg {
          height: 14px;
          width: 60%;
        }
        @keyframes svc-shimmer {
          0% { background-position: 100% 50%; }
          100% { background-position: 0 50%; }
        }

        /* Responsive tweaks */
        @media (max-width: 767px) {
          .svc-card {
            grid-template-columns: 48px 1fr;
            gap: 12px;
            padding: 16px 14px;
            min-height: 100px;
          }
          .svc-icon-wrap {
            width: 48px;
            height: 48px;
            min-width: 48px;
          }
          .svc-icon-wrap img {
            width: 48px;
            height: 48px;
          }
          .svc-title {
            font-size: 1rem;
          }
          .svc-desc {
            font-size: .9rem;
          }
        }
      `})]})};export{V as S};
