import React, { useEffect, useState, useContext } from "react";
import Link from "@/router/NextLinkCompat";
import { ToastContainer } from "react-toastify";
import { Col } from "reactstrap";
import SettingContext from "../../helpers/theme-setting/SettingContext";
import config from "./config.json";

const ThemeSettings = () => {
  const context = useContext(SettingContext);

  const [themeLayout, setThemeLayout] = useState(false);
  const [modal, setModal] = useState(false);

  const layoutState = context.layoutState;

  const toggle = () => setModal(!modal);

  console.log("rtl", layoutState);

  /*=====================
     Init + Scroll
  ==========================*/
  useEffect(() => {
    if (config.config.layout_version && config.config.layout_type) {
      document.body.className = `${config.config.layout_version} ${config.config.layout_type}`;
    }

    if (localStorage.getItem("color")) {
      document.documentElement.style.setProperty(
        "--theme-deafult",
        localStorage.getItem("color"),
      );
    }

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleScroll = () => {
    const tapTop = document.querySelector(".tap-top");
    if (!tapTop) return;

    if (document.documentElement.scrollTop > 600) {
      tapTop.style.display = "block";
    } else {
      tapTop.style.display = "none";
    }
  };

  /*=====================
     Settings التحكم
  ==========================*/
  const openSetting = () => {
    document.getElementById("setting_box")?.classList.add("open-setting");
    document.getElementById("setting-icon")?.classList.add("open-icon");
  };

  const closeSetting = () => {
    document.getElementById("setting_box")?.classList.remove("open-setting");
    document.getElementById("setting-icon")?.classList.remove("open-icon");
  };

  const changeThemeLayout = () => {
    setThemeLayout((prev) => !prev);
  };

  /*=====================
     Dark / Light Mode
  ==========================*/
  useEffect(() => {
    if (themeLayout) {
      document.body.classList.add("dark");
      config.config.layout_version = "dark";
    } else {
      document.body.classList.remove("dark");
      config.config.layout_version = "light";
    }
  }, [themeLayout]);

  /*=====================
     Component صغير
  ==========================*/
  const MasterComponent = ({ ribon, bg, name, link, btnName }) => {
    return (
      <Col sm="6" className="text-center demo-effects">
        <div className="set-position">
          <div className={`layout-container ${bg}`}>
            {ribon && (
              <div className="ribbon-1">
                <span>n</span>
                <span>e</span>
                <span>w</span>
              </div>
            )}
          </div>

          <div className="demo-text">
            <h4>{name}</h4>
            <div className="btn-group demo-btn">
              <Link href={link} className="btn new-tab-btn">
                {btnName}
              </Link>
            </div>
          </div>
        </div>
      </Col>
    );
  };

  return (
    <div>
      {/* مثال زرار Dark Mode لو عايز ترجعه */}
      {/* 
      <div className="sidebar-btn dark-light-btn">
        <div className="dark-light">
          <div onClick={changeThemeLayout}>
            {themeLayout ? "Light" : "Dark"}
          </div>
        </div>
      </div>
      */}

      <ToastContainer />
    </div>
  );
};

export default ThemeSettings;
