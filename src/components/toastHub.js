// components/ToastHub.jsx
import React from "react";
import { ToastContainer } from "react-toastify";
import { useLanguage } from "../helpers/Language/useLanguage";

export default function ToastHub() {
  const { isRTL } = useLanguage();
  return (
    <ToastContainer
      position={isRTL ? "top-left" : "top-right"}
      rtl={!!isRTL}
      theme="light"
      newestOnTop
      closeOnClick
      pauseOnHover
      draggable
      autoClose={3500}
    />
  );
}
