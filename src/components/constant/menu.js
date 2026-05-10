// constants/menu.js (أو ../../constant/menu)
export const MENUITEMS = [
  {
    titleKey: "menu.home",
    title: "Home",
    type: "link",
    path: "/",
  },
  {
    titleKey: "menu.shop",
    title: "Shop",
    type: "link",
    path: "/shop/sidebar_popup",
  },
  {
    path: "/page/about-us",
    titleKey: "menu.aboutUs",
    title: "About Us",
    type: "link",
  },

 {
    titleKey: "menu.blogs",
    title: "Blogs",
    type: "link",
    path: "/blogs/blog_right_sidebar",
  },
  {
    titleKey: "menu.contact",
    title: "Contact",
    type: "link",
    path: "/page/account/contact",
  },
  {
    titleKey: "menu.pages",
    title: "Pages",
    type: "sub",
    children: [


      {
        path: "/page/account/wishlist",
        titleKey: "menu.wishlist",
        title: "Wishlist",
        type: "link",
      },
      {
        path: "/page/account/cart",
        titleKey: "menu.cart",
        title: "Cart",
        type: "link",
      },
      {
        path: "/page/account/dashboard",
        titleKey: "menu.dashboard",
        title: "Dashboard",
        type: "link",
      },
      {
        path: "/page/account/forget-pwd",
        titleKey: "menu.forgotPassword",
        title: "Forgot Password",
        type: "link",
      },
      {
        path: "/page/account/profile",
        titleKey: "menu.profile",
        title: "Profile",
        type: "link",
      },
      {
        path: "/page/account/checkout",
        titleKey: "menu.checkout",
        title: "Checkout",
        type: "link",
      },



    ],
  },

 
];
