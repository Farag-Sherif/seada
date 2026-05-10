// pages/Fashion.js (or wherever this file lives)
import React from "react";
import { Helmet } from "react-helmet-async";            
import HeaderTwo from "../components/headers/header-two";
import MasterFooter from "../components/footers/common/MasterFooter";
import Home from "./layouts/Shoes/index";

const Fashion = () => {
  return (
    <>
      <Helmet>
        <title>Seada Ecommerce</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon"  href="/assets/images/favicon.io" />
      </Helmet>

      <HeaderTwo
        logoName={"logo/6.png"}
        direction="bottom"
        topClass="top-header top-header-dark"
      />
      <Home />

      <MasterFooter
        footerClass="footer-light"
        footerLayOut="light-layout upper-footer"
        footerSection="small-section border-section border-top-0"
        belowSection="section-b-space light-layout"
        newLatter={true}
        logoName="logo.png"
      />
    </>
  );
};

export default Fashion;
