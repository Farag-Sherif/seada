import React from "react";
import HeaderTwo from "../headers/header-two";
import Breadcrubs from "../common/widgets/breadcrubs";
// import Helmet from "react-helmet";
import favicon from "@/assets/images/favicon/1.png";
import MasterFooter from "../footers/common/MasterFooter";
import { useLanguage } from "../../helpers/Language/useLanguage";
import { Helmet } from "react-helmet-async";  
const CommonLayout = ({ children, title, parent, subTitle }) => {
  const { isRTL } = useLanguage();
  
  return (
    <div style={{ direction: isRTL ? 'rtl' : 'ltr' }}>
    
           <Helmet>
        <title>Seada</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" type="image/png" href="/assets/images/favicon/1.png" />
      </Helmet>
       <HeaderTwo logoName={'logo/6.png'} direction="bottom" topClass="top-header top-header-dark" />
      <Breadcrubs title={title} parent={parent} subTitle={subTitle} />
      <>{children}</>
      <MasterFooter
        footerClass={`footer-light `}
        footerLayOut={"light-layout upper-footer"}
        footerSection={"small-section border-section border-top-0"}
        belowSection={"section-b-space light-layout"}
        newLatter={true}
      />
    </div>
  );
};

export default CommonLayout;
