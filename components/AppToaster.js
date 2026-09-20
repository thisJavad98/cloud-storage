"use client";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function AppToaster() {
  return (
    <ToastContainer
      position="top-center"
      autoClose={3500}
      hideProgressBar={false}
      newestOnTop
      closeOnClick
      rtl
      pauseOnFocusLoss
      draggable
      pauseOnHover
      theme="colored"
      limit={3}
      toastClassName="cs-toast"
      bodyClassName="cs-toast-body"
    />
  );
}
