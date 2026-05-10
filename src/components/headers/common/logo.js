import React, { Fragment } from "react";
import Link from "@/router/NextLinkCompat";

const LogoImage = ({ logo }) => {
  return (
    <Fragment>
      <Link href={"/"}>
        {/* <a> */}
        <img
          src={`/assets/images/icon/${logo ? logo : "logo.png"}`}
          alt=""
         
          style={{height:'80px'}}
        />
        {/* </a> */}
      </Link>
    </Fragment>
  );
};

export default LogoImage;
