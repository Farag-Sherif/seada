import React, { useState, useEffect, Fragment } from "react";
import Link from "@/router/NextLinkCompat";
import { MENUITEMS } from "../../constant/menu";
import { Container, Row } from "reactstrap";

const SideMenu = () => {
  const [navClose, setNavClose] = useState({ right: "0px" });

  useEffect(() => {
    if (window.innerWidth < 750) setNavClose({ right: "-410px" });
    if (window.innerWidth < 1199) setNavClose({ right: "-300px" });
  }, []);

  const openNav = () => setNavClose({ right: "0px" });
  const closeNav = () => setNavClose({ right: "-410px" });

  const onMouseEnterHandler = () => {
    if (window.innerWidth > 1199) {
      document.querySelector("#main-menu")?.classList.add("hover-unset");
    }
  };

  const handleMegaSubmenu = (event) => {
    if (event.target.classList.contains("sub-arrow")) return;
    const content = event.target.closest(".menu-title")?.nextElementSibling;
    if (!content) return;
    content.classList.toggle("opensubmegamenu");
  };

  const handleSubmenu = (event) => {
    if (!event.target.classList.contains("sub-arrow")) return;
    const next = event.target.nextElementSibling;
    if (!next) return;
    const open = "opensubmenu";
    if (next.classList.contains(open)) {
      next.classList.remove(open);
    } else {
      document.querySelectorAll(".nav-submenu").forEach((n) => n.classList.remove(open));
      document.querySelector(".mega-menu-container")?.classList.remove(open);
      next.classList.add(open);
    }
  };

  const [mainmenu, setMainMenu] = useState(MENUITEMS);

  useEffect(() => {
    const currentUrl = location.pathname;
    MENUITEMS.forEach((items) => {
      if (items.path === currentUrl) setNavActive(items);
      items.children?.forEach((subItems) => {
        if (subItems.path === currentUrl) setNavActive(subItems);
        subItems.children?.forEach((subSubItems) => {
          if (subSubItems.path === currentUrl) setNavActive(subSubItems);
        });
      });
    });
  }, []);

  const setNavActive = (item) => {
    MENUITEMS.forEach((menuItem) => {
      if (menuItem !== item) menuItem.active = false;
      if (menuItem.children?.includes(item)) menuItem.active = true;
      menuItem.children?.forEach((submenuItems) => {
        if (submenuItems.children?.includes(item)) {
          menuItem.active = true;
          submenuItems.active = true;
        }
      });
    });
    item.active = !item.active;
    setMainMenu({ mainmenu: MENUITEMS });
  };

  const toggletNavActive = (item) => {
    if (!item.active) {
      MENUITEMS.forEach((a) => {
        if (MENUITEMS.includes(item)) a.active = false;
        a.children?.forEach((b) => {
          if (a.children.includes(item)) b.active = false;
          b.children?.forEach((c) => {
            if (b.children.includes(item)) c.active = false;
          });
        });
      });
    }
    item.active = !item.active;
    setMainMenu({ mainmenu: MENUITEMS });
  };

  return (
    <Fragment>
      <ul id="sub-menu" className="sm pixelstrap sm-vertical side-nav sleek">
        {MENUITEMS.map((menuItem, i) => (
          <li key={i} className={`${menuItem.megaMenu ? "mega-menu" : ""}`}>
            <a className="nav-link nav-trigger" onClick={openMblNav}>
              {menuItem.title}
              <span className="sub-arrow" aria-hidden="true" />
            </a>

            {menuItem.children && !menuItem.megaMenu ? (
              <ul className="nav-submenu">
                {menuItem.children.map((childrenItem, index) => (
                  <li key={index} className={`${childrenItem.children ? "sub-menu" : ""}`}>
                    {childrenItem.type === "sub" && (
                      <button
                        type="button"
                        className="nav-subtrigger"
                        onClick={() => toggletNavActive(childrenItem)}
                      >
                        {childrenItem.title}
                        <i className="fa fa-angle-right ps-2" />
                      </button>
                    )}

                    {childrenItem.type === "link" && (
                      <Link href={childrenItem.path} className="nav-sublink">
                        {childrenItem.title}
                      </Link>
                    )}

                    {childrenItem.children && (
                      <ul className={`nav-sub-childmenu ${childrenItem.active ? "menu-open" : "active"}`}>
                        {childrenItem.children.map((childrenSubItem, key) => (
                          <li key={key}>
                            {childrenSubItem.type === "link" && (
                              <Link href={childrenSubItem.path} className="sub-menu-title">
                                {childrenSubItem.title}
                              </Link>
                            )}
                          </li>
                        ))}
                      </ul>
                    )}
                  </li>
                ))}
              </ul>
            ) : (
              <div className={`mega-menu-container ${menuItem.active ? "opensubmenu" : ""}`}>
                {menuItem.megaMenu === true && (
                  <Container>
                    <Row>
                      {menuItem.children.map((megaMenuItem, idx) => (
                        <div
                          key={idx}
                          className={
                            menuItem.megaMenuType === "small"
                              ? "col-xl-4"
                              : menuItem.megaMenuType === "medium"
                              ? "col-lg-3"
                              : menuItem.megaMenuType === "large"
                              ? "col"
                              : "col"
                          }
                        >
                          <div className="link-section">
                            <div className="menu-title">
                              <h5 onClick={handleMegaSubmenu}>{megaMenuItem.title}</h5>
                            </div>
                            <div className="menu-content">
                              <ul>
                                {megaMenuItem.children.map((sub, k) => (
                                  <li key={k}>
                                    <Link href={sub.path} className="mega-link">
                                      {menuItem.title === "Elements" && <i className={`icon-${sub.icon}`} />}
                                      {sub.title}
                                    </Link>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        </div>
                      ))}
                    </Row>
                  </Container>
                )}
              </div>
            )}
          </li>
        ))}
      </ul>
    </Fragment>
  );

  function openMblNav(event) {
    if (event.target.classList.contains("sub-arrow")) return;

    const sib = event.currentTarget.nextElementSibling;
    if (!sib) return;

    const open = "opensubmenu";
    if (sib.classList.contains(open)) {
      sib.classList.remove(open);
    } else {
      document.querySelectorAll(".nav-submenu").forEach((n) => n.classList.remove(open));
      document.querySelector(".mega-menu-container")?.classList.remove(open);
      sib.classList.add(open);
    }
  }
};

export default SideMenu;
