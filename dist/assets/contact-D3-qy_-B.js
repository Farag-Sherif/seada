import{r as i,j as t,x as U,y as W}from"./index-SMLiIMwR.js";import{C as G}from"./common-layout-CeYNYNol.js";import{C as J}from"./Container-BdWfrw1a.js";import{R as w}from"./Row-D4ZfY8NV.js";import{C as m}from"./Col-CNoyJ9_v.js";import{F as K}from"./Form-DCa5SwR2.js";import{I as b}from"./Input-Bvr01ymB.js";import{L as g}from"./Label-CGhho48e.js";import{c as Q,s as T}from"./main-phMepZS4.js";import{u as V}from"./useLanguage-gITJRiEG.js";import{S as X}from"./StyleTag-1J5wyURP.js";import"./MasterFooter-Dq2JiwYi.js";import"./Media-D-l4SfND.js";import"./utils-D8f00ew-.js";import"./NextLinkCompat-B6pDUoE-.js";import"./auth-DXW9kqT4.js";import"./api-DM-tDIGU.js";/* empty css                      */import"./useQuery-DM0uTPbv.js";import"./products-ijfk4fJI.js";import"./Button-Ck_p3KtF.js";import"./Collapse-DRKSGe6u.js";import"./Transition-DjRsfRz0.js";import"./categories-BIl1eGPJ.js";const Z=(e,o)=>{if(!o)return"";try{const c=e(o);return!c||c===o?o:c}catch{return o}},a=(e,o,c)=>{const f=Z(e,o);return f===o?c:f},S=e=>typeof e=="string"?e:e==null?"":String((e==null?void 0:e.value)??(e==null?void 0:e.name)??(e==null?void 0:e.title)??(e==null?void 0:e.text)??""),E=e=>{const o='<iframe title="store-map" src="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d1605.811957341231!2d25.45976406005396!3d36.3940974010114!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sen!2sin!4v1550912388321" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade" style="width:100%;height:380px;border:0;"></iframe>';if(!e||typeof e!="string")return o;const c=e.trim();return/^<iframe[\s\S]*<\/iframe>$/.test(c)?c.includes("style=")?c:c.replace(/^<iframe/i,'<iframe style="width:100%;height:380px;border:0;"'):`<iframe title="store-map" src="${c}" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade" style="width:100%;height:380px;border:0;"></iframe>`},O=({icon:e,title:o,desc1:c,desc2:f})=>t.jsxs("div",{className:"contact-card",tabIndex:0,children:[t.jsx("div",{className:"contact-card__icon",children:t.jsx("i",{className:`fa ${e}`,"aria-hidden":"true"})}),t.jsx("div",{className:"contact-card__title",children:o}),t.jsxs("div",{className:"contact-card__value",children:[c,f?t.jsxs(t.Fragment,{children:[t.jsx("br",{}),f]}):null]})]}),Ce=()=>{const{t:e,isRTL:o}=V(),[c,f]=i.useState(!0),[z,A]=i.useState(""),[C,H]=i.useState([]),[F,$]=i.useState([]),[L,M]=i.useState([]);i.useEffect(()=>{let r=!0;return(async()=>{var l;try{const h=await Q(),s=(l=h==null?void 0:h.data)!=null&&l.settings?h.data:h,d=(s==null?void 0:s.settings)??{},y=Array.isArray(s==null?void 0:s.mobiles)?s.mobiles:[],k=Array.isArray(s==null?void 0:s.emails)?s.emails:[],p=d==null?void 0:d.location_url;r&&A(E(p));const N=y.map(u=>S(u==null?void 0:u.mobile)).filter(Boolean);r&&H(N);const _=k.map(u=>S(u==null?void 0:u.email)).filter(Boolean);r&&$(_);const I=S(s==null?void 0:s.addresse)||S(d==null?void 0:d.addresse)||"";r&&M(I?[I]:[])}catch{r&&(A(E(null)),H([]),$([]),M([]))}finally{r&&f(!1)}})(),()=>{r=!1}},[]);const P=i.useMemo(()=>[{icon:"fa-phone",title:a(e,"contact.section.contact","Contact"),desc1:C[0]||"+00 000 - 000 - 0000",desc2:C[1]||""},{icon:"fa-map-marker",title:a(e,"contact.section.address","Address"),desc1:L[0]||a(e,"contact.address_line1","Your address here"),desc2:L[1]||""},{icon:"fa-envelope-o",title:a(e,"contact.section.email","Email"),desc1:F[0]||"info@example.com",desc2:F[1]||""}],[e,C,F,L]),[n,q]=i.useState({firstName:"",lastName:"",phone:"",email:"",subject:"",message:""}),[j,v]=i.useState(!1),x=i.useCallback(r=>q(l=>({...l,[r.target.name]:r.target.value})),[]),R=async r=>{var y;if(r.preventDefault(),j)return;const l=`${n.firstName} ${n.lastName}`.replace(/\s+/g," ").trim(),h=((y=n.subject)==null?void 0:y.trim())||a(e,"contact.form.default_subject","Contact form message"),s=`Phone: ${n.phone||"-"}

${n.message||""}`,d={name:l||n.firstName||n.lastName||"User",email:n.email,subject:h,message:s};try{v(!0),await W.promise(T(d),{pending:a(e,"contact.form.sending","Sending…"),success:a(e,"contact.form.success","Message sent successfully"),error:{render({data:k}){var N,_;const p=k;return((_=(N=p==null?void 0:p.response)==null?void 0:N.data)==null?void 0:_.message)||(p==null?void 0:p.message)||a(e,"contact.form.error","Failed to send message")}}}),q({firstName:"",lastName:"",phone:"",email:"",subject:"",message:""})}finally{v(!1)}},B=a(e,"contact.title","Contact"),D=a(e,"Home","Home"),Y=o?"top-left":"top-right";return t.jsxs(G,{parent:D,title:B,children:[t.jsx(U,{position:Y,rtl:o,theme:"colored",autoClose:3500}),t.jsx("section",{className:"contact-page section-b-space contact-modern",dir:o?"rtl":"ltr",children:t.jsxs(J,{children:[t.jsx(w,{className:"section-b-space",children:t.jsx(m,{xs:"12",children:t.jsx("div",{className:"map","aria-busy":c,dangerouslySetInnerHTML:{__html:z||E(null)}})})}),t.jsx(w,{className:"g-3 g-md-4 mb-4 info-row",children:P.map((r,l)=>t.jsx(m,{xs:"12",md:"4",children:t.jsx(O,{icon:r.icon,title:r.title,desc1:r.desc1,desc2:r.desc2})},l))}),t.jsx(w,{children:t.jsx(m,{sm:"12",children:t.jsx(K,{className:"theme-form",onSubmit:R,children:t.jsxs(w,{children:[t.jsxs(m,{md:"6",children:[t.jsx(g,{className:"form-label",htmlFor:"firstName",children:a(e,"contact.form.first_name","First name")}),t.jsx(b,{id:"firstName",name:"firstName",type:"text",className:"form-control",placeholder:a(e,"contact.form.first_name_placeholder","Enter your first name"),value:n.firstName,onChange:x,required:!0})]}),t.jsxs(m,{md:"6",children:[t.jsx(g,{className:"form-label",htmlFor:"lastName",children:a(e,"contact.form.last_name","Last name")}),t.jsx(b,{id:"lastName",name:"lastName",type:"text",className:"form-control",placeholder:a(e,"contact.form.last_name_placeholder","Enter your last name"),value:n.lastName,onChange:x,required:!0})]}),t.jsxs(m,{md:"6",children:[t.jsx(g,{className:"form-label",htmlFor:"phone",children:a(e,"contact.form.phone","Phone")}),t.jsx(b,{id:"phone",name:"phone",type:"text",className:"form-control",placeholder:a(e,"contact.form.phone_placeholder","Enter your phone"),value:n.phone,onChange:x})]}),t.jsxs(m,{md:"6",children:[t.jsx(g,{className:"form-label",htmlFor:"email",children:a(e,"contact.form.email","Email")}),t.jsx(b,{id:"email",name:"email",type:"email",className:"form-control",placeholder:a(e,"contact.form.email_placeholder","Enter your email"),value:n.email,onChange:x,required:!0})]}),t.jsxs(m,{md:"12",children:[t.jsx(g,{className:"form-label",htmlFor:"subject",children:a(e,"contact.form.subject","Subject")}),t.jsx(b,{id:"subject",name:"subject",type:"text",className:"form-control",placeholder:a(e,"contact.form.subject_placeholder","How can we help?"),value:n.subject,onChange:x,required:!0})]}),t.jsxs(m,{md:"12",children:[t.jsx(g,{className:"form-label",htmlFor:"message",children:a(e,"contact.form.message","Message")}),t.jsx("textarea",{id:"message",name:"message",className:"form-control",rows:"6",placeholder:a(e,"contact.form.message_placeholder","Write your message here…"),value:n.message,onChange:x,required:!0})]}),t.jsx(m,{md:"12",children:t.jsx("button",{className:"btn btn-solid",type:"submit",disabled:j,"aria-busy":j,children:j?a(e,"contact.form.sending","Sending…"):a(e,"contact.form.submit","Send Message")})})]})})})})]})}),t.jsx(X,{global:!0,css:`
  /* ===== contact section (green theme) ===== */
  .contact-modern { --cm-primary: #0b6b37; }

  .contact-modern .map iframe{
    width:100%; height:420px; border:0; display:block;
    border-radius:16px; box-shadow:0 1px 2px rgba(16,24,40,.06);
  }

  .contact-modern .info-row{ row-gap:18px; margin-top:8px; }

  .contact-modern .contact-card{
    position:relative; height:100%;
    padding:18px 20px 20px;
    border-radius:16px; border:1px solid #e6e8ee; background:#fff;
    box-shadow:0 1px 2px rgba(16,24,40,.06);
    text-align:center; transition:transform .18s, box-shadow .18s, border-color .18s;
  }

  .contact-modern .contact-card::before{
    content:""; position:absolute; left:0; right:0; top:0; height:3px;
    background:linear-gradient(135deg, color-mix(in srgb, var(--cm-primary) 20%), var(--cm-primary));
    border-radius:16px 16px 0 0;
  }

  .contact-modern .contact-card:hover,
  .contact-modern .contact-card:focus{
    transform:translateY(-3px);
    box-shadow:0 10px 30px rgba(16,24,40,.12);
    border-color:color-mix(in srgb, var(--cm-primary) 28%, #ffffff);
    outline:none;
  }

  .contact-modern .contact-card__icon{
    width:54px;height:54px;margin:4px auto 10px;border-radius:14px; display:grid;place-items:center;
    background:
      linear-gradient(#fff,#fff) padding-box,
      linear-gradient(135deg, color-mix(in srgb, var(--cm-primary) 20%), var(--cm-primary)) border-box;
    border:1px solid transparent;
  }
  .contact-modern .contact-card__icon i{ font-size:20px; color:var(--cm-primary); }

  .contact-modern .contact-card__title{ margin:0 0 6px; font-weight:700; font-size:15px; color:#111827; }
  .contact-modern .contact-card__value{ margin:0; color:#5b6472; line-height:1.45; word-break:break-word; }

  @media (max-width:420px){
    .contact-modern .contact-card{ padding:16px; }
    .contact-modern .contact-card__icon{ width:48px; height:48px; }
  }

  /* optional dark mode */
  html.dark .contact-modern .contact-card{ background:#0b1220; border-color:#1c2434; }
  html.dark .contact-modern .contact-card__title{ color:#e5e7eb; }
  html.dark .contact-modern .contact-card__value{ color:#aeb7c6; }
`})]})};export{Ce as default};
